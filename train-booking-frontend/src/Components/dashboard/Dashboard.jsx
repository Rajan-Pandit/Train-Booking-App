import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import SearchForm from './SearchForm';
import QuickLinks from './QuickLinks';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      const response = await userAPI.getBookingHistory();
      // Get only the 3 most recent bookings
      setRecentBookings((response.data.data || []).slice(0, 3));
    } catch (err) {
      setError('Failed to load recent bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.firstName}!</h1>
        <p>Ready to book your next journey?</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <SearchForm />
        </div>

        <div className="dashboard-section">
          <QuickLinks />
        </div>

        <div className="dashboard-section">
          <h2>Recent Bookings</h2>
          <ErrorMessage message={error} />

          {recentBookings.length > 0 ? (
            <div className="recent-bookings">
              {recentBookings.map((booking) => (
                <div key={booking.pnr} className="booking-card">
                  <div className="booking-info">
                    <h3>{booking.trainName} ({booking.trainNumber})</h3>
                    <p>{booking.source} → {booking.destination}</p>
                    <p>Journey Date: {new Date(booking.journeyDate).toLocaleDateString()}</p>
                    <p>PNR: {booking.pnr}</p>
                    <p>Class: {booking.class}</p>
                  </div>
                  <div className="booking-actions">
                    <Link to={`/bookings/${booking.pnr}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
              <div className="view-all">
                <Link to="/bookings" className="btn btn-secondary">
                  View All Bookings
                </Link>
              </div>
            </div>
          ) : (
            <div className="no-bookings">
              <p>No recent bookings found.</p>
              <Link to="/trains" className="btn btn-primary">
                Book Your First Train
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
