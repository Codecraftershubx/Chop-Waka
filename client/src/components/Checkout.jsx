import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCardIcon, ShoppingBagIcon, UserIcon, TruckIcon, ShieldCheckIcon,
  CheckIcon, ExclamationCircleIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  
  // Access cart data from CartContext
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartSummary 
  } = useCart();
  
  // Current user info - updated with the latest values
  const currentDateTime = "2025-03-09 23:23:28";
  const currentUser = "megafemworld";
  
  // Order details state
  const [orderDetails, setOrderDetails] = useState({
    deliveryMethod: 'delivery', 
    deliveryTime: 'asap', 
    scheduledTime: '', 
    scheduledDate: '',
    address: { 
      name: currentUser,  // Pre-fill with current user
      phone: '',
      street: '', 
      city: '', 
      state: '', 
      zipCode: '', 
      instructions: '' 
    },
    paymentMethod: 'card',
    termsAccepted: false,
    tip: 0
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
  // UI state
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    cart: true, delivery: true, payment: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [processingStep, setProcessingStep] = useState("");

  // Get the summary from CartContext
  const summary = getCartSummary();
  const cartItems = cart || []; // Ensure cartItems is always an array
  console.log(cartItems);
  
  // If cart is empty and not after order completion, redirect to menu
  useEffect(() => {
    if (cartItems.length === 0 && !orderCompleted && !isProcessing) {
      // You could add a timeout or confirm dialog here
      // navigate('/menu');
    }
  }, [cartItems, orderCompleted, navigate, isProcessing]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear specific error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setOrderDetails(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: type === 'checkbox' ? checked : value }
      }));
      
      // Clear nested error
      if (formErrors[section]?.[field]) {
        setFormErrors(prev => ({ 
          ...prev, 
          [section]: { ...prev[section], [field]: null } 
        }));
      }
    } else {
      setOrderDetails(prev => ({
        ...prev, [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  // Calculate order total including delivery fee and tip
  const calculateOrderTotal = () => {
    // Get current summary from cartContext
    const currentSummary = getCartSummary();
    const subtotal = parseFloat(currentSummary.subtotal) || 0;
    const tax = parseFloat(currentSummary.tax) || 0;

    const tipAmount = parseFloat(orderDetails.tip) || 0;
    const deliveryFee = orderDetails.deliveryMethod === 'delivery' ? 3.99 : 0;
    
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      tip: tipAmount.toFixed(2),
      total: (subtotal + tax + deliveryFee + tipAmount).toFixed(2)
    };
  };
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    // Basic validation
    if (!orderDetails.termsAccepted) {
      errors.termsAccepted = "Please accept the terms and conditions to continue";
    }
    
    if (orderDetails.deliveryMethod === 'delivery') {
      if (!orderDetails.address.name) {
        errors.address = { ...errors.address, name: "Name is required" };
      }
      
      if (!orderDetails.address.phone) {
        errors.address = { ...errors.address, phone: "Phone number is required" };
      } else if (!/^\d{10,15}$/.test(orderDetails.address.phone.replace(/[^\d]/g, ''))) {
        errors.address = { ...errors.address, phone: "Please enter a valid phone number" };
      }
      
      if (!orderDetails.address.street) {
        errors.address = { ...errors.address, street: "Street address is required" };
      }
      if (!orderDetails.address.city) {
        errors.address = { ...errors.address, city: "City is required" };
      }
      if (!orderDetails.address.state) {
        errors.address = { ...errors.address, state: "State is required" };
      }
      if (!orderDetails.address.zipCode) {
        errors.address = { ...errors.address, zipCode: "ZIP code is required" };
      }
    }
    
    if (orderDetails.deliveryTime === 'scheduled') {
      if (!orderDetails.scheduledDate) {
        errors.scheduledDate = "Please select a delivery date";
      }
      if (!orderDetails.scheduledTime) {
        errors.scheduledTime = "Please select a delivery time";
      }
    }

    
    return errors;
  };
  
  // Process payment
  const processPayment = async () => {
    try {
      setProcessingStep("Processing payment...");
      
      // This is where you would integrate with a payment processor like Stripe
      const paymentData = {
        amount: calculateOrderTotal().total,
        currency: 'usd',
        paymentMethod: orderDetails.paymentMethod,
        cardInfo: orderDetails.paymentMethod === 'card' ? {
          // Only send minimal required info to backend
          lastFour: orderDetails.cardInfo.number.slice(-4),
          expiryMonth: orderDetails.cardInfo.expiry.split('/')[0],
          expiryYear: orderDetails.cardInfo.expiry.split('/')[1],
        } : null
      };
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return transaction info
      return { 
        success: true,
        transactionId: 'txn_' + Math.random().toString(36).substring(2, 15)
      };
    } catch (error) {
      console.error("Payment processing error:", error);
      throw new Error(error?.response?.data?.message || "Payment processing failed. Please try again.");
    }
  };
  
  // Submit order to backend
  const submitOrderToBackend = async (paymentResult) => {
    try {
      setProcessingStep("Creating your order...");
      
      const orderSummary = calculateOrderTotal();
      
      // Prepare order data
      const orderData = {
        customer: {
          name: orderDetails.address.name || currentUser,
          email: 'user@example.com', // In a real app, get this from user profile
          phone: orderDetails.address.phone, // Now using the phone from the form
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          pricePerItem: item.pricePerItem,
          totalPrice: item.totalPrice,
          customizations: {
            size: item.size,
            toppings: item.toppings,
            specialInstructions: item.specialInstructions || ''
          }
        })),
        deliveryDetails: {
          method: orderDetails.deliveryMethod,
          time: orderDetails.deliveryTime === 'asap' ? 'ASAP' : `${orderDetails.scheduledDate} ${orderDetails.scheduledTime}`,
          address: orderDetails.deliveryMethod === 'delivery' ? orderDetails.address : null
        },
        payment: {
          method: orderDetails.paymentMethod,
          transactionId: paymentResult.transactionId,
          subtotal: parseFloat(orderSummary.subtotal),
          tax: parseFloat(orderSummary.tax),
          deliveryFee: parseFloat(orderSummary.deliveryFee),
          tip: parseFloat(orderSummary.tip),
          total: parseFloat(orderSummary.total)
        },
        orderDate: currentDateTime
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return a mock order response
      return {
        success: true,
        order: {
          id: 'FZ' + Math.floor(100000 + Math.random() * 900000),
          estimatedDeliveryTime: '30-45 minutes',
          status: 'confirmed'
        }
      };
    } catch (error) {
      console.error("Order submission error:", error);
      throw new Error(error?.response?.data?.message || "Failed to submit order. Please try again.");
    }
  };
  
  // Place order handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      
      // Expand sections that have errors
      if (errors.address || errors.scheduledDate || errors.scheduledTime) {
        setExpandedSections(prev => ({ ...prev, delivery: true }));
      }
      if (errors.cardInfo || errors.termsAccepted) {
        setExpandedSections(prev => ({ ...prev, payment: true }));
      }
      
      // Scroll to first error
      const firstErrorElement = document.querySelector('.error-message');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }
    
    // Start processing
    setIsProcessing(true);
    setErrorMessage("");
    
    try {
      // 1. Process payment
      const paymentResult = await processPayment();
      
      // 2. Submit order to backend
      const orderResult = await submitOrderToBackend(paymentResult);
      
      // 3. Complete the order
      setOrderNumber(orderResult.order.id);
      setProcessingStep("Order confirmed!");
      
      // 4. Clear the cart
      clearCart();
      
      // 5. Show order confirmation
      setOrderCompleted(true);
    } catch (error) {
      console.error("Order processing error:", error);
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
      setProcessingStep("");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const orderSummary = calculateOrderTotal();
  
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

  // Field error message component
  const ErrorMessage = ({ error }) => error ? (
    <p className="text-red-500 text-xs mt-1 error-message">{error}</p>
  ) : null;
  
  // Processing overlay
  const ProcessingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-xl text-center">
        <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">Processing Order</h3>
        <p className="text-gray-600 mb-4">{processingStep}</p>
        <p className="text-sm text-gray-500">Please do not refresh the page...</p>
      </div>
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
                  <p className="text-gray-600">Customer:</p>
                  <p className="font-medium">{orderDetails.address.name}</p>
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
                  <p className="font-medium">${orderSummary.total}</p>
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
      {isProcessing && <ProcessingOverlay />}
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order by providing your delivery and payment details.</p>
        </div>
        
        {/* Error Message Banner */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">There was a problem processing your order</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        )}
        
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
                        <div key={item.cartId} className="flex items-center py-4 border-b">
                          <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded-md" />
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <p className="font-medium text-gray-900">${(item.pricePerItem * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {item.size && `Size: ${item.size}`}
                              {item.toppings && item.toppings.length > 0 && 
                               ` • Toppings: ${item.toppings.join(', ')}`}
                            </p>
                            
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100">-</button>
                                <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100">+</button>
                              </div>
                              <button onClick={() => removeFromCart(item.cartId)}
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
                        {/* Name and Phone fields */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="address.name"
                            value={orderDetails.address.name}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-md ${
                              formErrors.address?.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="John Doe"
                            required
                          />
                          <ErrorMessage error={formErrors.address?.name} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="address.phone"
                            value={orderDetails.address.phone}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-md ${
                              formErrors.address?.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="(123) 456-7890"
                            required
                          />
                          <ErrorMessage error={formErrors.address?.phone} />
                        </div>
                        
                        {/* Street Address */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="address.street"
                            value={orderDetails.address.street}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-md ${
                              formErrors.address?.street ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                          />
                          <ErrorMessage error={formErrors.address?.street} />
                        </div>
                        
                        {/* City */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="address.city"
                            value={orderDetails.address.city}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-md ${
                              formErrors.address?.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                          />
                          <ErrorMessage error={formErrors.address?.city} />
                        </div>
                        
                        {/* State and ZIP */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="address.state"
                              value={orderDetails.address.state}
                              onChange={handleInputChange}
                              className={`w-full p-2 border rounded-md ${
                                formErrors.address?.state ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                            />
                            <ErrorMessage error={formErrors.address?.state} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ZIP Code <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="address.zipCode"
                              value={orderDetails.address.zipCode}
                              onChange={handleInputChange}
                              className={`w-full p-2 border rounded-md ${
                                formErrors.address?.zipCode ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                            />
                            <ErrorMessage error={formErrors.address?.zipCode} />
                          </div>
                        </div>
                        
                        {/* Delivery Instructions */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery Instructions (Optional)
                          </label>
                          <textarea
                            name="address.instructions"
                            value={orderDetails.address.instructions || ''}
                            onChange={handleInputChange}
                            placeholder="E.g., Doorbell doesn't work, please call..."
                            className="w-full p-2 border border-gray-300 rounded-md h-20"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Delivery Time</h3>
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                      <label className={`flex-1 cursor-pointer border rounded-md p-4 flex items-center ${
                        orderDetails.deliveryTime === 'asap' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}>
                        <input type="radio" name="deliveryTime" value="asap" 
                               checked={orderDetails.deliveryTime === 'asap'}
                               onChange={handleInputChange} className="mr-2 h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">As Soon As Possible</p>
                          <p className="text-xs text-gray-500">30-45 minutes estimated</p>
                        </div>
                      </label>
                      
                      <label className={`flex-1 cursor-pointer border rounded-md p-4 flex items-center ${
                        orderDetails.deliveryTime === 'scheduled' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}>
                        <input type="radio" name="deliveryTime" value="scheduled" 
                               checked={orderDetails.deliveryTime === 'scheduled'}
                               onChange={handleInputChange} className="mr-2 h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">Schedule for Later</p>
                          <p className="text-xs text-gray-500">Select date and time</p>
                        </div>
                      </label>
                    </div>
                    
                    {orderDetails.deliveryTime === 'scheduled' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="scheduledDate"
                            value={orderDetails.scheduledDate}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-md ${
                              formErrors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                          <ErrorMessage error={formErrors.scheduledDate} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="scheduledTime"
                            value={orderDetails.scheduledTime}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-md ${
                              formErrors.scheduledTime ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                          >
                            <option value="">Select time</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="12:30 PM">12:30 PM</option>
                            <option value="1:00 PM">1:00 PM</option>
                            <option value="1:30 PM">1:30 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="5:00 PM">5:00 PM</option>
                            <option value="5:30 PM">5:30 PM</option>
                            <option value="6:00 PM">6:00 PM</option>
                            <option value="6:30 PM">6:30 PM</option>
                            <option value="7:00 PM">7:00 PM</option>
                            <option value="7:30 PM">7:30 PM</option>
                            <option value="8:00 PM">8:00 PM</option>
                            <option value="8:30 PM">8:30 PM</option>
                          </select>
                          <ErrorMessage error={formErrors.scheduledTime} />
                        </div>
                      </div>
                    )}
                  </div>
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
                  
                  

                  
                  <div className="pt-4">
                    <label className={`flex items-center text-sm ${formErrors.termsAccepted ? 'text-red-500' : 'text-gray-700'}`}>
                      <input 
                        type="checkbox" 
                        name="termsAccepted" 
                        checked={orderDetails.termsAccepted}
                        onChange={handleInputChange} 
                        className={`h-4 w-4 mr-2 ${formErrors.termsAccepted ? 'text-red-500' : 'text-blue-600'}`} 
                      />
                      <span>
                        I agree to the <a href="/terms" className="text-blue-600">terms and conditions</a> 
                        and <a href="/privacy" className="text-blue-600">privacy policy</a>
                      </span>
                    </label>
                    <ErrorMessage error={formErrors.termsAccepted} />
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
                  <span>${orderSummary.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${orderSummary.tax}</span>
                </div>
                {orderDetails.deliveryMethod === 'delivery' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>${orderSummary.deliveryFee}</span>
                  </div>
                )}
                {parseFloat(orderDetails.tip) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tip</span>
                    <span>${orderSummary.tip}</span>
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${orderSummary.total}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || isProcessing}
                className={`w-full mt-6 py-3 rounded-md flex items-center justify-center
                  ${cartItems.length === 0 || isProcessing
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                {isProcessing ? 'Processing...' : cartItems.length === 0 ? 'Cart is Empty' : 'Place Order'}
              </button>
              
              <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Secure checkout powered by Stripe
              </div>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                Logged in as: {currentUser} • {currentDateTime}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;