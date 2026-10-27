import mongoose, { Document, Schema } from 'mongoose';

export interface ITheatre extends Document {
  name: string;
  location: string;
  screens: number;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const theatreSchema = new Schema<ITheatre>(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Theatre location is required'],
      trim: true,
    },
    screens: {
      type: Number,
      required: [true, 'Number of screens is required'],
      default: 4,
    },
    amenities: {
      type: [String],
      default: ['Dolby Atmos', 'Recliner Seating', '4K Laser Projection', 'Snack Bar'],
    },
  },
  {
    timestamps: true,
  }
);

export const Theatre = mongoose.model<ITheatre>('Theatre', theatreSchema);
