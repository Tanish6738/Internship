import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtPurchase: {
    type: Number,
    required: true,
    min: 0
  }
});

const ShippingAddressSchema = new Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

const TransactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: {
    type: [ItemSchema],
    required: true,
    validate: [
      {
        validator: function(items) {
          return items.length > 0;
        },
        message: "At least one item is required for a transaction"
      }
    ]
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Credit Card", "PayPal", "COD", "UPI"]
  },
  shippingAddress: {
    type: ShippingAddressSchema,
    required: true
  }
}, {
  timestamps: true
});

const TransactionModel = model("Transaction", TransactionSchema);

export default TransactionModel;
