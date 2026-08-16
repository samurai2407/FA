// src/services/api.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const client = axios.create({ baseURL: BASE_URL });

// Response interceptor — surface error messages cleanly
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (data) => client.post('/auth/login', data),
  register: (data) => client.post('/auth/register', data),
  logout:   ()     => client.post('/auth/logout'),
};

// ─── Transactions ─────────────────────────────────────────────────────────────
export const transactionsAPI = {
  getAll:  (params)   => client.get('/transactions', { params }),
  create:  (data)     => client.post('/transactions', data),
  update:  (id, data) => client.put(`/transactions/${id}`, data),
  delete:  (id)       => client.delete(`/transactions/${id}`),
};

// ─── Budget / Categories ──────────────────────────────────────────────────────
export const budgetAPI = {
  getSummary:       ()     => client.get('/budget/summary'),
  getCategories:    ()     => client.get('/budget/categories'),
  updateBudget:     (data) => client.put('/budget', data),
  updateCategories: (data) => client.put('/budget/categories', data), // { categories: [{name, limit}] }
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  getMonthlyTrend:      () => client.get('/analytics/monthly'),
  getCategoryBreakdown: () => client.get('/analytics/categories'),
};

// ─── AI Chat ──────────────────────────────────────────────────────────────────
export const aiAPI = {
  chat: (message, history) => client.post('/ai/chat', { message, history }),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileAPI = {
  get:    ()     => client.get('/profile'),
  update: (data) => client.put('/profile', data),
};

export default client;
