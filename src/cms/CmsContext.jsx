import { createContext, useContext, useState } from "react";
import { DEFAULT_CMS } from "./defaultContent";

const CmsContext = createContext(null);

function deepMerge(defaults, saved) {
  const result = { ...defaults };
  for (const key of Object.keys(saved)) {
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

export function CmsProvider({ children }) {
  const [cms, setCms] = useState(() => {
    try {
      const raw = localStorage.getItem("ferroworks_cms");
      if (raw) {
        const saved = JSON.parse(raw);
        return deepMerge(DEFAULT_CMS, saved);
      }
    } catch {
      // corrupted localStorage — use defaults
    }
    return DEFAULT_CMS;
  });

  // Update a top-level CMS key (e.g. "hero", "stats", "blog", "diensten")
  const updateCms = (key, value) => {
    setCms((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem("ferroworks_cms", JSON.stringify(next));
      } catch {
        // storage full — ignore
      }
      return next;
    });
  };

  // Reset entire CMS to defaults
  const resetCms = () => {
    localStorage.removeItem("ferroworks_cms");
    setCms(DEFAULT_CMS);
  };

  return (
    <CmsContext.Provider value={{ cms, updateCms, resetCms }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used inside <CmsProvider>");
  return ctx;
}
