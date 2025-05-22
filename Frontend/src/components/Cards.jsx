import ProductService from '../services/Product.service';
import { toast } from 'react-hot-toast'; // Assuming you have a toast library

const Cards = ({ id, name, price, image, description, onAddToCart }) => {
  const handleQuickAdd = (e) => {
    e.stopPropagation(); // Prevent opening the modal
    try {
      ProductService.addToCart({ id, name, price, image, description }, 1);
      toast.success(`Added ${name} to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-[#fff7ed] rounded-md shadow-lg p-0 flex flex-col items-stretch hover:scale-105 hover:shadow-xl transition-all duration-300 border border-orange-100 overflow-hidden group relative">
      {/* Orange hover effect border */}
      <span className="absolute inset-0 border-2 border-orange-300 opacity-0 rounded-md group-hover:opacity-100 scale-105 group-hover:scale-100 transition-all duration-300"></span>

      <div className="w-full h-40 md:h-48 lg:h-52 overflow-hidden bg-white flex items-center justify-center relative">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-orange-500 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        {/* Circular decoration element */}
        <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-orange-100 rounded-full opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
      </div>
      <div className="flex flex-col flex-1 p-5 items-stretch">
        <h3 className="text-xl font-bold mb-1 text-orange-600 tracking-wide text-left drop-shadow-sm group-hover:text-orange-700 transition-colors duration-300">
          {name}
        </h3>
        <p className="text-sm text-orange-800 mb-2 text-left">{description}</p>
        <div className="text-lg font-semibold text-orange-600 mb-3">
          ₹{price}
        </div>
        <div className="mt-auto flex space-x-2">
          <button
            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-3 py-2 rounded-full shadow-md hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-semibold text-sm tracking-wide relative overflow-hidden active:scale-95 btn-pulse"
            onClick={onAddToCart}
          >
            <span className="relative z-10">View Details</span>
          </button>
          <button
            className="bg-orange-100 text-orange-600 px-3 py-2 rounded-full shadow-md hover:bg-orange-200 transition-all duration-300 font-semibold text-sm tracking-wide relative overflow-hidden active:scale-95"
            onClick={handleQuickAdd}
          >
            <span className="relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
