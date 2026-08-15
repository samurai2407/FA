// src/components/BudgetSummary.jsx
export default function BudgetSummary({ totalSpent, monthlyBudget }) {
  const remaining       = monthlyBudget - totalSpent;
  const percentageSpent = Math.round((totalSpent / monthlyBudget) * 100);
  const barWidth        = Math.min(percentageSpent, 100);
  const overBudget      = remaining < 0;

  return (
    <div className="bg-[#1a202c] dark:bg-gray-900 dark:border dark:border-gray-800 text-white p-6 md:p-8 rounded-2xl">

      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm mb-1">Total Spent This Month</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">${totalSpent.toFixed(2)}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="text-gray-400">
              Budget: <span className="text-white font-medium">${monthlyBudget.toFixed(0)}</span>
            </p>
            <p className={`font-medium ${overBudget ? 'text-red-400' : 'text-[#00d09c]'}`}>
              {overBudget ? `Over by $${Math.abs(remaining).toFixed(2)}` : `Remaining: $${remaining.toFixed(2)}`}
            </p>
          </div>
        </div>

        <div className={`relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full border-4 shrink-0
          ${overBudget ? 'border-red-400' : 'border-[#00d09c]'}`}>
          <span className="font-bold text-sm md:text-base">{percentageSpent}%</span>
        </div>
      </div>

      <div className="mt-5 w-full bg-white/10 h-2 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all"
          style={{ width: `${barWidth}%`, background: overBudget ? '#f87171' : '#00d09c' }} />
      </div>

    </div>
  );
}
