import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { isLocalizationEnabled, localizeCmsContent } from "../i18n/content-localization.js";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";
import { DEFAULT_CMS } from "./defaultContent";
import { resolveCmsMedia } from "../utils/media";

export const CmsContext = createContext(null);

function deepMerge(defaults, saved) {
  const result = { ...defaults };
  for (const key of Object.keys(saved || {})) {
    if (
      key in defaults &&
      typeof defaults[key] === "object" &&
      defaults[key] !== null &&
      !Array.isArray(defaults[key]) &&
      typeof saved[key] === "object" &&
      saved[key] !== null &&
      !Array.isArray(saved[key])
    ) {
      result[key] = deepMerge(defaults[key], saved[key]);
    } else {
      result[key] = saved[key];
    }
  }
  return result;
}

export function CmsProvider({ children, initialCms = null }) {
  const { language } = useLanguage();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [rawCms, setRawCms] = useState(() => resolveCmsMedia(deepMerge(DEFAULT_CMS, initialCms || {})));
  const [loading, setLoading] = useState(!initialCms);
  const [error, setError] = useState("");

  const refreshCms = async () => {
    setLoading(true);
    try {
      const data = await api.getCms();
      setRawCms(resolveCmsMedia(deepMerge(DEFAULT_CMS, data)));
      setError("");
    } catch (err) {
      setRawCms(DEFAULT_CMS);
      setError(err.message || "Kon CMS data niet laden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialCms) {
      refreshCms();
    }
  }, [initialCms]);

  const updateCms = async (key, value) => {
    try {
      await api.updateSection(key, value);
      setRawCms((prev) => resolveCmsMedia({ ...prev, [key]: value }));
      setError("");
      return true;
    } catch (err) {
      setError(err.message || "Opslaan mislukt.");
      return false;
    }
  };

  const resetCms = async () => {
    await refreshCms();
  };

  const cms = useMemo(() => {
    if (isAdminRoute) {
      return rawCms;
    }

    if (!isLocalizationEnabled(rawCms.websiteSettings || {})) {
      return rawCms;
    }

    return localizeCmsContent(rawCms, language);
  }, [isAdminRoute, language, rawCms]);

  const value = useMemo(
    () => ({ cms, rawCms, updateCms, resetCms, refreshCms, loading, error }),
    [cms, rawCms, loading, error],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used inside <CmsProvider>");
  return ctx;
}
