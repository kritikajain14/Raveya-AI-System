import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import productRoutes from './src/routes/productRoutes.js';
import proposalRoutes from './src/routes/proposalRoutes.js';
import logRoutes from './src/routes/logRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/logs', logRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;