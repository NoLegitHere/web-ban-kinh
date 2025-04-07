import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Order } from '../models/order.entity';

export class OrderController {
    private orderRepository = AppDataSource.getRepository(Order);

    async getAllOrders(req: Request, res: Response): Promise<void> {
        const orders = await this.orderRepository.find({
            relations: ['user', 'product']
        });
        res.json(orders);
    }

    async getOrderById(req: Request, res: Response): Promise<void> {
        const order = await this.orderRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['user', 'product']
        });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.json(order);
    }

    async createOrder(req: Request, res: Response): Promise<void> {
        const order = this.orderRepository.create(req.body);
        const result = await this.orderRepository.save(order);
        res.status(201).json(result);
    }

    async updateOrderStatus(req: Request, res: Response): Promise<void> {
        await this.orderRepository.update(parseInt(req.params.id), {
            status: req.body.status
        });
        res.json({ message: 'Order status updated successfully' });
    }

    async getUserOrders(req: Request, res: Response): Promise<void> {
        const orders = await this.orderRepository.find({
            where: { user: { id: parseInt(req.params.userId) } },
            relations: ['product']
        });
        res.json(orders);
    }
}