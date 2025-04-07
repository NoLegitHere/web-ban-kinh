import { DataSource } from 'typeorm';
import 'dotenv/config';

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Environment variables:');
  console.log(`DB_HOST: ${process.env.DB_HOST || 'not set'}`);
  console.log(`DB_PORT: ${process.env.DB_PORT || 'not set'}`);
  console.log(`DB_USERNAME: ${process.env.DB_USERNAME || 'not set'}`);
  console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '[REDACTED]' : 'not set'}`);
  console.log(`DB_NAME: ${process.env.DB_NAME || 'not set'}`);

  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'glasses_shop',
    synchronize: false, // No schema changes
    logging: true, // Log queries
    entities: [], // No entities needed for connection test
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection successful!');
    
    // Run a simple query
    const result = await dataSource.query('SELECT 1 as test');
    console.log('Query result:', result);
    
    // Close connection
    await dataSource.destroy();
    console.log('Connection closed properly');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    console.log(`Test ${success ? 'PASSED' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  }); 