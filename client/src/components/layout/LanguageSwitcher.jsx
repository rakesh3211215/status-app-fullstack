import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";

function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-blue-700 text-white px-2 py-1 rounded cursor-pointer appearance-none"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="bn">বাংলা</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;
