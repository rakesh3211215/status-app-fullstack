import axios from "axios";

const ADMIN_API_URL = "/api/admin";
const STATUS_API_URL = "/api/status";

// Reusable config with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token || ""}`,
    },
  };
};

// ------------------- User APIs --------------------

export const getAllUsers = async () => {
  const response = await axios.get(`${ADMIN_API_URL}/users`, getAuthHeaders());
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  await axios.put(
    `${ADMIN_API_URL}/users/${userId}/role`,
    { role },
    getAuthHeaders()
  );
};

// ------------------- Status APIs --------------------

/**
 * Fetch statuses with optional query params:
 * Example: getAllStatuses("page=1&search=funny&category=love")
 */
export const getAllStatuses = async (queryString = "") => {
  const url = queryString ? `${STATUS_API_URL}?${queryString}` : STATUS_API_URL;
  const response = await axios.get(url, getAuthHeaders());
  return response.data;
};

export const deleteStatus = async (id) => {
  await axios.delete(`${STATUS_API_URL}/${id}`, getAuthHeaders());
};

export const updateStatus = async (id, statusData) => {
  const response = await axios.put(
    `${STATUS_API_URL}/${id}`,
    statusData,
    getAuthHeaders()
  );
  return response.data;
};

export const getAllStatusCategories = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get("/api/status/categories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
