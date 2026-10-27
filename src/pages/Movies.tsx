/**
 * file: src/pages/Movies.tsx
 * Filterable and searchable movie catalog with empty state handling
 */
import React, { useState } from 'react';
import { Search, SlidersHorizontal, Film } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';

import Loader from '../components/Loader';

export default function Movies() {
  const { movies, loading } = useMovies();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Sci-Fi', 'Drama', 'Animation', 'Action', 'Adventure'];

  if (loading && movies.length === 0) {
    return <Loader message="Loading cinema catalog..." />;
  }

  const query = searchQuery.toLowerCase().trim();

  const filteredMovies = movies.filter((m) => {
    const matchesSearch = !query || 
      m.title.toLowerCase().includes(query) || 
      m.genre.toLowerCase().includes(query) ||
      (Array.isArray(m.cast) && m.cast.some((c) => c.toLowerCase().includes(query)));
    
    const matchesGenre =
      selectedGenre === 'All' ||
      m.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Explore Movies</h1>
          <p className="text-xs text-slate-400 mt-1">Filter by genre, search by title, or pick by language</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === genre
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Movie List or Empty State */}
      {filteredMovies.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/60 rounded-2xl border border-slate-800 animate-fadeIn">
          <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Movies Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No movies match &quot;{searchQuery}&quot; {selectedGenre !== 'All' ? `in genre ${selectedGenre}` : ''}.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('All');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
