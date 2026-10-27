import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './server/config/db';
import authRoutes from './server/routes/authRoutes';
import movieRoutes from './server/routes/movieRoutes';
import showRoutes from './server/routes/showRoutes';
import bookingRoutes from './server/routes/bookingRoutes';
import { errorHandler } from './server/middleware/errorHandler';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    app: 'IMovies Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

// Centralized Error Handling Middleware for APIs
app.use(errorHandler);

// Development vs Production serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Vite Dev Server middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 [IMovies] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
