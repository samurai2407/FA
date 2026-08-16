// src/components/BudgetSummary.jsx
import { formatAmount } from '../utils/currency';

export default function BudgetSummary({ totalSpent, monthlyBudget, currency }) {
  const remaining       = monthlyBudget - totalSpent;
  const percentageSpent = Math.round((totalSpent / monthlyBudget) * 100);
  const barWidth        = Math.min(percentageSpent, 100);
  const overBudget      = remaining < 0;

  return (
    <div className="bg-[#4B58FF] text-white p-6 md:p-8 rounded-[28px] relative overflow-hidden">

      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-10 -right-2 w-28 h-28 bg-white/5 rounded-full" />

      <div className="relative flex justify-between items-start">
        <div>
          <p className="text-white/60 text-sm mb-1 font-medium">Total Spent This Month</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {formatAmount(totalSpent, currency)}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-white/60">
              Budget: <span className="text-white font-semibold">{formatAmount(monthlyBudget, currency, 0)}</span>
            </p>
            <p className={`font-semibold ${overBudget ? 'text-red-300' : 'text-[#75F97D]'}`}>
              {overBudget
                ? `Over by ${formatAmount(Math.abs(remaining), currency)}`
                : `Remaining: ${formatAmount(remaining, currency)}`}
            </p>
          </div>
        </div>

        <div className={`relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full border-4 shrink-0
          ${overBudget ? 'border-red-300 bg-white/10' : 'border-[#75F97D] bg-white/10'}`}>
          <span className="font-bold text-sm md:text-base">{percentageSpent}%</span>
        </div>
      </div>

      <div className="relative mt-5 w-full bg-white/20 h-2 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all"
          style={{ width: `${barWidth}%`, background: overBudget ? '#fca5a5' : '#75F97D' }} />
      </div>

    </div>
  );
}
