const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function trimTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function resolveMediaUrl(value) {
  if (!value || typeof value !== "string") {
    return value || "";
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  if (value.startsWith("/")) {
    return API_BASE ? `${trimTrailingSlash(API_BASE)}${value}` : value;
  }

  return value;
}

export function resolveCmsMedia(value) {
  if (Array.isArray(value)) {
    return value.map(resolveCmsMedia);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, resolveCmsMedia(entryValue)]),
    );
  }

  if (typeof value === "string" && value.startsWith("/uploads/")) {
    return resolveMediaUrl(value);
  }

  return value;
}
