import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Generic/public pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NotFound from "./components/NotFound.jsx";

// Modular dashboards
import User from "./pages/User/User";
import Admin from "./pages/Admin/Admin";
import Trainer from "./pages/Trainer/Trainer";

// Other dashboards & utility pages
import ReceptionistDashboard from "./pages/Receptionist/ReceptionistDashboard";
import PaymentPage from './pages/Payment/PaymentPage';
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Which routes hide the Navbar
const authPages = ["/auth/signin", "/register"];

function AppContent() {
  const location = useLocation();
  const hideNavbar =
    authPages.includes(location.pathname) ||
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/reception-dashboard") ||
    location.pathname.startsWith("/trainer");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Modular dashboards */}
        <Route path="/user/*" element={<User />} />
        <Route path="/admin-dashboard" element={<Admin />} />
        <Route path="/trainer/*" element={<Trainer />} />

        {/* Other utility dashboards */}
        <Route path="/reception-dashboard/*" element={
          <ProtectedRoute>
            <ReceptionistDashboard />
          </ProtectedRoute>} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
