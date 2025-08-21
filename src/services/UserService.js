import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8080";

// --- HELPERS ---
function getCurrentUserIdFromToken() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  if (!token) throw new Error("Not logged in or no access token!");
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.sub || decoded.email;
  } catch (e) {
    throw new Error("Invalid JWT token in session. Please login again.");
  }
}
function getAuthHeaders() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- USER SERVICE ---
export const UserService = {
  // ================= REGISTRATION =================
  /**
   * Register a new user.
   * @param {object} payload The user registration fields.
   * Returns promise resolving to backend response { message } (or error).
   */
  async registerUser(payload) {
    try {
      const res = await axios.post(`${BASE_URL}/user/register`, payload);
      return res.data; // e.g. { timeStamp, message }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        return err.response.data;
      }
      throw err; // fallback, e.g. network error
    }
  },

  // ===== MEMBERSHIP SECTION =====
  async getMembershipPackages() {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    };
    const response = await fetch(`${BASE_URL}/user/available-subscriptions`, {
      method: "GET",
      headers,
    });
    if (!response.ok) {
      throw new Error("Could not fetch membership packages.");
    }
    return response.json();
  },

  async buyMembershipPackage(userId, packageName) {
    const payload = { name: packageName };
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    };
    const response = await fetch(`${BASE_URL}/user/buy-package/${userId}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Subscription failed. Try again.");
    }
    return data;
  },

  async submitFeedback(userId, { message, rating, trainerId }, token) {
    const response = await fetch(`${BASE_URL}/user/feedback/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message, rating, trainerId }),
    });
    if (!response.ok) throw new Error("Failed to send feedback");
    return response.json();
  },
  // ===== DIET SECTION =====
  getUserDiet(providedId) {
    const userId = providedId || getCurrentUserIdFromToken();
    return axios.get(`${BASE_URL}/user/getdiet/${userId}`, {
      headers: getAuthHeaders(),
    });
  },

  // ===== PROFILE SECTION =====
  fetchProfile() {
    const userId = getCurrentUserIdFromToken();
    return axios.get(`${BASE_URL}/user/profile/${userId}`, {
      headers: getAuthHeaders(),
    });
  },
  updateProfile(profile) {
    const userId = getCurrentUserIdFromToken();
    return axios.post(`${BASE_URL}/user/profile/${userId}`, profile, {
      headers: getAuthHeaders(),
    });
  },

  // ===== SCHEDULE SECTION =====
  getUserSchedule() {
    const userId = getCurrentUserIdFromToken();
    return axios.get(`${BASE_URL}/user/get-schedule/${userId}`, {
      headers: getAuthHeaders(),
    });
  },
};
