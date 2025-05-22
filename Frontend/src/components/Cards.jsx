const Cards = ({ name, price, image, description, onAddToCart }) => {
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
        </div>{" "}
        <button
          className="mt-auto bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-semibold text-base tracking-wide relative overflow-hidden active:scale-95 btn-pulse"
          onClick={onAddToCart}
        >
          <span className="relative z-10">Add to Cart</span>
          <span className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
          <span className="absolute -right-2 -top-2 bg-white rounded-full w-1 h-1 opacity-0 group-hover:opacity-75 group-hover:w-12 group-hover:h-12 transition-all duration-500 ease-out"></span>
        </button>
      </div>
    </div>
  );
};

export default Cards;
