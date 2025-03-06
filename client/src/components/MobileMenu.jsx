import React from 'react';

const MobileMenu = () => {
  return (
    <div className="md:hidden bg-white border-t border-gray-200 animate-slideDown">
      <nav className="flex flex-col px-4 py-2">
        <a href="/" className="py-3 text-gray-700 hover:text-blue-600 border-b border-gray-100">Home</a>
        <a href="/products" className="py-3 text-gray-700 hover:text-blue-600 border-b border-gray-100">Products</a>
        <a href="/about" className="py-3 text-gray-700 hover:text-blue-600 border-b border-gray-100">About</a>
        <a href="/contact" className="py-3 text-gray-700 hover:text-blue-600">Contact</a>
      </nav>
    </div>
  );
};

export default MobileMenu;