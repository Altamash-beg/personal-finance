import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";
import CategoryList from "./components/CategoryList";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-dark-800/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            onClick={handleNav}
            className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent hover:from-violet-300 hover:to-indigo-300 transition-all duration-300 no-underline"
          >
            💰 FinanceHub
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {[
                  { to: "/dashboard", label: "Dashboard" },
                  { to: "/transactions", label: "Transactions" },
                  { to: "/transaction/new", label: "➕ Add" },
                  { to: "/categories", label: "Categories" },
                  { to: "/profile", label: "Profile" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 no-underline"
                  >
                    {item.label}
                  </Link>
                ))}
                <span className="text-xs text-slate-400 ml-2 hidden lg:inline">
                  Hi, {user?.name}
                </span>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="ml-2 px-3 py-1.5 text-sm text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-lg transition-all duration-200 border border-rose-500/30 hover:border-rose-500/50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="px-4 py-1.5 text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-200 no-underline"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 animate-fade-in">
            {isAuthenticated ? (
              <>
                {[
                  { to: "/dashboard", label: "Dashboard" },
                  { to: "/transactions", label: "Transactions" },
                  { to: "/transaction/new", label: "➕ Add Transaction" },
                  { to: "/categories", label: "Categories" },
                  { to: "/profile", label: "Profile" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleNav}
                    className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all no-underline"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => { logout(); navigate('/'); handleNav(); }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/20 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/"
                onClick={handleNav}
                className="block px-3 py-2 text-sm text-violet-300 hover:bg-violet-500/20 rounded-lg transition-all no-underline"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="spinner-ring"></div>
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><AuthForm /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><TransactionList /></ProtectedRoute>} />
      <Route path="/transaction/new" element={<ProtectedRoute><TransactionForm /></ProtectedRoute>} />
      <Route path="/transaction/:id/edit" element={<ProtectedRoute><TransactionForm /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const Footer = () => (
  <footer className="mt-16 py-6 text-center border-t border-white/5">
    <div className="max-w-6xl mx-auto px-4">
      <p className="text-sm text-slate-500">
         FinanceHub &middot; Track your income and expenses with ease
      </p>
    </div>
  </footer>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
          <AppRoutes />
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
