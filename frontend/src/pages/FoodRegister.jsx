import { useState } from "react";

export default function MealRegister() {
  const [meal, setMeal] = useState({ name: "", calories: "", protein: "", fat: "", carbs: "" });

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto w-full">
      <div className="absolute left-4 md:left-6 top-4 md:top-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-main flex items-center justify-center shadow-lg hover:bg-secondary focus:bg-secondary transition-colors duration-200 outline-none focus:ring-4 focus:ring-main/30 group"
          aria-label="Home"
        >
          <svg className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
          </svg>
        </button>
      </div>
      <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center">Catat Makanan</h1>
      <form className="bg-white p-4 md:p-6 rounded shadow">
        <input
          type="text"
          placeholder="Nama Makanan"
          className="w-full mb-2 md:mb-3 p-2 md:p-2.5 border rounded text-sm md:text-base"
          value={meal.name}
          onChange={e => setMeal({ ...meal, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Kalori"
          className="w-full mb-2 md:mb-3 p-2 md:p-2.5 border rounded text-sm md:text-base"
          value={meal.calories}
          onChange={e => setMeal({ ...meal, calories: e.target.value })}
        />
        <input
          type="number"
          placeholder="Protein (g)"
          className="w-full mb-2 md:mb-3 p-2 md:p-2.5 border rounded text-sm md:text-base"
          value={meal.protein}
          onChange={e => setMeal({ ...meal, protein: e.target.value })}
        />
        <input
          type="number"
          placeholder="Lemak (g)"
          className="w-full mb-2 md:mb-3 p-2 md:p-2.5 border rounded text-sm md:text-base"
          value={meal.fat}
          onChange={e => setMeal({ ...meal, fat: e.target.value })}
        />
        <input
          type="number"
          placeholder="Karbohidrat (g)"
          className="w-full mb-3 md:mb-3 p-2 md:p-2.5 border rounded text-sm md:text-base"
          value={meal.carbs}
          onChange={e => setMeal({ ...meal, carbs: e.target.value })}
        />
        <button className="w-full bg-green-500 text-white py-2 md:py-2.5 rounded text-base md:text-lg">Simpan</button>
      </form>
    </div>
  );
}