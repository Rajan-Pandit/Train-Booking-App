const Booking = require('../models/Booking');
const Train = require('../models/Train');
const { allocateSeats } = require('../utils/seatAllocator');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Protected
const createBooking = async (req, res, next) => {
  try {
    const { trainId, journeyDate, class: classType, boardingStation, passengers } = req.body;
    
    // Find train
    const train = await Train.findById(trainId);
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }
    
    // Check availability
    const availability = train.checkAvailability(classType, journeyDate);
    
    if (!availability.available || availability.seats < passengers.length) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient seats available'
      });
    }
    
    // Allocate seats
    const allocatedSeats = allocateSeats(classType, passengers.length, passengers);
    
    // Update passengers with seat numbers
    const passengersWithSeats = passengers.map((passenger, index) => ({
      ...passenger,
      seatNumber: allocatedSeats[index].seatNumber
    }));
    
    // Calculate fare
    const totalFare = availability.price * passengers.length;
    
    // Generate PNR
    const pnr = await Booking.generatePNR();
    
    // Generate mock payment ID
    const paymentId = `PAY${Date.now()}`;
    
    // Create booking
    const booking = await Booking.create({
      pnr,
      userId: req.user._id,
      trainId: train._id,
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      journeyDate,
      source: train.source,
      destination: train.destination,
      boardingStation,
      class: classType,
      passengers: passengersWithSeats,
      totalFare,
      status: 'Confirmed',
      paymentId
    });
    
    // Update train seat availability
    await train.updateSeats(classType, passengers.length);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by PNR
// @route   GET /api/bookings/:pnr
// @access  Protected
const getBookingByPNR = async (req, res, next) => {
  try {
    const { pnr } = req.params;
    
    const booking = await Booking.findOne({ pnr }).populate('userId', 'firstName lastName email');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if booking belongs to user
    if (booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/:userId
// @access  Protected
const getUserBookings = async (req, res, next) => {
  try {
    // Ensure user can only access their own bookings
    if (req.params.userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ bookingDate: -1 })
      .limit(50);
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:pnr/cancel
// @access  Protected
const cancelBooking = async (req, res, next) => {
  try {
    const { pnr } = req.params;
    
    const booking = await Booking.findOne({ pnr });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Check if already cancelled
    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking already cancelled'
      });
    }
    
    // Cancel booking and calculate refund
    const refundAmount = await booking.cancelBooking();
    
    // Update train seat availability
    const train = await Train.findById(booking.trainId);
    if (train) {
      const classIndex = train.classes.findIndex(c => c.type === booking.class);
      if (classIndex !== -1) {
        train.classes[classIndex].availableSeats += booking.passengers.length;
        await train.save();
      }
    }
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        pnr: booking.pnr,
        status: booking.status,
        refundAmount
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookingByPNR,
  getUserBookings,
  cancelBooking
};