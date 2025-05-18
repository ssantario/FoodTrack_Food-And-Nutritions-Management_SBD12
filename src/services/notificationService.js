const cron = require('node-cron');
const db = require('../config/db');
const emailService = require('./emailService');

// Store references to scheduled tasks so we can clear them
let scheduledTasks = [];

// Get all users and their meal schedules
async function scheduleNotifications() {
    try {
        // Stop and clear previous tasks
        scheduledTasks.forEach(task => task.stop());
        scheduledTasks = [];

        const { rows: users } = await db.query('SELECT id, name, email, meal_schedule, daily_nutrition_goals FROM users');
        
        users.forEach(user => {
            const mealSchedule = user.meal_schedule;
            
            // Schedule meal reminders
            Object.entries(mealSchedule).forEach(([mealType, time]) => {
                // Parse time (assuming format is "HH:MM")
                const [hour, minute] = time.split(':');
                
                // Schedule 30 minutes before meal time
                const reminderHour = parseInt(hour);
                const reminderMinute = parseInt(minute) - 30;
                
                // Adjust if reminder time goes negative
                const adjustedHour = reminderMinute < 0 ? (reminderHour - 1 + 24) % 24 : reminderHour;
                const adjustedMinute = reminderMinute < 0 ? reminderMinute + 60 : reminderMinute;
                
                // Create cron schedule
                const cronExpression = `${adjustedMinute} ${adjustedHour} * * *`;
                
                const task = cron.schedule(cronExpression, () => {
                    emailService.sendMealReminder(user, mealType);
                    console.log(`Sent reminder for ${mealType} to ${user.email}`);
                });
                scheduledTasks.push(task);
            });
            
            // Schedule nutrition summary (after last meal)
            const mealTimes = Object.values(mealSchedule).map(time => {
                const [hour, minute] = time.split(':');
                return parseInt(hour) * 60 + parseInt(minute);
            });
            
            if (mealTimes.length > 0) {
                const lastMealMinutes = Math.max(...mealTimes);
                const summaryHour = Math.floor((lastMealMinutes + 60) / 60) % 24; // 1 hour after last meal
                const summaryMinute = (lastMealMinutes + 60) % 60;
                
                const cronExpression = `${summaryMinute} ${summaryHour} * * *`;
                
                const task = cron.schedule(cronExpression, async () => {
                    try {
                        // Get today's nutrition data
                        const today = new Date().toISOString().split('T')[0];
                        const { rows: nutritionLogs } = await db.query(
                            'SELECT * FROM nutrition_logs WHERE user_id = $1 AND date = $2',
                            [user.id, today]
                        );
                        
                        // Get today's meals
                        const { rows: meals } = await db.query(
                            'SELECT * FROM meals WHERE user_id = $1 AND DATE(meal_time) = $2',
                            [user.id, today]
                        );
                        
                        const mealsWithFoods = await Promise.all(
                            meals.map(async (meal) => {
                                // Get food items for the meal
                                const { rows: foodItems } = await db.query(
                                    `SELECT f.*, mf.quantity
                                    FROM meal_foods mf
                                    JOIN foods f ON mf.food_id = f.id
                                    WHERE mf.meal_id = $1`,
                                    [meal.id]
                                );
                                
                                // Calculate nutrition totals
                                const nutrition = {
                                    calories: 0,
                                    protein: 0,
                                    carbs: 0,
                                    fat: 0
                                };
                                
                                foodItems.forEach(item => {
                                    nutrition.calories += item.calories * item.quantity;
                                    nutrition.protein += item.protein * item.quantity;
                                    nutrition.carbs += item.carbs * item.quantity;
                                    nutrition.fat += item.fat * item.quantity;
                                });
                                
                                return {
                                    ...meal,
                                    food_items: foodItems,
                                    nutrition
                                };
                            })
                        );
                        
                        if (nutritionLogs.length > 0 && mealsWithFoods.length > 0) {
                            await emailService.sendNutritionSummary(user, nutritionLogs[0], mealsWithFoods);
                            console.log(`Sent nutrition summary to ${user.email}`);
                        }
                    } catch (error) {
                        console.error('Error sending nutrition summary:', error);
                    }
                });
                scheduledTasks.push(task);
            }
        });
        
        console.log('Notification schedules set up successfully');
    } catch (error) {
        console.error('Error scheduling notifications:', error);
    }
}

// Run on startup and every day at midnight to refresh schedules
cron.schedule('0 0 * * *', scheduleNotifications);

// Initial schedule on server start
scheduleNotifications();

module.exports = {
    scheduleNotifications
};