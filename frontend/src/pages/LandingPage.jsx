import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function LandingPage() {
  // Fade-in animasi saat section muncul
  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target); // Optional: unobserve after animation
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  // Fungsi smooth scroll
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fae6]"> {/* Main background */}
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-[#41897c] shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#a9d3b4] flex items-center justify-center font-bold text-2xl text-[#41897c] shadow-sm">
            FT
          </div>
          <span className="text-2xl font-semibold text-white tracking-wider">FoodTrack</span>
        </div>
        <div className="space-x-6 hidden md:flex">
          <button onClick={() => scrollToSection("tentang")} className="text-white hover:text-[#cbe7c4] transition-colors duration-300 font-medium">Tentang</button>
          <button onClick={() => scrollToSection("fitur")} className="text-white hover:text-[#cbe7c4] transition-colors duration-300 font-medium">Fitur</button>
          <button onClick={() => scrollToSection("mulai")} className="text-white hover:text-[#cbe7c4] transition-colors duration-300 font-medium">Ayo Mulai</button>
        </div>
        <Link to="/dashboard">
          <button className="bg-[#a9d3b4] text-[#41897c] font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-[#cbe7c4] hover:shadow-md transition-all duration-300">
            Dashboard
          </button>
        </Link>
      </nav>

      {/* Section: Tentang */}
      <section
        id="tentang"
        className="fade-in-section opacity-0 translate-y-10 transition-all duration-700 ease-out flex flex-col items-center justify-center bg-[#f9fae6] px-6 py-20 md:py-28"
      >
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#41897c] tracking-tight">
            Tentang FoodTrack
          </h2>
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
            FoodTrack adalah aplikasi intuitif yang dirancang untuk membantu Anda mencatat konsumsi makanan harian dan menghitung nilai gizinya secara akurat. Dengan FoodTrack, perjalanan Anda menuju pola makan sehat menjadi lebih mudah dan terukur.
          </p>
        </div>
      </section>

      {/* Section: Fitur */}
      <section
        id="fitur"
        className="fade-in-section opacity-0 translate-y-10 transition-all duration-700 ease-out flex flex-col items-center justify-center bg-[#f9fae6] px-6 py-20 md:py-28 border-t border-b border-[#d1e7dd]"
      >
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-[#41897c] tracking-tight">
            Fitur Unggulan Kami
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-left text-lg text-slate-700">
            {[
              "Pelacakan makanan harian yang detail.",
              "Perhitungan kalori otomatis dan akurat.",
              "Notifikasi pengingat waktu makan yang dipersonalisasi.",
              "Ringkasan nutrisi harian setelah makan malam.",
              "Input target nutrisi pribadi & pemantauan pencapaian.",
              "Database makanan umum dengan cache (Redis di backend)."
            ].map((fitur, idx) => (
              <li key={idx} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#e6f0e9] transition-colors duration-200">
                <svg className="w-6 h-6 text-[#a9d3b4] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{fitur}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section: Ayo Mulai */}
      <section
        id="mulai"
        className="fade-in-section opacity-0 translate-y-10 transition-all duration-700 ease-out flex flex-col items-center justify-center bg-[#f9fae6] px-6 py-20 md:py-28"
      >
        <div className="max-w-2xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#41897c] tracking-tight">
            Siap Memulai Perjalanan Sehat Anda?
          </h2>
          <p className="text-lg md:text-xl text-slate-700 mb-10 leading-relaxed">
            Bergabunglah dengan FoodTrack sekarang dan ambil langkah pertama menuju gaya hidup yang lebih sehat dan teratur. Catat, pantau, dan capai target nutrisi Anda dengan mudah!
          </p>
          <Link to="/dashboard">
            <button className="bg-[#41897c] text-white font-bold px-10 py-4 rounded-lg shadow-lg hover:bg-[#356e62] hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xl">
              Mulai Sekarang, Gratis!
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#a9d3b4] text-center py-6">
        <span className="text-[#41897c] font-semibold text-sm">© 2025 FoodTrack - All Rights Reserved.</span>
      </footer>
    </div>
  );
}