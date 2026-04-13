import { useEffect, useRef, useState } from "react";
import img1 from "../assets/about/about-us1.jpeg";
import img2 from "../assets/about/about-us2.jpeg";
import img3 from "../assets/about/about-us3.jpeg";

function UwProjectSection() {
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
    <section style={{ background: "#f7f7f7", padding: "80px 0" }}>
      <style>{`
        .up-img1 { opacity:0; transform:translateX(-28px); transition: opacity .6s ease, transform .6s ease; }
        .up-img2 { opacity:0; transform:translateY(-20px); transition: opacity .6s .15s ease, transform .6s .15s ease; }
        .up-img3 { opacity:0; transform:translateY(28px);  transition: opacity .6s .3s ease, transform .6s .3s ease; }
        .up-sq   { opacity:0; transform:scale(0.4);        transition: opacity .5s .45s ease, transform .5s .45s ease; }
        .up-right { opacity:0; transform:translateX(32px); transition: opacity .65s .1s ease, transform .65s .1s ease; }
        .up-on .up-img1,
        .up-on .up-img2,
        .up-on .up-img3,
        .up-on .up-sq,
        .up-on .up-right { opacity:1; transform:none; }

        @media (max-width: 768px) {
          .up-grid { grid-template-columns: 1fr !important; }
          .up-photos { height: 380px !important; }
        }
      `}</style>

      <div
        ref={ref}
        className={"max-w-7xl mx-auto px-6 md:px-8 up-grid " + (vis ? "up-on" : "")}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}
      >
        {/* LEFT — overlapping photos */}
        <div
          className="up-photos"
          style={{ position: "relative", height: "500px" }}
        >
          {/* Lime square — bottom left, behind all images */}
          <div
            className="up-sq"
            style={{
              position: "absolute",
              bottom: "0",
              left: "8%",
              width: "88px",
              height: "88px",
              background: "#c8d400",
              zIndex: 1,
            }}
          />

          {/* about-us2: left tall portrait (man with glasses) */}
          <div
            className="up-img1"
            style={{
              position: "absolute",
              top: "60px",
              left: "0",
              width: "44%",
              height: "68%",
              overflow: "hidden",
              zIndex: 2,
              boxShadow: "0 4px 18px rgba(0,0,0,0.13)",
            }}
          >
            <img
              src={img2}
              alt="Ferna medewerker"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
            />
          </div>

          {/* about-us1: top small square (man working) */}
          <div
            className="up-img2"
            style={{
              position: "absolute",
              top: "0",
              left: "36%",
              width: "30%",
              height: "30%",
              overflow: "hidden",
              zIndex: 3,
              boxShadow: "0 4px 18px rgba(0,0,0,0.13)",
            }}
          >
            <img
              src={img1}
              alt="Ferna werkplaats"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
            />
          </div>

          {/* about-us3: bottom right big portrait (older man) */}
          <div
            className="up-img3"
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              width: "56%",
              height: "62%",
              overflow: "hidden",
              zIndex: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src={img3}
              alt="Ferna directie"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
            />
          </div>
        </div>

        {/* RIGHT — text */}
        <div className="up-right">
          <h2
            style={{
              fontFamily: "Arial Black, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(24px, 2.8vw, 38px)",
              lineHeight: 1.1,
              margin: "0 0 28px 0",
              letterSpacing: "-0.3px",
            }}
          >
            <span style={{ color: "#c8d400" }}>UW PROJECT IN </span>
            <span style={{ color: "#1c1c1c" }}>GOEDE HANDEN</span>
          </h2>

          <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.7, margin: "0 0 20px 0" }}>
            FerroWorks is opgericht als familiebedrijf en werkt nog steeds zo. Korte lijnen, persoonlijke betrokkenheid, één partner voor het volledige traject.
          </p>

          <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.7, margin: "0 0 36px 0" }}>
            Van ontwerp en engineering tot productie, coating en montage op locatie. Specialist in maatwerk staal, RVS en aluminium projecten voor industrie, bouw, architectuur en maritiem.
          </p>

          <a
            href="/contact"
            style={{
              display: "inline-block",
              background: "#8ab61e",
              color: "#fff",
              fontFamily: "Arial Black, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              padding: "16px 36px",
              borderRadius: "50px",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#7aa318"}
            onMouseLeave={e => e.currentTarget.style.background = "#8ab61e"}
          >
            NEEM CONTACT OP
          </a>
        </div>
      </div>
    </section>
  );
}

export default UwProjectSection;
