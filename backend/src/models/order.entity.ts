import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @Column({ default: 'pending' })
    status: string;

    @CreateDateColumn()
    orderDate: Date;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @ManyToOne(() => Product, product => product.orders)
    product: Product;
}