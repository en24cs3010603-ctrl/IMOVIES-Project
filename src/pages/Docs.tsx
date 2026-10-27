import React, { useState } from 'react';
import { BookOpen, Server, Database, Shield, Cpu, Code, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Docs() {
  const [activeTab, setActiveTab] = useState<'arch' | 'api' | 'db' | 'concurrency'>('arch');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Developer Reference & Specifications</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              IMovies Architecture & Technical Documentation
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Complete blueprint for the MERN Stack implementation, data flow, API specs, and schema design.
            </p>
          </div>
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-semibold transition-colors self-start md:self-auto shadow-lg shadow-rose-950/40"
          >
            <span>Browse Cinema UI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('arch')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'arch'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            1. Architecture & Data Flow
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'api'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            2. REST API Endpoints
          </button>
          <button
            onClick={() => setActiveTab('db')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'db'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            3. Database Models (Mongoose)
          </button>
          <button
            onClick={() => setActiveTab('concurrency')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'concurrency'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            4. Double-Booking Prevention
          </button>
        </div>

        {/* Tab 1: Architecture */}
        {activeTab === 'arch' && (
          <div className="space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-rose-400" />
                MERN Client-Server Architecture
              </h2>
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
                {`+-----------------------------------------------------------------------------------+
|                            CLIENT TIER (React 19 + Vite)                          |
|  - Pages: Home, Movies, MovieDetails, SeatSelection, MyBookings, AdminDashboard    |
|  - State: AuthContext (JWT bearer token) & MovieContext (real-time availability)  |
|  - HTTP: Axios instance with Request Interceptor (Authorization: Bearer <token>)  |
+-----------------------------------------------------------------------------------+
                                        |  HTTP/JSON (REST APIs)
                                        v
+-----------------------------------------------------------------------------------+
|                        APPLICATION SERVER (Node.js + Express)                      |
|  - Middlewares: cors, express.json(), authMiddleware (JWT), adminOnly check       |
|  - Controllers: AuthController, MovieController, ShowController, BookingController|
|  - Routing: /api/auth, /api/movies, /api/shows, /api/bookings                     |
+-----------------------------------------------------------------------------------+
                                        |  Mongoose ODM (Driver connection pool)
                                        v
+-----------------------------------------------------------------------------------+
|                          DATABASE TIER (MongoDB Atlas)                            |
|  - Collections: users, movies, theatres, shows, bookings                          |
|  - Atomic Operations: $addToSet & $nin for race-free seat reservations            |
+-----------------------------------------------------------------------------------+`}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4 text-rose-400" />
                  Frontend Modular Structure (/src)
                </h3>
                <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-800">
{`src/
├── api/             # Axios instance & interceptors
│   └── axios.ts
├── components/      # Reusable UI widgets
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── MovieCard.tsx
│   ├── SeatGrid.tsx
│   ├── ProtectedRoute.tsx
│   ├── Loader.tsx
│   └── Toast.tsx
├── context/         # React Context state management
│   ├── AuthContext.tsx
│   └── MovieContext.tsx
├── pages/           # Routed page views
│   ├── Home.tsx
│   ├── Movies.tsx
│   ├── MovieDetails.tsx
│   ├── SeatSelection.tsx
│   ├── BookingConfirmation.tsx
│   ├── MyBookings.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── AdminDashboard.tsx
│   └── Docs.tsx
└── types/           # TypeScript interfaces
    └── index.ts`}
                </pre>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  Backend Structure (/server)
                </h3>
                <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-800">
{`server/
├── config/
│   └── db.js            # MongoDB Mongoose connection
├── controllers/
│   ├── authController.js
│   ├── movieController.js
│   ├── showController.js
│   └── bookingController.js
├── middleware/
│   ├── auth.js          # verifyJWT & verifyAdmin
│   └── errorHandler.js  # Centralized error handler
├── models/
│   ├── User.js
│   ├── Movie.js
│   ├── Theatre.js
│   ├── Show.js
│   └── Booking.js
├── routes/
│   ├── authRoutes.js
│   ├── movieRoutes.js
│   ├── showRoutes.js
│   └── bookingRoutes.js
├── seed/
│   └── seed.js          # Demo dataset generator
└── server.js            # Main Express app entry`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: REST API Endpoints */}
        {activeTab === 'api' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Complete REST API Specification</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Endpoint</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Auth Required</th>
                    <th className="py-3 px-4">Access Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">POST</span></td>
                    <td className="py-3 px-4 font-mono text-rose-300">/api/auth/register</td>
                    <td className="py-3 px-4">Register user & receive JWT token</td>
                    <td className="py-3 px-4 text-slate-500">No</td>
                    <td className="py-3 px-4">Public</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">POST</span></td>
                    <td className="py-3 px-4 font-mono text-rose-300">/api/auth/login</td>
                    <td className="py-3 px-4">Authenticate user and return JWT</td>
                    <td className="py-3 px-4 text-slate-500">No</td>
                    <td className="py-3 px-4">Public</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">GET</span></td>
                    <td className="py-3 px-4 font-mono text-rose-300">/api/movies</td>
                    <td className="py-3 px-4">Get movies with genre/search query filters</td>
                    <td className="py-3 px-4 text-slate-500">No</td>
                    <td className="py-3 px-4">Public</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">GET</span></td>
                    <td className="py-3 px-4 font-mono text-rose-300">/api/movies/:id</td>
                    <td className="py-3 px-4">Get single movie details & cast info</td>
                    <td className="py-3 px-4 text-slate-500">No</td>
                    <td className="py-3 px-4">Public</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">GET</span></td>
                    <td className="py-3 px-4 font-mono text-rose-300">/api/shows?movieId=...</td>
                    <td className="py-3 px-4">Get active shows and booked seat arrays</td>
                    <td className="py-3 px-4 text-slate-500">No</td>
                    <td className="py-3 px-4">Public</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">POST</span></td>
                    <td className="py-3 px-4 font-mono text-rose-300">/api/bookings</td>
                    <td className="py-3 px-4">Atomic seat reservation & ticket creation</td>
                    <td className="py-3 px-4 text-amber-400">Yes (JWT)</td>
                    <td className="py-3 px-4">Customer</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">GET</span></td>
                    <td className="py-3 px-4 font-mono text-rose-300">/api/bookings/my</td>
                    <td className="py-3 px-4">List current user's ticket reservations</td>
                    <td className="py-3 px-4 text-amber-400">Yes (JWT)</td>
                    <td className="py-3 px-4">Customer</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">PUT</span></td>
                    <td className="py-3 px-4 font-mono text-rose-300">/api/bookings/:id/cancel</td>
                    <td className="py-3 px-4">Cancel reservation & release seats on show</td>
                    <td className="py-3 px-4 text-amber-400">Yes (JWT)</td>
                    <td className="py-3 px-4">Customer / Admin</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">POST</span></td>
                    <td className="py-3 px-4 font-mono text-rose-300">/api/movies</td>
                    <td className="py-3 px-4">Create new movie release</td>
                    <td className="py-3 px-4 text-rose-400">Yes (JWT)</td>
                    <td className="py-3 px-4 font-semibold text-rose-400">Admin Only</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">DELETE</span></td>
                    <td className="py-3 px-4 font-mono text-rose-300">/api/movies/:id</td>
                    <td className="py-3 px-4">Delete movie and associated shows</td>
                    <td className="py-3 px-4 text-rose-400">Yes (JWT)</td>
                    <td className="py-3 px-4 font-semibold text-rose-400">Admin Only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Database Models */}
        {activeTab === 'db' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                Show Schema (with bookedSeats)
              </h3>
              <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-800">
{`const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true
  },
  screen: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  bookedSeats: [{ type: String }] // ['A1', 'A2', 'B5']
}, { timestamps: true });`}
              </pre>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-400" />
                Booking Schema (Explicit Foreign Keys)
              </h3>
              <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-800">
{`const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  },
  seats: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['CONFIRMED', 'CANCELLED'],
    default: 'CONFIRMED'
  }
}, { timestamps: true });`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Concurrency & Double Booking */}
        {activeTab === 'concurrency' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Atomic Double-Booking Prevention in MongoDB
            </h2>
            <p className="text-slate-300 text-sm">
              In high-traffic cinema reservations, two users can click "Pay & Reserve" for seat <code className="text-rose-400 font-mono">B3</code> at the exact same millisecond. Traditional check-then-insert patterns cause double-booking bugs. In our backend, we use atomic updates with MongoDB query predicates:
            </p>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto">
{`// Atomic seat reservation controller
const updatedShow = await Show.findOneAndUpdate(
  {
    _id: showId,
    bookedSeats: { $nin: requestedSeats } // Only matches if NONE of requested seats are booked
  },
  {
    $addToSet: { bookedSeats: { $each: requestedSeats } } // Appends atomically
  },
  { new: true }
);

if (!updatedShow) {
  return res.status(409).json({
    message: 'One or more selected seats were already booked by another customer. Please choose different seats.'
  });
}

// Seat lock succeeded atomically -> create booking record
const booking = await Booking.create({
  user: req.user._id,
  show: showId,
  seats: requestedSeats,
  totalAmount: requestedSeats.length * show.price,
  status: 'CONFIRMED'
});`}
            </div>
            <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-xs text-emerald-300">
              <span className="font-bold">Guaranteed Safety:</span> Because MongoDB document updates are atomic at the single-document level, even if 100 simultaneous requests hit the show document, only the first request to lock the seat succeeds. All other 99 requests will fail the <code className="font-mono text-emerald-200">$nin</code> predicate and receive a clean 409 Conflict error.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
