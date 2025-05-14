const db = require('../config/db');
const bcrypt = require('bcrypt');

// Get user profile
async function getUserProfile(req, res) {
    try {
        const { rows } = await db.query(
        `SELECT id, name, email, meal_schedule, daily_nutrition_goals 
        FROM users WHERE id = $1`,
        [req.user.id]
        );
        
        if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Update user profile
async function updateProfile(req, res) {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        const { rows } = await db.query(
        `UPDATE users SET
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            updated_at = NOW()
        WHERE id = $3
        RETURNING id, name, email, meal_schedule, daily_nutrition_goals`,
        [name, email, userId]
        );

        res.json(rows[0]);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Update password
async function updatePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Verify current password
        const { rows } = await db.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [userId]
        );
        
        const isValid = await bcrypt.compare(currentPassword, rows[0].password_hash);
        if (!isValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);

        await db.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [newHash, userId]
        );

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Update meal schedule
async function updateMealSchedule(req, res) {
    try {
        const { meal_schedule } = req.body;
        const userId = req.user.id;

        // Validate meal schedule structure
        if (!isValidMealSchedule(meal_schedule)) {
        return res.status(400).json({ error: 'Invalid meal schedule format' });
        }

        const { rows } = await db.query(
        `UPDATE users SET 
            meal_schedule = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING meal_schedule`,
        [JSON.stringify(meal_schedule), userId]
        );

        res.json(rows[0]);
    } catch (error) {
        console.error('Error updating meal schedule:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Update nutrition goals
async function updateNutritionGoals(req, res) {
    try {
        const { daily_nutrition_goals } = req.body;
        const userId = req.user.id;

        // Validate nutrition goals
        if (!isValidNutritionGoals(daily_nutrition_goals)) {
        return res.status(400).json({ error: 'Invalid nutrition goals format' });
        }

        const { rows } = await db.query(
        `UPDATE users SET 
            daily_nutrition_goals = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING daily_nutrition_goals`,
        [JSON.stringify(daily_nutrition_goals), userId]
        );

        res.json(rows[0]);
    } catch (error) {
        console.error('Error updating nutrition goals:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Validation helpers
function isValidMealSchedule(schedule) {
    if (typeof schedule !== 'object') return false;
    return Object.values(schedule).every(time => 
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
    );
}

function isValidNutritionGoals(goals) {
    const requiredFields = ['calories', 'protein', 'carbs', 'fat'];
    return requiredFields.every(field => 
        typeof goals[field] === 'number' && goals[field] >= 0
    );
}

module.exports = {
    getUserProfile,
    updateProfile,
    updatePassword,
    updateMealSchedule,
    updateNutritionGoals
};