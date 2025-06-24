import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

import campaignRoutes from './routes/campaigns';
import messageRoutes from './routes/messages';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add middleware to log all requests for debugging
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// API routes MUST come before static file serving
console.log('🔧 Registering API routes...');

// Add debugging middleware specifically for API routes
app.use('/api', (req, res, next) => {
  console.log(`🔍 API Request: ${req.method} ${req.originalUrl} - Body:`, req.body);
  next();
});

app.use('/api', campaignRoutes);
app.use('/api', messageRoutes);

// ALSO add routes directly without /api prefix for debugging
// This is temporary to catch misdirected requests
app.use('/campaigns', (req, res, next) => {
  console.log(`🚨 DIRECT /campaigns request detected: ${req.method} ${req.originalUrl}`);
  console.log('🚨 This should be going to /api/campaigns instead!');
  // Redirect to the correct API endpoint
  const newUrl = '/api' + req.originalUrl;
  console.log(`🔄 Redirecting to: ${newUrl}`);
  req.url = newUrl;
  req.originalUrl = newUrl;
  next();
});

app.use('/personalized-message', (req, res, next) => {
  console.log(`🚨 DIRECT /personalized-message request detected: ${req.method} ${req.originalUrl}`);
  console.log('🚨 This should be going to /api/personalized-message instead!');
  // Redirect to the correct API endpoint
  const newUrl = '/api' + req.originalUrl;
  console.log(`🔄 Redirecting to: ${newUrl}`);
  req.url = newUrl;
  req.originalUrl = newUrl;
  next();
});

// Test endpoint to verify API routing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API routing is working!', timestamp: new Date().toISOString() });
});

// Serve static files from React build (after API routes)
const publicPath = path.join(__dirname, 'public');
console.log('📁 Looking for static files at:', publicPath);

// Check if public directory exists
if (fs.existsSync(publicPath)) {
  console.log('✅ Public directory found');
  app.use(express.static(publicPath));
} else {
  console.log('❌ Public directory not found');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch all handler for React routes (must be after API routes)
app.all('*', (req, res) => {
  // Handle API routes that don't exist
  if (req.path.startsWith('/api/')) {
    console.log(`❌ API route not found: ${req.method} ${req.path}`);
    return res.status(404).json({ 
      error: 'API endpoint not found',
      method: req.method,
      path: req.path
    });
  }
  
  // TEMPORARILY COMMENTED OUT - This was blocking POST requests
  // Only serve React app for GET requests to non-API routes
  // if (req.method !== 'GET') {
  //   console.log(`❌ Non-GET request to frontend route: ${req.method} ${req.path}`);
  //   return res.status(405).json({ 
  //     error: 'Method not allowed',
  //     method: req.method,
  //     path: req.path
  //   });
  // }
  
  // For now, serve React app for all non-API routes
  const indexPath = path.join(__dirname, 'public', 'index.html');
  console.log('🔍 Attempting to serve React app from:', indexPath);
  
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html found, serving...');
    res.sendFile(indexPath);
  } else {
    console.log('❌ index.html not found');
    res.status(404).json({ 
      error: 'Application not found', 
      message: 'Frontend build files are missing',
      path: indexPath 
    });
  }
});

// Add error handling middleware AFTER all routes
app.use(errorHandler);

// Use Railway's PORT or default to 5000
const PORT = Number(process.env.PORT) || 5000;

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI as string);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
    console.log(`📁 Static files directory: ${path.join(__dirname, 'public')}`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
