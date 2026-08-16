// src/pages/Login.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full p-4 bg-[#1C1C1E] border border-white/10 rounded-2xl outline-none focus:border-[#4B58FF] text-white placeholder-[#A3A3A3] transition-colors text-sm font-medium';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#4B58FF] rounded-[20px] flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg shadow-[#4B58FF]/30">$</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SmartBudget</h1>
          <p className="text-[#A3A3A3] text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-[#151515] rounded-[28px] border border-white/5 p-8">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-bold mb-2 text-white">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" autoComplete="email"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-white">Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" autoComplete="current-password"
                className={inputCls}
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#4B58FF] hover:bg-[#3a46e0] disabled:opacity-60 text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#4B58FF]/20 transition-colors mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[#A3A3A3] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#4B58FF] font-semibold hover:text-[#3a46e0] transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
