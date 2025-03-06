import { useState } from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const cartItems = [
  {
    id: 1,
    name: 'Product 1',
    image: 'https://via.placeholder.com/150',
    price: 29.99,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Product 2',
    image: 'https://via.placeholder.com/150',
    price: 49.99,
    quantity: 2,
  },
];

const Cart = () => {
  const [items, setItems] = useState(cartItems);

  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1">
          {items.map(item => (
            <CartItem key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
        <div className="lg:w-1/3 lg:ml-4 mt-4 lg:mt-0">
          <CartSummary total={total} />
        </div>
      </div>
    </div>
  );
};

export default Cart;