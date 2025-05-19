const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const foodRoutes = require('./src/routes/foodRoutes');
const mealRoutes = require('./src/routes/mealRoutes');
const userRoutes = require('./src/routes/userRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
