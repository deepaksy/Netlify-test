import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import UserHomePage from "./UserHome/UserHomePage";
import ProfilePage from "./Profile/ProfilePage";
import MembershipPage from "./Membership/MembershipPage";
import WorkoutDietPage from "./WorkoutDiet/WorkoutDietPage";
import SchedulePage from "./Schedule/SchedulePage";
import FeedbackPage from "./Feedback/FeedbackPage";
import DietNutritionPage from "./DietNutritionPage/DietNutritionPage";

export default function User() {
  return (
    <div style={{ minHeight: "100vh", background: "#181a1b" }}>
      <UserNavbar />
      <main>
        <Routes>
          <Route
            path="*"
            element={
              <ProtectedRoute allowedRoles={["ROLE_USER"]}>
                <Routes>
                  <Route index element={<UserHomePage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="membership" element={<MembershipPage />} />
                  <Route path="workout" element={<WorkoutDietPage />} />
                  <Route path="schedule" element={<SchedulePage />} />
                  <Route path="diet-nutrition" element={<DietNutritionPage />} />
                  <Route path="feedback" element={<FeedbackPage />} />
                  <Route path="*" element={<Navigate to="" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}