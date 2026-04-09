import { useState } from "react";
import { Link } from "react-router-dom";

const navLinks = ["Over ons", "Diensten", "Sectoren", "Blog", "Contact"];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between" style={{ height: "72px" }}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="4" fill="#c8d400" />
            <path d="M7 28 L11 14 L16 22 L21 14 L25 28" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
          </svg>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline">
              <span className="text-[22px] font-black text-gray-900 tracking-tight">FER</span>
              <span className="text-[22px] font-black tracking-tight" style={{ color: "#c8d400" }}>NA</span>
            </div>
            <span className="text-[12px] italic text-gray-500 font-normal" style={{ fontFamily: "Georgia, serif" }}>
              services
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8 list-none flex-1 justify-center m-0 p-0">
          {navLinks.map((item) => (
            <li key={item}>
              <Link
                to={"/" + item.toLowerCase().replace(" ", "-")}
                className="text-gray-800 text-[15px] no-underline hover:text-[#8ab61e] transition-colors duration-200 whitespace-nowrap"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop phone + CTA */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          <a href="tel:+31165205617" className="text-gray-800 text-[15px] no-underline hover:text-[#8ab61e] transition-colors duration-200 whitespace-nowrap">
            +31 (0)165 205 617
          </a>
          <Link
            to="/contact"
            className="no-underline text-white text-[13px] font-bold tracking-wide px-6 py-3 rounded-full whitespace-nowrap transition-colors duration-200"
            style={{ backgroundColor: "#8ab61e" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7aa018")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8ab61e")}
          >
            NEEM CONTACT OP
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 bg-transparent border-none cursor-pointer p-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-0.5 bg-gray-800 transition-all duration-300"
            style={{ transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none" }}
          />
          <span
            className="block w-6 h-0.5 bg-gray-800 transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-0.5 bg-gray-800 transition-all duration-300"
            style={{ transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }}
          />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((item) => (
            <Link
              key={item}
              to={"/" + item.toLowerCase().replace(" ", "-")}
              className="text-gray-800 text-[16px] no-underline py-2 border-b border-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <a href="tel:+31165205617" className="text-gray-800 text-[15px] no-underline py-2">
            +31 (0)165 205 617
          </a>
          <Link
            to="/contact"
            className="no-underline text-white text-[13px] font-bold tracking-wide px-6 py-3 rounded-full text-center"
            style={{ backgroundColor: "#8ab61e" }}
            onClick={() => setMenuOpen(false)}
          >
            NEEM CONTACT OP
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
