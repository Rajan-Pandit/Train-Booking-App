import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './Components/common/Header';
import Footer from './Components/common/Footer';
import ProtectedRoute from './Components/common/ProtectedRoutes';
import Dashboard from './Components/dashboard/Dashboard';
import LoginForm from './Components/auth/LoginForm';
import RegisterForm from './Components/auth/RegisterForm';
import AuthLayout from './Components/auth/AuthLayout';
import TrainList from './Components/trains/TrainList';
import TrainDetails from './Components/trains/TrainDetails';
import SeatAvailability from './Components/trains/SeatAvailability';
import BookingConfirmation from './Components/booking/BookingConfirmation';
import BookingSummary from './Components/booking/BookingSummary';
import PassengerForm from './Components/booking/PassengerForm';
import PaymentPage from './Components/booking/PaymentPage';
import Profile from './Components/user/Profile';
import BookingHistory from './Components/user/BookingHistory';
import BookingDetails from './Components/user/BookingDetails';
import BookingCancel from './Components/user/BookingCancel';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <div className="container">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={
                  <AuthLayout>
                    <LoginForm />
                  </AuthLayout>
                } />
                <Route path="/register" element={
                  <AuthLayout>
                    <RegisterForm />
                  </AuthLayout>
                } />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/trains" element={
                  <ProtectedRoute>
                    <TrainList />
                  </ProtectedRoute>
                } />
                <Route path="/trains/:trainNumber" element={
                  <ProtectedRoute>
                    <TrainDetails />
                  </ProtectedRoute>
                } />
                <Route path="/trains/:trainNumber/seats" element={
                  <ProtectedRoute>
                    <SeatAvailability />
                  </ProtectedRoute>
                } />
                <Route path="/booking/passenger" element={
                  <ProtectedRoute>
                    <PassengerForm />
                  </ProtectedRoute>
                } />
                <Route path="/booking/summary" element={
                  <ProtectedRoute>
                    <BookingSummary />
                  </ProtectedRoute>
                } />
                <Route path="/booking/payment" element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                } />
                <Route path="/booking/confirmation" element={
                  <ProtectedRoute>
                    <BookingConfirmation />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <BookingHistory />
                  </ProtectedRoute>
                } />
                <Route path="/bookings/:pnr" element={
                  <ProtectedRoute>
                    <BookingDetails />
                  </ProtectedRoute>
                } />
                <Route path="/bookings/:pnr/cancel" element={
                  <ProtectedRoute>
                    <BookingCancel />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;