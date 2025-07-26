import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createStatus } from "../../api/statusAPI";

function AddStatusForm({ onStatusAdded, categories = [] }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: categories[0]?.name || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    description: false,
    category: false,
  });

  // Reset form when categories change
  useEffect(() => {
    setFormData({
      title: "",
      description: "",
      category: categories[0]?.name || "",
    });
  }, [categories]);

  // Reset validation errors when form data changes
  useEffect(() => {
    setValidationErrors({
      title: false,
      description: false,
      category: false,
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {
      title: !formData.title.trim(),
      description: !formData.description.trim(),
      category: !formData.category,
    };

    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setError(t("all_fields_required"));
      return;
    }

    setLoading(true);
    try {
      const newStatus = await createStatus(formData);
      onStatusAdded(newStatus);
      setFormData({
        title: "",
        description: "",
        category: categories[0]?.name || "",
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || t("status_creation_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">{t("add_status")}</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block mb-2 font-medium">{t("title")}</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded ${
            validationErrors.title ? "border-red-500" : ""
          }`}
        />
        {validationErrors.title && (
          <p className="text-red-500 text-sm mt-1">{t("title_required")}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">{t("description")}</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={`w-full px-3 py-2 border rounded ${
            validationErrors.description ? "border-red-500" : ""
          }`}
        ></textarea>
        {validationErrors.description && (
          <p className="text-red-500 text-sm mt-1">
            {t("description_required")}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">{t("category")}</label>
        {categories.length > 0 ? (
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${
              validationErrors.category ? "border-red-500" : ""
            }`}
          >
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-red-500 py-2">
            {t("no_categories_available")}
          </div>
        )}
        {validationErrors.category && (
          <p className="text-red-500 text-sm mt-1">{t("category_required")}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || categories.length === 0}
        className={`w-full py-2 rounded text-white ${
          categories.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } disabled:opacity-50`}
      >
        {loading ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

export default AddStatusForm;
