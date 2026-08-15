// src/components/AIChat.jsx
import { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  'Where am I overspending?',
  'How can I save more?',
  'What is my biggest expense?',
  'Am I on track this month?',
];

function getBotReply(message) {
  const msg = message.toLowerCase();
  if (msg.includes('overspend') || msg.includes('over budget'))
    return "Based on your data, Entertainment and Shopping are closest to their limits. Consider trimming dining out to stay on track.";
  if (msg.includes('save') || msg.includes('saving'))
    return "You have $1,152.50 remaining this month. If you cut discretionary spending by 15%, you could save an extra $425!";
  if (msg.includes('biggest') || msg.includes('largest'))
    return "Your biggest expense category this month is Food & Dining at $820, followed by Shopping at $640.";
  if (msg.includes('track') || msg.includes('budget'))
    return "You're at 71% of your monthly budget with about 16 days left. Try to keep daily spending under $72.";
  return "I'm your AI budget assistant! Ask me about your spending, savings tips, or budget health.";
}

export default function AIChat({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: "Hi! I'm your SmartBudget AI assistant. Ask me anything about your spending or finances 💰" },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText) return;
    setInput('');
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: userText }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'bot', text: getBotReply(userText) }]);
      setLoading(false);
    }, 800);
  }

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-[calc(100vw-2rem)] max-w-sm h-[460px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a202c] dark:bg-gray-800 text-white rounded-t-2xl shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <p className="font-bold text-sm">AI Assistant</p>
            <p className="text-xs text-gray-400">Always here to help</p>
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
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed
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

      {/* Suggestions */}
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
