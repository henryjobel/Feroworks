import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsContext";
import { DEFAULT_LOCALE, getCanonicalPathname, localizePath } from "../i18n/i18n.js";
import { getActiveLocales } from "../i18n/content-localization.js";

function upsertMeta(name, value, property = false) {
  if (!value) return;
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    if (property) {
      element.setAttribute("property", name);
    } else {
      element.setAttribute("name", name);
    }
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
}

function upsertCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function upsertAlternate(locale, href) {
  const selector = `link[rel="alternate"][hreflang="${locale}"]`;
  let link = document.head.querySelector(selector);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", locale);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function syncAlternateLinks(activeLocales, origin, canonicalPath) {
  const allowed = new Set([...activeLocales, "x-default"]);
  const existing = Array.from(document.head.querySelectorAll('link[rel="alternate"][hreflang]'));
  existing.forEach((link) => {
    const locale = link.getAttribute("hreflang");
    if (locale && !allowed.has(locale)) {
      link.remove();
    }
  });

  activeLocales.forEach((locale) => {
    upsertAlternate(locale, `${origin}${localizePath(canonicalPath, locale)}`);
  });
  upsertAlternate("x-default", `${origin}${localizePath(canonicalPath, DEFAULT_LOCALE)}`);
}

export default function RouteSeo() {
  const { cms } = useCms();
  const location = useLocation();
  const site = cms.site || {};
  const path = location.pathname;

  useEffect(() => {
    const origin = window.location.origin;
    const canonicalPath = getCanonicalPathname(path);
    const pageConfig = (cms.pages || []).find((item) => item.path === path);
    let title = site.metaTitle || site.naam || "FerroWorks";
    let description = site.metaDesc || "";

    if (pageConfig?.metaTitle) {
      title = pageConfig.metaTitle;
      description = pageConfig.metaDescription || description;
    } else if (canonicalPath === "/over-ons") {
      title = `Over Ons | ${site.naam || "FerroWorks"}`;
      description = cms.overOns?.verhaal?.tekst1 || description;
    } else if (canonicalPath === "/diensten") {
      title = `Diensten | ${site.naam || "FerroWorks"}`;
      description = "Engineering, productie, coating, montage en onderhoud voor maatwerk metaalprojecten.";
    } else if (canonicalPath.startsWith("/diensten/")) {
      const slug = canonicalPath.split("/").pop();
      const service = (cms.diensten || []).find((item) => item.id === slug);
      title = service?.seoTitle || `${service?.title || "Dienst"} | ${site.naam || "FerroWorks"}`;
      description = service?.seoDescription || service?.excerpt || description;
    } else if (canonicalPath === "/sectoren") {
      title = `Sectoren | ${site.naam || "FerroWorks"}`;
      description = "Metaalmaatwerk voor bouw, industrie, architectuur en maritieme toepassingen.";
    } else if (canonicalPath === "/blog") {
      title = `Blog | ${site.naam || "FerroWorks"}`;
      description = "Kennisartikelen, projectverhalen en technische inzichten van FerroWorks.";
    } else if (canonicalPath.startsWith("/blog/")) {
      const slug = canonicalPath.split("/").pop();
      const post = (cms.blog || []).find((item) => item.slug === slug || String(item.id) === slug);
      title = post?.seoTitle || `${post?.title || "Artikel"} | ${site.naam || "FerroWorks"}`;
      description = post?.seoDescription || post?.excerpt || description;
    }

    document.title = title;
    upsertMeta("description", description);
    upsertMeta("og:title", title, true);
    upsertMeta("og:description", description, true);
    upsertMeta("og:url", `${origin}${path}`, true);
    upsertCanonical(`${origin}${path}`);
    syncAlternateLinks(getActiveLocales(cms.websiteSettings || {}), origin, canonicalPath);

    const website = cms.websiteSettings || {};
    if (website.googleAnalyticsId && typeof window.gtag === "function") {
      window.gtag("config", website.googleAnalyticsId, { page_path: path, page_location: `${origin}${path}` });
    }
    if (website.metaPixelId && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [cms, path, site.metaDesc, site.metaTitle, site.naam]);

  return null;
}
