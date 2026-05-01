import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { trainAPI } from '../../services/api';
import { setSelectedTrain } from '../../store/bookingSlice';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import './SeatAvailability.css';

const SeatAvailability = () => {
  const { trainNumber } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState(searchParams.get('class') || '');

  const journeyDate = searchParams.get('date');

  useEffect(() => {
    if (journeyDate) {
      fetchTrainDetails();
    }
  }, [trainNumber, journeyDate]);

  const fetchTrainDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await trainAPI.getTrainDetails(trainNumber);
      setTrain(response.data.data);
    } catch (err) {
      setError('Failed to load seat availability');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleBookNow = (trainClass) => {
    // Store booking details in Redux for the booking flow
    dispatch(setSelectedTrain({
      train: {
        _id: train._id,
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        source: train.source,
        destination: train.destination,
      },
      classType: trainClass.type,
      journeyDate,
    }));

    navigate('/booking/passenger');
  };

  if (loading) {
    return <Loader message="Loading seat availability..." />;
  }

  if (error || !train) {
    return (
      <div className="seat-availability">
        <ErrorMessage message={error || 'Failed to load availability'} />
        <Link to={`/trains/${trainNumber}`} className="btn btn-primary">
          Back to Train Details
        </Link>
      </div>
    );
  }

  return (
    <div className="seat-availability">
      <div className="availability-header">
        <h1>Seat Availability</h1>
        <p>{train.trainName} ({trainNumber})</p>
        <p>{train.source} → {train.destination}</p>
        <p>Journey Date: {new Date(journeyDate).toLocaleDateString()}</p>
      </div>

      <div className="class-filter">
        <label htmlFor="class-select">Filter by Class:</label>
        <select
          id="class-select"
          value={selectedClass}
          onChange={handleClassChange}
        >
          <option value="">All Classes</option>
          <option value="General">General</option>
          <option value="Sleeper">Sleeper</option>
          <option value="3AC">3AC</option>
          <option value="2AC">2AC</option>
          <option value="1AC">1AC</option>
        </select>
      </div>

      <div className="availability-grid">
        {train.classes
          .filter(trainClass => !selectedClass || trainClass.type === selectedClass)
          .map((trainClass, index) => (
            <div key={index} className="availability-card">
              <div className="class-header">
                <h3>{trainClass.type}</h3>
                <span className={`status ${trainClass.availableSeats > 0 ? 'available' : 'full'}`}>
                  {trainClass.availableSeats > 0 ? 'Available' : 'Full'}
                </span>
              </div>

              <div className="seat-info">
                <div className="seat-count">
                  <span className="available-seats">{trainClass.availableSeats}</span>
                  <span className="total-seats">/ {trainClass.totalSeats}</span>
                </div>
                <p>Seats Available</p>
              </div>

              <div className="price-info">
                <span className="price">₹{trainClass.price}</span>
                <span className="per-person">per person</span>
              </div>

              <div className="booking-action">
                {trainClass.availableSeats > 0 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBookNow(trainClass)}
                  >
                    Book Now
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled>
                    Not Available
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>

      <div className="actions">
        <Link to={`/trains/${trainNumber}`} className="btn btn-secondary">
          Back to Train Details
        </Link>
        <Link to="/trains" className="btn btn-primary">
          Search Other Trains
        </Link>
      </div>
    </div>
  );
};

export default SeatAvailability;
