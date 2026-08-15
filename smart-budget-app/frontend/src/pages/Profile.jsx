// src/pages/Profile.jsx
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
        <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">{children}</div>
    </div>
  );
}

function Row({ icon, label, value, onClick, destructive }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 transition-colors text-left
        hover:bg-gray-50 dark:hover:bg-gray-800
        ${destructive ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-gray-400 dark:text-gray-500">{value}</span>}
        {!destructive && <span className="text-gray-300 dark:text-gray-600 text-xs">›</span>}
      </div>
    </button>
  );
}

export default function Profile({ user, updateUser }) {
  const { dark, toggle } = useTheme();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:          user?.name          || '',
    email:         user?.email         || '',
    monthlyBudget: user?.monthlyBudget || 4000,
    currency:      user?.currency      || 'USD',
  });
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    updateUser({ ...form, monthlyBudget: parseFloat(form.monthlyBudget) });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputCls = 'w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl outline-none focus:border-[#00d09c] transition-colors placeholder-gray-400 dark:placeholder-gray-500';

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">

      <div className="mb-6 md:mb-8 mt-4 md:mt-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Avatar card */}
      <div className="bg-[#1a202c] dark:bg-gray-900 dark:border dark:border-gray-800 text-white rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-[#00d09c] rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
          {user?.name?.charAt(0) || 'A'}
        </div>
        <div>
          <h3 className="text-lg font-bold">{user?.name}</h3>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
        <button onClick={() => setEditing(true)}
          className="ml-auto text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors">
          Edit
        </button>
      </div>

      {saved && (
        <div className="mb-4 bg-[#00d09c]/10 border border-[#00d09c]/30 text-[#00874f] dark:text-[#00d09c] rounded-xl px-4 py-3 text-sm font-medium">
          ✅ Profile updated
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-transparent dark:border-gray-800">
            <h3 className="font-bold text-lg mb-5 text-gray-900 dark:text-white">Edit Profile</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">Monthly Budget ($)</label>
                <input name="monthlyBudget" type="number" min="0" value={form.monthlyBudget} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">Currency</label>
                <select name="currency" value={form.currency} onChange={handleChange} className={inputCls}>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="CAD">CAD — Canadian Dollar</option>
                  <option value="AUD">AUD — Australian Dollar</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditing(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#1a202c] dark:bg-[#00d09c] text-white dark:text-gray-900 text-sm font-bold hover:bg-[#2d3748] dark:hover:bg-[#00b386] transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">

        <Section title="Account">
          <Row icon="👤" label="Personal Information" value={user?.name} onClick={() => setEditing(true)} />
          <Row icon="🔔" label="Notifications"        value="On"         onClick={() => {}} />
          <Row icon="🔒" label="Change Password"                         onClick={() => {}} />
        </Section>

        <Section title="Appearance">
          <button type="button" onClick={toggle}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left text-gray-900 dark:text-white">
            <div className="flex items-center gap-3">
              <span className="text-lg">{dark ? '☀️' : '🌙'}</span>
              <span className="text-sm font-medium">{dark ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors relative ${dark ? 'bg-[#00d09c]' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${dark ? 'left-5' : 'left-1'}`} />
            </div>
          </button>
        </Section>

        <Section title="Budget Settings">
          <Row icon="💰" label="Monthly Budget"   value={`$${user?.monthlyBudget?.toLocaleString()}`} onClick={() => setEditing(true)} />
          <Row icon="💱" label="Currency"         value={user?.currency}                             onClick={() => setEditing(true)} />
          <Row icon="📂" label="Manage Categories"                                                   onClick={() => {}} />
        </Section>

        <Section title="Data">
          <Row icon="📤" label="Export as CSV" onClick={() => {}} />
          <Row icon="🔄" label="Sync & Backup" onClick={() => {}} />
        </Section>

        <Section title="Danger Zone">
          <Row icon="🚪" label="Sign Out"       onClick={() => {}} destructive />
          <Row icon="🗑️" label="Delete Account" onClick={() => {}} destructive />
        </Section>

      </div>

      <p className="text-center text-xs text-gray-300 dark:text-gray-700 mt-8">SmartBudget v1.0.0</p>
    </div>
  );
}
