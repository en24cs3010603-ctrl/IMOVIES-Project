/**
 * file: src/components/Navbar.tsx
 * Top responsive navigation bar with single-line desktop branding and mobile drawer
 */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';

export default function Navbar() {
  const { user, isAdmin, switchDemoUser } = useAuth();
  const { bookings, showToast } = useMovies();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline (Single line on desktop, hidden tagline on mobile) */}
        <Link 
          to="/" 
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40 group-hover:scale-105 transition-transform shrink-0">
            <Film className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold tracking-tight text-xl text-white">IMovies</span>
            <span className="hidden lg:inline text-slate-700 font-light select-none">|</span>
            <span className="hidden lg:inline text-xs text-slate-400 font-normal whitespace-nowrap tracking-normal">
              Movie Ticket Booking Made Simple
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isActive('/') ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/movies"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isActive('/movies') ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            Movies
          </Link>
          <Link
            to="/my-bookings"
            className={`px-3 py-1.5 rounded-lg transition-colors relative ${
              isActive('/my-bookings') ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Bookings
            {confirmedCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-2xs bg-rose-600 text-white font-bold">
                {confirmedCount}
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3 py-1.5 rounded-lg transition-colors text-amber-400 ${
                isActive('/admin') ? 'bg-amber-950/40 border border-amber-800/40' : 'hover:text-amber-300'
              }`}
            >
              Admin
            </Link>
          )}
          <Link
            to="/docs"
            className={`px-3 py-1.5 rounded-lg transition-colors text-xs ${
              isActive('/docs') ? 'text-rose-400 bg-rose-950/30 border border-rose-800/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Docs
          </Link>
        </nav>

        {/* User Account Switcher (Desktop) & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                switchDemoUser('user');
                showToast('Switched to User: John Doe', 'info');
              }}
              className={`px-2.5 py-1 rounded-lg text-2xs font-semibold transition-all ${
                user?.role === 'user' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              John (User)
            </button>
            <button
              onClick={() => {
                switchDemoUser('admin');
                showToast('Switched to Admin Console', 'info');
              }}
              className={`px-2.5 py-1 rounded-lg text-2xs font-semibold transition-all ${
                user?.role === 'admin' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-rose-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-900/98 px-4 pt-3 pb-5 space-y-3 shadow-2xl animate-fadeIn">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-left text-sm font-semibold flex items-center justify-between ${
                isActive('/') ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </Link>
            <Link
              to="/movies"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-left text-sm font-semibold flex items-center justify-between ${
                isActive('/movies') ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>Browse Movies</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </Link>
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-left text-sm font-semibold flex items-center justify-between ${
                isActive('/my-bookings') ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>My Bookings</span>
              {confirmedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-2xs bg-rose-500 text-white font-bold">
                  {confirmedCount}
                </span>
              )}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-left text-sm font-semibold flex items-center justify-between ${
                  isActive('/admin') ? 'bg-amber-600 text-white' : 'text-amber-400 hover:bg-slate-800'
                }`}
              >
                <span>Admin Dashboard</span>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </Link>
            )}
            <Link
              to="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-left text-sm font-semibold flex items-center justify-between ${
                isActive('/docs') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>API & Architecture Docs</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Switch Active Account:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  switchDemoUser('user');
                  showToast('Switched to User: John Doe', 'info');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold ${
                  user?.role === 'user' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                John
              </button>
              <button
                onClick={() => {
                  switchDemoUser('admin');
                  showToast('Switched to Admin', 'info');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold ${
                  user?.role === 'admin' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
