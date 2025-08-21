import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";


const AdminNavbar = ({ items, current, onNav }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    sessionStorage.removeItem("gymmateAccessToken");
  };

  return (
    <div
      className="d-flex flex-column bg-white shadow"
      style={{
        minHeight: "100vh",
        width: 220,
        borderRight: "1px solid #e4e4e4",
        paddingTop: "24px",
        paddingBottom: "24px",
        gap: "8px",
      }}
    >
      <div className="d-flex flex-column flex-grow-1">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={
              "btn text-start fw-semibold px-4 py-2 rounded-0 " +
              (current === item
                ? "btn-primary text-white"
                : "btn-light text-dark border-0")
            }
            style={{
              borderLeft: current === item ? "6px solid #0070e0" : "6px solid transparent",
              fontWeight: 600,
              fontSize: "16px",
              boxShadow: current === item ? "0 2px 12px 0 #87a9ed20" : undefined,
              background: current === item ? "" : ""
            }}
            onClick={() => onNav(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        className="btn btn-outline-danger fw-semibold ms-2 mt-4 d-flex align-items-center"
        style={{
          marginTop: "auto",
          padding: "10px 16px",
          fontWeight: "600",
          fontSize: "15px",
        }}
        onClick={handleLogout}
      >
        <FaSignOutAlt className="me-2" /> Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
