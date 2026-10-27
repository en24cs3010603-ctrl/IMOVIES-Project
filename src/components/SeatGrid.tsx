/**
 * file: src/components/SeatGrid.tsx
 * Cinema Seat Selection Matrix with mobile 360px responsiveness & real-time states
 */
import React from 'react';

interface SeatGridProps {
  bookedSeats: string[];
  selectedSeats: string[];
  onSeatClick: (seatId: string) => void;
  pricePerSeat: number;
}

export default function SeatGrid({
  bookedSeats,
  selectedSeats,
  onSeatClick,
  pricePerSeat,
}: SeatGridProps) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 shadow-xl">
      {/* Cinema Screen Curve Graphic */}
      <div className="max-w-xl mx-auto text-center mb-8">
        <div className="h-2 w-full bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded-full mb-2 shadow-lg shadow-rose-500/50" />
        <span className="text-2xs uppercase tracking-widest text-slate-400 font-bold">
          ALL EYES THIS WAY (CINEMA SCREEN)
        </span>
      </div>

      {/* Seat State Legend */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300 mb-8">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-rose-600 shadow-sm shadow-rose-600/50" />
          <span className="text-white font-semibold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-slate-700/40 border border-slate-700/60 opacity-40" />
          <span className="text-slate-500">Booked</span>
        </div>
      </div>

      {/* Interactive Seat Matrix (Rows A-F, Cols 1-10) with 360px fluid responsiveness */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center">
        <div className="min-w-fit px-1 sm:px-2 flex flex-col items-center gap-1.5 sm:gap-2">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-4 sm:w-5 text-center text-[10px] sm:text-xs font-bold text-slate-500">
                {row}
              </span>
              <div className="flex gap-1 sm:gap-1.5 md:gap-2">
                {cols.map((col) => {
                  const seatId = `${row}${col}`;
                  const isBooked = bookedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <button
                      key={seatId}
                      type="button"
                      disabled={isBooked}
                      onClick={() => onSeatClick(seatId)}
                      title={`Seat ${seatId} - $${pricePerSeat.toFixed(2)}`}
                      className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                        isBooked
                          ? 'bg-slate-800/40 border border-slate-800 text-slate-600 cursor-not-allowed'
                          : isSelected
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/50 scale-105 ring-2 ring-rose-400/40'
                          : 'bg-slate-800 border border-slate-700/80 text-slate-300 hover:border-rose-500 hover:bg-slate-700'
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
              <span className="w-4 sm:w-5 text-center text-[10px] sm:text-xs font-bold text-slate-500">
                {row}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
