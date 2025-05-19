import { useState } from "react";

export default function Profile() {
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [mealTimes, setMealTimes] = useState(["07:00", "12:00", "19:00"]);
  const [nutrition, setNutrition] = useState({ calories: 2000, protein: 60, fat: 50, carbs: 250 });

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profil & Preferensi</h1>
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Jadwal Makan</h2>
        <label>Jumlah makan per hari:</label>
        <input
          type="number"
          min={1}
          max={6}
          className="w-16 ml-2 mb-2 p-1 border rounded"
          value={mealsPerDay}
          onChange={e => setMealsPerDay(Number(e.target.value))}
        />
        <div>
          {Array.from({ length: mealsPerDay }).map((_, idx) => (
            <input
              key={idx}
              type="time"
              className="mr-2 mb-2 p-1 border rounded"
              value={mealTimes[idx] || ""}
              onChange={e => {
                const newTimes = [...mealTimes];
                newTimes[idx] = e.target.value;
                setMealTimes(newTimes);
              }}
            />
          ))}
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-2">Kebutuhan Nutrisi</h2>
        <input
          type="number"
          placeholder="Kalori"
          className="w-full mb-2 p-2 border rounded"
          value={nutrition.calories}
          onChange={e => setNutrition({ ...nutrition, calories: e.target.value })}
        />
        <input
          type="number"
          placeholder="Protein (g)"
          className="w-full mb-2 p-2 border rounded"
          value={nutrition.protein}
          onChange={e => setNutrition({ ...nutrition, protein: e.target.value })}
        />
        <input
          type="number"
          placeholder="Lemak (g)"
          className="w-full mb-2 p-2 border rounded"
          value={nutrition.fat}
          onChange={e => setNutrition({ ...nutrition, fat: e.target.value })}
        />
        <input
          type="number"
          placeholder="Karbohidrat (g)"
          className="w-full mb-2 p-2 border rounded"
          value={nutrition.carbs}
          onChange={e => setNutrition({ ...nutrition, carbs: e.target.value })}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded mt-2">Simpan</button>
      </div>
    </div>
  );
}