import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes';
import { AppDataSource } from './config/database';
import { Product } from './models/product.entity';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Set keep-alive timer - ping database every 5 minutes to keep connection active
const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Function to check if products exist and seed if necessary
async function checkAndSeedProducts() {
  try {
    // Check if products table is empty
    const productCount = await AppDataSource.getRepository(Product).count();
    console.log(`Found ${productCount} products in database`);
    
    if (productCount === 0) {
      console.log('No products found. Running product seeder...');
      
      try {
        // Run the product seeder
        const { stdout, stderr } = await execPromise('npm run seed');
        console.log('Seeder output:', stdout);
        if (stderr) console.error('Seeder errors:', stderr);
        
        console.log('Product seeding completed successfully');
      } catch (error) {
        console.error('Failed to run product seeder:', error);
      }
    } else {
      console.log('Products already exist in database. Skipping seeder.');
    }
  } catch (error) {
    console.error('Error checking products:', error);
  }
}

// Function to keep database connection alive
function startKeepAlive() {
  console.log('Starting database keep-alive service...');
  setInterval(async () => {
    try {
      if (AppDataSource.isInitialized) {
        const result = await AppDataSource.query('SELECT 1 as keep_alive');
        console.log(`Keep-alive ping sent at ${new Date().toISOString()}`);
      }
    } catch (error) {
      console.error('Keep-alive ping failed:', error);
      // Try to reinitialize connection if it's down
      if (!AppDataSource.isInitialized) {
        try {
          await AppDataSource.initialize();
          console.log('Database connection re-established');
        } catch (reconnectError) {
          console.error('Failed to re-establish connection:', reconnectError);
        }
      }
    }
  }, KEEP_ALIVE_INTERVAL);
}

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

async function initializeDatabase() {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      await AppDataSource.initialize();
      console.log('Database connected');
      
      // Check products and seed if necessary after successful connection
      await checkAndSeedProducts();
      
      return true;
    } catch (error) {
      retries++;
      console.error(`Connection attempt ${retries} failed:`, error);
      
      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }
  
  console.error('Max retries reached. Could not connect to database.');
  return false;
}

// Prevent the Node.js process from exiting due to unhandled exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // Keep process running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep process running
});

initializeDatabase().then(success => {
  if (success) {
    app.use('/api', routes);
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Server time: ${new Date().toISOString()}`);
    });
    
    // Configure server timeouts to prevent closing connections
    server.keepAliveTimeout = 65000; // 65 seconds
    server.headersTimeout = 66000; // 66 seconds
    
    // Start the keep-alive mechanism
    startKeepAlive();
    
    // Another keep-alive mechanism at the Node.js process level
    // This interval never resolves, keeping the process alive
    setInterval(() => {
      console.log(`Server heartbeat: ${new Date().toISOString()}`);
    }, 10 * 60 * 1000); // Log heartbeat every 10 minutes
    
  } else {
    process.exit(1);
  }
}).catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});