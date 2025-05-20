import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        setMessage("");
        setShowWelcomeModal(true);
      } else {
        setMessage("Login gagal: token tidak ditemukan.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Network error.");
      }
    }
    setLoading(false);
  };

  const handleModalContinue = () => {
    setShowWelcomeModal(false);
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200 relative">
      <img
        src="/path-to-illustration.svg"
        alt="Background Illustration"
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />
      <form
        className="bg-white p-8 rounded-lg shadow-2xl w-96 z-10"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          Login
        </h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              email.includes("@")
                ? "border-green-500 focus:ring-green-500"
                : "border-red-500 focus:ring-red-500"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-transform duration-300 flex items-center justify-center"
          disabled={loading}
        >
          <span>{loading ? "Logging in..." : "Login"}</span>
          <span className="ml-2 loader hidden"></span>
        </button>
        {message && (
          <div className="mt-4 text-center text-sm text-red-600">{message}</div>
        )}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-green-600 hover:underline hover:text-green-700 transition duration-200"
          >
            Sign up
          </a>
        </p>
        <p className="text-center text-sm text-gray-500 mt-6">
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Selamat Datang!
            </h3>
            <p className="mb-4 text-gray-700">
              Anda berhasil login.
              <br />
              Silakan lengkapi informasi pada halaman profil Anda untuk pengalaman
              terbaik.
            </p>
            <button
              onClick={handleModalContinue}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Isi Profil Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}