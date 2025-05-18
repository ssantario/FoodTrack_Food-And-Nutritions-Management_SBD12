// Validate email format
function isValidEmail(email) {
    return typeof email === 'string' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate password (at least 6 chars)
function isValidPassword(password) {
    return typeof password === 'string' && password.length >= 6;
}

// Validate name (not empty)
function isValidName(name) {
    return typeof name === 'string' && name.trim().length > 0;
}

// Validate nutrition goals object
function isValidNutritionGoals(goals) {
    const requiredFields = ['calories', 'protein', 'carbs', 'fat'];
    return goals && requiredFields.every(field =>
        typeof goals[field] === 'number' && goals[field] >= 0
    );
}

// Validate meal schedule object (e.g., { breakfast: "08:00", ... })
function isValidMealSchedule(schedule) {
    if (typeof schedule !== 'object' || !schedule) return false;
    return Object.values(schedule).every(time =>
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
    );
}
function validateRegisterInput(req, res, next) {
    const { name, email } = req.body;
    if (!isValidName(name)) {
        return res.status(400).json({ error: 'Invalid name' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    next();
}

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidNutritionGoals,
    isValidMealSchedule,
    validateRegisterInput // <-- add this line
};