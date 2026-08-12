// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';

export default function App() {
  return (
    <BrowserRouter>
      {/* padding-bottom prevents the content from hiding behind the navbar */}
      <div className="pb-20"> 
        
        {/* The Routes determine which page component to show */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-expense" element={<AddExpense />} />
        </Routes>

        {/* Fixed Bottom Navigation */}
        <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-4 text-xs font-medium text-gray-400 z-50">
          <Link to="/" className="flex flex-col items-center text-[#00d09c]">
            <span>🏠</span>
            <span className="mt-1">Home</span>
          </Link>
          <Link to="/analytics" className="flex flex-col items-center hover:text-[#00d09c]">
            <span>📊</span>
            <span className="mt-1">Analytics</span>
          </Link>
          <Link to="/add-expense" className="flex flex-col items-center hover:text-[#00d09c]">
            <span>➕</span>
            <span className="mt-1">Add</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center hover:text-[#00d09c]">
            <span>👤</span>
            <span className="mt-1">Profile</span>
          </Link>
        </div>

      </div>
    </BrowserRouter>
  );
}