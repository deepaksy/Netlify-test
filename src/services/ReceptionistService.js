
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/";
const AXIOS_CONFIG = { timeout: 10000 };

function getAuthHeaders() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getErrorMessage(error, fallbackMsg = "Unexpected error. Please try again.") {
  if (error.response && error.response.data && typeof error.response.data === "string")
    return error.response.data;
  if (error.response && error.response.data && error.response.data.message)
    return error.response.data.message;
  return fallbackMsg;
}

export const getUsers = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}receptionist/get-users`,
      {
        ...AXIOS_CONFIG,
        headers: getAuthHeaders(),
      }
    );
    if (!Array.isArray(response.data)) throw new Error("Malformed response from server.");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch users."));
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}receptionist/add-user`,
      userData,
      {
        ...AXIOS_CONFIG,
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Could not add user. Check details and try again."));
  }
};
// --- SUBSCRIPTIONS ---
export const getSubscriptionNames = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}receptionist/subscription/get-names`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription names:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}receptionist/delete-user/${userId}`,
      {
        ...AXIOS_CONFIG,
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete user."));
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}receptionist/update-user/${userId}`,
      userData,
      {
        ...AXIOS_CONFIG,
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Could not update user."));
  }
};
