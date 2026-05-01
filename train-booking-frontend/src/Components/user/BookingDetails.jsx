import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingAPI } from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';
import './BookingDetails.css';

const BookingDetails = () => {
  const { pnr } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [pnr]);

  const fetchBookingDetails = async () => {
    try {
      const response = await bookingAPI.getBookingByPNR(pnr);
      setBooking(response.data.data);
    } catch (err) {
      setError('Failed to load booking details');
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
    return <Loader message="Loading booking details..." />;
  }

  if (error || !booking) {
    return (
      <div className="booking-details">
        <ErrorMessage message={error || 'Booking not found'} />
        <Link to="/bookings" className="btn btn-primary">
          Back to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="booking-details">
      <div className="details-header">
        <h1>Booking Details</h1>
        <div className="pnr-status">
          <div className="pnr-display">
            PNR: <strong>{booking.pnr}</strong>
          </div>
          <span className={`status ${getStatusColor(booking.status)}`}>
            {booking.status || 'Confirmed'}
          </span>
        </div>
      </div>

      <div className="details-content">
        <div className="detail-section">
          <h2>Train Information</h2>
          <div className="train-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Train Name:</span>
                <span className="value">{booking.trainName}</span>
              </div>
              <div className="info-item">
                <span className="label">Train Number:</span>
                <span className="value">{booking.trainNumber}</span>
              </div>
              <div className="info-item">
                <span className="label">From:</span>
                <span className="value">{booking.source}</span>
              </div>
              <div className="info-item">
                <span className="label">To:</span>
                <span className="value">{booking.destination}</span>
              </div>
              <div className="info-item">
                <span className="label">Boarding Station:</span>
                <span className="value">{booking.boardingStation || booking.source}</span>
              </div>
              <div className="info-item">
                <span className="label">Journey Date:</span>
                <span className="value">{new Date(booking.journeyDate).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="label">Class:</span>
                <span className="value">{booking.class}</span>
              </div>
              <div className="info-item">
                <span className="label">Booking Date:</span>
                <span className="value">
                  {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Passenger Details</h2>
          <div className="passengers-list">
            {booking.passengers && booking.passengers.length > 0 ? (
              booking.passengers.map((passenger, index) => (
                <div key={index} className="passenger-card">
                  <div className="passenger-header">
                    <h3>Passenger {index + 1}</h3>
                  </div>
                  <div className="passenger-details">
                    <div className="detail-row">
                      <span className="label">Name:</span>
                      <span className="value">{passenger.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Age:</span>
                      <span className="value">{passenger.age}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Gender:</span>
                      <span className="value">{passenger.gender}</span>
                    </div>
                    {passenger.seatNumber && (
                      <div className="detail-row">
                        <span className="label">Seat Number:</span>
                        <span className="value">{passenger.seatNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No passenger details available</p>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h2>Fare Details</h2>
          <div className="fare-info">
            <div className="fare-item">
              <span className="label">Total Fare:</span>
              <span className="value">₹{booking.totalFare || 'N/A'}</span>
            </div>
            <div className="fare-item">
              <span className="label">Payment Status:</span>
              <span className="value">Paid</span>
            </div>
          </div>
        </div>
      </div>

      <div className="details-actions">
        <Link to="/bookings" className="btn btn-secondary">
          Back to My Bookings
        </Link>
        {booking.status !== 'Cancelled' && (
          <Link
            to={`/bookings/${booking.pnr}/cancel`}
            className="btn btn-danger"
          >
            Cancel Booking
          </Link>
        )}
        <button
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          Print Ticket
        </button>
      </div>
    </div>
  );
};

export default BookingDetails;
