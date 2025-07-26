import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import AddStatusForm from "../components/status/AddStatusForm";
import { getCategories, createStatus } from "../api/statusAPI";
import { FaUpload, FaFileAlt } from "react-icons/fa";

function AddStatus() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentUser, navigate]);

  const handleStatusAdded = () => {
    navigate("/dashboard");
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setUploadError("");
    setUploadSuccess(false);
    setIsUploading(true);

    // Validate file type
    if (file.type !== "application/json") {
      setUploadError(t("invalid_file_type"));
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);

        // Basic validation
        if (!Array.isArray(jsonData)) {
          throw new Error(t("invalid_json_format"));
        }

        // Process each status
        let successCount = 0;
        let errorCount = 0;
        let errors = [];

        for (const [index, status] of jsonData.entries()) {
          try {
            // Validate required fields
            if (!status.title || !status.description || !status.category) {
              throw new Error(t("missing_required_fields"));
            }

            // Create the status
            await createStatus({
              ...status,
              user: currentUser._id,
            });
            successCount++;
          } catch (err) {
            errorCount++;
            errors.push(`${t("status")} #${index + 1}: ${err.message}`);
          }
        }

        // Show results
        if (errorCount > 0) {
          setUploadError(
            `${t("partial_upload_success")} (${successCount}/${
              jsonData.length
            }). ${t("errors")}: ${errors.join("; ")}`
          );
        } else {
          setUploadSuccess(true);
          setUploadError("");
        }
      } catch (error) {
        setUploadError(error.message || t("json_parse_error"));
      } finally {
        setIsUploading(false);
        // Reset file input
        e.target.value = "";
      }
    };

    reader.onerror = () => {
      setUploadError(t("file_read_error"));
      setIsUploading(false);
      e.target.value = "";
    };

    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <div className="text-xl font-bold mb-6">{t("add_status")}</div>
        <div>{t("loading")}...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t("add_status")}</h1>

      {/* JSON Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaFileAlt className="mr-2 text-blue-500" />
            {t("upload_json")}
          </h2>

          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className={`flex items-center px-4 py-2 rounded-lg transition ${
              isUploading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <FaUpload className="mr-2" />
            {isUploading ? t("uploading") : t("select_file")}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
            disabled={isUploading}
          />
        </div>

        <p className="text-gray-600 mb-4 text-sm">
          {t("upload_json_description")}
        </p>

        {uploadError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {uploadError}
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {t("upload_success")}
          </div>
        )}

        {isUploading && (
          <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
            {t("processing_file")}...
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-gray-500">{t("or")}</span>
        </div>
      </div>

      {/* Add Status Form */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {t("add_single_status")}
      </h2>
      <AddStatusForm
        onStatusAdded={handleStatusAdded}
        categories={categories}
      />
    </div>
  );
}

export default AddStatus;
