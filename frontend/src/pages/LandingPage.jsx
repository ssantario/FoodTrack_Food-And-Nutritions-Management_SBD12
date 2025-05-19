import { Link } from "react-router-dom";
import { useEffect } from "react";

// --- SVG Icons --- (Warna ikon disesuaikan dengan text-[#2f7d6f] seperti di Dashboard)
const IconBookOpen = ({ className = "w-8 h-8 text-[#2f7d6f]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m0 0A7.488 7.488 0 0112 20.253a7.488 7.488 0 01-5.25-2.506M12 6.253V3.75m0 2.506A7.488 7.488 0 0012 3.75a7.488 7.488 0 00-5.25 2.506m10.5 0A7.488 7.488 0 0012 3.75a7.488 7.488 0 005.25 2.506M3.75 8.25h16.5M3.75 15.75h16.5"></path>
  </svg>
);

const IconCalculator = ({ className = "w-8 h-8 text-[#2f7d6f]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M12 17h.01M15 17h.01M4 7h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"></path>
  </svg>
);

const IconBell = ({ className = "w-8 h-8 text-[#2f7d6f]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
  </svg>
);

const IconChartPie = ({ className = "w-8 h-8 text-[#2f7d6f]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
  </svg>
);

const IconSparkles = ({ className = "w-8 h-8 text-[#2f7d6f]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6.343 17.657l-2.828 2.828m11.314-2.828l2.828 2.828M5 21v-4M3 19h4M17.657 6.343l2.828-2.828m-2.828 11.314l2.828 2.828M12 21a9 9 0 110-18 9 9 0 010 18zM12 3v4m0 14v-4m-7-3h4m10 0h-4"></path></svg>
);

const IconDatabase = ({ className = "w-8 h-8 text-[#2f7d6f]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
);
// --- End SVG Icons ---

export default function LandingPage() {
  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      section.classList.add("opacity-0", "translate-y-10", "transition-all", "duration-700", "ease-out");
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (observer && section && typeof observer.unobserve === 'function') {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      title: "Jurnal Makanan Detail",
      description: "Catat setiap gigitan dengan mudah. Antarmuka intuitif kami membantu Anda melacak makanan dan minuman secara komprehensif.",
      icon: <IconBookOpen />,
    },
    {
      title: "Analisis Gizi Akurat",
      description: "Ketahui angka pastinya! Dapatkan perhitungan kalori, makro, dan mikronutrien otomatis untuk setiap hidangan.",
      icon: <IconCalculator />,
    },
    {
      title: "Notifikasi Cerdas",
      description: "Jangan lewatkan waktu makan atau hidrasi. Pengingat kami yang dapat disesuaikan membantu Anda tetap pada jalur.",
      icon: <IconBell />,
    },
    {
      title: "Laporan Progres Visual",
      description: "Lihat kemajuan Anda melalui grafik dan ringkasan yang mudah dipahami. Rayakan pencapaian Anda!",
      icon: <IconChartPie />,
    },
    {
      title: "Target Nutrisi Pribadi",
      description: "Sesuaikan target kalori dan nutrisi sesuai kebutuhan unik Anda. FoodTrack membantu Anda mencapainya.",
      icon: <IconSparkles />,
    },
    {
      title: "Database Makanan Luas",
      description: "Akses ribuan item makanan umum dan favorit Anda, didukung oleh sistem cache untuk pencarian cepat.",
      icon: <IconDatabase />,
    },
  ];

  return (
    // Background utama disamakan dengan Dashboard
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]">
      {/* Navbar disamakan dengan Dashboard */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-[#41897c] shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#a9d3b4] flex items-center justify-center font-bold text-2xl text-[#2f7d6f] shadow-sm"> {/* Logo text color disamakan */}
            FT
          </div>
          <span className="text-2xl font-semibold text-white tracking-wider">FoodTrack</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="space-x-6 hidden md:flex">
            {/* Navigasi scroll disamakan hovernya dengan AppNavbar Dashboard */}
            <button onClick={() => scrollToSection("tentang")} className="text-gray-300 hover:bg-[#356e62] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out">Tentang</button>
            <button onClick={() => scrollToSection("fitur")} className="text-gray-300 hover:bg-[#356e62] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out">Fitur</button>
            <button onClick={() => scrollToSection("mulai")} className="text-gray-300 hover:bg-[#356e62] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out">Ayo Mulai</button>
          </div>
          {/* Tombol "Join FoodTrack" disamakan dengan "Catat Makanan Baru" di Dashboard */}
          <Link to="/dashboard">
            <button className="bg-gradient-to-r from-[#41897c] to-[#5ab8a5] text-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#5ab8a5] focus:ring-opacity-50">
              Join FoodTrack
            </button>
          </Link>
          {/* Tombol "Dashboard" disamakan dengan item aktif di AppNavbar Dashboard */}
          <Link to="/dashboard">
            <button className="bg-[#a9d3b4] text-[#2f7d6f] font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-[#cbe7c4] hover:shadow-md transition-all duration-300">
              Dashboard
            </button>
          </Link>
        </div>
      </nav>

      {/* Section: Tentang */}
      <section
        id="tentang"
        // Background section menggunakan warna dari gradient utama atau warna solid yang serasi
        className="fade-in-section min-h-screen flex flex-col items-center justify-center px-6 py-20 md:py-28"
      >
        <div className="max-w-3xl text-center">
          {/* Warna judul disamakan dengan header Dashboard */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#2f7d6f] tracking-tight">
            Transformasi Kesehatan Dimulai Dari Piring Anda
          </h2>
          {/* Warna teks paragraf disamakan */}
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-4">
            Bosan dengan tebak-tebakan soal nutrisi? FoodTrack hadir sebagai partner cerdas Anda dalam perjalanan menuju kesehatan optimal. Kami percaya bahwa memahami apa yang Anda konsumsi adalah langkah pertama menuju hidup yang lebih bertenaga dan seimbang.
          </p>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Aplikasi kami memudahkan pencatatan makanan dan memberikan analisis gizi mendalam, sehingga Anda bisa fokus mencapai target kesehatan dengan percaya diri dan penuh motivasi.
          </p>
        </div>
      </section>

      {/* Section: Fitur */}
      <section
        id="fitur"
        // Background section menggunakan warna dari gradient utama atau warna solid yang serasi
        className="fade-in-section min-h-screen flex flex-col items-center justify-center px-6 py-20 md:py-28 border-t border-b border-[#d1e7dd]" // border-[#d1e7dd] mirip dengan #dcfce7
      >
        <div className="max-w-4xl w-full text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#2f7d6f] tracking-tight">
            Semua yang Anda Butuhkan, Ada di FoodTrack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center">
                {/* Warna background ikon disamakan */}
                <div className="p-3 rounded-full bg-[#e0f2f1] mb-4 inline-block">
                  {feature.icon} {/* Ikon sudah menggunakan text-[#2f7d6f] */}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Ayo Mulai */}
      <section
        id="mulai"
        className="fade-in-section min-h-screen flex items-center justify-center px-6 py-20 md:py-28"
      >
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#2f7d6f] tracking-tight">
              Siap Memulai Perjalanan Sehat Anda?
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              Bergabunglah dengan FoodTrack sekarang dan ambil langkah pertama menuju gaya hidup yang lebih sehat dan teratur. Catat, pantau, dan capai target nutrisi Anda dengan mudah!
            </p>
            <Link to="/dashboard">
              {/* Tombol "Mulai Sekarang" disamakan dengan "Catat Makanan Baru" di Dashboard */}
              <button className="bg-gradient-to-r from-[#41897c] to-[#5ab8a5] text-white font-bold px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xl focus:outline-none focus:ring-2 focus:ring-[#5ab8a5] focus:ring-opacity-50">
                Mulai Sekarang, Gratis!
              </button>
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <img 
              src="/dummyjoin1.png" 
              alt="Mulai perjalanan sehat dengan FoodTrack" 
              className="rounded-xl shadow-2xl max-w-sm md:max-w-md w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer disamakan dengan Dashboard Navbar */}
      <footer className="bg-[#41897c] text-center py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#a9d3b4] flex items-center justify-center font-bold text-3xl text-[#2f7d6f] shadow-sm"> {/* Logo text color disamakan */}
            FT
          </div>
          <p className="text-white text-lg font-semibold mb-2">FoodTrack</p> {/* Teks utama footer jadi putih */}
          <p className="text-gray-300 text-sm"> {/* Teks deskripsi lebih soft */}
            Membantu Anda mencapai tujuan kesehatan dengan pelacakan nutrisi yang mudah.
          </p>
          <div className="mt-4">
            <span className="text-gray-300 font-medium text-xs">© {new Date().getFullYear()} FoodTrack - All Rights Reserved.</span> {/* Copyright lebih soft */}
          </div>
        </div>
      </footer>
    </div>
  );
}
