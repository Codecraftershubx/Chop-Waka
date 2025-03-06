import React from 'react';

const FoodCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Appetizers',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1000',
      description: 'Start your meal right'
    },
    {
      id: 2,
      name: 'Main Courses',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000',
      description: 'Satisfying entrees'
    },
    {
      id: 3,
      name: 'Pasta & Risotto',
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1000',
      description: 'Italian classics'
    },
    {
      id: 4,
      name: 'Seafood',
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1000',
      description: 'Fresh from the ocean'
    },
    {
      id: 5,
      name: 'Salads',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=1000',
      description: 'Fresh and healthy'
    },
    {
      id: 6,
      name: 'Pizza',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000',
      description: 'Wood-fired specialties'
    },
    {
      id: 7,
      name: 'Desserts',
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000',
      description: 'Sweet endings'
    },
    {
      id: 8,
      name: 'Drinks',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000',
      description: 'Refreshing beverages'
    },
    {
      id: 9,
      name: 'Vegetarian',
      image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=1000',
      description: 'Plant-based favorites'
    },
    {
      id: 10,
      name: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=1000',
      description: 'Morning delights'
    },
    {
      id: 11,
      name: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000',
      description: 'Juicy classics'
    },
    {
      id: 12,
      name: 'Special Diet',
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?q=80&w=1000',
      description: 'Gluten-free & more'
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl  mt-16">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-4">Our Menu Categories</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Explore our diverse range of delicious offerings, crafted with care using the finest ingredients</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-medium text-xl">{category.name}</h3>
                <p className="text-gray-600 mt-2">{category.description}</p>
                <button className="mt-4 px-4 py-2 bg-red-400 text-white rounded-full text-sm uppercase tracking-wide hover:bg-red-500 transition-colors duration-300">
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodCategories;