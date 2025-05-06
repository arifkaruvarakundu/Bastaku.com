import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";


const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
];

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  // Inline Styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1rem",
  };

  const buttonStyle = (isSelected) => ({
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    borderRadius: "25px",
    border: "2px solid #007bff",
    backgroundColor: isSelected ? "#007bff" : "#fff",
    color: isSelected ? "#fff" : "#007bff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: isSelected ? "bold" : "normal",
    boxShadow: isSelected ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
  });

  return (
    <div style={containerStyle}>
      {languages.map((lng) => (
        <button
          key={lng.code}
          onClick={() => changeLanguage(lng.code)}
          style={buttonStyle(lng.code === i18next.language)}
        >
          {lng.name}
        </button>
      ))}
    </div>
  );
}

export default LanguageSelector;
