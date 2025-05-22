import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    orderHistory: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Transaction"
        }],
        default: [],
    }
},
{
    timestamps: true,
});

const UserModel = model("User", UserSchema);

export default UserModel;
