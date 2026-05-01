const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingByPNR,
  getUserBookings,
  cancelBooking
} = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { createBookingValidator, pnrValidator } = require('../utils/validators');

// All booking routes are protected
router.use(authMiddleware);

router.post('/', validate(createBookingValidator), createBooking);
router.get('/:pnr', validate(pnrValidator), getBookingByPNR);
router.get('/user/:userId', getUserBookings);
router.put('/:pnr/cancel', validate(pnrValidator), cancelBooking);

module.exports = router;