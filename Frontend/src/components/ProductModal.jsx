import { useState, useEffect } from "react";
import ProductService from "../services/Product.service";
import { toast } from "react-hot-toast"; // Assuming you have a toast library

const ProductModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  console.log(product);
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  const handleAddToCart = () => {
    try {
      // Ensure the product has a consistent ID property before adding to cart
      const productWithCorrectId = {
        ...product,
        id: product._id || product.id // Prioritize _id (from MongoDB)
      };
      
      ProductService.addToCart(productWithCorrectId, quantity);
      toast.success(`Added ${quantity} ${product.name} to cart!`);
      onClose();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-2 sm:my-4 animate-fadeIn relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row max-h-[85vh] md:max-h-[90vh] overflow-hidden">
          {/* Product Image */}
          <div className="md:w-1/2 p-3 sm:p-6 flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
            <img
              src={product?.image }
              alt={product.name}
              className="object-contain h-48 sm:max-h-60 md:max-h-80 w-auto shadow-lg rounded-md"
            />
          </div>

          {/* Product Details - Scrollable container */}
          <div className="md:w-1/2 p-3 sm:p-6 flex flex-col overflow-y-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[90vh]">
            <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-orange-600">
              {product.name}
            </h2>
            <div className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-orange-500">
              ₹{product.price}
            </div>
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 mb-2 sm:mb-4 sticky top-0 bg-white pt-1 z-10">
              <button
                className={`px-2 py-1 sm:px-4 sm:py-2 mr-1 sm:mr-2 text-xs sm:text-sm font-medium rounded-t-md ${
                  activeTab === "details"
                    ? "text-orange-600 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`px-2 py-1 sm:px-4 sm:py-2 mr-1 sm:mr-2 text-xs sm:text-sm font-medium rounded-t-md ${
                  activeTab === "specs"
                    ? "text-orange-600 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                }`}
                onClick={() => setActiveTab("specs")}
              >
                Specs
              </button>
              <button
                className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-t-md ${
                  activeTab === "applications"
                    ? "text-orange-600 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                }`}
                onClick={() => setActiveTab("applications")}
              >
                Uses
              </button>
            </div>
            {/* Tab Content */}
            <div className="mb-4 sm:mb-6 flex-grow overflow-y-auto">
              {activeTab === "details" && (
                <div>
                  <p className="text-gray-700 mb-2 sm:mb-4 text-sm sm:text-base">
                    {product.description}
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base">
                    Experience premium quality with our {product.name}. Perfect
                    for both casual and professional use.
                  </p>
                </div>
              )}

              {activeTab === "specs" && (
                <div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                    Technical Specifications
                  </h3>
                  <ul className="list-disc pl-4 sm:pl-5 text-gray-700 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                    <li>Model: {product.name} Pro Series</li>
                    <li>Warranty: 1 Year Manufacturer's Warranty</li>
                    <li>Weight: 0.5 kg</li>
                    <li>
                      Package Contents: {product.name}, User Manual, Warranty
                      Card
                    </li>
                    <li>Country of Origin: India</li>
                  </ul>
                </div>
              )}

              {activeTab === "applications" && (
                <div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                    Ideal Applications
                  </h3>
                  <ul className="list-disc pl-4 sm:pl-5 text-gray-700 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                    <li>Personal use</li>
                    <li>Professional environments</li>
                    <li>Gifting</li>
                    <li>Travel and outdoor activities</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Quantity Selector - Sticky at bottom on mobile */}
            <div className="mt-auto pt-2 sm:pt-4 sticky bottom-0 bg-white border-t border-gray-100">
              <div className="flex flex-row items-center justify-between">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Quantity
                </label>

                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-orange-200 transition-colors"
                  >
                    <span className="text-sm sm:text-lg font-bold">-</span>
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="mx-2 w-10 sm:w-16 text-center border border-gray-300 rounded-md text-sm"
                  />

                  <button
                    onClick={increaseQuantity}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-orange-200 transition-colors"
                  >
                    <span className="text-sm sm:text-lg font-bold">+</span>
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-2 sm:py-3 rounded-md shadow-md hover:from-orange-700 hover:to-orange-600 transition-all duration-300 font-semibold text-sm sm:text-base"
              >
                Add to Cart - ₹{product.price * quantity}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
