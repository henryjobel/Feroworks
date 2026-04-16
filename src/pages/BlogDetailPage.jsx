import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-background.jpeg";
import imgPost1 from "../assets/past work/kwaliteitscontrole-lassen-featured-300x225.webp";
import imgPost2 from "../assets/past work/Offshore-constructie-300x190.webp";
import imgPost3 from "../assets/past work/Afwerking-staalconstructie-met-natlak-300x225.webp";
import imgPost4 from "../assets/past work/lascertificaat-verplicht-featured-300x158.webp";
import imgPost5 from "../assets/over-ons1.png";
import imgPost6 from "../assets/over-ons2.png";
import { useCms } from "../cms/CmsContext";

const BLOG_FALLBACK_IMAGES = [imgPost1, imgPost2, imgPost3, imgPost4, imgPost5, imgPost6];

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

/* ── ALL POSTS DATA (shared) ─────────────────────────────────────────── */
export const FALLBACK_POSTS = [
  {
    id: 1,
    category: "Vakmanschap",
    date: "8 april 2026",
    readTime: "4 min",
    title: "Waarom kwaliteitscontrole bij lassen het verschil maakt",
    excerpt:
      "In de metaalbewerking is lassen een van de meest kritische processen. Een kleine fout in de las kan grote gevolgen hebben voor de veiligheid en levensduur van een constructie. Ontdek hoe FerroWorks kwaliteitscontrole inzet als standaard — niet als uitzondering.",
    img: imgPost1,
    featured: true,
    body: [
      {
        type: "intro",
        text: "Lassen is het hart van elke staalconstructie. Of het nu gaat om een industriële installatie, een offshore platform of een architectonische trap — de kwaliteit van de las bepaalt in grote mate hoe lang een constructie meegaat en hoe veilig die is. Bij FerroWorks behandelen we kwaliteitscontrole niet als een afsluiting van het productieproces, maar als een rode draad die door het hele traject loopt.",
      },
      {
        type: "h2",
        text: "Wat kan er misgaan bij lassen?",
      },
      {
        text: "Een onvolledige doorlassing, poreusheid in het lasmateriaal of een verkeerde electrodekeuze — het zijn fouten die met het blote oog niet altijd zichtbaar zijn, maar die onder belasting tot breuk kunnen leiden. Met name bij constructies die dynamische krachten opvangen, zoals kabelgoten, hefconstructies of dragende balken, is een tekortkoming in de las een veiligheidsrisico.",
      },
      {
        type: "h2",
        text: "Hoe werkt kwaliteitscontrole bij FerroWorks?",
      },
      {
        text: "Ons kwaliteitsproces bestaat uit meerdere lagen. Elke lasser die bij FerroWorks werkt, is gecertificeerd en werkt volgens vastgestelde lasprocedures (WPS). Tijdens productie worden lasnaden visueel beoordeeld en indien vereist getest via niet-destructief onderzoek (NDO) — zoals magnetisch poederonderzoek, penetrantonderzoek of ultrageluidsinspectie.",
      },
      {
        type: "bullets",
        items: [
          "Gecertificeerde lassers conform EN-1090 en VCA",
          "Vastgestelde lasprocedures (WPS) per project",
          "Visuele inspectie na elke lasstap",
          "NDO-testen waar van toepassing",
          "Digitale laslogboeken per constructie",
        ],
      },
      {
        type: "h2",
        text: "Waarom EN-1090 zo belangrijk is",
      },
      {
        text: "De EN-1090 norm stelt minimumeisen aan de uitvoering van staal- en aluminiumconstructies die op de Europese markt worden gebracht. Voor FerroWorks is dit no-nonsense vakwerk: we werken standaard volgens deze norm, ongeacht of een klant er expliciet om vraagt. Dat zorgt voor een consistent, controleerbaar niveau van uitvoering bij elk project.",
      },
      {
        type: "quote",
        text: "Kwaliteit zit niet in de afronding — het zit in elke stap van het proces.",
      },
      {
        type: "h2",
        text: "Wat betekent dit voor uw project?",
      },
      {
        text: "Als u een project uitbesteedt aan FerroWorks, weet u dat elke las gedocumenteerd is, dat onze lassers gecertificeerd zijn en dat er een duidelijk kwaliteitsprotocol achter uw product zit. Geen verrassingen achteraf, geen discussies over aansprakelijkheid. Gewoon degelijk vakwerk dat u kunt vertrouwen.",
      },
    ],
    tags: ["Kwaliteit", "Lassen", "EN-1090", "Vakmanschap"],
  },
  {
    id: 2,
    category: "Offshore",
    date: "1 april 2026",
    readTime: "5 min",
    title: "Staalconstructies voor offshore: eisen en uitdagingen",
    excerpt:
      "Offshore staalwerk staat bloot aan extreme omstandigheden: zout water, hoge druk en constante mechanische belasting. Wij leggen uit welke materialen en coatings wij inzetten voor duurzame offshore constructies.",
    img: imgPost2,
    featured: false,
    body: [
      {
        type: "intro",
        text: "De offshore-industrie stelt extreem hoge eisen aan staalconstructies. Waar landgebonden constructies doorgaans beschermd zijn tegen de ergste weersinvloeden, worden offshore constructies continu blootgesteld aan zeewatercorrosie, hoge windkrachten, dynamische belastingen en temperatuurwisselingen. FerroWorks heeft jarenlange ervaring met maatwerk staalwerk voor maritieme en offshore toepassingen.",
      },
      {
        type: "h2",
        text: "De vijf grootste uitdagingen bij offshore staalwerk",
      },
      {
        type: "bullets",
        items: [
          "Corrosie door zout zeewatermilieu",
          "Dynamische belastingen door golven en trillingen",
          "Extreme temperatuurwisselingen tussen dag en nacht",
          "Zware montageomstandigheden op locatie",
          "Strenge certificeringseisen (DNVGL, Lloyd's, etc.)",
        ],
      },
      {
        type: "h2",
        text: "Materiaalkeuze: staal, RVS of duplex?",
      },
      {
        text: "Voor offshore toepassingen is de materiaalkeuze cruciaal. Gewoon constructiestaal (S235 of S355) is prima voor constructies die goed beschermd worden met coatings en regelmatig onderhoud krijgen. RVS (AISI 316L) biedt betere corrosiebestendigheid maar is zwaarder en duurder. Duplex roestvast staal combineert de sterkte van constructiestaal met de corrosiebestendigheid van RVS — ideaal voor kritische offshore componenten.",
      },
      {
        type: "h2",
        text: "Coating en corrosiebescherming",
      },
      {
        text: "Een goede coating is onmisbaar bij offshore staalwerk. Wij werken met meerlaagse sytemen: een zinkrijke grondlaag, een epoxy-midcoat en een polyurethaan-topcoat. Dit systeem voldoet aan de corrosiviteitscategorie C5 (mariene omgeving) zoals beschreven in ISO 12944. De voorbereiding van het staaloppervlak — staalstralen tot Sa2,5 — is minstens zo belangrijk als de coating zelf.",
      },
      {
        type: "quote",
        text: "Een offshore constructie is zo sterk als zijn zwakste las — en zo duurzaam als zijn coating.",
      },
      {
        type: "h2",
        text: "FerroWorks en offshore: wat wij bieden",
      },
      {
        text: "Van het ontwerp en engineering op basis van uw specificaties, tot de productie, coatingbehandeling en levering kant-en-klaar op uw locatie. Wij werken nauw samen met onze opdrachtgevers en hun inspectie-engineers om te zorgen dat elk onderdeel aan de gestelde eisen voldoet. Documentatie, materiaalcertificaten en inspectierapporten worden standaard meegeleverd.",
      },
    ],
    tags: ["Offshore", "Corrosie", "Coating", "Maritiem"],
  },
  {
    id: 3,
    category: "Afwerking",
    date: "24 maart 2026",
    readTime: "3 min",
    title: "Natlak vs. poedercoating: wat past bij uw project?",
    excerpt:
      "De keuze tussen natlak en poedercoating heeft invloed op zowel de uitstraling als de beschermingsgraad van een staalconstructie. We zetten de voor- en nadelen van beide methoden op een rij.",
    img: imgPost3,
    featured: false,
    body: [
      {
        type: "intro",
        text: "Wanneer uw staalconstructie klaar is voor de afwerking, staat u voor een belangrijke keuze: natlak of poedercoating? Beide methoden bieden uitstekende bescherming, maar ze verschillen in toepassing, uitstraling en geschiktheid voor specifieke situaties. In dit artikel zetten we de voornaamste verschillen op een rij, zodat u samen met FerroWorks de juiste keuze kunt maken.",
      },
      {
        type: "h2",
        text: "Wat is poedercoating?",
      },
      {
        text: "Poedercoating is een droog verfproces waarbij kleurpoeder elektrostatisch op het metaal wordt aangebracht en vervolgens wordt uitgehard in een oven (180–200 °C). Het resultaat is een egale, harde laag die krasbestendig en milieuvriendelijk is (geen oplosmiddelen). Poedercoating is bij uitstek geschikt voor geveltoepassingen, hekwerken, sporttoestellen en binnendeuren.",
      },
      {
        type: "h2",
        text: "Wat is natlak?",
      },
      {
        text: "Natlak (vloeibare verf) wordt aangebracht via spuiten, kwast of roller. Het droogt door verdamping van oplosmiddelen of door chemische uitharding (2K-systemen). Natlak is flexibeler qua toepasbaarheid: het werkt ook op grote constructies die niet in een oven passen, complexe geometrieën en herstellingen in het veld.",
      },
      {
        type: "bullets",
        items: [
          "Poedercoating: ideaal voor seriematige productie in standaardmaten",
          "Natlak: noodzakelijk voor grote of complexe constructies",
          "Poedercoating: egaler en krasbestendiger oppervlak",
          "Natlak: geschikt voor C4/C5 corrosiviteitscategorieën (industrieel, offshore)",
          "Natlak: makkelijker te herstellen ter plaatse",
        ],
      },
      {
        type: "h2",
        text: "Wanneer kiest u voor welke methode?",
      },
      {
        text: "De vuistregel is simpel: past het in de oven? Dan is poedercoating doorgaans de beste keuze voor binnenwerk, lichte construties en gevelelementen. Voor zware staaldelen, buitentoepassingen in agressieve omgevingen of grote constructies die niet verplaatst kunnen worden, is natlak de aangewezen route.",
      },
      {
        type: "quote",
        text: "De beste coating is degene die aansluit op de omgeving, het gebruik en het budget van uw project.",
      },
    ],
    tags: ["Afwerking", "Coating", "Poedercoating", "Natlak"],
  },
  {
    id: 4,
    category: "Certificering",
    date: "17 maart 2026",
    readTime: "6 min",
    title: "Lascertificaat verplicht? Alles wat u moet weten over EN-1090",
    excerpt:
      "Sinds de invoering van de EN-1090 norm is een lascertificaat voor veel staalconstructies verplicht. Maar wat houdt dat precies in, en wanneer is het van toepassing? FerroWorks legt het u helder uit.",
    img: imgPost4,
    featured: false,
    body: [
      {
        type: "intro",
        text: "Steeds vaker krijgen wij de vraag: 'Is een lascertificaat verplicht voor mijn project?' Het antwoord hangt af van het type constructie en de toepassing — maar in veel gevallen is het antwoord simpelweg: ja. De Europese norm EN-1090 regelt de uitvoering van staal- en aluminiumconstructies en stelt eisen aan zowel het bedrijf als de individuele lassers. In dit artikel leggen we het u stap voor stap uit.",
      },
      {
        type: "h2",
        text: "Wat is EN-1090?",
      },
      {
        text: "EN-1090 is de Europese norm voor de fabricage van staal- en aluminiumconstructies. De norm bestaat uit twee delen: EN-1090-1 (CE-markering en conformiteitsbeoordeling) en EN-1090-2 (technische eisen voor staalconstructies). Een bedrijf dat CE-gemarkeerde staalconstructies op de Europese markt wil brengen, moet gecertificeerd zijn conform EN-1090-1.",
      },
      {
        type: "h2",
        text: "Voor welke constructies is het verplicht?",
      },
      {
        text: "De CE-markering op basis van EN-1090 is verplicht voor constructieve staalproducten die vallen onder de Europese Bouwproductenverordening (CPR). Concreet gaat het om dragende elementen zoals kolommen, liggers, vakwerkspanten, trappen en balustrades die deel uitmaken van gebouwen of civieltechnische werken.",
      },
      {
        type: "bullets",
        items: [
          "Dragende staalconstructies in gebouwen (EXC2 of hoger)",
          "Bruggen en civieltechnische constructies",
          "Industriële platforms en loopbruggen",
          "Trappen en balustrades als constructief element",
          "Offshore- en industriële constructies met hoge veiligheidseisen",
        ],
      },
      {
        type: "h2",
        text: "Uitvoeringsklassen: EXC1 t/m EXC4",
      },
      {
        text: "De norm kent vier uitvoeringsklassen (EXC1 t/m EXC4), waarbij EXC1 de laagste eisen stelt en EXC4 de hoogste. De keuze van de uitvoeringsklasse hangt af van de gevolgklasse (consequence class) van de constructie: hoe groter de gevolgen bij falen, hoe hoger de klasse. Voor de meeste industriële en utiliteitsbouwprojecten geldt EXC2 als standaard.",
      },
      {
        type: "quote",
        text: "FerroWorks is gecertificeerd voor uitvoeringsklassen EXC1 en EXC2 — de meest voorkomende klassen in bouw, industrie en architectuur.",
      },
      {
        type: "h2",
        text: "Wat betekent dit voor u als opdrachtgever?",
      },
      {
        text: "Als u een gecertificeerd bedrijf inschakelt zoals FerroWorks, ontvangt u bij oplevering een volledige CE-verklaring van prestatie (DoP) met bijbehorende documentatie. Dit beschermt u als opdrachtgever juridisch en garandeert dat de constructie voldoet aan de Europese veiligheidseisen.",
      },
    ],
    tags: ["EN-1090", "Certificering", "CE-markering", "Uitvoeringsklassen"],
  },
  {
    id: 5,
    category: "Productie",
    date: "10 maart 2026",
    readTime: "4 min",
    title: "Van tekening tot product: zo werkt ons productieproces",
    excerpt:
      "Hoe gaat een metaalproject van CAD-tekening naar afgewerkt product? We nemen u stap voor stap mee door het productieproces van FerroWorks: van intake en engineering tot productie, afwerking en montage.",
    img: imgPost5,
    featured: false,
    body: [
      {
        type: "intro",
        text: "Een metaalproject bouwen is meer dan knippen, lassen en lakken. Achter elk FerroWorks-product zit een gestructureerd proces dat begint op het moment dat u contact met ons opneemt — en eindigt pas als uw constructie gemonteerd, geïnspecteerd en opgeleverd is. In dit artikel nemen we u mee door onze werkwijze.",
      },
      {
        type: "h2",
        text: "Stap 1: Intake en offerte",
      },
      {
        text: "Elk project begint met een gesprek. We willen begrijpen wat u nodig heeft: de toepassing, de omgeving, de belastingen en uw budget. Op basis hiervan stellen wij een heldere offerte op met vaste prijs, duidelijke scope en realistische planning. Geen verrassingen achteraf.",
      },
      {
        type: "h2",
        text: "Stap 2: Engineering en tekeningen",
      },
      {
        text: "Na akkoord op de offerte start onze engineeringsafdeling met het uitwerken van de productietekeningen. We werken met moderne CAD-software en stemmen de tekeningen af met uw ontwerper of constructeur. Pas als u de tekeningen goedkeurt, gaan we de productie in.",
      },
      {
        type: "h2",
        text: "Stap 3: Productie",
      },
      {
        text: "In onze eigen werkplaats in Roosendaal beschikken we over moderne zaagmachines, lasersnijders, knipmachines, lasmachines en buigapparatuur. We werken met staal, RVS en aluminium en produceren alles in eigen beheer — geen uitbesteding, volledige controle.",
      },
      {
        type: "bullets",
        items: [
          "Zaag- en laserwerkzaamheden in eigen beheer",
          "Gecertificeerd laswerk conform EN-1090",
          "Bewerkingen voor RVS, staal en aluminium",
          "Kwaliteitscontrole tijdens en na productie",
        ],
      },
      {
        type: "h2",
        text: "Stap 4: Afwerking en coating",
      },
      {
        text: "Na productie volgt de oppervlaktebehandeling: stralen, gronden, natlakken of poedercoaten. We adviseren u over de meest geschikte methode op basis van de toepassing en omgevingscondities. Alle coatings worden aangebracht conform de geldende normen.",
      },
      {
        type: "h2",
        text: "Stap 5: Montage en oplevering",
      },
      {
        text: "Onze montageploeg plaatst de constructie op uw locatie. Na montage volgt een eindinspectie en ontvangen u een volledig opleverdossier: tekeningen, materiaalcertificaten, laskwaliteitsrapporten en — indien van toepassing — een CE-verklaring.",
      },
      {
        type: "quote",
        text: "Eén aanspreekpunt, van eerste schets tot laatste bout. Dat is de FerroWorks-werkwijze.",
      },
    ],
    tags: ["Productie", "Werkwijze", "Engineering", "Montage"],
  },
  {
    id: 6,
    category: "Industrie",
    date: "3 maart 2026",
    readTime: "5 min",
    title: "Maatwerk staal voor de industrie: 5 veelgemaakte fouten vermeden",
    excerpt:
      "Bij industrieel staalmaatwerk gaat het soms mis — niet door slechte intenties, maar door gebrek aan kennis of slechte communicatie. We bespreken vijf veelgemaakte fouten en hoe u ze kunt voorkomen.",
    img: imgPost6,
    featured: false,
    body: [
      {
        type: "intro",
        text: "Industrieel staalmaatwerk is complex. Er zijn veel partijen bij betrokken — opdrachtgevers, constructeurs, uitvoerders, toeleveranciers — en elke schakel kan een foutbron zijn. In onze jarenlange praktijk bij FerroWorks hebben we bepaalde patronen zien terugkomen. In dit artikel bespreken we vijf veelgemaakte fouten en hoe u ze kunt voorkomen.",
      },
      {
        type: "h2",
        text: "Fout 1: Onvolledige of vage specificaties",
      },
      {
        text: "De meest voorkomende oorzaak van meerkosten en vertraging is een onvolledige opdracht. 'Zo sterk als nodig' of 'standaard kwaliteit' zijn geen bruikbare specificaties voor een staalconstructie. Definieer vooraf: het materiaaltype (staal/RVS/alu), de belastingen, de omgeving, de uitvoeringsklasse (EXC) en de coatingeis.",
      },
      {
        type: "h2",
        text: "Fout 2: Certificering vergeten",
      },
      {
        text: "Pas als de constructie al gebouwd is, blijkt dat er een EN-1090-certificaat vereist is. Dit leidt in het beste geval tot extra documentatiewerk — in het slechtste geval tot herbouw. Check vooraf of uw constructie CE-markering vereist en of uw leverancier gecertificeerd is.",
      },
      {
        type: "h2",
        text: "Fout 3: Geen rekening houden met montageomstandigheden",
      },
      {
        text: "Een constructie die in de werkplaats perfect past, past niet door de toegangsdeur van de fabriek. Of de liftcapaciteit op locatie is onvoldoende. Denk al in de engineeringsfase na over transport, kraaninzet, toegankelijkheid en montagevolgorde.",
      },
      {
        type: "h2",
        text: "Fout 4: Coating kiezen op basis van prijs alleen",
      },
      {
        text: "Een goedkope coating die na twee jaar loslaat, is duurder dan een degelijk systeem dat tien jaar meegaat. De coatingkeuze hangt af van de omgeving (C1–C5), de gewenste levensduur en het onderhoudsprofiel. Vraag advies — het betaalt zichzelf terug.",
      },
      {
        type: "h2",
        text: "Fout 5: Één leverancier met alles uitbesteden zonder controle",
      },
      {
        text: "Vertrouwen is goed, controle is beter. Een goede leverancier verwelkomt tussentijdse inspecties, levert materiaalcertificaten en rapporteert transparant over afwijkingen. Als een partij dit niet doet, is dat een waarschuwingssignaal.",
      },
      {
        type: "bullets",
        items: [
          "Vraag altijd om materiaalcertificaten (EN 10204 3.1 of 3.2)",
          "Laat lasrapporten overleggen bij certificeringsplichtige constructies",
          "Plan een tussentijdse inspectie in de productie",
          "Controleer coatingdikte na oplevering met een meetapparaat",
        ],
      },
      {
        type: "quote",
        text: "Goede communicatie en heldere afspraken zijn de beste bescherming tegen kostbare fouten.",
      },
    ],
    tags: ["Industrie", "Maatwerk", "Kwaliteit", "Tips"],
  },
];

/* ── HERO ─────────────────────────────────────────────────────────────── */
function PostHero({ post, imgSrc }) {
  return (
    <section style={{ position: "relative", width: "100%", minHeight: "400px", display: "flex", alignItems: "flex-end", overflow: "hidden", background: "#141616" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${imgSrc})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(20,22,22,0.97) 0%, rgba(20,22,22,0.7) 50%, rgba(20,22,22,0.35) 100%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8" style={{ paddingBottom: "56px", paddingTop: "96px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          <Link to="/" style={{ color: "#c8d400", fontSize: "12px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Home</Link>
          <span style={{ color: "#555", fontSize: "12px" }}>›</span>
          <Link to="/blog" style={{ color: "#c8d400", fontSize: "12px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Blog</Link>
          <span style={{ color: "#555", fontSize: "12px" }}>›</span>
          <span style={{ color: "#888", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{post.category}</span>
        </div>

        {/* Category badge */}
        <div style={{ marginBottom: "16px" }}>
          <span style={{ background: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#1c1c1c", padding: "5px 12px" }}>{post.category}</span>
        </div>

        {/* Title */}
        <h1 style={{ margin: "0 0 20px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(24px, 3.5vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.5px", textTransform: "uppercase", color: "#fff", maxWidth: "820px" }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <span style={{ color: "#888", fontSize: "13px" }}>{post.date}</span>
          <span style={{ width: "4px", height: "4px", background: "#c8d400", borderRadius: "50%", flexShrink: 0 }} />
          <span style={{ color: "#888", fontSize: "13px" }}>{post.readTime} leestijd</span>
        </div>

        <div style={{ width: "56px", height: "4px", background: "#c8d400", marginTop: "28px", borderRadius: "2px" }} />
      </div>
    </section>
  );
}

/* ── ARTICLE BODY ─────────────────────────────────────────────────────── */
function ArticleBody({ post, allPosts }) {
  const [ref, vis] = useInView(0.05);

  return (
    <section style={{ background: "#f4f4f4", padding: "72px 0" }}>
      <style>{`
        .ab-wrap { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .ab-on .ab-wrap { opacity:1; transform:none; }
        .ab-body h2 {
          font-family: "Arial Black", Arial, sans-serif;
          font-weight: 900;
          font-size: clamp(18px, 2vw, 22px);
          text-transform: uppercase;
          letter-spacing: -0.2px;
          color: #1c1c1c;
          margin: 40px 0 16px 0;
          line-height: 1.2;
        }
        .ab-body p {
          color: #555;
          font-size: 15.5px;
          line-height: 1.8;
          margin: 0 0 18px 0;
        }
        .ab-body .intro-p {
          font-size: 17px;
          color: #444;
          border-left: 4px solid #c8d400;
          padding-left: 20px;
          margin-bottom: 32px;
          line-height: 1.8;
        }
        .ab-body blockquote {
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
        .ab-body ul {
          margin: 8px 0 24px 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ab-body ul li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #555;
          font-size: 15px;
          line-height: 1.6;
        }
        .ab-body ul li::before {
          content: "";
          display: block;
          width: 8px;
          height: 8px;
          background: #c8d400;
          flex-shrink: 0;
          margin-top: 6px;
        }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 ab-layout " + (vis ? "ab-on" : "")} style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "64px", alignItems: "start" }}>

        {/* Main article */}
        <article className="ab-wrap ab-body">
          {post.body.map((block, i) => {
            if (block.type === "intro") return <p key={i} className="intro-p">{block.text}</p>;
            if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
            if (block.type === "quote") return <blockquote key={i}>"{block.text}"</blockquote>;
            if (block.type === "bullets") return (
              <ul key={i}>
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            );
            return <p key={i}>{block.text}</p>;
          })}

          {/* Tags */}
          <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1.5px solid #e0e0e0" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaa", marginRight: "12px" }}>Tags:</span>
            {post.tags.map((tag, i) => (
              <span key={i} style={{ display: "inline-block", background: "#e8e8e8", color: "#555", fontSize: "12px", fontWeight: 700, padding: "4px 12px", marginRight: "8px", marginBottom: "8px", letterSpacing: "0.3px" }}>{tag}</span>
            ))}
          </div>
        </article>

        {/* Sidebar */}
        <Sidebar post={post} allPosts={allPosts} />
      </div>
    </section>
  );
}

/* ── SIDEBAR ──────────────────────────────────────────────────────────── */
function Sidebar({ post, allPosts }) {
  const others = allPosts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Contact card */}
      <div style={{ background: "#1c1c1c", padding: "28px 24px" }}>
        <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "14px", textTransform: "uppercase", letterSpacing: "-0.1px", color: "#fff", margin: "0 0 12px 0", lineHeight: 1.2 }}>
          EEN PROJECT <span style={{ color: "#c8d400" }}>IN GEDACHTEN?</span>
        </h3>
        <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.6, margin: "0 0 20px 0" }}>
          Neem contact op met ons team. We reageren binnen 24 uur.
        </p>
        <Link
          to="/contact"
          style={{ display: "block", textAlign: "center", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "14px 20px", textDecoration: "none", transition: "background .2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
          onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
        >
          NEEM CONTACT OP
        </Link>
      </div>

      {/* Contact details */}
      <div style={{ background: "#fff", padding: "24px", borderTop: "4px solid #c8d400" }}>
        <h4 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#1c1c1c", margin: "0 0 16px 0" }}>DIRECT CONTACT</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { label: "Telefoon", val: "+31 (0)165 205 601", href: "tel:+31165205601" },
            { label: "E-mail", val: "info@ferroworks.nl", href: "mailto:info@ferroworks.nl" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#aaa", marginBottom: "2px" }}>{item.label}</div>
              <a href={item.href} style={{ color: "#1c1c1c", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = "#c8d400"}
                onMouseLeave={e => e.currentTarget.style.color = "#1c1c1c"}
              >{item.val}</a>
            </div>
          ))}
        </div>
      </div>

      {/* Related posts */}
      <div>
        <h4 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#1c1c1c", margin: "0 0 20px 0", paddingBottom: "12px", borderBottom: "2px solid #c8d400" }}>
          MEER ARTIKELEN
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {others.map(p => (
            <Link
              key={p.id}
              to={`/blog/${p.id}`}
              style={{ display: "flex", gap: "12px", textDecoration: "none", alignItems: "flex-start" }}
              onMouseEnter={e => e.currentTarget.querySelector(".rel-title").style.color = "#c8d400"}
              onMouseLeave={e => e.currentTarget.querySelector(".rel-title").style.color = "#1c1c1c"}
            >
              <img src={p.image || BLOG_FALLBACK_IMAGES[allPosts.indexOf(p) % BLOG_FALLBACK_IMAGES.length]} alt={p.title} style={{ width: "64px", height: "48px", objectFit: "cover", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", color: "#c8d400", textTransform: "uppercase", marginBottom: "4px" }}>{p.category}</div>
                <div className="rel-title" style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", lineHeight: 1.3, transition: "color .2s" }}>{p.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ── MORE POSTS ───────────────────────────────────────────────────────── */
function MorePosts({ currentId, allPosts }) {
  const [ref, vis] = useInView(0.1);
  const related = allPosts.filter(p => p.id !== currentId).slice(0, 3);

  return (
    <section style={{ background: "#1c1c1c", padding: "72px 0" }}>
      <style>{`
        .mp-card { opacity:0; transform:translateY(24px); transition: opacity .55s ease, transform .55s ease; }
        .mp-on .mp-card:nth-child(1) { opacity:1; transform:none; transition-delay:.05s; }
        .mp-on .mp-card:nth-child(2) { opacity:1; transform:none; transition-delay:.18s; }
        .mp-on .mp-card:nth-child(3) { opacity:1; transform:none; transition-delay:.31s; }
        @media (max-width: 768px) { .mp-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "mp-on" : "")}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(18px, 2vw, 24px)", textTransform: "uppercase", letterSpacing: "-0.3px", margin: 0 }}>
            <span style={{ color: "#fff" }}>MEER </span><span style={{ color: "#c8d400" }}>ARTIKELEN</span>
          </h2>
          <Link
            to="/blog"
            style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#c8d400", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
            onMouseEnter={e => e.currentTarget.style.gap = "10px"}
            onMouseLeave={e => e.currentTarget.style.gap = "6px"}
          >
            ALLE ARTIKELEN
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#c8d400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="mp-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {related.map(p => (
            <Link
              key={p.id}
              to={`/blog/${p.id}`}
              className="mp-card"
              style={{ textDecoration: "none", background: "#252525", display: "block", transition: "transform .25s ease, box-shadow .25s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ overflow: "hidden", height: "180px" }}>
                <img src={p.image || BLOG_FALLBACK_IMAGES[allPosts.indexOf(p) % BLOG_FALLBACK_IMAGES.length]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .4s ease" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
              <div style={{ padding: "22px 20px" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ background: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: "#1c1c1c", padding: "3px 8px" }}>{p.category}</span>
                  <span style={{ color: "#666", fontSize: "12px" }}>{p.date}</span>
                </div>
                <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", color: "#fff", margin: "0 0 10px 0", lineHeight: 1.3, letterSpacing: "-0.1px" }}>{p.title}</h3>
                <span style={{ color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>LEES MEER →</span>
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
        <div className="fw-cta-box" style={{ background: "#1c1c1c", padding: "48px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(18px, 2.2vw, 26px)", textTransform: "uppercase", color: "#fff", margin: "0 0 8px 0", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
              KLAAR VOOR UW <span style={{ color: "#c8d400" }}>METAALPROJECT?</span>
            </h2>
            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Stuur uw tekening op of bel ons direct — wij reageren binnen 24 uur.</p>
          </div>
          <Link
            to="/contact"
            className="fw-primary-action"
            style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "16px 32px", textDecoration: "none", display: "inline-block", transition: "background .2s", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = "#b3be00"}
            onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}
          >
            NEEM CONTACT OP
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── PAGE EXPORT ──────────────────────────────────────────────────────── */
export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cms } = useCms();

  const allPosts = (cms.blog && cms.blog.length) ? cms.blog : FALLBACK_POSTS;
  const post = allPosts.find(p => p.id === parseInt(id, 10)) || allPosts.find(p => String(p.id) === String(id));
  const postIdx = allPosts.indexOf(post);
  const imgSrc = post ? (post.image || BLOG_FALLBACK_IMAGES[postIdx % BLOG_FALLBACK_IMAGES.length]) : null;

  useEffect(() => {
    if (!post) navigate("/blog", { replace: true });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [id, post, navigate]);

  if (!post) return null;

  return (
    <>
      <PostHero post={post} imgSrc={imgSrc} />
      <ArticleBody post={post} allPosts={allPosts} />
      <MorePosts currentId={post.id} allPosts={allPosts} />
      <CtaStrip />
    </>
  );
}
