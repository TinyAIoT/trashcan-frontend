import React from "react";
import { useTranslation } from "../lib/TranslationContext";
import { GlobeIcon } from "lucide-react"; // Import Globe icon

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "de" : "en";
    setLanguage(newLanguage);
  };

  return (
    <div className="language-switcher-container">
      <div
        className="icon-button"
        onClick={toggleLanguage}
        title={`Switch to ${language === "en" ? "German" : "English"}`} // Tooltip for accessibility
      >
        <GlobeIcon className="h-6 w-6 text-gray-600" />
      </div>
    </div>
  );
}
