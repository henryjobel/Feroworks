import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsContext";
import { DEFAULT_THEME_SETTINGS, getFontOption } from "./themeConfig";

function normalizeHex(hex, fallback) {
  const value = String(hex || "").trim();
  const valid = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
  if (!valid) {
    return fallback;
  }
  if (value.length === 4) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toLowerCase();
  }
  return value.toLowerCase();
}

function hexToRgb(hex) {
  const safe = normalizeHex(hex, "#000000").slice(1);
  return {
    r: Number.parseInt(safe.slice(0, 2), 16),
    g: Number.parseInt(safe.slice(2, 4), 16),
    b: Number.parseInt(safe.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(hexA, hexB, weight = 0.5) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex({
    r: a.r + (b.r - a.r) * weight,
    g: a.g + (b.g - a.g) * weight,
    b: a.b + (b.b - a.b) * weight,
  });
}

function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ThemeStyles() {
  const location = useLocation();
  const { cms } = useCms();
  const theme = {
    ...DEFAULT_THEME_SETTINGS,
    ...(cms.websiteSettings?.theme || {}),
  };

  const dashboardFont = getFontOption(theme.dashboardFont);
  const websiteFont = getFontOption(theme.websiteFont);
  const isAdmin = location.pathname.startsWith("/admin");
  const dashboardPrimary = normalizeHex(theme.dashboardPrimaryColor, DEFAULT_THEME_SETTINGS.dashboardPrimaryColor);
  const dashboardSecondary = normalizeHex(theme.dashboardSecondaryColor, DEFAULT_THEME_SETTINGS.dashboardSecondaryColor);
  const websitePrimary = normalizeHex(theme.websitePrimaryColor, DEFAULT_THEME_SETTINGS.websitePrimaryColor);
  const websiteSecondary = normalizeHex(theme.websiteSecondaryColor, DEFAULT_THEME_SETTINGS.websiteSecondaryColor);

  const palette = {
    dashboardPrimaryStrong: mix(dashboardPrimary, "#000000", 0.18),
    dashboardPrimarySoft: mix(dashboardPrimary, "#ffffff", 0.82),
    dashboardPrimaryMuted: mix(dashboardPrimary, "#ffffff", 0.65),
    websitePrimaryStrong: mix(websitePrimary, "#000000", 0.18),
    websitePrimarySoft: mix(websitePrimary, "#ffffff", 0.84),
    websitePrimaryMuted: mix(websitePrimary, "#ffffff", 0.68),
    websitePrimaryDeep: mix(websitePrimary, websiteSecondary, 0.28),
  };

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.body.dataset.adminRoute = isAdmin ? "true" : "false";
  }, [isAdmin]);

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Montserrat:wght@400;600;700;800;900&family=Oswald:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800;900&family=Poppins:wght@400;600;700;800;900&family=Source+Sans+3:wght@400;600;700;800&display=swap');

      :root {
        --fw-dashboard-heading-font: ${dashboardFont.stack};
        --fw-dashboard-body-font: ${dashboardFont.bodyStack};
        --fw-dashboard-primary: ${dashboardPrimary};
        --fw-dashboard-primary-strong: ${palette.dashboardPrimaryStrong};
        --fw-dashboard-primary-soft: ${palette.dashboardPrimarySoft};
        --fw-dashboard-primary-muted: ${palette.dashboardPrimaryMuted};
        --fw-dashboard-primary-rgb-soft: ${withAlpha(dashboardPrimary, 0.12)};
        --fw-dashboard-secondary: ${dashboardSecondary};
        --fw-website-heading-font: ${websiteFont.stack};
        --fw-website-body-font: ${websiteFont.bodyStack};
        --fw-website-primary: ${websitePrimary};
        --fw-website-primary-strong: ${palette.websitePrimaryStrong};
        --fw-website-primary-soft: ${palette.websitePrimarySoft};
        --fw-website-primary-muted: ${palette.websitePrimaryMuted};
        --fw-website-primary-deep: ${palette.websitePrimaryDeep};
        --fw-website-primary-rgb-soft: ${withAlpha(websitePrimary, 0.12)};
        --fw-website-secondary: ${websiteSecondary};
      }

      body[data-admin-route="true"] {
        font-family: var(--fw-dashboard-body-font);
      }

      body[data-admin-route="true"] h1,
      body[data-admin-route="true"] h2,
      body[data-admin-route="true"] h3,
      body[data-admin-route="true"] h4,
      body[data-admin-route="true"] button,
      body[data-admin-route="true"] label {
        font-family: var(--fw-dashboard-heading-font) !important;
      }

      body[data-admin-route="false"] {
        font-family: var(--fw-website-body-font);
      }

      body[data-admin-route="false"] h1,
      body[data-admin-route="false"] h2,
      body[data-admin-route="false"] h3,
      body[data-admin-route="false"] h4,
      body[data-admin-route="false"] h5,
      body[data-admin-route="false"] h6,
      body[data-admin-route="false"] .site-title,
      body[data-admin-route="false"] .site-heading {
        font-family: var(--fw-website-heading-font) !important;
      }

      body[data-admin-route="false"] a:not(.no-theme-link) {
        transition: color .2s ease, border-color .2s ease, background-color .2s ease;
      }

      body[data-admin-route="false"] .theme-primary-text {
        color: var(--fw-website-primary) !important;
      }

      body[data-admin-route="false"] .theme-primary-bg {
        background: var(--fw-website-primary) !important;
        background-color: var(--fw-website-primary) !important;
      }

      body[data-admin-route="false"] .theme-primary-bg-strong {
        background: var(--fw-website-primary-strong) !important;
        background-color: var(--fw-website-primary-strong) !important;
      }

      body[data-admin-route="false"] .theme-primary-bg-soft {
        background: var(--fw-website-primary-soft) !important;
        background-color: var(--fw-website-primary-soft) !important;
      }

      body[data-admin-route="false"] .theme-primary-border {
        border-color: var(--fw-website-primary) !important;
      }

      body[data-admin-route="false"] .theme-primary-border-strong {
        border-color: var(--fw-website-primary-strong) !important;
      }

      body[data-admin-route="false"] .theme-secondary-bg {
        background: var(--fw-website-secondary) !important;
        background-color: var(--fw-website-secondary) !important;
      }

      body[data-admin-route="false"] .theme-secondary-text {
        color: var(--fw-website-secondary) !important;
      }
    `}</style>
  );
}
