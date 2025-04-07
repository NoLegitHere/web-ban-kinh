import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../models/product.entity';
import { Like, ILike } from 'typeorm';

export class ProductController {
    private productRepository = AppDataSource.getRepository(Product);

    constructor() {
        // Bind 'this' to all methods to maintain the correct context
        this.getAllProducts = this.getAllProducts.bind(this);
        this.getProductById = this.getProductById.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            console.log("Getting products with filters:", req.query);
            const { category, search, sort } = req.query;

            // Log incoming request parameters for debugging
            console.log("Category:", category);
            console.log("Search:", search);
            console.log("Sort:", sort);

            // Build where conditions
            const whereConditions: any = {};
            if (category) {
                whereConditions.category = category;
            }
            if (search) {
                whereConditions.name = ILike(`%${search}%`);
            }

            // Build order conditions
            let orderConditions: any = { id: 'DESC' }; // Default sorting
            if (sort) {
                switch (sort) {
                    case 'price-asc':
                        orderConditions = { price: 'ASC' };
                        break;
                    case 'price-desc':
                        orderConditions = { price: 'DESC' };
                        break;
                    case 'name-asc':
                        orderConditions = { name: 'ASC' };
                        break;
                    case 'name-desc':
                        orderConditions = { name: 'DESC' };
                        break;
                    case 'newest':
                        orderConditions = { id: 'DESC' };
                        break;
                    // Add more sorting options as needed
                    default:
                        console.log(`Unknown sort parameter: ${sort}`);
                        orderConditions = { id: 'DESC' };
                        break;
                }
            }

            // Query with filters
            const products = await this.productRepository.find({
                where: whereConditions,
                relations: ['brand'],
                order: orderConditions
            });
            
            console.log(`Found ${products.length} products matching criteria`);
            res.json(products);
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: "Failed to fetch products" });
        }
    }

    async getProductById(req: Request, res: Response): Promise<void> {
        try {
            console.log(`Getting product with id: ${req.params.id}`);
            // Added relations to include the brand entity
            const product = await this.productRepository.findOne({
                where: { id: parseInt(req.params.id) },
                relations: ['brand']
            });
            
            if (!product) {
                console.log(`Product not found: ${req.params.id}`);
                res.status(404).json({ message: 'Product not found' });
                return;
            }
            
            res.json(product);
        } catch (error) {
            console.error("Error fetching product:", error);
            res.status(500).json({ message: "Failed to fetch product" });
        }
    }

    async createProduct(req: Request, res: Response): Promise<void> {
        try {
            const product = this.productRepository.create(req.body);
            const result = await this.productRepository.save(product);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({ message: "Failed to create product" });
        }
    }

    async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            await this.productRepository.update(parseInt(req.params.id), req.body);
            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).json({ message: "Failed to update product" });
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            await this.productRepository.delete(parseInt(req.params.id));
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ message: "Failed to delete product" });
        }
    }
}