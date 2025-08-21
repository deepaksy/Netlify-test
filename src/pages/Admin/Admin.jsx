import React, { useState } from "react";
import "../../styles/Admin.css";
import AdminNavbar from "../../components/AdminNavbar";
import UserSection from "./UserSection";
import StaffSection from "./StaffSection";
import SubscriptionSection from "./SubscriptionSection";
import EquipmentSection from "./EquipmentSection";
import DashboardSection from "./DashboardSection";
import Feedback from "./Feedback";
import ProtectedRoute from "../../components/ProtectedRoute"; // universal role-based!

const sections = [
  "Admin Dashboard",
  "Manage Users",
  "Manage Staff",
  "Manage Subscription",
  "Manage Equipments",
  "Feedback Review"
];

export default function Admin() {
  const [current, setCurrent] = useState(sections[0]);
  return (
    <div className="admin-container">
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <AdminNavbar items={sections} current={current} onNav={setCurrent} />
        {current === "Admin Dashboard" && <DashboardSection />}
        {current === "Manage Users" && <UserSection />}
        {current === "Manage Staff" && <StaffSection />}
        {current === "Manage Subscription" && <SubscriptionSection />}
        {current === "Manage Equipments" && <EquipmentSection />}
        {current === "Feedback Review" && <Feedback />}
      </ProtectedRoute>
    </div>
  );
}
