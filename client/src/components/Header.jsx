import React, { useState } from 'react';
import { XMarkIcon, Bars3Icon, ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchForm from './SearchForm';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Logo</span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
            <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium">Products</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
          </nav>
          
          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSearch} 
              className="text-gray-600 hover:text-blue-600 transition-colors" 
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            
            <a 
              href="/cart" 
              className="text-gray-600 hover:text-blue-600 transition-colors relative" 
              aria-label="Cart"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
            </a>
            
            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu} 
              className="md:hidden text-gray-600 hover:text-blue-600 transition-colors" 
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
        
        {/* Search Form */}
        {isSearchOpen && <SearchForm onClose={() => setIsSearchOpen(false)} />}
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && <MobileMenu />}
    </header>
  );
};

export default Header;