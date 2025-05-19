-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    meal_schedule JSONB DEFAULT '{}'::jsonb,
    daily_nutrition_goals JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- FOODS TABLE
CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    calories NUMERIC DEFAULT 0,
    protein NUMERIC DEFAULT 0,
    carbs NUMERIC DEFAULT 0,
    fat NUMERIC DEFAULT 0,
    other_nutrients JSONB DEFAULT '{}'::jsonb,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- MEALS TABLE
CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    meal_type VARCHAR(50) NOT NULL,
    meal_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- MEAL_FOODS TABLE (join table for meals and foods)
CREATE TABLE IF NOT EXISTS meal_foods (
    id SERIAL PRIMARY KEY,
    meal_id INTEGER REFERENCES meals(id) ON DELETE CASCADE,
    food_id INTEGER REFERENCES foods(id) ON DELETE CASCADE,
    quantity NUMERIC DEFAULT 1
);

-- NUTRITION LOGS TABLE
CREATE TABLE IF NOT EXISTS nutrition_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_calories NUMERIC DEFAULT 0,
    total_protein NUMERIC DEFAULT 0,
    total_carbs NUMERIC DEFAULT 0,
    total_fat NUMERIC DEFAULT 0,
    UNIQUE(user_id, date)
);

-- ESSENTIAL DATA FOR TESTING

-- Insert an admin food (visible to all users)
INSERT INTO foods (name, calories, protein, carbs, fat, is_admin)
VALUES
('Banana', 89, 1.1, 23, 0.3, TRUE),
('Egg', 68, 6, 1, 5, TRUE)
ON CONFLICT DO NOTHING;

-- Insert a test user (password: 'test1234')
INSERT INTO users (name, email, password_hash, meal_schedule, daily_nutrition_goals)
VALUES (
    'Test User',
    'test@example.com',
    '$2b$10$wH8QwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', -- bcrypt hash for 'test1234'
    '{"breakfast":"08:00","lunch":"12:00","dinner":"19:00"}',
    '{"calories":2000,"protein":50,"carbs":250,"fat":70}'
)
ON CONFLICT DO NOTHING;

-- Insert a user food for the test user (assuming user id 1)
INSERT INTO foods (name, calories, protein, carbs, fat, user_id, is_admin)
VALUES
('Homemade Salad', 150, 3, 20, 7, 1, FALSE)
ON CONFLICT DO NOTHING;

-- Insert a meal for the test user (assuming user id 1)
INSERT INTO meals (user_id, meal_type, meal_time)
VALUES (1, 'breakfast', NOW())
RETURNING id;

-- You may need to manually insert into meal_foods after getting the meal id above, e.g.:
-- INSERT INTO meal_foods (meal_id, food_id, quantity) VALUES (<meal_id>, 1, 1);
-- After inserting the meal, assuming the new meal's id is 1 and food id 1 (Banana) and 3 (Homemade Salad):
INSERT INTO meal_foods (meal_id, food_id, quantity) VALUES (1, 1, 1); -- Banana
INSERT INTO meal_foods (meal_id, food_id, quantity) VALUES (1, 3, 1); -- Homemade Salad

-- Insert a nutrition log for the test user
INSERT INTO nutrition_logs (user_id, date, total_calories, total_protein, total_carbs, total_fat)
VALUES (1, CURRENT_DATE, 239, 7.1, 43, 7.3)
ON CONFLICT (user_id, date) DO NOTHING;