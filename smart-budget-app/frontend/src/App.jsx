// src/App.jsx
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home        from './pages/Home';
import AddExpense  from './pages/AddExpense';
import Analytics   from './pages/Analytics';
import Profile     from './pages/Profile';
import { useBudgetData } from './hooks/useBudgetData';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const navItems = [
  { to: '/',            icon: '🏠', label: 'Home'        },
  { to: '/analytics',  icon: '📊', label: 'Analytics'   },
  { to: '/add-expense', icon: '➕', label: 'Add Expense'  },
  { to: '/profile',    icon: '👤', label: 'Profile'     },
];

function ThemeToggle({ className = '' }) {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300
        ${className}`}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

function SidebarNav() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen sticky top-0 py-8 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10 px-2">
        <span className="text-2xl">💰</span>
        <span className="text-lg font-bold text-gray-900 dark:text-white">SmartBudget</span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, icon, label }) => {
          const isActive = pathname === to;
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-[#00d09c]/10 text-[#00d09c]'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Dark mode toggle at bottom of sidebar */}
      <div className="mt-auto px-2">
        <ThemeToggle className="w-full justify-start gap-3 px-3 !rounded-xl !h-10 !w-full text-sm font-medium" />
      </div>
    </aside>
  );
}

function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around py-3 text-xs font-medium text-gray-400 z-50">
      {navItems.map(({ to, icon, label }) => {
        const isActive = pathname === to;
        return (
          <Link key={to} to={to}
            className={`flex flex-col items-center gap-0.5 transition-colors
              ${isActive ? 'text-[#00d09c]' : 'dark:text-gray-500 hover:text-[#00d09c]'}`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label === 'Add Expense' ? 'Add' : label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileHeader() {
  return (
    <div className="md:hidden flex items-center justify-between px-4 pt-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">💰</span>
        <span className="font-bold text-gray-900 dark:text-white">SmartBudget</span>
      </div>
      <ThemeToggle />
    </div>
  );
}

function AppShell() {
  const budgetData = useBudgetData();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <SidebarNav />
      <div className="flex-1 flex flex-col pb-16 md:pb-0 min-w-0">
        <MobileHeader />
        <Routes>
          <Route path="/"            element={<Home       {...budgetData} />} />
          <Route path="/add-expense" element={<AddExpense  {...budgetData} />} />
          <Route path="/analytics"   element={<Analytics   {...budgetData} />} />
          <Route path="/profile"     element={<Profile     {...budgetData} />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  );
}
