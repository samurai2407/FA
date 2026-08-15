// src/App.jsx
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Home        from './pages/Home';
import AddExpense  from './pages/AddExpense';
import Analytics   from './pages/Analytics';
import Profile     from './pages/Profile';
import Login       from './pages/Login';
import Register    from './pages/Register';
import { useBudgetData } from './hooks/useBudgetData';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth }   from './context/AuthContext';

const navItems = [
  { to: '/',            icon: '🏠', label: 'Home'        },
  { to: '/analytics',  icon: '📊', label: 'Analytics'   },
  { to: '/add-expense', icon: '➕', label: 'Add Expense'  },
  { to: '/profile',    icon: '👤', label: 'Profile'     },
];

function SidebarNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen sticky top-0 py-8 px-4">
      <div className="flex items-center gap-2 mb-10 px-2">
        <span className="text-2xl">💰</span>
        <span className="text-lg font-bold text-gray-900 dark:text-white">SmartBudget</span>
      </div>

      {/* User info */}
      {user && (
        <div className="flex items-center gap-3 px-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="w-9 h-9 bg-[#00d09c] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      )}

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, icon, label }) => {
          const isActive = pathname === to;
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-[#00d09c]/10 text-[#00d09c]'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}>
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      
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
              ${isActive ? 'text-[#00d09c]' : 'dark:text-gray-500 hover:text-[#00d09c]'}`}>
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
    </div>
  );
}

// Loading skeleton shown while first fetch is in flight
function LoadingScreen() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-pulse">💰</div>
        <p className="text-gray-400 dark:text-gray-500 text-sm">Loading your data…</p>
      </div>
    </div>
  );
}

// Error screen with retry
function ErrorScreen({ message, onRetry }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Couldn't load data</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{message}</p>
        <button onClick={onRetry}
          className="bg-[#1a202c] dark:bg-[#00d09c] text-white dark:text-gray-900 px-6 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
          Try Again
        </button>
      </div>
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

        {budgetData.loading && <LoadingScreen />}
        {!budgetData.loading && budgetData.error && (
          <ErrorScreen message={budgetData.error} onRetry={budgetData.refetch} />
        )}
        {!budgetData.loading && !budgetData.error && (
          <Routes>
            <Route path="/"            element={<Home      {...budgetData} />} />
            <Route path="/add-expense" element={<AddExpense {...budgetData} />} />
            <Route path="/analytics"   element={<Analytics  {...budgetData} />} />
            <Route path="/profile"     element={<Profile    {...budgetData} />} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

function AuthShell() {
  const { isAuth } = useAuth();
  return (
    <Routes>
      {isAuth ? (
        // Authenticated — show main app
        <>
          <Route path="/*" element={<AppShell />} />
          <Route path="/login"    element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
        </>
      ) : (
        // Not authenticated — show auth pages
        <>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*"         element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AuthShell />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
