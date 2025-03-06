import React, { useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const SearchForm = ({ onClose }) => {
  const searchInputRef = useRef(null);
  
  useEffect(() => {
    // Focus the search input when the search form appears
    searchInputRef.current.focus();
    
    // Add event listener for escape key to close search
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
    console.log('Searching for:', searchInputRef.current.value);
    onClose();
  };
  
  return (
    <div className="py-4 animate-fadeIn">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          aria-label="Close search"
        >
          <XMarkIcon className="h-5 w-5 text-gray-400" />
        </button>
      </form>
    </div>
  );
};

export default SearchForm;