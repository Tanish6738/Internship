import express from 'express';
const app = express();
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './Routes/User.routes.js';
import productRoutes from './Routes/product.routes.js';
import transactionRoutes from './Routes/transaction.routes.js';

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', transactionRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;