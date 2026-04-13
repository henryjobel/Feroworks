import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpeg";
import { useCms } from "../cms/CmsContext";

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

/* ── 1. HERO ─────────────────────────────────────────────────────────── */
function PageHero() {
  return (
    <section style={{ position: "relative", width: "100%", minHeight: "340px", display: "flex", alignItems: "center", overflow: "hidden", background: "#141616" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center right" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <Link to="/" style={{ color: "#c8d400", fontSize: "13px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Home</Link>
          <span style={{ color: "#666", fontSize: "13px" }}>›</span>
          <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Contact</span>
        </div>

        <h1 style={{ margin: "0 0 16px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.5px", textTransform: "uppercase" }}>
          <span style={{ color: "#c8d400" }}>NEEM </span><span style={{ color: "#fff" }}>CONTACT OP</span>
        </h1>
        <p style={{ margin: 0, color: "#bbb", fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.6, maxWidth: "520px" }}>
          Stuur uw tekening op of stel uw vraag. Wij reageren binnen 24 uur.
        </p>
        <div style={{ width: "56px", height: "4px", background: "#c8d400", marginTop: "28px", borderRadius: "2px" }} />
      </div>
    </section>
  );
}

/* ── 2. CONTACT FORMULIER + INFO ──────────────────────────────────────── */
function ContactMain() {
  const [ref, vis] = useInView(0.08);
  const { cms } = useCms();
  const c = cms.contact || {};
  const [formData, setFormData] = useState({ naam: "", bedrijf: "", email: "", telefoon: "", bericht: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const tel = c.tel || "+31 (0)165 205 601";
  const email = c.email || "info@ferroworks.nl";
  const adres = c.adres || "Westelijke Havendijk 31\n4703 RL Roosendaal";
  const openingstijden = c.openingstijden
    ? c.openingstijden.split("\n").map(line => { const parts = line.split(":"); const time = parts.slice(1).join(":").trim(); return [parts[0].trim(), time]; }).filter(p => p[0])
    : [["Maandag \u2013 Vrijdag", "07:30 \u2013 17:00"], ["Zaterdag", "Op afspraak"], ["Zondag", "Gesloten"]];

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    // Simulate async submit
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1200);
  }

  const inputStyle = {
    width: "100%",
    background: "#f4f4f4",
    border: "1.5px solid #e0e0e0",
    padding: "14px 16px",
    fontSize: "14px",
    color: "#1c1c1c",
    outline: "none",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    transition: "border-color .2s",
  };

  const labelStyle = {
    fontFamily: "Arial Black, Arial, sans-serif",
    fontWeight: 900,
    fontSize: "11px",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "#444",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <section style={{ background: "#fff", padding: "80px 0" }}>
      <style>{`
        .cm-form  { opacity:0; transform:translateX(-32px); transition: opacity .65s ease, transform .65s ease; }
        .cm-info  { opacity:0; transform:translateX(32px);  transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .cm-on .cm-form, .cm-on .cm-info { opacity:1; transform:none; }
        .fw-input:focus { border-color: #c8d400 !important; }
        @media (max-width: 768px) { .cm-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 cm-grid " + (vis ? "cm-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "72px", alignItems: "start" }}>

        {/* LEFT — form */}
        <div className="cm-form">
          <p style={{ margin: "0 0 12px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>STUUR EEN BERICHT</p>
          <h2 style={{ margin: "0 0 36px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.4vw, 30px)", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "-0.3px" }}>
            <span style={{ color: "#1c1c1c" }}>WIJ REAGEREN </span><span style={{ color: "#c8d400" }}>BINNEN 24 UUR</span>
          </h2>

          {submitted ? (
            <div style={{ background: "#f4f4f4", borderLeft: "4px solid #c8d400", padding: "32px 28px" }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "18px", color: "#1c1c1c", textTransform: "uppercase", marginBottom: "10px" }}>
                Bericht ontvangen!
              </div>
              <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.7, margin: 0 }}>
                Bedankt voor uw bericht. Wij nemen zo snel mogelijk contact met u op.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Naam + Bedrijf */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Naam *</label>
                  <input
                    className="fw-input"
                    style={inputStyle}
                    type="text"
                    name="naam"
                    value={formData.naam}
                    onChange={handleChange}
                    placeholder="Uw naam"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Bedrijf</label>
                  <input
                    className="fw-input"
                    style={inputStyle}
                    type="text"
                    name="bedrijf"
                    value={formData.bedrijf}
                    onChange={handleChange}
                    placeholder="Uw bedrijfsnaam"
                  />
                </div>
              </div>

              {/* Email + Telefoon */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>E-mailadres *</label>
                  <input
                    className="fw-input"
                    style={inputStyle}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="uw@email.nl"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Telefoon</label>
                  <input
                    className="fw-input"
                    style={inputStyle}
                    type="tel"
                    name="telefoon"
                    value={formData.telefoon}
                    onChange={handleChange}
                    placeholder="+31 ..."
                  />
                </div>
              </div>

              {/* Bericht */}
              <div>
                <label style={labelStyle}>Bericht *</label>
                <textarea
                  className="fw-input"
                  style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }}
                  name="bericht"
                  value={formData.bericht}
                  onChange={handleChange}
                  placeholder="Beschrijf uw project of vraag..."
                  required
                />
              </div>

              {/* Bestand upload */}
              <div>
                <label style={labelStyle}>Tekening / bijlage</label>
                <div style={{ border: "1.5px dashed #ccc", background: "#f9f9f9", padding: "20px 16px", textAlign: "center", cursor: "pointer", position: "relative" }}>
                  <input
                    type="file"
                    accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                  />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 8px" }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#c8d400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="17 8 12 3 7 8" stroke="#c8d400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="3" x2="12" y2="15" stroke="#c8d400" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>Sleep een bestand of <span style={{ color: "#c8d400", fontWeight: 700 }}>klik om te uploaden</span></p>
                  <p style={{ fontSize: "11px", color: "#bbb", margin: "4px 0 0" }}>PDF, DWG, DXF, JPG, PNG</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  fontFamily: "Arial Black, Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "#1c1c1c",
                  background: sending ? "#b3be00" : "#c8d400",
                  border: "none",
                  padding: "18px 40px",
                  cursor: sending ? "default" : "pointer",
                  transition: "background .2s",
                  alignSelf: "flex-start",
                }}
                onMouseEnter={e => { if (!sending) e.currentTarget.style.background = "#b3be00"; }}
                onMouseLeave={e => { if (!sending) e.currentTarget.style.background = "#c8d400"; }}
              >
                {sending ? "VERZENDEN..." : "VERSTUUR BERICHT"}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT — contact info */}
        <div className="cm-info" style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          <p style={{ margin: "0 0 12px 0", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>CONTACTGEGEVENS</p>
          <h2 style={{ margin: "0 0 36px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.4vw, 30px)", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "-0.3px" }}>
            <span style={{ color: "#1c1c1c" }}>DIRECT </span><span style={{ color: "#c8d400" }}>BEREIKBAAR</span>
          </h2>

          {/* Cards */}
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#c8d400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              label: "Telefoon",
              value: tel,
              href: `tel:${tel.replace(/[\s()]/g, "")}`,
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#c8d400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="22,6 12,13 2,6" stroke="#c8d400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              label: "E-mail",
              value: email,
              href: `mailto:${email}`,
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#c8d400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="3" stroke="#c8d400" strokeWidth="2" />
                </svg>
              ),
              label: "Adres",
              value: adres,
              href: `https://maps.google.com/?q=${encodeURIComponent(adres.replace(/\n/g, " "))}`,
            },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              target={item.label === "Adres" ? "_blank" : undefined}
              rel={item.label === "Adres" ? "noopener noreferrer" : undefined}
              style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "24px 0", borderBottom: "1px solid #eee", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <div style={{ width: "44px", height: "44px", background: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#999", marginBottom: "4px" }}>{item.label}</div>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "15px", color: "#1c1c1c", whiteSpace: "pre-line", lineHeight: 1.5 }}>{item.value}</div>
              </div>
            </a>
          ))}

          {/* Opening hours */}
          <div style={{ marginTop: "32px", background: "#f4f4f4", padding: "24px 24px" }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#c8d400", marginBottom: "16px" }}>OPENINGSTIJDEN</div>
            {openingstijden.map(([dag, tijd], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < openingstijden.length - 1 ? "1px solid #e4e4e4" : "none" }}>
                <span style={{ fontSize: "13px", color: "#555" }}>{dag}</span>
                <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", color: "#1c1c1c" }}>{tijd}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 3. KAART ────────────────────────────────────────────────────────── */
function MapSection() {
  const { cms } = useCms();
  const c = cms.contact || {};
  const adres = c.adres || "Westelijke Havendijk 31\n4703 RL Roosendaal";
  const mapSrc = c.mapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.8!2d4.4630!3d51.5300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c417d4d3e40000%3A0x0!2sWestelijke+Havendijk+31%2C+4703+RL+Roosendaal!5e0!3m2!1snl!2snl!4v1";
  return (
    <section style={{ background: "#f4f4f4", padding: "0" }}>
      <div style={{ width: "100%", height: "420px", position: "relative", overflow: "hidden" }}>
        <iframe
          title="FerroWorks locatie"
          src={mapSrc}
          width="100%"
          height="420"
          style={{ border: 0, display: "block", filter: "grayscale(0.3)" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div style={{ position: "absolute", top: "24px", left: "24px", background: "#1c1c1c", padding: "14px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "8px", height: "8px", background: "#c8d400", flexShrink: 0 }} />
          <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", color: "#fff", letterSpacing: "0.5px" }}>{adres.replace("\n", " \xB7 ")}</span>
        </div>
      </div>
    </section>
  );
}

/* ── 4. SNELLE CONTACTINFO STRIP ─────────────────────────────────────── */
function ContactStrip() {
  const [ref, vis] = useInView(0.2);
  const { cms } = useCms();
  const c = cms.contact || {};
  const tel = c.tel || "+31 (0)165 205 601";
  const email = c.email || "info@ferroworks.nl";
  const adres = c.adres || "Westelijke Havendijk 31\nRoosendaal";
  const items = [
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#c8d400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      title: "BELLEN", value: tel, href: `tel:${tel.replace(/[\s()]/g, "")}`,
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#c8d400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="22,6 12,13 2,6" stroke="#c8d400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      title: "MAILEN", value: email, href: `mailto:${email}`,
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#c8d400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" stroke="#c8d400" strokeWidth="2"/></svg>,
      title: "BEZOEKEN", value: adres, href: `https://maps.google.com/?q=${encodeURIComponent(adres.replace(/\n/g, " "))}`,
    },
  ];
  return (
    <section style={{ background: "#1c1c1c", padding: "52px 0" }}>
      <style>{`
        .cs-item { opacity:0; transform:translateY(16px); transition: opacity .5s ease, transform .5s ease; }
        .cs-on .cs-item:nth-child(1) { opacity:1; transform:none; transition-delay:.0s; }
        .cs-on .cs-item:nth-child(2) { opacity:1; transform:none; transition-delay:.12s; }
        .cs-on .cs-item:nth-child(3) { opacity:1; transform:none; transition-delay:.24s; }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "cs-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", alignItems: "stretch" }}>
        {items.map((item, i) => (
          <a
            key={i}
            href={item.href}
            target={item.title === "BEZOEKEN" ? "_blank" : undefined}
            rel={item.title === "BEZOEKEN" ? "noopener noreferrer" : undefined}
            className="cs-item"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "36px 24px", textDecoration: "none", borderRight: i < 2 ? "1px solid #333" : "none", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#252525"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {item.icon}
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#888" }}>{item.title}</div>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "15px", color: "#fff", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.5 }}>{item.value}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ── PAGE EXPORT ──────────────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <>
      <PageHero />
      <ContactMain />
      <MapSection />
      <ContactStrip />
    </>
  );
}
