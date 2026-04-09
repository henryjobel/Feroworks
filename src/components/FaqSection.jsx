import { useState, useRef, useEffect } from "react";

const faqs = [
  {
    q: "WIJ HEBBEN AL EEN VASTE STAALPARTNER. WAAROM ZOUDEN WE MET FERNA PRATEN?",
    a: "Omdat Ferna zich richt op de complexe, maatwerk opdrachten die vaak buiten het profiel van een standaard staalpartner vallen. We werken snel, nauwkeurig en volledig in eigen beheer — zonder onderaannemers.",
  },
  {
    q: "ZIJN JULLIE GROOT GENOEG VOOR ONZE PROJECTEN?",
    a: "Met 16 gespecialiseerde vakmensen en een volledig eigen machinepark — inclusief watersnijder 6 x 3 meter — zijn we toegerust voor complexe industriële projecten. Gecertificeerd voor de meest veeleisende opdrachtgevers.",
  },
  {
    q: "WELKE CERTIFICERINGEN HEEFT FERNA?",
    a: "Ferna is Lloyd's-gecertificeerd en voldoet aan de strenge eisen voor offshore- en petrochemische projecten. We leveren volledige documentatie en kwaliteitsborging mee.",
  },
  {
    q: "HOE ZEKER IS DE LEVERTIJD VAN 2 TOT 4 WEKEN?",
    a: "De levertijd van 2 tot 4 weken is een belofte, geen schatting. Doordat alles in eigen werkplaats gebeurt, hebben we volledige controle over planning en kwaliteit. Bij urgente projecten denken we graag mee.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        marginBottom: "12px",
        borderRadius: "2px",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "22px 28px",
        background: open ? "#c8d400" : "none",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        gap: "24px",
        transition: "background 0.25s ease",
      }}
      >
        <span
          style={{
            fontFamily: "Arial Black, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "13.5px",
            textTransform: "uppercase",
            color: "#1c1c1c",
            letterSpacing: "0.1px",
            lineHeight: 1.3,
          }}
        >
          {q}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: "22px",
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <line x1="9" y1="2" x2="9" y2="16" stroke={open ? "#1c1c1c" : "#aaa"} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="2" y1="9" x2="16" y2="9" stroke={open ? "#1c1c1c" : "#aaa"} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? "300px" : "0",
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
      >
        <p
          style={{
            margin: "0",
            padding: "0 28px 22px",
            fontSize: "14.5px",
            color: "#666",
            lineHeight: 1.7,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

function FaqSection() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ background: "#ebebeb", padding: "80px 0" }}>
      <style>{`
        .faq-wrap { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .faq-vis  { opacity:1; transform:none; }
      `}</style>

      <div
        ref={ref}
        className={"max-w-7xl mx-auto px-6 md:px-8 faq-wrap " + (vis ? "faq-vis" : "")}
      >
        {/* Heading */}
        <h2
          style={{
            fontFamily: "Arial Black, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(22px, 2.6vw, 32px)",
            textTransform: "uppercase",
            color: "#1c1c1c",
            textAlign: "center",
            margin: "0 0 48px 0",
            letterSpacing: "-0.3px",
          }}
        >
          VRAGEN DIE INKOPERS ONS STELLEN
        </h2>

        {/* FAQ items — centered column */}
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {faqs.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
