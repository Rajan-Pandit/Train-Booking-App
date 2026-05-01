import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { trainAPI } from '../../services/api';
import TrainCard from './TrainCard';
import SearchForm from '../dashboard/SearchForm';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import './TrainList.css';

const TrainList = () => {
  const [searchParams] = useSearchParams();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const source = searchParams.get('source');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const trainClass = searchParams.get('class');

    if (source && destination && date) {
      searchTrains({ source, destination, date, class: trainClass });
    }
  }, [searchParams]);

  const searchTrains = async (params) => {
    setLoading(true);
    setError('');

    try {
      const response = await trainAPI.searchTrains(params);
      setTrains(response.data.data || []);
      setSearched(true);
    } catch (err) {
      setError('Failed to search trains. Please try again.');
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="train-list">
      <div className="search-section">
        <SearchForm />
      </div>

      <div className="results-section">
        {loading && <Loader message="Searching trains..." />}

        <ErrorMessage message={error} />

        {searched && !loading && (
          <div className="results-header">
            <h2>Available Trains</h2>
            <p>Found {trains.length} train{trains.length !== 1 ? 's' : ''}</p>
          </div>
        )}

        {searched && !loading && trains.length > 0 && (
          <div className="trains-grid">
            {trains.map((train) => (
              <TrainCard key={train.trainNumber} train={train} />
            ))}
          </div>
        )}

        {searched && !loading && trains.length === 0 && (
          <div className="no-results">
            <h3>No trains found</h3>
            <p>Try adjusting your search criteria.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainList;
