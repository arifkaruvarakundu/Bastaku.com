import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { startTransition } from "react";
import i18next from "i18next";

const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
];

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    
      i18n.changeLanguage(lng);
    
  };

  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div className="btn-container">
      {languages.map((lng) => (
        <button
          className={lng.code === i18next.language ? "selected" : ""}
          key={lng.code}
          onClick={() => changeLanguage(lng.code)}
        >
          {lng.name}
        </button>
      ))}
    </div>
  );
}

export default LanguageSelector;
