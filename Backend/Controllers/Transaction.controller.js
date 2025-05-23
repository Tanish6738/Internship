import TransactionModel from "../Models/Transaction.model.js";
import UserModel from "../Models/User.model.js";
import ProductModel from "../Models/Products.model.js";

export const createTransaction = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, shippingAddress } = req.body;
    const userId = req.user.id;     // Validate each item in the order
    for (const item of items) {
      try {
        const product = await ProductModel.findById(item.productId);
        if (!product) {
          return res.status(404).json({ 
            message: "Product not found", 
            productId: item.productId,
            details: "The product ID may be invalid or the product has been removed."
          });
        }
        
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
            product: product.name,
            requested: item.quantity,
            available: product.stock
          });
        }
      } catch (error) {
        console.error("Error validating product:", error);
        return res.status(400).json({
          message: "Invalid product ID format",
          productId: item.productId,
          error: error.message
        });
      }
    }
    
    const newTransaction = new TransactionModel({
      userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      status: "pending"
    });
    
    await newTransaction.save();
    
    for (const item of items) {
      await ProductModel.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { orderHistory: newTransaction._id } }
    );
    
    res.status(201).json({
      message: "Order placed successfully",
      transaction: newTransaction
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    
    const total = await TransactionModel.countDocuments(filter);
    
    const transactions = await TransactionModel.find(filter)
      .sort({ createdAt: -1 }) 
      .populate('userId', 'username email')
      .populate('items.productId', 'name price')
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('items.productId', 'name price images');
    
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    if (!req.user.isAdmin && req.user.id !== transaction.userId._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this transaction" });
    }
    
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaction", error: error.message });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["pending", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const transaction = await TransactionModel.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    if (status === "cancelled" && transaction.status !== "cancelled") {
      for (const item of transaction.items) {
        await ProductModel.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } }
        );
      }
    }
    
    transaction.status = status;
    await transaction.save();
    
    res.status(200).json({
      message: "Transaction status updated successfully",
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction status", error: error.message });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const transactions = await TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name price images');
    
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user transactions", error: error.message });
  }
};
