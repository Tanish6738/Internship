// seed.js - Populate the database with sample data for testing

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../Config/db.js';
import ProductModel from '../Models/Products.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });
console.log(`Loading environment variables from: ${envPath}`);

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Bluetooth over-ear headphones with noise cancellation and 30-hour battery life.',
    price: 2999,
    category: 'electronics',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D'
    ]
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking, heart rate monitor, and notifications on your wrist.',
    price: 4999,
    category: 'electronics',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D'
    ]
  },
  {
    name: 'DSLR Camera',
    description: '24MP DSLR camera with 18-55mm lens kit, perfect for beginners and enthusiasts.',
    price: 35999,
    category: 'electronics',
    stock: 15,
    images: [
      'https://media.istockphoto.com/id/1494050217/photo/isolated-slr-camera-on-white-background-suitable-for-your-device-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=HsMzRnc1lAVFQf5cirKRuz7y2v_8gvHdiVSHHxt0cGs='
    ]
  },
  {
    name: 'Gaming Mouse',
    description: 'Ergonomic RGB gaming mouse with 7 programmable buttons and adjustable DPI.',
    price: 1499,
    category: 'electronics',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1628832307345-7404b47f1751?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtaW5nJTIwbW91c2V8ZW58MHx8MHx8fDA%3D'
    ]
  },
  {
    name: 'Laptop Backpack',
    description: 'Water-resistant backpack with padded laptop compartment and USB charging port.',
    price: 899,
    category: 'accessories',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1667411424771-cadd97150827?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwYmFja3BhY2t8ZW58MHx8MHx8fDA%3D'
    ]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Error: MONGO_URI is not defined in environment variables');
      console.log('Please make sure your .env file contains MONGO_URI=your_mongodb_connection_string');
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    await ProductModel.deleteMany({});
    
    console.log('Products collection cleared');
    
    const createdProducts = [];
    for (const product of products) {
      const newProduct = await ProductModel.create(product);
      createdProducts.push(newProduct);
      console.log(`Created product: ${newProduct.name}`);
    }
      console.log('Products seeded successfully');
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
