import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaDumbbell, FaUser, FaSignOutAlt } from 'react-icons/fa';

const TrainerNavbar = () => {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = (e) => {
    e.preventDefault(); // Prevents default NavLink behavior
    sessionStorage.removeItem("gymmateAccessToken");
    // Redirect to login with a logout message
    navigate("/auth/signin", { replace: true, state: { msg: "Logged out successfully." } });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4 py-2 sticky-top">
      <NavLink className="navbar-brand fw-bold fs-4 text-warning" to="/trainer">
        TrainerPanel
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#trainerNavbar"
        aria-controls="trainerNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="trainerNavbar">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
          <li className="nav-item">
            <NavLink to="/trainer" className="nav-link">
              <FaTachometerAlt className="me-1" />
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/trainer/users" className="nav-link">
              <FaUsers className="me-1" />
              Assigned Users
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/trainer/equipments" className="nav-link">
              <FaDumbbell className="me-1" />
              Equipments
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/trainer/profile" className="nav-link">
              <FaUser className="me-1" />
              My Profile
            </NavLink>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink
              to="/logout"
              className="nav-link text-danger fw-semibold"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-1" />
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default TrainerNavbar;
