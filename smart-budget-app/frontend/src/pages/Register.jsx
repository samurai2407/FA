// src/pages/Register.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '', monthlyBudget: '4000' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, parseFloat(form.monthlyBudget) || 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:border-[#00d09c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💰</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SmartBudget</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Alex Johnson" autoComplete="name" className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" autoComplete="email" className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="At least 6 characters" autoComplete="new-password" className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Confirm Password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="Repeat password" autoComplete="new-password" className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">
                Monthly Budget <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input type="number" name="monthlyBudget" value={form.monthlyBudget} onChange={handleChange}
                  min="0" placeholder="4000"
                  className={`${inputCls} pl-8`} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#1a202c] dark:bg-[#00d09c] hover:bg-[#2d3748] dark:hover:bg-[#00b386] disabled:opacity-60 text-white dark:text-gray-900 py-4 rounded-xl font-bold shadow-md transition-colors mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00d09c] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
