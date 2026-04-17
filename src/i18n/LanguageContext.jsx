import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_LOCALE, getCanonicalPathname, getLocaleFromPathname, localizePath } from "./i18n.js";
import { SUPPORTED_LANGUAGES, translations } from "./translations";

const LanguageContext = createContext(null);

function getValueByPath(obj, path) {
  return path.split(".").reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }
    return undefined;
  }, obj);
}

export function LanguageProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const localeFromPath = getLocaleFromPathname(location.pathname);
  const [language, setLanguageState] = useState(localeFromPath);

  useEffect(() => {
    setLanguageState(localeFromPath);
  }, [localeFromPath]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      window.localStorage.setItem("ferroworks_locale", language);
    }
  }, [language]);

  const value = useMemo(() => {
    const t = (key, fallback = "") => {
      const found = getValueByPath(translations[language] || {}, key);
      if (typeof found === "string") return found;
      return fallback || key;
    };

    const setLanguage = (nextLanguage) => {
      const targetLanguage = nextLanguage || DEFAULT_LOCALE;
      setLanguageState(targetLanguage);

      if (location.pathname.startsWith("/admin")) {
        return;
      }

      const targetPath = localizePath(getCanonicalPathname(location.pathname), targetLanguage);
      navigate(targetPath, { replace: false });
    };

    return {
      language,
      setLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      canonicalPath: getCanonicalPathname(location.pathname),
      localizePath: (pathname, locale = language) => localizePath(pathname, locale),
      t,
    };
  }, [language, location.pathname, navigate]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
