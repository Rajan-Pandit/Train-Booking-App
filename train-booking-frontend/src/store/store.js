import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';
import trainReducer from './trainSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    train: trainReducer,
  },
});

export default store;
