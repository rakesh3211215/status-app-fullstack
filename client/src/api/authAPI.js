import axios from "axios";

const API_URL = "/api/auth";

// Changed to named exports
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user", error);
    return null;
  }
};
