const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    pnr: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      required: true
    },
    trainNumber: {
      type: String,
      required: true
    },
    trainName: {
      type: String,
      required: true
    },
    journeyDate: {
      type: Date,
      required: true,
      index: true
    },
    source: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    boardingStation: {
      type: String,
      required: true
    },
    class: {
      type: String,
      required: true,
      enum: ['General', 'Sleeper', '3AC', '2AC', '1AC']
    },
    passengers: [
      {
        name: {
          type: String,
          required: true
        },
        age: {
          type: Number,
          required: true
        },
        gender: {
          type: String,
          required: true,
          enum: ['Male', 'Female', 'Other']
        },
        seatNumber: {
          type: String,
          required: true
        },
        berthPreference: {
          type: String,
          enum: [
            'Lower',
            'Middle',
            'Upper',
            'Side Lower',
            'Side Upper',
            'No Preference'
          ]
        }
      }
    ],
    totalFare: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Confirmed', 'RAC', 'Waitlist', 'Cancelled'],
      default: 'Confirmed'
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    paymentId: {
      type: String,
      required: true
    },
    cancellationDate: {
      type: Date
    },
    refundAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
bookingSchema.index({ userId: 1, bookingDate: -1 });
bookingSchema.index({ pnr: 1 });

// Static method to generate unique PNR
bookingSchema.statics.generatePNR = async function () {
  let pnr;
  let exists = true;

  while (exists) {
    pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const booking = await this.findOne({ pnr });
    if (!booking) exists = false;
  }

  return pnr;
};

// Instance method to cancel booking
bookingSchema.methods.cancelBooking = async function () {
  if (this.status === 'Cancelled') {
    throw new Error('Booking already cancelled');
  }

  const now = new Date();
  const journeyDate = new Date(this.journeyDate);
  const hoursUntilJourney = (journeyDate - now) / (1000 * 60 * 60);

  let refundPercentage = 0.25;

  if (hoursUntilJourney > 48) refundPercentage = 1.0;
  else if (hoursUntilJourney > 24) refundPercentage = 0.75;
  else if (hoursUntilJourney > 12) refundPercentage = 0.5;

  this.status = 'Cancelled';
  this.cancellationDate = now;
  this.refundAmount = Math.floor(this.totalFare * refundPercentage);

  await this.save();
  return this.refundAmount;
};

// ✅ SAFE EXPORT (prevents OverwriteModelError)
module.exports =
  mongoose.models.Booking ||
  mongoose.model('Booking', bookingSchema);
