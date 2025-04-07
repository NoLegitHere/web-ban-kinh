import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const router = Router();
const orderController = new OrderController();

router.get('/', (req, res, next) => {
    orderController.getAllOrders(req, res).catch(next);
});
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrderStatus);
router.get('/user/:userId', orderController.getUserOrders);

export default router;