import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpeg";
import imgLandscape from "../assets/over-ons2.png";
import imgPortrait from "../assets/over-ons3.png";
import imgMachine from "../assets/over-ons1.png";
import imgAbout1 from "../assets/about/about-us1.jpeg";
import imgAbout2 from "../assets/about/about-us2.jpeg";
import imgAbout3 from "../assets/about/about-us3.jpeg";

function useInView(threshold = 0.12) {
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
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0, marginTop: "3px" }}>
      <polyline points="3,11 9,17 20,5" stroke="#c8d400" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* 1. HERO */
function PageHero() {
  return (
    <section style={{ position: "relative", width: "100%", minHeight: "380px", display: "flex", alignItems: "center", overflow: "hidden", background: "#141616" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center right" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <Link to="/" style={{ color: "#c8d400", fontSize: "13px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Home</Link>
          <span style={{ color: "#666", fontSize: "13px" }}>›</span>
          <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Over Ons</span>
        </div>

        <h1 style={{ margin: "0 0 16px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.5px", textTransform: "uppercase" }}>
          <span style={{ color: "#c8d400" }}>VORMGEVERS </span><span style={{ color: "#fff" }}>IN METAAL</span>
        </h1>
        <p style={{ margin: 0, color: "#bbb", fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.6, maxWidth: "520px" }}>
          FerroWorks begeleidt metaalprojecten van ontwerp en engineering tot productie en montage. Specialist in maatwerk Staal, RVS en Aluminium.
        </p>
        <div style={{ width: "56px", height: "4px", background: "#c8d400", marginTop: "28px", borderRadius: "2px" }} />
      </div>
    </section>
  );
}

/* 2. ONS VERHAAL */
function OnsVerhaal() {
  const [ref, vis] = useInView();
  return (
    <section style={{ background: "#f4f4f4", padding: "80px 0" }}>
      <style>{`
        .ov-left { opacity:0; transform:translateX(-36px); transition: opacity .65s ease, transform .65s ease; }
        .ov-img1 { opacity:0; transform:translateY(-24px); transition: opacity .65s .2s ease, transform .65s .2s ease; }
        .ov-img2 { opacity:0; transform:translateY(24px);  transition: opacity .65s .4s ease, transform .65s .4s ease; }
        .ov-sq   { opacity:0; transform:scale(0.4);        transition: opacity .5s .55s ease, transform .5s .55s ease; }
        .ov-on .ov-left, .ov-on .ov-img1, .ov-on .ov-img2, .ov-on .ov-sq { opacity:1; transform:none; }
        @media (max-width: 768px) { .ov-grid { grid-template-columns: 1fr !important; } .ov-photos { height: 300px !important; } }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 ov-grid " + (vis ? "ov-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "72px", alignItems: "start" }}>

        <div className="ov-left">
          <p style={{ margin: "0 0 12px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>ONS VERHAAL</p>
          <h2 style={{ margin: "0 0 24px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(20px, 2.4vw, 30px)", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "-0.3px" }}>
            <span style={{ color: "#c8d400" }}>GEBOUWD OP</span><br />
            <span style={{ color: "#1c1c1c" }}>VAKMANSCHAP</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.75, margin: "0 0 18px 0" }}>
            FerroWorks is een familiebedrijf met meer dan 15 jaar ervaring in metaalmaatwerk. We begeleiden projecten van A tot Z — van ontwerp en engineering tot productie, coating en montage op locatie.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.75, margin: "0 0 18px 0" }}>
            Specialist in maatwerk staal, RVS en aluminium voor industrie, bouw & utiliteit, architectuur & design en maritieme toepassingen.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.75, margin: 0 }}>
            Heldere afspraken, transparante kosten en één aanspreekpunt van begin tot eind. Dat is hoe wij werken.
          </p>
        </div>

        <div className="ov-photos" style={{ position: "relative", height: "380px" }}>
          <div className="ov-sq" style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: "#c8d400", zIndex: 1 }} />
          <div className="ov-img1" style={{ position: "absolute", top: "40px", left: 0, width: "56%", height: "65%", overflow: "hidden", zIndex: 2, boxShadow: "0 4px 18px rgba(0,0,0,0.13)" }}>
            <img src={imgLandscape} alt="FerroWorks productie" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
          <div className="ov-img2" style={{ position: "absolute", bottom: 0, right: 0, width: "52%", height: "60%", overflow: "hidden", zIndex: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <img src={imgPortrait} alt="FerroWorks medewerker" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 3. STATS */
const stats = [
  { number: "15+",  label: "jaar ervaring",      sub: "in metaalmaatwerk" },
  { number: "3",    label: "materialen",          sub: "Staal, RVS & Aluminium" },
  { number: "100%", label: "eigen productie",     sub: "geen onderaannemers" },
  { number: "A-Z",  label: "volledig ontzorgd",   sub: "van ontwerp tot montage" },
];

function StatsRow() {
  const [ref, vis] = useInView(0.15);
  return (
    <section style={{ background: "#1c1c1c", padding: "60px 0" }}>
      <style>{`
        .st2-item { opacity:0; transform:translateY(20px); transition: opacity .5s ease, transform .5s ease; }
        .st2-on .st2-item:nth-child(1) { opacity:1; transform:none; transition-delay:.0s; }
        .st2-on .st2-item:nth-child(2) { opacity:1; transform:none; transition-delay:.12s; }
        .st2-on .st2-item:nth-child(3) { opacity:1; transform:none; transition-delay:.24s; }
        .st2-on .st2-item:nth-child(4) { opacity:1; transform:none; transition-delay:.36s; }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "st2-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>
        {stats.map((s, i) => (
          <div key={i} className="st2-item" style={{ borderLeft: "3px solid #c8d400", paddingLeft: "20px" }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 3vw, 40px)", color: "#c8d400", lineHeight: 1, letterSpacing: "-0.5px" }}>{s.number}</div>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", color: "#fff", textTransform: "uppercase", letterSpacing: "0.3px", marginTop: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "4px", lineHeight: 1.4 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 4. WAT FERROWORKS VOOR JE DOET */
const services = [
  "Heldere afspraken, zonder verrassingen.",
  "Totaal ontzorgen van ontwerp tot montage.",
  "Reparatie en onderhoud op locatie.",
  "Advies en ondersteuning bij ontwerp en uitvoerbaarheid.",
  "Één partner voor het volledige traject.",
  "Maakbaar, praktisch en doordacht.",
  "Transparant in kosten en planning.",
];

function WatWeDoen() {
  const [ref, vis] = useInView();
  return (
    <section style={{ background: "#fff", padding: "80px 0" }}>
      <style>{`
        .wwd-left  { opacity:0; transform:translateX(-32px); transition: opacity .6s ease, transform .6s ease; }
        .wwd-right { opacity:0; transform:translateX(32px);  transition: opacity .6s .2s ease, transform .6s .2s ease; }
        .wwd-on .wwd-left, .wwd-on .wwd-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .wwd-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 wwd-grid " + (vis ? "wwd-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        <div className="wwd-left">
          <p style={{ margin: "0 0 12px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>ONZE DIENSTEN</p>
          <h2 style={{ margin: "0 0 32px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#c8d400" }}>WAT FERROWORKS</span><br />
            <span style={{ color: "#1c1c1c" }}>VOOR JE DOET</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {services.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckIcon />
                <span style={{ color: "#555", fontSize: "15px", lineHeight: 1.6 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="wwd-right" style={{ position: "relative" }}>
          <div style={{ position: "absolute", bottom: "-16px", right: "-16px", width: "64px", height: "64px", background: "#c8d400", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <img src={imgMachine} alt="FerroWorks productie" style={{ width: "100%", height: "340px", objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 5. WAT ONS ANDERS MAAKT */
const differentiators = [
  {
    title: "GROOT GENOEG OM REGIE TE VOEREN",
    desc: "Wij hebben de slagkracht en expertise om technische metaalprojecten volledig te realiseren.",
  },
  {
    title: "KLEIN GENOEG OM DIRECT TE SCHAKELEN",
    desc: "Direct contact, snel schakelen en meebewegen met jouw planning.",
  },
  {
    title: "PERSOONLIJK GENOEG OM VOORUIT TE DENKEN",
    desc: "We adviseren, optimaliseren en zorgen dat jouw project van begin tot eind klopt.",
  },
];

function WatOnsAnders() {
  const [ref, vis] = useInView();
  return (
    <section style={{ background: "#f4f4f4", padding: "80px 0" }}>
      <style>{`
        .woa2-head { opacity:0; transform:translateY(-20px); transition: opacity .55s ease, transform .55s ease; }
        .woa2-card { opacity:0; transform:translateY(28px); transition: opacity .55s ease, transform .55s ease; }
        .woa2-on .woa2-head { opacity:1; transform:none; }
        .woa2-on .woa2-card:nth-child(1) { opacity:1; transform:none; transition-delay:.1s; }
        .woa2-on .woa2-card:nth-child(2) { opacity:1; transform:none; transition-delay:.22s; }
        .woa2-on .woa2-card:nth-child(3) { opacity:1; transform:none; transition-delay:.34s; }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "woa2-on" : "")}>
        <div className="woa2-head" style={{ marginBottom: "48px" }}>
          <p style={{ margin: "0 0 10px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>WAAROM FERROWORKS</p>
          <h2 style={{ margin: 0, fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#1c1c1c" }}>WAT ONS </span><span style={{ color: "#c8d400" }}>ANDERS MAAKT</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
          {differentiators.map((d, i) => (
            <div key={i} className="woa2-card" style={{ background: "#fff", padding: "36px 28px", borderBottom: "4px solid #c8d400" }}>
              <div style={{ width: "40px", height: "40px", background: "#c8d400", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <CheckIcon />
              </div>
              <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.2px", color: "#1c1c1c", margin: "0 0 12px 0", lineHeight: 1.25 }}>{d.title}</h3>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6. TEAM FOTO */
function TeamSection() {
  const [ref, vis] = useInView();
  return (
    <section style={{ background: "#fff", padding: "80px 0" }}>
      <style>{`
        .tm2-right { opacity:0; transform:translateX(36px); transition: opacity .65s ease, transform .65s ease; }
        .tm2-img1  { opacity:0; transform:translateX(-28px); transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .tm2-img2  { opacity:0; transform:translateY(-20px); transition: opacity .65s .3s ease, transform .65s .3s ease; }
        .tm2-img3  { opacity:0; transform:translateY(28px);  transition: opacity .65s .45s ease, transform .65s .45s ease; }
        .tm2-sq    { opacity:0; transform:scale(0.4);        transition: opacity .5s .6s ease, transform .5s .6s ease; }
        .tm2-on .tm2-right, .tm2-on .tm2-img1, .tm2-on .tm2-img2, .tm2-on .tm2-img3, .tm2-on .tm2-sq { opacity:1; transform:none; }
        @media (max-width: 768px) { .tm2-grid { grid-template-columns: 1fr !important; } .tm2-photos { height: 340px !important; } }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 tm2-grid " + (vis ? "tm2-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        <div className="tm2-photos" style={{ position: "relative", height: "480px" }}>
          <div className="tm2-sq" style={{ position: "absolute", bottom: 0, left: "6%", width: "84px", height: "84px", background: "#c8d400", zIndex: 1 }} />
          <div className="tm2-img1" style={{ position: "absolute", top: "60px", left: 0, width: "44%", height: "66%", overflow: "hidden", zIndex: 2, boxShadow: "0 4px 18px rgba(0,0,0,0.13)" }}>
            <img src={imgAbout2} alt="FerroWorks medewerker" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
          </div>
          <div className="tm2-img2" style={{ position: "absolute", top: 0, left: "36%", width: "30%", height: "30%", overflow: "hidden", zIndex: 3, boxShadow: "0 4px 18px rgba(0,0,0,0.13)" }}>
            <img src={imgAbout1} alt="FerroWorks werkplaats" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
          <div className="tm2-img3" style={{ position: "absolute", bottom: 0, right: 0, width: "54%", height: "60%", overflow: "hidden", zIndex: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <img src={imgAbout3} alt="FerroWorks team" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
          </div>
        </div>

        <div className="tm2-right">
          <p style={{ margin: "0 0 12px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>ONS TEAM</p>
          <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px", margin: "0 0 24px 0" }}>
            <span style={{ color: "#1c1c1c" }}>VAKMANNEN MET </span><span style={{ color: "#c8d400" }}>EÉN DOEL</span>
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.75, margin: "0 0 18px 0" }}>
            Ons team bestaat uit gespecialiseerde metaalbewerkers, lassers, engineers en projectleiders. Elk met diepgaande kennis van staal, RVS en aluminium.
          </p>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.75, margin: "0 0 32px 0" }}>
            Wij werken nauw samen met onze klanten: van de eerste tekening tot de laatste bout op locatie. Altijd één aanspreekpunt, altijd persoonlijk.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {["Ruim 15 jaar ervaring in metaalmaatwerk", "Maakbaar, praktisch en doordacht", "Reparatie en onderhoud op locatie"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckIcon />
                <span style={{ color: "#555", fontSize: "15px", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 7. SECTOREN */
const sectoren = [
  { naam: "Bouw & Utiliteit",    diensten: ["Staalconstructies", "Standaard hekwerken", "Prefab balkons"] },
  { naam: "Industrie",           diensten: ["Machinebouw", "Maatwerk staalconstructies", "Industriële installaties", "Laswerkzaamheden op locatie"] },
  { naam: "Architectuur & Design", diensten: ["Design trappen", "Interieur- en exterieur maatwerk"] },
  { naam: "Maritiem",            diensten: ["Jachtbouw"] },
];

function SectorenOverzicht() {
  const [ref, vis] = useInView();
  return (
    <section style={{ background: "#1c1c1c", padding: "80px 0" }}>
      <style>{`
        .so-head { opacity:0; transform:translateY(-20px); transition: opacity .5s ease, transform .5s ease; }
        .so-card { opacity:0; transform:translateY(24px); transition: opacity .5s ease, transform .5s ease; }
        .so-on .so-head { opacity:1; transform:none; }
        .so-on .so-card:nth-child(1) { opacity:1; transform:none; transition-delay:.08s; }
        .so-on .so-card:nth-child(2) { opacity:1; transform:none; transition-delay:.18s; }
        .so-on .so-card:nth-child(3) { opacity:1; transform:none; transition-delay:.28s; }
        .so-on .so-card:nth-child(4) { opacity:1; transform:none; transition-delay:.38s; }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "so-on" : "")}>
        <div className="so-head" style={{ marginBottom: "48px" }}>
          <p style={{ margin: "0 0 10px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>WAT WE BOUWEN</p>
          <h2 style={{ margin: 0, fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px", color: "#fff" }}>
            ONZE <span style={{ color: "#c8d400" }}>SECTOREN</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {sectoren.map((s, i) => (
            <div key={i} className="so-card" style={{ background: "#2a2a2a", padding: "32px 24px", borderTop: "4px solid #c8d400" }}>
              <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "16px", textTransform: "uppercase", color: "#fff", margin: "0 0 20px 0", letterSpacing: "-0.2px", lineHeight: 1.2 }}>{s.naam}</h3>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {s.diensten.map((d, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{ width: "6px", height: "6px", background: "#c8d400", flexShrink: 0, marginTop: "6px" }} />
                    <span style={{ color: "#bbb", fontSize: "13px", lineHeight: 1.5 }}>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 8. CERTIFICERINGEN */
const certs = [
  { code: "VCA",     label: "Veiligheid, gezondheid & milieu" },
  { code: "EN-1090", label: "Staal- en aluminiumconstructies" },
  { code: "CE",      label: "Conformiteit & veiligheidsstandaard" },
];

function Certificeringen() {
  const [ref, vis] = useInView();
  return (
    <section style={{ background: "#fff", padding: "72px 0" }}>
      <style>{`
        .ce2-head { opacity:0; transform:translateY(-18px); transition: opacity .5s ease, transform .5s ease; }
        .ce2-card { opacity:0; transform:translateY(24px); transition: opacity .5s ease, transform .5s ease; }
        .ce2-on .ce2-head { opacity:1; transform:none; }
        .ce2-on .ce2-card:nth-child(1) { opacity:1; transform:none; transition-delay:.08s; }
        .ce2-on .ce2-card:nth-child(2) { opacity:1; transform:none; transition-delay:.2s; }
        .ce2-on .ce2-card:nth-child(3) { opacity:1; transform:none; transition-delay:.32s; }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "ce2-on" : "")}>
        <div className="ce2-head" style={{ marginBottom: "48px" }}>
          <p style={{ margin: "0 0 10px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>ONZE CERTIFICERINGEN</p>
          <h2 style={{ margin: 0, fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 34px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
            <span style={{ color: "#1c1c1c" }}>GECERTIFICEERD </span><span style={{ color: "#c8d400" }}>VCA, EN-1090 & CE</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {certs.map((c, i) => (
            <div key={i} className="ce2-card" style={{ border: "1.5px solid #e0e0e0", padding: "36px 28px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "#c8d400" }} />
              <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "26px", color: "#1c1c1c", letterSpacing: "-0.3px" }}>{c.code}</span>
              <span style={{ fontSize: "13px", color: "#777", lineHeight: 1.4 }}>{c.label}</span>
              <div style={{ width: "32px", height: "3px", background: "#c8d400", marginTop: "4px" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 9. CTA */
function CtaSection() {
  return (
    <section style={{ background: "#f4f4f4", padding: "80px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div style={{ background: "#1c1c1c", padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "28px" }}>
          <div>
            <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(20px, 2.4vw, 30px)", textTransform: "uppercase", color: "#fff", margin: "0 0 10px 0", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
              KLAAR OM <span style={{ color: "#c8d400" }}>TE STARTEN?</span>
            </h2>
            <p style={{ color: "#999", fontSize: "15px", margin: 0, lineHeight: 1.5 }}>
              Stuur uw tekening op of neem contact op — wij reageren binnen 24 uur.
            </p>
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link
              to="/contact"
              style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "16px 32px", textDecoration: "none", display: "inline-block" }}
              onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
              onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
            >
              NEEM CONTACT OP
            </Link>
            <a
              href="tel:+31165205617"
              style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#fff", background: "transparent", border: "2px solid #555", padding: "14px 28px", textDecoration: "none", display: "inline-block" }}
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

export default function OverOnsPage() {
  return (
    <>
      <PageHero />
      <OnsVerhaal />
      <StatsRow />
      <WatWeDoen />
      <WatOnsAnders />
      <TeamSection />
      <SectorenOverzicht />
      <Certificeringen />
      <CtaSection />
    </>
  );
}
