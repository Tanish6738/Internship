import express from 'express';
import { 
  getAllUsers, 
  registerUser, 
  loginUser, 
  getUserById, 
  updateUser, 
  deleteUser,
  getUserOrderHistory
} from '../Controllers/User.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.get('/:id/orders', protect, getUserOrderHistory);

export default router;