import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  TrashIcon, 
  PlusIcon, 
  MinusIcon, 
  ArrowLeftIcon,
  XMarkIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartSummary 
  } = useCart();
  
  // Current user info from props
  const currentDateTime = "2025-03-10 19:16:22";
  const currentUser = "megafemworld";
  
  // Local state for promo code
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Get summary from cart context
  const { subtotal, tax, total, itemCount, deliveryFee } = getCartSummary();
  
  // Handle promo code submission
  const handleApplyPromoCode = (e) => {
    e.preventDefault();
    
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    setIsApplyingPromo(true);
    setPromoError('');
    setPromoSuccess('');
    
    // Simulating API call delay
    setTimeout(() => {
      if (promoCode.toUpperCase() === 'WELCOME10') {
        setPromoSuccess('10% discount applied!');
      } else {
        setPromoError('Invalid or expired promo code');
      }
      setIsApplyingPromo(false);
    }, 1000);
  };
  
  // Handle confirm clear cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };
  
  // Format price for display
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };
  
  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
            <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/menu" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Browse Our Menu
            </Link>
            
            <div className="mt-12 text-sm text-gray-500">
              Logged in as: {currentUser} • {currentDateTime}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <div>
            <span className="text-gray-600 mr-3">Items: {itemCount}</span>
            <button 
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Cart Items</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cart.map(item => (
                  <div key={item.cartId} className="p-6 flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                          <div className="mt-1 text-sm text-gray-500 space-y-1">
                            {item.size && <p>Size: {item.size}</p>}
                            {item.toppings && item.toppings.length > 0 && (
                              <p>Toppings: {item.toppings.join(', ')}</p>
                            )}
                            {item.specialInstructions && (
                              <p className="italic">
                                "{item.specialInstructions}"
                              </p>
                            )}
                          </div>
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            {formatPrice(item.pricePerItem)} each
                          </p>
                        </div>
                        <div className="flex">
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatPrice(item.totalPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-gray-50">
                <Link
                  to="/menu"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">{formatPrice(deliveryFee)}</span>
                </div>
                
                {/* Promo Code */}
                <div className="pt-4">
                  <form onSubmit={handleApplyPromoCode} className="flex">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={isApplyingPromo}
                    />
                    <button
                      type="submit"
                      className={`px-4 rounded-r-md font-medium ${
                        isApplyingPromo
                          ? 'bg-gray-300 text-gray-500'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      disabled={isApplyingPromo}
                    >
                      {isApplyingPromo ? 'Applying...' : 'Apply'}
                    </button>
                  </form>
                  
                  {promoError && (
                    <div className="mt-1 text-sm flex items-center text-red-600">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {promoError}
                    </div>
                  )}
                  
                  {promoSuccess && (
                    <div className="mt-1 text-sm flex items-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {promoSuccess}
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-medium text-gray-900">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </div>
                
                <div className="mt-6 text-center text-xs text-gray-500">
                  Logged in as: {currentUser} • {currentDateTime}
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Contact us if you have any questions about your order or delivery options.
              </p>
              <a 
                href="/contact" 
                className="text-sm text-blue-800 font-medium hover:text-blue-900"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;