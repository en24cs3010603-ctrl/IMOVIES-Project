/**
 * file: src/pages/MovieDetails.tsx
 * Movie details view with synopsis, cast, ratings, and showtime schedule picker
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin, ArrowRight, Ban } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { isPastShowtime } from '../utils/dateUtils';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const { getMovieById, getShowsByMovieId } = useMovies();

  const movie = getMovieById(id || '');
  const shows = getShowsByMovieId(id || '');

  if (!movie) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="text-lg">Movie not found.</p>
        <Link to="/movies" className="mt-4 inline-block px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold">
          Return to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <Link
        to="/movies"
        className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Movies
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Poster Card */}
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-[2/3] shadow-2xl relative">
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-2xs text-slate-400 uppercase font-semibold">User Score</div>
              <div className="text-amber-400 font-extrabold flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-amber-400" /> {movie.rating} / 10
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xs text-slate-400 uppercase font-semibold">Duration</div>
              <div className="text-white font-bold text-sm">{movie.duration} Mins</div>
            </div>
          </div>
        </div>

        {/* Details & Showtimes */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/30">
                {movie.genre}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700">
                {movie.language}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{movie.title}</h1>
            <p className="text-slate-300 text-sm mt-4 leading-relaxed">{movie.description}</p>
          </div>

          {/* Cast */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Cast</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {movie.cast.map((actor, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs">
                  {actor}
                </span>
              ))}
            </div>
          </div>

          {/* Available Shows & Theatres */}
          <div>
            <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              Select Theatre & Showtime
            </h3>

            {shows.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-900 rounded-xl border border-slate-800">
                No active showtimes scheduled for this movie yet.
              </p>
            ) : (
              <div className="space-y-3">
                {shows.map((show) => {
                  const isPast = isPastShowtime(show.date, show.time);
                  return (
                    <div 
                      key={show.id}
                      className={`p-4 rounded-xl bg-slate-900 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isPast ? 'border-slate-800/60 opacity-65' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-rose-500" />
                          {show.theatreName}
                          {isPast && (
                            <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                              Show Ended
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {show.location} • Screen {show.screen} • {show.date}
                        </div>
                        <div className={`text-2xs mt-1 font-mono ${isPast ? 'text-slate-500' : 'text-emerald-400'}`}>
                          {isPast ? 'Bookings closed' : `${60 - show.bookedSeats.length} seats available`}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-slate-400">Price</span>
                          <div className="text-sm font-bold text-white">${show.price.toFixed(2)}</div>
                        </div>
                        {isPast ? (
                          <button
                            disabled
                            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-500 font-semibold text-xs flex items-center gap-1.5 cursor-not-allowed border border-slate-700/50"
                            title="Cannot book past showtimes"
                          >
                            <Ban className="w-3.5 h-3.5" /> {show.time} (Ended)
                          </button>
                        ) : (
                          <Link
                            to={`/seats/${show.id}`}
                            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
                          >
                            {show.time} <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
