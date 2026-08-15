// src/components/AIChat.jsx
import { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../services/api';

const SUGGESTIONS = [
  'Where am I overspending?',
  'How can I save more?',
  'What is my biggest expense?',
  'Am I on track this month?',
];

export default function AIChat({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: "Hi! I'm your SmartBudget AI assistant. Ask me anything about your spending or finances 💰" },
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text) {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build history from current messages (exclude the initial greeting)
      const history = messages
        .slice(1) // skip the greeting
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await aiAPI.chat(userText, history);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', text: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: "Sorry, I couldn't reach the AI right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-[calc(100vw-2rem)] max-w-sm h-[460px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a202c] dark:bg-gray-800 text-white rounded-t-2xl shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <p className="font-bold text-sm">AI Assistant</p>
            <p className="text-xs text-green-400">● Powered by Gemini</p>
          </div>
        </div>
        <button onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-sm">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-gray-900">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
              ${msg.role === 'user'
                ? 'bg-[#1a202c] dark:bg-[#00d09c] dark:text-gray-900 text-white rounded-br-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions — show on first open */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0 bg-white dark:bg-gray-900">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => sendMessage(s)}
              className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 pb-3 shrink-0 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#00d09c] transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your budget..."
            className="flex-1 bg-transparent px-3 py-3 text-sm outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="mr-2 w-8 h-8 bg-[#00d09c] hover:bg-[#00b386] disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-colors shrink-0">
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
