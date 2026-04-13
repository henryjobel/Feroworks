import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpeg";
import imgMachine from "../assets/over-ons1.png";
import imgLandscape from "../assets/over-ons2.png";
import imgPortrait from "../assets/over-ons3.png";
import imgAbout1 from "../assets/about/about-us1.jpeg";
import imgAbout2 from "../assets/about/about-us2.jpeg";
import imgAbout3 from "../assets/about/about-us3.jpeg";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function CheckIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
      <polyline points="3,11 9,17 20,5" stroke="#c8d400" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── 1. HERO ──────────────────────────────────────────────────────────── */
function PageHero() {
  return (
    <section style={{ position: "relative", width: "100%", minHeight: "380px", display: "flex", alignItems: "center", overflow: "hidden", background: "#141616" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center right" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(20,22,22,0.94) 0%, rgba(20,22,22,0.76) 55%, rgba(20,22,22,0.4) 100%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <Link to="/" style={{ color: "#c8d400", fontSize: "13px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Home</Link>
          <span style={{ color: "#666", fontSize: "13px" }}>›</span>
          <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Diensten</span>
        </div>

        <h1 style={{ margin: "0 0 16px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.5px", textTransform: "uppercase" }}>
          <span style={{ color: "#c8d400" }}>ONZE </span><span style={{ color: "#fff" }}>DIENSTEN</span>
        </h1>
        <p style={{ margin: 0, color: "#bbb", fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.6, maxWidth: "560px" }}>
          Van ontwerp en engineering tot productie, coating en montage — FerroWorks ontzorgt u volledig in metaalmaatwerk van A tot Z.
        </p>
        <div style={{ width: "56px", height: "4px", background: "#c8d400", marginTop: "28px", borderRadius: "2px" }} />
      </div>
    </section>
  );
}

/* ── 2. INTRO STRIP ───────────────────────────────────────────────────── */
function IntroStrip() {
  const [ref, vis] = useInView(0.2);
  return (
    <section style={{ background: "#1c1c1c", padding: "48px 0" }}>
      <style>{`
        .is-inner { opacity:0; transform:translateY(16px); transition: opacity .55s ease, transform .55s ease; }
        .is-on .is-inner { opacity:1; transform:none; }
        @media (max-width: 768px) { .is-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 is-inner is-grid " + (vis ? "is-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", borderLeft: "3px solid #c8d400" }}>
        {[
          { num: "15+",  label: "Jaar ervaring",        sub: "in metaalmaatwerk" },
          { num: "100%", label: "Eigen productie",       sub: "zonder onderaannemers" },
          { num: "A-Z",  label: "Volledig ontzorgd",     sub: "van ontwerp tot montage" },
        ].map((item, i) => (
          <div key={i} style={{ padding: "8px 32px", borderRight: i < 2 ? "1px solid #333" : "none" }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(26px, 3vw, 38px)", color: "#c8d400", lineHeight: 1, letterSpacing: "-0.5px" }}>{item.num}</div>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", color: "#fff", textTransform: "uppercase", letterSpacing: "0.3px", marginTop: "4px" }}>{item.label}</div>
            <div style={{ fontSize: "12px", color: "#777", marginTop: "2px" }}>{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 3. DIENST BLOKKEN ────────────────────────────────────────────────── */

/* Dienst 1: Engineering & Ontwerp */
function DienstEngineering() {
  const [ref, vis] = useInView();
  return (
    <section id="engineering" style={{ background: "#f4f4f4", padding: "80px 0" }}>
      <style>{`
        .de-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s ease, transform .65s ease; }
        .de-right { opacity:0; transform:translateX(36px);  transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .de-on .de-left, .de-on .de-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .de-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 de-grid " + (vis ? "de-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        <div className="de-left">
          <div style={{ display: "inline-block", background: "#c8d400", padding: "6px 14px", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#1c1c1c" }}>01 — Engineering</span>
          </div>
          <h2 style={{ margin: "0 0 20px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#c8d400" }}>ENGINEERING</span><br />
            <span style={{ color: "#1c1c1c" }}>& ONTWERP</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
            Elk project begint met een goed ontwerp. Onze engineers werken met moderne CAD-software en vertalen uw wensen naar haalbare, maakbare productietekeningen. We denken actief mee over constructieve oplossingen, materiaalkeuze en kostenoptimalisatie.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 28px 0" }}>
            Heeft u al een tekening of specificatie? Dan toetsen we die op maakbaarheid en passen we aan waar nodig. Geen ontwerp? Dan starten we vanaf nul op basis van uw schets of omschrijving.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["2D- en 3D-tekeningen (CAD/CAM)", "Constructieve berekeningen", "Materiaalkeuze en kostenadvies", "Toetsing op maakbaarheid", "Goedkeuringsproces met de opdrachtgever"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckIcon />
                <span style={{ color: "#555", fontSize: "14.5px", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/diensten/engineering"
            style={{ marginTop: "28px", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 28px", textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
            onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
          >
            MEER INFORMATIE
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div className="de-right" style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "-16px", right: "-16px", width: "72px", height: "72px", background: "#c8d400", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <img src={imgAbout1} alt="Engineering en ontwerp" style={{ width: "100%", height: "380px", objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Dienst 2: Productie */
function DienstProductie() {
  const [ref, vis] = useInView();
  return (
    <section id="productie" style={{ background: "#fff", padding: "80px 0" }}>
      <style>{`
        .dp-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .dp-right { opacity:0; transform:translateX(36px);  transition: opacity .65s ease, transform .65s ease; }
        .dp-on .dp-left, .dp-on .dp-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .dp-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 dp-grid " + (vis ? "dp-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        {/* Image left */}
        <div className="dp-right" style={{ position: "relative" }}>
          <div style={{ position: "absolute", bottom: "-16px", left: "-16px", width: "72px", height: "72px", background: "#c8d400", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <img src={imgMachine} alt="Productie in eigen werkplaats" style={{ width: "100%", height: "380px", objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
        </div>

        {/* Text right */}
        <div className="dp-left">
          <div style={{ display: "inline-block", background: "#1c1c1c", padding: "6px 14px", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c8d400" }}>02 — Productie</span>
          </div>
          <h2 style={{ margin: "0 0 20px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#1c1c1c" }}>PRODUCTIE IN</span><br />
            <span style={{ color: "#c8d400" }}>EIGEN BEHEER</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
            In onze moderne werkplaats in Roosendaal beschikken we over een volledig machinepark voor het verwerken van staal, RVS en aluminium. Alles wordt in eigen beheer geproduceerd — zonder uitbesteding — zodat wij volledige controle houden over kwaliteit, planning en kosten.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 28px 0" }}>
            Onze gecertificeerde lassers werken conform EN-1090 en VCA. Elk laswerk wordt visueel geïnspecteerd en waar nodig voorzien van niet-destructief onderzoek (NDO).
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Zaag- en lasersnijwerk", "Boren, frezen en knippen", "Gecertificeerd lassen (MIG/MAG, TIG, WIG)", "Buigen en walsen", "Prefab-productie en maatwerk in alle series"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckIcon />
                <span style={{ color: "#555", fontSize: "14.5px", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/diensten/productie"
            style={{ marginTop: "28px", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 28px", textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
            onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
          >
            MEER INFORMATIE
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* Dienst 3: Coating & Afwerking */
function DienstCoating() {
  const [ref, vis] = useInView();
  return (
    <section id="coating" style={{ background: "#f4f4f4", padding: "80px 0" }}>
      <style>{`
        .dc-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s ease, transform .65s ease; }
        .dc-right { opacity:0; transform:translateX(36px);  transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .dc-on .dc-left, .dc-on .dc-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .dc-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 dc-grid " + (vis ? "dc-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        <div className="dc-left">
          <div style={{ display: "inline-block", background: "#c8d400", padding: "6px 14px", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#1c1c1c" }}>03 — Coating</span>
          </div>
          <h2 style={{ margin: "0 0 20px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#c8d400" }}>COATING</span><br />
            <span style={{ color: "#1c1c1c" }}>& AFWERKING</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
            Een goede afwerking beschermt uw constructie en bepaalt de uitstraling. FerroWorks adviseert en verzorgt de juiste coatingoplossing op basis van de omgeving, het gebruik en de gewenste levensduur van uw product.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 28px 0" }}>
            We werken met meerlaagse coatingsystemen conform ISO 12944 voor corrosiviteitscategorieën C1 t/m C5. Van standaard grondlaag tot volledige offshore-coating met polyurethaan-topcoat.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {[
              { title: "Stralen", desc: "Tot Sa2,5 voor optimale hechting" },
              { title: "Grondlagen", desc: "Zinkrijke of epoxy grondlaag" },
              { title: "Natlak", desc: "Geschikt voor complexe en grote constructies" },
              { title: "Poedercoating", desc: "Seriematig, egaal en krasbestendig" },
              { title: "RVS-polijsten", desc: "Decoratief of hygiënisch finish" },
              { title: "Galvaniseren", desc: "Duurzame zinkbescherming voor buiten" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#fff", padding: "16px 18px", borderLeft: "3px solid #c8d400" }}>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "4px" }}>{item.title}</div>
                <div style={{ fontSize: "12.5px", color: "#888", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <Link
            to="/diensten/coating"
            style={{ marginTop: "28px", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 28px", textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
            onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
          >
            MEER INFORMATIE
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div className="dc-right" style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "-16px", right: "-16px", width: "72px", height: "72px", background: "#c8d400", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <img src={imgLandscape} alt="Coating en afwerking" style={{ width: "100%", height: "420px", objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Dienst 4: Montage */
function DienstMontage() {
  const [ref, vis] = useInView();
  return (
    <section id="montage" style={{ background: "#fff", padding: "80px 0" }}>
      <style>{`
        .dm-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .dm-right { opacity:0; transform:translateX(36px);  transition: opacity .65s ease, transform .65s ease; }
        .dm-on .dm-left, .dm-on .dm-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .dm-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 dm-grid " + (vis ? "dm-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        {/* Image left */}
        <div className="dm-right" style={{ position: "relative" }}>
          <div style={{ position: "absolute", bottom: "-16px", left: "-16px", width: "72px", height: "72px", background: "#c8d400", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <img src={imgAbout2} alt="Montage op locatie" style={{ width: "100%", height: "380px", objectFit: "cover", objectPosition: "top", display: "block" }} />
          </div>
        </div>

        {/* Text right */}
        <div className="dm-left">
          <div style={{ display: "inline-block", background: "#1c1c1c", padding: "6px 14px", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c8d400" }}>04 — Montage</span>
          </div>
          <h2 style={{ margin: "0 0 20px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#1c1c1c" }}>MONTAGE</span><br />
            <span style={{ color: "#c8d400" }}>OP LOCATIE</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
            Onze montageploeg plaatst uw constructie op locatie, van eenvoudige hekwerken tot complexe staalconstructies op hoogte. We coördineren het kraanwerk, de veiligheidsaspecten en de afwerking ter plaatse.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 28px 0" }}>
            Na montage ontvangt u een volledig opleverdossier met tekeningen, materiaalcertificaten, lasrapporten en — indien vereist — een CE-verklaring van prestatie (DoP) conform EN-1090.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Eigen montageploeg, gecertificeerd VCA", "Montage van staal, RVS en aluminium", "Kraanbegeleiding en veiligheidsbeheer", "Aansluitlassen en correcties op locatie", "Eindinspectie en opleverdossier"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckIcon />
                <span style={{ color: "#555", fontSize: "14.5px", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/diensten/montage"
            style={{ marginTop: "28px", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 28px", textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
            onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
          >
            MEER INFORMATIE
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* Dienst 5: Reparatie & Onderhoud */
function DienstReparatie() {
  const [ref, vis] = useInView();
  return (
    <section id="reparatie" style={{ background: "#f4f4f4", padding: "80px 0" }}>
      <style>{`
        .dr-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s ease, transform .65s ease; }
        .dr-right { opacity:0; transform:translateX(36px);  transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .dr-on .dr-left, .dr-on .dr-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .dr-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 dr-grid " + (vis ? "dr-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        <div className="dr-left">
          <div style={{ display: "inline-block", background: "#c8d400", padding: "6px 14px", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#1c1c1c" }}>05 — Reparatie</span>
          </div>
          <h2 style={{ margin: "0 0 20px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#c8d400" }}>REPARATIE</span><br />
            <span style={{ color: "#1c1c1c" }}>& ONDERHOUD</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
            Staalconstructies slijten, vervormen of beschadigen. FerroWorks voert reparaties en onderhoud uit, zowel in onze werkplaats als direct bij u op locatie. Snel, vakkundig en zonder lange wachttijden.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 28px 0" }}>
            Of het nu gaat om een gebroken las, verroeste constructie, beschadigd hekwerk of een defect frame — wij beoordelen de schade en voeren de reparatie uit conform de geldende normen.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Lasreparaties in staal, RVS en aluminium", "Herstel van corrosieschade en coating", "Structurele versterking van bestaande constructies", "Spoedreparaties op locatie mogelijk", "Onderhoudscontracten op aanvraag"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckIcon />
                <span style={{ color: "#555", fontSize: "14.5px", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/diensten/reparatie"
            style={{ marginTop: "28px", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 28px", textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
            onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
          >
            MEER INFORMATIE
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div className="dr-right" style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "-16px", right: "-16px", width: "72px", height: "72px", background: "#c8d400", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <img src={imgAbout3} alt="Reparatie en onderhoud op locatie" style={{ width: "100%", height: "380px", objectFit: "cover", objectPosition: "top", display: "block" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 4. MATERIALEN BLOK ───────────────────────────────────────────────── */
function MaterialenBlok() {
  const [ref, vis] = useInView(0.1);
  return (
    <section style={{ background: "#1c1c1c", padding: "80px 0" }}>
      <style>{`
        .mat-head { opacity:0; transform:translateY(-18px); transition: opacity .5s ease, transform .5s ease; }
        .mat-card { opacity:0; transform:translateY(24px); transition: opacity .5s ease, transform .5s ease; }
        .mat-on .mat-head { opacity:1; transform:none; }
        .mat-on .mat-card:nth-child(1) { opacity:1; transform:none; transition-delay:.07s; }
        .mat-on .mat-card:nth-child(2) { opacity:1; transform:none; transition-delay:.18s; }
        .mat-on .mat-card:nth-child(3) { opacity:1; transform:none; transition-delay:.29s; }
        @media (max-width: 768px) { .mat-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "mat-on" : "")}>
        <div className="mat-head" style={{ marginBottom: "48px", textAlign: "center" }}>
          <p style={{ margin: "0 0 10px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>MATERIAALEXPERTISE</p>
          <h2 style={{ margin: 0, fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px", color: "#fff" }}>
            WIJ WERKEN MET <span style={{ color: "#c8d400" }}>3 MATERIALEN</span>
          </h2>
        </div>

        <div className="mat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
          {[
            {
              name: "STAAL",
              grade: "S235 · S355 · S420",
              desc: "Constructief staal is de basis van elk zwaar draagwerk. Hoge sterkte, goed lasbaar en beschikbaar in alle profielen. Ideaal voor industriële constructies, frames en gevelelementen.",
              toepassingen: ["Staalconstructies en frames", "Industriële installaties", "Trappen en balustrades", "Hekwerken en poorten", "Offshore draagwerk"],
              accent: "#c8d400",
            },
            {
              name: "RVS",
              grade: "AISI 304 · AISI 316L · Duplex",
              desc: "Roestvast staal combineert sterkte met een hoge corrosieweerstand. Geschikt voor voedselverwerkende industrie, maritieme toepassingen en decoratief werk met een premium uitstraling.",
              toepassingen: ["Voedselverwerkende industrie", "Maritiem en offshore", "Trapleuningen en design", "Processinstallaties", "Gevelpanelen en goten"],
              accent: "#c8d400",
            },
            {
              name: "ALUMINIUM",
              grade: "6060 · 6082 · 5083",
              desc: "Lichtgewicht én sterk. Aluminium is corrosiebestendig van nature en perfect voor toepassingen waarbij gewicht een rol speelt, zoals gevelelementen, loopbruggen en maritieme structuren.",
              toepassingen: ["Gevelelementen en kozijnen", "Loopbruggen en vlonders", "Sierwerk en interieur", "Jachtbouw", "Lichtgewicht constructies"],
              accent: "#c8d400",
            },
          ].map((mat, i) => (
            <div key={i} className="mat-card" style={{ background: "#252525", padding: "36px 28px", borderTop: "4px solid #c8d400", display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(20px, 2.2vw, 26px)", textTransform: "uppercase", color: "#fff", margin: "0 0 6px 0", letterSpacing: "-0.3px" }}>{mat.name}</h3>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", color: "#c8d400", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>{mat.grade}</div>
              <p style={{ color: "#aaa", fontSize: "13.5px", lineHeight: 1.7, margin: "0 0 24px 0", flex: 1 }}>{mat.desc}</p>
              <div style={{ borderTop: "1px solid #333", paddingTop: "20px" }}>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#666", marginBottom: "12px" }}>Toepassingen</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  {mat.toepassingen.map((t, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "6px", height: "6px", background: "#c8d400", flexShrink: 0 }} />
                      <span style={{ color: "#bbb", fontSize: "13px", lineHeight: 1.4 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 5. WERKWIJZE TIJDLIJN ────────────────────────────────────────────── */
function WerkwijzeTijdlijn() {
  const [ref, vis] = useInView(0.05);
  const stappen = [
    { nr: "01", title: "INTAKE & OFFERTE",    desc: "We begrijpen uw project, stellen vragen en leveren een heldere offerte met vaste prijs en planning." },
    { nr: "02", title: "ENGINEERING",         desc: "Onze engineers werken de productietekeningen uit en leggen die ter goedkeuring voor." },
    { nr: "03", title: "PRODUCTIE",           desc: "In eigen werkplaats produceren wij uw onderdelen met volledige kwaliteitscontrole." },
    { nr: "04", title: "COATING",             desc: "Het product wordt voorbereid en afgewerkt met de juiste coatingkeuze voor langdurige bescherming." },
    { nr: "05", title: "MONTAGE & OPLEVERING", desc: "Onze montageploeg plaatst de constructie en levert op met volledig documentatiepakket." },
  ];
  return (
    <section style={{ background: "#f4f4f4", padding: "80px 0" }}>
      <style>{`
        .wt-head { opacity:0; transform:translateY(-18px); transition: opacity .5s ease, transform .5s ease; }
        .wt-step { opacity:0; transform:translateX(-24px); transition: opacity .5s ease, transform .5s ease; }
        .wt-on .wt-head { opacity:1; transform:none; }
        .wt-on .wt-step:nth-child(1) { opacity:1; transform:none; transition-delay:.05s; }
        .wt-on .wt-step:nth-child(2) { opacity:1; transform:none; transition-delay:.14s; }
        .wt-on .wt-step:nth-child(3) { opacity:1; transform:none; transition-delay:.23s; }
        .wt-on .wt-step:nth-child(4) { opacity:1; transform:none; transition-delay:.32s; }
        .wt-on .wt-step:nth-child(5) { opacity:1; transform:none; transition-delay:.41s; }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "wt-on" : "")}>
        <div className="wt-head" style={{ marginBottom: "52px" }}>
          <p style={{ margin: "0 0 10px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>HOE WIJ WERKEN</p>
          <h2 style={{ margin: 0, fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#1c1c1c" }}>VAN ONTWERP </span><span style={{ color: "#c8d400" }}>TOT MONTAGE</span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {stappen.map((stap, i) => (
            <div key={i} className="wt-step" style={{ display: "flex", gap: "0", alignItems: "stretch" }}>
              {/* Number column */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "64px", flexShrink: 0 }}>
                <div style={{ width: "48px", height: "48px", background: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", color: "#c8d400", letterSpacing: "0.5px" }}>{stap.nr}</span>
                </div>
                {i < stappen.length - 1 && (
                  <div style={{ width: "2px", flex: 1, background: "#ddd", minHeight: "32px", marginTop: "0" }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingLeft: "24px", paddingBottom: i < stappen.length - 1 ? "36px" : "0", paddingTop: "10px" }}>
                <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "15px", textTransform: "uppercase", letterSpacing: "-0.1px", color: "#1c1c1c", margin: "0 0 8px 0", lineHeight: 1.2 }}>{stap.title}</h3>
                <p style={{ color: "#777", fontSize: "14px", lineHeight: 1.7, margin: 0, maxWidth: "600px" }}>{stap.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 6. CERTIFICERINGEN STRIP ─────────────────────────────────────────── */
function CertStrip() {
  const [ref, vis] = useInView(0.2);
  return (
    <section style={{ background: "#1c1c1c", padding: "56px 0" }}>
      <style>{`
        .cs-inner { opacity:0; transform:translateY(16px); transition: opacity .55s ease, transform .55s ease; }
        .cs-on .cs-inner { opacity:1; transform:none; }
        @media (max-width: 768px) { .cs-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "cs-on" : "")}>
        <div className="cs-inner" style={{ display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: "0 0 6px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>GECERTIFICEERD</p>
            <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(18px, 2vw, 24px)", textTransform: "uppercase", color: "#fff", margin: 0, letterSpacing: "-0.2px" }}>
              VCA · EN-1090 · <span style={{ color: "#c8d400" }}>CE</span>
            </h3>
          </div>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { code: "VCA",     label: "Veiligheid, gezondheid & milieu" },
              { code: "EN-1090", label: "Staal- en aluminiumconstructies" },
              { code: "CE",      label: "Conformiteit & veiligheidsstandaard" },
            ].map((c, i) => (
              <div key={i} style={{ background: "#2a2a2a", borderLeft: "3px solid #c8d400", padding: "16px 20px", minWidth: "160px" }}>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "18px", color: "#fff", letterSpacing: "-0.2px" }}>{c.code}</div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "4px", lineHeight: 1.4 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 7. CTA ───────────────────────────────────────────────────────────── */
function CtaSection() {
  return (
    <section style={{ background: "#f4f4f4", padding: "80px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div style={{ background: "#1c1c1c", padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "28px" }}>
          <div>
            <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(20px, 2.4vw, 30px)", textTransform: "uppercase", color: "#fff", margin: "0 0 10px 0", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
              KLAAR VOOR UW <span style={{ color: "#c8d400" }}>PROJECT?</span>
            </h2>
            <p style={{ color: "#999", fontSize: "15px", margin: 0, lineHeight: 1.5 }}>
              Stuur uw tekening op of neem contact op — wij reageren binnen 24 uur.
            </p>
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link
              to="/contact"
              style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "16px 32px", textDecoration: "none", display: "inline-block", transition: "background .2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
              onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
            >
              NEEM CONTACT OP
            </Link>
            <a
              href="tel:+31165205601"
              style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#fff", background: "transparent", border: "2px solid #555", padding: "14px 28px", textDecoration: "none", display: "inline-block", transition: "border-color .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#c8d400"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#555"}
            >
              BEL ONS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── PAGE EXPORT ──────────────────────────────────────────────────────── */
export default function DienstenPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  return (
    <>
      <PageHero />
      <IntroStrip />
      <DienstEngineering />
      <DienstProductie />
      <DienstCoating />
      <DienstMontage />
      <DienstReparatie />
      <MaterialenBlok />
      <WerkwijzeTijdlijn />
      <CertStrip />
      <CtaSection />
    </>
  );
}
