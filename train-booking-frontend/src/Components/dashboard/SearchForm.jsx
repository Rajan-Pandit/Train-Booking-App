import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainAPI } from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';
import './SearchForm.css';

const SearchForm = () => {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    journeyDate: '',
    class: ''
  });
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const CACHE_KEY = 'indianRailwayStations_v2'; // Cache busted key
      const cachedStations = sessionStorage.getItem(CACHE_KEY);
      if (cachedStations) {
        setStations(JSON.parse(cachedStations));
        return;
      }
      
      // Fetch from our local DB first to get our custom/seeded stations
      let localStations = [];
      try {
        const response = await trainAPI.getStations();
        localStations = response.data.data || [];
      } catch (err) {
        console.error('Failed to fetch local stations');
      }

      // Fetch from large external API
      const externalStationsList = await trainAPI.getAllIndianStations();
      
      // Merge them together and remove duplicates
      const mergedSet = new Set([...localStations, ...externalStationsList]);
      const finalStationsList = Array.from(mergedSet).sort();

      if (finalStationsList.length > 0) {
        setStations(finalStationsList);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(finalStationsList));
      }
    } catch (err) {
      console.error('Failed to fetch stations:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Navigate to trains page with search params
      const params = new URLSearchParams();
      if (formData.source) params.append('source', formData.source);
      if (formData.destination) params.append('destination', formData.destination);
      if (formData.journeyDate) params.append('date', formData.journeyDate);
      if (formData.class) params.append('class', formData.class);

      navigate(`/trains?${params.toString()}`);
    } catch (err) {
      setError('Failed to search trains');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="search-form">
      <h2>Search Trains</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="source">From</label>
            <input
              type="text"
              id="source"
              name="source"
              list="source-stations"
              value={formData.source}
              onChange={handleChange}
              placeholder="Type station name or code..."
              required
              autoComplete="off"
            />
            <datalist id="source-stations">
              {stations.map((station) => (
                <option key={station} value={station} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="destination">To</label>
            <input
              type="text"
              id="destination"
              name="destination"
              list="destination-stations"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Type station name or code..."
              required
              autoComplete="off"
            />
            <datalist id="destination-stations">
              {stations.map((station) => (
                <option key={station} value={station} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="journeyDate">Journey Date</label>
            <input
              type="date"
              id="journeyDate"
              name="journeyDate"
              value={formData.journeyDate}
              onChange={handleChange}
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="class">Class</label>
            <select
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
            >
              <option value="">All Classes</option>
              <option value="General">General</option>
              <option value="Sleeper">Sleeper</option>
              <option value="3AC">3AC</option>
              <option value="2AC">2AC</option>
              <option value="1AC">1AC</option>
            </select>
          </div>
        </div>

        <ErrorMessage message={error} />

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Trains'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
