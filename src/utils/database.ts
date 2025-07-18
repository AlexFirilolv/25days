import mysql from 'mysql2/promise';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

function getDatabaseConfig(): DatabaseConfig {
  // For backwards compatibility, try DATABASE_URL first
  if (process.env.DATABASE_URL) {
    // Parse DATABASE_URL (format: mysql://username:password@host:port/database)
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
    };
  }

  // Use individual environment variables (Kubernetes approach)
  const config = {
    host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306'),
    user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || process.env.DB_NAME || '',
  };

  // Validate required fields
  if (!config.database) {
    throw new Error('Database name is required. Set MYSQL_DATABASE or DB_NAME environment variable.');
  }

  if (!config.password) {
    throw new Error('Database password is required. Set MYSQL_PASSWORD or DB_PASSWORD environment variable.');
  }

  return config;
}

export async function createDatabaseConnection() {
  const config = getDatabaseConfig();
  
  try {
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      // Additional connection options for production
      connectTimeout: 10000,
    });
    
    return connection;
  } catch (error) {
    console.error('Failed to create database connection:', error);
    console.error('Database config (password hidden):', {
      ...config,
      password: '***'
    });
    throw error;
  }
} 