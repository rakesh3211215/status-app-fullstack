import axios from "axios";

const API_URL = "/api/status";
const CATEGORY_URL = "/api/categories";

// Utility to get auth header
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// ===== STATUS APIs =====

export const getStatuses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createStatus = async (statusData) => {
  const response = await axios.post(API_URL, statusData, {
    headers: authHeader(),
  });
  return response.data;
};

export const updateStatus = async (id, statusData) => {
  const response = await axios.put(`${API_URL}/${id}`, statusData, {
    headers: authHeader(),
  });
  return response.data;
};

export const deleteStatus = async (id) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: authHeader(),
  });
  return id;
};

// ===== CATEGORY APIs =====

export const getCategories = async () => {
  const response = await axios.get(CATEGORY_URL);
  return response.data;
};

export const addCategory = async (categoryName) => {
  const response = await axios.post(
    CATEGORY_URL,
    { name: categoryName },
    {
      headers: authHeader(),
    }
  );
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  await axios.delete(`${CATEGORY_URL}/${categoryId}`, {
    headers: authHeader(),
  });
  return categoryId;
};

export const updateCategory = async (categoryId, newName) => {
  const response = await axios.put(
    `${CATEGORY_URL}/${categoryId}`,
    { name: newName },
    {
      headers: authHeader(),
    }
  );
  return response.data;
};

export const bulkCreateCategories = async (categoriesArray) => {
  const response = await axios.post(
    `${CATEGORY_URL}/bulk`,
    { categories: categoriesArray },
    {
      headers: authHeader(),
    }
  );
  return response.data;
};
