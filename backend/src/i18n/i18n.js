export const DEFAULT_LOCALE = "nl";

export const SUPPORTED_LOCALES = [
  { code: "nl", label: "Nederlands", shortLabel: "NL" },
  { code: "en", label: "English", shortLabel: "EN" },
];

export const LOCALE_SET = new Set(SUPPORTED_LOCALES.map((item) => item.code));

export const LOCALIZED_ROUTE_MAP = {
  "/": { nl: "/", en: "/en" },
  "/over-ons": { nl: "/over-ons", en: "/en/about" },
  "/diensten": { nl: "/diensten", en: "/en/services" },
  "/sectoren": { nl: "/sectoren", en: "/en/sectors" },
  "/blog": { nl: "/blog", en: "/en/blog" },
  "/contact": { nl: "/contact", en: "/en/contact" },
  "/privacy-policy": { nl: "/privacy-policy", en: "/en/privacy-policy" },
  "/algemene-voorwaarden": { nl: "/algemene-voorwaarden", en: "/en/terms-and-conditions" },
};

const CANONICAL_BASES = Object.keys(LOCALIZED_ROUTE_MAP).sort((a, b) => b.length - a.length);
const LOCALIZED_ENTRIES = CANONICAL_BASES.flatMap((basePath) =>
  Object.entries(LOCALIZED_ROUTE_MAP[basePath]).map(([locale, localizedPath]) => ({
    canonicalBasePath: basePath,
    locale,
    localizedBasePath: localizedPath,
  })),
).sort((a, b) => b.localizedBasePath.length - a.localizedBasePath.length);

function ensureLeadingSlash(pathname) {
  if (!pathname) {
    return "/";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function trimTrailingSlash(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function normalizePathname(pathname) {
  return trimTrailingSlash(ensureLeadingSlash(pathname));
}

export function getLocaleFromPathname(pathname) {
  const normalized = normalizePathname(pathname);

  for (const entry of LOCALIZED_ENTRIES) {
    if (
      normalized === entry.localizedBasePath ||
      normalized.startsWith(`${entry.localizedBasePath}/`)
    ) {
      return entry.locale;
    }
  }

  return DEFAULT_LOCALE;
}

export function getCanonicalPathname(pathname) {
  const normalized = normalizePathname(pathname);

  for (const entry of LOCALIZED_ENTRIES) {
    if (normalized === entry.localizedBasePath) {
      return entry.canonicalBasePath;
    }

    if (normalized.startsWith(`${entry.localizedBasePath}/`)) {
      const suffix = normalized.slice(entry.localizedBasePath.length);
      return trimTrailingSlash(`${entry.canonicalBasePath}${suffix}`);
    }
  }

  return normalized;
}

export function localizePath(pathname, locale = DEFAULT_LOCALE) {
  const safeLocale = LOCALE_SET.has(locale) ? locale : DEFAULT_LOCALE;
  const canonicalPath = getCanonicalPathname(pathname);

  for (const basePath of CANONICAL_BASES) {
    if (canonicalPath === basePath || canonicalPath.startsWith(`${basePath}/`)) {
      const localizedBase = LOCALIZED_ROUTE_MAP[basePath]?.[safeLocale] ?? LOCALIZED_ROUTE_MAP[basePath]?.[DEFAULT_LOCALE] ?? basePath;
      const suffix = canonicalPath.slice(basePath.length);
      return trimTrailingSlash(`${localizedBase}${suffix}`) || "/";
    }
  }

  if (safeLocale === DEFAULT_LOCALE) {
    return canonicalPath;
  }

  return canonicalPath === "/" ? `/${safeLocale}` : `/${safeLocale}${canonicalPath}`;
}

export function getAlternateLocalePath(pathname, locale) {
  return localizePath(pathname, locale);
}
