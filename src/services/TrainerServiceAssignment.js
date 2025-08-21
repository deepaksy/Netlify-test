import axios from "axios";

// Helper for Authorization header
function getAuthHeaders() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fetch the user and trainer name lists (protected)
export const fetchUserAndTrainerNames = async () => {
  const res = await axios.get(
    "http://localhost:8080/receptionist/get-trainers-users",
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};

// Assign trainer to user (protected)
export const assignTrainerToUser = async ({ userId, trainerId }) => {
  const res = await axios.post(
    "http://localhost:8080/receptionist/assign-trainer",
    {
      userId,
      trainerId,
    },
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};
