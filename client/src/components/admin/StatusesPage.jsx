import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import StatusTable from "../../components/admin/StatusTable";
import {
  getAllStatuses,
  deleteStatus,
  updateStatus,
  getAllStatusCategories,
} from "../../api/adminAPI";

function StatusesPage() {
  const { t } = useTranslation();

  const [statuses, setStatuses] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingIds, setDeletingIds] = useState([]);
  const [updatingIds, setUpdatingIds] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStatuses, setTotalStatuses] = useState(0);

  // Fetch statuses
  const fetchStatuses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllStatuses({ search, category, page });
      setStatuses(res.statuses);
      setTotalPages(res.totalPages);
      setTotalStatuses(res.totalStatuses || 0);
    } catch (err) {
      setError(err.message || t("failed_to_fetch_statuses"));
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const cats = await getAllStatusCategories();
      setCategoriesList(cats);
    } catch (err) {
      console.error("Failed to fetch categories:", err.message);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [search, category, page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingIds((prev) => [...prev, id]);
      await deleteStatus(id);
      setSuccess(t("status_deleted_success"));
      setTimeout(() => setSuccess(""), 3000);
      fetchStatuses(); // Refresh
    } catch (err) {
      setError(err.message || t("delete_failed"));
    } finally {
      setDeletingIds((prev) => prev.filter((deletingId) => deletingId !== id));
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      setUpdatingIds((prev) => [...prev, id]);
      await updateStatus(id, updatedData);
      setSuccess(t("status_updated_success"));
      setTimeout(() => setSuccess(""), 3000);
      fetchStatuses(); // Refresh
    } catch (err) {
      setError(err.message || t("update_failed"));
    } finally {
      setUpdatingIds((prev) => prev.filter((updatingId) => updatingId !== id));
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleRefresh = () => {
    setError("");
    setSuccess("");
    setPage(1);
    fetchStatuses();
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`px-3 py-1 rounded ${
          1 === page
            ? "bg-blue-600 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        1
      </button>
    );

    // Show middle pages with ellipsis
    if (totalPages > 2) {
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        start = 2;
        end = Math.min(4, totalPages - 1);
      } else if (page >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push(
          <span key="left-ellipsis" className="px-2">
            ...
          </span>
        );
      }

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded ${
              i === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        );
      }

      if (end < totalPages - 1) {
        pages.push(
          <span key="right-ellipsis" className="px-2">
            ...
          </span>
        );
      }
    }

    // Always show last page if more than 1
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded ${
            totalPages === page
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-6 space-x-2 items-center">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          {t("prev")}
        </button>

        {pages}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          {t("next")}
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t("manage_statuses")}
          </h1>
          <p className="text-gray-600">
            {t("total_statuses")}:{" "}
            <span className="font-semibold">{totalStatuses}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            {t("clear_filters")}
          </button>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg"
          >
            {t("refresh")}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1">
          <input
            type="text"
            placeholder={t("search_status")}
            value={search}
            onChange={handleSearchChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("all_categories")}</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading/Error */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {t("try_again")}
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && statuses.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <StatusTable
            statuses={statuses}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            deletingIds={deletingIds}
            updatingIds={updatingIds}
          />
        </div>
      )}

      {!loading && !error && statuses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t("no_statuses_found")}
          </h3>
          <p className="text-gray-500 mb-4">
            {search || category
              ? t("no_results_for_filters")
              : t("no_statuses_in_system")}
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {t("clear_filters")}
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && statuses.length > 0 && totalPages > 1 && (
        <div className="mt-6">
          {renderPagination()}
          <div className="text-center text-gray-500 mt-2">
            {t("page")} {page} {t("of")} {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusesPage;
