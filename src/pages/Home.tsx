/**
 * file: src/pages/Home.tsx
 * Cinema Home Page with Featured Premiere Hero and Now Showing grid
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Ticket, ChevronRight, Tv } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

export default function Home() {
  const { movies, loading } = useMovies();

  if (loading && movies.length === 0) {
    return <Loader message="Loading premieres and screenings..." />;
  }

  const featured = movies[0];

  return (
    <div className="space-y-12 animate-fadeIn pb-8">
      {/* Hero Premiere Banner */}
      {featured && (
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              src={featured.poster} 
              alt={featured.title} 
              className="w-full h-full object-cover object-center filter blur-xl scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-12 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white inline-flex items-center gap-1.5 shadow-lg shadow-rose-600/40">
                <Sparkles className="w-3.5 h-3.5" /> FEATURED PREMIERE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800/90 text-rose-400 font-semibold text-xs border border-rose-500/30">
                MERN Cinema
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
              {featured.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-4 line-clamp-3 leading-relaxed">
              {featured.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" /> {featured.rating} / 10
              </span>
              <span>•</span>
              <span>{featured.duration} mins</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-200">
                {featured.genre}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-200">
                {featured.language}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                to={`/movies/${featured.id}`}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-rose-600/30 transition-all hover:scale-105"
              >
                <Ticket className="w-4 h-4" />
                Book Tickets Now
              </Link>
              <Link
                to={`/movies/${featured.id}`}
                className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
              >
                View Details & Cast
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Now Showing Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Tv className="w-5 h-5 text-rose-500" />
              Now Showing in Theatres
            </h2>
            <p className="text-xs text-slate-400 mt-1">Select any movie to choose showtimes and interactive seats</p>
          </div>
          <Link
            to="/movies"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            View All Movies <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
