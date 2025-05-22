import { Router } from 'express';
import { 
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransactionStatus,
  getUserTransactions
} from '../Controllers/Transaction.controller.js';
import { protect, admin } from '../middlewares/auth.js';

const router = Router();

router.post('/', protect, createTransaction);
router.get('/my-orders', protect, getUserTransactions);
router.get('/:id', protect, getTransactionById);

router.get('/', protect, admin, getAllTransactions);
router.put('/:id/status', protect, admin, updateTransactionStatus);

export default router;
