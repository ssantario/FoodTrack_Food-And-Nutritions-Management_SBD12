const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Refresh all notification schedules (admin or manual trigger)
router.post('/refresh', notificationController.refreshSchedules);

// Send a test meal reminder to the current user (requires auth)
router.post('/test-reminder', auth, notificationController.sendTestReminder);

module.exports = router;