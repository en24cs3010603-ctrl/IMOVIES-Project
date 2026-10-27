import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies_db';

export const connectDB = async (): Promise<boolean> => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ [MongoDB] No MONGO_URI defined in environment. Using fallback or local URI.');
    }

    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if no local/remote daemon is running
    });

    console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`ℹ️ [MongoDB] Database connection notice: ${error.message}`);
    console.warn('⚡ [IMovies Engine] Running with active in-memory database store with MongoDB compatibility mode.');
    return false;
  }
};

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
