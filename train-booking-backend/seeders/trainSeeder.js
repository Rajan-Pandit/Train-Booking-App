const mongoose = require('mongoose');
const Train = require('../models/Train');
require('dotenv').config();

const trains = [
  {
    trainNumber: "12301",
    trainName: "Rajdhani Express",
    source: "New Delhi (NDLS)",
    destination: "Mumbai Central (MMCT)",
    departureTime: "16:55",
    arrivalTime: "08:35",
    duration: "15h 40m",
    daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { type: "3AC", totalSeats: 300, availableSeats: 300, price: 2500 },
      { type: "2AC", totalSeats: 150, availableSeats: 150, price: 3500 },
      { type: "1AC", totalSeats: 50, availableSeats: 50, price: 5000 }
    ],
    route: [
      { station: "New Delhi (NDLS)", arrivalTime: "", departureTime: "16:55", distance: 0, stopNumber: 1 },
      { station: "Vadodara Jn (BRC)", arrivalTime: "05:30", departureTime: "05:40", distance: 950, stopNumber: 2 },
      { station: "Mumbai Central (MMCT)", arrivalTime: "08:35", departureTime: "", distance: 1384, stopNumber: 3 }
    ]
  },
  {
    trainNumber: "12302",
    trainName: "Mumbai Rajdhani",
    source: "Mumbai Central (MMCT)",
    destination: "New Delhi (NDLS)",
    departureTime: "17:00",
    arrivalTime: "08:35",
    duration: "15h 35m",
    daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { type: "3AC", totalSeats: 300, availableSeats: 300, price: 2500 },
      { type: "2AC", totalSeats: 150, availableSeats: 150, price: 3500 },
      { type: "1AC", totalSeats: 50, availableSeats: 50, price: 5000 }
    ],
    route: [
      { station: "Mumbai Central (MMCT)", arrivalTime: "", departureTime: "17:00", distance: 0, stopNumber: 1 },
      { station: "Vadodara Jn (BRC)", arrivalTime: "22:50", departureTime: "23:00", distance: 434, stopNumber: 2 },
      { station: "New Delhi (NDLS)", arrivalTime: "08:35", departureTime: "", distance: 1384, stopNumber: 3 }
    ]
  },
  {
    trainNumber: "12951",
    trainName: "Mumbai Duronto",
    source: "Mumbai Central (MMCT)",
    destination: "New Delhi (NDLS)",
    departureTime: "22:45",
    arrivalTime: "12:45",
    duration: "14h 00m",
    daysOfOperation: ["Mon", "Wed", "Fri", "Sun"],
    classes: [
      { type: "Sleeper", totalSeats: 400, availableSeats: 400, price: 800 },
      { type: "3AC", totalSeats: 250, availableSeats: 250, price: 2200 },
      { type: "2AC", totalSeats: 100, availableSeats: 100, price: 3200 }
    ],
    route: [
      { station: "Mumbai Central (MMCT)", arrivalTime: "", departureTime: "22:45", distance: 0, stopNumber: 1 },
      { station: "New Delhi (NDLS)", arrivalTime: "12:45", departureTime: "", distance: 1384, stopNumber: 2 }
    ]
  },
  {
    trainNumber: "12430",
    trainName: "Lucknow SF Express",
    source: "New Delhi (NDLS)",
    destination: "Lucknow (LKO)",
    departureTime: "22:15",
    arrivalTime: "06:30",
    duration: "8h 15m",
    daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { type: "Sleeper", totalSeats: 500, availableSeats: 500, price: 450 },
      { type: "3AC", totalSeats: 300, availableSeats: 300, price: 1200 },
      { type: "2AC", totalSeats: 150, availableSeats: 150, price: 1800 }
    ],
    route: [
      { station: "New Delhi (NDLS)", arrivalTime: "", departureTime: "22:15", distance: 0, stopNumber: 1 },
      { station: "Ghaziabad (GZB)", arrivalTime: "23:05", departureTime: "23:07", distance: 24, stopNumber: 2 },
      { station: "Lucknow (LKO)", arrivalTime: "06:30", departureTime: "", distance: 492, stopNumber: 3 }
    ]
  },
  {
    trainNumber: "12429",
    trainName: "Lucknow Delhi SF",
    source: "Lucknow (LKO)",
    destination: "New Delhi (NDLS)",
    departureTime: "23:05",
    arrivalTime: "07:20",
    duration: "8h 15m",
    daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { type: "Sleeper", totalSeats: 500, availableSeats: 500, price: 450 },
      { type: "3AC", totalSeats: 300, availableSeats: 300, price: 1200 },
      { type: "2AC", totalSeats: 150, availableSeats: 150, price: 1800 }
    ],
    route: [
      { station: "Lucknow (LKO)", arrivalTime: "", departureTime: "23:05", distance: 0, stopNumber: 1 },
      { station: "Ghaziabad (GZB)", arrivalTime: "06:28", departureTime: "06:30", distance: 468, stopNumber: 2 },
      { station: "New Delhi (NDLS)", arrivalTime: "07:20", departureTime: "", distance: 492, stopNumber: 3 }
    ]
  },
  {
    trainNumber: "12622",
    trainName: "Tamil Nadu Express",
    source: "New Delhi (NDLS)",
    destination: "Chennai Central (MAS)",
    departureTime: "22:30",
    arrivalTime: "07:05",
    duration: "32h 35m",
    daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { type: "Sleeper", totalSeats: 600, availableSeats: 600, price: 900 },
      { type: "3AC", totalSeats: 350, availableSeats: 350, price: 2400 },
      { type: "2AC", totalSeats: 150, availableSeats: 150, price: 3500 },
      { type: "1AC", totalSeats: 50, availableSeats: 50, price: 5500 }
    ],
    route: [
      { station: "New Delhi (NDLS)", arrivalTime: "", departureTime: "22:30", distance: 0, stopNumber: 1 },
      { station: "Agra Cantt (AGC)", arrivalTime: "01:50", departureTime: "01:55", distance: 195, stopNumber: 2 },
      { station: "Bhopal Jn (BPL)", arrivalTime: "09:25", departureTime: "09:35", distance: 707, stopNumber: 3 },
      { station: "Nagpur (NGP)", arrivalTime: "18:40", departureTime: "18:50", distance: 1214, stopNumber: 4 },
      { station: "Chennai Central (MAS)", arrivalTime: "07:05", departureTime: "", distance: 2180, stopNumber: 5 }
    ]
  },
  {
    trainNumber: "12621",
    trainName: "Tamil Nadu Express",
    source: "Chennai Central (MAS)",
    destination: "New Delhi (NDLS)",
    departureTime: "22:20",
    arrivalTime: "06:30",
    duration: "32h 10m",
    daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { type: "Sleeper", totalSeats: 600, availableSeats: 600, price: 900 },
      { type: "3AC", totalSeats: 350, availableSeats: 350, price: 2400 },
      { type: "2AC", totalSeats: 150, availableSeats: 150, price: 3500 },
      { type: "1AC", totalSeats: 50, availableSeats: 50, price: 5500 }
    ],
    route: [
      { station: "Chennai Central (MAS)", arrivalTime: "", departureTime: "22:20", distance: 0, stopNumber: 1 },
      { station: "Nagpur (NGP)", arrivalTime: "11:05", departureTime: "11:15", distance: 966, stopNumber: 2 },
      { station: "Bhopal Jn (BPL)", arrivalTime: "20:35", departureTime: "20:40", distance: 1473, stopNumber: 3 },
      { station: "Agra Cantt (AGC)", arrivalTime: "04:35", departureTime: "04:40", distance: 1985, stopNumber: 4 },
      { station: "New Delhi (NDLS)", arrivalTime: "06:30", departureTime: "", distance: 2180, stopNumber: 5 }
    ]
  },
  {
    trainNumber: "12860",
    trainName: "Gitanjali Express",
    source: "Mumbai CST (CSMT)",
    destination: "Howrah Jn (HWH)",
    departureTime: "06:10",
    arrivalTime: "11:50",
    duration: "29h 40m",
    daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { type: "Sleeper", totalSeats: 550, availableSeats: 550, price: 800 },
      { type: "3AC", totalSeats: 300, availableSeats: 300, price: 2200 },
      { type: "2AC", totalSeats: 120, availableSeats: 120, price: 3200 }
    ],
    route: [
      { station: "Mumbai CST (CSMT)", arrivalTime: "", departureTime: "06:10", distance: 0, stopNumber: 1 },
      { station: "Nagpur (NGP)", arrivalTime: "19:45", departureTime: "19:55", distance: 839, stopNumber: 2 },
      { station: "Raipur (R)", arrivalTime: "01:40", departureTime: "01:50", distance: 1289, stopNumber: 3 },
      { station: "Howrah Jn (HWH)", arrivalTime: "11:50", departureTime: "", distance: 1968, stopNumber: 4 }
    ]
  },
  {
    trainNumber: "12260",
    trainName: "Duronto Express",
    source: "New Delhi (NDLS)",
    destination: "Sealdah (SDAH)",
    departureTime: "16:40",
    arrivalTime: "10:35",
    duration: "17h 55m",
    daysOfOperation: ["Mon", "Wed", "Sat"],
    classes: [
      { type: "3AC", totalSeats: 400, availableSeats: 400, price: 2800 },
      { type: "2AC", totalSeats: 180, availableSeats: 180, price: 3900 },
      { type: "1AC", totalSeats: 60, availableSeats: 60, price: 6000 }
    ],
    route: [
      { station: "New Delhi (NDLS)", arrivalTime: "", departureTime: "16:40", distance: 0, stopNumber: 1 },
      { station: "Sealdah (SDAH)", arrivalTime: "10:35", departureTime: "", distance: 1445, stopNumber: 2 }
    ]
  },
  {
    trainNumber: "12424",
    trainName: "Dibrugarh Rajdhani",
    source: "New Delhi (NDLS)",
    destination: "Dibrugarh (DBRG)",
    departureTime: "11:20",
    arrivalTime: "08:00",
    duration: "44h 40m",
    daysOfOperation: ["Tue", "Thu", "Sat"],
    classes: [
      { type: "3AC", totalSeats: 350, availableSeats: 350, price: 3500 },
      { type: "2AC", totalSeats: 150, availableSeats: 150, price: 4800 },
      { type: "1AC", totalSeats: 50, availableSeats: 50, price: 7200 }
    ],
    route: [
      { station: "New Delhi (NDLS)", arrivalTime: "", departureTime: "11:20", distance: 0, stopNumber: 1 },
      { station: "Lucknow (LKO)", arrivalTime: "19:30", departureTime: "19:40", distance: 492, stopNumber: 2 },
      { station: "Patna Jn (PNBE)", arrivalTime: "02:10", departureTime: "02:20", distance: 991, stopNumber: 3 },
      { station: "Malda Town (MLDT)", arrivalTime: "09:55", departureTime: "10:05", distance: 1312, stopNumber: 4 },
      { station: "Dibrugarh (DBRG)", arrivalTime: "08:00", departureTime: "", distance: 2425, stopNumber: 5 }
    ]
  },
  {
    trainNumber: "22436",
    trainName: "Vande Bharat Express",
    source: "New Delhi (NDLS)",
    destination: "Banaras (BSBS)",
    departureTime: "06:00",
    arrivalTime: "14:00",
    duration: "8h 00m",
    daysOfOperation: ["Mon", "Tue", "Wed", "Fri", "Sat", "Sun"],
    classes: [
      { type: "General", totalSeats: 800, availableSeats: 800, price: 1750 },
      { type: "1AC", totalSeats: 100, availableSeats: 100, price: 3300 }
    ],
    route: [
      { station: "New Delhi (NDLS)", arrivalTime: "", departureTime: "06:00", distance: 0, stopNumber: 1 },
      { station: "Kanpur Central (CNB)", arrivalTime: "10:08", departureTime: "10:10", distance: 440, stopNumber: 2 },
      { station: "Prayagraj Jn (PRYJ)", arrivalTime: "12:08", departureTime: "12:10", distance: 635, stopNumber: 3 },
      { station: "Banaras (BSBS)", arrivalTime: "14:00", departureTime: "", distance: 755, stopNumber: 4 }
    ]
  },
  {
    trainNumber: "12560",
    trainName: "Shiv Ganga Express",
    source: "New Delhi (NDLS)",
    destination: "Banaras (BSBS)",
    departureTime: "20:05",
    arrivalTime: "06:10",
    duration: "10h 05m",
    daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { type: "Sleeper", totalSeats: 400, availableSeats: 400, price: 420 },
      { type: "3AC", totalSeats: 300, availableSeats: 300, price: 1100 },
      { type: "2AC", totalSeats: 100, availableSeats: 100, price: 1550 },
      { type: "1AC", totalSeats: 50, availableSeats: 50, price: 2600 }
    ],
    route: [
      { station: "New Delhi (NDLS)", arrivalTime: "", departureTime: "20:05", distance: 0, stopNumber: 1 },
      { station: "Kanpur Central (CNB)", arrivalTime: "01:00", departureTime: "01:05", distance: 440, stopNumber: 2 },
      { station: "Prayagraj Jn (PRYJ)", arrivalTime: "03:45", departureTime: "03:55", distance: 635, stopNumber: 3 },
      { station: "Banaras (BSBS)", arrivalTime: "06:10", departureTime: "", distance: 755, stopNumber: 4 }
    ]
  }
];

const seedTrains = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected for seeding...');

    // Clear existing trains
    await Train.deleteMany({});
    console.log('Cleared existing trains');

    // Insert new trains
    await Train.insertMany(trains);
    console.log(`${trains.length} trains seeded successfully`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding trains:', error);
    process.exit(1);
  }
};

seedTrains();
