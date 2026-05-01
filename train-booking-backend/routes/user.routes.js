const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getBookingHistory } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All user routes are protected
router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/bookings', getBookingHistory);

module.exports = router;