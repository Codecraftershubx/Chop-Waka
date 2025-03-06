import { TrashIcon } from '@heroicons/react/24/outline';

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-gray-600">Quantity: {item.quantity}</p>
        <p className="text-gray-800">${item.price}</p>
      </div>
      <button onClick={() => onRemove(item.id)} className="text-red-600">
        <TrashIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default CartItem;