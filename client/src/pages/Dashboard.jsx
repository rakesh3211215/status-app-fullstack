import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFilter,
  FaWhatsapp,
  FaCopy,
  FaCheck,
  FaPlus,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

function Dashboard() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedStatusId, setCopiedStatusId] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const topRef = useRef(null); // Ref for scrolling to top

  // Fetch statuses
  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/status`, {
        params: {
          page,
          limit: 9,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          search: querySearch,
        },
      });
      setStatuses(data.statuses || data.docs || data);
      setTotalPages(
        data.totalPages || Math.ceil((data.totalDocs || data.total) / 9) || 1
      );
      setError(null);
    } catch (error) {
      console.error("Error fetching statuses:", error.message);
      setError(t("error_loading_statuses"));
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/status/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  // Fetch data on filter/search/page change
  useEffect(() => {
    fetchStatuses();
  }, [page, categoryFilter, querySearch]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Submit search form
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuerySearch(search);
  };

  // Copy status text to clipboard
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedStatusId(id);
    setTimeout(() => setCopiedStatusId(null), 1500);
  };

  // Share status via WhatsApp
  const handleShareWhatsApp = (status) => {
    const text = `${status.title}\n\n${status.description}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset filters
  const resetFilters = () => {
    setCategoryFilter("all");
    setSearch("");
    setQuerySearch("");
    setPage(1);
  };

  // Scroll to top whenever page changes
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);

  // Pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    // Add first page
    pages.push(
      <button
        key={1}
        onClick={() => setPage(1)}
        className={`w-10 h-10 rounded-full ${
          1 === page
            ? "bg-[#075e54] text-white"
            : "bg-[#128c7e] text-white hover:bg-[#075e54]"
        }`}
      >
        1
      </button>
    );

    // Add middle pages with ellipsis
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
          <span key="left-ellipsis" className="text-white px-2">
            ...
          </span>
        );
      }

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`w-10 h-10 rounded-full ${
              i === page
                ? "bg-[#075e54] text-white"
                : "bg-[#128c7e] text-white hover:bg-[#075e54]"
            }`}
          >
            {i}
          </button>
        );
      }

      if (end < totalPages - 1) {
        pages.push(
          <span key="right-ellipsis" className="text-white px-2">
            ...
          </span>
        );
      }
    }

    // Add last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => setPage(totalPages)}
          className={`w-10 h-10 rounded-full ${
            totalPages === page
              ? "bg-[#075e54] text-white"
              : "bg-[#128c7e] text-white hover:bg-[#075e54]"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-8">
        <nav className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className={`p-2 rounded-full ${
              page === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-white hover:bg-[#075e54]"
            }`}
          >
            <FaAngleLeft />
          </button>

          {pages}

          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className={`p-2 rounded-full ${
              page === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-white hover:bg-[#075e54]"
            }`}
          >
            <FaAngleRight />
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#128c7e] to-[#075e54] pb-8">
      {/* Scroll anchor for top of page */}
      <div ref={topRef}></div>

      {/* Header */}
      <div className="bg-[#128c7e] text-white px-4 py-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <FaWhatsapp className="text-2xl mr-3" />
            <h1 className="text-xl font-bold">{t("dashboard")}</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t("search_statuses")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-[#075e54] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-200"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200" />
            </form>

            <div className="flex items-center bg-[#075e54] rounded-lg px-4 py-2">
              <FaFilter className="text-white text-sm mr-2" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-white text-sm focus:outline-none pr-6 appearance-none w-full"
              >
                <option className="text-black" value="all">
                  {t("all_categories")}
                </option>
                {categories.map((category) => (
                  <option
                    className="text-black"
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 mb-4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
                <div className="p-4 flex justify-between border-t border-gray-100">
                  <div className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {t("error_loading")}
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchStatuses}
              className="bg-[#128c7e] hover:bg-[#075e54] text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              {t("try_again")}
            </button>
          </div>
        ) : statuses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto text-center">
            <div className="text-[#128c7e] text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {t("no_statuses_found")}
            </h3>
            <p className="text-gray-600 mb-6">
              {querySearch
                ? t("no_results_for_query", { query: querySearch })
                : t("no_statuses_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={resetFilters}
                className="bg-[#128c7e] hover:bg-[#075e54] text-white font-bold py-3 px-6 rounded-full transition-colors"
              >
                {t("reset_filters")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {statuses.map((status) => (
                <div
                  key={status._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-[#075e54] mb-2">
                      {status.title}
                    </h2>
                    <p className="text-gray-700 mb-4 whitespace-pre-line">
                      {status.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="inline-block bg-[#dcf8c6] text-[#075e54] text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {status.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(status.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex justify-between border-t border-gray-100">
                    <button
                      onClick={() => handleShareWhatsApp(status)}
                      className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-full transition-colors"
                    >
                      <FaWhatsapp />
                      <span className="hidden sm:inline">{t("share")}</span>
                    </button>

                    <button
                      onClick={() =>
                        handleCopy(
                          `${status.title}\n\n${status.description}`,
                          status._id
                        )
                      }
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full transition-colors"
                    >
                      {copiedStatusId === status._id ? (
                        <>
                          <FaCheck className="text-green-500" />
                          <span className="hidden sm:inline">
                            {t("copied")}
                          </span>
                        </>
                      ) : (
                        <>
                          <FaCopy />
                          <span className="hidden sm:inline">{t("copy")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {renderPagination()}
          </>
        )}
      </div>

      {/* Floating Action Buttons */}
      {currentUser && (
        <Link
          to="/add-status"
          className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] transition-all transform hover:scale-110 z-20"
        >
          <FaPlus className="text-2xl" />
        </Link>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 bg-[#128c7e] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#075e54] transition-all z-20"
        >
          <span className="text-lg font-bold">↑</span>
        </button>
      )}
    </div>
  );
}

export default Dashboard;
