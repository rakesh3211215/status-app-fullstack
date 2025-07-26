import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CategoryManager from "../../components/admin/CategoryManager";
import {
  getCategories,
  createCategory,
  deleteCategory,
  bulkCreateCategories,
} from "../../api/categoryAPI";

function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message || t("failed_to_fetch_categories"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryName) => {
    try {
      const newCategory = await createCategory(categoryName);
      setCategories([newCategory, ...categories]);
      setError(null);
      setSuccess(t("category_added_success"));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || t("add_failed"));
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setDeletingId(categoryId);
      await deleteCategory(categoryId);
      setCategories(categories.filter((cat) => cat._id !== categoryId));
      setError(null);
      setSuccess(t("category_deleted_success"));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || t("delete_failed"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkAdd = async (categoriesToAdd) => {
    try {
      const result = await bulkCreateCategories(categoriesToAdd);
      await fetchCategories();
      setError(null);
      setSuccess(t("bulk_upload_success", { count: result.createdCount }));
      setTimeout(() => setSuccess(null), 5000);
      return result;
    } catch (err) {
      throw new Error(err.response?.data?.message || t("bulk_upload_failed"));
    }
  };

  const handleRefresh = () => {
    setSuccess(null);
    setError(null);
    fetchCategories();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("manage_categories")}</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          {t("refresh")}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <CategoryManager
        categories={categories}
        onAdd={handleAddCategory}
        onDelete={handleDeleteCategory}
        onBulkAdd={handleBulkAdd}
        deletingId={deletingId}
      />
    </div>
  );
}

export default CategoriesPage;
