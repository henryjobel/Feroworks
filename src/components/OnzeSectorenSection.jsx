import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsContext";

const sectorItems = [
  {
    title: "BOUW &\nUTILITEIT",
    description:
      "Staalconstructies, standaard hekwerken en prefab balkons voor bouw- en utiliteitsprojecten.",
    icon: (
      <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#2f2f2f]">
        <rect x="10" y="24" width="14" height="20" stroke="currentColor" strokeWidth="2.2" />
        <rect x="30" y="16" width="14" height="28" stroke="currentColor" strokeWidth="2.2" />
        <path d="M8 44H46" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M14 37H20M14 32H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M34 37H40M34 32H40M34 27H40M34 22H40" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "INDUSTRIE",
    description:
      "Machinebouw, maatwerk staalconstructies, industriÃ«le installaties en laswerkzaamheden op locatie.",
    icon: (
      <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#2f2f2f]">
        <circle cx="27" cy="27" r="7" stroke="currentColor" strokeWidth="2.2" />
        <path d="M27 11V16M27 38V43M11 27H16M38 27H43" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M15.9 15.9L19.4 19.4M34.6 34.6L38.1 38.1M38.1 15.9L34.6 19.4M19.4 34.6L15.9 38.1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "ARCHITECTUUR\n& DESIGN",
    description:
      "Design trappen en interieur- en exterieur maatwerk voor architectuur- en designprojecten.",
    icon: (
      <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#2f2f2f]">
        <path d="M10 44H44" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M10 44V38H20V32H30V26H40V14" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="miter" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "MARITIEM",
    description:
      "Maatwerk staal- en aluminium constructies voor jachtbouw en maritieme toepassingen.",
    icon: (
      <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#2f2f2f]">
        <circle cx="27" cy="14" r="3.5" stroke="currentColor" strokeWidth="2.2" />
        <path d="M27 17.5V43" stroke="currentColor" strokeWidth="2.2" />
        <path d="M20 25H34" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M16 43C16 37 21 32.5 27 32.5C33 32.5 38 37 38 43" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

function SectorCard({ item }) {
  return (
    <div className="home-sector-card bg-[#f6f6f6] shadow-[0_18px_34px_rgba(0,0,0,0.06)] flex flex-col">
      <div className="home-sector-icon">{item.icon}</div>

      <h3
        className="home-sector-title text-[#333333] font-black uppercase whitespace-pre-line leading-[1.08] tracking-[-0.6px]"
        style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
      >
        {item.title}
      </h3>

      <p className="home-sector-desc text-[#7b7b7b] font-medium">
        {item.description}
      </p>

      <Link
        to="/contact"
        className="home-sector-link mt-auto inline-block font-black uppercase tracking-[-0.2px]"
        style={{ fontFamily: "var(--fw-website-heading-font)", color: "var(--fw-website-primary-strong)" }}
      >
        LEES MEER
      </Link>
    </div>
  );
}

function OnzeSectoren() {
  const { cms } = useCms();
  // Merge CMS text into sectorItems (keep SVG icons)
  const mergedItems = sectorItems.map((item, i) => ({
    ...item,
    title: (cms.sectoren && cms.sectoren[i]) ? cms.sectoren[i].naam.replace(" & ", " &\n") : item.title,
    description: (cms.sectoren && cms.sectoren[i]) ? cms.sectoren[i].description : item.description,
  }));
  return (
    <section className="w-full bg-[#f3f3f3] pt-[48px] pb-[100px]">
      <style>{`
        .home-sector-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 26px;
          margin-bottom: 42px;
        }

        .home-sector-card {
          min-height: 382px;
          padding: 42px 30px 34px;
          position: relative;
          overflow: hidden;
          border-top: 4px solid transparent;
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }

        .home-sector-card::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 46px;
          height: 46px;
          background: var(--fw-website-primary);
          opacity: .14;
          transform: translate(16px, -16px);
        }

        .home-sector-card:hover {
          transform: translateY(-4px);
          border-color: var(--fw-website-primary);
          box-shadow: 0 18px 38px rgba(0,0,0,.1);
        }

        .home-sector-icon {
          margin-bottom: 34px;
          color: #2f2f2f;
        }

        .home-sector-title {
          font-size: 27px;
          margin-bottom: 18px;
        }

        .home-sector-desc {
          font-size: 17px;
          line-height: 1.42;
          margin-bottom: 26px;
        }

          .home-sector-link {
            font-size: 15px;
          }

          .home-sector-link:hover {
            color: var(--fw-website-primary);
          }

        @media (max-width: 1024px) {
          .home-sector-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
        }

        @media (max-width: 640px) {
          .home-sector-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 32px;
          }

          .home-sector-card {
            min-height: 258px;
            padding: 18px 14px 16px;
            border-top-color: var(--fw-website-primary);
          }

          .home-sector-card::after {
            width: 34px;
            height: 34px;
            transform: translate(12px, -12px);
          }

          .home-sector-icon {
            margin-bottom: 16px;
          }

          .home-sector-icon svg {
            width: 38px;
            height: 38px;
          }

          .home-sector-title {
            font-size: 15px;
            line-height: 1.16;
            letter-spacing: 0;
            margin-bottom: 10px;
          }

          .home-sector-desc {
            font-size: 12px;
            line-height: 1.45;
            margin-bottom: 16px;
          }

          .home-sector-link {
            font-size: 11px;
            color: var(--fw-website-primary-strong);
          }
        }

        @media (max-width: 360px) {
          .home-sector-grid {
            gap: 10px;
          }

          .home-sector-card {
            min-height: 244px;
            padding: 16px 12px 14px;
          }

          .home-sector-title {
            font-size: 13.5px;
          }

          .home-sector-desc {
            font-size: 11.5px;
          }
        }
      `}</style>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-[44px]">
          <h2
            className="site-heading text-[#333333] uppercase font-black text-[34px] leading-none tracking-[-0.8px] mb-[16px]"
            style={{ fontFamily: "var(--fw-website-heading-font)" }}
          >
            ONZE SECTOREN
          </h2>

          <p
            className="site-heading text-[#6f6f6f] uppercase font-black text-[16px] tracking-[-0.2px]"
            style={{ fontFamily: "var(--fw-website-heading-font)" }}
          >
            MAATWERK VOOR ELKE SECTOR
          </p>
        </div>

        <div className="home-sector-grid">
          {mergedItems.map((item, index) => (
            <SectorCard key={index} item={item} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            to="/contact"
            className="site-heading inline-flex items-center justify-center min-w-[188px] h-[52px] rounded-full uppercase font-black text-[14px] px-8 hover:opacity-95 transition"
            style={{ fontFamily: "var(--fw-website-heading-font)", background: "var(--fw-website-primary-strong)", color: "var(--fw-website-secondary)" }}
          >
            NEEM CONTACT OP
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OnzeSectoren;


