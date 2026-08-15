// src/hooks/useBudgetData.js
// Central data hook — all pages pull from this one place.
// Right now it returns hardcoded mock data.
// To connect the backend: swap the mock objects for real API calls
// inside the useEffect, keeping the same state shape.

import { useState, useEffect } from 'react';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: null,
  currency: 'USD',
  monthlyBudget: 4000,
};

const MOCK_TRANSACTIONS = [
  { id: 1,  title: 'Whole Foods',    category: 'Groceries',      date: '2026-08-11', amount: 54.30,  icon: '🛒' },
  { id: 2,  title: 'Uber',           category: 'Transportation',  date: '2026-08-10', amount: 18.75,  icon: '🚗' },
  { id: 3,  title: 'Netflix',        category: 'Entertainment',   date: '2026-08-09', amount: 15.99,  icon: '🎬' },
  { id: 4,  title: 'Target',         category: 'Shopping',        date: '2026-08-08', amount: 87.20,  icon: '🛍️' },
  { id: 5,  title: 'Starbucks',      category: 'Food & Dining',   date: '2026-08-07', amount: 12.50,  icon: '☕' },
  { id: 6,  title: 'Amazon',         category: 'Shopping',        date: '2026-08-06', amount: 134.99, icon: '📦' },
  { id: 7,  title: 'Gas Station',    category: 'Transportation',  date: '2026-08-05', amount: 55.00,  icon: '⛽' },
  { id: 8,  title: 'Gym Membership', category: 'Health',          date: '2026-08-04', amount: 49.99,  icon: '💪' },
  { id: 9,  title: 'Spotify',        category: 'Entertainment',   date: '2026-08-03', amount: 9.99,   icon: '🎵' },
  { id: 10, title: 'Restaurant',     category: 'Food & Dining',   date: '2026-08-02', amount: 67.80,  icon: '🍽️' },
];

const MOCK_CATEGORIES = [
  { name: 'Food & Dining',   spent: 820,  limit: 1000, color: '#00d09c' },
  { name: 'Transportation',  spent: 340,  limit: 500,  color: '#3b82f6' },
  { name: 'Entertainment',   spent: 450,  limit: 600,  color: '#a855f7' },
  { name: 'Shopping',        spent: 640,  limit: 800,  color: '#f97316' },
  { name: 'Health',          spent: 200,  limit: 300,  color: '#ec4899' },
  { name: 'Groceries',       spent: 397,  limit: 500,  color: '#eab308' },
];

const MOCK_MONTHLY_TREND = [
  { month: 'Mar', spent: 2900 },
  { month: 'Apr', spent: 3200 },
  { month: 'May', spent: 2700 },
  { month: 'Jun', spent: 3500 },
  { month: 'Jul', spent: 3100 },
  { month: 'Aug', spent: 2847 },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useBudgetData() {
  const [user, setUser]               = useState(MOCK_USER);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [categories, setCategories]   = useState(MOCK_CATEGORIES);
  const [monthlyTrend]                = useState(MOCK_MONTHLY_TREND);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  // TODO: replace with real API calls
  // useEffect(() => {
  //   setLoading(true);
  //   Promise.all([
  //     budgetAPI.getSummary(),
  //     budgetAPI.getCategories(),
  //     transactionsAPI.getAll(),
  //   ]).then(([summary, cats, txs]) => {
  //     setUser(summary.data);
  //     setCategories(cats.data);
  //     setTransactions(txs.data);
  //   }).catch(setError).finally(() => setLoading(false));
  // }, []);

  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  function addTransaction(tx) {
    const newTx = { ...tx, id: Date.now() };
    setTransactions((prev) => [newTx, ...prev]);
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }

  function updateUser(data) {
    setUser((prev) => ({ ...prev, ...data }));
  }

  function updateCategory(name, updates) {
    setCategories((prev) =>
      prev.map((cat) => (cat.name === name ? { ...cat, ...updates } : cat))
    );
  }

  return {
    user,
    transactions,
    categories,
    monthlyTrend,
    totalSpent,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateUser,
    updateCategory,
  };
}
