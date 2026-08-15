// src/services/api.js
// Central API service — all backend calls go through here.
// When you're ready to connect the backend, replace the mock data
// with real axios calls. The shape of every return value stays the same,
// so no component needs to change.

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({ baseURL: BASE_URL });

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (data) => client.post('/auth/login', data),
  register: (data) => client.post('/auth/register', data),
  logout:   ()     => client.post('/auth/logout'),
};

// ─── Transactions ─────────────────────────────────────────────────────────────
export const transactionsAPI = {
  getAll:  (params) => client.get('/transactions', { params }),
  create:  (data)   => client.post('/transactions', data),
  update:  (id, data) => client.put(`/transactions/${id}`, data),
  delete:  (id)     => client.delete(`/transactions/${id}`),
};

// ─── Budget / Categories ──────────────────────────────────────────────────────
export const budgetAPI = {
  getSummary:    ()     => client.get('/budget/summary'),
  getCategories: ()     => client.get('/budget/categories'),
  updateBudget:  (data) => client.put('/budget', data),
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  getMonthlyTrend:    () => client.get('/analytics/monthly'),
  getCategoryBreakdown: () => client.get('/analytics/categories'),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileAPI = {
  get:    ()     => client.get('/profile'),
  update: (data) => client.put('/profile', data),
};

export default client;
