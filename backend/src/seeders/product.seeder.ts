import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../models/user.entity';
import { Brand } from '../models/brand.entity';
import { Product } from '../models/product.entity';
import { Order } from '../models/order.entity';

/**
 * Seed brands and products for the eyewear store
 */
async function seedData() {
  console.log('Starting product database seeder...');
  
  // Create a dedicated database connection for the seeder
  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'glasses_shop',
    synchronize: true,
    logging: ["error", "warn"],
    entities: [User, Product, Order, Brand],
  });
  
  try {
    // Initialize database connection
    await dataSource.initialize();
    console.log('Database connected successfully');

    // First, clear existing data
    await dataSource.getRepository(Product).delete({});
    await dataSource.getRepository(Brand).delete({});
    console.log('Cleared existing products and brands');

    // Seed brands
    const brands = [
      {
        name: 'Ray-Ban',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Ray-Ban_logo.svg/2560px-Ray-Ban_logo.svg.png',
        description: 'Ray-Ban is one of the world\'s most iconic eyewear brands, known for classic styles like the Wayfarer and Aviator.',
      },
      {
        name: 'Oakley',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Oakley_logo.svg/2560px-Oakley_logo.svg.png',
        description: 'Oakley specializes in performance eyewear for sports and active lifestyles, with innovative lens technology.',
      },
      {
        name: 'Gucci',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/1960s_Gucci_Logo.svg/2560px-1960s_Gucci_Logo.svg.png',
        description: 'Gucci eyewear embodies the brand\'s luxury aesthetic with bold, fashionable frames and iconic details.',
      },
      {
        name: 'Prada',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Prada_Logo.svg/2560px-Prada_Logo.svg.png',
        description: 'Prada offers sophisticated, fashion-forward eyewear with meticulous craftsmanship and elegant designs.',
      },
      {
        name: 'Versace',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Versace_logo.svg/2560px-Versace_logo.svg.png',
        description: 'Versace eyewear features bold, glamorous designs with the brand\'s distinctive Medusa logo and Greek key pattern.',
      },
      {
        name: 'Burberry',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Burberry_logo.svg/2560px-Burberry_logo.svg.png',
        description: 'Burberry offers classic British-inspired eyewear featuring the brand\'s signature plaid and equestrian details.',
      },
      {
        name: 'Persol',
        logo: 'https://logodownload.org/wp-content/uploads/2019/10/persol-logo-0.png',
        description: 'Persol combines Italian craftsmanship with timeless designs, known for their distinctive arrow hinges and quality materials.',
      },
    ];

    console.log(`Seeding ${brands.length} brands...`);
    const savedBrands: Brand[] = [];
    for (const brandData of brands) {
      const brand = new Brand();
      brand.name = brandData.name;
      brand.logo = brandData.logo;
      brand.description = brandData.description;
      const savedBrand = await dataSource.getRepository(Brand).save(brand);
      savedBrands.push(savedBrand);
      console.log(`Created brand: ${savedBrand.name}`);
    }

    // Product data generator
    const categories = ['men', 'women', 'unisex', 'sunglasses', 'premium'];
    const frameStyles = ['Rectangle', 'Round', 'Square', 'Oval', 'Cat Eye', 'Aviator', 'Geometric', 'Browline', 'Oversized'];
    const materials = ['Acetate', 'Metal', 'Titanium', 'Plastic', 'Carbon Fiber', 'Wood'];
    const features = ['Polarized', 'Photochromic', 'UV Protection', 'Anti-Glare', 'Scratch Resistant', 'Blue Light Blocking'];
    const colors = ['Black', 'Tortoise', 'Brown', 'Gold', 'Silver', 'Blue', 'Green', 'Red', 'Pink', 'Clear', 'Havana'];

    // Helper function to get random element from array
    const getRandomElement = (array: any[]) => array[Math.floor(Math.random() * array.length)];
    // Helper function to get random price between min and max
    const getRandomPrice = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min) * 10000;
    // Helper function to get random subset of items
    const getRandomSubset = (array: any[], count: number) => {
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    console.log('Generating random products...');
    
    // Generate products
    const products: any[] = [];
    for (let i = 0; i < 50; i++) {
      const brand = getRandomElement(savedBrands);
      const category = getRandomElement(categories);
      const frameStyle = getRandomElement(frameStyles);
      const material = getRandomElement(materials);
      const color = getRandomElement(colors);
      const featureList = getRandomSubset(features, Math.floor(Math.random() * 3) + 1);
      
      // Price ranges by category
      let priceRange = { min: 100, max: 300 }; // default
      if (category === 'premium') {
        priceRange = { min: 400, max: 900 };
      } else if (brand.name === 'Gucci' || brand.name === 'Prada' || brand.name === 'Versace') {
        priceRange = { min: 300, max: 800 };
      }
      
      const price = getRandomPrice(priceRange.min, priceRange.max);
      
      // Model number
      const modelNumber = `${brand.name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Create product name
      const productName = `${brand.name} ${modelNumber} ${frameStyle} ${category === 'sunglasses' ? 'Sunglasses' : 'Eyeglasses'} - ${color}`;
      
      // Create description
      const description = `${brand.name} ${modelNumber} ${frameStyle} ${material} eyewear in ${color}. Features: ${featureList.join(', ')}. Perfect for ${category === 'men' ? 'men' : category === 'women' ? 'women' : 'all genders'}.`;
      
      // Image URL (using placeholder images)
      const imageIndex = i % 10 + 1; // Cycle through 10 images
      const imageUrl = `https://images.unsplash.com/photo-${1570000000000 + imageIndex * 10000}?q=80&w=580&h=580&auto=format&fit=crop`;
      
      const product = new Product();
      product.name = productName;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;
      product.category = category;
      product.brand = brand;
      
      products.push(product);
    }

    // Add some specific products with fixed images for better display
    console.log('Adding specific showcase products...');
    const specificProducts = [
      {
        name: 'Ray-Ban RB3025 Aviator Classic',
        description: 'The Ray-Ban RB3025 Aviator is a timeless style that combines great aviator styling with exceptional quality and comfort.',
        price: 1890000,
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=580&h=580&auto=format&fit=crop',
        category: 'sunglasses',
        brand: savedBrands.find(b => b.name === 'Ray-Ban')
      },
      {
        name: 'Gucci GG0396S Square Sunglasses',
        description: 'Gucci GG0396S square-frame sunglasses with gold-tone temples featuring the iconic Gucci logo.',
        price: 6950000,
        imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=580&h=580&auto=format&fit=crop',
        category: 'premium',
        brand: savedBrands.find(b => b.name === 'Gucci')
      },
      {
        name: 'Persol PO3092SM Steve McQueen',
        description: 'The Persol PO3092SM sunglasses are inspired by the iconic style worn by Steve McQueen, featuring the distinctive Supreme Arrow and Meflecto technology.',
        price: 3500000,
        imageUrl: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=580&h=580&auto=format&fit=crop',
        category: 'men',
        brand: savedBrands.find(b => b.name === 'Persol')
      },
      {
        name: 'Prada PR 01OS Cat Eye Sunglasses',
        description: 'Prada PR 01OS cat-eye sunglasses feature a bold, feminine shape with gradient lenses and the iconic Prada logo on the temples.',
        price: 4250000,
        imageUrl: 'https://images.unsplash.com/photo-1619449993667-6dee759dd3c1?q=80&w=580&h=580&auto=format&fit=crop',
        category: 'women',
        brand: savedBrands.find(b => b.name === 'Prada')
      },
    ];
    
    // Create and add the specific products
    for (const productData of specificProducts) {
      if (productData.brand) {
        const product = new Product();
        product.name = productData.name;
        product.description = productData.description;
        product.price = productData.price;
        product.imageUrl = productData.imageUrl;
        product.category = productData.category;
        product.brand = productData.brand;
        products.push(product);
      }
    }

    // Save all products in batches to avoid overwhelming the database
    console.log(`Saving ${products.length} products to database...`);
    const batchSize = 10;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await dataSource.getRepository(Product).save(batch);
      console.log(`Saved products ${i + 1} to ${Math.min(i + batchSize, products.length)}`);
    }

    console.log(`Created ${products.length} products`);
    console.log('Database seeding completed successfully');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    return false;
  } finally {
    // Close the database connection
    try {
      if (dataSource && dataSource.isInitialized) {
        await dataSource.destroy();
        console.log('Database connection closed');
      }
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
  
  return true;
}

// Run the seeder
seedData().then(success => {
  console.log(`Seeder ${success ? 'completed successfully' : 'failed'}`);
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Seeder failed with an unexpected error:', error);
  process.exit(1);
}); 