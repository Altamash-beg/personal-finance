import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/transactions')
      .then((res) => {
        const transactions = res.data;
        const income = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const expense = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        setStats({
          income,
          expense,
          balance: income - expense
        });
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load transactions.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="spinner-ring"></div>
        <p className="mt-4 text-slate-400 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm" role="alert">
        {error}
      </div>
    );
  }

  const formatCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(n);
  const hasTransactions = stats.income > 0 || stats.expense > 0;

  const cards = [
    {
      label: 'Total Income',
      value: formatCurrency(stats.income),
      gradient: 'from-emerald-600 to-green-500',
      shadow: 'shadow-emerald-500/20',
      
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(stats.expense),
      gradient: 'from-rose-600 to-pink-500',
      shadow: 'shadow-rose-500/20',
      
    },
    {
      label: 'Balance',
      value: formatCurrency(stats.balance),
      gradient: stats.balance >= 0 ? 'from-violet-600 to-indigo-500' : 'from-amber-600 to-orange-500',
      shadow: stats.balance >= 0 ? 'shadow-violet-500/20' : 'shadow-amber-500/20',
      
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="text-slate-400 mt-1">Welcome to your personal finance overview!</p>
      </div>

      {!hasTransactions && (
        <div className="mb-6 px-5 py-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 text-sm">
           <strong>Get started!</strong> You have no transactions yet. Add your first income or expense to see your financial summary here.
        </div>
      )}

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 shadow-lg ${card.shadow} transform hover:scale-[1.03] transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white/80">{card.label}</span>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      
      <div className="flex flex-wrap gap-3">
        <Link
          to="/transactions"
          className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 no-underline text-sm"
        >
          View Transactions
        </Link>
        <Link
          to="/transaction/new"
          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium rounded-xl transition-all duration-300 no-underline text-sm"
        >
          ➕ Add Transaction
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
