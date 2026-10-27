import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: string;
  poster: string;
  rating: number;
  releaseDate: string;
  cast: string[];
  director?: string;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
    },
    language: {
      type: String,
      default: 'English',
    },
    duration: {
      type: String,
      required: [true, 'Movie duration is required'],
    },
    poster: {
      type: String,
      required: [true, 'Poster image URL is required'],
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: 8.0,
    },
    releaseDate: {
      type: String,
      required: true,
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Movie = mongoose.model<IMovie>('Movie', movieSchema);
