# Frontend Integration Guide

This document explains how to connect your frontend to the Food & Nutrition Management backend API.

---

## 1. **API Base URL**

- **Local development:**  
  ```
  http://localhost:5000/api
  ```
  (Change the port if `PORT` in `.env` is different.)

---

## 2. **Authentication**

### Register
- **Endpoint:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:** `{ "token": "...", "user": { ... } }`

### Login
- **Endpoint:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:** `{ "token": "...", "user": { ... } }`

### Authenticated Requests
- Add this header to all protected endpoints:
  ```
  Authorization: Bearer <token>
  ```

---

## 3. **User Endpoints**

- **Get Profile:**  
  `GET /api/users/profile`

- **Update Profile:**  
  `PUT /api/users/profile`  
  ```json
  { "name": "New Name", "email": "new@email.com" }
  ```

- **Update Password:**  
  `PUT /api/users/password`  
  ```json
  { "currentPassword": "old", "newPassword": "new" }
  ```

- **Update Meal Schedule:**  
  `PUT /api/users/meal-schedule`  
  ```json
  { "meal_schedule": { "breakfast": "08:00", "lunch": "12:00", "dinner": "19:00" } }
  ```

- **Update Nutrition Goals:**  
  `PUT /api/users/nutrition-goals`  
  ```json
  { "daily_nutrition_goals": { "calories": 2000, "protein": 50, "carbs": 250, "fat": 70 } }
  ```

---

## 4. **Food Endpoints**

- **Get All Foods:**  
  `GET /api/foods`

- **Get Food by ID:**  
  `GET /api/foods/:id`

- **Create Food:**  
  `POST /api/foods`  
  ```json
  {
    "name": "Banana"
    // Optionally: "calories", "protein", "carbs", "fat"
  }
  ```
  _If nutrition info is missing, backend fetches from Nutritionix._

- **Update Food:**  
  `PUT /api/foods/:id`

- **Delete Food:**  
  `DELETE /api/foods/:id`

---

## 5. **Meal Endpoints**

- **Create Meal:**  
  `POST /api/meals`  
  ```json
  {
    "meal_type": "breakfast",
    "meal_time": "2024-06-01T08:00:00Z",
    "food_items": [
      { "food_id": 1, "quantity": 2 }
    ]
  }
  ```

- **Get Meals:**  
  `GET /api/meals`

- **Delete Meal:**  
  `DELETE /api/meals/:id`

---

## 6. **Notifications & Emails**

- Users receive meal reminders and daily summaries via email (no frontend action required).

---

## 7. **CORS**

- CORS is enabled for all origins by default.  
  You can connect from any frontend (React, Vue, etc.) on any port.

---

## 8. **Error Handling**

- Errors are returned as:
  ```json
  { "error": "message" }
  ```
  with appropriate HTTP status codes.

---

## 9. **APP_URL in .env**

- `APP_URL` is used by the backend to generate links in emails.
- For local development, set to your frontend URL (e.g., `http://localhost:3000`).
- For production, update to your deployed frontend URL.

---

## 10. **Summary**

- Set API base URL to `http://localhost:5000/api`.
- Authenticate and use the JWT token for protected routes.
- Use the endpoints above for all user, food, and meal features.
- No need to handle nutrition lookup or email sending—backend does this automatically.

---