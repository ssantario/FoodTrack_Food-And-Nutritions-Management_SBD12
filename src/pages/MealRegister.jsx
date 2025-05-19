import { useState } from "react";

export default function MealRegister() {
  const [meal, setMeal] = useState({ name: "", calories: "", protein: "", fat: "", carbs: "" });

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Catat Makanan</h1>
      <form className="bg-white p-6 rounded shadow">
        <input
          type="text"
          placeholder="Nama Makanan"
          className="w-full mb-3 p-2 border rounded"
          value={meal.name}
          onChange={e => setMeal({ ...meal, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Kalori"
          className="w-full mb-3 p-2 border rounded"
          value={meal.calories}
          onChange={e => setMeal({ ...meal, calories: e.target.value })}
        />
        <input
          type="number"
          placeholder="Protein (g)"
          className="w-full mb-3 p-2 border rounded"
          value={meal.protein}
          onChange={e => setMeal({ ...meal, protein: e.target.value })}
        />
        <input
          type="number"
          placeholder="Lemak (g)"
          className="w-full mb-3 p-2 border rounded"
          value={meal.fat}
          onChange={e => setMeal({ ...meal, fat: e.target.value })}
        />
        <input
          type="number"
          placeholder="Karbohidrat (g)"
          className="w-full mb-3 p-2 border rounded"
          value={meal.carbs}
          onChange={e => setMeal({ ...meal, carbs: e.target.value })}
        />
        <button className="w-full bg-green-500 text-white py-2 rounded">Simpan</button>
      </form>
    </div>
  );
}