// src/components/RecentTransactions.jsx
import { useState } from 'react';
import { currencySymbol } from '../utils/currency';

export default function RecentTransactions({ transactions = [], onDelete, currency }) {
  const sym = currencySymbol(currency);
  const [confirmId, setConfirmId] = useState(null);
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  function handleDelete(id) {
    onDelete?.(id);
    setConfirmId(null);
  }

  return (
    <div className="mt-5 lg:mt-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-white tracking-tight">Transactions</h3>
        <span className="text-xs text-[#A3A3A3] bg-white/5 px-3 py-1 rounded-full">{transactions.length} total</span>
      </div>

      <div className="bg-[#151515] rounded-[24px] overflow-hidden divide-y divide-white/5">
        {recent.length === 0 && (
          <div className="p-8 text-center text-[#A3A3A3] text-sm">
            <div className="text-3xl mb-2">🧾</div>
            No transactions yet
          </div>
        )}
        {recent.map((tx) => (
          <div key={tx.id}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 bg-[#1C1C1E] rounded-2xl flex items-center justify-center text-xl shrink-0 border border-white/5">
                {tx.icon}
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm text-white truncate">{tx.title}</h4>
                <p className="text-xs text-[#A3A3A3] mt-0.5">{tx.category} · {tx.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-sm text-white">
                -{sym}{tx.amount.toFixed(2)}
              </span>
              {confirmId === tx.id ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDelete(tx.id)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors">
                    Delete
                  </button>
                  <button onClick={() => setConfirmId(null)}
                    className="text-xs bg-white/10 text-[#A3A3A3] px-2 py-1 rounded-lg hover:bg-white/20 transition-colors">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmId(tx.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all text-xl leading-none"
                  aria-label="Delete transaction">
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
