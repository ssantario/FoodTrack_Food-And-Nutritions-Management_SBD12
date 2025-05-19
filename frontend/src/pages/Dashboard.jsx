import { Link, useLocation } from "react-router-dom";

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
  const navItems = [
    { path: "/", label: "Home", icon: <IconHome /> },
    { path: "/dashboard", label: "Dashboard", icon: <IconChartBar className="w-5 h-5 mr-2" /> },
    { path: "/meal-register", label: "Catat Makan", icon: <IconPlusCircle className="w-5 h-5 mr-2" /> },
    { path: "/history", label: "Riwayat", icon: <IconClipboardList className="w-5 h-5 mr-2" /> },
    { path: "/profile", label: "Profil", icon: <IconUserCircle /> }, // Contoh link profil
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
            </div>
          </div>
          {/* Tambahkan tombol menu mobile jika diperlukan */}
        </div>
      </div>
    </nav>
  );
};


export default function Dashboard() {
  const dailyCalories = 1850;
  const targetCalories = 2200;
  const calorieProgress = Math.min((dailyCalories / targetCalories) * 100, 100);

  const nutrition = {
    protein: { current: 60, target: 70 },
    fat: { current: 50, target: 60 },
    carbs: { current: 200, target: 250 },
  };

  const mealLog = { eaten: 3, total: 4 };

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] p-6 md:p-10">
        <header className="mt-8 mb-12 text-center md:text-left"> {/* Tambah mt-8 untuk spasi dari navbar */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#2f7d6f] tracking-tight">Dashboard Nutrisi Anda</h1>
          <p className="text-slate-600 mt-3 text-lg md:text-xl">
            Selamat datang kembali! Pantau progres nutrisi harian Anda dengan mudah.
          </p>
        </header>

        <div className="mb-12 flex justify-center md:justify-start">
          <Link to="/meal-register">
            <button
              className="bg-gradient-to-r from-[#41897c] to-[#5ab8a5] text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center text-lg focus:outline-none focus:ring-2 focus:ring-[#5ab8a5] focus:ring-opacity-50"
            >
              <IconPlusCircle />
              Catat Makanan Baru
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <p className="text-5xl font-bold text-[#41897c] mb-3">{dailyCalories} <span className="text-3xl text-slate-600">kcal</span></p>
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

        {/* Section Tips Nutrisi (tanpa grafik) */}
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-xl border border-gray-200/80">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">💡 Tips Nutrisi Hari Ini</h3>
          <div>
            <p className="text-slate-600 leading-relaxed text-md">
              Pastikan untuk minum setidaknya 8 gelas air hari ini untuk menjaga hidrasi optimal.
              Variasikan juga sumber protein Anda, coba tambahkan ikan atau kacang-kacangan dalam menu!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
