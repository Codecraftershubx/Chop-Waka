import React, { useState } from 'react';
import { 
  CreditCardIcon, ShoppingBagIcon, UserIcon, TruckIcon, ShieldCheckIcon,
  CheckIcon, ExclamationCircleIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon
} from '@heroicons/react/24/outline';

const Checkout = () => {
  // Current user info
  const currentDateTime = "2025-03-07 00:41:38";
  const currentUser = "megafemworld";
  
  // Cart items
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Margherita Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000",
      price: 14.99, quantity: 1, options: "Medium, Thin Crust" },
    { id: 2, name: "Chicken Tikka Masala", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000",
      price: 16.50, quantity: 2, options: "Spicy, With Naan" },
    { id: 3, name: "Chocolate Cake", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1080",
      price: 7.99, quantity: 1, options: "Slice" }
  ]);
  
  // Order details state
  const [orderDetails, setOrderDetails] = useState({
    deliveryMethod: 'delivery', deliveryTime: 'asap', scheduledTime: '', scheduledDate: '',
    address: { street: '', city: '', state: '', zipCode: '', instructions: '' },
    paymentMethod: 'card', cardInfo: { number: '', name: currentUser, expiry: '', cvv: '' }
  });
  
  // UI state
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    cart: true, delivery: true, payment: true
  });
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setOrderDetails(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setOrderDetails(prev => ({
        ...prev, [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  // Calculate order summary
  const calculateOrderSummary = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.0875; // 8.75% tax
    const deliveryFee = orderDetails.deliveryMethod === 'delivery' ? 4.99 : 0;
    const tip = parseFloat(orderDetails.tip) || 0;
    const total = subtotal + tax + deliveryFee + tip;
    
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      tip: tip.toFixed(2),
      total: total.toFixed(2)
    };
  };
  
  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };
  
  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  // Place order handler
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!orderDetails.termsAccepted) {
      alert("Please accept the terms and conditions to continue.");
      return;
    }
    
    if (orderDetails.deliveryMethod === 'delivery' && 
        (!orderDetails.address.street || !orderDetails.address.zipCode)) {
      alert("Please fill in all required delivery address fields.");
      return;
    }
    
    // Generate order number and show confirmation
    const genOrderNumber = "FZ" + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(genOrderNumber);
    setOrderCompleted(true);
  };
  
  const summary = calculateOrderSummary();
  
  // Section header component for consistency
  const SectionHeader = ({ title, icon, section }) => (
    <div className="flex justify-between items-center p-6 bg-blue-50 cursor-pointer"
         onClick={() => toggleSection(section)}>
      <div className="flex items-center">
        {icon}
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
      </div>
      {expandedSections[section] ? 
        <ChevronUpIcon className="h-5 w-5 text-blue-700" /> : 
        <ChevronDownIcon className="h-5 w-5 text-blue-700" />}
    </div>
  );
  
  // Order confirmed view
  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-green-50 text-center">
            <div className="mx-auto rounded-full bg-green-100 p-4 w-20 h-20 flex items-center justify-center">
              <CheckIcon className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-green-800">Order Confirmed!</h2>
            <p className="mt-2 text-green-700">Thank you for your order. Your food is being prepared.</p>
            <p className="mt-1 text-green-600 font-medium">Order Number: {orderNumber}</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Order Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order Date:</p>
                  <p className="font-medium">{currentDateTime}</p>
                </div>
                <div>
                  <p className="text-gray-600">Delivery Method:</p>
                  <p className="font-medium capitalize">{orderDetails.deliveryMethod}</p>
                </div>
                <div>
                  <p className="text-gray-600">Delivery Time:</p>
                  <p className="font-medium">
                    {orderDetails.deliveryTime === 'asap' ? 'As Soon As Possible' : 
                     `${orderDetails.scheduledDate} at ${orderDetails.scheduledTime}`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total:</p>
                  <p className="font-medium">${summary.total}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm mb-6">A confirmation email has been sent to your email address.</p>
              <div className="flex justify-center space-x-4">
                <a href="/menu" className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                  Order More
                </a>
                <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Return Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order by providing your delivery and payment details.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Order Form */}
          <div className="lg:w-2/3 space-y-6">
            {/* Cart Summary Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <SectionHeader 
                title={`Your Order (${cartItems.length} items)`}
                icon={<ShoppingBagIcon className="h-6 w-6 text-blue-700 mr-3" />}
                section="cart"
              />
              
              {expandedSections.cart && (
                <div className="p-6">
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center py-4 border-b">
                          <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded-md" />
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-gray-500">{item.options}</p>
                            
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100">-</button>
                                <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100">+</button>
                              </div>
                              <button onClick={() => removeItem(item.id)}
                                      className="text-sm text-red-600 hover:text-red-800">Remove</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto" />
                      <p className="mt-2 text-gray-500">Your cart is empty</p>
                      <a href="/menu" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
                        Browse Menu
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <SectionHeader 
                title="Delivery Information"
                icon={<TruckIcon className="h-6 w-6 text-blue-700 mr-3" />}
                section="delivery"
              />
              
              {expandedSections.delivery && (
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Delivery Method</h3>
                    <div className="flex space-x-4">
                      <label className={`flex-1 cursor-pointer border rounded-md p-4 flex items-center ${
                        orderDetails.deliveryMethod === 'delivery' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}>
                        <input type="radio" name="deliveryMethod" value="delivery" 
                               checked={orderDetails.deliveryMethod === 'delivery'}
                               onChange={handleInputChange} className="mr-2 h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">Delivery</p>
                          <p className="text-xs text-gray-500">Delivered to your address</p>
                        </div>
                      </label>
                      
                      <label className={`flex-1 cursor-pointer border rounded-md p-4 flex items-center ${
                        orderDetails.deliveryMethod === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}>
                        <input type="radio" name="deliveryMethod" value="pickup" 
                               checked={orderDetails.deliveryMethod === 'pickup'}
                               onChange={handleInputChange} className="mr-2 h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">Pickup</p>
                          <p className="text-xs text-gray-500">Ready in 15-20 minutes</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {orderDetails.deliveryMethod === 'delivery' && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Delivery Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                          <input type="text" name="address.street" value={orderDetails.address.street}
                                 onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input type="text" name="address.city" value={orderDetails.address.city}
                                 onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input type="text" name="address.state" value={orderDetails.address.state}
                                   onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                            <input type="text" name="address.zipCode" value={orderDetails.address.zipCode}
                                   onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <SectionHeader 
                title="Payment Information"
                icon={<CreditCardIcon className="h-6 w-6 text-blue-700 mr-3" />}
                section="payment"
              />
              
              {expandedSections.payment && (
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Payment Method</h3>
                    <div className="flex flex-wrap gap-4">
                      <label className={`flex-1 min-w-[180px] cursor-pointer border rounded-md p-4 flex items-center ${
                        orderDetails.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}>
                        <input type="radio" name="paymentMethod" value="card" 
                               checked={orderDetails.paymentMethod === 'card'}
                               onChange={handleInputChange} className="mr-2 h-4 w-4 text-blue-600" />
                        <div className="flex items-center">
                          <CreditCardIcon className="h-5 w-5 text-gray-600 mr-2" />
                          <span>Credit/Debit Card</span>
                        </div>
                      </label>
                      
                      <label className={`flex-1 min-w-[180px] cursor-pointer border rounded-md p-4 flex items-center ${
                        orderDetails.paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}>
                        <input type="radio" name="paymentMethod" value="paypal" 
                               checked={orderDetails.paymentMethod === 'paypal'}
                               onChange={handleInputChange} className="mr-2 h-4 w-4 text-blue-600" />
                        <div className="flex items-center">
                          <span className="text-blue-600 mr-2 font-bold">Pay</span>
                          <span className="text-blue-900 font-bold">Pal</span>
                        </div>
                      </label>
                      
                      <label className={`flex-1 min-w-[180px] cursor-pointer border rounded-md p-4 flex items-center ${
                        orderDetails.paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}>
                        <input type="radio" name="paymentMethod" value="cash" 
                               checked={orderDetails.paymentMethod === 'cash'}
                               onChange={handleInputChange} className="mr-2 h-4 w-4 text-blue-600" />
                        <div className="flex items-center">
                          <span>Cash on Delivery</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* {orderDetails.paymentMethod === 'card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input type="text" name="cardInfo.number" value={orderDetails.cardInfo.number}
                               onChange={handleInputChange} placeholder="**** **** **** ****"
                               className="w-full p-2 border border-gray-300 rounded-md" maxLength="19" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input type="text" name="cardInfo.name" value={orderDetails.cardInfo.name}
                               onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input type="text" name="cardInfo.expiry" value={orderDetails.cardInfo.expiry}
                                 onChange={handleInputChange} placeholder="MM/YY"
                                 className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input type="text" name="cardInfo.cvv" value={orderDetails.cardInfo.cvv}
                                 onChange={handleInputChange} placeholder="***"
                                 className="w-full p-2 border border-gray-300 rounded-md" maxLength="4" required />
                        </div>
                      </div>
                    </div>
                  )} */}
                  
                  <div className="pt-4">
                    <label className="flex items-center text-sm">
                      <input type="checkbox" name="termsAccepted" checked={orderDetails.termsAccepted}
                             onChange={handleInputChange} className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-gray-700">
                        I agree to the <a href="/terms" className="text-blue-600">terms and conditions</a> 
                        and <a href="/privacy" className="text-blue-600">privacy policy</a>
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-800 mb-6 pb-4 border-b">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${summary.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${summary.tax}</span>
                </div>
                {orderDetails.deliveryMethod === 'delivery' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>${summary.deliveryFee}</span>
                  </div>
                )}
                
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${summary.total}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center"
              >
                Place Order
              </button>
              
              <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Secure checkout powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;