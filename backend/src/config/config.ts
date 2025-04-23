import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Default fallback for JWT secret - DO NOT use this in production
const DEFAULT_JWT_SECRET = 'tutor-app-jwt-secret-key-fallback';

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // MongoDB connection details
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tutoring-platform',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  // Relational database configuration (if used alongside MongoDB)
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'tutorapp'
  }
}; 