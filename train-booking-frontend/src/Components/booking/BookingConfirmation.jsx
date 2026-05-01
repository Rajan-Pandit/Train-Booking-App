import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearBookingFlow } from '../../store/bookingSlice';
import Loader from '../common/Loader';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { confirmedBooking } = useSelector((state) => state.booking);

  useEffect(() => {
    if (!confirmedBooking) {
      navigate('/dashboard');
      return;
    }

    // Clear booking flow data (but keep confirmedBooking for display)
    return () => {
      dispatch(clearBookingFlow());
    };
  }, []);

  if (!confirmedBooking) {
    return <Loader message="Loading booking confirmation..." />;
  }

  return (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p>Your train ticket has been successfully booked</p>
      </div>

      <div className="confirmation-content">
        <div className="booking-details">
          <h2>Booking Details</h2>

          <div className="detail-section">
            <div className="pnr-display">
              <h3>PNR Number</h3>
              <div className="pnr-number">{confirmedBooking.pnr}</div>
              <p className="pnr-note">Please save this PNR for future reference</p>
            </div>
          </div>

          <div className="detail-section">
            <h3>Train Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Train:</span>
                <span className="value">{confirmedBooking.trainName} ({confirmedBooking.trainNumber})</span>
              </div>
              <div className="detail-item">
                <span className="label">From:</span>
                <span className="value">{confirmedBooking.source}</span>
              </div>
              <div className="detail-item">
                <span className="label">To:</span>
                <span className="value">{confirmedBooking.destination}</span>
              </div>
              <div className="detail-item">
                <span className="label">Date:</span>
                <span className="value">{new Date(confirmedBooking.journeyDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Class:</span>
                <span className="value">{confirmedBooking.class}</span>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className="value" style={{color: '#28a745', fontWeight: 'bold'}}>{confirmedBooking.status}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Passenger Details</h3>
            <div className="passengers-list">
              {confirmedBooking.passengers.map((passenger, index) => (
                <div key={index} className="passenger-item">
                  <div className="passenger-name">
                    <strong>{passenger.name}</strong>
                  </div>
                  <div className="passenger-info">
                    Age: {passenger.age} | Gender: {passenger.gender}
                    {passenger.seatNumber && ` | Seat: ${passenger.seatNumber}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Fare Details</h3>
            <div className="fare-summary">
              <div className="fare-item">
                <span className="label">Total Fare:</span>
                <span className="value">₹{confirmedBooking.totalFare}</span>
              </div>
              <div className="fare-item">
                <span className="label">Payment Status:</span>
                <span className="value status-paid">Paid</span>
              </div>
            </div>
          </div>
        </div>

        <div className="booking-actions">
          <Link to={`/bookings/${confirmedBooking.pnr}`} className="btn btn-primary">
            View Booking Details
          </Link>
          <Link to="/bookings" className="btn btn-secondary">
            My Bookings
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>

        <div className="important-notes">
          <h3>Important Notes</h3>
          <ul>
            <li>Please arrive at the station at least 30 minutes before departure</li>
            <li>Carry a valid ID proof for verification</li>
            <li>Check-in closes 10 minutes before departure</li>
            <li>For any changes or cancellations, contact customer support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
