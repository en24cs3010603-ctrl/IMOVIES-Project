/**
 * file: src/pages/Login.tsx
 * User Sign-in Page with form validation and demo account shortcuts
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showToast } = useMovies();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please provide your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email format (e.g., user@example.com).');
      return;
    }

    if (!password) {
      setError('Please provide your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(trimmedEmail, password);
      showToast('Signed in successfully!', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@imovies.com');
      setPassword('admin123');
    } else {
      setEmail('user@imovies.com');
      setPassword('password123');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-950/40">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to book tickets and manage reservations</p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Fill Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <span className="text-2xs text-slate-500 uppercase tracking-wider font-semibold block mb-2">
            Quick Fill Demo Accounts
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemo('user')}
              className="flex-1 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Regular User
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="flex-1 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-800/60 text-amber-400 text-xs font-medium transition-colors"
            >
              Admin Staff
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-rose-400 hover:text-rose-300 font-semibold">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
