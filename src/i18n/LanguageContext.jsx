import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SUPPORTED_LANGUAGES, translations } from "./translations";

const LanguageContext = createContext(null);
const DEFAULT_LANGUAGE = "en";

function getInitialLanguage() {
  if (typeof navigator !== "undefined") {
    const browserLangs = Array.isArray(navigator.languages)
      ? navigator.languages
      : [navigator.language];

    for (const raw of browserLangs) {
      const code = String(raw || "").toLowerCase().split("-")[0];
      if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
        return code;
      }
    }
  }

  return DEFAULT_LANGUAGE;
}

function getValueByPath(obj, path) {
  return path.split(".").reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }
    return undefined;
  }, obj);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value = useMemo(() => {
    const t = (key, fallback = "") => {
      const found = getValueByPath(translations[language] || {}, key);
      if (typeof found === "string") return found;
      return fallback || key;
    };

    return {
      language,
      setLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      t,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
