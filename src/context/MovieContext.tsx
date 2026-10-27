import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Movie, Show, Booking } from '../types';
import api from '../api/axios';
import { useAuth } from './AuthContext';

interface MovieContextType {
  movies: Movie[];
  shows: Show[];
  bookings: Booking[];
  loading: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  getMovieById: (id: string) => Movie | undefined;
  getShowById: (id: string) => Show | undefined;
  getShowsByMovieId: (movieId: string) => Show[];
  createBooking: (userId: string, showId: string, seats: string[]) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
  addMovie: (movie: Omit<Movie, 'id'>) => Promise<void>;
  deleteMovie: (movieId: string) => Promise<void>;
  refreshCatalog: () => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Helper to normalize backend Movie into frontend Movie model
const normalizeMovie = (m: any): Movie => {
  let dur = 120;
  if (typeof m.duration === 'number') {
    dur = m.duration;
  } else if (typeof m.duration === 'string') {
    const hoursMatch = m.duration.match(/(\d+)h/);
    const minsMatch = m.duration.match(/(\d+)m/);
    dur = (hoursMatch ? parseInt(hoursMatch[1], 10) * 60 : 0) + (minsMatch ? parseInt(minsMatch[1], 10) : 0) || 120;
  }

  return {
    id: m._id || m.id,
    title: m.title,
    genre: Array.isArray(m.genre) ? m.genre.join(', ') : m.genre || 'Action',
    language: m.language || 'English',
    duration: dur,
    rating: m.rating || 8.0,
    poster: m.poster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    description: m.description || '',
    releaseDate: m.releaseDate || '2025-01-01',
    cast: Array.isArray(m.cast) ? m.cast : [],
  };
};

// Helper to normalize backend Show into frontend Show model
const normalizeShow = (s: any): Show => {
  return {
    id: s._id || s.id,
    movieId: s.movie?._id || s.movie || s.movieId,
    theatreName: s.theatre?.name || s.theatreDetails?.name || s.theatreName || 'Grand Cinema IMAX',
    location: s.theatre?.location || s.theatreDetails?.location || s.location || 'Downtown Metropolis',
    screen: typeof s.screen === 'number' ? s.screen : parseInt(String(s.screen).replace(/\D/g, ''), 10) || 1,
    date: s.date,
    time: s.time,
    price: s.price || 15,
    bookedSeats: Array.isArray(s.bookedSeats) ? s.bookedSeats : [],
  };
};

// Helper to normalize backend Booking into frontend Booking model
const normalizeBooking = (b: any): Booking => {
  const showData = b.show || {};
  const movieData = showData.movie || {};
  const theatreData = showData.theatre || {};

  return {
    id: b._id || b.id,
    userId: b.user?._id || b.user || b.userId,
    showId: showData._id || showData.id || b.showId || b.show,
    movieId: movieData._id || movieData.id || b.movieId || '',
    theatreId: theatreData._id || theatreData.id || b.theatreId || '',
    movieTitle: movieData.title || b.showDetails?.movieTitle || b.movieTitle || 'Movie Ticket',
    moviePoster: movieData.poster || b.moviePoster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    theatreName: theatreData.name || b.showDetails?.theatreName || b.theatreName || 'Grand Cinema',
    date: showData.date || b.showDetails?.date || b.date || '',
    time: showData.time || b.showDetails?.time || b.time || '',
    seats: Array.isArray(b.seats) ? b.seats : [],
    totalAmount: b.totalAmount || 0,
    status: (b.status || 'CONFIRMED').toLowerCase() as 'confirmed' | 'cancelled',
    createdAt: b.createdAt || new Date().toISOString(),
  };
};

import { fallbackMovies, fallbackShows } from '../utils/initialData';

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [movies, setMovies] = useState<Movie[]>(fallbackMovies);
  const [shows, setShows] = useState<Show[]>(fallbackShows);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const fetchCatalog = useCallback(async () => {
    try {
      const [moviesRes, showsRes] = await Promise.all([
        api.get('/movies'),
        api.get('/shows'),
      ]);

      if (moviesRes.data && Array.isArray(moviesRes.data.data) && moviesRes.data.data.length > 0) {
        setMovies(moviesRes.data.data.map(normalizeMovie));
      }
      if (showsRes.data && Array.isArray(showsRes.data.data) && showsRes.data.data.length > 0) {
        setShows(showsRes.data.data.map(normalizeShow));
      }
    } catch (err: any) {
      console.warn('API sync fallback active:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    if (!token) {
      setBookings([]);
      return;
    }
    try {
      const res = await api.get('/bookings/my');
      if (res.data && res.data.data) {
        setBookings(res.data.data.map(normalizeBooking));
      }
    } catch (err: any) {
      console.warn('Could not fetch bookings from API:', err.message);
    }
  }, [token]);

  // Initial load
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Sync user bookings whenever user or token changes
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings, user, token]);

  const getMovieById = (id: string) => movies.find((m) => m.id === id);
  const getShowById = (id: string) => shows.find((s) => s.id === id);
  const getShowsByMovieId = (movieId: string) => shows.filter((s) => s.movieId === movieId);

  const createBooking = async (_userId: string, showId: string, seats: string[]): Promise<Booking> => {
    try {
      const res = await api.post('/bookings', {
        showId,
        seats,
      });

      const rawBooking = res.data.data;
      const normalized = normalizeBooking(rawBooking);

      // Re-fetch shows to get latest bookedSeats map from the server
      const updatedShowsRes = await api.get('/shows');
      if (updatedShowsRes.data && updatedShowsRes.data.data) {
        setShows(updatedShowsRes.data.data.map(normalizeShow));
      }

      setBookings((prev) => [normalized, ...prev]);
      showToast(`🎉 Tickets booked! Reference: ${normalized.id}`, 'success');
      return normalized;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Seat reservation failed. Please try again.';
      showToast(message, 'error');
      throw new Error(message);
    }
  };

  const cancelBooking = async (bookingId: string): Promise<void> => {
    try {
      await api.put(`/bookings/${bookingId}/cancel`);

      // Refresh both bookings and shows from the server
      await Promise.all([fetchBookings(), fetchCatalog()]);

      showToast(`Booking ${bookingId} cancelled. Seats released.`, 'info');
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Failed to cancel booking.';
      showToast(message, 'error');
      throw new Error(message);
    }
  };

  const addMovie = async (movieData: Omit<Movie, 'id'>): Promise<void> => {
    try {
      const payload = {
        title: movieData.title,
        description: movieData.description,
        genre: movieData.genre.split(',').map((g) => g.trim()),
        language: movieData.language,
        duration: `${Math.floor(movieData.duration / 60)}h ${movieData.duration % 60}m`,
        poster: movieData.poster,
        rating: movieData.rating,
        releaseDate: movieData.releaseDate,
        cast: movieData.cast,
      };

      await api.post('/movies', payload);
      await fetchCatalog();
      showToast(`Movie "${movieData.title}" added to catalog`, 'success');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to add movie.';
      showToast(message, 'error');
      throw new Error(message);
    }
  };

  const deleteMovie = async (movieId: string): Promise<void> => {
    try {
      await api.delete(`/movies/${movieId}`);
      await fetchCatalog();
      showToast('Movie deleted from catalog', 'info');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete movie.';
      showToast(message, 'error');
      throw new Error(message);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        shows,
        bookings,
        loading,
        toast,
        showToast,
        getMovieById,
        getShowById,
        getShowsByMovieId,
        createBooking,
        cancelBooking,
        addMovie,
        deleteMovie,
        refreshCatalog: fetchCatalog,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
