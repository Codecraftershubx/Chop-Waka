import React, { createContext, useState, useContext, useEffect } from 'react';

// Constants
const CART_STORAGE_KEY = 'restaurant_cart';
const CART_EXPIRY_DAYS = 7; // Cart will persist for 7 days

// Create context
const CartContext = createContext();

// Custom hook for accessing the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Helper functions for cart persistence
  const loadCartFromStorage = () => {
    try {
      const storedData = localStorage.getItem(CART_STORAGE_KEY);
      if (!storedData) return [];

      const { cart, expires } = JSON.parse(storedData);
      
      // Check if cart has expired
      if (new Date(expires) < new Date()) {
        localStorage.removeItem(CART_STORAGE_KEY);
        return [];
      }
      
      return cart;
    } catch (error) {
      console.error("Error loading cart from storage:", error);
      return [];
    }
  };

  const saveCartToStorage = (cartItems) => {
    try {
      // Set expiration date (7 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + CART_EXPIRY_DAYS);
      
      const cartData = {
        cart: cartItems,
        expires: expiryDate.toISOString(),
        userId: null, // Will be set if user is logged in
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  };

  // Load cart on initial render
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    setCart(savedCart);
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveCartToStorage(cart);
    }
  }, [cart, isLoading]);

  // Add item to cart
  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, cartId: Date.now() }]);
  };

  // Remove item from cart
  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  // Update item quantity
  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prev => prev.map(item => 
      item.cartId === cartId 
        ? {
            ...item, 
            quantity: newQuantity, 
            totalPrice: (item.pricePerItem || item.basePrice) * newQuantity
          } 
        : item
    ));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get cart totals
  const getCartSummary = () => {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + item.totalPrice, 0);
    const tax = parseFloat((subtotal * 0.08).toFixed(2)); // 8% tax
    const deliveryFee = subtotal > 0 ? 3.99 : 0;
    const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));
    
    return {
      itemCount,
      subtotal,
      tax,
      deliveryFee,
      total
    };
  };

  // Set user information when logged in
  const setCartUser = (userId) => {
    try {
      const storedData = localStorage.getItem(CART_STORAGE_KEY);
      if (!storedData) return;

      const cartData = JSON.parse(storedData);
      cartData.userId = userId;
      
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error("Error setting cart user:", error);
    }
  };

  // Value to be provided by context
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSummary,
    setCartUser,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};