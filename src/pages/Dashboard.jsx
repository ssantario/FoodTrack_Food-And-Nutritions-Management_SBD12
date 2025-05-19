import { Link } from "react-router-dom"; // Jika ada navigasi ke halaman lain dari dashboard

// Contoh ikon sederhana (bisa diganti dengan SVG atau library ikon)
const IconFire = () => <svg className="w-8 h-8 text-[#41897c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A7.987 7.987 0 0117.657 18.657zM9 17a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const IconChartBar = () => <svg className="w-8 h-8 text-[#41897c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>;
const IconClipboardList = () => <svg className="w-8 h-8 text-[#41897c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const IconPlusCircle = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;


export default function Dashboard() {
  // Data dummy, ganti dengan data asli dari state/API
  const dailyCalories = 1850;
  const targetCalories = 2200;
  const calorieProgress = (dailyCalories / targetCalories) * 100;

  const nutrition = {
    protein: { current: 60, target: 70 },
    fat: { current: 50, target: 60 },
    carbs: { current: 200, target: 250 },
  };

  const mealLog = { eaten: 3, total: 4 };

  return (
    <div className="min-h-screen bg-[#f9fae6] p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[#41897c] tracking-tight">Dashboard Pengguna</h1>
        <p className="text-slate-600 mt-1">Selamat datang kembali! Mari lihat progres nutrisimu hari ini.</p>
      </header>

      {/* Tombol Aksi Cepat */}
      <div className="mb-8">
        <Link to="/meal-register">
          <button className="bg-[#41897c] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#356e62] transition-colors duration-300 flex items-center">
            <IconPlusCircle />
            Catat Makanan Baru
          </button>
        </Link>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Card Kalori Hari Ini */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-[#cbe7c4] mr-4">
              <IconFire />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Kalori Hari Ini</h2>
              <p className="text-sm text-slate-500">Target: {targetCalories} kcal</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-[#41897c] mb-2">{dailyCalories} <span className="text-2xl text-slate-600">kcal</span></p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-[#a9d3b4] h-2.5 rounded-full" style={{ width: `${calorieProgress}%` }}></div>
          </div>
           <p className="text-xs text-slate-500 mt-1 text-right">{Math.round(calorieProgress)}% tercapai</p>
        </div>

        {/* Card Nutrisi */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-[#cbe7c4] mr-4">
              <IconChartBar />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Ringkasan Nutrisi</h2>
          </div>
          <ul className="space-y-3">
            {Object.entries(nutrition).map(([key, val]) => (
              <li key={key} className="text-slate-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="capitalize font-medium">{key}</span>
                  <span className="text-sm text-slate-500">{val.current}g / {val.target}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-[#a9d3b4] h-1.5 rounded-full" style={{ width: `${(val.current / val.target) * 100}%` }}></div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Card Log Makan */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-[#cbe7c4] mr-4">
              <IconClipboardList />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Log Makan</h2>
          </div>
          <p className="text-3xl font-bold text-[#41897c]">{mealLog.eaten} <span className="text-xl text-slate-600">/ {mealLog.total} kali makan</span></p>
          <p className="text-slate-600 mt-2">
            {mealLog.eaten === mealLog.total ? "Semua jadwal makan sudah tercatat!" : `Sisa ${mealLog.total - mealLog.eaten} kali makan lagi.`}
          </p>
          <Link to="/history"> {/* Ganti dengan path ke halaman history/log */}
            <button className="mt-4 w-full bg-[#a9d3b4] text-[#41897c] font-semibold py-2 px-4 rounded-lg hover:bg-[#cbe7c4] transition-colors duration-300">
              Lihat Detail Log
            </button>
          </Link>
        </div>
      </div>

      {/* Tambahan: Mungkin ada section untuk grafik mingguan atau tips nutrisi */}
      {/* <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Progres Mingguan</h3>
        {/* Placeholder untuk grafik */}
        {/* <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-slate-500">Grafik progres mingguan akan tampil di sini.</p>
        </div>
      </div> */}
    </div>
  );
}