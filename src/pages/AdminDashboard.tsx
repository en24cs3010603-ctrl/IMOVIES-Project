/**
 * file: src/pages/AdminDashboard.tsx
 * Cinema Admin Management Console for movies, shows, and revenue analytics
 */
import React, { useState } from 'react';
import { ShieldCheck, PlusCircle, Trash2, Film, DollarSign, Ticket, Calendar } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export default function AdminDashboard() {
  const { movies, shows, bookings, deleteMovie, addMovie } = useMovies();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Sci-Fi');
  const [language, setLanguage] = useState('English');
  const [duration, setDuration] = useState('120');
  const [rating, setRating] = useState('8.5');
  const [poster, setPoster] = useState('');
  const [description, setDescription] = useState('');

  const [formError, setFormError] = useState('');

  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle || trimmedTitle.length < 2) {
      setFormError('Movie title must be at least 2 characters long.');
      return;
    }

    const dur = Number(duration);
    if (isNaN(dur) || dur <= 0 || dur > 400) {
      setFormError('Duration must be a positive number of minutes (max 400).');
      return;
    }

    const rat = Number(rating);
    if (isNaN(rat) || rat < 0 || rat > 10) {
      setFormError('Rating must be between 0.0 and 10.0.');
      return;
    }

    if (!trimmedDesc || trimmedDesc.length < 10) {
      setFormError('Synopsis must be at least 10 characters long.');
      return;
    }

    try {
      await addMovie({
        title: trimmedTitle,
        genre,
        language,
        duration: dur,
        rating: rat,
        poster: poster.trim() || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
        description: trimmedDesc,
        releaseDate: new Date().toISOString().split('T')[0],
        cast: ['Lead Actor', 'Supporting Cast'],
      });

      setTitle('');
      setDescription('');
      setPoster('');
      setFormError('');
      setShowAddModal(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save movie.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
            Admin Management Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage catalog, scheduled showtimes and monitor box office analytics</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Add New Movie
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Movies in Catalog</span>
            <Film className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{movies.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Shows</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{shows.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tickets Reserved</span>
            <Ticket className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            {bookings.filter((b) => b.status === 'confirmed').length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            ${totalRevenue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Movies Catalog Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="font-bold text-white text-base mb-4">Movie Catalog & Screenings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-slate-400 uppercase bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Genre</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {movies.map((m) => (
                <tr key={m.id} className="hover:bg-slate-950/40">
                  <td className="py-3.5 px-4 font-bold text-white">{m.title}</td>
                  <td className="py-3.5 px-4">{m.genre}</td>
                  <td className="py-3.5 px-4">{m.language}</td>
                  <td className="py-3.5 px-4">{m.duration} mins</td>
                  <td className="py-3.5 px-4 text-amber-400">★ {m.rating}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteMovie(m.id)}
                      className="text-rose-400 hover:text-rose-300 font-semibold p-1 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                      title="Delete Movie"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-4">Add Movie to Catalog</h3>
            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium">
                {formError}
              </div>
            )}
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Movie Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Blade Runner 2049"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    {['Sci-Fi', 'Action', 'Drama', 'Animation', 'Adventure', 'Comedy', 'Thriller'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    {['English', 'Spanish', 'French', 'Hindi', 'Japanese'].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Poster Image URL</label>
                <input
                  type="url"
                  value={poster}
                  onChange={(e) => setPoster(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Synopsis</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                  placeholder="Enter a short synopsis of the movie..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
