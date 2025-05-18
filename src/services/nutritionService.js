const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.NUTRITION_API_URL;
const APP_ID = process.env.NUTRITIONIX_APP_ID;
const API_KEY = process.env.NUTRITIONIX_API_KEY;

async function getFoodNutrition(foodName) {
    try {
        const response = await axios.post(
            API_URL,
            { query: foodName },
            {
                headers: {
                    'x-app-id': APP_ID,
                    'x-app-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching nutrition data:', error.response?.data || error.message);
        throw new Error('Failed to fetch nutrition data');
    }
}

module.exports = {
    getFoodNutrition
};