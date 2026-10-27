import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Movie } from '../models/Movie';
import { Theatre } from '../models/Theatre';
import { Show } from '../models/Show';
import { Booking } from '../models/Booking';
import { initialSeedUsers, initialSeedTheatres, initialSeedMovies } from './seedData';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies_db';

export const runSeed = async () => {
  try {
    console.log('🌱 [Seed Script] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB. Purging collections...');

    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});

    console.log('Collections cleared. Inserting users...');
    // Seed users with pre-save password encryption
    const createdUsers = [];
    for (const u of initialSeedUsers) {
      const userDoc = new User(u);
      await userDoc.save();
      createdUsers.push(userDoc);
    }
    console.log(`✅ Seeded ${createdUsers.length} users.`);

    console.log('Inserting theatres...');
    const createdTheatres = await Theatre.insertMany(initialSeedTheatres);
    console.log(`✅ Seeded ${createdTheatres.length} theatres.`);

    console.log('Inserting movies...');
    const createdMovies = await Movie.insertMany(initialSeedMovies);
    console.log(`✅ Seeded ${createdMovies.length} movies.`);

    console.log('Generating showtimes and screens...');
    const today = new Date().toISOString().split('T')[0];
    const times = ['10:30 AM', '01:45 PM', '04:30 PM', '07:30 PM', '10:15 PM'];
    const createdShows: any[] = [];

    for (const movie of createdMovies) {
      for (const theatre of createdTheatres) {
        for (let i = 0; i < 2; i++) {
          const showTime: string = times[(createdShows.length + i) % times.length];
          const bookedSeats = i === 0 ? ['A3', 'A4', 'B5', 'B6'] : ['C1', 'C2'];
          const show = await Show.create({
            movie: movie._id,
            theatre: theatre._id,
            screen: `Screen ${i + 1}`,
            date: today,
            time: showTime,
            price: 15,
            totalSeats: 60,
            bookedSeats,
          });
          createdShows.push(show);
        }
      }
    }
    console.log(`✅ Seeded ${createdShows.length} shows.`);

    console.log('Generating initial demo booking...');
    if (createdUsers.length > 0 && createdShows.length > 0) {
      await Booking.create({
        user: createdUsers[0]._id,
        show: createdShows[0]._id,
        seats: ['A3', 'A4'],
        totalAmount: 30,
        status: 'CONFIRMED',
      });
      console.log('✅ Created demo booking for customer.');
    }

    console.log('🎉 [Seed Script] Database seeded successfully!');
  } catch (error: any) {
    console.error('❌ [Seed Script Error]:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

// Allow direct execution via CLI
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  runSeed().then(() => process.exit(0));
}
