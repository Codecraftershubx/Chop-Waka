import React, { useState } from 'react';
import { ArrowLeftIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline';

// This component would typically receive category data as props
const CategoryDetails = ({ category = { name: "Pasta & Risotto", id: 3 }, onBackClick }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample food items - in a real app, you'd fetch these based on the category
  const foodItems = [
    {
      id: 1,
      name: 'Spaghetti Carbonara',
      description: 'Classic creamy pasta with pancetta, egg, and pecorino cheese',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1000',
      rating: 4.8,
      tags: ['popular', 'traditional']
    },
    {
      id: 2,
      name: 'Mushroom Risotto',
      description: 'Creamy arborio rice with wild mushrooms and truffle oil',
      price: 17.50,
      image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7f94?q=80&w=1000',
      rating: 4.6,
      tags: ['vegetarian']
    },
    {
      id: 3,
      name: 'Fettuccine Alfredo',
      description: 'Rich and creamy fettuccine pasta with parmesan sauce',
      price: 14.75,
      image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023402c?q=80&w=1000',
      rating: 4.5,
      tags: ['vegetarian']
    },
    {
      id: 4,
      name: 'Lasagna Bolognese',
      description: 'Layered pasta with rich meat sauce, béchamel, and cheese',
      price: 16.50,
      image: 'https://images.unsplash.com/photo-1619895092538-128341789da3?q=80&w=1000',
      rating: 4.9,
      tags: ['popular', 'traditional']
    },
    {
      id: 5,
      name: 'Seafood Risotto',
      description: 'Creamy risotto with shrimp, scallops, and fresh herbs',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c1?q=80&w=1000',
      rating: 4.7,
      tags: ['popular']
    },
    {
      id: 6,
      name: 'Penne Arrabbiata',
      description: 'Spicy tomato sauce with garlic and red chili flakes',
      price: 13.50,
      image: 'https://images.unsplash.com/photo-1579349443343-73da56a71a20?q=80&w=1000',
      rating: 4.3,
      tags: ['spicy', 'vegetarian']
    },
    {
      id: 7,
      name: 'Truffle Ravioli',
      description: 'Handmade ravioli stuffed with ricotta and truffle',
      price: 22.00,
      image: 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?q=80&w=1000',
      rating: 4.9,
      tags: ['premium', 'vegetarian']
    },
    {
      id: 8,
      name: 'Lemon Garlic Shrimp Pasta',
      description: 'Linguine with sautéed shrimp in a zesty lemon garlic sauce',
      price: 18.75,
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000',
      rating: 4.6,
      tags: ['popular']
    },
  ];

  const filters = [
    { id: 'all', name: 'All' },
    { id: 'popular', name: 'Popular' },
    { id: 'vegetarian', name: 'Vegetarian' },
    { id: 'traditional', name: 'Traditional' },
    { id: 'premium', name: 'Premium' },
  ];

  const filteredItems = activeFilter === 'all' 
    ? foodItems 
    : foodItems.filter(item => item.tags.includes(activeFilter));

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner for the Category */}
      <div className="relative h-64 md:h-80 lg:h-96 bg-cover bg-center" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=2000')` }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
          <button 
            onClick={onBackClick} 
            className="absolute top-6 left-6 text-white flex items-center space-x-2 hover:text-red-400 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to categories</span>
          </button>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white">{category.name}</h1>
          <p className="text-white/80 mt-2">Discover our delicious selection of {category.name.toLowerCase()}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 mt-8">
        {/* Filter Pills */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 overflow-x-auto">
          <div className="flex space-x-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeFilter === filter.id 
                    ? 'bg-red-400 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                />
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{item.rating}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <div className="text-red-500 font-semibold">${item.price.toFixed(2)}</div>
                </div>
                
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="mt-4 w-full bg-red-400 hover:bg-red-500 text-white rounded-lg py-2 flex items-center justify-center transition-colors">
                  <ShoppingBagIcon className="h-4 w-4 mr-2" />
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - Show when no items match the filter */}
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium text-gray-800">No items found</h3>
            <p className="text-gray-600 mt-2">Try selecting a different filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;