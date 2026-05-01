// Seat allocation utility for train booking

const allocateSeats = (classType, numberOfPassengers, preferences = []) => {
  const seats = [];
  let seatCounter = 1;
  
  // Seat configuration based on class
  const seatConfig = {
    'General': { prefix: 'GN', berths: [''] },
    'Sleeper': { prefix: 'SL', berths: ['LB', 'MB', 'UB', 'SL', 'SU'] },
    '3AC': { prefix: 'A', berths: ['LB', 'MB', 'UB', 'SL', 'SU'] },
    '2AC': { prefix: 'A', berths: ['LB', 'UB', 'SL', 'SU'] },
    '1AC': { prefix: 'H', berths: ['LB', 'UB'] }
  };
  
  const config = seatConfig[classType];
  
  if (!config) {
    throw new Error('Invalid class type');
  }
  
  // For General class, simple numbering
  if (classType === 'General') {
    for (let i = 0; i < numberOfPassengers; i++) {
      seats.push({
        seatNumber: `${config.prefix}-${seatCounter++}`,
        berth: 'N/A'
      });
    }
    return seats;
  }
  
  // For sleeper classes, allocate based on preferences
  const berthMap = {
    'Lower': 'LB',
    'Middle': 'MB',
    'Upper': 'UB',
    'Side Lower': 'SL',
    'Side Upper': 'SU',
    'No Preference': null
  };
  
  // Allocate seats with preference
  for (let i = 0; i < numberOfPassengers; i++) {
    const preference = preferences[i]?.berthPreference || 'No Preference';
    const berthCode = berthMap[preference];
    
    let assignedBerth;
    
    if (berthCode && config.berths.includes(berthCode)) {
      assignedBerth = berthCode;
    } else {
      // Random allocation if no preference or invalid preference
      assignedBerth = config.berths[Math.floor(Math.random() * config.berths.length)];
    }
    
    // Calculate coach and seat number
    const coachNumber = Math.floor(seatCounter / 72) + 1; // 72 seats per coach
    const seatInCoach = (seatCounter % 72) || 72;
    
    seats.push({
      seatNumber: `${config.prefix}${coachNumber}-${seatInCoach}`,
      berth: assignedBerth
    });
    
    seatCounter++;
  }
  
  return seats;
};

module.exports = { allocateSeats };