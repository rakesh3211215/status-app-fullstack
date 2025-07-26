import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminDashboard() {
  const { t } = useTranslation();
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/unauthorized");
    }
  }, [currentUser, isAdmin, navigate]);

  if (!currentUser || !isAdmin) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-grow ml-64 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
