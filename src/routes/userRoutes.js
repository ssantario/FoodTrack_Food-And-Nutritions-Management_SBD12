const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const validators = require('../middleware/validators');

// Get user profile
router.get('/profile', authMiddleware, userController.getUserProfile);

// Update profile
router.put('/profile', 
  authMiddleware,
  validators.validateRegisterInput, // Reuse email/name validation
  userController.updateProfile
);

// Update password
router.put('/password', authMiddleware, userController.updatePassword);

// Update meal schedule
router.put('/meal-schedule', authMiddleware, userController.updateMealSchedule);

// Update nutrition goals
router.put('/nutrition-goals', authMiddleware, userController.updateNutritionGoals);

module.exports = router;