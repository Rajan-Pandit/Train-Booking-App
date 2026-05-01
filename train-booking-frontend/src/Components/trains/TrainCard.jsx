import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './TrainCard.css';

const TrainCard = ({ train }) => {
  const [searchParams] = useSearchParams();
  const journeyDate = searchParams.get('date');

  return (
    <div className="train-card">
      <div className="train-header">
        <h3>{train.trainName}</h3>
        <span className="train-number">#{train.trainNumber}</span>
      </div>

      <div className="train-route">
        <div className="route-point">
          <div className="time">{train.departureTime}</div>
          <div className="station">{train.source}</div>
        </div>

        <div className="route-duration">
          <div className="duration">{train.duration}</div>
          <div className="route-line"></div>
        </div>

        <div className="route-point">
          <div className="time">{train.arrivalTime}</div>
          <div className="station">{train.destination}</div>
        </div>
      </div>

      <div className="train-classes">
        {train.classes.map((trainClass, index) => (
          <div key={index} className="class-info">
            <span className="class-name">{trainClass.type}</span>
            <span className="availability">
              {trainClass.availableSeats} seats available
            </span>
          </div>
        ))}
      </div>

      <div className="train-actions">
        <Link
          to={`/trains/${train.trainNumber}?date=${journeyDate}`}
          className="btn btn-primary"
        >
          View Details
        </Link>
        <Link
          to={`/trains/${train.trainNumber}/seats?date=${journeyDate}`}
          className="btn btn-secondary"
        >
          Check Seats
        </Link>
      </div>
    </div>
  );
};

export default TrainCard;
