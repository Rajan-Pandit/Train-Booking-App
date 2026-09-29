const Train = require('../models/Train');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createStationMatcher = (station) => {
  const stationCode = station.match(/\(([^)]+)\)\s*$/)?.[1];
  return new RegExp(escapeRegExp(stationCode || station), 'i');
};

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
    
    const sourceMatcher = createStationMatcher(source);
    const destinationMatcher = createStationMatcher(destination);
    
    const trainQuery = {
      daysOfOperation: dayOfWeek,
      $and: [
        { $or: [{ source: sourceMatcher }, { 'route.station': sourceMatcher }] },
        { $or: [{ destination: destinationMatcher }, { 'route.station': destinationMatcher }] }
      ]
    };

    if (req.query.class) {
      trainQuery['classes.type'] = req.query.class;
    }

    const candidates = await Train.find(trainQuery);
    const trains = candidates.filter((train) => {
      const route = train.route || [];
      const sourceIndex = route.findIndex((stop) => sourceMatcher.test(stop.station));
      const destinationIndex = route.findIndex((stop) => destinationMatcher.test(stop.station));

      if (sourceIndex !== -1 || destinationIndex !== -1) {
        return sourceIndex !== -1 && destinationIndex > sourceIndex;
      }

      return sourceMatcher.test(train.source) && destinationMatcher.test(train.destination);
    });
    
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
      data: trains.map((train) => {
        const result = train.toObject();
        delete result.route;
        return result;
      })
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