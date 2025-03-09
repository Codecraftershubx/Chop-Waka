import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import CartPage from './pages/Cart';
import CheckOutPage from './pages/CheckOut';
import ContactPage from './pages/Contact';
import EventBookingPage from './pages/Event';
import FoodMenuPage from './pages/Menu';
import ReservationPage from './pages/Reservation';


function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/menu' element={<FoodMenuPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/checkout' element={<CheckOutPage />} />
            <Route path='/event' element={<EventBookingPage />} />
            <Route path='/reservations' element={<ReservationPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;