import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users/profile')
      .then((res) => setUser(res.data))
      .catch((err) => setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="spinner-ring"></div>
        <p className="mt-4 text-slate-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm" role="alert">
        ⚠️ {error}
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-6">Profile</h2>

      <div className="max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-violet-500/5">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-500/30 mb-4">
            {initials}
          </div>
          <h3 className="text-xl font-semibold text-white">{user.name}</h3>
          <p className="text-slate-400 text-sm mt-1">{user.email}</p>
        </div>

        {/* Info */}
        <div className="space-y-3 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-400">Full Name</span>
            <span className="text-sm font-medium text-slate-200">{user.name}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-400">Email</span>
            <span className="text-sm font-medium text-slate-200">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
