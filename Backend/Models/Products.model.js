import { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    },
    description: {
    type: String,
    required: true,
    trim: true,
    },
    price: {
    type: Number,
    required: true,
    },
    image: {
    type: String,
    required: true,
    }
    },
    {
    timestamps: true,
    }
);

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
