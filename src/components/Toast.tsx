/**
 * file: src/components/Toast.tsx
 * Floating toast notification banner
 */
import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export default function Toast() {
  const { toast } = useMovies();

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md animate-fadeIn">
      <div
        className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-md ${
          toast.type === 'error'
            ? 'bg-rose-950/95 border-rose-500/60 text-rose-200'
            : toast.type === 'info'
            ? 'bg-indigo-950/95 border-indigo-500/60 text-indigo-200'
            : 'bg-slate-900/95 border-emerald-500/60 text-emerald-200'
        }`}
      >
        {toast.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-5 h-5 text-indigo-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <p className="text-xs font-semibold leading-snug">{toast.message}</p>
      </div>
    </div>
  );
}
