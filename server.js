const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./server/config/db');
const { seedInitialData } = require('./server/utils/seedData');

// Route imports
const authRoutes = require('./server/routes/authRoutes');
const projectRoutes = require('./server/routes/projectRoutes');
const certificateRoutes = require('./server/routes/certificateRoutes');
const profileRoutes = require('./server/routes/profileRoutes');
const uploadRoutes = require('./server/routes/uploadRoutes');

const { getFullPortfolio } = require('./server/controllers/profileController');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());

// Body parser
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static asset folders
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/resume', express.static(path.join(__dirname, 'resume')));
app.use('/Certificates', express.static(path.join(__dirname, 'Certificates')));
app.use('/profile', express.static(path.join(__dirname, 'profile')));
app.use('/sites', express.static(path.join(__dirname, 'sites')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/profile', profileRoutes);
app.get('/api/portfolio', getFullPortfolio);
app.use('/api/upload', uploadRoutes);

// Admin dashboard shortcut route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Fallback to index.html for root or client routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    await seedInitialData();

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Ayon's Portfolio Server running on port ${PORT}`);
      console.log(`🌐 Portfolio:  http://localhost:${PORT}`);
      console.log(`🛡️  Admin Panel: http://localhost:${PORT}/admin`);
      console.log(`📡 API URL:    http://localhost:${PORT}/api/portfolio`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
