import { Link } from "react-router-dom";

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
      "Machinebouw, maatwerk staalconstructies, industriële installaties en laswerkzaamheden op locatie.",
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
    <div className="w-[242px] min-h-[382px] bg-[#f6f6f6] shadow-[0_18px_34px_rgba(0,0,0,0.06)] px-[30px] pt-[42px] pb-[34px] flex flex-col">
      <div className="mb-[34px]">{item.icon}</div>

      <h3
        className="text-[#333333] font-black uppercase whitespace-pre-line leading-[1.08] text-[27px] tracking-[-0.6px] mb-[18px]"
        style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
      >
        {item.title}
      </h3>

      <p className="text-[#7b7b7b] text-[17px] leading-[1.42] font-medium mb-[26px]">
        {item.description}
      </p>

      <Link
        to="/contact"
        className="mt-auto inline-block text-[#c8d400] font-black uppercase text-[15px] tracking-[-0.2px]"
        style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
      >
        LEES MEER
      </Link>
    </div>
  );
}

function OnzeSectoren() {
  return (
    <section className="w-full bg-[#f3f3f3] pt-[48px] pb-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-[44px]">
          <h2
            className="text-[#333333] uppercase font-black text-[34px] leading-none tracking-[-0.8px] mb-[16px]"
            style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
          >
            ONZE SECTOREN
          </h2>

          <p
            className="text-[#6f6f6f] uppercase font-black text-[16px] tracking-[-0.2px]"
            style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
          >
            MAATWERK VOOR ELKE SECTOR
          </p>
        </div>

        <div className="flex justify-center gap-[42px] flex-wrap mb-[42px]">
          {sectorItems.map((item, index) => (
            <SectorCard key={index} item={item} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center min-w-[188px] h-[52px] rounded-full bg-[#b4bf00] text-white uppercase font-black text-[14px] px-8 hover:opacity-95 transition"
            style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
          >
            NEEM CONTACT OP
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OnzeSectoren;
