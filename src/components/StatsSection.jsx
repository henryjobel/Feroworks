import { useEffect, useRef, useState } from "react";

const stats = [
  { number: "20+", desc: "jaar ervaring in industrieel maatwerk" },
  { number: "2-4", desc: "weken gemiddelde levertijd" },
  { number: "16",  desc: "gespecialiseerde vakmensen" },
  { number: "100%", desc: "eigen productie, geen onderaannemers" },
];

function StatItem({ number, desc, delay }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        flex: 1,
      }}
    >
      {/* Number with lime corner brackets */}
      <div style={{ position: "relative", padding: "8px 12px" }}>
        {/* Top-left corner */}
        <span style={{
          position: "absolute", top: 0, left: 0,
          width: "12px", height: "12px",
          borderTop: "2.5px solid #c8d400",
          borderLeft: "2.5px solid #c8d400",
        }} />
        {/* Bottom-right corner */}
        <span style={{
          position: "absolute", bottom: 0, right: 0,
          width: "12px", height: "12px",
          borderBottom: "2.5px solid #c8d400",
          borderRight: "2.5px solid #c8d400",
        }} />

        <span style={{
          fontFamily: "Arial Black, Arial, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(26px, 3vw, 38px)",
          color: "#1c1c1c",
          lineHeight: 1,
          letterSpacing: "-0.5px",
        }}>
          {number}
        </span>
      </div>

      <p style={{
        fontSize: "13px",
        color: "#555",
        margin: 0,
        lineHeight: 1.5,
        maxWidth: "140px",
      }}>
        {desc}
      </p>
    </div>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ background: "#f4f4f4", padding: "52px 0" }}>
      <style>{`
        .ss-item {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity .5s ease, transform .5s ease;
        }
        .ss-item:nth-child(1) { transition-delay: 0s; }
        .ss-item:nth-child(2) { transition-delay: 0.12s; }
        .ss-item:nth-child(3) { transition-delay: 0.24s; }
        .ss-item:nth-child(4) { transition-delay: 0.36s; }
        .ss-on .ss-item { opacity: 1; transform: none; }

        @media (max-width: 640px) {
          .ss-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
        }
      `}</style>

      <div
        ref={ref}
        className={"max-w-7xl mx-auto px-6 md:px-8 ss-grid " + (vis ? "ss-on" : "")}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "48px",
          alignItems: "start",
        }}
      >
        {stats.map((s, i) => (
          <div className="ss-item" key={i}>
            <StatItem number={s.number} desc={s.desc} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
