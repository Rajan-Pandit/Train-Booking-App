const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  trainName: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true,
    index: true
  },
  destination: {
    type: String,
    required: true,
    index: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  daysOfOperation: [{
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }],
  classes: [{
    type: {
      type: String,
      enum: ['General', 'Sleeper', '3AC', '2AC', '1AC'],
      required: true
    },
    totalSeats: {
      type: Number,
      required: true
    },
    availableSeats: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  route: [{
    station: String,
    arrivalTime: String,
    departureTime: String,
    distance: Number,
    stopNumber: Number
  }]
}, {
  timestamps: true
});

// Index for searching trains
trainSchema.index({ source: 1, destination: 1 });

// Method to check availability
trainSchema.methods.checkAvailability = function(classType, date) {
  const classInfo = this.classes.find(c => c.type === classType);
  
  if (!classInfo) {
    return { available: false, seats: 0 };
  }
  
  return {
    available: classInfo.availableSeats > 0,
    seats: classInfo.availableSeats,
    price: classInfo.price
  };
};

// Method to update seat availability
trainSchema.methods.updateSeats = async function(classType, seatsToBook) {
  const classIndex = this.classes.findIndex(c => c.type === classType);
  
  if (classIndex === -1) {
    throw new Error('Class not found');
  }
  
  if (this.classes[classIndex].availableSeats < seatsToBook) {
    throw new Error('Insufficient seats available');
  }
  
  this.classes[classIndex].availableSeats -= seatsToBook;
  await this.save();
};

module.exports = mongoose.model('Train', trainSchema);