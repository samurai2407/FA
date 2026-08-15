// src/components/CategorySpending.jsx
import { useState } from 'react';

export default function CategorySpending({ categories = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Category Spending</h3>
        <button onClick={() => setIsOpen(true)}
          className="text-[#00d09c] text-sm font-medium hover:underline">
          View all
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
        {categories.map((cat) => {
          const pct      = cat.limit ? Math.min(Math.round((cat.spent / cat.limit) * 100), 100) : null;
          const overBudget = cat.limit && cat.spent > cat.limit;
          return (
            <div key={cat.name}>
              <div className="flex justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                </div>
                <span>
                  <strong className={overBudget ? 'text-red-500' : 'text-gray-900 dark:text-white'}>${cat.spent}</strong>
                  {cat.limit && <span className="text-gray-400 dark:text-gray-500"> / ${cat.limit}</span>}
                </span>
              </div>
              {pct !== null && (
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: overBudget ? '#ef4444' : cat.color }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Breakdown modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto border border-transparent dark:border-gray-800">
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Category Breakdown</h2>
              <button onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              {categories.slice().sort((a, b) => b.spent - a.spent).map((cat) => {
                const pct      = cat.limit ? Math.min(Math.round((cat.spent / cat.limit) * 100), 100) : 0;
                const overBudget = cat.limit && cat.spent > cat.limit;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: cat.color }} />
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-sm ${overBudget ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                          ${cat.spent.toLocaleString()}
                        </span>
                        {cat.limit && <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">/ ${cat.limit.toLocaleString()}</span>}
                      </div>
                    </div>
                    {cat.limit && (
                      <>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: overBudget ? '#ef4444' : cat.color }} />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500">{pct}% used</span>
                          {overBudget
                            ? <span className="text-xs text-red-400 font-medium">Over by ${(cat.spent - cat.limit).toLocaleString()}</span>
                            : <span className="text-xs text-gray-400 dark:text-gray-500">${(cat.limit - cat.spent).toLocaleString()} left</span>
                          }
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
