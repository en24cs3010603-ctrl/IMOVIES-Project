/**
 * file: src/pages/MyBookings.tsx
 * User booking history with cancellation and seat release
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, XCircle } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export default function MyBookings() {
  const { bookings, cancelBooking } = useMovies();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-rose-500" />
            My Bookings
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review your tickets or cancel reservations</p>
        </div>
        <Link
          to="/movies"
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-colors"
        >
          + Book New Tickets
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-slate-800">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You haven't reserved any movie tickets yet. Explore movies and pick your seats!
          </p>
          <Link
            to="/movies"
            className="mt-4 inline-block px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
          >
            Explore Movies
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={booking.moviePoster} 
                  alt={booking.movieTitle} 
                  className="w-16 h-20 object-cover rounded-xl shrink-0 shadow"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{booking.movieTitle}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-2xs font-bold uppercase ${
                      booking.status === 'confirmed' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {booking.theatreName} • {booking.date} at {booking.time}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xs text-slate-400">Seats:</span>
                    <div className="flex flex-wrap gap-1">
                      {booking.seats.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 text-2xs font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-2xs text-slate-400 block font-medium">Total Paid</span>
                  <span className="font-bold font-mono text-emerald-400 text-sm">${booking.totalAmount.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/booking-confirmation/${booking.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Ticket className="w-3.5 h-3.5 text-rose-400" /> View E-Ticket
                  </Link>

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
