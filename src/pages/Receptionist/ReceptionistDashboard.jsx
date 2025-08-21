import React from "react";
import UserManagement from "./UserManagement";
import TrainerAssignment from "./TrainerAssignment";
import { useNavigate } from "react-router-dom";

const navItems = [
  { key: "user", label: "User Management" },
  { key: "assignment", label: "Trainer Assignment" }
];

function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <div className="bg-dark text-white p-3" style={{ width: 250 }}>
      <div className="mb-4">
        <strong>Gymmate</strong>
        <div style={{ fontSize: 14 }}>Receptionist Panel</div>
      </div>
      <ul className="nav flex-column">
        {navItems.map((item) => (
          <li className="nav-item" key={item.key}>
            <button
              className={`nav-link btn btn-link text-start ${activeTab === item.key ? "text-white fw-bold" : "text-secondary"}`}
              aria-current={activeTab === item.key ? "page" : undefined}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </button>
          </li>
        ))}
        <li className="nav-item mt-auto">
          <button
            className="nav-link btn btn-link text-start text-danger"
            onClick={onLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = React.useState("user");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("gymmateAccessToken");
    localStorage.clear();
    alert("Logged out successfully!");
    navigate("/auth/signin", { replace: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "user":
        return <UserManagement />;
      case "assignment":
        return <TrainerAssignment />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <main className="flex-fill p-4 bg-light">{renderContent()}</main>
    </div>
  );
}

export default ReceptionistDashboard;
