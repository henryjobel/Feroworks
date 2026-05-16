import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsContext";
import { useLanguage } from "../i18n/LanguageContext";

function CtaSection() {
  const { cms } = useCms();
  const { localizePath } = useLanguage();
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const cta = cms.cta || {};

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ background: "#141616", padding: "96px 0", overflow: "hidden" }}>
      <style>{`
        .cta-wrap { opacity:0; transform:translateY(24px); transition: opacity .65s ease, transform .65s ease; }
        .cta-vis  { opacity:1; transform:none; }
        .cta-btn:hover { background: var(--fw-website-primary) !important; }
      `}</style>

      <div
        ref={ref}
        className={"max-w-7xl mx-auto px-6 md:px-8 cta-wrap " + (vis ? "cta-vis" : "")}
        style={{ textAlign: "center" }}
      >
        <p
          style={{
            fontFamily: "Arial Black, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "var(--fw-website-primary)",
            margin: "0 0 20px 0",
          }}
        >
          {cta.eyebrow || "KLAAR OM TE STARTEN?"}
        </p>

        <h2
          style={{
            fontFamily: "Arial Black, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(28px, 4vw, 54px)",
            lineHeight: 1.08,
            letterSpacing: "-0.5px",
            margin: "0 0 24px 0",
          }}
        >
          <span style={{ color: "#ffffff" }}>{cta.titleMain || "MAAK VAN UW IDEE"} </span>
          <span style={{ color: "var(--fw-website-primary)" }}>{cta.titleAccent || "EEN PROJECT"}</span>
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#999",
            lineHeight: 1.7,
            maxWidth: "560px",
            margin: "0 auto 44px auto",
          }}
        >
          {cta.text || "Neem contact op en ontdek hoe FerroWorks uw project van ontwerp tot realisatie begeleidt."}
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to={cta.ctaLink || localizePath("/contact")}
            className="cta-btn"
            style={{
              display: "inline-block",
              background: "var(--fw-website-primary-strong)",
              color: "#fff",
              fontFamily: "Arial Black, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              padding: "18px 44px",
              borderRadius: "50px",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            {cta.ctaLabel || "NEEM CONTACT OP"}
          </Link>

          <Link
            to={cta.secondaryLink || localizePath("/diensten")}
            style={{
              display: "inline-block",
              background: "transparent",
              color: "#ccc",
              fontFamily: "Arial Black, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              padding: "18px 44px",
              borderRadius: "50px",
              textDecoration: "none",
              border: "1.5px solid #444",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--fw-website-primary)";
              e.currentTarget.style.color = "var(--fw-website-primary)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "#444";
              e.currentTarget.style.color = "#ccc";
            }}
          >
            {cta.secondaryLabel || "ONZE DIENSTEN"}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
