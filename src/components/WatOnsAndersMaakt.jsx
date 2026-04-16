import { useEffect, useRef, useState } from "react";
import imgMachine from "../assets/over-ons1.png";
import { useCms } from "../cms/CmsContext";

const defaultItems = [
  { title: "GROOT GENOEG OM REGIE TE VOEREN", desc: "Wij hebben de slagkracht en expertise om technische metaalprojecten volledig te realiseren." },
  { title: "KLEIN GENOEG OM DIRECT TE SCHAKELEN", desc: "Direct contact, snel schakelen en meebewegen met jouw planning." },
  { title: "PERSOONLIJK GENOEG OM VOORUIT TE DENKEN", desc: "We adviseren, optimaliseren en zorgen dat jouw project van begin tot eind klopt." },
];

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      style={{ flexShrink: 0, marginTop: "3px" }}
    >
      <polyline
        points="3,11 9,17 20,5"
        stroke="#c8d400"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WatOnsAndersMaakt() {
  const { cms } = useCms();
  const items = (cms.anders && cms.anders.items) || defaultItems;
  const andersImage = (cms.anders && cms.anders.image) || null;
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
    <section style={{ background: "#fff", padding: "80px 0" }}>
      <style>{`
        .woa-left  { opacity:0; transform:translateX(-32px); transition: opacity .6s ease, transform .6s ease; }
        .woa-right { opacity:0; transform:translateX(32px);  transition: opacity .6s .2s ease, transform .6s .2s ease; }
        .woa-sq    { opacity:0; transform:scale(0.4);        transition: opacity .5s .45s ease, transform .5s .45s ease; }
        .woa-on .woa-left,
        .woa-on .woa-right,
        .woa-on .woa-sq { opacity:1; transform:none; }
      `}</style>

      <div
        ref={ref}
        className={"max-w-7xl mx-auto px-6 md:px-8 woa-grid " + (vis ? "woa-on" : "")}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}
      >
        {/* LEFT — heading + items */}
        <div className="woa-left">
          <h2
            style={{
              fontFamily: "Arial Black, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(22px, 2.4vw, 32px)",
              textTransform: "uppercase",
              color: "#1c1c1c",
              margin: "0 0 40px 0",
              lineHeight: 1.1,
              letterSpacing: "-0.3px",
            }}
          >
            WAT ONS ANDERS MAAKT
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <CheckIcon />
                <div>
                  <p
                    style={{
                      fontFamily: "Arial Black, Arial, sans-serif",
                      fontWeight: 900,
                      fontSize: "13.5px",
                      textTransform: "uppercase",
                      color: "#1c1c1c",
                      margin: "0 0 10px 0",
                      lineHeight: 1.3,
                      letterSpacing: "0.2px",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontSize: "14.5px",
                      color: "#555",
                      margin: 0,
                      lineHeight: 1.65,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — image + lime square */}
        <div className="woa-right" style={{ position: "relative" }}>
          {/* Image */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              lineHeight: 0,
            }}
          >
            <img
              src={andersImage || imgMachine}
              alt="Ferna machinepark"
              style={{
                width: "100%",
                height: "440px",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
              className="woa-image"
            />
          </div>

          {/* Lime square — bottom right, slightly outside image */}
          <div
            className="woa-sq"
            style={{
              position: "absolute",
              bottom: "-24px",
              right: "-24px",
              width: "80px",
              height: "80px",
              background: "#c8d400",
              zIndex: 1,
            }}
          />
        </div>
      </div>

      {/* Mobile */}
      <style>{`
        @media (max-width: 768px) {
          .woa-grid { grid-template-columns: 1fr !important; gap: 42px !important; }
        }
      `}</style>
    </section>
  );
}

export default WatOnsAndersMaakt;
