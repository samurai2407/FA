// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../services/api.js';
import apiClient from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  // Persist token to localStorage + set axios default header
  function persist(tok, usr) {
    setToken(tok);
    setUser(usr);
    if (tok) {
      localStorage.setItem('token', tok);
      localStorage.setItem('user', JSON.stringify(usr));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }

  // Restore header on page reload if token already in localStorage
  if (token && !apiClient.defaults.headers.common['Authorization']) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    persist(res.data.token, res.data.user);
    return res.data;
  }, []);

  const register = useCallback(async (name, email, password, monthlyBudget = 4000) => {
    const res = await authAPI.register({ name, email, password, monthlyBudget });
    persist(res.data.token, res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch (_) { /* ignore */ }
    persist(null, null);
  }, []);

  const updateStoredUser = useCallback((updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, updateStoredUser, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
