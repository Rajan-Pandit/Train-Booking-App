import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trains: [],            // Search results
  stations: [],          // Available stations list
  selectedTrain: null,   // Train details being viewed
  searchParams: null,    // Current search parameters
  loading: false,
  error: null,
};

const trainSlice = createSlice({
  name: 'train',
  initialState,
  reducers: {
    setTrains(state, action) {
      state.trains = action.payload;
    },
    setStations(state, action) {
      state.stations = action.payload;
    },
    setSelectedTrain(state, action) {
      state.selectedTrain = action.payload;
    },
    setSearchParams(state, action) {
      state.searchParams = action.payload;
    },
    setTrainLoading(state, action) {
      state.loading = action.payload;
    },
    setTrainError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setTrains,
  setStations,
  setSelectedTrain,
  setSearchParams,
  setTrainLoading,
  setTrainError,
} = trainSlice.actions;

export default trainSlice.reducer;
