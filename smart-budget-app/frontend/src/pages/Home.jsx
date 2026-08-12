import { useState } from 'react';
import BudgetSummary from '../components/BudgetSummary';
import CategorySpending from '../components/CategorySpending';
import RecentTransactions from '../components/RecentTransactions';
import AIChatButton from '../components/AIChatButton';

export default function App() {
  const [userName, setUserName] = useState("Alex");
  
  // 1. Added the state for our chat window (starts closed)
  const [isChatOpen, setIsChatOpen] = useState(false);

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

      {/* 2. We pass a function to the button so it can change the state to true */}
      <div onClick={() => setIsChatOpen(true)}>
        <AIChatButton />
      </div>

      {/* 3. The && trick! This box ONLY appears if isChatOpen is true */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 p-4">
          <p>Chat window goes here!</p>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      )}

    </div>
  );
}