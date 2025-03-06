import React from 'react';
import { 
  ShoppingBagIcon, 
  CalendarIcon, 
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const ServicesSection = () => {
  // Current date and user
  const currentDateTime = "2025-03-06 22:54:46";
  const currentUser = "megafemworld";

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Experience convenience and quality with our comprehensive food services designed to meet all your dining needs.
          </p>
          <div className="text-sm text-gray-500 mt-2">
            Last updated: {currentDateTime} by {currentUser}
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          {/* Service 1: Food Order */}
          <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="p-6 bg-blue-600 text-white flex items-center justify-center">
              <ShoppingBagIcon className="h-16 w-16" />
            </div>
            
            <div className="p-8 flex-grow">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Food Order</h3>
              <p className="text-gray-600 mb-6">
                Browse our extensive menu of delicious meals prepared with fresh ingredients. Place your order online for pickup or delivery at your convenience.
              </p>
              
              <ul className="space-y-2 mb-8">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">✓</span>
                  <span>Fast online ordering</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">✓</span>
                  <span>Reliable delivery options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">✓</span>
                  <span>Customizable meal options</span>
                </li>
              </ul>
            </div>
            
            <div className="px-8 pb-8 mt-auto">
              <a 
                href="/order" 
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors w-full"
              >
                <span className="font-medium">Order Now</span>
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
          
          {/* Service 2: Seat Reservation */}
          <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="p-6 bg-green-600 text-white flex items-center justify-center">
              <CalendarIcon className="h-16 w-16" />
            </div>
            
            <div className="p-8 flex-grow">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Seat Reservation</h3>
              <p className="text-gray-600 mb-6">
                Reserve your table in advance to ensure a seamless dining experience. Choose your preferred seating area and time for your visit.
              </p>
              
              <ul className="space-y-2 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Easy online reservation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Special seating preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Last-minute availability alerts</span>
                </li>
              </ul>
            </div>
            
            <div className="px-8 pb-8 mt-auto">
              <a 
                href="/reservations" 
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md transition-colors w-full"
              >
                <span className="font-medium">Make Reservation</span>
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
          
          {/* Service 3: Event Booking & Catering */}
          <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="p-6 bg-amber-600 text-white flex items-center justify-center">
              <UserGroupIcon className="h-16 w-16" />
            </div>
            
            <div className="p-8 flex-grow">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Event Booking & Catering</h3>
              <p className="text-gray-600 mb-6">
                Host your special events with us or let us bring our delicious food to your venue with our professional catering services.
              </p>
              
              <ul className="space-y-2 mb-8">
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-2">✓</span>
                  <span>Private dining spaces</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-2">✓</span>
                  <span>Custom catering menus</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-2">✓</span>
                  <span>Professional event planning</span>
                </li>
              </ul>
            </div>
            
            <div className="px-8 pb-8 mt-auto">
              <a 
                href="/events" 
                className="flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-md transition-colors w-full"
              >
                <span className="font-medium">Plan Your Event</span>
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;