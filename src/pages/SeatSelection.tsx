/**
 * file: src/pages/SeatSelection.tsx
 * Interactive Cinema Seat Selection Page with real-time availability and atomic checkout
 */
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, Ban } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';
import { isPastShowtime } from '../utils/dateUtils';

export default function SeatSelection() {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const { getShowById, getMovieById, createBooking, showToast } = useMovies();
  const { user } = useAuth();

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const show = getShowById(showId || '');
  const movie = show ? getMovieById(show.movieId) : undefined;

  if (!show || !movie) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="text-lg">Show not found.</p>
        <Link to="/movies" className="mt-4 inline-block px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold">
          Return to Movies
        </Link>
      </div>
    );
  }

  const isPast = isPastShowtime(show.date, show.time);

  const toggleSeat = (seatId: string) => {
    if (isPast) {
      showToast('This showtime has ended. Seat selection is disabled.', 'error');
      return;
    }
    if (show.bookedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirm = async () => {
    if (isPast) {
      showToast('Cannot reserve seats for a showtime that has ended.', 'error');
      return;
    }

    if (!user) {
      showToast('Please sign in or select an account to book tickets.', 'error');
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      showToast('Please select at least one seat to proceed.', 'info');
      return;
    }

    try {
      setSubmitting(true);
      const newBooking = await createBooking(user.id, show.id, selectedSeats);
      navigate(`/booking-confirmation/${newBooking.id}`);
    } catch (err: any) {
      setSelectedSeats([]);
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = selectedSeats.length * show.price;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Past Showtime Alert */}
      {isPast && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-600/40 text-amber-200 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Showtime Concluded:</span> This screening ({show.date} at {show.time}) has already passed. Seat reservations are closed.
          </div>
        </div>
      )}

      {/* Top Details */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to={`/movies/${movie.id}`}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Showtimes
        </Link>

        <div className="text-left sm:text-right">
          <h2 className="text-lg font-bold text-white">{movie.title}</h2>
          <p className="text-xs text-slate-400">
            {show.theatreName} • {show.date} at {show.time} • ${show.price.toFixed(2)} / ticket
          </p>
        </div>
      </div>

      {/* Seat Matrix */}
      <div className={isPast ? 'opacity-50 pointer-events-none' : ''}>
        <SeatGrid
          bookedSeats={show.bookedSeats}
          selectedSeats={selectedSeats}
          onSeatClick={toggleSeat}
          pricePerSeat={show.price}
        />
      </div>

      {/* Reservation Summary Footer */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="text-xs text-slate-400">Selected Seats:</div>
          <div className="text-sm font-bold text-white flex flex-wrap items-center gap-1.5 mt-1">
            {selectedSeats.length > 0 ? (
              selectedSeats.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-0.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-semibold"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic text-xs">No seats selected yet</span>
            )}
          </div>
          {selectedSeats.length === 0 && !isPast && (
            <div className="text-2xs text-amber-400/90 font-medium mt-1">
              Select seats on the cinema layout above to enable checkout.
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <div className="text-xs text-slate-400">Total Price</div>
            <div className="text-xl font-extrabold text-white">
              ${totalPrice.toFixed(2)}
            </div>
          </div>

          <button
            type="button"
            disabled={selectedSeats.length === 0 || submitting || isPast}
            onClick={handleConfirm}
            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              selectedSeats.length > 0 && !submitting && !isPast
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/40 hover:scale-105 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            {isPast ? (
              <>
                <Ban className="w-4 h-4" /> Show Concluded
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {submitting
                  ? 'Reserving...'
                  : selectedSeats.length === 0
                  ? 'Select Seats'
                  : `Confirm & Reserve (${selectedSeats.length})`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
