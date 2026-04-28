import React, { useEffect, useState } from 'react';
import api from '../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleEditClick = (category) => {
    setEditId(category._id);
    setEditName(category.name);
  };

  const handleUpdate = () => {
    if (!editName.trim()) return;

    api.put(`/categories/${editId}`, { name: editName })
      .then(() => {
        setSuccess('Category updated successfully.');
        setEditId(null);
        setEditName('');
        fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch((err) =>
        setError(err.response?.data?.message || 'Update failed.')
      );
  };

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError('');
    api.post('/categories', { name: newName.trim() })
      .then(() => {
        setSuccess('Category added successfully.');
        setNewName('');
        fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to add category.'))
      .finally(() => setAdding(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure? Transactions using this category will have no category.')) return;
    api.delete(`/categories/${id}`)
      .then(() => {
        setSuccess('Category deleted.');
        fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to delete.'));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="spinner-ring"></div>
        <p className="mt-4 text-slate-400 text-sm">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Categories</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your transaction categories.</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm" role="alert">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm" role="alert">
          ✅ {success}
        </div>
      )}

      {/* Add Form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
          placeholder="New category name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={adding}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/25 disabled:shadow-none disabled:cursor-not-allowed whitespace-nowrap"
        >
          {adding ? 'Adding...' : '➕ Add Category'}
        </button>
      </form>

      {/* Category List */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-slate-400">No categories yet. Create your first one above!</p>
          </div>
        ) : (
          categories.map((c) => (
            <div
              key={c._id}
              className="flex items-center justify-between gap-3 p-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all duration-200"
            >
              {editId === c._id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-200"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="px-4 py-2 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                    <span className="text-slate-200 font-medium">{c.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(c)}
                      className="px-3 py-1.5 text-xs font-medium text-violet-300 hover:text-white bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded-lg transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryList;
