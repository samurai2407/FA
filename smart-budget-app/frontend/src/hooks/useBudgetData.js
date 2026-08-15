// src/hooks/useBudgetData.js
// All data now comes from the real backend API.
import { useState, useEffect, useCallback } from 'react';
import { budgetAPI, transactionsAPI, analyticsAPI, profileAPI } from '../services/api.js';

export function useBudgetData() {
  const [user,         setUser]         = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // Derived: sum all transactions (the backend also returns this in /budget/summary,
  // but we keep it local so optimistic UI updates feel instant)
  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, categoriesRes, txRes, trendRes] = await Promise.all([
        budgetAPI.getSummary(),
        budgetAPI.getCategories(),
        transactionsAPI.getAll({ limit: 100 }),
        analyticsAPI.getMonthlyTrend(),
      ]);

      // /budget/summary returns user fields + totalSpent + remaining
      setUser({
        name:          summaryRes.data.name,
        email:         summaryRes.data.email,
        currency:      summaryRes.data.currency,
        monthlyBudget: summaryRes.data.monthlyBudget,
        avatar:        summaryRes.data.avatar || null,
      });

      setCategories(categoriesRes.data);

      // Normalise: backend uses _id, frontend uses id
      setTransactions(
        txRes.data.transactions.map((t) => ({
          ...t,
          id:   t._id,
          date: t.date?.slice(0, 10) ?? t.date, // ISO → YYYY-MM-DD
        }))
      );

      setMonthlyTrend(trendRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── Mutations ──────────────────────────────────────────────────────────────

  async function addTransaction(tx) {
    const res = await transactionsAPI.create(tx);
    const created = { ...res.data, id: res.data._id, date: res.data.date?.slice(0, 10) };
    // Optimistic prepend + re-fetch categories (spending totals changed)
    setTransactions((prev) => [created, ...prev]);
    // Refresh categories/summary silently so spending bars update
    Promise.all([budgetAPI.getCategories(), budgetAPI.getSummary()]).then(([cats, summary]) => {
      setCategories(cats.data);
      setUser((u) => ({ ...u, monthlyBudget: summary.data.monthlyBudget }));
    }).catch(() => {});
  }

  async function deleteTransaction(id) {
    // Optimistic remove
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    try {
      await transactionsAPI.delete(id);
      // Refresh category spending silently
      budgetAPI.getCategories().then((r) => setCategories(r.data)).catch(() => {});
    } catch (err) {
      // Rollback on failure
      fetchAll();
      throw err;
    }
  }

  const updateUser = useCallback(async (data) => {
    const res = await profileAPI.update(data);
    const updated = res.data;
    setUser((prev) => ({ ...prev, ...updated }));
    // Re-fetch summary so monthlyBudget changes reflect in the budget bar
    budgetAPI.getSummary().then((r) => {
      setUser((u) => ({ ...u, monthlyBudget: r.data.monthlyBudget, currency: r.data.currency }));
    }).catch(() => {});
    return updated;
  }, []);

  const updateCategoryLimits = useCallback(async (categoryLimits) => {
    // categoryLimits: [{ name, limit }, ...]
    const res = await budgetAPI.updateCategories({ categories: categoryLimits });
    setCategories(res.data);
    return res.data;
  }, []);

  return {
    user,
    transactions,
    categories,
    monthlyTrend,
    totalSpent,
    loading,
    error,
    refetch: fetchAll,
    addTransaction,
    deleteTransaction,
    updateUser,
    updateCategoryLimits,
  };
}
