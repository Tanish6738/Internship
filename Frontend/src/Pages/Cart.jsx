import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductService from "../services/Product.service";
import { toast } from "react-hot-toast"; // Assuming you have a toast library

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCartItems();

    // Listen for cart updates from other components
    window.addEventListener("cart-updated", loadCartItems);

    return () => {
      window.removeEventListener("cart-updated", loadCartItems);
    };
  }, []);

  const loadCartItems = () => {
    try {
      const items = ProductService.getCartItems();
      setCartItems(items);
      calculateTotal(items);
    } catch (error) {
      console.error("Error loading cart items:", error);
      toast.error("Failed to load cart items");
    }
  };

  const calculateTotal = (items) => {
    try {
      const sum = ProductService.calculateCartTotal(items);
      setTotal(sum);
    } catch (error) {
      console.error("Error calculating total:", error);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const updatedItems = ProductService.updateCartItemQuantity(id, newQuantity);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = (id) => {
    try {
      const updatedItems = ProductService.removeFromCart(id);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = () => {
    try {
      ProductService.clearCart();
      setCartItems([]);
      setTotal(0);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  // Helper to format as Rupees
  const formatRupees = (amount) => `₹${amount.toFixed(2)}`;

  return (
    <div className="container min-h-0 w-full px-4 sm:px-6 md:px-12 lg:px-20 mx-auto bg-gradient-to-br from-white via-orange-50 to-white pt-[4.5em] sm:pt-[5em] pb-10 sm:pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-6">Your cart is empty</p>
          <Link
            to="/"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2">
            {/* Cart Items - Table view for tablet/desktop, card view for mobile */}
            <div className="bg-white rounded-lg shadow-md">
              {/* Desktop & Tablet view - Table format */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-4 px-4 sm:px-6">Product</th>
                      <th className="text-center py-4 px-2 sm:px-6">Quantity</th>
                      <th className="text-right py-4 px-2 sm:px-6">Price</th>
                      <th className="text-right py-4 px-2 sm:px-6">Total</th>
                      <th className="text-right py-4 px-2 sm:px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded mr-3 sm:mr-4"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/100x100?text=No+Image";
                                e.target.onerror = null;
                              }}
                            />
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 sm:px-6">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="bg-gray-200 px-2 sm:px-3 py-1 rounded-l-md hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="px-2 sm:px-4 py-1 bg-gray-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="bg-gray-200 px-2 sm:px-3 py-1 rounded-r-md hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-2 sm:px-6 text-right">
                          {formatRupees(item.price)}
                        </td>
                        <td className="py-4 px-2 sm:px-6 text-right">
                          {formatRupees(item.price * item.quantity)}
                        </td>
                        <td className="py-4 px-2 sm:px-6 text-right">
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
              
              {/* Mobile view - Card format */}
              <div className="sm:hidden">
                {cartItems.map((item) => (
                  <div key={item.id} className="border-b p-4">
                    <div className="flex items-start mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded mr-3"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100x100?text=No+Image";
                          e.target.onerror = null;
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-base mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-1">Price: {formatRupees(item.price)}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-200 h-8 w-8 flex items-center justify-center rounded-l-md hover:bg-gray-300"
                        >
                          <span className="text-lg">-</span>
                        </button>
                        <span className="px-3 py-1 bg-gray-100 h-8 flex items-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-200 h-8 w-8 flex items-center justify-center rounded-r-md hover:bg-gray-300"
                        >
                          <span className="text-lg">+</span>
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="font-semibold text-base">
                          {formatRupees(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearCart}
                className="px-4 py-2 text-sm sm:text-base text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Order Summary</h2>

              <div className="flex justify-between py-2 border-b">
                <span className="text-sm sm:text-base">Subtotal</span>
                <span className="text-sm sm:text-base">{formatRupees(total)}</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-sm sm:text-base">Shipping</span>
                <span className="text-sm sm:text-base">Free</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-sm sm:text-base">Tax</span>
                <span className="text-sm sm:text-base">{formatRupees(total * 0.1)}</span>
              </div>

              <div className="flex justify-between py-3 sm:py-4 font-bold">
                <span className="text-base sm:text-lg">Total</span>
                <span className="text-base sm:text-lg">{formatRupees(total + total * 0.1)}</span>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-md font-medium hover:bg-blue-700 transition-all mt-3 sm:mt-4 text-sm sm:text-base">
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center mt-3 sm:mt-4 text-blue-600 hover:underline text-sm sm:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
