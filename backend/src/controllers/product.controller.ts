import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../models/product.entity';
import { Like, ILike, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';

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
            const { category, search, sort, brand, minPrice, maxPrice } = req.query;
            
            // Build query with QueryBuilder for more complex conditions
            let query = this.productRepository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.brand', 'brand');
            
            // Apply filters
            if (category) {
                query = query.andWhere('product.category = :category', { category });
            }
            
            if (search) {
                // Use LOWER for case-insensitive search instead of ILIKE
                query = query.andWhere('LOWER(product.name) LIKE LOWER(:search)', { search: `%${search}%` });
            }
            
            if (brand) {
                // Use direct equal comparison
                query = query.andWhere('brand.name = :brand', { brand });
            }
            
            // Safer parsing of price values
            let minPriceValue: number | undefined = undefined;
            let maxPriceValue: number | undefined = undefined;
            
            if (minPrice && !isNaN(Number(minPrice))) {
                minPriceValue = parseInt(minPrice as string);
                query = query.andWhere('product.price >= :minPrice', { minPrice: minPriceValue });
            }
            
            if (maxPrice && !isNaN(Number(maxPrice))) {
                maxPriceValue = parseInt(maxPrice as string);
                query = query.andWhere('product.price <= :maxPrice', { maxPrice: maxPriceValue });
            }
            
            // Apply sorting
            if (sort) {
                switch (sort) {
                    case 'price-asc':
                        query = query.orderBy('product.price', 'ASC');
                        break;
                    case 'price-desc':
                        query = query.orderBy('product.price', 'DESC');
                        break;
                    case 'name-asc':
                        query = query.orderBy('product.name', 'ASC');
                        break;
                    case 'name-desc':
                        query = query.orderBy('product.name', 'DESC');
                        break;
                    default:
                        query = query.orderBy('product.id', 'DESC');
                }
            } else {
                query = query.orderBy('product.id', 'DESC');
            }
            
            // Execute query
            const products = await query.getMany();
            
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getProductById(req: Request, res: Response): Promise<void> {
        try {
            // Added relations to include the brand entity
            const product = await this.productRepository.findOne({
                where: { id: parseInt(req.params.id) },
                relations: ['brand']
            });
            
            if (!product) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }
            
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch product" });
        }
    }

    async createProduct(req: Request, res: Response): Promise<void> {
        try {
            const product = this.productRepository.create(req.body);
            const result = await this.productRepository.save(product);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: "Failed to create product" });
        }
    }

    async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            await this.productRepository.update(parseInt(req.params.id), req.body);
            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            res.status(500).json({ message: "Failed to update product" });
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            await this.productRepository.delete(parseInt(req.params.id));
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: "Failed to delete product" });
        }
    }
}