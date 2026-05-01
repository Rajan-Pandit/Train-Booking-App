import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { bookingAPI } from '../../services/api';
import { setConfirmedBooking } from '../../store/bookingSlice';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';
import './BookingSummary.css';

const BookingSummary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedTrain, selectedClass, journeyDate, passengers } = useSelector((state) => state.booking);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedTrain || !passengers || passengers.length === 0) {
      navigate('/trains');
    }
  }, [selectedTrain, passengers, navigate]);

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError('');

    try {
      // Build the booking payload for the backend API
      const bookingPayload = {
        trainId: selectedTrain._id,
        journeyDate: journeyDate,
        class: selectedClass,
        boardingStation: selectedTrain.source,
        passengers: passengers.map((p) => ({
          name: p.name,
          age: parseInt(p.age, 10),
          gender: p.gender,
          berthPreference: p.berthPreference || 'No Preference',
        })),
      };

      const response = await bookingAPI.createBooking(bookingPayload);
      const confirmedBooking = response.data.data;

      // Store confirmed booking in Redux
      dispatch(setConfirmedBooking(confirmedBooking));

      navigate('/booking/confirmation');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create booking. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedTrain || !passengers || passengers.length === 0) {
    return <Loader message="Loading booking summary..." />;
  }

  return (
    <div className="booking-summary">
      <div className="summary-header">
        <h1>Booking Summary</h1>
        <p>Please review your booking details before confirming</p>
      </div>

      <div className="summary-content">
        <div className="summary-section">
          <h2>Train Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Train:</span>
              <span className="value">{selectedTrain.trainName} ({selectedTrain.trainNumber})</span>
            </div>
            <div className="detail-item">
              <span className="label">From:</span>
              <span className="value">{selectedTrain.source}</span>
            </div>
            <div className="detail-item">
              <span className="label">To:</span>
              <span className="value">{selectedTrain.destination}</span>
            </div>
            <div className="detail-item">
              <span className="label">Date:</span>
              <span className="value">{new Date(journeyDate).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Class:</span>
              <span className="value">{selectedClass}</span>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h2>Passenger Details</h2>
          <div className="passengers-list">
            {passengers.map((passenger, index) => (
              <div key={index} className="passenger-summary">
                <h3>Passenger {index + 1}</h3>
                <div className="passenger-details">
                  <p><strong>Name:</strong> {passenger.name}</p>
                  <p><strong>Age:</strong> {passenger.age}</p>
                  <p><strong>Gender:</strong> {passenger.gender}</p>
                  {passenger.berthPreference && passenger.berthPreference !== 'No Preference' && (
                    <p><strong>Berth Preference:</strong> {passenger.berthPreference}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="summary-section">
          <h2>Fare Details</h2>
          <div className="fare-breakdown">
            <div className="fare-item">
              <span className="label">Passengers:</span>
              <span className="value">{passengers.length}</span>
            </div>
            <div className="fare-item">
              <span className="label">Class:</span>
              <span className="value">{selectedClass}</span>
            </div>
            <div className="fare-item total">
              <span className="label">Total Fare:</span>
              <span className="value">Calculated on confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="summary-actions">
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/booking/passenger')}
        >
          Back to Edit Passengers
        </button>
        <button
          className="btn btn-primary"
          onClick={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? <Loader message="Confirming booking..." /> : 'Confirm & Book'}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
