import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpeg";
import imgAbout1 from "../assets/about/about-us1.jpeg";
import imgMachine from "../assets/over-ons1.png";
import imgLandscape from "../assets/over-ons2.png";
import imgPortrait from "../assets/over-ons3.png";
import imgAbout2 from "../assets/about/about-us2.jpeg";
import imgAbout3 from "../assets/about/about-us3.jpeg";
import { useCms } from "../cms/CmsContext";
import { useLanguage } from "../i18n/LanguageContext";

const FALLBACK_IMAGES = [imgAbout1, imgMachine, imgLandscape, imgPortrait, imgAbout2];

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
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
      <polyline points="3,11 9,17 20,5" stroke="var(--fw-website-primary)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PageHero() {
  const { t, localizePath } = useLanguage();
  return (
    <section style={{ position: "relative", width: "100%", minHeight: "380px", display: "flex", alignItems: "center", overflow: "hidden", background: "#141616" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center right" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(20,22,22,0.94) 0%,rgba(20,22,22,0.76) 55%,rgba(20,22,22,0.4) 100%)" }} />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <Link to={localizePath("/")} style={{ color: "var(--fw-website-primary)", fontSize: "13px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{t("common.home", "Home")}</Link>
          <span style={{ color: "#666", fontSize: "13px" }}>{">"}</span>
          <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{t("servicesPage.breadcrumb", "Services")}</span>
        </div>
        <h1 style={{ margin: "0 0 16px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,56px)", lineHeight: 1.05, letterSpacing: "-0.5px", textTransform: "uppercase" }}>
          <span style={{ color: "var(--fw-website-primary)" }}>{t("servicesPage.heroTitle", "OUR ")}</span><span style={{ color: "#fff" }}>{t("servicesPage.heroAccent", "SERVICES")}</span>
        </h1>
        <p style={{ margin: 0, color: "#bbb", fontSize: "clamp(14px,1.6vw,17px)", lineHeight: 1.6, maxWidth: "560px" }}>
          {t("servicesPage.heroText", "From design and engineering to production, coating and installation - FerroWorks supports your custom metal project from A to Z.")}
        </p>
        <div style={{ width: "56px", height: "4px", background: "var(--fw-website-primary)", marginTop: "28px", borderRadius: "2px" }} />
      </div>
    </section>
  );
}

function IntroStrip() {
  const [ref, vis] = useInView(0.2);
  const { t } = useLanguage();
  const items = [
    { num: "15+", ...(t("servicesPage.stats.0.label") ? { label: t("servicesPage.stats.0.label"), sub: t("servicesPage.stats.0.sub") } : { label: "Years of experience", sub: "in custom metalwork" }) },
    { num: "100%", ...(t("servicesPage.stats.1.label") ? { label: t("servicesPage.stats.1.label"), sub: t("servicesPage.stats.1.sub") } : { label: "In-house production", sub: "without subcontractors" }) },
    { num: "A-Z", ...(t("servicesPage.stats.2.label") ? { label: t("servicesPage.stats.2.label"), sub: t("servicesPage.stats.2.sub") } : { label: "Complete support", sub: "from design to installation" }) },
  ];
  return (
    <section style={{ background: "#1c1c1c", padding: "48px 0" }}>
      <style>{`.is-d{opacity:0;transform:translateY(16px);transition:opacity .55s ease,transform .55s ease}.is-d-on .is-d{opacity:1;transform:none}`}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 is-d-grid " + (vis ? "is-d-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderLeft: "3px solid var(--fw-website-primary)" }}>
        {items.map((item, i) => (
          <div key={i} className="is-d" style={{ padding: "8px 32px", borderRight: i < 2 ? "1px solid #333" : "none" }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(26px,3vw,38px)", color: "var(--fw-website-primary)", lineHeight: 1, letterSpacing: "-0.5px" }}>{item.num}</div>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", color: "#fff", textTransform: "uppercase", letterSpacing: "0.3px", marginTop: "4px" }}>{item.label}</div>
            <div style={{ fontSize: "12px", color: "#777", marginTop: "2px" }}>{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DienstBlock({ dienst, index }) {
  const [ref, vis] = useInView();
  const { t, localizePath } = useLanguage();
  const isEven = index % 2 === 0;
  const bg = isEven ? "#f4f4f4" : "#fff";
  const img = dienst.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const checkItems = dienst.checklist ? dienst.checklist.split("\n").filter(Boolean) : [];

  const textBlock = (
    <div>
      <div style={{ display: "inline-block", background: isEven ? "var(--fw-website-primary)" : "#1c1c1c", padding: "6px 14px", marginBottom: "20px" }}>
        <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: isEven ? "#1c1c1c" : "var(--fw-website-primary)" }}>
          {dienst.nr} â€” {dienst.title}
        </span>
      </div>
      <h2 style={{ margin: "0 0 12px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px,2.6vw,34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px", color: "#1c1c1c" }}>
        {dienst.title}
      </h2>
      <p style={{ color: "#777", fontSize: "13.5px", fontStyle: "italic", margin: "0 0 20px 0" }}>{dienst.subtitle}</p>
      <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 24px 0" }}>{dienst.excerpt}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
        {checkItems.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <CheckIcon />
            <span style={{ color: "#555", fontSize: "14.5px", lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
      <Link to={localizePath(`/diensten/${dienst.id}`)}
        style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "var(--fw-website-primary)", padding: "14px 28px", textDecoration: "none" }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--fw-website-primary-strong)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--fw-website-primary)"}>
        {t("servicesPage.moreInfo", "MORE INFORMATION")}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </Link>
    </div>
  );

  const imageBlock = (
    <div style={{ position: "relative" }}>
      <div className="service-accent" style={{ position: "absolute", ...(isEven ? { top: "-16px", right: "-16px" } : { bottom: "-16px", left: "-16px" }), width: "72px", height: "72px", background: "var(--fw-website-primary)", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
        <img className="service-image" src={img} alt={dienst.title} style={{ width: "100%", height: "380px", objectFit: "cover", objectPosition: "center", display: "block" }} />
      </div>
    </div>
  );

  return (
    <section id={dienst.id} style={{ background: bg, padding: "80px 0" }}>
      <style>{`
        .db${index}-l{opacity:0;transform:translateX(-36px);transition:opacity .65s ease,transform .65s ease}
        .db${index}-r{opacity:0;transform:translateX(36px);transition:opacity .65s .15s ease,transform .65s .15s ease}
        .db${index}-on .db${index}-l,.db${index}-on .db${index}-r{opacity:1;transform:none}
        @media(max-width:768px){.db${index}-g{grid-template-columns:1fr!important}}
      `}</style>
      <div ref={ref} className={`max-w-7xl mx-auto px-6 md:px-8 fw-service-grid db${index}-g` + (vis ? ` db${index}-on` : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div className={`db${index}-l`}>{isEven ? textBlock : imageBlock}</div>
        <div className={`db${index}-r`}>{isEven ? imageBlock : textBlock}</div>
      </div>
    </section>
  );
}

function CtaSection() {
  const { t, localizePath } = useLanguage();
  return (
    <section style={{ background: "#f4f4f4", padding: "80px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="fw-cta-box" style={{ background: "#1c1c1c", padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "28px" }}>
          <div>
            <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(20px,2.4vw,30px)", textTransform: "uppercase", color: "#fff", margin: "0 0 10px 0", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
              {t("common.startProject", "READY TO")} <span style={{ color: "var(--fw-website-primary)" }}>{t("common.startProjectAccent", "GET STARTED?")}</span>
            </h2>
            <p style={{ color: "#999", fontSize: "15px", margin: 0, lineHeight: 1.5 }}>{t("common.startProjectText", "Send your drawing or contact us - we respond within 24 hours.")}</p>
          </div>
          <div className="fw-cta-actions" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to={localizePath("/contact")}
              style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "var(--fw-website-primary)", padding: "16px 32px", textDecoration: "none", display: "inline-block" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--fw-website-primary-strong)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--fw-website-primary)"}>
              {t("common.getQuote", "REQUEST A QUOTE")}
            </Link>
            <a href="tel:+31165205617"
              style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#fff", background: "transparent", border: "2px solid #555", padding: "14px 28px", textDecoration: "none", display: "inline-block" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--fw-website-primary)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#555"}>
              {t("common.callUs", "CALL US")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DienstenPage() {
  const { cms } = useCms();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <PageHero />
      <IntroStrip />
      {(cms.diensten || []).map((dienst, i) => <DienstBlock key={dienst.id} dienst={dienst} index={i} />)}
      <CtaSection />
    </>
  );
}


