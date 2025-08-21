import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";

// Import trainer pages
import TrainerDashboard from "./TrainerDashboard";
import TrainerProfile from "./TrainerProfile";
import AssignedUsers from "./AssignedUsers";
import EquipmentsPage from "./EquipmentsPage";
import StrengthEquipments from "./StrengthEquipments";
import CardioEquipments from "./CardioEquipments";
import FlexibilityEquipments from "./FlexibiltyEquipments";
import FreeWeightsEquipments from "./FreeWeightsEquipments";
import ResistanceMachinesEquipments from "./ResistanceMachinesEquipments";
import UserProfile from "./UserProfile";
import DietPlanEditor from "./DietPlanEditor";
import UserSchedule from "./UserSchedule";
import NotFound from "../../components/NotFound";

const Trainer = () => (
  <Routes>
    <Route
      element={
        <ProtectedRoute allowedRoles={["ROLE_TRAINER"]}>
          <Outlet />
        </ProtectedRoute>
      }
    >
      <Route index element={<TrainerDashboard />} />
      <Route path="dashboard" element={<TrainerDashboard />} />
      <Route path="profile" element={<TrainerProfile />} />
      <Route path="users" element={<AssignedUsers />} />
      <Route path="equipments" element={<EquipmentsPage />} />
      <Route path="equipments/strength" element={<StrengthEquipments />} />
      <Route path="equipments/cardio" element={<CardioEquipments />} />
      <Route path="equipments/flexibility" element={<FlexibilityEquipments />} />
      <Route path="equipments/free_weights" element={<FreeWeightsEquipments />} />
      <Route path="equipments/resistance_machines" element={<ResistanceMachinesEquipments />} />
      <Route path="user/:userId" element={<UserProfile />} />
      <Route path="user/:userId/diet" element={<DietPlanEditor />} />
      <Route path="user/:userId/schedule" element={<UserSchedule />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default Trainer;
