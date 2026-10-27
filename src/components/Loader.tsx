/**
 * file: src/components/Loader.tsx
 * Cinema Reel Loading Spinner
 */
import React from 'react';
import { Film } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

export default function Loader({ message = 'Loading cinema experience...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 animate-spin">
          <Film className="w-7 h-7" />
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-400 tracking-wide uppercase">
        {message}
      </p>
    </div>
  );
}
