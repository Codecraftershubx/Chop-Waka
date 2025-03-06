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
      {/* <header className="relative">
        <nav className={`fixed top-0 left-0 w-full flex justify-between items-center px-5 py-6 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-black/20'
        }`}>
          <div className="logo">
            <h2 className={`font-playfair font-bold text-2xl md:text-3xl ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}>
              Savoria
            </h2>
          </div>
          
          <div 
            className="lg:hidden cursor-pointer z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}>
              <span className={`block w-6 h-0.5 my-1.5 transition-all duration-300 ${
                isScrolled ? 'bg-gray-800' : 'bg-white'
              } ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 my-1.5 transition-all duration-300 ${
                isScrolled ? 'bg-gray-800' : 'bg-white'
              } ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 my-1.5 transition-all duration-300 ${
                isScrolled ? 'bg-gray-800' : 'bg-white'
              } ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </div>

          <ul className={`fixed top-0 right-0 h-full w-[70%] lg:w-auto lg:h-auto lg:static flex flex-col lg:flex-row justify-center lg:justify-end items-center bg-white/95 lg:bg-transparent transition-all duration-500 ease-in-out z-40 ${
            isMenuOpen ? 'right-0' : '-right-full'
          } lg:right-0`}>
            <li className="my-6 lg:my-0 lg:ml-8">
              <a 
                href="#" 
                className={`font-medium text-lg lg:text-base relative pb-2 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-red-400 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full ${
                  isScrolled || isMenuOpen ? 'text-gray-800' : 'text-white'
                } lg:after:bg-red-400`}
              >
                Home
              </a>
            </li>
            <li className="my-6 lg:my-0 lg:ml-8">
              <a 
                href="#" 
                className={`font-medium text-lg lg:text-base relative pb-2 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-red-400 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full ${
                  isScrolled || isMenuOpen ? 'text-gray-800' : 'text-white'
                } lg:after:bg-red-400`}
              >
                Menu
              </a>
            </li>
            <li className="my-6 lg:my-0 lg:ml-8">
              <a 
                href="#" 
                className={`font-medium text-lg lg:text-base relative pb-2 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-red-400 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full ${
                  isScrolled || isMenuOpen ? 'text-gray-800' : 'text-white'
                } lg:after:bg-red-400`}
              >
                Reservations
              </a>
            </li>
            <li className="my-6 lg:my-0 lg:ml-8">
              <a 
                href="#" 
                className={`font-medium text-lg lg:text-base relative pb-2 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-red-400 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full ${
                  isScrolled || isMenuOpen ? 'text-gray-800' : 'text-white'
                } lg:after:bg-red-400`}
              >
                About
              </a>
            </li>
            <li className="my-6 lg:my-0 lg:ml-8">
              <a 
                href="#" 
                className={`font-medium text-lg lg:text-base relative pb-2 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-red-400 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full ${
                  isScrolled || isMenuOpen ? 'text-gray-800' : 'text-white'
                } lg:after:bg-red-400`}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header> */}

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
            <a href="#" className="bg-red-400 hover:bg-red-300 text-white px-8 py-3 rounded-full font-medium uppercase tracking-wide text-sm transition-colors duration-300">
              Order Now
            </a>
            <a href="#" className="bg-transparent hover:bg-white hover:text-gray-900 text-white border-2 border-white px-8 py-3 rounded-full font-medium uppercase tracking-wide text-sm transition-all duration-300">
              View Menu
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