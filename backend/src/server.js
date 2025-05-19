require('dotenv').config();
const app = require('../app');
const notificationService = require('./services/notificationService');

const PORT = process.env.PORT || 5000;

// Start the notification scheduler
notificationService.scheduleNotifications();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
