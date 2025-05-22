import { useState, useEffect } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const mockCartItems = [
      {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        quantity: 1,
        image: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        name: "Smartphone Case",
        price: 24.99,
        quantity: 2,
        image: "https://via.placeholder.com/150",
      },
      {
        id: 3,
        name: "USB-C Cable",
        price: 14.99,
        quantity: 3,
        image: "https://via.placeholder.com/150",
      },
    ];

    localStorage.setItem("cartItems", JSON.stringify(mockCartItems));
    setCartItems(mockCartItems);
    calculateTotal(mockCartItems);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  // Helper to format as Rupees
  const formatRupees = (amount) => `₹${amount.toFixed(2)}`;

  return (
    <div className="container min-h-0 w-full px-6 md:px-12 lg:px-20 mx-auto bg-gradient-to-br from-white via-orange-50 to-white pt-[5em] pb-20">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <a
            href="/"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {" "}
          <div className="lg:col-span-2">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6">Product</th>
                    <th className="text-center py-4 px-6">Quantity</th>
                    <th className="text-right py-4 px-6">Price</th>
                    <th className="text-right py-4 px-6">Total</th>
                    <th className="text-right py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="bg-gray-200 px-3 py-1 rounded-l-md hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-gray-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="bg-gray-200 px-3 py-1 rounded-r-md hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {formatRupees(item.price)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {formatRupees(item.price * item.quantity)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="flex justify-between py-2 border-b">
                <span>Subtotal</span>
                <span>{formatRupees(total)}</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span>Tax</span>
                <span>{formatRupees(total * 0.1)}</span>
              </div>

              <div className="flex justify-between py-4 font-bold">
                <span>Total</span>
                <span>{formatRupees(total + total * 0.1)}</span>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-all mt-4">
                Proceed to Checkout
              </button>

              <a
                href="/"
                className="block text-center mt-4 text-blue-600 hover:underline"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
