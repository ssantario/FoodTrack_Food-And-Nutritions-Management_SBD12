import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import foodLogo from "../assets/apple-svgrepo-com.svg";
import foodLogoWhite from "../assets/appleWhite.svg"

// Ikon SVG tetap sama, bisa disesuaikan jika perlu
const IconFire = () => <svg className="w-8 h-8 text-[#2f7d6f]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A7.987 7.987 0 0117.657 18.657zM9 17a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const IconChartBar = () => <svg className="w-8 h-8 text-[#2f7d6f]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>;
const IconClipboardList = () => <svg className="w-8 h-8 text-[#2f7d6f]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const IconPlusCircle = () => <svg className="w-6 h-6 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const IconHome = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const IconUserCircle = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;


// Komponen Navbar Sederhana
const AppNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home", icon: <IconHome /> },
    { path: "/dashboard", label: "Dashboard", icon: <IconChartBar className="w-5 h-5 mr-2" /> },
    { path: "/food-list", label: "Daftar Makanan", icon: <img src={foodLogoWhite} alt="Daftar Makanan" className="w-5 h-5 mr-2" /> },
    { path: "/history", label: "Riwayat", icon: <IconClipboardList className="w-5 h-5 mr-2" /> },
    { path: "/profile", label: "Profil", icon: <IconUserCircle /> },
  ];

  return (
    <nav className="bg-[#41897c] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#a9d3b4] flex items-center justify-center font-bold text-xl text-[#41897c] shadow-sm">
                FT
              </div>
              <span className="text-white text-xl font-semibold ml-3">FoodTrack</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                    ${location.pathname === item.path 
                      ? 'bg-[#a9d3b4] text-[#2f7d6f]' 
                      : 'text-gray-300 hover:bg-[#356e62] hover:text-white'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 ml-4 transition-colors duration-150"
              >
                Logout
              </button>
            </div>
          </div>
          {/* Tambahkan tombol menu mobile jika diperlukan */}
        </div>
      </div>
    </nav>
  );
};


export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [mealsToday, setMealsToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile and today's meals
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, mealsRes] = await Promise.all([
          api.get("/api/users/profile"),
          api.get("/api/meals"),
        ]);
        setProfile(profileRes.data);
        // Filter meals for today only
        const today = new Date().toISOString().slice(0, 10);
        setMealsToday(
          (mealsRes.data || []).filter(m => m.meal_time && m.meal_time.slice(0, 10) === today)
        );
      } catch (err) {
        setError("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate summary
  let totalCalories = 0, totalProtein = 0, totalFat = 0, totalCarbs = 0;
  if (mealsToday.length > 0) {
    mealsToday.forEach(meal => {
      if (Array.isArray(meal.food_items)) {
        meal.food_items.forEach(item => {
          totalCalories += Number(item.calories) * Number(item.quantity);
          totalProtein += Number(item.protein) * Number(item.quantity);
          totalFat += Number(item.fat) * Number(item.quantity);
          totalCarbs += Number(item.carbs) * Number(item.quantity);
        });
      }
    });
  }

  // Get targets from profile
  const targetCalories = profile?.daily_nutrition_goals?.calories || 2000;
  const targetProtein = profile?.daily_nutrition_goals?.protein || 60;
  const targetFat = profile?.daily_nutrition_goals?.fat || 50;
  const targetCarbs = profile?.daily_nutrition_goals?.carbs || 250;
  const mealSchedule = profile?.meal_schedule || {};
  const totalMealsTarget = Object.keys(mealSchedule).length || 3;
  const mealNames = Object.keys(mealSchedule).map(k => k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

  // Progress
  const calorieProgress = Math.min((totalCalories / targetCalories) * 100, 100);
  const nutrition = {
    protein: { current: totalProtein, target: targetProtein },
    fat: { current: totalFat, target: targetFat },
    carbs: { current: totalCarbs, target: targetCarbs },
  };
  const mealLog = { eaten: mealsToday.length, total: totalMealsTarget };

  // Calculate daily score
  let score = 0;
  if (totalCalories >= targetCalories * 0.95 && totalCalories <= targetCalories * 1.05) score++;
  if (
    (totalProtein >= targetProtein * 0.95 && totalProtein <= targetProtein * 1.05) ||
    (totalFat >= targetFat * 0.95 && totalFat <= targetFat * 1.05) ||
    (totalCarbs >= targetCarbs * 0.95 && totalCarbs <= targetCarbs * 1.05)
  ) score++;
  if (
    (totalProtein >= targetProtein * 0.95 && totalProtein <= targetProtein * 1.05) &&
    (totalFat >= targetFat * 0.95 && totalFat <= targetFat * 1.05) &&
    (totalCarbs >= targetCarbs * 0.95 && totalCarbs <= targetCarbs * 1.05)
  ) score++;
  // Score label
  let scoreLabel = "Decent", scoreColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
  if (score === 2) { scoreLabel = "Good"; scoreColor = "bg-blue-100 text-blue-800 border-blue-300"; }
  if (score === 3) { scoreLabel = "Perfect"; scoreColor = "bg-green-100 text-green-800 border-green-300"; }

  const nutritionTips = [
    "Pastikan untuk minum setidaknya 8 gelas air hari ini untuk menjaga hidrasi optimal.",
    "Variasikan sumber protein Anda, coba tambahkan ikan atau kacang-kacangan dalam menu!",
    "Konsumsi sayuran berwarna-warni setiap hari untuk asupan vitamin dan mineral yang beragam.",
    "Batasi konsumsi gula tambahan dan pilih camilan sehat seperti buah segar.",
    "Jangan lewatkan sarapan untuk menjaga energi sepanjang hari.",
    "Pilih karbohidrat kompleks seperti nasi merah atau roti gandum untuk rasa kenyang lebih lama.",
    "Perhatikan porsi makan, gunakan piring yang lebih kecil untuk membantu mengontrol asupan.",
    "Konsumsi lemak sehat dari alpukat, kacang, dan minyak zaitun.",
    "Hindari minuman bersoda dan pilih air putih atau infused water.",
    "Cobalah makan secara perlahan dan nikmati setiap suapan untuk membantu pencernaan.",
    "Kalo makan disuapin ahmad pasti jadi lebh enak",
    "Jika Anda ingin besar seperti Azka Nabihan makanlah ayam banyak-banyak dan jangan lupa untuk berolahraga.",
  ];

  const [randomTip, setRandomTip] = useState("");

  useEffect(() => {
    const idx = Math.floor(Math.random() * nutritionTips.length);
    setRandomTip(nutritionTips[idx]);
  }, []);

  // Replace static values with dynamic ones
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] p-3 md:p-10">
        <header className="mt-6 md:mt-8 mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2f7d6f] tracking-tight">Dashboard Nutrisi Anda</h1>
          <p className="text-slate-600 mt-2 md:mt-3 text-base md:text-xl">
            Selamat datang kembali! Pantau progres nutrisi harian Anda dengan mudah.
          </p>
        </header>
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row justify-center md:justify-start gap-3 md:gap-0">
          <Link to="/food-list">
            <button
              className="bg-gradient-to-r from-[#41897c] to-[#5ab8a5] text-white font-semibold px-5 md:px-7 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#5ab8a5] focus:ring-opacity-50"
            >
              <img src={foodLogoWhite} alt="Catat Makanan" className="w-6 h-6 md:w-7 md:h-7 mr-2.5" />
              Catat Makanan Baru
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {/* Card Kalori Hari Ini */}
          <div className="bg-white p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/80 transform hover:scale-[1.02]">
            <div className="flex items-center mb-5">
              <div className="p-3.5 rounded-full bg-[#e0f2f1] mr-4">
                <IconFire />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">Kalori Hari Ini</h2>
                <p className="text-md text-slate-500">Target: {targetCalories} kcal</p>
              </div>
            </div>
            <p className="text-5xl font-bold text-[#41897c] mb-3">{totalCalories} <span className="text-3xl text-slate-600">kcal</span></p>
            <div className="w-full bg-gray-200 rounded-full h-3.5">
              <div
                className="bg-gradient-to-r from-[#66bb6a] to-[#43a047] h-3.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${calorieProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-500 mt-2 text-right">{Math.round(calorieProgress)}% tercapai</p>
          </div>

          {/* Card Nutrisi */}
          <div className="bg-white p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/80 transform hover:scale-[1.02]">
            <div className="flex items-center mb-5">
              <div className="p-3.5 rounded-full bg-[#e0f2f1] mr-4">
                <IconChartBar />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800">Ringkasan Nutrisi</h2>
            </div>
            <ul className="space-y-4">
              {Object.entries(nutrition).map(([key, val]) => {
                const progress = Math.min((val.current / val.target) * 100, 100);
                return (
                  <li key={key} className="text-slate-700">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="capitalize font-medium text-md">{key}</span>
                      <span className="text-sm text-slate-500">{val.current}g / {val.target}g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-[#a9d3b4] to-[#8bc34a] h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Card Log Makan */}
          <div className="bg-white p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/80 transform hover:scale-[1.02]">
            <div className="flex items-center mb-5">
              <div className="p-3.5 rounded-full bg-[#e0f2f1] mr-4">
                <IconClipboardList />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800">Log Makan</h2>
            </div>
            <p className="text-4xl font-bold text-[#41897c]">{mealLog.eaten} <span className="text-2xl text-slate-600">/ {mealLog.total} kali makan</span></p>
            <p className="text-slate-600 mt-3 text-md">
              {mealLog.eaten === mealLog.total ? "Semua jadwal makan sudah tercatat! 🎉" : `Sisa ${mealLog.total - mealLog.eaten} kali makan lagi.`}
            </p>
            <Link to="/history">
              <button
                className="mt-5 w-full bg-gradient-to-r from-[#a9d3b4] to-[#8bc34a] text-white font-semibold py-3 px-4 rounded-lg hover:from-[#8bc34a] hover:to-[#a9d3b4] transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#8bc34a] focus:ring-opacity-50"
              >
                Lihat Detail Log
              </button>
            </Link>
          </div>
        </div>

        {/* Overall Score Section
        <div className="mt-10 flex justify-center">
          <div className={`w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl border-4 font-bold flex flex-col items-center justify-center ${scoreColor} ring-4 ring-main/20 transition-all duration-300`}>  
            <div className="flex items-center gap-4 mb-4">
              <svg className="w-12 h-12 text-yellow-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.77 7.82 20 9 12.91l-5-3.64 5.91-.01z"/></svg>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-0">Skor Nutrisi Hari Ini</h2>
            </div>
            <div className="text-7xl md:text-8xl mb-2 font-extrabold tracking-tight">{score}/3</div>
            <div className="text-2xl md:text-3xl mb-3 font-bold">{scoreLabel}</div>
            <div className="text-lg md:text-xl font-normal text-slate-700 text-center">
              {score === 3 && "Selamat! Semua target nutrisi harian tercapai."}
              {score === 2 && "Bagus! Hampir semua target nutrisi harian tercapai."}
              {score === 1 && "Cukup. Masih ada target nutrisi yang belum tercapai."}
              {score === 0 && "Belum ada target nutrisi yang tercapai hari ini."}
            </div>
          </div>
        </div> */}

        {/* Section Tips Nutrisi (tanpa grafik) */}
        <div className="mt-8 md:mt-12 bg-white p-4 md:p-8 rounded-2xl shadow-xl border border-gray-200/80">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-3 md:mb-4">💡 Tips Nutrisi</h3>
          <div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-md">
              {randomTip}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
