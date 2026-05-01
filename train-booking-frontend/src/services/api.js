import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyToken: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
};

export const trainAPI = {
  searchTrains: (params) => api.get('/trains/search', { params }),
  getStations: () => api.get('/trains/stations'),
  getAllIndianStations: async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/datameet/railways/master/stations.json');
      const data = await response.json();
      return data.features.map(f => {
        if (f.properties && f.properties.name && f.properties.code) {
          // Capitalize first letter of each word in name for better UI
          const name = f.properties.name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
          return `${name} (${f.properties.code})`;
        }
        return null;
      }).filter(Boolean).sort();
    } catch (error) {
      console.error('Failed to fetch Indian stations from API', error);
      return [];
    }
  },
  getTrainDetails: (trainNumber) => api.get(`/trains/${trainNumber}`),
  checkAvailability: (trainNumber, params) => api.get(`/trains/${trainNumber}/availability`, { params }),
};

export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getBookingByPNR: (pnr) => api.get(`/bookings/${pnr}`),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
  cancelBooking: (pnr) => api.put(`/bookings/${pnr}/cancel`),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getBookingHistory: () => api.get('/users/bookings'),
};

export default api;