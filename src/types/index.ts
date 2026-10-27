/**
 * file: src/types/index.ts
 * IMovies Shared TypeScript Definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  language: string;
  duration: number;
  rating: number;
  poster: string;
  description: string;
  releaseDate: string;
  cast: string[];
}

export interface Theatre {
  id: string;
  name: string;
  location: string;
  screens: {
    screenNumber: number;
    capacity: number;
    screenType: string;
  }[];
}

export interface Show {
  id: string;
  movieId: string;
  theatreName: string;
  location: string;
  screen: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  bookedSeats: string[];
}

export interface Booking {
  id: string;
  userId: string;
  showId: string;
  movieId: string;
  theatreId: string;
  movieTitle: string;
  moviePoster: string;
  theatreName: string;
  date: string;
  time: string;
  seats: string[];
  totalAmount: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}
