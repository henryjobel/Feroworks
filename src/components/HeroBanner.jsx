import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpeg";

const checkItems = [
  { text: "Levertijd: 2 tot 4 weken" },
  { text: "ISO 9001, VCA, EN-1090, Lloyd's" },
  { text: "Snijden, walsen, zetten en lassen onder een dak" },
  { text: "Vertrouwd door Verwater, Shell en De Kok" },
];

function HeroBanner() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "#141616",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(" + heroBg + ")",
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Overlay - darker on mobile (full overlay), gradient on desktop */}
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: "rgba(20,22,22,0.82)" }}
      />
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(20,22,22,0.88) 0%, rgba(20,22,22,0.80) 30%, rgba(20,22,22,0.55) 55%, rgba(20,22,22,0.15) 80%, rgba(20,22,22,0.0) 100%)",
        }}
      />

      {/* Same container as Navbar: max-w-7xl mx-auto px-8 */}
      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8"
        style={{ paddingTop: "60px", paddingBottom: "60px" }}
      >
        {/* Ferna icon - hidden on mobile */}
        <div className="hidden md:block" style={{ position: "absolute", top: "0px", right: "32px" }}>
          <svg width="96" height="108" viewBox="0 0 102 115" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 13H56V28H28V87H13V13Z" stroke="#C8D400" strokeWidth="7" />
            <path d="M89 102H46V87H74V28H89V102Z" stroke="#C8D400" strokeWidth="7" />
            <path d="M28 28H46V68H56V28H74" stroke="#C8D400" strokeWidth="7" fill="none" />
          </svg>
        </div>

        {/* Headings */}
        <h1
          style={{
            margin: 0,
            padding: 0,
            color: "#C8D400",
            fontFamily: "Arial Black, Arial, sans-serif",
            fontSize: "clamp(30px, 3.2vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
            fontWeight: 900,
          }}
        >
          COMPLEXE STAALPROJECTEN.
        </h1>

        <h2
          style={{
            margin: 0,
            padding: 0,
            color: "#F3F3F3",
            fontFamily: "Arial Black, Arial, sans-serif",
            fontSize: "clamp(30px, 3.2vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
            fontWeight: 900,
          }}
        >
          VOLLEDIG UIT EIGEN WERKPLAATS.
        </h2>

        {/* Subtitle */}
        <p
          style={{
            marginTop: "32px",
            marginBottom: "32px",
            color: "#E0E0E0",
            fontSize: "15px",
            lineHeight: 1.65,
            fontWeight: 400,
            maxWidth: "480px",
          }}
        >
          Maatwerkonderdelen in staal, RVS en aluminium voor<br />
          de industrie. Petrochemie, tankbouw en offshore.
        </p>

        {/* Divider - full width */}
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.18)",
            marginBottom: "22px",
          }}
        />

        {/* 4 check items - 2 cols on mobile, 4 on desktop */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: "12px", marginBottom: "42px" }}
        >
          {checkItems.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                <path d="M2 8.5L6 12.5L14 4.5" stroke="#C8D400" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: "#D8D8D8", fontSize: "13px", lineHeight: 1.45, fontWeight: 400 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          to="/contact"
          style={{
            display: "inline-block",
            textDecoration: "none",
            backgroundColor: "#C8D400",
            color: "#1a1a1a",
            borderRadius: "999px",
            padding: "15px 32px",
            fontSize: "13px",
            fontWeight: 900,
            textTransform: "uppercase",
            fontFamily: "Arial Black, Arial, sans-serif",
            letterSpacing: "1px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b3be00")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C8D400")}
        >
          STUUR UW TEKENING OP
        </Link>
      </div>
    </section>
  );
}

export default HeroBanner;
