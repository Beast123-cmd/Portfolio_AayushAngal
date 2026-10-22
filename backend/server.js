import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import contactRoutes from './routes/contact.js';
import resumeRoutes from './routes/resume.js';

dotenv.config();

const app = express();

// Only allow the portfolio frontend to call the public contact endpoint.
const productionOrigins = [
  'https://aayush-portfolio-svud.onrender.com',
  ...(process.env.FRONTEND_URL || '').split(',').map((origin) => origin.trim().replace(/\/+$/, '')).filter((origin) => origin.startsWith('https://')),
];
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: [...new Set(productionOrigins)] }
  : { origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081'] };

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/resume', resumeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? 'OK' : 'degraded',
    database: databaseReady ? 'connected' : 'unavailable',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
