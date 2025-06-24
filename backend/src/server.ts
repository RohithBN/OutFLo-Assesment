import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import campaignRoutes from './routes/campaigns';
import messageRoutes from './routes/messages';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OutFlo Campaign Manager API is running',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI ;
    await mongoose.connect(mongoURI as string);
    console.log(' MongoDB connected successfully');
  } catch (error) {
    console.error(' MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV}`);
    console.log(` API URL: http://localhost:${PORT}/api`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
