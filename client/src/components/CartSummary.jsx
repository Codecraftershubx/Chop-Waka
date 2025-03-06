const CartSummary = ({ total }) => {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div className="flex justify-between my-2">
          <span>Subtotal</span>
          <span>${total}</span>
        </div>
        <div className="flex justify-between my-2">
          <span>Shipping</span>
          <span>$5.00</span>
        </div>
        <div className="flex justify-between my-2 font-bold">
          <span>Total</span>
          <span>${total + 5.00}</span>
        </div>
        <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Proceed to Checkout
        </button>
      </div>
    );
  };
  
  export default CartSummary;