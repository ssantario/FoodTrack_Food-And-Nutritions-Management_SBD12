import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Profile() {
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [mealTimes, setMealTimes] = useState(["07:00", "12:00", "19:00"]);
  const [nutrition, setNutrition] = useState({ calories: 2000, protein: 60, fat: 50, carbs: 250 });
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editableProfile, setEditableProfile] = useState({ name: "", email: "" });
  const [profileUpdateStatus, setProfileUpdateStatus] = useState({ type: '', message: '' });
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editableMealTimes, setEditableMealTimes] = useState(["07:00", "12:00", "19:00"]);
  const [editableMealsPerDay, setEditableMealsPerDay] = useState(3);
  const [scheduleUpdateStatus, setScheduleUpdateStatus] = useState({ type: '', message: '' });
  const [isEditingNutrition, setIsEditingNutrition] = useState(false);
  const [editableNutrition, setEditableNutrition] = useState({ calories: 2000, protein: 60, fat: 50, carbs: 250 });
  const [nutritionUpdateStatus, setNutritionUpdateStatus] = useState({ type: '', message: '' });
  const defaultMealNames = ["Sarapan", "Makan Siang", "Makan Malam", "Snack 1", "Snack 2", "Snack 3"];
  const [editableMealNames, setEditableMealNames] = useState(defaultMealNames.slice(0, 3));
  const [mealNames, setMealNames] = useState(defaultMealNames.slice(0, 3));
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get("/api/users/profile")
      .then(res => {
        const data = res.data;
        setProfile({ name: data.name, email: data.email });
        setEditableProfile({ name: data.name, email: data.email });
        // Handle meal_schedule dynamically
        const schedule = data.meal_schedule || {};
        let mealNamesArr = [];
        let mealTimesArr = [];
        if (Object.keys(schedule).length > 0) {
          // Convert to array of [name, time], sort by time
          const sortedMeals = Object.entries(schedule)
            .filter(([_, time]) => !!time)
            .sort((a, b) => (a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0));
          mealNamesArr = sortedMeals.map(([name]) => name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
          mealTimesArr = sortedMeals.map(([_, time]) => time);
          setMealsPerDay(mealNamesArr.length);
          setMealTimes(mealTimesArr);
          setMealNames(mealNamesArr);
        } else {
          setMealsPerDay(3);
          setMealTimes(["07:00", "12:00", "19:00"]);
          setMealNames(defaultMealNames.slice(0, 3));
        }
        setNutrition(data.daily_nutrition_goals || { calories: 2000, protein: 60, fat: 50, carbs: 250 });
        setError("");
      })
      .catch(err => {
        setError("Gagal mengambil data profil. Pastikan Anda sudah login dan server berjalan.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Ensure mealTimes always matches mealsPerDay
  useEffect(() => {
    setMealTimes(prev => {
      const arr = [...prev];
      if (arr.length < mealsPerDay) {
        return arr.concat(Array(mealsPerDay - arr.length).fill(""));
      } else if (arr.length > mealsPerDay) {
        return arr.slice(0, mealsPerDay);
      }
      return arr;
    });
  }, [mealsPerDay]);

  useEffect(() => {
    setEditableMealTimes([...mealTimes]);
    setEditableMealsPerDay(mealsPerDay);
    setEditableMealNames(
      Array.from({ length: mealsPerDay }, (_, idx) => mealNames[idx] || defaultMealNames[idx] || `Meal ${idx + 1}`)
    );
  }, [mealTimes, mealsPerDay, mealNames]);

  useEffect(() => {
    setEditableNutrition({ ...nutrition });
  }, [nutrition]);

  const handleEditProfileToggle = () => {
    if (!isEditingProfile) {
      // Entering edit mode, ensure editableProfile is current with actual profile data
      setEditableProfile({ name: profile.name, email: profile.email });
    }
    setIsEditingProfile(!isEditingProfile);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setLoading(true);
    setProfileUpdateStatus({ type: '', message: '' });
    api.put("/api/users/profile", {
      name: editableProfile.name,
      email: editableProfile.email,
    })
    .then(res => {
      const updatedUserData = res.data; // API returns the full updated user object
      setProfile({ name: updatedUserData.name, email: updatedUserData.email });
      setEditableProfile({ name: updatedUserData.name, email: updatedUserData.email });
      if (updatedUserData.meal_schedule) {
        const schedule = updatedUserData.meal_schedule;
        const times = [schedule.breakfast, schedule.lunch, schedule.dinner].filter(Boolean);
        setMealsPerDay(times.length || 3);
        setMealTimes(times.length ? times : ["07:00", "12:00", "19:00"]);
      }
      if (updatedUserData.daily_nutrition_goals) {
        setNutrition(updatedUserData.daily_nutrition_goals);
      }
      setIsEditingProfile(false);
      setError("");
      setProfileUpdateStatus({ type: 'success', message: 'Profil berhasil diperbarui.' });
    })
    .catch(err => {
      console.error("Error updating profile:", err);
      setError("Gagal menyimpan perubahan profil. Periksa konsol untuk detail.");
      setProfileUpdateStatus({ type: 'error', message: 'Gagal memperbarui profil.' });
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleEditScheduleToggle = () => {
    if (!isEditingSchedule) {
      setEditableMealTimes([...mealTimes]);
      setEditableMealsPerDay(mealsPerDay);
      setEditableMealNames(
        Array.from({ length: mealsPerDay }, (_, idx) => mealNames[idx] || defaultMealNames[idx] || `Meal ${idx + 1}`)
      );
    }
    setIsEditingSchedule(!isEditingSchedule);
    setScheduleUpdateStatus({ type: '', message: '' });
  };

  const handleScheduleInputChange = (idx, value) => {
    setEditableMealTimes(prev => {
      const arr = [...prev];
      arr[idx] = value;
      return arr;
    });
  };

  const handleMealNameChange = (idx, value) => {
    setEditableMealNames(prev => {
      const arr = [...prev];
      arr[idx] = value;
      return arr;
    });
  };

  const handleMealsPerDayChange = (val) => {
    // Allow empty string for typing, but clamp only if valid
    if (val === "") {
      setEditableMealsPerDay("");
      setEditableMealTimes([]);
      setEditableMealNames([]);
      return;
    }
    const num = Number(val);
    if (!isNaN(num) && num >= 1 && num <= 6) {
      setEditableMealsPerDay(num);
      setEditableMealTimes(prev => {
        const arr = [...prev];
        if (arr.length < num) {
          return arr.concat(Array(num - arr.length).fill(""));
        } else if (arr.length > num) {
          return arr.slice(0, num);
        }
        return arr;
      });
      setEditableMealNames(prev => {
        const arr = [...prev];
        if (arr.length < num) {
          return arr.concat(
            Array.from({ length: num - arr.length }, (_, idx) => defaultMealNames[arr.length + idx] || `Meal ${arr.length + idx + 1}`)
          );
        } else if (arr.length > num) {
          return arr.slice(0, num);
        }
        return arr;
      });
    }
  };

  const handleSaveSchedule = () => {
    setLoading(true);
    setScheduleUpdateStatus({ type: '', message: '' });
    // Map editableMealTimes to meal_schedule with custom names
    const meal_schedule = {};
    for (let i = 0; i < editableMealsPerDay; i++) {
      const key = (editableMealNames[i] || `Meal${i+1}`).toLowerCase().replace(/\s+/g, '_');
      meal_schedule[key] = editableMealTimes[i];
    }
    api.put("/api/users/meal-schedule", { meal_schedule })
      .then(res => {
        setMealTimes(editableMealTimes);
        setMealsPerDay(Number(editableMealsPerDay));
        setMealNames([...editableMealNames]); // <-- update mealNames to the saved names
        setIsEditingSchedule(false);
        setScheduleUpdateStatus({ type: 'success', message: 'Jadwal makan berhasil diperbarui.' });
      })
      .catch(err => {
        setScheduleUpdateStatus({ type: 'error', message: 'Gagal memperbarui jadwal makan.' });
      })
      .finally(() => setLoading(false));
  };

  const handleEditNutritionToggle = () => {
    if (!isEditingNutrition) {
      setEditableNutrition({ ...nutrition });
    }
    setIsEditingNutrition(!isEditingNutrition);
    setNutritionUpdateStatus({ type: '', message: '' });
  };

  const handleNutritionInputChange = (e) => {
    const { name, value } = e.target;
    setEditableNutrition(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNutrition = () => {
    setLoading(true);
    setNutritionUpdateStatus({ type: '', message: '' });
    api.put('/api/users/nutrition-goals', {
      daily_nutrition_goals: {
        calories: Number(editableNutrition.calories),
        protein: Number(editableNutrition.protein),
        fat: Number(editableNutrition.fat),
        carbs: Number(editableNutrition.carbs),
      },
    })
      .then(res => {
        const updated = res.data.daily_nutrition_goals || editableNutrition;
        setNutrition(updated);
        setIsEditingNutrition(false);
        setNutritionUpdateStatus({ type: 'success', message: 'Kebutuhan nutrisi berhasil diperbarui.' });
      })
      .catch(() => {
        setNutritionUpdateStatus({ type: 'error', message: 'Gagal memperbarui kebutuhan nutrisi.' });
      })
      .finally(() => setLoading(false));
  };

  // Helper untuk validasi field penting
  const isProfileIncomplete = !profile.name || !profile.email;
  const isScheduleIncomplete = mealTimes.some(t => !t) || mealNames.some(n => !n);
  const isNutritionIncomplete =
    !nutrition.calories || !nutrition.protein || !nutrition.fat || !nutrition.carbs;

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-altGreen p-3 md:p-10 flex justify-center items-center">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-3 md:p-8 border border-gray-200/80 flex flex-col gap-4 md:gap-8">
        {/* Tombol Dashboard Responsive */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-main text-white font-semibold shadow hover:bg-secondary transition-colors duration-200 text-sm md:text-base"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
            </svg>
            <span className="hidden sm:inline">Kembali ke Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </button>
        </div>
        {/* Peringatan jika ada data penting yang belum diisi */}
        {(isProfileIncomplete || isScheduleIncomplete || isNutritionIncomplete) && (
          <div className="mb-4 p-4 rounded-lg bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <b>Perhatian:</b> Ada informasi penting yang belum lengkap. Silakan lengkapi profil, jadwal makan, dan kebutuhan nutrisi Anda!
            </span>
          </div>
        )}
        <div className="flex flex-col gap-4 md:gap-8">
          {/* Card: Informasi Pribadi */}
          <div className={`bg-white rounded-2xl shadow-lg p-4 md:p-8 flex flex-col md:flex-row items-start gap-4 md:gap-6
            ${isProfileIncomplete ? "border-2 border-yellow-400" : ""}`}>
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-altGreen flex items-center justify-center">
                <svg className="w-8 h-8 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-main">Informasi Pribadi</h2>
                  {isProfileIncomplete && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 text-xs font-semibold">
                      Wajib diisi
                    </span>
                  )}
                </div>
                {!isEditingProfile ? (
                  <button
                    onClick={handleEditProfileToggle}
                    className="bg-main text-white px-3 py-1 rounded-md hover:bg-secondary text-sm shadow transition-colors ease-in-out duration-200"
                    disabled={loading}
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-altGreen text-black px-3 py-1 rounded-md hover:bg-altGreen/50 text-sm shadow transition-colors ease-in-out duration-200"
                      disabled={loading}
                    >
                      {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                      onClick={handleEditProfileToggle}
                      className="bg-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-400 text-sm shadow transition-colors ease-in-out duration-200"
                      disabled={loading}
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
              {profileUpdateStatus.message && (
                <div className={`mb-2 text-sm font-medium ${profileUpdateStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {profileUpdateStatus.message}
                </div>
              )}
              {isEditingProfile ? (
                <div className="mt-2 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-main mb-1">Nama:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editableProfile.name}
                      onChange={handleProfileInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-main focus:border-main bg-backdrop text-main text-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-main mb-1">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editableProfile.email}
                      onChange={handleProfileInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-main focus:border-main bg-backdrop text-main text-sm"
                      disabled={loading}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-sm">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold text-main w-20 mr-2">Nama:</span>
                    <span className={profile.name ? "text-gray-700" : "italic text-red-500"}>
                      {profile.name || "Belum diisi"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-main w-20 mr-2">Email:</span>
                    <span className={profile.email ? "text-gray-700" : "italic text-red-500"}>
                      {profile.email || "Belum diisi"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card: Jadwal Makan */}
          <div className={`bg-white rounded-2xl shadow-lg p-4 md:p-8 flex flex-col md:flex-row items-start gap-4 md:gap-6
            ${isScheduleIncomplete ? "border-2 border-yellow-400" : ""}`}>
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-altGreen flex items-center justify-center">
                <svg className="w-8 h-8 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-main">Jadwal Makan</h2>
                  {isScheduleIncomplete && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 text-xs font-semibold">
                      Wajib diisi
                    </span>
                  )}
                </div>
                {!isEditingSchedule ? (
                  <button
                    onClick={handleEditScheduleToggle}
                    className="bg-main text-white px-3 py-1 rounded-md hover:bg-secondary text-sm shadow transition-colors duration-200"
                    disabled={loading}
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveSchedule}
                      className="bg-altGreen text-black px-3 py-1 rounded-md hover:bg-altGreen/50 text-sm shadow transition-colors duration-200"
                      disabled={loading}
                    >
                      {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                      onClick={handleEditScheduleToggle}
                      className="bg-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-400 text-sm shadow transition-colors duration-200"
                      disabled={loading}
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
              {scheduleUpdateStatus.message && (
                <div className={`mb-2 text-sm font-medium ${scheduleUpdateStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {scheduleUpdateStatus.message}
                </div>
              )}
              <div className="flex items-center mb-2">
                <label className="mr-2 font-medium text-main">Jumlah makan per hari:</label>
                {isEditingSchedule ? (
                  <input
                    type="number"
                    min={1}
                    max={6}
                    className="w-16 p-1 border rounded focus:ring-2 focus:ring-main focus:border-main bg-backdrop text-main"
                    value={editableMealsPerDay}
                    onChange={e => handleMealsPerDayChange(e.target.value)}
                    disabled={loading}
                    placeholder="Contoh: 3"
                  />
                ) : (
                  <input
                    type="number"
                    min={1}
                    max={6}
                    className="w-16 p-1 border rounded bg-backdrop text-main cursor-not-allowed"
                    value={mealsPerDay}
                    readOnly
                    tabIndex={-1}
                    style={{ pointerEvents: 'none' }}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {isEditingSchedule ? (
                  Array.from({ length: Number(editableMealsPerDay) || 0 }).map((_, idx) => (
                    <div key={idx} className="flex flex-col items-start">
                      <input
                        type="text"
                        className={`mb-1 px-2 py-1 border rounded text-xs font-medium text-main bg-backdrop focus:ring-2 focus:ring-main focus:border-main
                          ${!editableMealNames[idx] ? "border-red-400 bg-yellow-50" : ""}`}
                        value={editableMealNames[idx] || ""}
                        onChange={e => handleMealNameChange(idx, e.target.value)}
                        placeholder={`Nama Makan ${idx+1} (cth: Sarapan)`}
                        disabled={loading}
                      />
                      <input
                        type="time"
                        className={`p-1 border rounded focus:ring-2 focus:ring-main focus:border-main bg-backdrop text-main
                          ${!editableMealTimes[idx] ? "border-red-400 bg-yellow-50" : ""}`}
                        value={editableMealTimes[idx] || ""}
                        onChange={e => handleScheduleInputChange(idx, e.target.value)}
                        disabled={loading}
                        placeholder="Jam (cth: 07:00)"
                      />
                      {(!editableMealNames[idx] || !editableMealTimes[idx]) && (
                        <span className="text-xs text-red-500 mt-1">Wajib diisi</span>
                      )}
                    </div>
                  ))
                ) : (
                  Array.from({ length: mealsPerDay }).map((_, idx) => (
                    <div key={idx} className="flex flex-col items-start">
                      <span className={`text-xs font-medium mb-1
                        ${!mealNames[idx] ? "text-red-500" : "text-main"}`}>
                        {mealNames[idx] || "Belum diisi"}
                      </span>
                      <input
                        type="time"
                        className={`p-1 border rounded bg-backdrop text-main cursor-not-allowed
                          ${!mealTimes[idx] ? "border-red-400 bg-yellow-50" : ""}`}
                        value={mealTimes[idx] || ""}
                        readOnly
                        tabIndex={-1}
                        style={{ pointerEvents: 'none' }}
                      />
                      {!mealTimes[idx] && (
                        <span className="text-xs text-red-500 mt-1">Wajib diisi</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Card: Kebutuhan Nutrisi */}
          <div className={`bg-white rounded-2xl shadow-lg p-4 md:p-8 flex flex-col md:flex-row items-start gap-4 md:gap-6
            ${isNutritionIncomplete ? "border-2 border-yellow-400" : ""}`}>
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-altGreen flex items-center justify-center">
                <svg className="w-8 h-8 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3 0 1.306.835 2.417 2 2.83V17a1 1 0 102 0v-3.17c1.165-.413 2-1.524 2-2.83 0-1.657-1.343-3-3-3z" /></svg>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-main">Kebutuhan Nutrisi</h2>
                  {isNutritionIncomplete && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 text-xs font-semibold">
                      Wajib diisi
                    </span>
                  )}
                </div>
                {!isEditingNutrition ? (
                  <button
                    onClick={handleEditNutritionToggle}
                    className="bg-main text-white px-3 py-1 rounded-md hover:bg-secondary text-sm shadow transition-colors duration-200"
                    disabled={loading}
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNutrition}
                      className="bg-altGreen text-black px-3 py-1 rounded-md hover:bg-altGreen/50 text-sm shadow transition-colors duration-200"
                      disabled={loading}
                    >
                      {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                      onClick={handleEditNutritionToggle}
                      className="bg-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-400 text-sm shadow transition-colors duration-200"
                      disabled={loading}
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
              {nutritionUpdateStatus.message && (
                <div className={`mb-2 text-sm font-medium ${nutritionUpdateStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {nutritionUpdateStatus.message}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-main mb-1">Kalori</label>
                  {isEditingNutrition ? (
                    <input
                      type="number"
                      name="calories"
                      placeholder="cth: 2000"
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-main focus:border-main bg-backdrop text-main
                        ${!editableNutrition.calories ? "border-red-400 bg-yellow-50" : ""}`}
                      value={editableNutrition.calories}
                      onChange={handleNutritionInputChange}
                      disabled={loading}
                    />
                  ) : (
                    <input
                      type="number"
                      className={`w-full p-2 border rounded bg-backdrop text-main cursor-not-allowed
                        ${!nutrition.calories ? "border-red-400 bg-yellow-50" : ""}`}
                      value={nutrition.calories}
                      readOnly
                      tabIndex={-1}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  {!nutrition.calories && !isEditingNutrition && (
                    <span className="text-xs text-red-500 mt-1">Wajib diisi</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-main mb-1">Protein (g)</label>
                  {isEditingNutrition ? (
                    <input
                      type="number"
                      name="protein"
                      placeholder="cth: 60"
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-main focus:border-main bg-backdrop text-main
                        ${!editableNutrition.protein ? "border-red-400 bg-yellow-50" : ""}`}
                      value={editableNutrition.protein}
                      onChange={handleNutritionInputChange}
                      disabled={loading}
                    />
                  ) : (
                    <input
                      type="number"
                      className={`w-full p-2 border rounded bg-backdrop text-main cursor-not-allowed
                        ${!nutrition.protein ? "border-red-400 bg-yellow-50" : ""}`}
                      value={nutrition.protein}
                      readOnly
                      tabIndex={-1}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  {!nutrition.protein && !isEditingNutrition && (
                    <span className="text-xs text-red-500 mt-1">Wajib diisi</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-main mb-1">Lemak (g)</label>
                  {isEditingNutrition ? (
                    <input
                      type="number"
                      name="fat"
                      placeholder="cth: 50"
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-main focus:border-main bg-backdrop text-main
                        ${!editableNutrition.fat ? "border-red-400 bg-yellow-50" : ""}`}
                      value={editableNutrition.fat}
                      onChange={handleNutritionInputChange}
                      disabled={loading}
                    />
                  ) : (
                    <input
                      type="number"
                      className={`w-full p-2 border rounded bg-backdrop text-main cursor-not-allowed
                        ${!nutrition.fat ? "border-red-400 bg-yellow-50" : ""}`}
                      value={nutrition.fat}
                      readOnly
                      tabIndex={-1}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  {!nutrition.fat && !isEditingNutrition && (
                    <span className="text-xs text-red-500 mt-1">Wajib diisi</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-main mb-1">Karbohidrat (g)</label>
                  {isEditingNutrition ? (
                    <input
                      type="number"
                      name="carbs"
                      placeholder="cth: 250"
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-main focus:border-main bg-backdrop text-main
                        ${!editableNutrition.carbs ? "border-red-400 bg-yellow-50" : ""}`}
                      value={editableNutrition.carbs}
                      onChange={handleNutritionInputChange}
                      disabled={loading}
                    />
                  ) : (
                    <input
                      type="number"
                      className={`w-full p-2 border rounded bg-backdrop text-main cursor-not-allowed
                        ${!nutrition.carbs ? "border-red-400 bg-yellow-50" : ""}`}
                      value={nutrition.carbs}
                      readOnly
                      tabIndex={-1}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  {!nutrition.carbs && !isEditingNutrition && (
                    <span className="text-xs text-red-500 mt-1">Wajib diisi</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
}