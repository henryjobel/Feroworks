import volkerwessels from "../assets/cleint logo/volkerwessels-logo.svg";
import polytec from "../assets/cleint logo/polytec-logo.png";
import verwater from "../assets/cleint logo/logo_verwater_jubileum.svg";
import dekok from "../assets/cleint logo/logo-de-kok-staalbouw.svg";
import ivens from "../assets/cleint logo/ivens-logo.png";
import actemium from "../assets/cleint logo/actemium-vector-logo.svg";
import { useCms } from "../cms/CmsContext";

const fallbackLogos = [
  { image: volkerwessels, alt: "VolkerWessels" },
  { image: polytec, alt: "Polytec" },
  { image: verwater, alt: "Verwater" },
  { image: dekok, alt: "De Kok Staalbouw" },
  { image: ivens, alt: "Ivens" },
  { image: actemium, alt: "Actemium" },
];

function ClientLogosSection() {
  const { cms } = useCms();
  const logos = (cms.clientLogos?.items || fallbackLogos).map((item, index) => ({
    image: item.image || fallbackLogos[index]?.image,
    alt: item.alt || fallbackLogos[index]?.alt || `Logo ${index + 1}`,
  }));

  return (
    <section style={{ background: "#fff", borderTop: "1px solid #e8e8e8", borderBottom: "1px solid #e8e8e8", padding: "36px 0" }}>
      <style>{`
        @keyframes logo-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .logo-track {
          display: flex;
          width: max-content;
          animation: logo-scroll 22s linear infinite;
        }
        .logo-track:hover {
          animation-play-state: paused;
        }
        .logo-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 52px;
          flex-shrink: 0;
        }
        .logo-item img {
          height: 52px;
          width: auto;
          max-width: 160px;
          object-fit: contain;
          filter: grayscale(100%) opacity(0.55);
          transition: filter 0.3s ease;
          display: block;
        }
        .logo-item:hover img {
          filter: grayscale(0%) opacity(1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-8" style={{ overflow: "hidden" }}>
        <div className="logo-track">
        {/* First set */}
        {logos.map((logo, i) => (
          <div className="logo-item" key={`a-${i}`}>
            <img src={logo.image} alt={logo.alt} />
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {logos.map((logo, i) => (
          <div className="logo-item" key={`b-${i}`}>
            <img src={logo.image} alt={logo.alt} />
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}

export default ClientLogosSection;
