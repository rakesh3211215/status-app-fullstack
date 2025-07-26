import React from "react";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} {t("welcome")}.{" "}
          {t("all_rights_reserved")}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
