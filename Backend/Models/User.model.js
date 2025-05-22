import { Schema } from "mongoose";

const UserSchema = new Schema({
    username : {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password : {
        type: String,
        required: true,
        trim: true,
    },
    email : {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    Orderhistory : {
        type: Array,
        default: [],
    }
});
