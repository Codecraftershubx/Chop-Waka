import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CustomizeOrder = ({ item, onClose, onAddToCart }) => {
  // Initialize customization state
  const [size, setSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [toppings, setToppings] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [totalPrice, setTotalPrice] = useState(item.basePrice);

  // Check if item has customization options, otherwise use defaults
  const sizes = item.customizationOptions?.sizes || [
    { id: 'small', name: 'Small', priceAdjustment: -2.00 },
    { id: 'medium', name: 'Medium', priceAdjustment: 0 },
    { id: 'large', name: 'Large', priceAdjustment: 2.00 },
  ];

  const availableToppings = item.customizationOptions?.toppings || [
    { id: 1, name: 'Extra Cheese', price: 1.50 },
    { id: 2, name: 'Bacon', price: 2.00 },
    { id: 3, name: 'Avocado', price: 1.75 },
    { id: 4, name: 'Fried Egg', price: 1.50 },
    { id: 5, name: 'Caramelized Onions', price: 1.00 },
    { id: 6, name: 'Mushrooms', price: 1.25 },
    { id: 7, name: 'Jalapeños', price: 0.75 },
    { id: 8, name: 'BBQ Sauce', price: 0.50 },
  ];

  // Calculate total price whenever customizations change
  useEffect(() => {
    // Start with base price
    let price = item.basePrice;
    
    // Add size price adjustment
    const selectedSize = sizes.find(s => s.id === size);
    if (selectedSize) {
      price += selectedSize.priceAdjustment;
    }
    
    // Add toppings prices
    let toppingsTotal = 0;
    toppings.forEach(toppingId => {
      const topping = availableToppings.find(t => t.id === toppingId);
      if (topping) {
        toppingsTotal += topping.price;
      }
    });
    
    // Calculate final price per item
    const itemTotal = price + toppingsTotal;
    
    // Total price accounts for quantity
    setTotalPrice(itemTotal * quantity);
  }, [size, quantity, toppings, item.basePrice]);

  // Toggle a topping selection
  const toggleTopping = (id) => {
    setToppings(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id) 
        : [...prev, id]
    );
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    // Get selected size details
    const selectedSizeObj = sizes.find(s => s.id === size);
    
    // Get selected toppings details
    const selectedToppingsDetails = toppings.map(id => 
      availableToppings.find(t => t.id === id)
    ).filter(Boolean);
    
    // Calculate price per item (without quantity)
    const pricePerItem = item.basePrice + 
      selectedSizeObj.priceAdjustment + 
      selectedToppingsDetails.reduce((total, t) => total + t.price, 0);
    
    // Create customized item for cart
    const cartItem = {
      ...item,
      cartId: Date.now(), // Unique ID for cart item
      quantity,
      size: selectedSizeObj.name,
      sizeId: selectedSizeObj.id,
      toppings: selectedToppingsDetails.map(t => t.name),
      toppingIds: toppings,
      specialInstructions,
      pricePerItem: pricePerItem,
      totalPrice: totalPrice,
    };
    
    onAddToCart(cartItem);
  };
  
  // Format price for display
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Customize Your {item.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          {/* Item Info */}
          <div className="mb-6 flex">
            <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h4 className="font-medium text-lg">{item.name}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <div className="text-red-500 font-semibold mt-1">{formatPrice(item.basePrice)}</div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Choose Size</h4>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map(sizeOption => (
                <button
                  key={sizeOption.id}
                  className={`border rounded-lg py-2 px-3 ${
                    size === sizeOption.id
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSize(sizeOption.id)}
                >
                  <div>{sizeOption.name}</div>
                  <div className="text-xs">
                    {sizeOption.priceAdjustment > 0 
                      ? `+${formatPrice(sizeOption.priceAdjustment)}` 
                      : sizeOption.priceAdjustment < 0 
                        ? formatPrice(sizeOption.priceAdjustment)
                        : 'Standard'}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Toppings */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Add Toppings</h4>
            <div className="grid grid-cols-2 gap-2">
              {availableToppings.map(topping => (
                <button
                  key={topping.id}
                  className={`border rounded-lg py-2 px-3 flex justify-between items-center ${
                    toppings.includes(topping.id)
                      ? 'bg-red-100 border-red-300 text-red-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleTopping(topping.id)}
                >
                  <span>{topping.name}</span>
                  <span className="text-sm font-medium">+{formatPrice(topping.price)}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Special Instructions */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Special Instructions</h4>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-red-400 focus:border-red-400"
              rows="3"
              placeholder="Any special requests for this item..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            ></textarea>
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Quantity</h4>
            <div className="flex items-center border border-gray-300 rounded-lg w-max">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Total and Add to Cart */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total:</span>
              <span className="text-xl font-bold text-red-600">{formatPrice(totalPrice)}</span>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeOrder;