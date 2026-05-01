const Train = require('../models/Train');

// @desc    Search trains
// @route   GET /api/trains/search
// @access  Public
const searchTrains = async (req, res, next) => {
  try {
    const { source, destination, date } = req.query;
    
    // Convert date to day of week
    const journeyDate = new Date(date);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[journeyDate.getDay()];
    
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const safeSource = source ? escapeRegExp(source) : '';
    const safeDestination = destination ? escapeRegExp(destination) : '';
    
    // Search trains
    const trains = await Train.find({
      source: new RegExp(safeSource, 'i'),
      destination: new RegExp(safeDestination, 'i'),
      daysOfOperation: dayOfWeek
    }).select('-route');
    
    if (trains.length === 0) {
      return res.json({
        success: true,
        message: 'No trains found for the given route',
        data: []
      });
    }
    
    res.json({
      success: true,
      count: trains.length,
      data: trains
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get train details
// @route   GET /api/trains/:trainNumber
// @access  Public
const getTrainDetails = async (req, res, next) => {
  try {
    const { trainNumber } = req.params;
    
    const train = await Train.findOne({ trainNumber });
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }
    
    res.json({
      success: true,
      data: train
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check seat availability
// @route   GET /api/trains/:trainNumber/availability
// @access  Public
const checkAvailability = async (req, res, next) => {
  try {
    const { trainNumber } = req.params;
    const { date, class: classType } = req.query;
    
    const train = await Train.findOne({ trainNumber });
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }
    
    const availability = train.checkAvailability(classType, date);
    
    res.json({
      success: true,
      data: {
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        class: classType,
        date,
        ...availability
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all stations
// @route   GET /api/trains/stations
// @access  Public
const getStations = async (req, res, next) => {
  try {
    // Get unique stations from trains
    const trains = await Train.find().select('source destination');
    
    const stationsSet = new Set();
    trains.forEach(train => {
      stationsSet.add(train.source);
      stationsSet.add(train.destination);
    });
    
    const stations = Array.from(stationsSet).sort();
    
    res.json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchTrains,
  getTrainDetails,
  checkAvailability,
  getStations
};