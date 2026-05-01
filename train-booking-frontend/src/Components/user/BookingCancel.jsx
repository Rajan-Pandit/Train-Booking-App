import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingAPI } from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';
import './BookingCancel.css';

const BookingCancel = () => {
  const { pnr } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);

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

  const handleCancelBooking = async () => {
    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }

    setCancelling(true);
    setError('');

    try {
      await bookingAPI.cancelBooking(pnr);
      // Redirect to booking details or history
      navigate(`/bookings/${pnr}`, {
        state: { message: 'Booking cancelled successfully' }
      });
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const calculateRefund = () => {
    // Mock refund calculation - in real app this would come from backend
    const totalFare = booking?.totalFare || 0;
    const cancellationFee = totalFare * 0.1; // 10% cancellation fee
    return totalFare - cancellationFee;
  };

  if (loading) {
    return <Loader message="Loading booking details..." />;
  }

  if (error || !booking) {
    return (
      <div className="booking-cancel">
        <ErrorMessage message={error || 'Booking not found'} />
        <Link to="/bookings" className="btn btn-primary">
          Back to My Bookings
        </Link>
      </div>
    );
  }

  // Check if booking can be cancelled
  const canCancel = booking.status === 'Confirmed' || booking.status === 'RAC' || booking.status === 'Waitlist';
  const journeyDate = new Date(booking.journeyDate);
  const today = new Date();
  const daysUntilJourney = Math.ceil((journeyDate - today) / (1000 * 60 * 60 * 24));

  if (!canCancel) {
    return (
      <div className="booking-cancel">
        <div className="cancel-error">
          <h1>Cannot Cancel Booking</h1>
          <p>This booking cannot be cancelled. Status: {booking.status}</p>
          <Link to={`/bookings/${pnr}`} className="btn btn-primary">
            Back to Booking Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-cancel">
      <div className="cancel-header">
        <h1>Cancel Booking</h1>
        <p>Please review the cancellation details before proceeding</p>
      </div>

      <div className="cancel-content">
        <div className="booking-summary">
          <h2>Booking Details</h2>
          <div className="summary-details">
            <p><strong>PNR:</strong> {booking.pnr}</p>
            <p><strong>Train:</strong> {booking.trainName} ({booking.trainNumber})</p>
            <p><strong>Route:</strong> {booking.source} → {booking.destination}</p>
            <p><strong>Journey Date:</strong> {journeyDate.toLocaleDateString()}</p>
            <p><strong>Class:</strong> {booking.class}</p>
            <p><strong>Status:</strong> {booking.status}</p>
          </div>
        </div>

        <div className="cancellation-info">
          <h2>Cancellation Policy</h2>
          <div className="policy-details">
            <div className="policy-item">
              <span className="label">Days until journey:</span>
              <span className="value">{daysUntilJourney} days</span>
            </div>
            <div className="policy-item">
              <span className="label">Cancellation fee:</span>
              <span className="value">
                {daysUntilJourney > 2 ? '10%' : daysUntilJourney > 1 ? '20%' : '50%'}
              </span>
            </div>
            <div className="policy-item">
              <span className="label">Refund amount:</span>
              <span className="value">₹{calculateRefund()}</span>
            </div>
          </div>

          <div className="policy-rules">
            <h3>Cancellation Rules:</h3>
            <ul>
              <li>More than 2 days: 10% cancellation fee</li>
              <li>1-2 days: 20% cancellation fee</li>
              <li>Less than 24 hours: 50% cancellation fee</li>
              <li>Refund will be processed within 5-7 business days</li>
            </ul>
          </div>
        </div>

        <ErrorMessage message={error} />

        <div className="cancel-actions">
          <Link to={`/bookings/${pnr}`} className="btn btn-secondary">
            Keep Booking
          </Link>

          {!confirmCancel ? (
            <button
              className="btn btn-danger"
              onClick={handleCancelBooking}
            >
              Cancel Booking
            </button>
          ) : (
            <div className="confirmation-section">
              <p className="confirmation-text">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="confirmation-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmCancel(false)}
                  disabled={cancelling}
                >
                  No, Keep Booking
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                >
                  {cancelling ? <Loader message="Cancelling..." /> : 'Yes, Cancel Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCancel;
