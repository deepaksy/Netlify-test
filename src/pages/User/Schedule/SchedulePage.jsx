import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import "./SchedulePage.css";
import { UserService } from "../../../services/UserService";
import { jwtDecode } from "jwt-decode";

// Optional: For not-logged-in checks/messages (service guards anyway)
function getCurrentUserId() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.sub || decoded.email || null;
  } catch {
    return null;
  }
}

const dayOrder = [
  { key: "sunday", label: "Sunday" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" }
];

const SchedulePage = () => {
  const [weekSchedule, setWeekSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Secure: get user id dynamically!
  const userId = getCurrentUserId();

  useEffect(() => {
    if (!userId) {
      setWeekSchedule(null);
      setApiError("Not logged in. Please log in to view your schedule.");
      setLoading(false);
      return;
    }
    setLoading(true);
    UserService.getUserSchedule()
      .then(res => {
        setWeekSchedule(res.data); // Use ONLY what backend sends
        setApiError("");
        setLoading(false);
      })
      .catch(() => {
        setWeekSchedule(null);
        setApiError("No schedule assigned. Please ask your trainer.");
        setLoading(false);
      });
  }, [userId]);

  if (loading)
    return <div className="schedule-bg"><div>Loading schedule...</div></div>;

  if (apiError || !weekSchedule) {
    return (
      <div className="schedule-bg">
        <div className="schedule-root">
          <div className="schedule-tablepanel" style={{ width: "100%" }}>
            <div className="schedule-tabletitle">
              <FaCalendarAlt style={{ marginBottom: 2, marginRight: 7 }} />
              No Workout Schedule Assigned
            </div>
            <div className="schedule-subtext" style={{ color: "#b00" }}>
              {apiError}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-bg">
      <div className="schedule-root">
        <div className="schedule-tablepanel" style={{ width: "100%" }}>
          <div className="schedule-tabletitle">
            <FaCalendarAlt style={{ marginBottom: 2, marginRight: 7 }} />
            Your Weekly Workout Schedule
          </div>
          <div className="schedule-subtext">
            7-Day Training Plan
          </div>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Workout</th>
              </tr>
            </thead>
            <tbody>
              {dayOrder.map(d => (
                <tr key={d.key}>
                  <td className="schedule-tbl-day">{d.label}</td>
                  <td className="schedule-tbl-workout">
                    {weekSchedule[d.key] || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Show instructions if present */}
          {weekSchedule.instructions && (
            <div className="schedule-instructions">
              <strong>Instructions:</strong> {weekSchedule.instructions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
