import { useState } from "react";
import Cards from "../components/Cards";
import ProductModal from "../components/ProductModal";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const ProductsData = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 2999,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
      description: "Bluetooth over-ear headphones with noise cancellation and 30-hour battery life."
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 4999,
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
      description: "Fitness tracking, heart rate monitor, and notifications on your wrist."
    },
    {
      id: 3,
      name: "DSLR Camera",
      price: 35999,
      image: "https://media.istockphoto.com/id/1494050217/photo/isolated-slr-camera-on-white-background-suitable-for-your-device-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=HsMzRnc1lAVFQf5cirKRuz7y2v_8gvHdiVSHHxt0cGs=",
      description: "24MP DSLR camera with 18-55mm lens kit, perfect for beginners and enthusiasts."
    },
    {
      id: 4,
      name: "Gaming Mouse",
      price: 1499,
      image : "https://images.unsplash.com/photo-1628832307345-7404b47f1751?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtaW5nJTIwbW91c2V8ZW58MHx8MHx8fDA%3D",
      description: "Ergonomic RGB gaming mouse with 7 programmable buttons and adjustable DPI."
    },
    {
      id: 5,
      name: "Laptop Backpack",
      price: 899,
      image: "https://images.unsplash.com/photo-1667411424771-cadd97150827?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwYmFja3BhY2t8ZW58MHx8MHx8fDA%3D",
      description: "Water-resistant backpack with padded laptop compartment and USB charging port."
    }
  ]
  return (
    <div className="min-h-0 w-full px-6 md:px-12 lg:px-20 mx-auto bg-gradient-to-br from-white via-orange-50 to-white pt-[4em] pb-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-orange-600 text-center relative inline-block mx-auto">
        <span className="relative z-10">Shop the Latest E-Commerce Products</span>
        <span className="absolute bottom-1 left-0 w-full h-2 bg-orange-200 -z-10 transform -rotate-1"></span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 px-4 max-w-7xl mx-auto">
        {ProductsData.map(product => (
          <Cards 
            key={product.id} 
            {...product} 
            onAddToCart={() => openModal(product)}
          />
        ))}
      </div>
      
      {isModalOpen && selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      )}
    </div>
  )
}

export default Home