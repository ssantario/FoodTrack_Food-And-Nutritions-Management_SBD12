const notificationService = require('../services/notificationService');
const emailServices = require('../services/emailService');
const db = require('../config/db');

// Trigger all notification schedules (manual refresh)
async function refreshSchedules(req, res) {
    try {
        await notificationService.scheduleNotifications();
        res.json({ message: 'Notification schedules refreshed.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to refresh schedules.' });
    }
}

// Send a test meal reminder email to the current user
async function sendTestReminder(req, res) {
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        const user = rows[0];
        await emailServices.sendMealReminder(user, 'breakfast');
        res.json({ message: 'Test meal reminder sent.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send test reminder.' });
    }
}

module.exports = {
    refreshSchedules,
    sendTestReminder
};