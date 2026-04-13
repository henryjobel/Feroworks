import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpeg";
import imgAbout1 from "../assets/about/about-us1.jpeg";
import imgAbout2 from "../assets/about/about-us2.jpeg";
import imgAbout3 from "../assets/about/about-us3.jpeg";
import imgMachine from "../assets/over-ons1.png";
import imgLandscape from "../assets/over-ons2.png";

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

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0, marginTop: "3px" }}>
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
          <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Sectoren</span>
        </div>
        <h1 style={{ margin: "0 0 16px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.5px", textTransform: "uppercase" }}>
          <span style={{ color: "#c8d400" }}>STAAL, RVS & ALU </span><span style={{ color: "#fff" }}>IN ELKE SECTOR</span>
        </h1>
        <p style={{ margin: 0, color: "#bbb", fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.6, maxWidth: "540px" }}>
          FerroWorks levert maatwerk metaaloplossingen voor bouw, industrie, architectuur en maritieme toepassingen. Altijd vakkundig, altijd op maat.
        </p>
        <div style={{ width: "56px", height: "4px", background: "#c8d400", marginTop: "28px", borderRadius: "2px" }} />
      </div>
    </section>
  );
}

/* ── 2. INTRO STRIP ───────────────────────────────────────────────────── */
function IntroStrip() {
  const [ref, vis] = useInView(0.15);
  const items = [
    { nr: "4", label: "Sectoren", sub: "Bouw, Industrie, Design, Maritiem" },
    { nr: "15+", label: "Jaar ervaring", sub: "In metaalmaatwerk" },
    { nr: "100%", label: "Eigen productie", sub: "Geen uitbesteding" },
    { nr: "A–Z", label: "Volledig ontzorgd", sub: "Van ontwerp tot montage" },
  ];
  return (
    <section style={{ background: "#1c1c1c", padding: "56px 0" }}>
      <style>{`
        .is-item { opacity:0; transform:translateY(18px); transition: opacity .5s ease, transform .5s ease; }
        .is-on .is-item:nth-child(1) { opacity:1; transform:none; transition-delay:.0s; }
        .is-on .is-item:nth-child(2) { opacity:1; transform:none; transition-delay:.1s; }
        .is-on .is-item:nth-child(3) { opacity:1; transform:none; transition-delay:.2s; }
        .is-on .is-item:nth-child(4) { opacity:1; transform:none; transition-delay:.3s; }
        @media (max-width: 640px) { .is-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 is-grid " + (vis ? "is-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
        {items.map((item, i) => (
          <div key={i} className="is-item" style={{ borderLeft: "3px solid #c8d400", paddingLeft: "20px" }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 3vw, 40px)", color: "#c8d400", lineHeight: 1, letterSpacing: "-0.5px" }}>{item.nr}</div>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", color: "#fff", textTransform: "uppercase", letterSpacing: "0.3px", marginTop: "6px" }}>{item.label}</div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "4px", lineHeight: 1.4 }}>{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 3. BOUW & UTILITEIT ──────────────────────────────────────────────── */
function SectorBouw() {
  const [ref, vis] = useInView();
  return (
    <section id="bouw-utiliteit" style={{ background: "#f4f4f4", padding: "88px 0" }}>
      <style>{`
        .sb-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s ease, transform .65s ease; }
        .sb-right { opacity:0; transform:translateX(36px);  transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .sb-on .sb-left, .sb-on .sb-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .sb-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 sb-grid " + (vis ? "sb-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        <div className="sb-left">
          <div style={{ display: "inline-block", background: "#c8d400", padding: "6px 14px", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#1c1c1c" }}>01 — Sector</span>
          </div>
          <h2 style={{ margin: "0 0 20px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#c8d400" }}>BOUW</span><br />
            <span style={{ color: "#1c1c1c" }}>& UTILITEIT</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
            FerroWorks is een vaste partner van aannemers, projectontwikkelaars en installateurs in de bouw- en utiliteitssector. Van prefab staalonderdelen tot complete draagconstructies — we leveren op maat en op tijd.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 28px 0" }}>
            Dankzij onze EN-1090 certificering en CE-markering voldoen onze constructies aan alle bouwnormen en zijn ze direct inzetbaar in vergunningsplichtige projecten.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
            {["Staalconstructies en draagframes", "Standaard en maatwerk hekwerken", "Prefab balkons en bordessen", "Trappen, leuningen en vluchttrapstructuren", "Gevelelementen en kozijnstaal", "CE-gecertificeerd conform EN-1090"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckIcon />
                <span style={{ color: "#555", fontSize: "14.5px", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 28px", textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
            onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
          >
            OFFERTE AANVRAGEN
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div className="sb-right" style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "-16px", right: "-16px", width: "72px", height: "72px", background: "#c8d400", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <img src={imgAbout1} alt="Bouw en utiliteit staalconstructies" style={{ width: "100%", height: "400px", objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 4. INDUSTRIE ─────────────────────────────────────────────────────── */
function SectorIndustrie() {
  const [ref, vis] = useInView();
  return (
    <section id="industrie" style={{ background: "#fff", padding: "88px 0" }}>
      <style>{`
        .si-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .si-right { opacity:0; transform:translateX(36px);  transition: opacity .65s ease, transform .65s ease; }
        .si-on .si-left, .si-on .si-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .si-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 si-grid " + (vis ? "si-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        {/* image left */}
        <div className="si-right" style={{ position: "relative" }}>
          <div style={{ position: "absolute", bottom: "-16px", left: "-16px", width: "72px", height: "72px", background: "#c8d400", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <img src={imgMachine} alt="Industriële staalconstructies" style={{ width: "100%", height: "400px", objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
        </div>

        {/* text right */}
        <div className="si-left">
          <div style={{ display: "inline-block", background: "#1c1c1c", padding: "6px 14px", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c8d400" }}>02 — Sector</span>
          </div>
          <h2 style={{ margin: "0 0 20px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#1c1c1c" }}>INDUSTRIE</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
            In de industrie is precisie alles. FerroWorks produceert draagconstructies, machineframes, procesinstallaties en maatwerk staalwerk voor productiebedrijven, food- en chemiebedrijven en logistieke centra.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 28px 0" }}>
            Onze gecertificeerde lassers (MIG/MAG, TIG, WIG) en modern machinepark garanderen nauwe toleranties en hoge herhaalbaarheid — ook voor grotere series.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
            {["Machinebouw en machineframes", "Maatwerk staalconstructies", "Industriële installaties en procesframes", "Laswerkzaamheden op locatie", "RVS voor food- en farmaceutische industrie", "Draagstructuren en mezzanine vloeren"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckIcon />
                <span style={{ color: "#555", fontSize: "14.5px", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 28px", textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
            onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
          >
            OFFERTE AANVRAGEN
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── 5. ARCHITECTUUR & DESIGN ─────────────────────────────────────────── */
function SectorArchitectuur() {
  const [ref, vis] = useInView();
  return (
    <section id="architectuur-design" style={{ background: "#f4f4f4", padding: "88px 0" }}>
      <style>{`
        .sa-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s ease, transform .65s ease; }
        .sa-right { opacity:0; transform:translateX(36px);  transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .sa-on .sa-left, .sa-on .sa-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .sa-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 sa-grid " + (vis ? "sa-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        <div className="sa-left">
          <div style={{ display: "inline-block", background: "#c8d400", padding: "6px 14px", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#1c1c1c" }}>03 — Sector</span>
          </div>
          <h2 style={{ margin: "0 0 20px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#c8d400" }}>ARCHITECTUUR</span><br />
            <span style={{ color: "#1c1c1c" }}>& DESIGN</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
            Architecten en interieurontwerpers kiezen voor FerroWorks wanneer het detail ertoe doet. Wij vertalen uw artistieke ontwerpen naar afgewerkte staal-, RVS- en aluminiumobjecten met een premium uitstraling.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 28px 0" }}>
            Van sierlijke zwevende trappen tot massief RVS-sierwerk en op maat gemaakte gevelpanelen — we realiseren het met oog voor detail en respect voor uw ontwerptaal.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
            {["Design trappen in staal en RVS", "Interieur- en exterieur maatwerk", "Balustrades en leuningwerken", "Sierwerk, poorten en toegangspartijen", "Gevelpanelen en bekleding", "Coating en poedercoating in elke RAL-kleur"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckIcon />
                <span style={{ color: "#555", fontSize: "14.5px", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 28px", textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
            onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
          >
            OFFERTE AANVRAGEN
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div className="sa-right" style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "-16px", right: "-16px", width: "72px", height: "72px", background: "#c8d400", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <img src={imgLandscape} alt="Architectuur en design metaalwerk" style={{ width: "100%", height: "400px", objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 6. MARITIEM ──────────────────────────────────────────────────────── */
function SectorMaritiem() {
  const [ref, vis] = useInView();
  return (
    <section id="maritiem" style={{ background: "#fff", padding: "88px 0" }}>
      <style>{`
        .sm-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .sm-right { opacity:0; transform:translateX(36px);  transition: opacity .65s ease, transform .65s ease; }
        .sm-on .sm-left, .sm-on .sm-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .sm-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 sm-grid " + (vis ? "sm-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        {/* image left */}
        <div className="sm-right" style={{ position: "relative" }}>
          <div style={{ position: "absolute", bottom: "-16px", left: "-16px", width: "72px", height: "72px", background: "#c8d400", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <img src={imgAbout2} alt="Maritieme metaalconstructies" style={{ width: "100%", height: "400px", objectFit: "cover", objectPosition: "top", display: "block" }} />
          </div>
        </div>

        {/* text right */}
        <div className="sm-left">
          <div style={{ display: "inline-block", background: "#1c1c1c", padding: "6px 14px", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c8d400" }}>04 — Sector</span>
          </div>
          <h2 style={{ margin: "0 0 20px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#1c1c1c" }}>MARITIEM</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
            In de maritieme sector zijn kwaliteit en corrosiebestendigheid niet onderhandelbaar. FerroWorks levert RVS- en aluminiumconstructies die bestand zijn tegen de zwaarste omstandigheden op zee en in havenomgevingen.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: "0 0 28px 0" }}>
            We werken met coatingsystemen conform ISO 12944 C5-M (maritiem) en gebruiken uitsluitend gecertificeerde materialen en lasprocedures voor offshore- en maritime toepassingen.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
            {["Jachtbouw en scheepsinterieurs", "Offshore staal- en RVS-constructies", "Dekuitrusting en handrelingen", "Aluminium loopbruggen en vlonders", "Maritieme coating (C5-M, ISO 12944)", "Reparaties in haven en aan boord"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckIcon />
                <span style={{ color: "#555", fontSize: "14.5px", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 28px", textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
            onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
          >
            OFFERTE AANVRAGEN
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── 7. WAAROM FERROWORKS ─────────────────────────────────────────────── */
function WaaromBlok() {
  const [ref, vis] = useInView(0.1);
  const punten = [
    { title: "Eén partner, volledig ontzorgd", desc: "Van engineering en productie tot coating en montage — alles onder één dak, zonder tussenpersonen." },
    { title: "Gecertificeerd & compliant", desc: "VCA, EN-1090 en CE-markering. Onze constructies voldoen aan alle geldende normen en bouwregelgeving." },
    { title: "Snelle doorlooptijden", desc: "Eigen werkplaats, eigen planning. Geen afhankelijkheid van derden — u weet altijd waar u aan toe bent." },
    { title: "Persoonlijk en direct", desc: "Eén aanspreekpunt van begin tot eind. We denken mee, adviseren proactief en communiceren helder." },
    { title: "Staal, RVS én aluminium", desc: "Drie materialen, één partner. Wij combineren ze vakkundig in één opdracht wanneer dat technisch of esthetisch beter is." },
    { title: "Montage op locatie", desc: "Eigen montageploeg voor plaatsing, aansluitlassen en oplevering inclusief volledig dossier." },
  ];
  return (
    <section style={{ background: "#1c1c1c", padding: "88px 0" }}>
      <style>{`
        .wb-head { opacity:0; transform:translateY(-20px); transition: opacity .5s ease, transform .5s ease; }
        .wb-card { opacity:0; transform:translateY(24px); transition: opacity .5s ease, transform .5s ease; }
        .wb-on .wb-head { opacity:1; transform:none; }
        .wb-on .wb-card:nth-child(1) { opacity:1; transform:none; transition-delay:.05s; }
        .wb-on .wb-card:nth-child(2) { opacity:1; transform:none; transition-delay:.13s; }
        .wb-on .wb-card:nth-child(3) { opacity:1; transform:none; transition-delay:.21s; }
        .wb-on .wb-card:nth-child(4) { opacity:1; transform:none; transition-delay:.29s; }
        .wb-on .wb-card:nth-child(5) { opacity:1; transform:none; transition-delay:.37s; }
        .wb-on .wb-card:nth-child(6) { opacity:1; transform:none; transition-delay:.45s; }
        @media (max-width: 768px) { .wb-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "wb-on" : "")}>
        <div className="wb-head" style={{ marginBottom: "56px" }}>
          <p style={{ margin: "0 0 10px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>WAAROM FERROWORKS</p>
          <h2 style={{ margin: 0, fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px", color: "#fff" }}>
            DE PARTNER VOOR <span style={{ color: "#c8d400" }}>ELKE SECTOR</span>
          </h2>
        </div>
        <div className="wb-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {punten.map((p, i) => (
            <div key={i} className="wb-card" style={{ background: "#252525", padding: "32px 28px", borderTop: "3px solid #c8d400" }}>
              <div style={{ width: "32px", height: "32px", background: "#c8d400", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <svg width="16" height="16" viewBox="0 0 22 22" fill="none"><polyline points="3,11 9,17 20,5" stroke="#1c1c1c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", color: "#fff", margin: "0 0 10px 0", lineHeight: 1.25, letterSpacing: "0.1px" }}>{p.title}</h3>
              <p style={{ fontSize: "13.5px", color: "#999", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 8. DIENSTEN BANNER ───────────────────────────────────────────────── */
function DienstenBanner() {
  const [ref, vis] = useInView();
  return (
    <section style={{ background: "#f4f4f4", padding: "80px 0" }}>
      <style>{`
        .db-inner { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .db-on .db-inner { opacity:1; transform:none; }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "db-on" : "")}>
        <div className="db-inner" style={{ background: "#fff", padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "32px", borderLeft: "6px solid #c8d400", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <div>
            <p style={{ margin: "0 0 8px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>ONZE DIENSTEN</p>
            <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(20px, 2.4vw, 30px)", textTransform: "uppercase", color: "#1c1c1c", margin: "0 0 10px 0", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
              VAN ENGINEERING TOT <span style={{ color: "#c8d400" }}>MONTAGE</span>
            </h2>
            <p style={{ color: "#777", fontSize: "15px", margin: 0, lineHeight: 1.6, maxWidth: "520px" }}>
              FerroWorks levert vijf geïntegreerde diensten: engineering, productie, coating, montage en reparatie. Alles in eigen beheer, zonder onderaannemers.
            </p>
          </div>
          <Link
            to="/diensten"
            style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "16px 32px", textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
            onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
          >
            BEKIJK ONZE DIENSTEN
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── 9. CTA ───────────────────────────────────────────────────────────── */
function CtaSection() {
  return (
    <section style={{ background: "#1c1c1c", padding: "88px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "40px", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: "0 0 12px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>KLAAR OM TE STARTEN?</p>
            <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 36px)", textTransform: "uppercase", color: "#fff", margin: "0 0 14px 0", lineHeight: 1.05, letterSpacing: "-0.3px" }}>
              ACTIEF IN UW SECTOR?<br /><span style={{ color: "#c8d400" }}>NEEM CONTACT OP.</span>
            </h2>
            <p style={{ color: "#999", fontSize: "15px", margin: 0, lineHeight: 1.6, maxWidth: "480px" }}>
              Stuur uw tekening of omschrijving op en ontvang binnen 24 uur een reactie van ons team.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", flexShrink: 0 }}>
            <Link
              to="/contact"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "16px 32px", textDecoration: "none", transition: "background .2s", whiteSpace: "nowrap" }}
              onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
              onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
            >
              NEEM CONTACT OP
            </Link>
            <a
              href="tel:+31165205617"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#fff", background: "transparent", border: "2px solid #555", padding: "14px 28px", textDecoration: "none", transition: "border-color .2s", whiteSpace: "nowrap" }}
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

/* ── DEFAULT EXPORT ───────────────────────────────────────────────────── */
export default function SectorenPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <PageHero />
      <IntroStrip />
      <SectorBouw />
      <SectorIndustrie />
      <SectorArchitectuur />
      <SectorMaritiem />
      <WaaromBlok />
      <DienstenBanner />
      <CtaSection />
    </>
  );
}
