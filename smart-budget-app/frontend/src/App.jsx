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
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-[#111111] border-r border-white/5 min-h-screen sticky top-0 py-8 px-4">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-[#4B58FF] rounded-xl flex items-center justify-center text-white font-bold text-sm">$</div>
        <span className="text-lg font-bold text-white tracking-tight">SmartBudget</span>
      </div>

      {user && (
        <div className="flex items-center gap-3 px-3 mb-6 pb-6 border-b border-white/5">
          <div className="w-9 h-9 bg-[#4B58FF] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-[#A3A3A3] truncate">{user.email}</p>
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
                  ? 'bg-[#4B58FF]/20 text-[#4B58FF]'
                  : 'text-[#A3A3A3] hover:bg-white/5 hover:text-white'
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-white/5 flex justify-around py-3 text-xs font-medium text-[#A3A3A3] z-50">
      {navItems.map(({ to, icon, label }) => {
        const isActive = pathname === to;
        return (
          <Link key={to} to={to}
            className={`flex flex-col items-center gap-0.5 transition-colors
              ${isActive ? 'text-[#4B58FF]' : 'text-[#A3A3A3] hover:text-white'}`}>
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
    <div className="md:hidden flex items-center justify-between px-4 pt-5 pb-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-[#4B58FF] rounded-lg flex items-center justify-center text-white font-bold text-xs">$</div>
        <span className="font-bold text-white tracking-tight">SmartBudget</span>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <div className="w-12 h-12 bg-[#4B58FF] rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 animate-pulse">$</div>
        <p className="text-[#A3A3A3] text-sm">Loading your data…</p>
      </div>
    </div>
  );
}

function ErrorScreen({ message, onRetry }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-black p-4">
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="font-bold text-white mb-2">Couldn't load data</h3>
        <p className="text-[#A3A3A3] text-sm mb-4">{message}</p>
        <button onClick={onRetry}
          className="bg-[#4B58FF] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#3a46e0] transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );
}

function AppShell() {
  const budgetData = useBudgetData();

  return (
    <div className="flex min-h-screen bg-black">
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
        <>
          <Route path="/*" element={<AppShell />} />
          <Route path="/login"    element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
        </>
      ) : (
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
