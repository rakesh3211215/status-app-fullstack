import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaPlusCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaThLarge,
  FaCaretDown,
} from "react-icons/fa";

function Navbar() {
  const { t } = useTranslation();
  const { currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close menus when route changes
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Hide on admin routes
  if (location.pathname.startsWith("/admin")) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center text-2xl font-bold">
            <span className="text-emerald-400">Status</span>
            <span>App</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <LanguageSwitcher />

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
                >
                  <FaThLarge />
                  <span>{t("dashboard")}</span>
                </Link>

                <Link
                  to="/add-status"
                  className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
                >
                  <FaPlusCircle />
                  <span>{t("add_status")}</span>
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full">
                      <FaUserCircle className="text-xl" />
                    </div>
                    <span className="font-medium">
                      {currentUser.displayName || currentUser.email}
                    </span>
                    <FaCaretDown
                      className={`transition-transform ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700"
                        >
                          <FaUserCircle />
                          <span>{t("admin_dashboard")}</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 text-left"
                      >
                        <FaSignOutAlt />
                        <span>{t("logout")}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
                >
                  <FaSignInAlt />
                  <span>{t("login")}</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <FaUserPlus />
                  <span>{t("register")}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher mobile={true} />
            <button
              onClick={() => setMobileOpen(true)}
              className="ml-4 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Side Drawer */}
      <div
        className={`fixed inset-0 z-50 transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setMobileOpen(false)}
        ></div>

        {/* Drawer Content */}
        <div className="relative w-80 max-w-full h-full bg-gray-800 shadow-xl">
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <Link to="/" className="text-xl font-bold flex items-center">
                <span className="text-emerald-400">Status</span>
                <span>App</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 mb-6 p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full">
                      <FaUserCircle className="text-2xl" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {currentUser.displayName || currentUser.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        {isAdmin ? t("admin") : t("user")}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-3 py-4 hover:bg-gray-700 rounded-md text-lg"
                    >
                      <FaThLarge />
                      <span>{t("dashboard")}</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-3 py-4 hover:bg-gray-700 rounded-md text-lg"
                      >
                        <FaUserCircle />
                        <span>{t("admin_dashboard")}</span>
                      </Link>
                    )}

                    <Link
                      to="/add-status"
                      className="flex items-center gap-3 px-3 py-4 hover:bg-gray-700 rounded-md text-lg"
                    >
                      <FaPlusCircle />
                      <span>{t("add_status")}</span>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="space-y-3 py-4">
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-3 py-4 hover:bg-gray-700 rounded-md text-lg"
                  >
                    <FaSignInAlt />
                    <span>{t("login")}</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-3 px-3 py-4 hover:bg-gray-700 rounded-md text-lg bg-emerald-600 hover:bg-emerald-700"
                  >
                    <FaUserPlus />
                    <span>{t("register")}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {currentUser && (
              <div className="p-4 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-md text-lg"
                >
                  <FaSignOutAlt />
                  <span>{t("logout")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
