import axios from "axios";

const API_BASE_URL = "http://localhost:8080/admin";

function getAuthHeaders() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-users`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-user`, userData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete-user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-user/${userId}`, userData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getSubscriptionNames = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subscription/getnames`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription names:", error);
    throw error;
  }
};

export const addSubscription = (data) => {
  return axios.post(`${API_BASE_URL}/subscription/add-subscription`, data, {
    headers: getAuthHeaders(),
  });
};

export const getSubscriptions = () => {
  return axios.get(`${API_BASE_URL}/subscription`, {
    headers: getAuthHeaders(),
  });
};

export const deleteSubscription = (subId) => {
  return axios.delete(`${API_BASE_URL}/subscription/${subId}`, {
    headers: getAuthHeaders(),
  });
};

export const updateSubscription = (subId, updateData) => {
  return axios.put(`${API_BASE_URL}/subscription/${subId}`, updateData, {
    headers: getAuthHeaders(),
  });
};

export const addEquipment = async (equipmentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/equipment/add`,
      equipmentData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding equipment:", error);
    throw error;
  }
};

export const getAllEquipments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/equipment/getall`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching equipment list:", error);
    throw error;
  }
};

export const deleteEquipment = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/equipment/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting equipment:", error);
    throw error;
  }
};

export const updateEquipment = async (id, updateDto) => {
  try {
    return await axios.put(`${API_BASE_URL}/equipment/${id}`, updateDto, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error updating equipment:", error);
    throw error;
  }
};

export const getAllReceptionists = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/receptionist`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching receptionists:", error);
    throw error;
  }
};

export const addReceptionist = async (receptionistData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/receptionist`,
      receptionistData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding receptionist:", error);
    throw error;
  }
};

export const deleteReceptionist = (id) => {
  return axios.delete(`${API_BASE_URL}/receptionist/delete/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const updateReceptionist = (id, receptionistData) => {
  const { id: _, ...dataWithoutId } = receptionistData;
  return axios.put(`${API_BASE_URL}/receptionist/update/${id}`, dataWithoutId, {
    headers: getAuthHeaders(),
  });
};

export const addTrainer = (trainerData) => {
  return axios.post(`${API_BASE_URL}/trainer`, trainerData, {
    headers: getAuthHeaders(),
  }).then((res) => res.data);
};

export const getAllTrainers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trainer`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Trainers");
    throw error;
  }
};

export const deleteTrainer = (id) => {
  return axios.delete(`${API_BASE_URL}/trainer/delete/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const updateTrainer = (id, trainerData) => {
  const { id: _, ...data } = trainerData;
  return axios.put(`${API_BASE_URL}/trainer/update/${id}`, data, {
    headers: getAuthHeaders(),
  }).then(res => res.data);
};

export const getAllFeedbacks = () =>
  axios.get(`${API_BASE_URL}/feedback`, { headers: getAuthHeaders() });

export async function fetchPayments() {
  const response = await axios.get(`${API_BASE_URL}/payments`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function fetchDashboardStats() {
  const response = await axios.get(`${API_BASE_URL}/dashboardstats`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export const toggleEquipmentMaintenance = async (id, currentStatus) => {
  try {
    await axios.put(
      `${API_BASE_URL}/equipments/${id}/maintenance`,
      { forMaintenance: !currentStatus },
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    console.error('Failed to update maintenance status:', error);
    throw error;
  }
};