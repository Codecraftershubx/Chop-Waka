import React, { useState } from 'react';
import { CheckCircleIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const SeatReservation = () => {
  // Current date and time info
  const currentDateTime = "2025-03-06 23:42:23";
  const currentUser = "megafemworld";
  
  // State for selected seats
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // State for reservation details
  const [reservationDetails, setReservationDetails] = useState({
    date: '',
    time: '',
    partySize: 2,
    specialRequests: '',
    name: currentUser,
    email: '',
    phone: ''
  });
  
  // State for showing the confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Restaurant opening hours
  const availableTimes = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', 
    '1:30 PM', '2:00 PM', '5:00 PM', '5:30 PM', '6:00 PM', 
    '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
  ];
  
  // Seat data - this represents the layout of the restaurant
  const seatMap = {
    // Window tables (2-person)
    windowTables: [
      { id: 'W1', type: 'window', capacity: 2, status: 'available', x: 1, y: 1 },
      { id: 'W2', type: 'window', capacity: 2, status: 'available', x: 1, y: 2 },
      { id: 'W3', type: 'window', capacity: 2, status: 'reserved', x: 1, y: 3 },
      { id: 'W4', type: 'window', capacity: 2, status: 'available', x: 1, y: 4 },
      { id: 'W5', type: 'window', capacity: 2, status: 'available', x: 5, y: 1 },
      { id: 'W6', type: 'window', capacity: 2, status: 'reserved', x: 5, y: 4 },
    ],
    
    // Center tables (4-person)
    centerTables: [
      { id: 'C1', type: 'center', capacity: 4, status: 'available', x: 2, y: 2 },
      { id: 'C2', type: 'center', capacity: 4, status: 'available', x: 2, y: 3 },
      { id: 'C3', type: 'center', capacity: 4, status: 'reserved', x: 4, y: 2 },
      { id: 'C4', type: 'center', capacity: 4, status: 'available', x: 4, y: 3 },
    ],
    
    // Booth seating (6-person)
    booths: [
      { id: 'B1', type: 'booth', capacity: 6, status: 'available', x: 3, y: 1 },
      { id: 'B2', type: 'booth', capacity: 6, status: 'reserved', x: 3, y: 4 },
    ],
  };
  
  // All seats combined for easier iteration
  const allSeats = [
    ...seatMap.windowTables,
    ...seatMap.centerTables,
    ...seatMap.booths
  ];
  
  // Handle seat selection
  const toggleSeatSelection = (seatId) => {
    // Find the seat in our data
    const seat = allSeats.find(s => s.id === seatId);
    
    // If seat is reserved or doesn't exist, do nothing
    if (!seat || seat.status === 'reserved') return;
    
    // If seat is already selected, remove it from selection
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      // If we're selecting a new seat, check if it fits our party size
      // For simplicity, we'll allow selecting multiple seats regardless of capacity
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };
  
  // Handle input changes for reservation details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Get total capacity of selected seats
  const getSelectedCapacity = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = allSeats.find(s => s.id === seatId);
      return total + (seat ? seat.capacity : 0);
    }, 0);
  };
  
  // Submit reservation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would send this data to a server
    const reservationData = {
      seats: selectedSeats,
      ...reservationDetails,
      timestamp: currentDateTime,
      user: currentUser
    };
    
    console.log('Reservation submitted:', reservationData);
    setShowConfirmation(true);
  };
  
  // Get seat color based on type and status
  const getSeatColor = (seat) => {
    // If the seat is selected
    if (selectedSeats.includes(seat.id)) {
      return 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600';
    }
    
    // If the seat is reserved/unavailable
    if (seat.status === 'reserved') {
      return 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-50';
    }
    
    // Available seats by type
    switch (seat.type) {
      case 'window':
        return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
      case 'center':
        return 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200';
      case 'booth':
        return 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200';
    }
  };
  
  // Get seat size based on capacity
  const getSeatSize = (capacity) => {
    switch (capacity) {
      case 2: return 'w-12 h-12 md:w-16 md:h-16';
      case 4: return 'w-16 h-16 md:w-20 md:h-20';
      case 6: return 'w-20 h-16 md:w-24 md:h-20';
      default: return 'w-12 h-12 md:w-16 md:h-16';
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reserve Your Table</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Select your preferred seating from our interactive floor map. 
            Window tables offer a view, center tables are great for groups, and booths provide privacy.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Seating chart */}
          <div className="lg:w-2/3 bg-white rounded-xl shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Restaurant Floor Plan</h2>
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center mb-6 gap-3 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border border-green-300 mr-1"></div>
                <span>Window (2 seats)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-amber-100 border border-amber-300 mr-1"></div>
                <span>Center (4 seats)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-100 border border-purple-300 mr-1"></div>
                <span>Booth (6 seats)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 border border-blue-600 mr-1"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 border border-gray-400 opacity-50 mr-1"></div>
                <span>Reserved</span>
              </div>
            </div>
            
            {/* Floor layout grid - This uses CSS grid for positioning */}
            <div className="relative border-4 border-gray-300 p-4 rounded-lg bg-gray-100 overflow-auto">
              {/* Restaurant elements */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 text-white text-center py-1">
                Entrance
              </div>
              
              {/* Seat grid - using CSS grid for layout */}
              <div className="min-h-[500px] pt-10 grid grid-cols-5 gap-4 relative">
                {/* Window area indicator */}
                <div className="absolute left-0 top-10 bottom-0 w-3 bg-blue-100 flex items-center justify-center">
                  <span className="transform -rotate-90 whitespace-nowrap text-blue-800 text-sm font-medium">Window View</span>
                </div>
                
                {/* Right window area */}
                <div className="absolute right-0 top-10 bottom-0 w-3 bg-blue-100 flex items-center justify-center">
                  <span className="transform rotate-90 whitespace-nowrap text-blue-800 text-sm font-medium">Window View</span>
                </div>
                
                {/* Place all seats according to their x,y coordinates */}
                {allSeats.map((seat) => (
                  <div 
                    key={seat.id}
                    style={{
                      gridColumn: seat.x,
                      gridRow: seat.y,
                    }}
                    className={`
                      ${getSeatSize(seat.capacity)}
                      ${getSeatColor(seat)}
                      flex items-center justify-center rounded-md border
                      ${seat.status !== 'reserved' ? 'cursor-pointer' : 'cursor-not-allowed'}
                      transition-all duration-200 transform hover:scale-105
                      font-medium text-center
                    `}
                    onClick={() => toggleSeatSelection(seat.id)}
                  >
                    <div>
                      <div>{seat.id}</div>
                      <div className="text-xs mt-1">{seat.capacity} seats</div>
                    </div>
                  </div>
                ))}
                
                {/* Bar area */}
                <div className="col-span-5 h-16 bg-amber-800 rounded-md text-white flex items-center justify-center">
                  Bar Area
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500 text-center">
              <p>Select one or more tables for your party. Click on a table to select/deselect it.</p>
              <p>Last updated: {currentDateTime}</p>
            </div>
          </div>
          
          {/* Right column - Reservation form */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
              
              {selectedSeats.length > 0 ? (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-1">Selected Seating:</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedSeats.map(seatId => {
                      const seat = allSeats.find(s => s.id === seatId);
                      return (
                        <span key={seatId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Table {seatId} ({seat?.capacity} seats)
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-sm text-blue-700">Total capacity: {getSelectedCapacity()} people</p>
                </div>
              ) : (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
                  <InformationCircleIcon className="h-5 w-5 inline-block mr-1" />
                  Please select at least one table from the floor plan
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Date</label>
                    <input
                      type="date"
                      name="date"
                      value={reservationDetails.date}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Time</label>
                    <select
                      name="time"
                      value={reservationDetails.time}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a time</option>
                      {availableTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Party Size</label>
                    <input
                      type="number"
                      name="partySize"
                      value={reservationDetails.partySize}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={reservationDetails.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={reservationDetails.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={reservationDetails.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={reservationDetails.specialRequests}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any special requests or dietary requirements..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-md font-medium text-white 
                      ${selectedSeats.length > 0 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={selectedSeats.length === 0}
                  >
                    Complete Reservation
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2 text-lg">Reservation Policy</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Reservations can be made up to 30 days in advance</li>
                <li>• Please arrive within 15 minutes of your reservation time</li>
                <li>• For parties larger than 8, please call us directly</li>
                <li>• Cancellations must be made at least 24 hours in advance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reservation Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reservation Confirmed!</h3>
              <p className="text-gray-600 mt-2">
                We've received your reservation request and will send a confirmation email shortly.
              </p>
            </div>
            
            <div className="mb-6 bg-gray-50 rounded-md p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{reservationDetails.date}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{reservationDetails.time}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tables:</span>
                <span className="font-medium">{selectedSeats.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Party Size:</span>
                <span className="font-medium">{reservationDetails.partySize} people</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                A confirmation has been sent to {reservationDetails.email}
              </p>
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatReservation;