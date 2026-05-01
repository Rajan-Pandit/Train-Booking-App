import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { trainAPI } from '../../services/api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import './TrainDetails.css';

const TrainDetails = () => {
  const { trainNumber } = useParams();
  const [searchParams] = useSearchParams();
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const journeyDate = searchParams.get('date');

  useEffect(() => {
    fetchTrainDetails();
  }, [trainNumber]);

  const fetchTrainDetails = async () => {
    try {
      const response = await trainAPI.getTrainDetails(trainNumber);
      setTrain(response.data.data);
    } catch (err) {
      setError('Failed to load train details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading train details..." />;
  }

  if (error || !train) {
    return (
      <div className="train-details">
        <ErrorMessage message={error || 'Train not found'} />
        <Link to="/trains" className="btn btn-primary">
          Back to Trains
        </Link>
      </div>
    );
  }

  return (
    <div className="train-details">
      <div className="details-header">
        <h1>{train.trainName}</h1>
        <p>Train Number: {train.trainNumber}</p>
      </div>

      <div className="details-content">
        <div className="route-info">
          <h2>Route Information</h2>
          <div className="route-summary">
            <div className="route-point">
              <h3>{train.source}</h3>
              <p>Departure: {train.departureTime}</p>
            </div>
            <div className="route-arrow">→</div>
            <div className="route-point">
              <h3>{train.destination}</h3>
              <p>Arrival: {train.arrivalTime}</p>
            </div>
          </div>
          <p><strong>Duration:</strong> {train.duration}</p>
          <p><strong>Days of Operation:</strong> {train.daysOfOperation.join(', ')}</p>
        </div>

        <div className="class-info">
          <h2>Available Classes</h2>
          <div className="classes-grid">
            {train.classes.map((trainClass, index) => (
              <div key={index} className="class-card">
                <h3>{trainClass.type}</h3>
                <div className="class-details">
                  <p><strong>Total Seats:</strong> {trainClass.totalSeats}</p>
                  <p><strong>Available Seats:</strong> {trainClass.availableSeats}</p>
                </div>
                <Link
                  to={`/trains/${trainNumber}/seats?date=${journeyDate}&class=${trainClass.type}`}
                  className="btn btn-primary"
                >
                  Book {trainClass.type}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="actions">
        <Link to="/trains" className="btn btn-secondary">
          Back to Search
        </Link>
        <Link
          to={`/trains/${trainNumber}/seats?date=${journeyDate}`}
          className="btn btn-primary"
        >
          Check Seat Availability
        </Link>
      </div>
    </div>
  );
};

export default TrainDetails;
