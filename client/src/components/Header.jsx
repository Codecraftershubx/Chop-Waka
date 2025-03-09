import React, { useState } from 'react';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // Updated current date and user
  const currentUser = "megafemworld";
  const currentDateTime = "2025-03-06 22:28:37";
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 sticky top-0 z-50">
      {/* Top bar with user info */}
      <div className="bg-blue-900/30 text-white py-1">
        <div className="container mx-auto px-4 flex justify-end text-xs md:text-sm">
          <span className="opacity-80">
            Welcome, {currentUser} • {currentDateTime.split(' ')[0]}
          </span>
        </div>
      </div>
      
      {/* Main header content */}
      <div className="container mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <span className="text-blue-600 text-xl font-bold">CW</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white tracking-wide">Chop</span>
                  <span className="text-2xl font-light text-blue-100">Waka</span>
                </div>
              </div>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {['Home', 'Menu', 'Reservations', 'Event', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className="px-4 py-2 text-blue-100 hover:text-white hover:bg-blue-700/30 rounded-md transition-colors duration-200 font-medium"
              >
                {item}
              </a>
            ))}
          </nav>
          
          {/* Order Now Button */}
          <div className="hidden md:block">
            <a 
              href="/order" 
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-6 rounded-full shadow-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Order Now
            </a>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-white hover:bg-blue-700/30 p-2 rounded-md transition-colors" 
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {['Home', 'Menu', 'Reservations', 'About', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className="block px-4 py-2 text-blue-100 hover:bg-blue-600 rounded-md"
              >
                {item}
              </a>
            ))}
            <div className="pt-2 pb-1">
              <a 
                href="/order" 
                className="block w-full text-center bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-6 rounded-md"
              >
                Order Now
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300"></div>
    </header>
  );
};

export default Header;