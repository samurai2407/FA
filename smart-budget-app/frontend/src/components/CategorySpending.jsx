// src/components/CategorySpending.jsx
import { useState } from 'react'; // 1. We have to import useState at the top!

export default function CategorySpending() {
  // 2. Add our new state variable
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  const categories = [
    { name: 'Food & Dining', spent: 820, limit: 1000, color: 'bg-[#00d09c]' },
    { name: 'Transportation', spent: 340, limit: 500, color: 'bg-blue-500' },
    { name: 'Entertainment', spent: 450, limit: 600, color: 'bg-purple-500' },
    { name: 'Shopping', spent: 640, color: 'bg-orange-500' }, 
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Category Spending</h3>
        <button 
          // 3. Change state to true when clicked
          onClick={() => setIsBreakdownOpen(true)} 
          className="text-[#00d09c] text-sm font-medium hover:underline"
        >
          View breakdown
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {categories.map((category, index) => {
          const hasLimit = category.limit !== undefined;
          const progressPercentage = hasLimit ? Math.round((category.spent / category.limit) * 100) : 0;

          return (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold">{category.name}</span>
                <span>
                  <strong>${category.spent}</strong> 
                  {hasLimit && <span className="text-gray-400"> of ${category.limit}</span>}
                </span>
              </div>
              
              {hasLimit && (
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${category.color} rounded-full`} 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. The && trick to show the breakdown overlay! */}
      {isBreakdownOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Detailed Breakdown</h2>
            <p className="text-gray-600 mb-6">More charts and details will go here!</p>
            <button 
              onClick={() => setIsBreakdownOpen(false)}
              className="bg-[#00d09c] text-white px-4 py-2 rounded-lg font-medium w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}