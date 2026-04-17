import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpeg";
import { useCms } from "../cms/CmsContext";

function HeroBanner() {
  const { cms } = useCms();
  const hero = cms.hero || {};
  return (
    <section
      className="home-hero"
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
        className="hero-bg"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${hero.image || heroBg})`,
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
            <path d="M13 13H56V28H28V87H13V13Z" stroke="var(--fw-website-primary)" strokeWidth="7" />
            <path d="M89 102H46V87H74V28H89V102Z" stroke="var(--fw-website-primary)" strokeWidth="7" />
            <path d="M28 28H46V68H56V28H74" stroke="var(--fw-website-primary)" strokeWidth="7" fill="none" />
          </svg>
        </div>

        {/* Headings */}
        <h1
          style={{
            margin: 0,
            padding: 0,
            color: "var(--fw-website-primary)",
            fontFamily: "var(--fw-website-heading-font)",
            fontSize: "clamp(30px, 3.2vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
            fontWeight: 900,
          }}
        >
          {hero.line1}
        </h1>

        <h2
          style={{
            margin: 0,
            padding: 0,
            color: "#F3F3F3",
            fontFamily: "var(--fw-website-heading-font)",
            fontSize: "clamp(30px, 3.2vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
            fontWeight: 900,
          }}
        >
          {hero.line2}
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
          {hero.subtitle.split("\n").map((line, i) => <span key={i}>{line}{i < hero.subtitle.split("\n").length - 1 && <br />}</span>)}
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
          className="grid grid-cols-2 md:grid-cols-4 hero-checks"
          style={{ gap: "12px", marginBottom: "42px" }}
        >
          {(hero.checkItems || []).map((text, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                <path d="M2 8.5L6 12.5L14 4.5" stroke="var(--fw-website-primary)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: "#D8D8D8", fontSize: "13px", lineHeight: 1.45, fontWeight: 400 }}>
                {text}
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
            backgroundColor: "var(--fw-website-primary)",
            color: "var(--fw-website-secondary)",
            borderRadius: "999px",
            padding: "15px 32px",
            fontSize: "13px",
            fontWeight: 900,
            textTransform: "uppercase",
            fontFamily: "var(--fw-website-heading-font)",
            letterSpacing: "1px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.94)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
        >
          {hero.cta}
        </Link>
      </div>
    </section>
  );
}

export default HeroBanner;
