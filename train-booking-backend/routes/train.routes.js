const express = require('express');
const router = express.Router();
const {
  searchTrains,
  getTrainDetails,
  checkAvailability,
  getStations
} = require('../controllers/train.controller');
const validate = require('../middleware/validation.middleware');
const { searchTrainsValidator } = require('../utils/validators');

// Public routes
router.get('/search', validate(searchTrainsValidator), searchTrains);
router.get('/stations', getStations);
router.get('/:trainNumber', getTrainDetails);
router.get('/:trainNumber/availability', checkAvailability);

module.exports = router;