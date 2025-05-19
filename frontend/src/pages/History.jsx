import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function History() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [foods, setFoods] = useState([]);
  const [createData, setCreateData] = useState({
    meal_type: "",
    meal_time: new Date().toISOString().slice(0, 16),
    food_items: [], // [{ food_id, quantity }]
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);
  const [deleteMealId, setDeleteMealId] = useState(null);
  const [deleteMealLoading, setDeleteMealLoading] = useState(false);
  const [deleteMealError, setDeleteMealError] = useState(null);
  const [profileMeals, setProfileMeals] = useState([]);
  const navigate = useNavigate();

  // Helper to fetch meals (so we can call it after create/delete)
  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/meals");
      setMeals(res.data);
    } catch (err) {
      setError("Gagal memuat riwayat makan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // Fetch foods and meal names for meal creation
  useEffect(() => {
    async function fetchFoodsAndProfile() {
      try {
        const [foodsRes, profileRes] = await Promise.all([
          api.get("/api/foods"),
          api.get("/api/users/profile"),
        ]);
        setFoods(foodsRes.data);
        // Extract meal names from profile
        const schedule = profileRes.data.meal_schedule || {};
        const sorted = Object.entries(schedule)
          .filter(([_, time]) => !!time)
          .sort((a, b) => (a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0));
        setProfileMeals(sorted.map(([name]) => name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())));
      } catch (err) {
        // fallback: no foods or meal names
      }
    }
    fetchFoodsAndProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f5e9] to-[#c8e6c9] p-3 md:p-10 flex flex-col items-center">
      <button
        onClick={() => navigate("/dashboard")}
        className="fixed top-5 left-5 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-main flex items-center justify-center shadow-lg hover:bg-secondary focus:bg-secondary transition-colors duration-200 outline-none focus:ring-4 focus:ring-main/30 group"
        aria-label="Home"
      >
        <svg className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
      </button>
      <div className="w-full max-w-2xl mt-8">
        <div className="flex justify-end mb-4">
          <button
            className="bg-main hover:bg-secondary text-white px-4 py-2 rounded font-semibold shadow transition"
            onClick={() => {
              setShowCreateModal(true);
              setCreateData({
                meal_type: profileMeals[0] || "",
                meal_time: new Date().toISOString().slice(0, 16),
                food_items: [],
              });
              setCreateError(null);
              setCreateSuccess(null);
            }}
          >
            + Tambah Riwayat Makan
          </button>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4 text-main text-center drop-shadow-sm">Riwayat Makan</h1>
        <p className="text-slate-600 text-center mb-6 md:mb-8 text-base md:text-lg">Lihat makanan yang sudah kamu konsumsi beserta detail nutrisinya.</p>
        {/* Feedback notification for meal creation */}
        {(createSuccess || createError) && (
          <div className={`mb-4 text-center px-4 py-2 rounded font-semibold shadow transition-all duration-300 ${createSuccess ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
            {createSuccess || createError}
          </div>
        )}
        {loading ? (
          <div className="text-base md:text-lg text-gray-600 mt-8">Memuat riwayat makan...</div>
        ) : error ? (
          <div className="text-red-500 mt-8">{error}</div>
        ) : meals.length === 0 ? (
          <div className="text-slate-500 text-center mt-8">Belum ada riwayat makan.</div>
        ) : (
          <div className="flex flex-col gap-5">
            {meals.map((meal) => (
              <div key={meal.id} className="bg-white/90 rounded-xl shadow-lg p-4 border border-main/10 flex flex-col gap-2 transition hover:shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <div className="font-semibold text-main text-lg">{meal.meal_type || "Makan"}</div>
                  <div className="text-slate-500 text-sm">{new Date(meal.meal_time).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</div>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-slate-700">Makanan:</span>
                  <ul className="list-disc ml-6 mt-1 text-sm">
                    {Array.isArray(meal.food_items) && meal.food_items[0] !== null ? meal.food_items.map((item, idx) => (
                      <li key={idx} className="mb-1">
                        <span className="font-semibold text-main">{item.name}</span> x{item.quantity} &mdash; 
                        <span className="text-slate-700">{item.calories} kalori</span>
                        {item.protein !== undefined && (
                          <span>, {item.protein}g protein</span>
                        )}
                        {item.fat !== undefined && (
                          <span>, {item.fat}g lemak</span>
                        )}
                        {item.carbs !== undefined && (
                          <span>, {item.carbs}g karbo</span>
                        )}
                      </li>
                    )) : <li className="text-slate-400 italic">Tidak ada makanan tercatat</li>}
                  </ul>
                </div>
                {/* Nutrition summary for this meal */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mt-2">
                  <span className="bg-main/10 rounded px-2 py-1">Total Kalori: <span className="font-semibold text-main">{Array.isArray(meal.food_items) && meal.food_items[0] !== null ? meal.food_items.reduce((sum, i) => sum + (Number(i.calories) * Number(i.quantity)), 0) : 0}</span></span>
                  <span className="bg-main/10 rounded px-2 py-1">Protein: <span className="font-semibold text-main">{Array.isArray(meal.food_items) && meal.food_items[0] !== null ? meal.food_items.reduce((sum, i) => sum + (Number(i.protein) * Number(i.quantity)), 0) : 0}g</span></span>
                  <span className="bg-main/10 rounded px-2 py-1">Lemak: <span className="font-semibold text-main">{Array.isArray(meal.food_items) && meal.food_items[0] !== null ? meal.food_items.reduce((sum, i) => sum + (Number(i.fat) * Number(i.quantity)), 0) : 0}g</span></span>
                  <span className="bg-main/10 rounded px-2 py-1">Karbo: <span className="font-semibold text-main">{Array.isArray(meal.food_items) && meal.food_items[0] !== null ? meal.food_items.reduce((sum, i) => sum + (Number(i.carbs) * Number(i.quantity)), 0) : 0}g</span></span>
                </div>
                <div className="flex flex-row-reverse gap-2 mt-2">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold shadow transition"
                    onClick={() => {
                      setDeleteMealId(meal.id);
                      setDeleteMealError(null);
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Create Meal Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-lg border border-main/20 animate-fade-in">
              <h3 className="text-lg font-semibold text-main mb-2">Tambah Riwayat Makan</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setCreateLoading(true);
                  setCreateError(null);
                  setCreateSuccess(null);
                  try {
                    // Prepare food_items: only those with quantity > 0
                    const food_items = createData.food_items.filter(f => f.quantity > 0).map(f => ({ food_id: f.food_id, quantity: Number(f.quantity) }));
                    if (!createData.meal_type || !createData.meal_time || food_items.length === 0) {
                      setCreateError("Isi semua data dan pilih minimal satu makanan.");
                      setCreateLoading(false);
                      return;
                    }
                    await api.post("/api/meals", {
                      meal_type: createData.meal_type,
                      meal_time: new Date(createData.meal_time).toISOString(),
                      food_items,
                    });
                    setCreateSuccess("Riwayat makan berhasil ditambahkan!");
                    setShowCreateModal(false);
                    await fetchMeals(); // Refresh meals after adding
                  } catch (err) {
                    setCreateError("Gagal menambah riwayat makan.");
                  } finally {
                    setCreateLoading(false);
                    setTimeout(() => {
                      setCreateSuccess(null);
                      setCreateError(null);
                    }, 2500);
                  }
                }}
                className="flex flex-col gap-3"
              >
                <label className="font-medium text-main">Jenis Makan</label>
                <select
                  className="border rounded px-2 py-2"
                  value={createData.meal_type}
                  onChange={e => setCreateData(d => ({ ...d, meal_type: e.target.value }))}
                  required
                >
                  <option value="">Pilih Jenis Makan</option>
                  {profileMeals.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
                <label className="font-medium text-main">Waktu Makan</label>
                <input
                  type="datetime-local"
                  className="border rounded px-2 py-2"
                  value={createData.meal_time}
                  onChange={e => setCreateData(d => ({ ...d, meal_time: e.target.value }))}
                  required
                />
                <label className="font-medium text-main">Pilih Makanan & Jumlah</label>
                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-main/5">
                  {foods.length === 0 ? (
                    <div className="text-slate-400 italic">Tidak ada makanan tersedia.</div>
                  ) : foods.map(food => {
                    const selected = createData.food_items.find(f => f.food_id === food.id) || { food_id: food.id, quantity: 0 };
                    return (
                      <div key={food.id} className="flex items-center gap-2 mb-2">
                        <span className="flex-1 text-main font-medium">{food.name}</span>
                        <input
                          type="number"
                          min={0}
                          className="w-20 border rounded px-2 py-1"
                          value={selected.quantity}
                          onChange={e => {
                            const qty = Number(e.target.value);
                            setCreateData(d => ({
                              ...d,
                              food_items: [
                                ...d.food_items.filter(f => f.food_id !== food.id),
                                ...(qty > 0 ? [{ food_id: food.id, quantity: qty }] : [])
                              ]
                            }));
                          }}
                          placeholder="Jumlah"
                        />
                        <span className="text-xs text-slate-500">kalori: {food.calories}</span>
                      </div>
                    );
                  })}
                </div>
                {createError && <div className="text-red-500 text-sm mt-1">{createError}</div>}
                {createSuccess && <div className="text-green-600 text-sm mt-1">{createSuccess}</div>}
                <div className="flex gap-3 justify-end mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                    onClick={() => setShowCreateModal(false)}
                    disabled={createLoading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-main text-white font-semibold hover:bg-secondary transition disabled:opacity-60"
                    disabled={createLoading}
                  >
                    {createLoading ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Meal Modal */}
        {deleteMealId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-sm border border-main/20 animate-fade-in">
              <h3 className="text-lg font-semibold text-main mb-2">Konfirmasi Hapus Riwayat Makan</h3>
              <p className="mb-4 text-slate-700">Yakin ingin menghapus riwayat makan ini?</p>
              {deleteMealError && <div className="text-red-500 text-sm mb-2">{deleteMealError}</div>}
              <div className="flex gap-3 justify-end">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                  onClick={() => setDeleteMealId(null)}
                  disabled={deleteMealLoading}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:opacity-60"
                  onClick={async () => {
                    setDeleteMealLoading(true);
                    setDeleteMealError(null);
                    try {
                      await api.delete(`/api/meals/${deleteMealId}`);
                      setDeleteMealId(null);
                      await fetchMeals(); // Refresh meals after delete
                    } catch (err) {
                      setDeleteMealError("Gagal menghapus riwayat makan.");
                    } finally {
                      setDeleteMealLoading(false);
                    }
                  }}
                  disabled={deleteMealLoading}
                >
                  {deleteMealLoading ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
