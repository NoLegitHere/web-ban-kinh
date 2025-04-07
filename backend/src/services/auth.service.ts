import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.entity';
import { AppDataSource } from '../config/database';

interface LoginResponse {
    token: string;
    user: Partial<User>;
}

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    async register(userData: Partial<User>): Promise<User> {
        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email }
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof userData.email !== 'string' || !emailRegex.test(userData.email)) {
            throw new Error('Invalid email format');
        }

        // Password strength validation
        if (!userData.password || userData.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
            role: userData.role || 'customer'
        });

        return await this.userRepository.save(user);
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const user = await this.userRepository.findOne({ 
            where: { email },
            select: ['id', 'email', 'password', 'role', 'name'] 
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET as string,
            { 
                expiresIn: '24h',
                algorithm: 'HS256'
            }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return {
            token,
            user: userWithoutPassword
        };
    }

    async validateToken(token: string): Promise<boolean> {
        try {
            jwt.verify(token, process.env.JWT_SECRET as string);
            return true;
        } catch {
            return false;
        }
    }

    async refreshToken(userId: number): Promise<string> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }

        return jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET as string,
            { 
                expiresIn: '24h',
                algorithm: 'HS256'
            }
        );
    }
}