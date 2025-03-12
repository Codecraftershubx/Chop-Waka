import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from '../models/MenuItem.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to database
connectDB();

// Create menu items
const createMenuItems = async () => {
  try {
    // Clear existing menu items
    await MenuItem.deleteMany({});

    const getRandomRating = () => {
      return (Math.floor(Math.random() * 10) + 41) / 10; // Random between 4.1 and 5.0
    };

    const menuItems = await MenuItem.insertMany([
      // NIGERIAN CUISINE (Categorized as Mediterranean for schema compatibility)
      {
        name: 'Jollof Rice',
        description: 'Fragrant West African rice dish cooked with tomatoes, peppers, spices, and meat. A Nigerian classic that\'s perfect for any occasion.',
        basePrice: 15.99,
        image: 'https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=1000',
        cuisine: 'Mediterranean',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small', priceAdjustment: -3.00 },
            { id: 'medium', name: 'Medium', priceAdjustment: 0 },
            { id: 'large', name: 'Family Size', priceAdjustment: 5.00 }
          ],
          toppings: [
            { id: 1, name: 'Grilled Chicken', price: 3.50 },
            { id: 2, name: 'Beef', price: 4.00 },
            { id: 3, name: 'Fried Plantains', price: 2.50 },
            { id: 4, name: 'Extra Spicy', price: 0.50 }
          ]
        }
      },
      {
        name: 'Egusi Soup with Pounded Yam',
        description: 'Traditional Nigerian soup made with ground melon seeds, vegetables, and choice of meat, served with smooth pounded yam.',
        basePrice: 17.99,
        image: 'https://images.unsplash.com/photo-1608830597604-619220679440?q=80&w=1000',
        cuisine: 'Mediterranean',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small', priceAdjustment: -3.00 },
            { id: 'medium', name: 'Medium', priceAdjustment: 0 },
            { id: 'large', name: 'Large', priceAdjustment: 4.00 }
          ],
          toppings: [
            { id: 1, name: 'Assorted Meat', price: 4.00 },
            { id: 2, name: 'Goat Meat', price: 4.50 },
            { id: 3, name: 'Fish', price: 3.50 },
            { id: 4, name: 'Extra Pounded Yam', price: 2.50 }
          ]
        }
      },
      {
        name: 'Suya',
        description: 'Spicy grilled beef skewers marinated in ground peanuts and spices. A popular Nigerian street food.',
        basePrice: 12.99,
        image: 'https://images.unsplash.com/photo-1611778591787-6de8d06ecb1d?q=80&w=1000',
        cuisine: 'Mediterranean',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: '2 Skewers', priceAdjustment: -3.00 },
            { id: 'medium', name: '4 Skewers', priceAdjustment: 0 },
            { id: 'large', name: '6 Skewers', priceAdjustment: 3.00 }
          ],
          toppings: [
            { id: 1, name: 'Extra Spicy', price: 0.50 },
            { id: 2, name: 'Grilled Onions', price: 1.00 },
            { id: 3, name: 'Fresh Tomatoes', price: 1.00 }
          ]
        }
      },
      {
        name: 'Akara and Pap',
        description: 'Nigerian bean cakes made from black-eyed peas served with creamy pap (corn porridge). A traditional breakfast combination.',
        basePrice: 10.99,
        image: 'https://images.unsplash.com/photo-1541518763669-27fef9b49542?q=80&w=1000',
        cuisine: 'Mediterranean',
        availability: 'Limited Quantity',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small (4 pieces)', priceAdjustment: -2.00 },
            { id: 'medium', name: 'Medium (6 pieces)', priceAdjustment: 0 },
            { id: 'large', name: 'Large (8 pieces)', priceAdjustment: 2.00 }
          ],
          toppings: [
            { id: 1, name: 'Extra Pap', price: 2.00 },
            { id: 2, name: 'Honey', price: 1.00 }
          ]
        }
      },

      // JAPANESE CUISINE
      {
        name: 'Sushi Platter',
        description: 'Assorted fresh nigiri and maki rolls featuring premium fish, perfectly seasoned rice, and traditional accompaniments.',
        basePrice: 22.99,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000',
        cuisine: 'Japanese',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: '8 pieces', priceAdjustment: -5.00 },
            { id: 'medium', name: '12 pieces', priceAdjustment: 0 },
            { id: 'large', name: '18 pieces', priceAdjustment: 7.00 }
          ],
          toppings: [
            { id: 1, name: 'Extra Wasabi', price: 0.50 },
            { id: 2, name: 'Extra Ginger', price: 0.50 },
            { id: 3, name: 'Spicy Mayo', price: 1.00 },
            { id: 4, name: 'Eel Sauce', price: 1.00 }
          ]
        }
      },
      {
        name: 'Tonkotsu Ramen',
        description: 'Rich pork bone broth with chewy noodles, chashu pork, soft-boiled egg, green onions, and nori. A comfort food classic.',
        basePrice: 16.99,
        image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=1000',
        cuisine: 'Japanese',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small', priceAdjustment: -3.00 },
            { id: 'medium', name: 'Regular', priceAdjustment: 0 },
            { id: 'large', name: 'Large', priceAdjustment: 3.50 }
          ],
          toppings: [
            { id: 1, name: 'Extra Chashu', price: 3.00 },
            { id: 2, name: 'Extra Egg', price: 1.50 },
            { id: 3, name: 'Corn', price: 1.00 },
            { id: 4, name: 'Bamboo Shoots', price: 1.00 },
            { id: 5, name: 'Spicy Paste', price: 0.75 }
          ]
        }
      },
      {
        name: 'Chicken Katsu Curry',
        description: 'Crispy panko-breaded chicken cutlet served with Japanese curry sauce and steamed rice. A perfect harmony of flavors and textures.',
        basePrice: 15.99,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=1000',
        cuisine: 'Japanese',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small', priceAdjustment: -2.00 },
            { id: 'medium', name: 'Regular', priceAdjustment: 0 },
            { id: 'large', name: 'Large', priceAdjustment: 3.00 }
          ],
          toppings: [
            { id: 1, name: 'Extra Curry Sauce', price: 1.50 },
            { id: 2, name: 'Vegetables', price: 2.00 },
            { id: 3, name: 'Upgrade to Tonkatsu (Pork)', price: 2.50 }
          ]
        }
      },
      {
        name: 'Tempura Udon',
        description: 'Thick, chewy udon noodles in a savory dashi broth, topped with crispy tempura shrimp and vegetables.',
        basePrice: 14.99,
        image: 'https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?q=80&w=1000',
        cuisine: 'Japanese',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small', priceAdjustment: -2.50 },
            { id: 'medium', name: 'Regular', priceAdjustment: 0 },
            { id: 'large', name: 'Large', priceAdjustment: 2.50 }
          ],
          toppings: [
            { id: 1, name: 'Extra Tempura Shrimp (2 pcs)', price: 3.00 },
            { id: 2, name: 'Extra Vegetable Tempura', price: 2.00 },
            { id: 3, name: 'Kamaboko (Fish Cake)', price: 1.50 }
          ]
        }
      },

      // ITALIAN CUISINE
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, fresh mozzarella, basil leaves, and a drizzle of olive oil on a thin, crispy crust.',
        basePrice: 14.99,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000',
        cuisine: 'Italian',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: '10" Small', priceAdjustment: -3.00 },
            { id: 'medium', name: '12" Medium', priceAdjustment: 0 },
            { id: 'large', name: '16" Large', priceAdjustment: 4.00 }
          ],
          toppings: [
            { id: 1, name: 'Extra Cheese', price: 2.00 },
            { id: 2, name: 'Pepperoni', price: 2.50 },
            { id: 3, name: 'Mushrooms', price: 1.50 },
            { id: 4, name: 'Bell Peppers', price: 1.00 },
            { id: 5, name: 'Olives', price: 1.00 }
          ]
        }
      },
      {
        name: 'Fettuccine Alfredo',
        description: 'Ribbon pasta tossed in a rich, creamy parmesan sauce. A comforting Italian-American classic.',
        basePrice: 15.99,
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=1000',
        cuisine: 'Italian',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Appetizer Portion', priceAdjustment: -3.00 },
            { id: 'medium', name: 'Regular', priceAdjustment: 0 },
            { id: 'large', name: 'Family Size', priceAdjustment: 5.00 }
          ],
          toppings: [
            { id: 1, name: 'Grilled Chicken', price: 3.00 },
            { id: 2, name: 'Shrimp', price: 4.50 },
            { id: 3, name: 'Broccoli', price: 1.50 },
            { id: 4, name: 'Mushrooms', price: 1.50 }
          ]
        }
      },

      // INDIAN CUISINE
      {
        name: 'Butter Chicken',
        description: 'Tender chicken in a rich, creamy tomato sauce with aromatic Indian spices. Served with basmati rice.',
        basePrice: 16.99,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000',
        cuisine: 'Indian',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small', priceAdjustment: -2.50 },
            { id: 'medium', name: 'Regular', priceAdjustment: 0 },
            { id: 'large', name: 'Large', priceAdjustment: 3.00 }
          ],
          toppings: [
            { id: 1, name: 'Naan Bread', price: 2.00 },
            { id: 2, name: 'Garlic Naan', price: 2.50 },
            { id: 3, name: 'Extra Chicken', price: 3.50 },
            { id: 4, name: 'Raita', price: 1.50 }
          ]
        }
      },
      {
        name: 'Vegetable Biryani',
        description: 'Fragrant basmati rice cooked with mixed vegetables, saffron, and aromatic Indian spices. A festive dish full of flavor.',
        basePrice: 14.99,
        image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=1000',
        cuisine: 'Indian',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small', priceAdjustment: -2.00 },
            { id: 'medium', name: 'Regular', priceAdjustment: 0 },
            { id: 'large', name: 'Large', priceAdjustment: 3.00 }
          ],
          toppings: [
            { id: 1, name: 'Paneer', price: 2.50 },
            { id: 2, name: 'Chicken', price: 3.00 },
            { id: 3, name: 'Raita', price: 1.50 },
            { id: 4, name: 'Papadum', price: 1.00 }
          ]
        }
      },

      // CHINESE CUISINE
      {
        name: 'Kung Pao Chicken',
        description: 'Stir-fried chicken with peanuts, vegetables, and chili peppers in a savory sauce. A perfect balance of spicy and savory flavors.',
        basePrice: 15.99,
        image: 'https://images.unsplash.com/photo-1619221741571-c9c77798460d?q=80&w=1000',
        cuisine: 'Chinese',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small', priceAdjustment: -2.00 },
            { id: 'medium', name: 'Regular', priceAdjustment: 0 },
            { id: 'large', name: 'Large', priceAdjustment: 3.00 }
          ],
          toppings: [
            { id: 1, name: 'Steamed Rice', price: 1.50 },
            { id: 2, name: 'Fried Rice', price: 2.50 },
            { id: 3, name: 'Extra Spicy', price: 0.50 }
          ]
        }
      },
      {
        name: 'Dim Sum Platter',
        description: 'Assorted steamed and fried dumplings including har gow, siu mai, and spring rolls. Perfect for sharing.',
        basePrice: 18.99,
        image: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?q=80&w=1000',
        cuisine: 'Chinese',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small (8 pieces)', priceAdjustment: -4.00 },
            { id: 'medium', name: 'Regular (12 pieces)', priceAdjustment: 0 },
            { id: 'large', name: 'Large (16 pieces)', priceAdjustment: 5.00 }
          ],
          toppings: [
            { id: 1, name: 'Extra Dipping Sauce', price: 1.00 },
            { id: 2, name: 'Chili Oil', price: 1.00 }
          ]
        }
      },

      // MEXICAN CUISINE
      {
        name: 'Taco Platter',
        description: 'Three soft corn tortillas filled with your choice of protein, topped with onions, cilantro, and lime. Authentic Mexican street tacos.',
        basePrice: 13.99,
        image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=1000',
        cuisine: 'Mexican',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: '2 Tacos', priceAdjustment: -3.00 },
            { id: 'medium', name: '3 Tacos', priceAdjustment: 0 },
            { id: 'large', name: '5 Tacos', priceAdjustment: 5.00 }
          ],
          toppings: [
            { id: 1, name: 'Guacamole', price: 1.50 },
            { id: 2, name: 'Queso', price: 1.50 },
            { id: 3, name: 'Pico de Gallo', price: 1.00 },
            { id: 4, name: 'Sour Cream', price: 0.75 }
          ]
        }
      },
      {
        name: 'Chicken Enchiladas',
        description: 'Corn tortillas filled with seasoned shredded chicken, smothered in enchilada sauce and melted cheese. Served with rice and beans.',
        basePrice: 14.99,
        image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=1000',
        cuisine: 'Mexican',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: '2 Enchiladas', priceAdjustment: -2.00 },
            { id: 'medium', name: '3 Enchiladas', priceAdjustment: 0 },
            { id: 'large', name: '4 Enchiladas', priceAdjustment: 3.00 }
          ],
          toppings: [
            { id: 1, name: 'Guacamole', price: 1.50 },
            { id: 2, name: 'Sour Cream', price: 0.75 },
            { id: 3, name: 'Jalapeños', price: 0.75 }
          ]
        }
      },

      // THAI CUISINE
      {
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles with egg, tofu, bean sprouts, peanuts and lime in a sweet and savory sauce. Thailand\'s national dish.',
        basePrice: 14.99,
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1000',
        cuisine: 'Thai',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small', priceAdjustment: -2.00 },
            { id: 'medium', name: 'Regular', priceAdjustment: 0 },
            { id: 'large', name: 'Large', priceAdjustment: 3.00 }
          ],
          toppings: [
            { id: 1, name: 'Chicken', price: 2.50 },
            { id: 2, name: 'Shrimp', price: 3.50 },
            { id: 3, name: 'Extra Peanuts', price: 0.75 },
            { id: 4, name: 'Extra Lime', price: 0.50 }
          ]
        }
      },
      {
        name: 'Green Curry',
        description: 'Aromatic Thai green curry with coconut milk, bamboo shoots, eggplant, and bell peppers. Served with jasmine rice.',
        basePrice: 15.99,
        image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a7d?q=80&w=1000',
        cuisine: 'Thai',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Small', priceAdjustment: -2.00 },
            { id: 'medium', name: 'Regular', priceAdjustment: 0 },
            { id: 'large', name: 'Large', priceAdjustment: 3.00 }
          ],
          toppings: [
            { id: 1, name: 'Chicken', price: 2.50 },
            { id: 2, name: 'Beef', price: 3.00 },
            { id: 3, name: 'Tofu', price: 2.00 },
            { id: 4, name: 'Shrimp', price: 3.50 },
            { id: 5, name: 'Extra Spicy', price: 0.50 }
          ]
        }
      },

      // AMERICAN CUISINE
      {
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with melted cheddar cheese, lettuce, tomato, onion, and special sauce on a toasted brioche bun.',
        basePrice: 13.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000',
        cuisine: 'American',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Single Patty', priceAdjustment: 0 },
            { id: 'medium', name: 'Double Patty', priceAdjustment: 3.00 },
            { id: 'large', name: 'Triple Patty', priceAdjustment: 6.00 }
          ],
          toppings: [
            { id: 1, name: 'Bacon', price: 2.00 },
            { id: 2, name: 'Avocado', price: 1.75 },
            { id: 3, name: 'Fried Egg', price: 1.50 },
            { id: 4, name: 'Extra Cheese', price: 1.00 },
            { id: 5, name: 'Caramelized Onions', price: 1.00 },
            { id: 6, name: 'Jalapeños', price: 0.75 },
            { id: 7, name: 'BBQ Sauce', price: 0.50 }
          ]
        }
      },
      {
        name: 'Southern Fried Chicken',
        description: 'Crispy fried chicken with our secret blend of herbs and spices. Served with mashed potatoes, gravy, and coleslaw.',
        basePrice: 16.99,
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000',
        cuisine: 'American',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: '2 Piece Meal', priceAdjustment: -3.00 },
            { id: 'medium', name: '3 Piece Meal', priceAdjustment: 0 },
            { id: 'large', name: '5 Piece Meal', priceAdjustment: 5.00 }
          ],
          toppings: [
            { id: 1, name: 'Extra Gravy', price: 1.00 },
            { id: 2, name: 'Mac and Cheese Side', price: 3.00 },
            { id: 3, name: 'Cornbread', price: 2.00 },
            { id: 4, name: 'Hot Honey Drizzle', price: 0.75 }
          ]
        }
      },

      // DESSERTS
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream, dusted with cocoa powder.',
        basePrice: 8.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1000',
        cuisine: 'Italian',
        availability: 'Available Now',
        rating: getRandomRating(),
        reviews: { count: 0, list: [] },
        isCustomizable: true,
        customizationOptions: {
          sizes: [
            { id: 'small', name: 'Individual', priceAdjustment: 0 },
            { id: 'medium', name: 'Sharing (2-3 people)', priceAdjustment: 4.00 }
          ],
          toppings: [
            { id: 1, name: 'Chocolate Shavings', price: 1.00 },
            { id: 2, name: 'Fresh Berries', price: 1.50 }
          ]
        }
      }
    ]);

    console.log(`${menuItems.length} menu items seeded successfully!`);
    return menuItems;
  } catch (error) {
    console.error(`Error seeding menu items: ${error.message}`);
    process.exit(1);
  }
};

export default createMenuItems;

// If run directly
if (require.main === module) {
  createMenuItems().then(() => {
    console.log('Menu item seeder finished');
    mongoose.connection.close();
  });
}