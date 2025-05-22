import ProductModel from "../Models/Products.model";

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const addNewProduct = async (req, res) => {
    try {
        const { name, description, price, image } = req.body;
        const newProduct = new ProductModel({
            name,
            description,
            price,
            image
        });
        await newProduct.save();
        res.status(201).json({ message: "Product registered successfully" });        
    } catch (error) {
        console.log(err);
    }
}

export const getProductById = async (req, res) => {
    
}