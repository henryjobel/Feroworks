import { useState } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsContext";
import { useLanguage } from "../i18n/LanguageContext";

const navLinks = [
  { key: "overOns", to: "/over-ons" },
  { key: "diensten", to: "/diensten" },
  { key: "sectoren", to: "/sectoren" },
  { key: "blog", to: "/blog" },
  { key: "contact", to: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { cms } = useCms();
  const phone = cms.site?.tel || "+31 (0)165 205 617";

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between" style={{ height: "78px" }}>
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline" style={{ maxWidth: "calc(100% - 56px)" }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="4" fill="#c8d400" />
            <path d="M7 28 L11 14 L16 22 L21 14 L25 28" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
          </svg>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline">
              <span className="text-[24px] font-black text-gray-900 tracking-tight">FERRO</span>
              <span className="text-[24px] font-black tracking-tight" style={{ color: "#c8d400" }}>WORKS</span>
            </div>
            <span className="text-[13px] italic text-gray-500 font-normal" style={{ fontFamily: "Georgia, serif" }}>
              {t("nav.brandTagline", "metalwork")}
            </span>
          </div>
        </Link>

        <ul className="hidden lg:flex items-center gap-7 xl:gap-9 list-none flex-1 justify-center m-0 p-0">
          {navLinks.map((item) => (
            <li key={item.key}>
              <Link
                to={item.to}
                className="text-gray-800 text-[17px] font-semibold tracking-[0.01em] no-underline hover:text-[#8ab61e] transition-colors duration-200 whitespace-nowrap"
              >
                {t(`nav.${item.key}`, item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-5 xl:gap-6 shrink-0">
          <a href={`tel:${phone.replace(/[\s()]/g, "")}`} className="text-gray-800 text-[16px] font-medium no-underline hover:text-[#8ab61e] transition-colors duration-200 whitespace-nowrap">
            {phone}
          </a>
          <Link
            to="/contact"
            className="no-underline text-white text-[14px] font-bold tracking-wide px-6 py-3 rounded-full whitespace-nowrap transition-colors duration-200"
            style={{ backgroundColor: "#8ab61e" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7aa018")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8ab61e")}
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
              to={item.to}
              className="text-gray-800 text-[18px] font-semibold no-underline py-3 border-b border-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              {t(`nav.${item.key}`, item.key)}
            </Link>
          ))}
          <a href={`tel:${phone.replace(/[\s()]/g, "")}`} className="text-gray-800 text-[16px] font-medium no-underline py-3">
            {phone}
          </a>
          <Link
            to="/contact"
            className="no-underline text-white text-[14px] font-bold tracking-wide px-6 py-3 rounded-full text-center"
            style={{ backgroundColor: "#8ab61e" }}
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
