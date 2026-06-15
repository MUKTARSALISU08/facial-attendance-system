const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const profileRoutes = require('./routes/profile');

// Load environment variables - point to parent directory's .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Create Express app
const app = express();

// Middleware
// Configure CORS for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded profile images
app.use('/uploads/profile-images', express.static(path.join(__dirname, 'uploads/profile-images')));

// Serve face recognition models
app.use('/assets/models', express.static(path.join(__dirname, 'public/models')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/profile', profileRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Facial Recognition Attendance System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Sync database models
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Sync database
    await syncDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();