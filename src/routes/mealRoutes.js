const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const authMiddleware = require('../middleware/auth');

// Create a meal
router.post('/', authMiddleware, mealController.createMeal);

// Get all meals
router.get('/', authMiddleware, mealController.getMeals);

// Delete a meal
router.delete('/:id', authMiddleware, mealController.deleteMeal);

module.exports = router;
