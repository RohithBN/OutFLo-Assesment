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

// Serve static files from React build
const publicPath = path.join(__dirname, 'public');
console.log('📁 Looking for static files at:', publicPath);

// Always serve static files (not just in production)
if (fs.existsSync(publicPath)) {
  console.log('✅ Public directory found, serving static files');
  app.use(express.static(publicPath));
  
  // List files in public directory for debugging
  const files = fs.readdirSync(publicPath);
  console.log('📄 Files in public directory:', files);
} else {
  console.log('❌ Public directory not found');
}

// API routes
app.use('/api', campaignRoutes);
app.use('/api', messageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch all handler for React routes (must be after API routes)
app.get('*', (req, res) => {
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
