import { Link } from "react-router-dom";

const sectorItems = [
  {
    title: "PETROCHEMIE",
    description:
      "Maatwerkpiping en koppelstukken voor raffinaderijen en procesinstallaties.",
    icon: (
      <svg
        width="54"
        height="54"
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#2f2f2f]"
      >
        <path
          d="M17 11V24L23 31V43"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
        <path
          d="M37 11V24L31 31V43"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
        <path
          d="M23 11V18L27 24L31 18V11"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
        <path d="M14 43H40" stroke="currentColor" strokeWidth="2.2" />
        <path d="M20 43V47" stroke="currentColor" strokeWidth="2.2" />
        <path d="M27 43V47" stroke="currentColor" strokeWidth="2.2" />
        <path d="M34 43V47" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "TANKBOUW",
    description:
      "Walsdelen, daksecties, mangaten, koppelstukken, bordessen en trappen voor tankinstallaties.",
    icon: (
      <svg
        width="54"
        height="54"
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#2f2f2f]"
      >
        <ellipse
          cx="27"
          cy="15"
          rx="10"
          ry="4.5"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="M17 15V34C17 36.8 21.5 39 27 39C32.5 39 37 36.8 37 34V15"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path d="M17 24C17 26.8 21.5 29 27 29C32.5 29 37 26.8 37 24" stroke="currentColor" strokeWidth="2.2" />
        <path d="M17 34C17 36.8 21.5 39 27 39C32.5 39 37 36.8 37 34" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "OFFSHORE",
    description:
      "Staalconstructies en frames, Lloyd’s-gecertificeerd.",
    icon: (
      <svg
        width="54"
        height="54"
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#2f2f2f]"
      >
        <rect x="18" y="15" width="9" height="9" stroke="currentColor" strokeWidth="2.2" />
        <rect x="27" y="15" width="9" height="9" stroke="currentColor" strokeWidth="2.2" />
        <rect x="18" y="24" width="9" height="9" stroke="currentColor" strokeWidth="2.2" />
        <rect x="27" y="24" width="9" height="9" stroke="currentColor" strokeWidth="2.2" />
        <path d="M22 33L18 45" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M32 33L36 45" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M27 33V45" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M12 45C14 42 16 42 18 45C20 48 22 48 24 45C26 42 28 42 30 45C32 48 34 48 36 45C38 42 40 42 42 45" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "INDUSTRIEEL\nMAATWERK",
    description:
      "Staalconstructies, plaatwerk en laswerk voor de brede industrie.",
    icon: (
      <svg
        width="54"
        height="54"
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#2f2f2f]"
      >
        <path
          d="M17 11V24L23 31V43"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
        <path
          d="M37 11V24L31 31V43"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
        <path
          d="M23 11V18L27 24L31 18V11"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
        <path d="M14 43H40" stroke="currentColor" strokeWidth="2.2" />
        <path d="M20 43V47" stroke="currentColor" strokeWidth="2.2" />
        <path d="M27 43V47" stroke="currentColor" strokeWidth="2.2" />
        <path d="M34 43V47" stroke="currentColor" strokeWidth="2.2" />
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
            GECERTIFICEERD MAATWERK PER SECTOR
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