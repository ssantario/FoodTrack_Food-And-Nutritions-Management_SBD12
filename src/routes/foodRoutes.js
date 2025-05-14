const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authMiddleware = require('../middleware/auth');

// Get all foods (admin + user's custom foods)
router.get('/', authMiddleware, foodController.getAllFoods);

// Get a specific food
router.get('/:id', authMiddleware, foodController.getFoodById);

// Add a new custom food
router.post('/', authMiddleware, foodController.createFood);

// Update a food (only user's custom foods)
router.put('/:id', authMiddleware, foodController.updateFood);

// Delete a food (only user's custom foods)
router.delete('/:id', authMiddleware, foodController.deleteFood);

module.exports = router;
