import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  show: mongoose.Types.ObjectId;
  showId: string;
  movieId: string;
  theatreId: string;
  seats: string[];
  totalAmount: number;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    show: {
      type: Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Show reference is required'],
      index: true,
    },
    showId: {
      type: String,
      required: [true, 'showId is required'],
      index: true,
    },
    movieId: {
      type: String,
      required: [true, 'movieId is required'],
      index: true,
    },
    theatreId: {
      type: String,
      required: [true, 'theatreId is required'],
      index: true,
    },
    seats: {
      type: [String],
      required: [true, 'At least one seat must be selected'],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A booking must have at least one seat assigned.',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
