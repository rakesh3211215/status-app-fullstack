import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

function CategoryManager({ categories = [], onAdd, onDelete, onBulkAdd }) {
  const { t } = useTranslation();
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [bulkError, setBulkError] = useState("");
  const [bulkSuccess, setBulkSuccess] = useState(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const fileInputRef = useRef(null);

  const safeCategories = Array.isArray(categories) ? categories : [];

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError(t("category_name_required"));
      return;
    }

    if (safeCategories.some((cat) => cat.name === newCategory.trim())) {
      setError(t("category_already_exists"));
      return;
    }

    onAdd(newCategory.trim());
    setNewCategory("");
    setError("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsBulkLoading(true);
    setBulkError("");
    setBulkSuccess(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target.result;
          const parsedData = JSON.parse(content);

          // Validate JSON structure
          if (!Array.isArray(parsedData)) {
            throw new Error("Invalid JSON format. Expected an array.");
          }

          // Process bulk upload
          const result = await onBulkAdd(parsedData);
          setBulkSuccess(result);

          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (parseError) {
          setBulkError(parseError.message || t("invalid_json_format"));
        } finally {
          setIsBulkLoading(false);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      setBulkError(error.message || t("bulk_upload_failed"));
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">{t("manage_categories")}</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block mb-2 font-medium">{t("add_category")}</label>
        <div className="flex">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={t("category_name")}
            className="flex-grow px-3 py-2 border rounded-l"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          >
            {t("add")}
          </button>
        </div>
      </div>

      {/* Bulk Upload Section */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">{t("bulk_upload")}</label>
        <div className="flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            id="bulk-upload-input"
          />
          <label
            htmlFor="bulk-upload-input"
            className="flex-grow bg-gray-100 border border-gray-300 rounded-l px-4 py-2 cursor-pointer hover:bg-gray-200"
          >
            {t("select_json_file")}
          </label>
          <button
            onClick={() => document.getElementById("bulk-upload-input").click()}
            className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700"
            disabled={isBulkLoading}
          >
            {isBulkLoading ? t("uploading") : t("upload")}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">{t("json_format_hint")}</p>

        {bulkError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {t("upload_error")}: {bulkError}
          </div>
        )}

        {bulkSuccess && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
            <div className="font-medium">{t("upload_success")}</div>
            <div>
              {t("success_count")}: {bulkSuccess.successCount}
            </div>
            {bulkSuccess.errorCount > 0 && (
              <div>
                {t("error_count")}: {bulkSuccess.errorCount}
                <div className="mt-2">
                  {bulkSuccess.errors.map((error, index) => (
                    <div key={index} className="text-sm">
                      • {error.category.name || "Unknown category"}:{" "}
                      {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">{t("existing_categories")}</h3>
        {safeCategories.length > 0 ? (
          <ul className="border rounded divide-y">
            {safeCategories.map((category) => (
              <li
                key={category._id}
                className="p-3 flex justify-between items-center"
              >
                <span>{category.name}</span>
                <button
                  onClick={() => onDelete(category._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  {t("delete")}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">
            {t("no_categories_found")}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryManager;
