import UserModel from '../Models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    
    await newUser.save();
    
    const userToReturn = { ...newUser.toObject() };
    delete userToReturn.password;
    
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userToReturn,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    const userToReturn = { ...user.toObject() };
    delete userToReturn.password;
    
    res.status(200).json({
      message: 'Login successful',
      user: userToReturn,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, password, currentPassword } = req.body;
    const userId = req.params.id;
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this user' });
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this user' });
    }
    
    await UserModel.findByIdAndDelete(userId);
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

export const getUserOrderHistory = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate('orderHistory');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.orderHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history', error: error.message });
  }
};
