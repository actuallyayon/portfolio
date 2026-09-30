const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('../server/config/db');
const { seedInitialData } = require('../server/utils/seedData');

// Route imports
const authRoutes = require('../server/routes/authRoutes');
const projectRoutes = require('../server/routes/projectRoutes');
const certificateRoutes = require('../server/routes/certificateRoutes');
const profileRoutes = require('../server/routes/profileRoutes');
const uploadRoutes = require('../server/routes/uploadRoutes');
const { getFullPortfolio } = require('../server/controllers/profileController');

const app = express();

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Middleware to ensure DB connection before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    await seedInitialData();
    next();
  } catch (err) {
    console.error('[API Middleware Error]:', err.message);
    next();
  }
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/profile', profileRoutes);
app.get('/api/portfolio', getFullPortfolio);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverless: true, timestamp: new Date().toISOString() });
});

module.exports = app;
