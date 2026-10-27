/**
 * file: src/pages/BookingConfirmation.tsx
 * Cinema e-ticket receipt and confirmation screen
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MapPin, Calendar, Printer, Film } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export default function BookingConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { bookings } = useMovies();

  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="text-lg">Booking record not found.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn py-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-950/40">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Booking Confirmed!</h1>
        <p className="text-xs text-slate-400 mt-1">Your e-tickets have been reserved and verified in the cinema database.</p>
      </div>

      {/* Physical Cinema Ticket Card with Tear-Off Notches */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Ticket Header Section */}
        <div className="p-6 sm:p-8 flex gap-5">
          <img 
            src={booking.moviePoster} 
            alt={booking.movieTitle} 
            className="w-20 h-28 object-cover rounded-xl shadow-md shrink-0 border border-slate-700/50"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-2xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                <Film className="w-3 h-3" /> Confirmed E-Ticket
              </span>
              <span className="text-2xs font-mono text-slate-500 uppercase">{booking.status}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5 leading-snug">{booking.movieTitle}</h2>
            <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {booking.theatreName}
            </p>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {booking.date} • {booking.time}
            </p>
          </div>
        </div>

        {/* Perforated Divider with Circular Notches */}
        <div className="relative flex items-center justify-between my-0">
          {/* Left Notch */}
          <div className="w-6 h-12 bg-slate-950 border-r border-slate-800 rounded-r-full -ml-3 z-10" />
          {/* Dashed Tear Line */}
          <div className="flex-1 border-b-2 border-dashed border-slate-800 mx-1" />
          {/* Right Notch */}
          <div className="w-6 h-12 bg-slate-950 border-l border-slate-800 rounded-l-full -mr-3 z-10" />
        </div>

        {/* Ticket Lower Stub */}
        <div className="p-6 sm:p-8 space-y-5 bg-slate-950/70">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Booking ID</span>
              <span className="font-mono font-bold text-white text-xs sm:text-sm tracking-wider">
                {booking.id}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Total Paid</span>
              <span className="font-mono font-bold text-emerald-400 text-sm sm:text-base">
                ${booking.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-xs block mb-1.5 font-medium">Reserved Seats</span>
            <div className="flex flex-wrap gap-2">
              {booking.seats.map((s) => (
                <span key={s} className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs font-mono shadow-sm">
                  Seat {s}
                </span>
              ))}
            </div>
          </div>

          {/* Barcode Mock Visual */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col items-center justify-center gap-1.5">
            <div className="flex items-center gap-[3px] h-9 px-4 bg-white/5 rounded py-1">
              <div className="w-1 h-full bg-slate-400" />
              <div className="w-0.5 h-full bg-slate-400" />
              <div className="w-1.5 h-full bg-slate-400" />
              <div className="w-0.5 h-full bg-slate-400" />
              <div className="w-1 h-full bg-slate-400" />
              <div className="w-2 h-full bg-slate-400" />
              <div className="w-0.5 h-full bg-slate-400" />
              <div className="w-1 h-full bg-slate-400" />
              <div className="w-1.5 h-full bg-slate-400" />
              <div className="w-0.5 h-full bg-slate-400" />
              <div className="w-1 h-full bg-slate-400" />
              <div className="w-2 h-full bg-slate-400" />
              <div className="w-1 h-full bg-slate-400" />
              <div className="w-0.5 h-full bg-slate-400" />
              <div className="w-1.5 h-full bg-slate-400" />
            </div>
            <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">
              SCAN AT CINEMA TURNSTILE • {booking.id.slice(0, 12)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-300" /> Print Ticket
        </button>
        <Link
          to="/my-bookings"
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
        >
          My Bookings
        </Link>
        <Link
          to="/movies"
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/30 transition-colors"
        >
          Book Another Movie
        </Link>
      </div>
    </div>
  );
}
