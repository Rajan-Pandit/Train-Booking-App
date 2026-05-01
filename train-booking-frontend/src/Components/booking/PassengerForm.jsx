import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setPassengers as setReduxPassengers } from '../../store/bookingSlice';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';
import './PassengerForm.css';

const PassengerForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedTrain, selectedClass, journeyDate } = useSelector((state) => state.booking);

  const [passengers, setPassengers] = useState([{
    name: '',
    age: '',
    gender: '',
    berthPreference: 'No Preference'
  }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedTrain) {
      navigate('/trains');
    }
  }, [selectedTrain, navigate]);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, {
        name: '',
        age: '',
        gender: '',
        berthPreference: 'No Preference'
      }]);
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      if (!passenger.name.trim() || !passenger.age || !passenger.gender) {
        return `Please fill all required fields for passenger ${i + 1}`;
      }
      if (passenger.age < 1 || passenger.age > 120) {
        return `Please enter a valid age for passenger ${i + 1}`;
      }
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Store passengers in Redux
    dispatch(setReduxPassengers(passengers));
    navigate('/booking/summary');
  };

  if (!selectedTrain) {
    return <Loader message="Loading booking details..." />;
  }

  return (
    <div className="passenger-form">
      <div className="form-header">
        <h1>Passenger Details</h1>
        <div className="booking-summary">
          <p><strong>Train:</strong> {selectedTrain.trainName} ({selectedTrain.trainNumber})</p>
          <p><strong>Route:</strong> {selectedTrain.source} → {selectedTrain.destination}</p>
          <p><strong>Date:</strong> {new Date(journeyDate).toLocaleDateString()}</p>
          <p><strong>Class:</strong> {selectedClass}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="passengers-section">
          <h2>Passenger Information</h2>

          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-card">
              <div className="passenger-header">
                <h3>Passenger {index + 1}</h3>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removePassenger(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`name-${index}`}>Full Name *</label>
                  <input
                    type="text"
                    id={`name-${index}`}
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`age-${index}`}>Age *</label>
                  <input
                    type="number"
                    id={`age-${index}`}
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    min="1"
                    max="120"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`gender-${index}`}>Gender *</label>
                  <select
                    id={`gender-${index}`}
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`berth-${index}`}>Berth Preference</label>
                  <select
                    id={`berth-${index}`}
                    value={passenger.berthPreference}
                    onChange={(e) => handlePassengerChange(index, 'berthPreference', e.target.value)}
                  >
                    <option value="No Preference">No Preference</option>
                    <option value="Lower">Lower</option>
                    <option value="Middle">Middle</option>
                    <option value="Upper">Upper</option>
                    <option value="Side Lower">Side Lower</option>
                    <option value="Side Upper">Side Upper</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {passengers.length < 6 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addPassenger}
            >
              Add Another Passenger
            </button>
          )}
        </div>

        <ErrorMessage message={error} />

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <Loader message="Processing..." /> : 'Continue to Summary'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PassengerForm;