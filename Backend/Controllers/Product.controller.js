import ProductModel from "../Models/Products.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPrice) filter.price = { ...filter.price, $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    
    const total = await ProductModel.countDocuments(filter);
    
    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

export const addNewProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, images } = req.body;
        const newProduct = new ProductModel({
            name,
            description,
            price,
            category,
            stock: stock || 0,
            images: images || []
        });
        await newProduct.save();
        res.status(201).json({ 
            message: "Product registered successfully",
            product: newProduct
        });        
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (category) updateData.category = category;
    if (stock !== undefined) updateData.stock = stock;
    if (images) updateData.images = images;
    
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    await ProductModel.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error searching products", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const products = await ProductModel.find({ category });
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by category", error: error.message });
  }
};