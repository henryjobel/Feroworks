import { useState, useEffect, useRef } from "react";
import img1 from "../assets/past work/Afwerking-staalconstructie-met-natlak-300x225.webp";
import img2 from "../assets/past work/kwaliteitscontrole-lassen-featured-300x225.webp";
import img3 from "../assets/past work/lascertificaat-verplicht-featured-300x158.webp";
import img4 from "../assets/past work/Offshore-constructie-300x190.webp";
import { useCms } from "../cms/CmsContext";

const FALLBACK_IMAGES = [img1, img2, img3, img4];

const defaultSlides = [
  {
    title: "MEETBUIZEN T.B.V. VLOEISTOFTANK",
    desc: "Voor deze klant hebben we maatwerk meetbuizen ten behoeve van een vloeistoftank geproduceerd.",
    image: null,
  },
  {
    title: "STAALCONSTRUCTIE OFFSHORE PLATFORM",
    desc: "Complexe staalconstructie vervaardigd voor een offshore platform, volledig Lloyd's-gecertificeerd.",
    image: null,
  },
  {
    title: "PIJPLEIDINGWERK PETROCHEMIE",
    desc: "Maatwerkpiping en koppelstukken geleverd voor een raffinaderij in de petrochemische sector.",
    image: null,
  },
  {
    title: "TANKBOUW INDUSTRIEEL COMPLEX",
    desc: "Walsdelen, daksecties en mangaten geproduceerd voor een groot industrieel tankbouwproject.",
    image: null,
  },
];

function ProjectenSlider() {
  const { cms } = useCms();
  const slides = cms.projecten && cms.projecten.length ? cms.projecten : defaultSlides;
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
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

  const goTo = (idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 250);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  const slide = slides[Math.min(current, slides.length - 1)] || defaultSlides[0];
  const slideImg = slide.image || FALLBACK_IMAGES[Math.min(current, FALLBACK_IMAGES.length - 1)] || FALLBACK_IMAGES[0];

  return (
    <section style={{ background: "#efefef", padding: "72px 0 64px" }}>
      <style>{`
        .ps-wrap { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .ps-vis  { opacity:1; transform:none; }
        .ps-slide { opacity:1; transition: opacity .25s ease; }
        .ps-slide.fade { opacity:0; }
        .ps-arrow {
          width:40px; height:40px; border-radius:50%; border:none;
          background:rgba(255,255,255,0.7); cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; transition: background 0.2s;
        }
        .ps-arrow:hover { background:#fff; }
        .ps-dot {
          width:10px; height:10px; border-radius:50%;
          border:none; cursor:pointer; transition: background 0.2s;
          padding:0;
        }
      `}</style>

      <div
        ref={ref}
        className={"max-w-7xl mx-auto px-6 md:px-8 ps-wrap " + (vis ? "ps-vis" : "")}
      >
        {/* Heading */}
        <h2
          style={{
            fontFamily: "Arial Black, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(20px, 2.4vw, 30px)",
            textTransform: "uppercase",
            margin: "0 0 40px 0",
            letterSpacing: "-0.3px",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#c8d400" }}>PROJECTEN </span>
          <span style={{ color: "#1c1c1c" }}>UIT HET VERLEDEN</span>
        </h2>

        {/* Slider row */}
        <div className="ps-row" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Prev arrow */}
          <button className="ps-arrow" onClick={prev} aria-label="Vorige">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polyline points="10,2 4,8 10,14" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Slide card */}
          <div
            className={"ps-slide" + (animating ? " fade" : "")}
            style={{
              flex: 1,
              background: "#fff",
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              minHeight: "260px",
              overflow: "hidden",
            }}
          >
            {/* Image */}
            <div style={{ overflow: "hidden", lineHeight: 0 }}>
              <img
                src={slideImg}
                alt={slide.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: "240px" }}
              />
            </div>

            {/* Text */}
            <div className="ps-copy" style={{ padding: "36px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3
                style={{
                  fontFamily: "Arial Black, Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(15px, 1.5vw, 18px)",
                  textTransform: "uppercase",
                  color: "#1c1c1c",
                  margin: "0 0 16px 0",
                  lineHeight: 1.2,
                  letterSpacing: "0.1px",
                }}
              >
                {slide.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, margin: 0 }}>
                {slide.desc}
              </p>
            </div>
          </div>

          {/* Next arrow */}
          <button className="ps-arrow" onClick={next} aria-label="Volgende">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polyline points="6,2 12,8 6,14" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              className="ps-dot"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{ background: i === current ? "#c8d400" : "#bbb" }}
            />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "36px" }}>
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

      {/* Mobile */}
      <style>{`
        @media (max-width: 640px) {
          .ps-slide { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export default ProjectenSlider;
