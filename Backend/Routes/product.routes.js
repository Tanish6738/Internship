import { Router } from 'express';
import { 
  getAllProducts,
  getProductById, 
  addNewProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory
} from '../Controllers/Product.controller.js';
import { protect, admin } from '../middlewares/auth.js';

const router = Router();

// Public routes - accessible to all users
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Admin only routes - requires authentication and admin role
router.post('/', protect, admin, addNewProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
