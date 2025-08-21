// src/pages/UserHomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle, FaIdCard, FaHeartbeat, FaCalendarCheck, FaComments,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "./UserHomePage.css";

const cardData = [
  { path: "/user/profile", icon: <FaUserCircle size={32} color="#000" />, title: "Profile", desc: "Update your info" },
  { path: "/user/membership", icon: <FaIdCard size={32} color="#000" />, title: "Membership", desc: "Plans & renewal" },
  { path: "/user/workout", icon: <FaHeartbeat size={32} color="#000" />, title: "Workout", desc: "Plans & diets" },
  { path: "/user/schedule", icon: <FaCalendarCheck size={32} color="#000" />, title: "Schedule", desc: "Sessions" },
  { path: "/user/feedback", icon: <FaComments size={32} color="#000" />, title: "Feedback", desc: "Help & support" },
];

// Helper: decode the current user's display name from token
function getUserDisplayNameFromToken() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  if (!token) return "";
  try {
    const decoded = jwtDecode(token);
    // Prefer firstName, else use username/email, else fallback to ""
    return decoded.firstName
      || "";
  } catch {
    return "";
  }
}

const UserHomePage = () => {
  const userName = getUserDisplayNameFromToken();

  return (
    <div className="user-homepage-root">
      <div className="content-container">
        <h2 className="welcome-heading">
          Welcome, <span className="username">{userName}</span>
        </h2>
        <div className="choose-text">
          Choose an option
        </div>
        <div className="card-wrapper">
          {cardData.map(card => (
            <Link to={card.path} key={card.path} className="home-card-link">
              <div className="home-card">
                {card.icon}
                <div className="card-title">{card.title}</div>
                <div className="card-desc">{card.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
