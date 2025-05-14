const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register a new user
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const { rows: existingUsers } = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
        );
        
        if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        // Default meal schedule
        const defaultMealSchedule = {
        breakfast: '08:00',
        lunch: '12:00',
        dinner: '19:00'
        };
        
        // Default nutrition goals
        const defaultNutritionGoals = {
        calories: 2000,
        protein: 50,
        carbs: 250,
        fat: 70
        };
        
        // Create user
        const { rows } = await db.query(
        `INSERT INTO users 
        (name, email, password_hash, meal_schedule, daily_nutrition_goals) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, name, email, meal_schedule, daily_nutrition_goals`,
        [name, email, passwordHash, JSON.stringify(defaultMealSchedule), JSON.stringify(defaultNutritionGoals)]
        );
        
        const user = rows[0];
        
        // Generate JWT
        const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        res.status(201).json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            meal_schedule: user.meal_schedule,
            daily_nutrition_goals: user.daily_nutrition_goals
        }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Login user
async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const { rows } = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
        );
        
        if (rows.length === 0) {
        return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const user = rows[0];
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Generate JWT
        const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            meal_schedule: user.meal_schedule,
            daily_nutrition_goals: user.daily_nutrition_goals
        }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Get current user
async function getCurrentUser(req, res) {
    try {
        const { rows } = await db.query(
        'SELECT id, name, email, meal_schedule, daily_nutrition_goals FROM users WHERE id = $1',
        [req.user.id]
        );
        
        if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    register,
    login,
    getCurrentUser
};
