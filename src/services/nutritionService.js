const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.NUTRITION_API_KEY;
const API_URL = process.env.NUTRITION_API_URL || 'https://api.nutritionapi.com';

async function getFoodNutrition(foodName) {
    try {
        const response = await axios.get(`${API_URL}/foods`, {
        params: {
            query: foodName,
            apiKey: API_KEY
        }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching nutrition data:', error);
        throw new Error('Failed to fetch nutrition data');
    }
}

module.exports = {
    getFoodNutrition
};
