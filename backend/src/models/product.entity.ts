import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Brand } from './brand.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    imageUrl: string;

    @Column()
    category: string;

    @OneToMany(() => Order, order => order.product)
    orders: Order[];

    @ManyToOne(() => Brand, brand => brand.products)
    brand: Brand;
}