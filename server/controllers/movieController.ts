import { Request, Response, NextFunction } from 'express';
import { Movie, IMovie } from '../models/Movie';
import { isDbConnected } from '../config/db';
import { initialSeedMovies } from '../seed/seedData';

// Fallback in-memory movies store
let memoryMovies = initialSeedMovies.map((m, idx) => ({
  _id: `mov_${idx + 1}`,
  ...m,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

// @desc    Get all movies with filters & search
// @route   GET /api/movies
// @access  Public
export const getMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, genre, language } = req.query;

    if (isDbConnected()) {
      const query: any = {};

      if (search) {
        query.title = { $regex: String(search), $options: 'i' };
      }
      if (genre && genre !== 'All') {
        query.genre = { $in: [String(genre)] };
      }
      if (language) {
        query.language = String(language);
      }

      const movies = await Movie.find(query).sort({ rating: -1 });
      res.status(200).json({ success: true, count: movies.length, data: movies });
    } else {
      let filtered = [...memoryMovies];

      if (search) {
        const s = String(search).toLowerCase();
        filtered = filtered.filter(
          (m) => m.title.toLowerCase().includes(s) || m.description.toLowerCase().includes(s)
        );
      }

      if (genre && genre !== 'All') {
        filtered = filtered.filter((m) => m.genre.includes(String(genre)));
      }

      if (language) {
        filtered = filtered.filter((m) => m.language === String(language));
      }

      res.status(200).json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const movie = await Movie.findById(id);
      if (!movie) {
        res.status(404).json({ success: false, message: 'Movie not found.' });
        return;
      }
      res.status(200).json({ success: true, data: movie });
    } else {
      const movie = memoryMovies.find((m) => m._id === id);
      if (!movie) {
        res.status(404).json({ success: false, message: 'Movie not found.' });
        return;
      }
      res.status(200).json({ success: true, data: movie });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private / Admin
export const createMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, genre, language, duration, poster, rating, releaseDate, cast, director } = req.body;

    if (!title || !description || !genre || !duration || !poster) {
      res.status(400).json({ success: false, message: 'Please provide all required movie fields.' });
      return;
    }

    const genreArray = Array.isArray(genre) ? genre : String(genre).split(',').map((g) => g.trim());

    if (isDbConnected()) {
      const movie = await Movie.create({
        title,
        description,
        genre: genreArray,
        language: language || 'English',
        duration,
        poster,
        rating: Number(rating) || 8.0,
        releaseDate: releaseDate || new Date().toISOString().split('T')[0],
        cast: Array.isArray(cast) ? cast : cast ? [cast] : [],
        director,
      });

      res.status(201).json({ success: true, message: 'Movie created successfully.', data: movie });
    } else {
      const newMovie = {
        _id: `mov_${Date.now()}`,
        title,
        description,
        genre: genreArray,
        language: language || 'English',
        duration,
        poster,
        rating: Number(rating) || 8.0,
        releaseDate: releaseDate || new Date().toISOString().split('T')[0],
        cast: Array.isArray(cast) ? cast : cast ? [cast] : [],
        director,
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryMovies.unshift(newMovie as any);

      res.status(201).json({ success: true, message: 'Movie created successfully.', data: newMovie });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private / Admin
export const deleteMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const movie = await Movie.findByIdAndDelete(id);
      if (!movie) {
        res.status(404).json({ success: false, message: 'Movie not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Movie deleted successfully.' });
    } else {
      const initialLength = memoryMovies.length;
      memoryMovies = memoryMovies.filter((m) => m._id !== id);
      if (memoryMovies.length === initialLength) {
        res.status(404).json({ success: false, message: 'Movie not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Movie deleted successfully.' });
    }
  } catch (error) {
    next(error);
  }
};
