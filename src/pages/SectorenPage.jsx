import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpeg";
import imgAbout1 from "../assets/about/about-us1.jpeg";
import imgAbout2 from "../assets/about/about-us2.jpeg";
import imgAbout3 from "../assets/about/about-us3.jpeg";
import imgMachine from "../assets/over-ons1.png";
import imgLandscape from "../assets/over-ons2.png";
import { useCms } from "../cms/CmsContext";
import RichTextContent from "../components/RichTextContent";

const FALLBACK_IMAGES = [imgAbout1, imgMachine, imgLandscape, imgAbout2, imgAbout3];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); }, { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0, marginTop: "3px" }}>
      <polyline points="3,11 9,17 20,5" stroke="#c8d400" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PageHero() {
  return (
    <section style={{ position: "relative", width: "100%", minHeight: "380px", display: "flex", alignItems: "center", overflow: "hidden", background: "#141616" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center right" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(20,22,22,0.94) 0%,rgba(20,22,22,0.76) 55%,rgba(20,22,22,0.4) 100%)" }} />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <Link to="/" style={{ color: "#c8d400", fontSize: "13px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Home</Link>
          <span style={{ color: "#666", fontSize: "13px" }}>›</span>
          <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Sectoren</span>
        </div>
        <h1 style={{ margin: "0 0 16px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,56px)", lineHeight: 1.05, letterSpacing: "-0.5px", textTransform: "uppercase" }}>
          <span style={{ color: "#c8d400" }}>STAAL, RVS & ALU </span><span style={{ color: "#fff" }}>IN ELKE SECTOR</span>
        </h1>
        <p style={{ margin: 0, color: "#bbb", fontSize: "clamp(14px,1.6vw,17px)", lineHeight: 1.6, maxWidth: "540px" }}>
          FerroWorks levert maatwerk metaaloplossingen voor bouw, industrie, architectuur en maritieme toepassingen. Altijd vakkundig, altijd op maat.
        </p>
        <div style={{ width: "56px", height: "4px", background: "#c8d400", marginTop: "28px", borderRadius: "2px" }} />
      </div>
    </section>
  );
}

function IntroStrip() {
  const [ref, vis] = useInView(0.15);
  const { cms } = useCms();
  const stats = cms.stats || [];
  return (
    <section style={{ background: "#1c1c1c", padding: "56px 0" }}>
      <style>{`.is-sp{opacity:0;transform:translateY(18px);transition:opacity .5s ease,transform .5s ease}.is-sp-on .is-sp{opacity:1;transform:none}`}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 is-sp-grid " + (vis ? "is-sp-on" : "")}
        style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length},1fr)`, gap: "24px" }}>
        {stats.map((item, i) => (
          <div key={i} className="is-sp" style={{ borderLeft: "3px solid #c8d400", paddingLeft: "20px", transitionDelay: `${i * 0.1}s` }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(28px,3vw,40px)", color: "#c8d400", lineHeight: 1, letterSpacing: "-0.5px" }}>{item.number}</div>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", color: "#fff", textTransform: "uppercase", letterSpacing: "0.3px", marginTop: "6px" }}>{item.desc.split(" ").slice(0, 2).join(" ")}</div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "4px", lineHeight: 1.4 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectorBlock({ sector, index }) {
  const [ref, vis] = useInView();
  const isEven = index % 2 === 0;
  const bg = isEven ? "#f4f4f4" : "#fff";
  const img = sector.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const checkItems = sector.items ? sector.items.split("\n").filter(Boolean) : [];

  const textBlock = (
    <div>
      <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", color: "#c8d400", textTransform: "uppercase", letterSpacing: "1.5px" }}>{sector.nr} — SECTOR</span>
      <h2 style={{ margin: "12px 0 16px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px,2.6vw,36px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px", color: "#1c1c1c" }}>
        {sector.naam}
      </h2>
      {sector.intro && /<[^>]+>/.test(sector.intro)
        ? <RichTextContent html={sector.intro} style={{ color: "#666", fontSize: "15px", lineHeight: 1.7, margin: "0 0 28px 0" }} />
        : <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.7, margin: "0 0 28px 0" }}>{sector.intro || sector.tagline}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "32px" }}>
        {checkItems.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <CheckIcon />
            <span style={{ color: "#555", fontSize: "14.5px", lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
      <Link to="/contact"
        style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 28px", textDecoration: "none" }}
        onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
        onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}>
        OFFERTE AANVRAGEN
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </Link>
    </div>
  );

  const imageBlock = (
    <div style={{ position: "relative" }}>
      <div className="sector-accent" style={{ position: "absolute", ...(isEven ? { top: "-16px", right: "-16px" } : { bottom: "-16px", left: "-16px" }), width: "72px", height: "72px", background: "#c8d400", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
        <img className="sector-image" src={img} alt={sector.naam} style={{ width: "100%", height: "400px", objectFit: "cover", objectPosition: "center", display: "block" }} />
      </div>
    </div>
  );

  return (
    <section id={sector.id} style={{ background: bg, padding: "88px 0" }}>
      <style>{`
        .sb${index}-l{opacity:0;transform:translateX(-36px);transition:opacity .65s ease,transform .65s ease}
        .sb${index}-r{opacity:0;transform:translateX(36px);transition:opacity .65s .15s ease,transform .65s .15s ease}
        .sb${index}-on .sb${index}-l,.sb${index}-on .sb${index}-r{opacity:1;transform:none}
        @media(max-width:768px){.sb${index}-g{grid-template-columns:1fr!important}}
      `}</style>
      <div ref={ref} className={`max-w-7xl mx-auto px-6 md:px-8 fw-sector-grid sb${index}-g` + (vis ? ` sb${index}-on` : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div className={`sb${index}-l`}>{isEven ? textBlock : imageBlock}</div>
        <div className={`sb${index}-r`}>{isEven ? imageBlock : textBlock}</div>
      </div>
    </section>
  );
}

function DienstenBanner() {
  const [ref, vis] = useInView(0.15);
  const items = [
    { title: "Engineering & Ontwerp",   to: "/diensten/engineering" },
    { title: "Productie in eigen beheer", to: "/diensten/productie" },
    { title: "Coating & Afwerking",     to: "/diensten/coating" },
    { title: "Montage op locatie",      to: "/diensten/montage" },
    { title: "Reparatie & Onderhoud",   to: "/diensten/reparatie" },
  ];
  return (
    <section style={{ background: "#1c1c1c", padding: "72px 0" }}>
      <style>{`.db-card{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}.db-on .db-card{opacity:1;transform:none}`}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "db-on" : "")}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ margin: "0 0 10px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>OOK INTERESSANT</p>
          <h2 style={{ margin: 0, fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px,2.6vw,34px)", textTransform: "uppercase", color: "#fff", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            ONZE <span style={{ color: "#c8d400" }}>DIENSTEN</span>
          </h2>
        </div>
        <div className="fw-five-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "16px" }}>
          {items.map((item, i) => (
            <Link key={i} to={item.to} className="db-card"
              style={{ background: "#252525", padding: "24px 20px", display: "block", textDecoration: "none", borderTop: "3px solid #c8d400", transitionDelay: `${i * 0.08}s` }}
              onMouseEnter={e => e.currentTarget.style.background = "#2e2e2e"}
              onMouseLeave={e => e.currentTarget.style.background = "#252525"}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12.5px", textTransform: "uppercase", color: "#fff", lineHeight: 1.3 }}>{item.title}</div>
              <div style={{ marginTop: "10px", color: "#c8d400", fontSize: "12px" }}>→ Meer info</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section style={{ background: "#f4f4f4", padding: "80px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="fw-cta-box" style={{ background: "#1c1c1c", padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "28px" }}>
          <div>
            <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(20px,2.4vw,30px)", textTransform: "uppercase", color: "#fff", margin: "0 0 10px 0", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
              KLAAR OM <span style={{ color: "#c8d400" }}>TE STARTEN?</span>
            </h2>
            <p style={{ color: "#999", fontSize: "15px", margin: 0, lineHeight: 1.5 }}>Stuur uw tekening op of neem contact op — wij reageren binnen 24 uur.</p>
          </div>
          <div className="fw-cta-actions" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/contact"
              style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "16px 32px", textDecoration: "none", display: "inline-block" }}
              onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
              onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}>
              OFFERTE AANVRAGEN
            </Link>
            <a href="tel:+31165205617"
              style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#fff", background: "transparent", border: "2px solid #555", padding: "14px 28px", textDecoration: "none", display: "inline-block" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#c8d400"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#555"}>
              BEL ONS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SectorenPage() {
  const { cms } = useCms();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <PageHero />
      <IntroStrip />
      {(cms.sectoren || []).map((sector, i) => <SectorBlock key={sector.id} sector={sector} index={i} />)}
      <DienstenBanner />
      <CtaSection />
    </>
  );
}
