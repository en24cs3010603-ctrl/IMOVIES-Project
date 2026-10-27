import mongoose, { Document, Schema } from 'mongoose';

export interface IShow extends Document {
  movie: mongoose.Types.ObjectId;
  theatre: mongoose.Types.ObjectId;
  screen: string;
  date: string;
  time: string;
  price: number;
  totalSeats: number;
  bookedSeats: string[];
  createdAt: Date;
  updatedAt: Date;
}

const showSchema = new Schema<IShow>(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
      index: true,
    },
    theatre: {
      type: Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
      index: true,
    },
    screen: {
      type: String,
      required: [true, 'Screen identifier is required'],
      default: 'Audi 1',
    },
    date: {
      type: String,
      required: [true, 'Show date is required (YYYY-MM-DD)'],
      index: true,
    },
    time: {
      type: String,
      required: [true, 'Show time is required'],
    },
    price: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [1, 'Price must be greater than 0'],
      default: 15,
    },
    totalSeats: {
      type: Number,
      default: 60,
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Show = mongoose.model<IShow>('Show', showSchema);
