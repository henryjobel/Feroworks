import { useEffect, useRef, useState } from "react";
import imgLandscape from "../assets/over-ons2.png";
import imgPortrait from "../assets/over-ons3.png";

const bulletItems = [
  "Staalbouw en RVS specials van ieder formaat.",
  "Ondersteuning voor reparatie en onderhoud op locatie.",
  "Staal en RVS gesneden in verschillende productiehallen.",
  "Staalbouw oplossingen van concept tot levering en installatie.",
  "Volledige begeleiding en realisatie van jouw staalbouw project op maat.",
  "Last-minute ondersteuning voor machines, leidingwerk, constructies, tanks en andere staalbouw op industriele faciliteiten.",
  "Staalbouw oplossingen uitdenken, engineering, productie, vervaardiging, coating, herwaarmerken, transport, montage en installatie op locatie.",
];

function WatFernaSection() {
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
    <section
      ref={ref}
      style={{ background: "#f4f4f4", padding: "72px 0" }}
    >
      <style>{`
        .wf-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s ease, transform .65s ease; }
        .wf-img1  { opacity:0; transform:translateY(-24px); transition: opacity .65s .2s ease, transform .65s .2s ease; }
        .wf-img2  { opacity:0; transform:translateY(24px);  transition: opacity .65s .4s ease, transform .65s .4s ease; }
        .wf-sq    { opacity:0; transform:scale(0.4);        transition: opacity .5s .55s ease, transform .5s .55s ease; }
        .wf-on .wf-left,
        .wf-on .wf-img1,
        .wf-on .wf-img2,
        .wf-on .wf-sq { opacity:1; transform:none; }
      `}</style>

      <div
        className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "wf-on" : "")}
        style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:"72px", alignItems:"start" }}
      >

        {/* LEFT */}
        <div className="wf-left">
          <h2
            style={{
              margin:"0 0 24px 0",
              fontFamily:"Arial Black, Arial, sans-serif",
              fontWeight:900,
              fontSize:"clamp(20px,2.2vw,28px)",
              lineHeight:1.1,
              textTransform:"uppercase",
              letterSpacing:"-0.2px",
            }}
          >
            <span style={{ color:"#c8d400" }}>WAT FERNA VOOR JE</span>
            <br />
            <span style={{ color:"#1c1c1c" }}>DOET</span>
          </h2>

          <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:"13px" }}>
            {bulletItems.map((item, i) => (
              <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:"9px" }}>
                <span style={{
                  width:"5px", height:"5px", borderRadius:"50%",
                  background:"#555", marginTop:"7px", flexShrink:0,
                }} />
                <span style={{ color:"#555", fontSize:"15px", lineHeight:1.6 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — overlapping images */}
        <div style={{ position:"relative", height:"360px" }}>

          {/* Lime square — bottom right, z=1 (behind portrait) */}
          <div
            className="wf-sq"
            style={{
              position:"absolute",
              bottom:0,
              right:0,
              width:"90px",
              height:"90px",
              background:"#c8d400",
              zIndex:1,
            }}
          />

          {/* Landscape image — top-left of right col, bigger */}
          <div
            className="wf-img1"
            style={{
              position:"absolute",
              top:0,
              left:0,
              width:"67%",
              height:"72%",
              overflow:"hidden",
              zIndex:2,
              boxShadow:"0 2px 16px rgba(0,0,0,0.13)",
            }}
          >
            <img
              src={imgLandscape}
              alt="Ferna werkplaats"
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
            />
          </div>

          {/* Portrait image — bottom-right, overlapping landscape + covering lime */}
          <div
            className="wf-img2"
            style={{
              position:"absolute",
              bottom:0,
              right:"36px",
              width:"42%",
              height:"68%",
              overflow:"hidden",
              zIndex:3,
              boxShadow:"0 2px 16px rgba(0,0,0,0.16)",
            }}
          >
            <img
              src={imgPortrait}
              alt="Ferna medewerker"
              style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top", display:"block" }}
            />
          </div>

        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          .max-w-7xl { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export default WatFernaSection;
