import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-background.jpeg";
import imgAbout1 from "../assets/about/about-us1.jpeg";
import imgAbout2 from "../assets/about/about-us2.jpeg";
import imgAbout3 from "../assets/about/about-us3.jpeg";
import imgMachine from "../assets/over-ons1.png";
import imgLandscape from "../assets/over-ons2.png";
import { useCms } from "../cms/CmsContext";

const FALLBACK_IMAGES = { engineering: imgAbout1, productie: imgMachine, coating: imgLandscape, montage: imgAbout2, reparatie: imgAbout3 };

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ── LEGACY DATA (fallback only, CMS takes precedence) ──────────────── */
const diensten_fallback = [
  {
    id: "engineering",
    nr: "01",
    title: "Engineering & Ontwerp",
    subtitle: "Van eerste schets tot goedgekeurde productietekening",
    img: imgAbout1,
    excerpt: "Elk project begint met een goed ontwerp. Onze engineers werken met moderne CAD-software en vertalen uw wensen naar haalbare, maakbare productietekeningen.",
    body: [
      {
        type: "intro",
        text: "Een goed metaalproject begint niet in de werkplaats — het begint op de tekentafel. Bij FerroWorks beschikken we over een eigen engineeringsafdeling die uw idee of specificatie omzet naar een volledig uitgewerkte, maakbare productietekening. We denken actief mee over de beste constructieve oplossing, de juiste materiaalkeuze en eventuele kostenbesparingen.",
      },
      {
        type: "h2",
        text: "Van schets tot goedgekeurde tekening",
      },
      {
        text: "Of u nu aankomt met een gedetailleerde constructietekening, een ruwe schets op papier of enkel een idee — wij werken het uit. We stellen gerichte vragen om uw toepassing, belasting, omgeving en eindgebruik goed te begrijpen. Vervolgens werken onze engineers de productietekeningen uit in 2D of 3D, afhankelijk van de complexiteit.",
      },
      {
        type: "h2",
        text: "Wat wij bieden",
      },
      {
        type: "bullets",
        items: [
          "2D- en 3D-tekeningen via CAD/CAM software",
          "Constructieve berekeningen en toetsing",
          "Materiaalkeuze: staal, RVS of aluminium",
          "Kostenadvies en optimalisatie in het ontwerp",
          "Toetsing op maakbaarheid vóór productie",
          "Goedkeuringsproces met de opdrachtgever",
          "Revisietekeningen na wijzigingen",
        ],
      },
      {
        type: "h2",
        text: "Heeft u al een tekening?",
      },
      {
        text: "Geen probleem — we reviewen uw bestaande tekeningen op maakbaarheid, normconformiteit (EN-1090) en eventuele verbeterpunten. We passen tekeningen aan waar nodig en zorgen dat de uiteindelijke productietekening overeenkomt met wat u wilt en wat wij kunnen maken.",
      },
      {
        type: "quote",
        text: "Een uur extra aandacht in het ontwerp bespaart een dag in de productie.",
      },
      {
        type: "h2",
        text: "Samenwerking met uw constructeur",
      },
      {
        text: "Werkt u met een extern constructiebedrijf of architect? Dan stemmen wij direct met hen af. We brengen de uitvoerbaarheid in vanuit de fabrikant — zodat wat op papier staat ook echt te maken is.",
      },
    ],
    checkitems: ["2D- en 3D-tekeningen (CAD/CAM)", "Constructieve berekeningen", "Materiaalkeuze en kostenadvies", "Toetsing op maakbaarheid", "Goedkeuringsproces met de opdrachtgever"],
    tags: ["Engineering", "CAD", "Ontwerp", "Tekeningen"],
  },
  {
    id: "productie",
    nr: "02",
    title: "Productie in eigen beheer",
    subtitle: "Volledig machinepark, gecertificeerde lassers, volledige controle",
    img: imgMachine,
    excerpt: "In onze moderne werkplaats in Roosendaal produceren we alles in eigen beheer — staal, RVS en aluminium — zonder uitbesteding, met volledige kwaliteitscontrole.",
    body: [
      {
        type: "intro",
        text: "In de werkplaats van FerroWorks in Roosendaal ziet u vakmanschap in actie. Onze eigen machinisten, lassers en metaalbewerkers verwerken staal, RVS en aluminium tot producten die nauwkeurig aansluiten op uw specificaties. Geen uitbesteding, geen kwaliteitsverlies — volledige controle van begin tot eind.",
      },
      {
        type: "h2",
        text: "Ons machinepark",
      },
      {
        text: "We beschikken over moderne machines voor het gehele bewerkingstraject: van zaag en lasersnijder tot knipmachine, buigpers en lasapparatuur. Dit stelt ons in staat om zowel enkelstuks als series efficiënt en nauwkeurig te produceren.",
      },
      {
        type: "bullets",
        items: [
          "Bandzaag en cirkelzaag voor staal en aluminium",
          "Lasersnijwerk met hoge nauwkeurigheid",
          "Knipmachine en afkantpers voor plaatwerk",
          "Buigen en walsen van buizen en profielen",
          "Boren en frezen",
        ],
      },
      {
        type: "h2",
        text: "Gecertificeerd laswerk",
      },
      {
        text: "Al onze lassers zijn gecertificeerd en werken conform de Europese norm EN-1090. We gebruiken MIG/MAG-, TIG- en WIG-lassen, afhankelijk van het materiaal en de toepassing. Elk laswerk wordt tijdens en na productie visueel geïnspecteerd. Waar vereist passen we niet-destructief onderzoek (NDO) toe.",
      },
      {
        type: "h2",
        text: "Kwaliteitscontrole",
      },
      {
        text: "Kwaliteit zit ingebakken in ons proces. We werken met vastgestelde lasprocedures (WPS), houden een digitaal laslogboek bij en leveren bij gecertificeerde projecten volledige documentatie: materiaalcertificaten (EN 10204), inspectierapporten en de CE-verklaring van prestatie.",
      },
      {
        type: "quote",
        text: "Eigen productie betekent geen verrassingen — wij zijn verantwoordelijk van eerste zaagsnede tot laatste las.",
      },
      {
        type: "h2",
        text: "Materialen",
      },
      {
        text: "We verwerken constructiestaal (S235/S355/S420), roestvast staal (AISI 304, AISI 316L, duplex) en aluminium (6060, 6082, 5083). Ons team kent de specifieke eigenschappen van elk materiaal en past de bewerkings- en lasparameters dienovereenkomstig aan.",
      },
    ],
    checkitems: ["Zaag- en lasersnijwerk", "Boren, frezen en knippen", "Gecertificeerd lassen (MIG/MAG, TIG, WIG)", "Buigen en walsen", "Prefab-productie en maatwerk in alle series"],
    tags: ["Productie", "Lassen", "Machinepark", "EN-1090"],
  },
  {
    id: "coating",
    nr: "03",
    title: "Coating & Afwerking",
    subtitle: "De juiste bescherming en uitstraling voor uw constructie",
    img: imgLandscape,
    excerpt: "Een goede afwerking beschermt uw constructie en bepaalt de uitstraling. FerroWorks adviseert en verzorgt de juiste coatingoplossing op basis van omgeving, gebruik en levensduur.",
    body: [
      {
        type: "intro",
        text: "De coating is het laatste — en een van de belangrijkste — onderdelen van het productieproces. Het beschermt de constructie tegen corrosie, slijtage en weersinvloeden, en bepaalt mede de uitstraling. FerroWorks adviseert u over de meest geschikte coatingmethode en -systeem, en verzorgt de uitvoering conform de geldende normen.",
      },
      {
        type: "h2",
        text: "Welke coatingmethode past bij uw project?",
      },
      {
        text: "De keuze voor een coating hangt af van meerdere factoren: de omgevingscategorie (C1 t/m C5), de gewenste levensduur, het materiaal (staal, RVS, aluminium) en het gebruik. We adviseren u proactief en transparant over de voor- en nadelen van elke optie.",
      },
      {
        type: "h2",
        text: "Onze coatingmethoden",
      },
      {
        type: "bullets",
        items: [
          "Stralen tot Sa2,5 voor optimale hechting van de coating",
          "Zinkrijke of epoxy grondlaag (corrosiewerende basislaag)",
          "Natlak — geschikt voor grote constructies, complexe geometrieën en C4/C5",
          "Poedercoating — egaal, krasbestendig, ideaal voor seriematige productie",
          "RVS-polijsten — decoratief of hygiënisch finish (spiegel, geborsteld)",
          "Galvaniseren — langdurige zinkbescherming voor buitenapplicaties",
        ],
      },
      {
        type: "h2",
        text: "Conform ISO 12944",
      },
      {
        text: "Onze coatingsystemen worden toegepast conform ISO 12944 voor de corrosiviteitscategorie die aansluit op uw project. Dit varieert van C1 (droog binnenmilieu) tot C5 (industrieel of mariene omgeving). We documenteren de coatingdikte, laagopbouw en gebruikte producten in een coatingrapport.",
      },
      {
        type: "quote",
        text: "Een goede coating kost geld eenmalig. Een slechte coating kost u elke paar jaar opnieuw.",
      },
      {
        type: "h2",
        text: "Natlak vs. Poedercoating",
      },
      {
        text: "Poedercoating is snel, egaal en milieuvriendelijk — ideaal voor seriematige, kleinere constructies die in een oven passen. Natlak is flexibeler en noodzakelijk voor grote of complexe constructies die niet verplaatst of verhit kunnen worden. We adviseren altijd de beste oplossing voor uw situatie.",
      },
    ],
    checkitems: ["Stralen tot Sa2,5", "Grondlagen (zinkrijk/epoxy)", "Natlak voor complexe constructies", "Poedercoating seriematig", "RVS-polijsten en galvaniseren"],
    tags: ["Coating", "Afwerking", "ISO 12944", "Corrosiebescherming"],
  },
  {
    id: "montage",
    nr: "04",
    title: "Montage op locatie",
    subtitle: "Eigen montageploeg — van prefab tot oplevering",
    img: imgAbout2,
    excerpt: "Onze montageploeg plaatst uw constructie op locatie, coördineert het kraanwerk en levert op met volledig documentatiepakket inclusief CE-verklaring.",
    body: [
      {
        type: "intro",
        text: "Een ijzersterke constructie verdient ook een professionele montage. FerroWorks beschikt over een eigen montageploeg die uw project op locatie plaatst — veilig, nauwkeurig en conform de geldende bouwnormen. Van eenvoudige hekplaatsing tot complexe staalconstructies op hoogte: wij coördineren het gehele montageproces.",
      },
      {
        type: "h2",
        text: "Wat doet onze montageploeg?",
      },
      {
        text: "Onze monteurs zijn VCA-gecertificeerd en hebben jarenlange ervaring met montage op industriële locaties, bouwplaatsen en offshore-toepassingen. Ze brengen de benodigde gereedschappen, hef- en hijsmiddelen mee en werken nauw samen met de hoofdaannemer of projectleider ter plaatse.",
      },
      {
        type: "bullets",
        items: [
          "Montage van staal-, RVS- en aluminiumconstructies",
          "Kraanbegeleiding en coördinatie hef- en hijswerk",
          "Aansluitlassen en correcties op locatie",
          "Werken op hoogte (gecertificeerd)",
          "Afstemming met bouwplaatsleiding en hoofdaannemer",
          "Eindinspectie na montage",
        ],
      },
      {
        type: "h2",
        text: "Veiligheid staat voorop",
      },
      {
        text: "Al onze monteurs werken VCA-gecertificeerd. Voor elke montage stellen we een werkplan op met de montagevolgorde, de benodigde hef- en veiligheidsmiddelen en de risicobeoordeling. We werken altijd met een actueel VCA-veiligheidsplan en registreren incidenten conform de norm.",
      },
      {
        type: "quote",
        text: "Wij leveren niet aan de poort — wij leveren op locatie, gemonteerd en goedgekeurd.",
      },
      {
        type: "h2",
        text: "Opleverdossier",
      },
      {
        text: "Bij oplevering ontvangt u een volledig documentatiepakket: as-built tekeningen, materiaalcertificaten (EN 10204 3.1 of 3.2), lasrapporten en — indien van toepassing — een CE-verklaring van prestatie (DoP) conform EN-1090-1. Zo heeft u alles wat u nodig heeft voor uw eigen dossier en eventuele keuring door derden.",
      },
    ],
    checkitems: ["Eigen montageploeg, VCA gecertificeerd", "Montage van staal, RVS en aluminium", "Kraanbegeleiding en veiligheidsbeheer", "Aansluitlassen en correcties op locatie", "Eindinspectie en opleverdossier"],
    tags: ["Montage", "VCA", "Oplevering", "CE-markering"],
  },
  {
    id: "reparatie",
    nr: "05",
    title: "Reparatie & Onderhoud",
    subtitle: "Snel ter plaatse — ook voor spoedreparaties",
    img: imgAbout3,
    excerpt: "FerroWorks voert reparaties en onderhoud uit op staalconstructies, zowel in de werkplaats als direct op uw locatie. Snel, vakkundig, conform de normen.",
    body: [
      {
        type: "intro",
        text: "Staalconstructies zijn duurzaam — maar niet onverwoestbaar. Door mechanische schade, corrosie, vermoeiing of onvoorziene belastingen kunnen reparaties noodzakelijk zijn. FerroWorks voert deze reparaties snel en vakkundig uit, zowel in onze eigen werkplaats als bij u op locatie.",
      },
      {
        type: "h2",
        text: "Welke reparaties voeren wij uit?",
      },
      {
        text: "We behandelen zowel structurele reparaties (gebroken lassen, vervormd staalwerk, scheurvorming) als oppervlaktereparaties (corrosie, beschadigde coating). Onze lassers beoordelen de schade, bepalen de oorzaak en voeren de reparatie uit conform de geldende normen.",
      },
      {
        type: "bullets",
        items: [
          "Lasreparaties in staal, RVS en aluminium",
          "Herstel van corrosieschade en beschadigde coating",
          "Structurele versterking van bestaande constructies",
          "Vervanging van slijtdelen en beschadigde onderdelen",
          "Spoedreparaties op locatie (korte responstijd)",
          "Onderhoudscontracten op aanvraag",
        ],
      },
      {
        type: "h2",
        text: "Reparatie op locatie",
      },
      {
        text: "Niet alles kan naar onze werkplaats worden gebracht. Daarom beschikken we over een mobiele reparatieploeg die bij u op locatie aan de slag gaat — of het nu gaat om een industrieel platform, een hekwerk op een bouwplaats of een maritieme constructie. We brengen alles mee wat nodig is.",
      },
      {
        type: "quote",
        text: "Stilstand kost geld. Wij zorgen dat uw constructie snel en veilig weer in bedrijf is.",
      },
      {
        type: "h2",
        text: "Preventief onderhoud",
      },
      {
        text: "Voorkomen is beter dan genezen. We bieden ook preventieve inspecties en onderhoudsprogramma's aan voor bedrijven die regelmatig staalwerk in gebruik hebben. Tijdige inspectie en coatingherstel verlengen de levensduur van uw constructies aanzienlijk en voorkomt dure onverwachte uitval.",
      },
      {
        type: "h2",
        text: "Documentatie na reparatie",
      },
      {
        text: "Na elke reparatie leveren we een kortrapport met de aard van de schade, de uitgevoerde werkzaamheden en de gebruikte materialen. Zo heeft u een volledig dossier voor uw eigen administratie en eventuele keuringsinstanties.",
      },
    ],
    checkitems: ["Lasreparaties in staal, RVS en aluminium", "Herstel van corrosieschade en coating", "Structurele versterking", "Spoedreparaties op locatie", "Onderhoudscontracten op aanvraag"],
    tags: ["Reparatie", "Onderhoud", "Spoed", "Locatie"],
  },
];

/* ── HERO ─────────────────────────────────────────────────────────────── */
function DienstHero({ dienst }) {
  return (
    <section style={{ position: "relative", width: "100%", minHeight: "400px", display: "flex", alignItems: "flex-end", overflow: "hidden", background: "#141616" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${dienst.image || FALLBACK_IMAGES[dienst.id] || imgAbout1})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(20,22,22,0.97) 0%, rgba(20,22,22,0.72) 50%, rgba(20,22,22,0.35) 100%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8" style={{ paddingBottom: "56px", paddingTop: "96px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          <Link to="/" style={{ color: "#c8d400", fontSize: "12px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Home</Link>
          <span style={{ color: "#555", fontSize: "12px" }}>›</span>
          <Link to="/diensten" style={{ color: "#c8d400", fontSize: "12px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Diensten</Link>
          <span style={{ color: "#555", fontSize: "12px" }}>›</span>
          <span style={{ color: "#888", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{dienst.title}</span>
        </div>

        {/* Number badge */}
        <div style={{ marginBottom: "16px" }}>
          <span style={{ background: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#1c1c1c", padding: "5px 12px" }}>{dienst.nr} — DIENST</span>
        </div>

        {/* Title */}
        <h1 style={{ margin: "0 0 14px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(24px, 3.5vw, 52px)", lineHeight: 1.08, letterSpacing: "-0.5px", textTransform: "uppercase", color: "#fff", maxWidth: "780px" }}>
          {dienst.title.toUpperCase()}
        </h1>

        <p style={{ margin: "0 0 28px 0", color: "#aaa", fontSize: "clamp(13px, 1.4vw, 16px)", lineHeight: 1.6, maxWidth: "520px" }}>{dienst.subtitle}</p>

        <div style={{ width: "56px", height: "4px", background: "#c8d400", borderRadius: "2px" }} />
      </div>
    </section>
  );
}

/* ── ARTICLE BODY ─────────────────────────────────────────────────────── */
function DienstBody({ dienst, allDiensten = [] }) {
  const [ref, vis] = useInView(0.05);

  return (
    <section style={{ background: "#f4f4f4", padding: "72px 0" }}>
      <style>{`
        .db-wrap { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .db-on .db-wrap { opacity:1; transform:none; }
        .db-article h2 {
          font-family: "Arial Black", Arial, sans-serif;
          font-weight: 900;
          font-size: clamp(18px, 2vw, 22px);
          text-transform: uppercase;
          letter-spacing: -0.2px;
          color: #1c1c1c;
          margin: 40px 0 16px 0;
          line-height: 1.2;
        }
        .db-article p {
          color: #555;
          font-size: 15.5px;
          line-height: 1.8;
          margin: 0 0 18px 0;
        }
        .db-article .intro-p {
          font-size: 17px;
          color: #444;
          border-left: 4px solid #c8d400;
          padding-left: 20px;
          margin-bottom: 32px;
          line-height: 1.8;
        }
        .db-article blockquote {
          background: #1c1c1c;
          border-left: 5px solid #c8d400;
          margin: 36px 0;
          padding: 28px 32px;
          font-family: "Arial Black", Arial, sans-serif;
          font-weight: 900;
          font-size: clamp(15px, 1.6vw, 18px);
          color: #fff;
          line-height: 1.4;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -0.2px;
        }
        .db-article ul {
          margin: 8px 0 24px 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .db-article ul li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #555;
          font-size: 15px;
          line-height: 1.6;
        }
        .db-article ul li::before {
          content: "";
          display: block;
          width: 8px;
          height: 8px;
          background: #c8d400;
          flex-shrink: 0;
          margin-top: 6px;
        }
        @media (max-width: 900px) { .db-layout { grid-template-columns: 1fr !important; } }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 db-layout " + (vis ? "db-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "64px", alignItems: "start" }}>

        {/* Main article */}
        <article className="db-wrap db-article">
          {typeof dienst.body === "string"
            ? dienst.body.split("\n\n").map((para, i) =>
                i === 0
                  ? <p key={i} className="intro-p">{para}</p>
                  : <p key={i}>{para}</p>
              )
            : (dienst.body || []).map((block, i) => {
                if (block.type === "intro")   return <p key={i} className="intro-p">{block.text}</p>;
                if (block.type === "h2")      return <h2 key={i}>{block.text}</h2>;
                if (block.type === "quote")   return <blockquote key={i}>"{block.text}"</blockquote>;
                if (block.type === "bullets") return (
                  <ul key={i}>{block.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                );
                return <p key={i}>{block.text}</p>;
              })
          }

          {/* Tags */}
          {dienst.tags && dienst.tags.length > 0 && (
            <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1.5px solid #e0e0e0" }}>
              <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaa", marginRight: "12px" }}>Tags:</span>
              {dienst.tags.map((tag, i) => (
                <span key={i} style={{ display: "inline-block", background: "#e8e8e8", color: "#555", fontSize: "12px", fontWeight: 700, padding: "4px 12px", marginRight: "8px", marginBottom: "8px", letterSpacing: "0.3px" }}>{tag}</span>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar */}
        <Sidebar dienst={dienst} allDiensten={allDiensten} />
      </div>
    </section>
  );
}

/* ── SIDEBAR ──────────────────────────────────────────────────────────── */
function Sidebar({ dienst, allDiensten = [] }) {
  const others = allDiensten.filter(d => d.id !== dienst.id);

  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Checklist card */}
      <div style={{ background: "#1c1c1c", padding: "28px 24px" }}>
        <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#fff", margin: "0 0 20px 0" }}>
          WAT WIJ <span style={{ color: "#c8d400" }}>LEVEREN</span>
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {(typeof dienst.checklist === "string" ? dienst.checklist.split("\n").filter(Boolean) : (dienst.checkitems || [])).map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                <polyline points="3,11 9,17 20,5" stroke="#c8d400" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: "#ccc", fontSize: "13px", lineHeight: 1.55 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact card */}
      <div style={{ background: "#fff", padding: "24px", borderTop: "4px solid #c8d400" }}>
        <h4 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#1c1c1c", margin: "0 0 10px 0" }}>
          OFFERTE AANVRAGEN
        </h4>
        <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.6, margin: "0 0 16px 0" }}>
          Interesse in {dienst.title.toLowerCase()}? Neem contact op — we reageren binnen 24 uur.
        </p>
        <Link
          to="/contact"
          style={{ display: "block", textAlign: "center", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 20px", textDecoration: "none", transition: "background .2s", marginBottom: "10px" }}
          onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
          onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
        >
          NEEM CONTACT OP
        </Link>
        <a
          href="tel:+31165205601"
          style={{ display: "block", textAlign: "center", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#888", textDecoration: "none", fontSize: "12px", marginTop: "8px" }}
        >
          +31 (0)165 205 601
        </a>
      </div>

      {/* Other services */}
      <div>
        <h4 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#1c1c1c", margin: "0 0 20px 0", paddingBottom: "12px", borderBottom: "2px solid #c8d400" }}>
          ANDERE DIENSTEN
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {others.map(d => (
            <Link
              key={d.id}
              to={`/diensten/${d.id}`}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: "1px solid #eee", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.querySelector(".od-nr").style.background = "#c8d400"; e.currentTarget.querySelector(".od-title").style.color = "#c8d400"; }}
              onMouseLeave={e => { e.currentTarget.querySelector(".od-nr").style.background = "#1c1c1c"; e.currentTarget.querySelector(".od-title").style.color = "#1c1c1c"; }}
            >
              <span className="od-nr" style={{ background: "#1c1c1c", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", padding: "3px 7px", flexShrink: 0, transition: "background .2s" }}>{d.nr}</span>
              <span className="od-title" style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", lineHeight: 1.3, transition: "color .2s" }}>{d.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ── MORE DIENSTEN ────────────────────────────────────────────────────── */
function MeerDiensten({ currentId, allDiensten }) {
  const [ref, vis] = useInView(0.1);
  const related = allDiensten.filter(d => d.id !== currentId).slice(0, 3);

  return (
    <section style={{ background: "#1c1c1c", padding: "72px 0" }}>
      <style>{`
        .md-card { opacity:0; transform:translateY(24px); transition: opacity .55s ease, transform .55s ease; }
        .md-on .md-card:nth-child(1) { opacity:1; transform:none; transition-delay:.05s; }
        .md-on .md-card:nth-child(2) { opacity:1; transform:none; transition-delay:.18s; }
        .md-on .md-card:nth-child(3) { opacity:1; transform:none; transition-delay:.31s; }
        @media (max-width: 768px) { .md-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "md-on" : "")}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(18px, 2vw, 24px)", textTransform: "uppercase", letterSpacing: "-0.3px", margin: 0 }}>
            <span style={{ color: "#fff" }}>ANDERE </span><span style={{ color: "#c8d400" }}>DIENSTEN</span>
          </h2>
          <Link
            to="/diensten"
            style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#c8d400", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", transition: "gap .2s" }}
            onMouseEnter={e => e.currentTarget.style.gap = "10px"}
            onMouseLeave={e => e.currentTarget.style.gap = "6px"}
          >
            ALLE DIENSTEN
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#c8d400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="md-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {related.map(d => (
            <Link
              key={d.id}
              to={`/diensten/${d.id}`}
              className="md-card"
              style={{ textDecoration: "none", background: "#252525", display: "block", transition: "transform .25s ease, box-shadow .25s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ overflow: "hidden", height: "180px" }}>
                <img src={d.image || FALLBACK_IMAGES[d.id] || imgAbout1} alt={d.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .4s ease" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
              <div style={{ padding: "22px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ background: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: "#1c1c1c", padding: "3px 8px" }}>{d.nr}</span>
                </div>
                <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "14px", textTransform: "uppercase", color: "#fff", margin: "0 0 10px 0", lineHeight: 1.3, letterSpacing: "-0.1px" }}>{d.title}</h3>
                <p style={{ color: "#777", fontSize: "12.5px", lineHeight: 1.6, margin: "0 0 14px 0" }}>{d.excerpt.substring(0, 90)}...</p>
                <span style={{ color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>MEER INFORMATIE →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA STRIP ────────────────────────────────────────────────────────── */
function CtaStrip() {
  return (
    <section style={{ background: "#f4f4f4", padding: "72px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div style={{ background: "#1c1c1c", padding: "48px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(18px, 2.2vw, 26px)", textTransform: "uppercase", color: "#fff", margin: "0 0 8px 0", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
              KLAAR VOOR UW <span style={{ color: "#c8d400" }}>PROJECT?</span>
            </h2>
            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Stuur uw tekening op of bel ons direct — wij reageren binnen 24 uur.</p>
          </div>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link
              to="/contact"
              style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "16px 32px", textDecoration: "none", display: "inline-block", transition: "background .2s", flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
              onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
            >
              NEEM CONTACT OP
            </Link>
            <a
              href="tel:+31165205601"
              style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#fff", background: "transparent", border: "2px solid #555", padding: "14px 28px", textDecoration: "none", display: "inline-block", transition: "border-color .2s", flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#c8d400"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#555"}
            >
              BEL ONS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── PAGE EXPORT ──────────────────────────────────────────────────────── */
export default function DienstDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cms } = useCms();

  const allDiensten = cms.diensten && cms.diensten.length ? cms.diensten : diensten_fallback;
  const dienst = allDiensten.find(d => d.id === id);

  useEffect(() => {
    if (!dienst) navigate("/diensten", { replace: true });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [id, dienst, navigate]);

  if (!dienst) return null;

  return (
    <>
      <DienstHero dienst={dienst} />
      <DienstBody dienst={dienst} allDiensten={allDiensten} />
      <MeerDiensten currentId={dienst.id} allDiensten={allDiensten} />
      <CtaStrip />
    </>
  );
}
