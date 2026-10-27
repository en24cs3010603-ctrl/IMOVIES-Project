/**
 * file: src/components/MovieCard.tsx
 * Cinema Movie Card with poster, rating badge, metadata and booking button
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Ticket } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/20 flex flex-col group">
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400" /> {movie.rating}
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="text-2xs px-2 py-0.5 rounded bg-rose-600/90 text-white font-semibold backdrop-blur-sm shadow-sm">
            {movie.genre}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-base group-hover:text-rose-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{movie.language}</span>
            <span>•</span>
            <span>{movie.duration} mins</span>
          </div>
        </div>

        <Link
          to={`/movies/${movie.id}`}
          className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Ticket className="w-3.5 h-3.5" /> Book Show
        </Link>
      </div>
    </div>
  );
}
