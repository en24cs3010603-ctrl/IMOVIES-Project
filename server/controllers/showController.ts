import { Request, Response, NextFunction } from 'express';
import { Show, IShow } from '../models/Show';
import { isDbConnected } from '../config/db';
import { initialSeedTheatres } from '../seed/seedData';

// Fallback in-memory theatres and shows
export const memoryTheatres = initialSeedTheatres.map((t, idx) => ({
  _id: `th_${idx + 1}`,
  ...t,
}));

const getFutureDate = (daysAhead: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

let memoryShows = [
  {
    _id: 'sh_101',
    movie: 'mov_1',
    theatre: 'th_1',
    screen: 'Audi 1 (IMAX)',
    date: getFutureDate(0),
    time: '01:45 PM', // Past show on current day
    price: 18,
    totalSeats: 60,
    bookedSeats: ['A3', 'A4', 'B5', 'B6'],
    movieDetails: { title: 'Dune: Part Two' },
    theatreDetails: { name: 'Grand Cinema IMAX', location: 'Downtown Mall, Floor 4' },
  },
  {
    _id: 'sh_102',
    movie: 'mov_1',
    theatre: 'th_1',
    screen: 'Audi 1 (IMAX)',
    date: getFutureDate(0),
    time: '11:30 PM', // Upcoming late night show today
    price: 20,
    totalSeats: 60,
    bookedSeats: ['C1', 'C2', 'D4', 'D5', 'D6'],
    movieDetails: { title: 'Dune: Part Two' },
    theatreDetails: { name: 'Grand Cinema IMAX', location: 'Downtown Mall, Floor 4' },
  },
  {
    _id: 'sh_103',
    movie: 'mov_1',
    theatre: 'th_2',
    screen: 'Screen 2 (VIP)',
    date: getFutureDate(1), // Tomorrow
    time: '04:30 PM',
    price: 22,
    totalSeats: 60,
    bookedSeats: ['B1', 'B2'],
    movieDetails: { title: 'Dune: Part Two' },
    theatreDetails: { name: 'Cinepolis VIP Royale', location: 'Westside Promenade' },
  },
  {
    _id: 'sh_201',
    movie: 'mov_2',
    theatre: 'th_1',
    screen: 'Audi 2 (70mm)',
    date: getFutureDate(1), // Tomorrow
    time: '07:15 PM',
    price: 18,
    totalSeats: 60,
    bookedSeats: ['A1', 'A2', 'E5'],
    movieDetails: { title: 'Oppenheimer' },
    theatreDetails: { name: 'Grand Cinema IMAX', location: 'Downtown Mall, Floor 4' },
  },
  {
    _id: 'sh_301',
    movie: 'mov_3',
    theatre: 'th_1',
    screen: 'Audi 1 (IMAX)',
    date: getFutureDate(2), // 2 days ahead
    time: '08:45 PM',
    price: 16,
    totalSeats: 60,
    bookedSeats: ['F1', 'F2'],
    movieDetails: { title: 'Interstellar' },
    theatreDetails: { name: 'Grand Cinema IMAX', location: 'Downtown Mall, Floor 4' },
  },
];

// Export getter/setter for memory shows to support memory booking controller
export const getMemoryShows = () => memoryShows;
export const setMemoryShows = (newShows: any[]) => {
  memoryShows = newShows;
};

// @desc    Get shows with optional movie/theatre filter
// @route   GET /api/shows
// @access  Public
export const getShows = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { movieId, theatreId, date } = req.query;

    if (isDbConnected()) {
      const query: any = {};
      if (movieId) query.movie = movieId;
      if (theatreId) query.theatre = theatreId;
      if (date) query.date = date;

      const shows = await Show.find(query).populate('movie').populate('theatre');
      res.status(200).json({ success: true, count: shows.length, data: shows });
    } else {
      let filtered = [...memoryShows];
      if (movieId) {
        filtered = filtered.filter((s) => s.movie === String(movieId));
      }
      if (theatreId) {
        filtered = filtered.filter((s) => s.theatre === String(theatreId));
      }
      if (date) {
        filtered = filtered.filter((s) => s.date === String(date));
      }

      res.status(200).json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show by ID with seat availability
// @route   GET /api/shows/:id
// @access  Public
export const getShowById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const show = await Show.findById(id).populate('movie').populate('theatre');
      if (!show) {
        res.status(404).json({ success: false, message: 'Showtime not found.' });
        return;
      }
      res.status(200).json({ success: true, data: show });
    } else {
      const show = memoryShows.find((s) => s._id === id);
      if (!show) {
        res.status(404).json({ success: false, message: 'Showtime not found.' });
        return;
      }
      res.status(200).json({ success: true, data: show });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new showtime
// @route   POST /api/shows
// @access  Private / Admin
export const createShow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { movie, theatre, screen, date, time, price } = req.body;

    if (!movie || !theatre || !screen || !date || !time || !price) {
      res.status(400).json({ success: false, message: 'Please provide all required showtime parameters.' });
      return;
    }

    if (isDbConnected()) {
      const show = await Show.create({
        movie,
        theatre,
        screen,
        date,
        time,
        price: Number(price),
        totalSeats: 60,
        bookedSeats: [],
      });

      const populated = await Show.findById(show._id).populate('movie').populate('theatre');
      res.status(201).json({ success: true, message: 'Showtime scheduled successfully.', data: populated });
    } else {
      const newShow = {
        _id: `sh_${Date.now()}`,
        movie: String(movie),
        theatre: String(theatre),
        screen,
        date,
        time,
        price: Number(price),
        totalSeats: 60,
        bookedSeats: [],
        movieDetails: { title: 'Selected Feature' },
        theatreDetails: { name: 'Main Auditorium', location: 'Level 2' },
      };
      memoryShows.unshift(newShow);

      res.status(201).json({ success: true, message: 'Showtime scheduled successfully.', data: newShow });
    }
  } catch (error) {
    next(error);
  }
};
