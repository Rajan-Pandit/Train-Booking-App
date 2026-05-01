import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';
import './BookingHistory.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      const response = await userAPI.getBookingHistory();
      setBookings(response.data.data || []);
    } catch (err) {
      setError('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return <Loader message="Loading booking history..." />;
  }

  return (
    <div className="booking-history">
      <div className="history-header">
        <h1>My Bookings</h1>
        <p>View and manage your train bookings</p>
      </div>

      <div className="history-content">
        <ErrorMessage message={error} />

        {bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.pnr} className="booking-card">
                <div className="booking-header">
                  <div className="booking-title">
                    <h3>{booking.trainName} ({booking.trainNumber})</h3>
                    <span className={`status ${getStatusColor(booking.status)}`}>
                      {booking.status || 'Confirmed'}
                    </span>
                  </div>
                  <div className="pnr-display">
                    PNR: {booking.pnr}
                  </div>
                </div>

                <div className="booking-details">
                  <div className="route-info">
                    <div className="route">
                      <span className="station">{booking.source}</span>
                      <span className="arrow">→</span>
                      <span className="station">{booking.destination}</span>
                    </div>
                    <div className="journey-date">
                      {new Date(booking.journeyDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="booking-info">
                    <div className="info-item">
                      <span className="label">Class:</span>
                      <span className="value">{booking.class}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Passengers:</span>
                      <span className="value">{booking.passengers?.length || 1}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Booked on:</span>
                      <span className="value">
                        {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  <Link
                    to={`/bookings/${booking.pnr}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                  {booking.status !== 'Cancelled' && booking.status !== 'completed' && (
                    <Link
                      to={`/bookings/${booking.pnr}/cancel`}
                      className="btn btn-danger"
                    >
                      Cancel Booking
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <h2>No Bookings Found</h2>
            <p>You haven't made any bookings yet.</p>
            <Link to="/trains" className="btn btn-primary">
              Book Your First Train
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
