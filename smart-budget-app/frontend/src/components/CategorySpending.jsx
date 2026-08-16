// src/components/CategorySpending.jsx
import { useState } from 'react';
import { currencySymbol } from '../utils/currency';

export default function CategorySpending({ categories = [], currency }) {
  const sym = currencySymbol(currency);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-white tracking-tight">Category Spending</h3>
        <button onClick={() => setIsOpen(true)}
          className="text-[#75F97D] text-sm font-medium hover:text-[#5ee066] transition-colors">
          View all
        </button>
      </div>

      <div className="bg-[#151515] p-5 rounded-[24px] space-y-4 border border-white/5">
        {categories.map((cat) => {
          const pct        = cat.limit ? Math.min(Math.round((cat.spent / cat.limit) * 100), 100) : null;
          const overBudget = cat.limit && cat.spent > cat.limit;
          return (
            <div key={cat.name}>
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span className="font-medium text-white/80">{cat.name}</span>
                </div>
                <span>
                  <strong className={overBudget ? 'text-red-400' : 'text-white'}>
                    {sym}{cat.spent.toFixed(2)}
                  </strong>
                  {cat.limit && (
                    <span className="text-[#A3A3A3]"> / {sym}{cat.limit.toFixed(2)}</span>
                  )}
                </span>
              </div>
              {pct !== null && (
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: overBudget ? '#f87171' : cat.color }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Breakdown modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#151515] rounded-[28px] shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-[#151515] px-6 py-4 border-b border-white/5 flex justify-between items-center rounded-t-[28px]">
              <h2 className="text-lg font-bold text-white">Category Breakdown</h2>
              <button onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#A3A3A3] transition-colors text-sm">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              {categories.slice().sort((a, b) => b.spent - a.spent).map((cat) => {
                const pct        = cat.limit ? Math.min(Math.round((cat.spent / cat.limit) * 100), 100) : 0;
                const overBudget = cat.limit && cat.spent > cat.limit;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: cat.color }} />
                        <span className="font-medium text-sm text-white/80">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-sm ${overBudget ? 'text-red-400' : 'text-white'}`}>
                          {sym}{cat.spent.toFixed(2)}
                        </span>
                        {cat.limit && (
                          <span className="text-xs text-[#A3A3A3] ml-1">/ {sym}{cat.limit.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    {cat.limit && (
                      <>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: overBudget ? '#f87171' : cat.color }} />
                        </div>
                        <div className="flex justify-between mt-1.5">
                          <span className="text-xs text-[#A3A3A3]">{pct}% used</span>
                          {overBudget
                            ? <span className="text-xs text-red-400 font-medium">Over by {sym}{(cat.spent - cat.limit).toFixed(2)}</span>
                            : <span className="text-xs text-[#75F97D]">{sym}{(cat.limit - cat.spent).toFixed(2)} left</span>
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
