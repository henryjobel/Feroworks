import { useState } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsContext";
import { useLanguage } from "../i18n/LanguageContext";
import { getActiveLocales, isLocalizationEnabled } from "../../../shared/content-localization.js";

const navLinks = [
  { key: "overOns", to: "/over-ons" },
  { key: "diensten", to: "/diensten" },
  { key: "sectoren", to: "/sectoren" },
  { key: "blog", to: "/blog" },
  { key: "contact", to: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, language, setLanguage, supportedLanguages, localizePath } = useLanguage();
  const { cms } = useCms();
  const phone = cms.site?.tel || "+31 (0)165 205 617";
  const localizationEnabled = isLocalizationEnabled(cms.websiteSettings || {});
  const visibleLanguages = supportedLanguages.filter((item) => getActiveLocales(cms.websiteSettings || {}).includes(item.code));

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between" style={{ height: "78px" }}>
        <Link to={localizePath("/")} className="flex items-center gap-2 shrink-0 no-underline" style={{ maxWidth: "calc(100% - 56px)" }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="4" fill="var(--fw-website-primary)" />
            <path d="M7 28 L11 14 L16 22 L21 14 L25 28" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
          </svg>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline">
              <span className="site-title text-[24px] font-black text-gray-900 tracking-tight">FERRO</span>
              <span className="site-title text-[24px] font-black tracking-tight theme-primary-text">WORKS</span>
            </div>
            <span className="text-[13px] italic text-gray-500 font-normal">
              {t("nav.brandTagline", "metalwork")}
            </span>
          </div>
        </Link>

        <ul className="hidden lg:flex items-center gap-7 xl:gap-9 list-none flex-1 justify-center m-0 p-0">
          {navLinks.map((item) => (
            <li key={item.key}>
              <Link
                to={localizePath(item.to)}
                className="site-heading text-gray-800 text-[17px] font-semibold tracking-[0.01em] no-underline transition-colors duration-200 whitespace-nowrap"
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fw-website-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "")}
              >
                {t(`nav.${item.key}`, item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-5 xl:gap-6 shrink-0">
          <a href={`tel:${phone.replace(/[\s()]/g, "")}`} className="text-gray-800 text-[16px] font-medium no-underline hover:text-[var(--fw-website-primary-strong)] transition-colors duration-200 whitespace-nowrap">
            {phone}
          </a>
          {localizationEnabled ? (
         <div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "2px",
    border: "1px solid #ececec",
    borderRadius: "999px",
    padding: "2px",
  }}
  aria-label={t("nav.languageLabel", "Language")}
>
  {visibleLanguages.map((item) => (
    <button
      key={item.code}
      type="button"
      onClick={() => setLanguage(item.code)}
      style={{
        minWidth: "32px",
        border: "none",
        borderRadius: "999px",
        background:
          language === item.code
            ? "var(--fw-website-primary)"
            : "transparent",
        color:
          language === item.code
            ? "var(--fw-website-secondary)"
            : "#556070",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.4px",
        padding: "4px 8px",
        cursor: "pointer",
        textTransform: "uppercase",
        lineHeight: 1,
      }}
    >
      {item.shortLabel || item.code}
    </button>
  ))}
</div>
          ) : null}
          <Link
            to={localizePath("/contact")}
            className="site-heading no-underline text-white text-[14px] font-bold tracking-wide px-6 py-3 rounded-full whitespace-nowrap transition-colors duration-200 theme-primary-bg"
            style={{ color: "var(--fw-website-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.94)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
          >
            {t("nav.cta", "CONTACT US")}
          </Link>
        </div>

        <button
          className="site-menu-button lg:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 bg-transparent border-none cursor-pointer p-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t("nav.menuToggle", "Toggle menu")}
        >
          <span className="block w-6 h-0.5 bg-gray-800 transition-all duration-300" style={{ transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none" }} />
          <span className="block w-6 h-0.5 bg-gray-800 transition-all duration-300" style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-6 h-0.5 bg-gray-800 transition-all duration-300" style={{ transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }} />
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((item) => (
            <Link
              key={item.key}
              to={localizePath(item.to)}
              className="text-gray-800 text-[18px] font-semibold no-underline py-3 border-b border-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              {t(`nav.${item.key}`, item.key)}
            </Link>
          ))}
          {localizationEnabled ? (
          <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
            {visibleLanguages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLanguage(item.code);
                  setMenuOpen(false);
                }}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "999px",
                  background: language === item.code ? "var(--fw-website-primary)" : "#fff",
                  color: language === item.code ? "var(--fw-website-secondary)" : "#4b5563",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.6px",
                  padding: "8px 12px",
                  textTransform: "uppercase",
                }}
              >
                {item.shortLabel || item.code}
              </button>
            ))}
          </div>
          ) : null}
          <a href={`tel:${phone.replace(/[\s()]/g, "")}`} className="text-gray-800 text-[16px] font-medium no-underline py-3">
            {phone}
          </a>
          <Link
            to={localizePath("/contact")}
            className="site-heading no-underline text-[14px] font-bold tracking-wide px-6 py-3 rounded-full text-center theme-primary-bg"
            style={{ color: "var(--fw-website-secondary)" }}
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.cta", "CONTACT US")}
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

