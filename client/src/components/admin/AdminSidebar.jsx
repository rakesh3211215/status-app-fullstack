import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AdminSidebar() {
  const { t } = useTranslation();

  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">{t("admin_dashboard")}</h2>
      </div>
      <nav className="mt-4">
        <ul>
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `block px-4 py-2 hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {t("dashboard")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `block px-4 py-2 hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {t("users")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/statuses"
              className={({ isActive }) =>
                `block px-4 py-2 hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {t("statuses")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `block px-4 py-2 hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {t("categories")}
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminSidebar;
