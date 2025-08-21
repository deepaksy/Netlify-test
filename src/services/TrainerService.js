// src/services/TrainerService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/trainer';

// Helper: Returns Authorization header if token exists
function getAuthHeaders() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ========== Trainer: Users ==========
export const getAssignedUsers = async (trainerId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/users/${trainerId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching assigned users:', error);
    throw error;
  }
};

export const getTrainerAssignedUsers = getAssignedUsers; // Alias

// ========== Trainer: Equipments ==========
export const getCardioEquipments = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/equipments/cardio`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching cardio equipments:', error);
    throw error;
  }
};

export const fetchEquipmentCategories = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/equipments`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch equipment categories:', error);
    throw error;
  }
};

export const fetchFlexibilityEquipments = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/equipments/flexibility`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching flexibility equipments:', error);
    throw error;
  }
};

export const fetchFreeWeightsEquipments = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/equipments/freeweights`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching free weights equipments:', error);
    throw error;
  }
};

export const fetchResistanceMachines = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/equipments/resistancemachines`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching resistance machines:', error);
    throw error;
  }
};

export const fetchStrengthEquipments = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/equipments/strength`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching strength equipments:', error);
    throw error;
  }
};

export const toggleEquipmentMaintenance = async (id, currentStatus) => {
  try {
    await axios.put(
      `${BASE_URL}/equipments/${id}/maintenance`,
      { forMaintenance: !currentStatus },
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    console.error('Failed to update maintenance status:', error);
    throw error;
  }
};

// ========== Trainer: Users' Profile & Schedule ==========
export const fetchUserProfile = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/${userId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const fetchUserSchedule = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/${userId}/schedule`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user schedule:', error);
    throw error;
  }
};

export const updateUserSchedule = async (userId, payload) => {
  try {
    await axios.post(
      `${BASE_URL}/user/${userId}/schedule`,
      payload,
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    console.error('Error updating user schedule:', error);
    throw error;
  }
};

// ========== Trainer: Diet Plan ==========
export const fetchUserDietPlan = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/${userId}/diet`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    throw error;
  }
};

export const updateUserDietPlan = async (userId, payload) => {
  try {
    await axios.post(
      `${BASE_URL}/user/${userId}/diet`,
      payload,
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    console.error('Error updating diet plan:', error);
    throw error;
  }
};

// ========== Trainer Profile & Photo ==========
export const fetchTrainerProfile = async (trainerId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/profile/${trainerId}`,
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching trainer profile:', error);
    throw error;
  }
};

export const updateTrainerProfile = async (trainerId, profile) => {
  try {
    return await axios.put(
      `${BASE_URL}/${trainerId}`,
      profile,
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    console.error('Error updating trainer profile:', error);
    throw error;
  }
};

export const uploadTrainerPhoto = async (trainerId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios.post(
      `${BASE_URL}/upload/${trainerId}`,
      formData,
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (error) {
    console.error('Error uploading trainer photo:', error);
    throw error;
  }
};

export const deleteTrainerPhoto = async (trainerId) => {
  try {
    return await axios.delete(
      `${BASE_URL}/delete/${trainerId}`,
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    console.error('Error deleting trainer photo:', error);
    throw error;
  }
};
