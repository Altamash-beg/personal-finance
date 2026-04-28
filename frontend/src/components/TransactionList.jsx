import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchTransactions = () => {
    setLoading(true);
    api.get('/transactions')
      .then((res) => setTransactions(res.data))
      .catch((err) =>
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to load transactions.'
        )
      )
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    api.delete(`/transactions/${id}`)
      .then(() => {
        setSuccess('Transaction deleted successfully.');
        fetchTransactions();
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch((err) =>
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to delete.'
        )
      );
  };

  const filtered = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (
      filterCategory &&
      tx.categoryId?._id !== filterCategory &&
      tx.categoryId !== filterCategory
    )
      return false;
    return true;
  });

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(n);

  const totalBalance = filtered.reduce(
    (acc, tx) => (tx.type === 'income' ? acc + tx.amount : acc - tx.amount),
    0
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="spinner-ring"></div>
        <p className="mt-4 text-slate-400 text-sm">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Transactions</h2>
          <p className="text-slate-400 text-sm mt-1">
            Balance:{' '}
            <span className={`font-semibold ${totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(totalBalance)}
            </span>
          </p>
        </div>
        <Link
          to="/transaction/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/25 no-underline text-sm self-start"
        >
          ➕ Add Transaction
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm">
          ✅ {success}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Type</label>
          <select
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-200 appearance-none cursor-pointer"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Category</label>
          <select
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-200 appearance-none cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-slate-400">No transactions found.</p>
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx._id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all duration-200 ${
                tx.type === 'income' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-rose-500'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      tx.type === 'income'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {tx.type}
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrency(tx.amount)}
                  </span>
                  <span className="text-slate-500 text-sm">
                    {new Date(tx.date).toLocaleDateString('en-IN')}
                    {tx.categoryId?.name && ` · ${tx.categoryId.name}`}
                  </span>
                </div>
                {tx.description && (
                  <p className="text-sm text-slate-400 mt-1 truncate">{tx.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/transaction/${tx._id}/edit`}
                  className="px-3 py-1.5 text-xs font-medium text-violet-300 hover:text-white bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded-lg transition-all duration-200 no-underline"
                >
                  Edit
                </Link>
                <button
                  className="px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-all duration-200"
                  onClick={() => handleDelete(tx._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;