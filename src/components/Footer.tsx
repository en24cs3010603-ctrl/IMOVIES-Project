/**
 * file: src/components/Footer.tsx
 * Cinema Footer with branding, MERN Cinema badge, and quick links
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isAdmin } = useAuth();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 mt-16 py-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand info */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shrink-0">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">IMovies</span>
              <span className="px-2 py-0.5 rounded-full text-2xs bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                MERN Cinema
              </span>
            </div>
            <p className="text-2xs text-slate-500 mt-0.5">Movie Ticket Booking Made Simple • Full-Stack Platform</p>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
          <Link to="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link>
          {isAdmin && (
            <Link to="/admin" className="text-amber-400 hover:text-amber-300 transition-colors">Admin Panel</Link>
          )}
          <Link to="/docs" className="text-rose-400 hover:text-rose-300 transition-colors">Documentation</Link>
        </div>

        {/* Copyright */}
        <div className="text-slate-500 text-2xs">
          © 2026 IMovies Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
