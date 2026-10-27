import { Response, NextFunction } from 'express';
import { Booking } from '../models/Booking';
import { Show } from '../models/Show';
import { AuthRequest } from '../middleware/auth';
import { isDbConnected } from '../config/db';
import { getMemoryShows, setMemoryShows } from './showController';

// Fallback in-memory bookings store
let memoryBookings: any[] = [
  {
    _id: 'bkg_demo_101',
    user: 'usr_demo_1',
    show: 'sh_101',
    showId: 'sh_101',
    movieId: 'mov_1',
    theatreId: 'th_1',
    seats: ['A3', 'A4'],
    totalAmount: 36,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    showDetails: {
      movieTitle: 'Dune: Part Two',
      theatreName: 'Grand Cinema IMAX',
      date: new Date().toISOString().split('T')[0],
      time: '01:45 PM',
      screen: 'Audi 1 (IMAX)',
    },
  },
];

// Helper to determine if a showtime is in the past
export const isPastShowtime = (dateStr: string, timeStr: string): boolean => {
  if (!dateStr) return false;
  try {
    let hours = 0;
    let minutes = 0;

    if (timeStr) {
      const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (match) {
        hours = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
        const meridiem = match[3] ? match[3].toUpperCase() : null;
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
      }
    }

    const showDate = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
    if (isNaN(showDate.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const parsedDate = new Date(dateStr);
      return parsedDate < today;
    }

    return showDate.getTime() < Date.now();
  } catch {
    return false;
  }
};

// @desc    Create new booking with atomic seat lock (Double-booking prevention)
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required to reserve seats.' });
      return;
    }

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      res.status(400).json({ success: false, message: 'Please select at least one seat to proceed.' });
      return;
    }

    if (isDbConnected()) {
      // 1. Fetch show to check validity & pricing
      const show = await Show.findById(showId);
      if (!show) {
        res.status(404).json({ success: false, message: 'Showtime not found.' });
        return;
      }

      // 2. Prevent booking tickets for past showtimes
      if (isPastShowtime(show.date, show.time)) {
        res.status(400).json({
          success: false,
          message: 'Cannot reserve tickets for past showtimes. Please select an upcoming screening.',
        });
        return;
      }

      // 3. ATOMIC SEAT LOCK: Atomically add seats ONLY if NONE of them currently exist in bookedSeats
      // Using $nin prevents race conditions and concurrent double-bookings without full database table locks.
      const updatedShow = await Show.findOneAndUpdate(
        {
          _id: showId,
          bookedSeats: { $nin: seats },
        },
        {
          $addToSet: { bookedSeats: { $each: seats } },
        },
        { new: true }
      );

      // If updatedShow is null, the query predicate failed because at least one seat was already booked
      if (!updatedShow) {
        res.status(409).json({
          success: false,
          message: 'One or more of the selected seats were just reserved by another user. Please choose alternative seats.',
        });
        return;
      }

      // 4. Create the booking document explicitly storing showId, movieId, and theatreId
      const totalAmount = seats.length * show.price;
      const booking = await Booking.create({
        user: userId,
        show: showId,
        showId: show._id.toString(),
        movieId: show.movie.toString(),
        theatreId: show.theatre.toString(),
        seats,
        totalAmount,
        status: 'CONFIRMED',
      });

      const populatedBooking = await Booking.findById(booking._id)
        .populate({
          path: 'show',
          populate: [{ path: 'movie' }, { path: 'theatre' }],
        });

      res.status(201).json({
        success: true,
        message: 'Seats booked successfully!',
        data: populatedBooking,
      });
    } else {
      // In-memory atomic reservation simulation
      const shows = getMemoryShows();
      const showIndex = shows.findIndex((s) => s._id === showId);
      if (showIndex === -1) {
        res.status(404).json({ success: false, message: 'Showtime not found.' });
        return;
      }

      const show = shows[showIndex];

      // Prevent booking past showtimes in fallback mode
      if (isPastShowtime(show.date, show.time)) {
        res.status(400).json({
          success: false,
          message: 'Cannot reserve tickets for past showtimes. Please select an upcoming screening.',
        });
        return;
      }

      // Check collision
      const hasConflict = seats.some((seat: string) => show.bookedSeats.includes(seat));
      if (hasConflict) {
        res.status(409).json({
          success: false,
          message: 'One or more of the selected seats were just reserved by another user. Please choose alternative seats.',
        });
        return;
      }

      // Atomically append
      const updatedShows = [...shows];
      updatedShows[showIndex] = {
        ...show,
        bookedSeats: [...show.bookedSeats, ...seats],
      };
      setMemoryShows(updatedShows);

      const totalAmount = seats.length * show.price;
      const newBooking = {
        _id: `bkg_${Date.now()}`,
        user: userId,
        show: showId,
        showId: String(show._id),
        movieId: String(show.movie),
        theatreId: String(show.theatre),
        seats,
        totalAmount,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        showDetails: {
          movieTitle: show.movieDetails?.title || 'Selected Movie',
          theatreName: show.theatreDetails?.name || 'Grand Cinema',
          date: show.date,
          time: show.time,
          screen: show.screen,
        },
      };
      memoryBookings.unshift(newBooking);

      res.status(201).json({
        success: true,
        message: 'Seats booked successfully!',
        data: newBooking,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's personal bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (isDbConnected()) {
      const bookings = await Booking.find({ user: userId })
        .populate({
          path: 'show',
          populate: [{ path: 'movie' }, { path: 'theatre' }],
        })
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } else {
      const userBookings = memoryBookings.filter((b) => b.user === userId);
      res.status(200).json({ success: true, count: userBookings.length, data: userBookings });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking and atomically release seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (isDbConnected()) {
      const booking = await Booking.findById(id);

      if (!booking) {
        res.status(404).json({ success: false, message: 'Booking not found.' });
        return;
      }

      // Only the booking owner or an admin can cancel
      if (booking.user.toString() !== userId && userRole !== 'admin') {
        res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking.' });
        return;
      }

      if (booking.status === 'CANCELLED') {
        res.status(400).json({ success: false, message: 'This booking has already been cancelled.' });
        return;
      }

      // 1. Release seats specifically on the matched showId (never by title or theatre)
      const targetShowId = booking.showId || (booking.show && (booking.show as any)._id ? (booking.show as any)._id : booking.show);
      await Show.findByIdAndUpdate(targetShowId, {
        $pull: { bookedSeats: { $in: booking.seats } },
      });

      // 2. Mark booking as CANCELLED
      booking.status = 'CANCELLED';
      await booking.save();

      res.status(200).json({
        success: true,
        message: 'Booking cancelled and seats have been released successfully.',
        data: booking,
      });
    } else {
      const booking = memoryBookings.find((b) => b._id === id);

      if (!booking) {
        res.status(404).json({ success: false, message: 'Booking not found.' });
        return;
      }

      if (booking.user !== userId && userRole !== 'admin') {
        res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking.' });
        return;
      }

      if (booking.status === 'CANCELLED') {
        res.status(400).json({ success: false, message: 'This booking has already been cancelled.' });
        return;
      }

      // Release seats ONLY on the specific booked show matched by showId
      const targetShowId = String(booking.showId || booking.show?._id || booking.show);
      const shows = getMemoryShows();
      const showIndex = shows.findIndex((s) => s._id === targetShowId);
      if (showIndex !== -1) {
        const show = shows[showIndex];
        const updatedBookedSeats = show.bookedSeats.filter((seat: string) => !booking.seats.includes(seat));
        shows[showIndex] = { ...show, bookedSeats: updatedBookedSeats };
        setMemoryShows(shows);
      }

      booking.status = 'CANCELLED';

      res.status(200).json({
        success: true,
        message: 'Booking cancelled and seats have been released successfully.',
        data: booking,
      });
    }
  } catch (error) {
    next(error);
  }
};
