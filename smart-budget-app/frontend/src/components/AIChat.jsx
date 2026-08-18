// src/components/AIChat.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { aiAPI } from '../services/api';

const SUGGESTIONS = [
  'Where am I overspending?',
  'How can I save more?',
  'What is my biggest expense?',
  'Am I on track this month?',
];

const GREETING = {
  id: 0,
  role: 'bot',
  text: "Hi! I'm your SmartBudget AI assistant. Ask me anything about your spending or finances 💰",
};

function storageKey(userId) {
  return `ai_chat_history_${userId || 'guest'}`;
}

function loadHistory(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [GREETING];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [GREETING];
  } catch {
    return [GREETING];
  }
}

function saveHistory(userId, messages) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(messages.slice(-100)));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

export default function AIChat({ onClose, userId }) {
  const [messages, setMessages] = useState(() => loadHistory(userId));
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef               = useRef(null);

  // Persist whenever messages change
  useEffect(() => {
    saveHistory(userId, messages);
  }, [messages, userId]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const clearHistory = useCallback(() => {
    const fresh = [GREETING];
    setMessages(fresh);
    saveHistory(userId, fresh);
  }, [userId]);

  async function sendMessage(text) {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build history for Gemini — skip the greeting (id === 0)
      const history = messages
        .filter((m) => m.id !== 0)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await aiAPI.chat(userText, history);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', text: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', text: `Sorry, something went wrong: ${err.message || 'please try again in a moment.'}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-[calc(100vw-2rem)] max-w-sm h-[460px] bg-[#111111] rounded-[28px] shadow-2xl shadow-black/60 border border-white/10 z-50 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#151515] border-b border-white/5 rounded-t-[28px] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4B58FF] rounded-xl flex items-center justify-center text-base">🤖</div>
          <div>
            <p className="font-bold text-sm text-white">AI Assistant</p>
            <p className="text-xs text-[#75F97D]">● Powered by Gemini</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 1 && (
            <button onClick={clearHistory}
              title="Clear chat history"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-xs">
              🗑️
            </button>
          )}
          <button onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-sm text-[#A3A3A3] hover:text-white">
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-scroll flex-1 overflow-y-auto p-4 space-y-3 bg-[#111111]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-[#4B58FF] text-white rounded-br-sm'
                : 'bg-[#1C1C1E] text-white/80 rounded-bl-sm border border-white/5'}`}>
              {msg.role === 'user' ? msg.text : (
                <ReactMarkdown
                  components={{
                    p:      ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                    ul:     ({ children }) => <ul className="list-disc pl-4 mb-1 space-y-0.5">{children}</ul>,
                    ol:     ({ children }) => <ol className="list-decimal pl-4 mb-1 space-y-0.5">{children}</ol>,
                    li:     ({ children }) => <li>{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    h1:     ({ children }) => <p className="font-bold mb-1 text-white">{children}</p>,
                    h2:     ({ children }) => <p className="font-bold mb-1 text-white">{children}</p>,
                    h3:     ({ children }) => <p className="font-semibold mb-0.5 text-white">{children}</p>,
                    hr:     () => <hr className="my-1 border-white/10" />,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1C1C1E] border border-white/5 px-3.5 py-2.5 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-[#A3A3A3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#A3A3A3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#A3A3A3] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions — only on fresh chat */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0 bg-[#111111]">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => sendMessage(s)}
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-[#A3A3A3] hover:text-white px-3 py-1.5 rounded-full transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 pb-3 shrink-0 bg-[#111111]">
        <div className="flex items-center gap-2 bg-[#1C1C1E] border border-white/10 rounded-2xl overflow-hidden focus-within:border-[#4B58FF] transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your budget..."
            className="flex-1 bg-transparent px-3 py-3 text-sm outline-none text-white placeholder-[#A3A3A3]"
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="mr-2 w-8 h-8 bg-[#4B58FF] hover:bg-[#3a46e0] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shrink-0">
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
