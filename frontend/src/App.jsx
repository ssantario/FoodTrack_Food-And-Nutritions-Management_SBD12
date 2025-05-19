import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FoodRegister from "./pages/FoodRegister";
import Profile from "./pages/Profile";
import FoodList from "./pages/FoodList";
import History from "./pages/History";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/food-list" element={<FoodList />} />
        <Route path="/history" element={<History />} />
        {/* <Route path="/FoodRegister" element={<FoodRegister />} /> */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}