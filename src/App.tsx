import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Docs from './pages/Docs';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MovieProvider>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
            <Navbar />
            <Toast />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
                <Route
                  path="/seats/:showId"
                  element={
                    <ProtectedRoute>
                      <SeatSelection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking-confirmation/:id"
                  element={
                    <ProtectedRoute>
                      <BookingConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </MovieProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
