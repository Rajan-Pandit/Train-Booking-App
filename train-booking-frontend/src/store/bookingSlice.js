import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Booking flow state
  selectedTrain: null,       // Train chosen for booking (includes _id, trainNumber, trainName, etc.)
  selectedClass: null,       // Class chosen (e.g. '3AC')
  journeyDate: null,         // Journey date string
  passengers: [],            // Array of passenger objects
  
  // Booking result
  confirmedBooking: null,    // The confirmed booking returned from backend
  
  // User's booking history
  bookings: [],
  currentBooking: null,      // Single booking being viewed
  
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedTrain(state, action) {
      state.selectedTrain = action.payload.train;
      state.selectedClass = action.payload.classType;
      state.journeyDate = action.payload.journeyDate;
    },
    setPassengers(state, action) {
      state.passengers = action.payload;
    },
    setConfirmedBooking(state, action) {
      state.confirmedBooking = action.payload;
    },
    setBookings(state, action) {
      state.bookings = action.payload;
    },
    setCurrentBooking(state, action) {
      state.currentBooking = action.payload;
    },
    clearBookingFlow(state) {
      state.selectedTrain = null;
      state.selectedClass = null;
      state.journeyDate = null;
      state.passengers = [];
      state.confirmedBooking = null;
    },
    setBookingLoading(state, action) {
      state.loading = action.payload;
    },
    setBookingError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setSelectedTrain,
  setPassengers,
  setConfirmedBooking,
  setBookings,
  setCurrentBooking,
  clearBookingFlow,
  setBookingLoading,
  setBookingError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
