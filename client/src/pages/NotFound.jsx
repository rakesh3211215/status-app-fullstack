import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">{t("not_found")}</p>
        <Link to="/" className="text-blue-600 hover:underline text-lg">
          {t("return_to_home")}
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
