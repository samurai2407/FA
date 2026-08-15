// src/components/RecentTransactions.jsx
import { useState } from 'react';

export default function RecentTransactions({ transactions = [], onDelete }) {
  const [confirmId, setConfirmId] = useState(null);
  const recent = transactions.slice(0, 8);

  function handleDelete(id) {
    onDelete?.(id);
    setConfirmId(null);
  }

  return (
    <div className="mt-6 lg:mt-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recent Transactions</h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">{transactions.length} total</span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
        {recent.length === 0 && (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
            <div className="text-3xl mb-2">🧾</div>
            No transactions yet
          </div>
        )}
        {recent.map((tx) => (
          <div key={tx.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-lg shrink-0">
                {tx.icon}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{tx.title}</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500">{tx.category} · {tx.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
                -${tx.amount.toFixed(2)}
              </span>
              {confirmId === tx.id ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDelete(tx.id)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors">
                    Delete
                  </button>
                  <button onClick={() => setConfirmId(null)}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmId(tx.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-600 hover:text-red-400 transition-all text-lg leading-none"
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
