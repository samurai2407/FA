// src/pages/Home.jsx
import { useState } from 'react';
import BudgetSummary      from '../components/BudgetSummary';
import CategorySpending   from '../components/CategorySpending';
import RecentTransactions from '../components/RecentTransactions';
import AIChatButton       from '../components/AIChatButton';
import AIChat             from '../components/AIChat';
import { useAuth }        from '../context/AuthContext';

export default function Home({ user, totalSpent, categories, transactions, deleteTransaction }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user: authUser } = useAuth();
  const currency = user?.currency || 'USD';
  const userId = authUser?._id || authUser?.id;

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen">

      {/* Header */}
      <div className="mb-6 md:mb-8 mt-2 md:mt-0">
        <p className="text-[#A3A3A3] text-sm">Welcome back</p>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <BudgetSummary totalSpent={totalSpent} monthlyBudget={user?.monthlyBudget} currency={currency} />
          <CategorySpending categories={categories} currency={currency} />
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions transactions={transactions} onDelete={deleteTransaction} currency={currency} />
        </div>
      </div>

      <AIChatButton onClick={() => setIsChatOpen(true)} />
      {isChatOpen && <AIChat onClose={() => setIsChatOpen(false)} userId={userId} />}
    </div>
  );
}
