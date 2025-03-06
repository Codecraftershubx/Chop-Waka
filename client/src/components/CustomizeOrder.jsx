import React, { useState, useEffect } from 'react';
import { XMarkIcon, MinusIcon, PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CustomizeOrder = ({ onClose, onAddToCart }) => {
  // Sample food item to customize (in a real app, this would be passed as a prop)
  const [item, setItem] = useState({
    id: 101,
    name: 'Classic Cheeseburger',
    basePrice: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1800',
    description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, onion, and our special sauce on a brioche bun.',
  });

  // Customization options state
  const [size, setSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [toppings, setToppings] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  // Available sizes with price adjustments
  const sizes = [
    { id: 'small', name: 'Small', priceAdjustment: -2.00 },
    { id: 'medium', name: 'Medium', priceAdjustment: 0 },
    { id: 'large', name: 'Large', priceAdjustment: 2.00 },
  ];

  // Available toppings with prices
  const availableToppings = [
    { id: 1, name: 'Extra Cheese', price: 1.50 },
    { id: 2, name: 'Bacon', price: 2.00 },
    { id: 3, name: 'Avocado', price: 1.75 },
    { id: 4, name: 'Fried Egg', price: 1.50 },
    { id: 5, name: 'Caramelized Onions', price: 1.00 },
    { id: 6, name: 'Mushrooms', price: 1.25 },
    { id: 7, name: 'Jalapeños', price: 0.75 },
    { id: 8, name: 'BBQ Sauce', price: 0.50 },
  ];

  // Calculate total price based on selections
  useEffect(() => {
    let price = item.basePrice;
    
    // Add size adjustment
    const selectedSize = sizes.find(s => s.id === size);
    price += selectedSize ? selectedSize.priceAdjustment : 0;
    
    // Add toppings
    price += toppings.reduce((sum, topping) => {
      const foundTopping = availableToppings.find(t => t.id === topping);
      return sum + (foundTopping ? foundTopping.price : 0);
    }, 0);
    
    // Multiply by quantity
    price *= quantity;
    
    setTotalPrice(price);
  }, [item, size, toppings, quantity]);

  // Toggle topping selection
  const toggleTopping = (toppingId) => {
    if (toppings.includes(toppingId)) {
      setToppings(toppings.filter(id => id !== toppingId));
    } else {
      setToppings([...toppings, toppingId]);
    }
  };

  // Increase quantity
  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  // Add to cart function
  const handleAddToCart = () => {
    const customizedItem = {
      ...item,
      size,
      toppings: toppings.map(id => availableToppings.find(t => t.id === id)),
      specialInstructions,
      quantity,
      totalPrice
    };
    
    onAddToCart(customizedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="font-bold text-xl">Customize Your Order</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Item Information */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-1/3 h-48 rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-2xl font-medium mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <p className="text-lg text-red-500 font-medium">
                ${item.basePrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <h4 className="font-medium text-lg mb-3">Choose Size</h4>
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((sizeOption) => (
                <button
                  key={sizeOption.id}
                  onClick={() => setSize(sizeOption.id)}
                  className={`py-3 px-4 border rounded-lg transition-colors ${
                    size === sizeOption.id
                      ? 'bg-red-400 text-white border-red-400'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  <div className="font-medium">{sizeOption.name}</div>
                  <div className="text-sm">
                    {sizeOption.priceAdjustment === 0
                      ? 'Standard'
                      : sizeOption.priceAdjustment > 0
                        ? `+$${sizeOption.priceAdjustment.toFixed(2)}`
                        : `-$${Math.abs(sizeOption.priceAdjustment).toFixed(2)}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Toppings/Add-ons */}
          <div className="mb-8">
            <h4 className="font-medium text-lg mb-3">Add Extra Toppings</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableToppings.map((topping) => {
                const isSelected = toppings.includes(topping.id);
                return (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping.id)}
                    className={`p-3 border rounded-lg flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-red-50 border-red-400'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{topping.name}</span>
                      <span className="text-sm text-gray-600">+${topping.price.toFixed(2)}</span>
                    </div>
                    {isSelected && (
                      <CheckCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-8">
            <h4 className="font-medium text-lg mb-3">Special Instructions</h4>
            <textarea
              placeholder="Add any special requests or notes here..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-red-400 focus:border-red-400"
            />
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <h4 className="font-medium text-lg mb-3">Quantity</h4>
            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MinusIcon className="h-5 w-5" />
              </button>
              
              <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                {quantity}
              </span>
              
              <button
                onClick={increaseQuantity}
                disabled={quantity >= 10}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Total and Add to Cart */}
          <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
            <div>
              <div className="text-lg font-medium">Total</div>
              <div className="text-2xl font-bold text-red-500">
                ${totalPrice.toFixed(2)}
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 px-6 font-medium transition-colors"
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