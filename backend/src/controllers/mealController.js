const db = require("../config/db");

// Create a new meal with associated foods
async function createMeal(req, res) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { meal_type, meal_time, food_items } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!meal_type || !meal_time || !food_items || !Array.isArray(food_items)) {
      throw new Error("Invalid meal data");
    }

    // Insert meal
    const mealQuery = `
        INSERT INTO meals (user_id, meal_type, meal_time)
        VALUES ($1, $2, $3)
        RETURNING *
        `;
    const { rows: mealRows } = await client.query(mealQuery, [
      userId,
      meal_type,
      new Date(meal_time),
    ]);
    const meal = mealRows[0];

    // Insert meal foods
    for (const foodItem of food_items) {
      const { food_id, quantity } = foodItem;

      // Verify food exists and belongs to user or is admin food
      const foodCheck = await client.query(
        "SELECT * FROM foods WHERE id = $1 AND (user_id = $2 OR is_admin = true)",
        [food_id, userId]
      );

      if (foodCheck.rows.length === 0) {
        throw new Error(`Food ${food_id} not found or unauthorized`);
      }

      await client.query(
        "INSERT INTO meal_foods (meal_id, food_id, quantity) VALUES ($1, $2, $3)",
        [meal.id, food_id, quantity]
      );
    }

    // Update nutrition log
    const today = new Date().toISOString().split("T")[0];
    const nutritionUpdate = `
        INSERT INTO nutrition_logs 
            (user_id, date, total_calories, total_protein, total_carbs, total_fat)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id, date) DO UPDATE SET
            total_calories = nutrition_logs.total_calories + EXCLUDED.total_calories,
            total_protein = nutrition_logs.total_protein + EXCLUDED.total_protein,
            total_carbs = nutrition_logs.total_carbs + EXCLUDED.total_carbs,
            total_fat = nutrition_logs.total_fat + EXCLUDED.total_fat
        `;

    // Calculate nutritional totals
    const totals = await calculateMealNutrition(client, meal.id);

    await client.query(nutritionUpdate, [
      userId,
      today,
      totals.calories,
      totals.protein,
      totals.carbs,
      totals.fat,
    ]);

    await client.query("COMMIT");

    const { rows: fullMeal } = await db.query(
      `SELECT m.*, 
            json_agg(
            json_build_object(
                'food_id', mf.food_id,
                'quantity', mf.quantity,
                'name', f.name,
                'calories', f.calories
            )
            ) as food_items
        FROM meals m
        JOIN meal_foods mf ON m.id = mf.meal_id
        JOIN foods f ON mf.food_id = f.id
        WHERE m.id = $1
        GROUP BY m.id`,
      [meal.id]
    );

    res.status(201).json(fullMeal[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating meal:", error);
    res.status(400).json({ error: error.message || "Failed to create meal" });
  } finally {
    client.release();
  }
}

// Helper function to calculate meal nutrition
async function calculateMealNutrition(client, mealId) {
  const { rows } = await client.query(
    `
        SELECT 
        SUM(f.calories * mf.quantity) as calories,
        SUM(f.protein * mf.quantity) as protein,
        SUM(f.carbs * mf.quantity) as carbs,
        SUM(f.fat * mf.quantity) as fat
        FROM meal_foods mf
        JOIN foods f ON mf.food_id = f.id
        WHERE mf.meal_id = $1
    `,
    [mealId]
  );

  return {
    calories: parseFloat(rows[0].calories) || 0,
    protein: parseFloat(rows[0].protein) || 0,
    carbs: parseFloat(rows[0].carbs) || 0,
    fat: parseFloat(rows[0].fat) || 0,
  };
}

// Get user's meals with food details
async function getMeals(req, res) {
  try {
    const { rows } = await db.query(
      `
        SELECT m.*, 
            json_agg(
            json_build_object(
                'food_id', mf.food_id,
                'quantity', mf.quantity,
                'name', f.name,
                'calories', f.calories,
                'protein', f.protein,
                'carbs', f.carbs,
                'fat', f.fat
            )
            ) as food_items
        FROM meals m
        LEFT JOIN meal_foods mf ON m.id = mf.meal_id
        LEFT JOIN foods f ON mf.food_id = f.id
        WHERE m.user_id = $1
        GROUP BY m.id
        ORDER BY m.meal_time DESC
        `,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error getting meals:", error);
    res.status(500).json({ error: "Failed to get meals" });
  }
}

// Delete a meal
async function deleteMeal(req, res) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const { id } = req.params;

    // Get meal nutrition before deletion
    const totals = await calculateMealNutrition(client, id);

    // Delete meal and cascade to meal_foods
    await client.query("DELETE FROM meals WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id,
    ]);

    // Update nutrition log
    const today = new Date().toISOString().split("T")[0];
    await client.query(
      `
        UPDATE nutrition_logs
        SET 
            total_calories = total_calories - $1,
            total_protein = total_protein - $2,
            total_carbs = total_carbs - $3,
            total_fat = total_fat - $4
        WHERE user_id = $5 AND date = $6
        `,
      [
        totals.calories,
        totals.protein,
        totals.carbs,
        totals.fat,
        req.user.id,
        today,
      ]
    );

    await client.query("COMMIT");
    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting meal:", error);
    res.status(500).json({ error: "Failed to delete meal" });
  } finally {
    client.release();
  }
}

module.exports = {
  createMeal,
  getMeals,
  deleteMeal,
};
