import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const TransactionForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit) {
      api.get(`/transactions/${id}`)
        .then((res) => {
          const tx = res.data;
          setType(tx.type);
          setAmount(String(tx.amount));
          setDate(tx.date ? new Date(tx.date).toISOString().slice(0, 10) : '');
          setDescription(tx.description || '');
          setCategoryId(tx.categoryId?._id || tx.categoryId || '');
        })
        .catch((err) => setError(err.response?.data?.message || 'Failed to load transaction.'))
        .finally(() => setLoadingData(false));
    }
  }, [id, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      type,
      amount: parseFloat(amount),
      date,
      description: description || undefined,
      categoryId: categoryId || undefined
    };

    const promise = isEdit
      ? api.put(`/transactions/${id}`, payload)
      : api.post('/transactions', payload);

    promise
      .then(() => {
        navigate('/transactions');
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save transaction.');
      })
      .finally(() => setLoading(false));
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="spinner-ring"></div>
        <p className="mt-4 text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200';

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">
          {isEdit ? 'Edit Transaction' : 'New Transaction'}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {isEdit ? 'Update the details below' : 'Fill in the details to add a new transaction'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-violet-500/5"
      >
        {/* Type Selector */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border-2 border-rose-500/50 shadow-lg shadow-rose-500/10'
                  : 'bg-white/5 text-slate-400 border-2 border-transparent hover:bg-white/10'
              }`}
            >
              📉 Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                  : 'bg-white/5 text-slate-400 border-2 border-transparent hover:bg-white/10'
              }`}
            >
              📈 Income
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
          <input
            type="number"
            className={inputClass}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        {/* Date */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="mb-5 ">
          <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
          <select
            className="text-black w-full px-4 py-3  bg-gray-300 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <textarea
            className={inputClass + ' resize-none'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Optional note..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-500/25 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Save'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium rounded-xl transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
