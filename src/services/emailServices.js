const nodemailer = require('nodemailer');
const config = require('../config/email');

const transporter = nodemailer.createTransport({
    service: config.service,
    auth: config.auth
});

async function sendMealReminder(user, mealType) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Reminder: Time for your ${mealType}!`,
        html: `
        <h2>Hello ${user.name}!</h2>
        <p>This is a friendly reminder that it's time for your ${mealType}.</p>
        <p>Don't forget to log your meal in FoodTrack to keep track of your nutrition goals!</p>
        <a href="${process.env.APP_URL}/meals/new">Log your meal now</a>
        `
    };

    return transporter.sendMail(mailOptions);
}

async function sendNutritionSummary(user, nutritionData, meals) {
  // Generate HTML for each meal
    const mealsHtml = meals.map(meal => {
        const foodItems = meal.food_items.map(food => 
        `<li>${food.name} (${food.quantity}): ${food.calories * food.quantity} kcal</li>`
        ).join('');
        
        return `
        <div style="margin-bottom: 15px;">
            <h4>${meal.meal_type} (${new Date(meal.meal_time).toLocaleTimeString()})</h4>
            <ul>${foodItems}</ul>
            <p>Meal total: ${meal.nutrition.calories} kcal</p>
        </div>
        `;
    }).join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Your Daily Nutrition Summary',
        html: `
        <h2>Hello ${user.name}!</h2>
        <h3>Your Meals Today:</h3>
        ${mealsHtml}
        
        <h3>Daily Nutrition Summary:</h3>
        <ul>
            <li>Total Calories: ${nutritionData.total_calories} kcal</li>
            <li>Protein: ${nutritionData.total_protein}g</li>
            <li>Carbs: ${nutritionData.total_carbs}g</li>
            <li>Fat: ${nutritionData.total_fat}g</li>
        </ul>
        
        <p>Your daily targets:</p>
        <ul>
            <li>Calories: ${user.daily_nutrition_goals.calories} kcal</li>
            <li>Protein: ${user.daily_nutrition_goals.protein}g</li>
            <li>Carbs: ${user.daily_nutrition_goals.carbs}g</li>
            <li>Fat: ${user.daily_nutrition_goals.fat}g</li>
        </ul>
        
        <a href="${process.env.APP_URL}/dashboard">View your full dashboard</a>
        `
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
  sendMealReminder,
  sendNutritionSummary
};
