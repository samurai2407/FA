// src/components/BudgetSummary.jsx

export default function BudgetSummary({ totalSpent, monthlyBudget }) {
  // 1. Calculate the missing numbers automatically
  const remaining = monthlyBudget - totalSpent;
  const percentageSpent = Math.round((totalSpent / monthlyBudget) * 100);

  // 2. Return the visual layout (JSX)
  return (
    <div className="bg-[#1a202c] text-white p-6 rounded-2xl flex justify-between items-center">
      
      <div>
        <p className="text-gray-400 text-sm mb-1">Total Spent This Month</p>
        <h1 className="text-4xl font-bold mb-4">${totalSpent.toFixed(2)}</h1>
        
        <p className="text-sm text-gray-400">
          Monthly Budget: <span className="text-white">${monthlyBudget.toFixed(0)}</span>
        </p>
        <p className="text-sm text-[#00d09c] mt-1">
          Remaining: ${remaining.toFixed(2)}
        </p>
      </div>

      <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-[#00d09c]">
         <span className="font-bold">{percentageSpent}%</span>
      </div>

    </div>
  );
}