const { body, query, param } = require('express-validator');

// Auth validators
const registerValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other')
];

const loginValidator = [
  body('userId').trim().notEmpty().withMessage('User ID is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Train search validators
const searchTrainsValidator = [
  query('source').trim().notEmpty().withMessage('Source station is required'),
  query('destination').trim().notEmpty().withMessage('Destination station is required'),
  query('date').isISO8601().withMessage('Valid date is required')
];

// Booking validators
const createBookingValidator = [
  body('trainId').notEmpty().withMessage('Train ID is required'),
  body('journeyDate').isISO8601().withMessage('Valid journey date is required'),
  body('class').isIn(['General', 'Sleeper', '3AC', '2AC', '1AC']).withMessage('Invalid class type'),
  body('boardingStation').trim().notEmpty().withMessage('Boarding station is required'),
  body('passengers').isArray({ min: 1, max: 6 }).withMessage('1-6 passengers required'),
  body('passengers.*.name').trim().notEmpty().withMessage('Passenger name is required'),
  body('passengers.*.age').isInt({ min: 1, max: 120 }).withMessage('Valid age is required'),
  body('passengers.*.gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender')
];

const pnrValidator = [
  param('pnr').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit PNR is required')
];

module.exports = {
  registerValidator,
  loginValidator,
  searchTrainsValidator,
  createBookingValidator,
  pnrValidator
};