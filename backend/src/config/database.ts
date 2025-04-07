import { DataSource } from 'typeorm';
import { User } from '../models/user.entity';
import { Brand } from '../models/brand.entity';
import { Product } from '../models/product.entity';
import { Order } from '../models/order.entity';
import 'dotenv/config';

// Get the environment variables with fallback defaults
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5432');
const username = process.env.DB_USERNAME || 'postgres';
const password = process.env.DB_PASSWORD || 'binbin12';
const database = process.env.DB_NAME || 'glasses_shop';

console.log('Database configuration:');
console.log(`Host: ${host}`);
console.log(`Port: ${port}`);
console.log(`Username: ${username}`);
console.log(`Database: ${database}`);

export const AppDataSource = new DataSource({
    type: "postgres",
    host,
    port,
    username,
    password,
    database,
    synchronize: true, // Be careful with this in production
    logging: ["error", "warn"],
    entities: [User, Product, Order, Brand],
    migrations: [],
    subscribers: [],
    // Connection pool settings
    poolSize: 10,
    connectTimeoutMS: 30000,
    // Keep connections alive
    extra: {
        // Connection idle timeout
        idleTimeoutMillis: 300000, // 5 minutes
        // Maximum time a client can be idle before being closed
        max_lifetime: 3600000, // 1 hour
        // Keep the connection alive with a ping
        keepAlive: true,
        keepAliveInitialDelay: 300000 // 5 minutes
    },
});