import { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>

      <section className="hero relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-[-2] animate-slow-zoom"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')" }}
        ></div>
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/70 to-black/50 z-[-1]"></div>
        
        <div className="text-center max-w-4xl px-6 z-10 animate-fade-in-up">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-shadow">
            Delicious Cuisine, <span className="block text-red-400 italic">Unforgettable Experience</span>
          </h1>
          <p className="text-base md:text-lg font-light max-w-xl mx-auto mb-8">
            Discover a world of flavor with our carefully crafted dishes
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 max-w-xs sm:max-w-none mx-auto">
            <a href="/menu" className="bg-red-400 hover:bg-red-300 text-white px-8 py-3 rounded-full font-medium uppercase tracking-wide text-sm transition-colors duration-300">
              Order Now
            </a>
            <a href="/reservations" className="bg-transparent hover:bg-white hover:text-gray-900 text-white border-2 border-white px-8 py-3 rounded-full font-medium uppercase tracking-wide text-sm transition-all duration-300">
              Book Reservation
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-80 animate-bounce-slow">
          <span className="text-sm mb-2">Scroll Down</span>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </section>
    </>
  );
};

export default Hero;