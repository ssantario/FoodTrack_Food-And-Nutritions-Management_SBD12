const db = require('../config/db');
const nutritionService = require('../services/nutritionService');

// Get all foods (admin foods + user's custom foods)
async function getAllFoods(req, res) {
    try {
        const userId = req.user.id;
        
        const { rows } = await db.query(
        'SELECT * FROM foods WHERE user_id IS NULL OR user_id = $1',
        [userId]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error getting foods:', error);
        res.status(500).json({ error: 'Failed to get foods' });
    }
}

// Get food by ID
async function getFoodById(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const { rows } = await db.query(
        'SELECT * FROM foods WHERE id = $1 AND (user_id IS NULL OR user_id = $2)',
        [id, userId]
        );
        
        if (rows.length === 0) {
        return res.status(404).json({ error: 'Food not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error getting food:', error);
        res.status(500).json({ error: 'Failed to get food' });
    }
}

// Create a new custom food
async function createFood(req, res) {
    try {
        const { name, calories, protein, carbs, fat, other_nutrients } = req.body;
        const userId = req.user.id;
        
        // If nutrition data is not provided, try to fetch it
        if (!calories || !protein || !carbs || !fat) {
        try {
            const nutritionData = await nutritionService.getFoodNutrition(name);
            
            // Use the fetched data or default to provided values
            const enrichedFood = {
            name,
            calories: calories || nutritionData.calories || 0,
            protein: protein || nutritionData.protein || 0,
            carbs: carbs || nutritionData.carbs || 0,
            fat: fat || nutritionData.fat || 0,
            other_nutrients: other_nutrients || nutritionData.other_nutrients || {}
            };
            
            const { rows } = await db.query(
            'INSERT INTO foods (name, calories, protein, carbs, fat, other_nutrients, user_id, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [enrichedFood.name, enrichedFood.calories, enrichedFood.protein, enrichedFood.carbs, enrichedFood.fat, JSON.stringify(enrichedFood.other_nutrients), userId, false]
            );
            
            res.status(201).json(rows[0]);
        } catch (nutritionError) {
            // If nutrition API fails, use provided values
            const { rows } = await db.query(
            'INSERT INTO foods (name, calories, protein, carbs, fat, other_nutrients, user_id, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, calories || 0, protein || 0, carbs || 0, fat || 0, JSON.stringify(other_nutrients || {}), userId, false]
            );
            
            res.status(201).json(rows[0]);
        }
        } else {
        // Use provided nutrition values
        const { rows } = await db.query(
            'INSERT INTO foods (name, calories, protein, carbs, fat, other_nutrients, user_id, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, calories, protein, carbs, fat, JSON.stringify(other_nutrients || {}), userId, false]
        );
        
        res.status(201).json(rows[0]);
        }
    } catch (error) {
        console.error('Error creating food:', error);
        res.status(500).json({ error: 'Failed to create food' });
    }
}

// Update a custom food
async function updateFood(req, res) {
    try {
        const { id } = req.params;
        const { name, calories, protein, carbs, fat, other_nutrients } = req.body;
        const userId = req.user.id;
        
        // First check if the food belongs to the user
        const { rows: foodRows } = await db.query(
        'SELECT * FROM foods WHERE id = $1',
        [id]
        );
        
        if (foodRows.length === 0) {
        return res.status(404).json({ error: 'Food not found' });
        }
        
        const food = foodRows[0];
        
        // Cannot update admin foods
        if (food.is_admin || food.user_id !== userId) {
        return res.status(403).json({ error: 'Cannot update this food' });
        }
        
        const { rows } = await db.query(
        `UPDATE foods SET 
        name = $1, 
        calories = $2, 
        protein = $3, 
        carbs = $4, 
        fat = $5, 
        other_nutrients = $6, 
        updated_at = NOW() 
        WHERE id = $7 AND user_id = $8 
        RETURNING *`,
        [name, calories, protein, carbs, fat, JSON.stringify(other_nutrients || {}), id, userId]
        );
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error updating food:', error);
        res.status(500).json({ error: 'Failed to update food' });
    }
}

// Delete a custom food
async function deleteFood(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // First check if the food belongs to the user
        const { rows: foodRows } = await db.query(
        'SELECT * FROM foods WHERE id = $1',
        [id]
        );
        
        if (foodRows.length === 0) {
        return res.status(404).json({ error: 'Food not found' });
        }
        
        const food = foodRows[0];
        
        // Cannot delete admin foods
        if (food.is_admin || food.user_id !== userId) {
        return res.status(403).json({ error: 'Cannot delete this food' });
        }
        
        await db.query(
        'DELETE FROM foods WHERE id = $1 AND user_id = $2',
        [id, userId]
        );
        
        res.json({ message: 'Food deleted successfully' });
    } catch (error) {
        console.error('Error deleting food:', error);
        res.status(500).json({ error: 'Failed to delete food' });
    }
}

module.exports = {
    getAllFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood
};
