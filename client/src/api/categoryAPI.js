import axios from "axios";

const CATEGORY_API_URL = "/api/categories";

/**
 * Fetches all categories from the server
 * @returns {Promise<Array>} Array of category objects
 */
export const getCategories = async () => {
  try {
    const response = await axios.get(CATEGORY_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Creates a new category
 * @param {string} name - Name of the new category
 * @returns {Promise<Object>} Newly created category object
 */
export const createCategory = async (name) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(
      CATEGORY_API_URL,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

/**
 * Deletes a category by ID
 * @param {string} id - ID of the category to delete
 * @returns {Promise<void>}
 */
export const deleteCategory = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`${CATEGORY_API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

/**
 * Updates a category
 * @param {string} id - ID of the category to update
 * @param {Object} updates - Updates to apply to the category
 * @param {string} updates.name - New name for the category
 * @returns {Promise<Object>} Updated category object
 */
export const updateCategory = async (id, updates) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put(`${CATEGORY_API_URL}/${id}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const bulkCreateCategories = async (categories) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(
      `${CATEGORY_API_URL}/bulk`,
      { categories },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error bulk creating categories:", error);
    throw error;
  }
};
