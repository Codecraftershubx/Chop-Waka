import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  ShoppingBagIcon,
  XMarkIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import CustomizeOrder from './CustomizeOrder';
import { useCart } from '../context/CartContext';

const FoodMenu = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    cuisine: [],
    availability: []
  });
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Cart UI state
  const [showCart, setShowCart] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Use cart context for persistent cart management
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartSummary 
  } = useCart();

  // Current user and date - updated with the newest provided values
  const currentUser = "megafemworld";
  const currentDate = "2025-03-09 20:17:18";

  // Get cart summary
  const { itemCount: cartCount, total: cartTotal } = getCartSummary();

  // Available filter options
  const filterOptions = {
    cuisine: ['Italian', 'Mexican', 'Indian', 'Chinese', 'American', 'Japanese', 'Mediterranean', 'Thai'],
    availability: ['Available Now', 'Limited Quantity', 'Pre-Order']
  };

  // Add customization options to the menu items
  const allMenuItems = [
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      basePrice: 14.99,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000',
      cuisine: 'Italian',
      availability: 'Available Now',
      rating: 4.8,
      isCustomizable: true,
      customizationOptions: {
        sizes: [
          { id: 'small', name: 'Small (10")', priceAdjustment: -3.00 },
          { id: 'medium', name: 'Medium (12")', priceAdjustment: 0 },
          { id: 'large', name: 'Large (14")', priceAdjustment: 4.00 }
        ],
        toppings: [
          { id: 1, name: 'Extra Cheese', price: 2.00 },
          { id: 2, name: 'Pepperoni', price: 2.50 },
          { id: 3, name: 'Mushrooms', price: 1.50 },
          { id: 4, name: 'Bell Peppers', price: 1.00 },
          { id: 5, name: 'Olives', price: 1.00 }
        ]
      }
    },
    {
      id: 2,
      name: 'Chicken Tikka Masala',
      description: 'Tender chicken in a rich, creamy tomato sauce with aromatic spices',
      basePrice: 16.50,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000',
      cuisine: 'Indian',
      availability: 'Available Now',
      rating: 4.7,
      isCustomizable: true,
      customizationOptions: {
        sizes: [
          { id: 'small', name: 'Small', priceAdjustment: -2.50 },
          { id: 'medium', name: 'Medium', priceAdjustment: 0 },
          { id: 'large', name: 'Large', priceAdjustment: 3.00 }
        ],
        toppings: [
          { id: 1, name: 'Extra Sauce', price: 1.00 },
          { id: 2, name: 'Extra Chicken', price: 3.00 },
          { id: 3, name: 'Paneer', price: 2.50 },
          { id: 4, name: 'Raita', price: 1.50 }
        ]
      }
    },
    {
      id: 3,
      name: 'Vegetable Pad Thai',
      description: 'Stir-fried rice noodles with tofu, bean sprouts, peanuts, and lime',
      basePrice: 15.75,
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1000',
      cuisine: 'Thai',
      availability: 'Limited Quantity',
      rating: 4.5,
      isCustomizable: true,
      customizationOptions: {
        sizes: [
          { id: 'small', name: 'Small', priceAdjustment: -2.00 },
          { id: 'medium', name: 'Medium', priceAdjustment: 0 },
          { id: 'large', name: 'Large', priceAdjustment: 2.50 }
        ],
        toppings: [
          { id: 1, name: 'Extra Tofu', price: 1.75 },
          { id: 2, name: 'Chicken', price: 2.50 },
          { id: 3, name: 'Shrimp', price: 3.00 },
          { id: 4, name: 'Extra Peanuts', price: 0.75 }
        ]
      }
    },
    {
      id: 4,
      name: 'Double Cheeseburger',
      description: 'Two beef patties with cheddar cheese, lettuce, tomato, and special sauce',
      basePrice: 13.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000',
      cuisine: 'American',
      availability: 'Available Now',
      rating: 4.6,
      isCustomizable: true,
      customizationOptions: {
        sizes: [
          { id: 'small', name: 'Single', priceAdjustment: -3.00 },
          { id: 'medium', name: 'Double', priceAdjustment: 0 },
          { id: 'large', name: 'Triple', priceAdjustment: 3.00 }
        ],
        toppings: [
          { id: 1, name: 'Extra Cheese', price: 1.50 },
          { id: 2, name: 'Bacon', price: 2.00 },
          { id: 3, name: 'Avocado', price: 1.75 },
          { id: 4, name: 'Fried Egg', price: 1.50 },
          { id: 5, name: 'Caramelized Onions', price: 1.00 },
          { id: 6, name: 'Mushrooms', price: 1.25 },
          { id: 7, name: 'Jalapeños', price: 0.75 },
          { id: 8, name: 'BBQ Sauce', price: 0.50 },
        ]
      }
    }
  ];

  // Initialize menu
  useEffect(() => {
    setMenuItems(allMenuItems);
    setFilteredItems(allMenuItems);
  }, []);

  // Handle search and filter changes
  useEffect(() => {
    let result = [...allMenuItems];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) ||
          item.cuisine.toLowerCase().includes(query)
      );
    }
    
    // Apply cuisine filters
    if (activeFilters.cuisine.length > 0) {
      result = result.filter(item => 
        activeFilters.cuisine.includes(item.cuisine)
      );
    }
    
    // Apply availability filters
    if (activeFilters.availability.length > 0) {
      result = result.filter(item => 
        activeFilters.availability.includes(item.availability)
      );
    }
    
    setFilteredItems(result);
  }, [searchQuery, activeFilters]);

  // Toggle filter selection
  const toggleFilter = (category, value) => {
    setActiveFilters(prev => {
      const updated = {...prev};
      
      if (updated[category].includes(value)) {
        // Remove filter if already selected
        updated[category] = updated[category].filter(item => item !== value);
      } else {
        // Add filter if not selected
        updated[category] = [...updated[category], value];
      }
      
      return updated;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      cuisine: [],
      availability: []
    });
    setSearchQuery('');
  };
  
  // Open customize modal
  const handleCustomize = (item) => {
    setCurrentItem(item);
    setIsCustomizing(true);
  };
  
  // Close customize modal
  const handleCloseCustomize = () => {
    setIsCustomizing(false);
    setCurrentItem(null);
  };
  
  // Add item to cart from customize modal
  const handleAddToCart = (customizedItem) => {
    addToCart(customizedItem);
    setIsCustomizing(false); // Close the modal after adding
  };
  
  // Add to cart directly without customization (quick add)
  const handleQuickAdd = (item) => {
    // Find medium size (or default)
    const mediumSize = item.customizationOptions?.sizes?.find(s => s.id === 'medium') || 
      { id: 'medium', name: 'Medium', priceAdjustment: 0 };
      
    // Calculate item price
    const itemPrice = item.basePrice + mediumSize.priceAdjustment;
    
    const cartItem = {
      ...item,
      quantity: 1,
      size: mediumSize.name,
      sizeId: mediumSize.id,
      toppings: [],
      toppingIds: [],
      specialInstructions: '',
      pricePerItem: itemPrice,
      totalPrice: itemPrice
    };
    
    addToCart(cartItem);
  };
  
  // Handle confirm clear cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };
  
  // Toggle cart visibility
  const toggleCart = () => {
    setShowCart(prev => !prev);
  };
  
  // Format price for display
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-2">Our Menu</h1>
            <p className="text-gray-600">Explore our delicious offerings</p>
          </div>
          
          {/* Cart Button */}
          <div className="relative">
            <button 
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              onClick={toggleCart}
            >
              <ShoppingBagIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </div>
              )}
            </button>
            
            {/* Cart Panel */}
            {showCart && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl w-80 sm:w-96 z-50">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold">Your Cart ({cartCount})</h3>
                  <div className="flex items-center gap-2">
                    {cart.length > 0 && (
                      <button 
                        onClick={handleClearCart}
                        className="text-xs text-gray-500 hover:text-red-500"
                      >
                        Clear All
                      </button>
                    )}
                    <button 
                      onClick={() => setShowCart(false)} 
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {cart.length > 0 ? (
                    <div>
                      {/* Cart Items */}
                      <div className="divide-y divide-gray-200">
                        {cart.map((item) => (
                          <div key={item.cartId} className="p-4 flex">
                            {/* Item Image */}
                            <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            
                            {/* Item Details */}
                            <div className="ml-3 flex-grow">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{item.name}</h4>
                                <button 
                                  onClick={() => removeFromCart(item.cartId)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                              
                              {/* Customizations */}
                              <div className="text-xs text-gray-500 mt-1">
                                {item.size && <span>Size: {item.size} • </span>}
                                {item.toppings && item.toppings.length > 0 && (
                                  <span>Toppings: {item.toppings.join(', ')} • </span>
                                )}
                                {item.specialInstructions && (
                                  <span className="italic">"{item.specialInstructions.substring(0, 20)}..."</span>
                                )}
                              </div>
                              
                              {/* Price and Quantity */}
                              <div className="flex justify-between items-center mt-2">
                                <div className="text-red-500 font-medium">
                                  {formatPrice(item.totalPrice)}
                                </div>
                                
                                <div className="flex items-center border border-gray-200 rounded">
                                  <button 
                                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                  >
                                    <MinusIcon className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 text-sm">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                  >
                                    <PlusIcon className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Cart Total and Checkout */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold text-red-600">{formatPrice(cartTotal)}</span>
                        </div>
                        
                        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors">
                          Proceed to Checkout
                        </button>
                        
                        <div className="text-center text-xs text-gray-500 mt-2">
                          Ordered by: {currentUser} • {currentDate.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 mb-2">
                        <ShoppingBagIcon className="w-12 h-12 mx-auto opacity-50" />
                      </div>
                      <p className="text-gray-500">Your cart is empty</p>
                      <button 
                        onClick={() => setShowCart(false)}
                        className="mt-4 text-sm text-red-500 hover:text-red-600"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Search Bar and Filter Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for dishes, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-lg border-gray-200 focus:ring-red-400 focus:border-red-400"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filter By:</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Clear All Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cuisine Filters */}
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Cuisine</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.cuisine.map(cuisine => (
                    <button
                      key={cuisine}
                      onClick={() => toggleFilter('cuisine', cuisine)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        activeFilters.cuisine.includes(cuisine)
                          ? 'bg-red-400 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Availability Filters */}
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Availability</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.availability.map(avail => (
                    <button
                      key={avail}
                      onClick={() => toggleFilter('availability', avail)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        activeFilters.availability.includes(avail)
                          ? 'bg-red-400 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {avail}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Active Filters Display */}
        {(activeFilters.cuisine.length > 0 || 
          activeFilters.availability.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.cuisine.map(cuisine => (
              <div key={cuisine} className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-sm flex items-center">
                {cuisine}
                <button 
                  onClick={() => toggleFilter('cuisine', cuisine)} 
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  &times;
                </button>
              </div>
            ))}
            
            {activeFilters.availability.map(avail => (
              <div key={avail} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center">
                {avail}
                <button 
                  onClick={() => toggleFilter('availability', avail)} 
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing {filteredItems.length} of {menuItems.length} items
        </div>
        
        {/* Food Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden group">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Availability Badge */}
                  <div className={`absolute top-2 left-2 text-xs font-medium py-1 px-2 rounded-full ${
                    item.availability === 'Available Now' ? 'bg-green-100 text-green-800' :
                    item.availability === 'Limited Quantity' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.availability}
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                  
                  {/* Quick Add Button - Overlay on image hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleQuickAdd(item)}
                      className="bg-white text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full font-medium transition-colors"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <div className="text-red-500 font-semibold">${item.basePrice.toFixed(2)}</div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {/* Cuisine Tag */}
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {item.cuisine}
                    </span>
                  </div>
                  
                  <button 
                    className="w-full bg-red-400 hover:bg-red-500 text-white py-2 rounded-lg transition-colors"
                    onClick={() => handleCustomize(item)}
                  >
                    Customize
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800 mb-2">No dishes found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
            <button 
              onClick={clearFilters} 
              className="mt-4 px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Customization Modal */}
      {isCustomizing && currentItem && (
        <CustomizeOrder 
          onClose={handleCloseCustomize} 
          onAddToCart={handleAddToCart} 
          item={currentItem}
        />
      )}
    </div>
  );
};

export default FoodMenu;