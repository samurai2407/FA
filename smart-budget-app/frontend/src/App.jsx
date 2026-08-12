import { useState } from 'react';
import BudgetSummary from './components/BudgetSummary';
import CategorySpending from './components/CategorySpending';
import RecentTransactions from './components/RecentTransactions';
import AIChatButton from './components/AIChatButton'; // Import the button

export default function App() {
  const [userName, setUserName] = useState("Alex");

  return (
    <div className="p-4 font-sans bg-gray-50 min-h-screen relative">
      
      <div className="mb-6">
        <p className="text-gray-500 text-sm">Welcome back</p>
        <h2 className="text-xl font-bold">Good morning, {userName}</h2>
      </div>

      <BudgetSummary totalSpent={2847.50} monthlyBudget={4000} />
      
      <div className="mt-8">
        <CategorySpending />
      </div>

      <RecentTransactions />

      {/* Place the button here so it floats over everything */}
      <AIChatButton />

    </div>
  );
}