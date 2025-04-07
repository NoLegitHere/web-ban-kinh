import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/user.entity';

export class UserController {
    private userRepository = AppDataSource.getRepository(User);

    async getAllUsers(req: Request, res: Response): Promise<void> {
        const users = await this.userRepository.find();
        res.json(users);
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        await this.userRepository.update(parseInt(req.params.id), req.body);
        res.json({ message: 'User updated successfully' });
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        await this.userRepository.delete(parseInt(req.params.id));
        res.json({ message: 'User deleted successfully' });
    }
}