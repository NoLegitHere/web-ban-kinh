import { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import productRoutes from './product.route';
import orderRoutes from './order.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

export default router;