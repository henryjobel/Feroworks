// ─── Default CMS content for all pages ───────────────────────────────────────
// Images: null means the component will use its bundled static fallback image.
// When admin uploads an image, this becomes a base64 string.

export const DEFAULT_CMS = {

  /* ── GLOBAL SITE SETTINGS ─────────────────────────────────────────── */
  site: {
    naam:      "FerroWorks",
    tagline:   "Metaalmaatwerk",
    tel:       "+31 (0)165 205 617",
    email:     "info@ferroworks.nl",
    adres:     "Havendijk 12, 4701 LH Roosendaal",
    kvk:       "12345678",
    btw:       "NL123456789B01",
    website:   "www.ferroworks.nl",
    linkedin:  "linkedin.com/company/ferroworks",
    instagram: "",
    facebook:  "",
    metaTitle: "FerroWorks – Metaalmaatwerk in Staal, RVS & Aluminium",
    metaDesc:  "FerroWorks levert maatwerk metaalconstructies voor industrie, bouw en architectuur. Engineering, productie, coating en montage onder één dak.",
  },

  /* ── HOMEPAGE: HERO BANNER ────────────────────────────────────────── */
  hero: {
    line1:    "VORMGEVERS IN METAAL.",
    line2:    "VAN ONTWERP TOT MONTAGE.",
    subtitle: "FerroWorks begeleidt metaalprojecten van ontwerp en engineering\ntot productie en montage. Specialist in Staal, RVS & Aluminium.",
    cta:      "STUUR UW TEKENING OP",
    ctaLink:  "/contact",
    checkItems: [
      "Ruim 15 jaar ervaring",
      "VCA, EN-1090 & CE gecertificeerd",
      "Staal, RVS & Aluminium maatwerk",
      "Ontwerp, productie & montage",
    ],
    image: null,
  },

  /* ── STATS (shared by homepage + over ons + other pages) ─────────── */
  stats: [
    { number: "15+",  desc: "jaar ervaring in metaalmaatwerk" },
    { number: "3",    desc: "materialen: Staal, RVS & Aluminium" },
    { number: "100%", desc: "eigen productie, geen onderaannemers" },
    { number: "A-Z",  desc: "van ontwerp en engineering tot montage" },
  ],

  /* ── HOMEPAGE: WAT FERROWORKS VOOR JE DOET ───────────────────────── */
  watFerna: {
    title1: "WAT FERROWORKS",
    title2: "VOOR JE DOET",
    bulletItems: [
      "Heldere afspraken, zonder verrassingen.",
      "Totaal ontzorgen van ontwerp tot montage.",
      "Reparatie en onderhoud op locatie.",
      "Advies en ondersteuning bij ontwerp en uitvoerbaarheid.",
      "Eén partner voor het volledige traject.",
      "Maakbaar, praktisch en doordacht.",
      "Transparant in kosten en planning.",
    ],
    image1: null,
    image2: null,
  },

  /* ── HOMEPAGE: WAT ONS ANDERS MAAKT ──────────────────────────────── */
  anders: {
    items: [
      {
        title: "GROOT GENOEG OM REGIE TE VOEREN",
        desc: "Wij hebben de slagkracht en expertise om technische metaalprojecten volledig te realiseren.",
      },
      {
        title: "KLEIN GENOEG OM DIRECT TE SCHAKELEN",
        desc: "Direct contact, snel schakelen en meebewegen met jouw planning.",
      },
      {
        title: "PERSOONLIJK GENOEG OM VOORUIT TE DENKEN",
        desc: "We adviseren, optimaliseren en zorgen dat jouw project van begin tot eind klopt.",
      },
    ],
    image: null,
  },

  /* ── HOMEPAGE: PROJECTEN SLIDER ───────────────────────────────────── */
  projecten: [
    {
      title: "MEETBUIZEN T.B.V. VLOEISTOFTANK",
      desc:  "Voor deze klant hebben we maatwerk meetbuizen ten behoeve van een vloeistoftank geproduceerd.",
      image: null,
    },
    {
      title: "STAALCONSTRUCTIE OFFSHORE PLATFORM",
      desc:  "Complexe staalconstructie vervaardigd voor een offshore platform, volledig Lloyd's-gecertificeerd.",
      image: null,
    },
    {
      title: "PIJPLEIDINGWERK PETROCHEMIE",
      desc:  "Maatwerkpiping en koppelstukken geleverd voor een raffinaderij in de petrochemische sector.",
      image: null,
    },
    {
      title: "TANKBOUW INDUSTRIEEL COMPLEX",
      desc:  "Walsdelen, daksecties en mangaten geproduceerd voor een groot industrieel tankbouwproject.",
      image: null,
    },
  ],

  /* ── HOMEPAGE: FAQ ────────────────────────────────────────────────── */
  faq: [
    {
      q: "WIJ HEBBEN AL EEN VASTE STAALPARTNER. WAAROM ZOUDEN WE MET FERROWORKS PRATEN?",
      a: "Omdat FerroWorks zich richt op de complexe, maatwerk opdrachten die vaak buiten het profiel van een standaard staalpartner vallen. We werken snel, nauwkeurig en volledig in eigen beheer — zonder onderaannemers.",
    },
    {
      q: "ZIJN JULLIE GROOT GENOEG VOOR ONZE PROJECTEN?",
      a: "Met 16 gespecialiseerde vakmensen en een volledig eigen machinepark — inclusief watersnijder 6 x 3 meter — zijn we toegerust voor complexe industriële projecten. Gecertificeerd voor de meest veeleisende opdrachtgevers.",
    },
    {
      q: "WELKE CERTIFICERINGEN HEEFT FERROWORKS?",
      a: "FerroWorks is VCA-gecertificeerd en voldoet aan de EN-1090 norm voor staal- en aluminiumconstructies. We leveren volledige documentatie en kwaliteitsborging mee.",
    },
    {
      q: "HOE ZEKER IS DE LEVERTIJD VAN 2 TOT 4 WEKEN?",
      a: "De levertijd van 2 tot 4 weken is een belofte, geen schatting. Doordat alles in eigen werkplaats gebeurt, hebben we volledige controle over planning en kwaliteit. Bij urgente projecten denken we graag mee.",
    },
  ],

  /* ── OVER ONS PAGE ────────────────────────────────────────────────── */
  overOns: {
    verhaal: {
      title1: "GEBOUWD OP",
      title2: "VAKMANSCHAP",
      tekst1: "FerroWorks is een familiebedrijf met meer dan 15 jaar ervaring in metaalmaatwerk. We begeleiden projecten van A tot Z — van ontwerp en engineering tot productie, coating en montage op locatie.",
      tekst2: "Specialist in maatwerk staal, RVS en aluminium voor industrie, bouw & utiliteit, architectuur & design en maritieme toepassingen.",
      tekst3: "Heldere afspraken, transparante kosten en één aanspreekpunt van begin tot eind. Dat is hoe wij werken.",
      image1: null,
      image2: null,
    },
    watWeDoen: {
      items: [
        "Heldere afspraken, zonder verrassingen.",
        "Totaal ontzorgen van ontwerp tot montage.",
        "Reparatie en onderhoud op locatie.",
        "Advies en ondersteuning bij ontwerp en uitvoerbaarheid.",
        "Één partner voor het volledige traject.",
        "Maakbaar, praktisch en doordacht.",
        "Transparant in kosten en planning.",
      ],
      image: null,
    },
    andersItems: [
      { title: "GROOT GENOEG OM REGIE TE VOEREN",      desc: "Wij hebben de slagkracht en expertise om technische metaalprojecten volledig te realiseren." },
      { title: "KLEIN GENOEG OM DIRECT TE SCHAKELEN",  desc: "Direct contact, snel schakelen en meebewegen met jouw planning." },
      { title: "PERSOONLIJK GENOEG OM VOORUIT TE DENKEN", desc: "We adviseren, optimaliseren en zorgen dat jouw project van begin tot eind klopt." },
    ],
    team: {
      title1: "VAKMANNEN MET",
      title2: "EÉN DOEL",
      tekst1: "Ons team bestaat uit gespecialiseerde metaalbewerkers, lassers, engineers en projectleiders. Elk met diepgaande kennis van staal, RVS en aluminium.",
      tekst2: "Wij werken nauw samen met onze klanten: van de eerste tekening tot de laatste bout op locatie. Altijd één aanspreekpunt, altijd persoonlijk.",
      items: [
        "Ruim 15 jaar ervaring in metaalmaatwerk",
        "Maakbaar, praktisch en doordacht",
        "Reparatie en onderhoud op locatie",
      ],
      image1: null,
      image2: null,
      image3: null,
    },
  },

  /* ── DIENSTEN ─────────────────────────────────────────────────────── */
  diensten: [
    {
      id: "engineering",
      nr: "01",
      title: "Engineering & Ontwerp",
      subtitle: "Van eerste schets tot goedgekeurde productietekening",
      excerpt: "Elk project begint met een goed ontwerp. Onze engineers werken met moderne CAD-software en vertalen uw wensen naar haalbare, maakbare productietekeningen.",
      checklist: "2D- en 3D-tekeningen (CAD/CAM)\nConstructieve berekeningen\nMateriaalkeuze en kostenadvies\nToetsing op maakbaarheid\nGoedkeuringsproces met de opdrachtgever",
      body: "Een goed metaalproject begint niet in de werkplaats — het begint op de tekentafel. Bij FerroWorks beschikken we over een eigen engineeringsafdeling die uw idee of specificatie omzet naar een volledig uitgewerkte, maakbare productietekening.\n\nOf u nu aankomt met een gedetailleerde constructietekening, een ruwe schets op papier of enkel een idee — wij werken het uit. We stellen gerichte vragen om uw toepassing, belasting, omgeving en eindgebruik goed te begrijpen.\n\nWerkt u met een extern constructiebedrijf of architect? Dan stemmen wij direct met hen af. We brengen de uitvoerbaarheid in vanuit de fabrikant — zodat wat op papier staat ook echt te maken is.",
      image: null,
    },
    {
      id: "productie",
      nr: "02",
      title: "Productie in eigen beheer",
      subtitle: "Volledig machinepark, geen uitbesteding",
      excerpt: "In onze moderne werkplaats in Roosendaal beschikken we over een volledig machinepark voor het verwerken van staal, RVS en aluminium.",
      checklist: "Zaag- en lasersnijwerk\nBoren, frezen en knippen\nGecertificeerd lassen (MIG/MAG, TIG, WIG)\nBuigen en walsen\nPrefab-productie en maatwerk in alle series",
      body: "In onze moderne werkplaats beschikken we over een volledig machinepark. Wij besteden niets uit — alles wordt bij ons in eigen beheer geproduceerd, van de eerste zaagsnede tot de laatste lassnaad.\n\nOf het nu gaat om enkelstuks maatwerk of grotere series — FerroWorks heeft de capaciteit en expertise om uw project efficiënt en nauwkeurig te produceren.\n\nOns team van gecertificeerde lassers werkt met staal, RVS en aluminium. We beheersen alle gangbare lasmethodes: MIG/MAG, TIG en WIG.",
      image: null,
    },
    {
      id: "coating",
      nr: "03",
      title: "Coating & Afwerking",
      subtitle: "Meerlaagse coatingsystemen conform ISO 12944",
      excerpt: "Een goede afwerking beschermt uw constructie en bepaalt de uitstraling. FerroWorks adviseert de juiste coatingoplossing.",
      checklist: "Stralen tot Sa2,5\nZinkrijke of epoxy grondlaag\nNatlak voor grote constructies\nPoedercoating seriematig\nRVS-polijsten\nGalvaniseren",
      body: "Een coating is meer dan een verflaag. Het is de bescherming van uw investering. FerroWorks adviseert het juiste coatingsysteem op basis van de omgeving, belasting en gewenste levensduur.\n\nWij stralen, gronden en lakken in eigen beheer. Van zinkrijke grondlagen voor offshore toepassingen tot poedercoating voor architecturale elementen — we dekken het volledige spectrum.\n\nAlle coatingsystemen worden toegepast conform ISO 12944, de internationale norm voor corrosieprotectie van staalconstructies.",
      image: null,
    },
    {
      id: "montage",
      nr: "04",
      title: "Montage op locatie",
      subtitle: "Eigen gecertificeerde montageploeg",
      excerpt: "Onze montageploeg plaatst uw constructie op locatie, van eenvoudige hekwerken tot complexe staalconstructies op hoogte.",
      checklist: "Eigen montageploeg, gecertificeerd VCA\nMontage van staal, RVS en aluminium\nKraanbegeleiding en veiligheidsbeheer\nAansluitlassen en correcties op locatie\nEindinspectie en opleverdossier",
      body: "Productie is pas compleet als uw constructie op de juiste plek staat. Onze eigen montageploeg plaatst alles op locatie — van eenvoudige hekwerken tot complexe staalconstructies op hoogte.\n\nWe werken VCA-gecertificeerd en nemen alle veiligheidsmaatregelen in acht. Onze monteurs zijn opgeleid voor werken op hoogte, in besloten ruimten en op industrieterreinen.\n\nNa montage voeren we een eindcontrole uit en leveren we een volledig opleverdossier op.",
      image: null,
    },
    {
      id: "reparatie",
      nr: "05",
      title: "Reparatie & Onderhoud",
      subtitle: "Snel, vakkundig, zonder lange wachttijden",
      excerpt: "Staalconstructies slijten, vervormen of beschadigen. FerroWorks voert reparaties en onderhoud uit.",
      checklist: "Lasreparaties in staal, RVS en aluminium\nHerstel van corrosieschade en coating\nStructurele versterking van bestaande constructies\nSpoedreparaties op locatie mogelijk\nOnderhoudscontracten op aanvraag",
      body: "Staalconstructies slijten, vervormen of beschadigen door gebruik, corrosie of externe invloeden. FerroWorks voert reparaties snel en vakkundig uit — in de werkplaats of op locatie.\n\nWe beoordelen de schade, adviseren de beste aanpak en lossen het op. Van kleine lasreparaties tot structurele versterkingen van bestaande constructies.\n\nHeeft u een noodgeval? Bel ons direct. Spoedreparaties op locatie zijn mogelijk.",
      image: null,
    },
  ],

  /* ── SECTOREN ─────────────────────────────────────────────────────── */
  sectoren: [
    {
      id: "bouw",
      nr: "01",
      naam: "Bouw & Utiliteit",
      tagline: "Staalconstructies, hekwerken en prefab balkons voor de bouwsector",
      description: "Staalconstructies, standaard hekwerken en prefab balkons voor bouw- en utiliteitsprojecten.",
      intro: "In de bouw- en utiliteitssector levert FerroWorks staalconstructies die voldoen aan de strengste normen. Van draagframes tot prefab balkons — alles CE-gecertificeerd conform EN-1090.",
      items: "Staalconstructies en draagframes\nStandaard hekwerken\nPrefab balkons en bordessen\nTrappen, leuningen en vluchttrapstructuren\nGevelelementen en kozijnstaal\nCE-gecertificeerd conform EN-1090",
      image: null,
    },
    {
      id: "industrie",
      nr: "02",
      naam: "Industrie",
      tagline: "Machinebouw, procesinstallaties en maatwerk staalwerk",
      description: "Machinebouw, maatwerk staalconstructies, industriële installaties en laswerkzaamheden op locatie.",
      intro: "Industriële klanten vertrouwen op FerroWorks voor maatwerk staalconstructies en procesinstallaties. We leveren snel en nauwkeurig, ook op locatie.",
      items: "Machinebouw en machineframes\nMaatwerk staalconstructies\nIndustriële installaties en procesframes\nLaswerkzaamheden op locatie\nRVS voor food- en farmaceutische industrie\nDraagstructuren en mezzanine vloeren",
      image: null,
    },
    {
      id: "architectuur",
      nr: "03",
      naam: "Architectuur & Design",
      tagline: "Design trappen, sierwerk en exterieur maatwerk voor architecten",
      description: "Design trappen en interieur- en exterieur maatwerk voor architectuur- en designprojecten.",
      intro: "Architecten en designers kiezen FerroWorks voor maatwerk metaalwerk dat esthetiek en vakmanschap combineert. Van design trappen tot unieke gevelpanelen.",
      items: "Design trappen in staal en RVS\nInterieur- en exterieur maatwerk\nBalustrades en leuningwerken\nSierwerk, poorten en toegangspartijen\nGevelpanelen en bekleding\nCoating en poedercoating in elke RAL-kleur",
      image: null,
    },
    {
      id: "maritiem",
      nr: "04",
      naam: "Maritiem",
      tagline: "Jachtbouw, offshore constructies en maritieme coating",
      description: "Maatwerk staal- en aluminium constructies voor jachtbouw en maritieme toepassingen.",
      intro: "Maritieme omstandigheden vereisen het beste materiaal en de beste coating. FerroWorks levert voor jachtbouw, offshore en haven­infrastructuur.",
      items: "Jachtbouw en scheepsinterieurs\nOffshore staal- en RVS-constructies\nDekuitrusting en handrelingen\nAluminium loopbruggen en vlonders\nMaritieme coating (C5-M, ISO 12944)\nReparaties in haven en aan boord",
      image: null,
    },
  ],

  /* ── BLOG POSTS ───────────────────────────────────────────────────── */
  blog: [
    {
      id: 1,
      title:    "Waarom kwaliteitscontrole bij lassen het verschil maakt",
      slug:     "kwaliteitscontrole-lassen",
      category: "Vakmanschap",
      date:     "8 april 2026",
      readTime: "4 min",
      status:   "Gepubliceerd",
      featured: true,
      excerpt:  "In de metaalbewerking is lassen een van de meest kritische processen. Een kleine fout in de las kan grote gevolgen hebben voor de veiligheid en levensduur van een constructie. Ontdek hoe FerroWorks kwaliteitscontrole inzet als standaard — niet als uitzondering.",
      body:     "Kwaliteitscontrole bij lassen begint niet bij de eindcontrole, maar bij elk stap in het proces. Van de keuze van het lassmateriaal tot de voorbereiding van het basismateriaal.\n\nBij FerroWorks werken we uitsluitend met gecertificeerde lassers die voldoen aan de EN-1090 norm. Iedere las wordt visueel gecontroleerd en — waar vereist — getest met NDO-methoden.\n\nEen kleine afwijking in een las kan grote gevolgen hebben bij belasting. Daarom hanteren we strenge procedures en documentatie bij elk project.",
      image:    null,
    },
    {
      id: 2,
      title:    "Staalconstructies voor offshore: eisen en uitdagingen",
      slug:     "staalconstructies-offshore",
      category: "Offshore",
      date:     "1 april 2026",
      readTime: "5 min",
      status:   "Gepubliceerd",
      featured: false,
      excerpt:  "Offshore staalwerk staat bloot aan extreme omstandigheden: zout water, hoge druk en constante mechanische belasting. Wij leggen uit welke materialen en coatings wij inzetten voor duurzame offshore constructies.",
      body:     "Offshore staalconstructies worden blootgesteld aan een van de meest agressieve omgevingen denkbaar: zout zeewater, hoge windbelasting en constante mechanische stress.\n\nFerroWorks levert offshore constructies conform NORSOK en ISO 12944 klasse C5-M. We gebruiken uitsluitend gecertificeerde materialen en coatingsystemen die bestand zijn tegen de zwaarste maritieme omstandigheden.\n\nVanaf de engineeringfase houden we rekening met corrosieprotectie, onderhoudsintervallen en toegankelijkheid op locatie.",
      image:    null,
    },
    {
      id: 3,
      title:    "Natlak vs. poedercoating: wat past bij uw project?",
      slug:     "natlak-vs-poedercoating",
      category: "Afwerking",
      date:     "24 maart 2026",
      readTime: "3 min",
      status:   "Gepubliceerd",
      featured: false,
      excerpt:  "De keuze tussen natlak en poedercoating heeft invloed op zowel de uitstraling als de beschermingsgraad van een staalconstructie. We zetten de voor- en nadelen van beide methoden op een rij.",
      body:     "Natlak en poedercoating zijn beide uitstekende afwerkingsmethoden voor staal, maar ze hebben elk hun eigen toepassingsgebied.\n\nNatlak is ideaal voor grote constructies die niet in een oven passen, voor meerlaagse coatingsystemen en voor toepassingen in agressieve omgevingen. Poedercoating is duurzamer, milieuvriendelijker en geeft een uniforme afwerking — perfect voor seriematige productie.\n\nBij FerroWorks adviseren we altijd de meest geschikte methode op basis van uw specifieke situatie.",
      image:    null,
    },
    {
      id: 4,
      title:    "Lascertificaat verplicht? Alles wat u moet weten over EN-1090",
      slug:     "en-1090-certificering",
      category: "Certificering",
      date:     "17 maart 2026",
      readTime: "6 min",
      status:   "Gepubliceerd",
      featured: false,
      excerpt:  "Sinds de invoering van de EN-1090 norm is een lascertificaat voor veel staalconstructies verplicht. Maar wat houdt dat precies in, en wanneer is het van toepassing? FerroWorks legt het u helder uit.",
      body:     "De EN-1090 norm is de Europese standaard voor de fabricage van staal- en aluminiumconstructies. Constructies die vallen onder de CE-markeringsplicht moeten door een gecertificeerde fabrikant worden geproduceerd.\n\nFerroWorks is gecertificeerd conform EN-1090-2 voor uitvoeringsklasse EXC2. Dit betekent dat onze constructies voldoen aan de strengste Europese eisen voor dragende staalconstructies.\n\nVraagt u zich af of uw project EN-1090 certificering vereist? Neem contact op — wij adviseren u graag.",
      image:    null,
    },
    {
      id: 5,
      title:    "Van tekening tot product: zo werkt ons productieproces",
      slug:     "productieproces-ferroworks",
      category: "Productie",
      date:     "10 maart 2026",
      readTime: "4 min",
      status:   "Gepubliceerd",
      featured: false,
      excerpt:  "Hoe gaat een metaalproject van CAD-tekening naar afgewerkt product? We nemen u stap voor stap mee door het productieproces van FerroWorks: van intake en engineering tot productie, afwerking en montage.",
      body:     "Elk FerroWorks project doorloopt dezelfde stappen: intake, engineering, productie, coating en montage. Door alles in eigen beheer te doen, houden we grip op kwaliteit en planning in elke fase.\n\nNa de intake en goedkeuring van tekeningen gaat het product de werkplaats in. Onze CNC-machines zorgen voor nauwkeurige zaag- en freeswerk. Daarna volgt het lassen, stralen en coaten.\n\nHet eindproduct wordt gecontroleerd, opgeslagen en door onze montageploeg op locatie geplaatst.",
      image:    null,
    },
    {
      id: 6,
      title:    "Maatwerk staal voor de industrie: 5 veelgemaakte fouten vermeden",
      slug:     "maatwerk-staal-industrie",
      category: "Industrie",
      date:     "3 maart 2026",
      readTime: "5 min",
      status:   "Gepubliceerd",
      featured: false,
      excerpt:  "Bij industrieel staalmaatwerk gaat het soms mis — niet door slechte intenties, maar door gebrek aan kennis of slechte communicatie. We bespreken vijf veelgemaakte fouten en hoe u ze kunt voorkomen.",
      body:     "Fout 1: te laat betrekken van de fabrikant. Wacht niet tot de tekening klaar is — betrek FerroWorks al vroeg in het ontwerpproces voor advies over maakbaarheid.\n\nFout 2: onvoldoende toleranties specificeren. Staal heeft toleranties. Zorg dat uw tekening haalbare toleranties vermeldt voor de gekozen productietechniek.\n\nFout 3: coating vergeten in het ontwerp. Denk al in het ontwerp na over coating: toegankelijkheid, dikte en methode bepalen mede de constructie.\n\nFout 4: geen rekening houden met montage. Een constructie die in de werkplaats perfect is, maar op locatie moeilijk te plaatsen is, kost tijd en geld.\n\nFout 5: geen duidelijke documentatie. Goede tekeningen en specificaties zijn de basis voor een succesvol project. Investeer in duidelijkheid.",
      image:    null,
    },
  ],

  /* ── CONTACT PAGE ─────────────────────────────────────────────────── */
  contact: {
    hero: {
      title1:   "NEEM",
      title2:   "CONTACT OP",
      subtitle: "Stuur uw tekening op of stel uw vraag. Wij reageren binnen 24 uur.",
    },
    adres:          "Havendijk 12, 4701 LH Roosendaal",
    tel:            "+31 (0)165 205 617",
    email:          "info@ferroworks.nl",
    openingstijden: "Ma–Vr: 07:30 – 17:00",
    mapEmbed:       "",
  },
  pages: [
    { key: "home", name: "Homepage", path: "/", metaTitle: "FerroWorks – Metaalmaatwerk in Staal, RVS & Aluminium", metaDescription: "FerroWorks levert maatwerk metaalconstructies voor industrie, bouw en architectuur. Engineering, productie, coating en montage onder één dak.", heroTitle: "", heroSubtitle: "", body: "", isIndexed: true },
    { key: "about", name: "Over Ons", path: "/over-ons", metaTitle: "Over Ons | FerroWorks", metaDescription: "Meer over FerroWorks, onze werkwijze en vakmanschap in staal, RVS en aluminium.", heroTitle: "", heroSubtitle: "", body: "", isIndexed: true },
    { key: "services", name: "Diensten", path: "/diensten", metaTitle: "Diensten | FerroWorks", metaDescription: "Engineering, productie, coating, montage en onderhoud voor maatwerk metaalprojecten.", heroTitle: "", heroSubtitle: "", body: "", isIndexed: true },
    { key: "sectors", name: "Sectoren", path: "/sectoren", metaTitle: "Sectoren | FerroWorks", metaDescription: "Metaalmaatwerk voor bouw, industrie, architectuur en maritieme toepassingen.", heroTitle: "", heroSubtitle: "", body: "", isIndexed: true },
    { key: "blog", name: "Blog", path: "/blog", metaTitle: "Blog | FerroWorks", metaDescription: "Kennisartikelen, projectverhalen en technische inzichten van FerroWorks.", heroTitle: "", heroSubtitle: "", body: "", isIndexed: true },
    { key: "contactPage", name: "Contact", path: "/contact", metaTitle: "Contact | FerroWorks", metaDescription: "Neem contact op met FerroWorks voor advies, offerte of technische afstemming.", heroTitle: "NEEM CONTACT OP", heroSubtitle: "Stuur uw tekening op of stel uw vraag. Wij reageren binnen 24 uur.", body: "", isIndexed: true },
    { key: "privacy", name: "Privacy Policy", path: "/privacy-policy", metaTitle: "Privacy Policy | FerroWorks", metaDescription: "Lees hoe FerroWorks persoonsgegevens verwerkt en beschermt.", heroTitle: "PRIVACY POLICY", heroSubtitle: "Heldere informatie over welke gegevens wij verwerken en waarom.", body: "<h2>1. Wie wij zijn</h2><p>FerroWorks verwerkt persoonsgegevens in het kader van offerteaanvragen, klantcommunicatie en dienstverlening.</p><h2>2. Welke gegevens wij verzamelen</h2><p>Wij verwerken contactgegevens, bedrijfsgegevens en informatie die u actief met ons deelt via formulieren, e-mail of telefonisch contact.</p><h2>3. Waarom wij deze gegevens gebruiken</h2><p>Wij gebruiken deze gegevens om aanvragen te beantwoorden, offertes op te stellen, opdrachten uit te voeren en onze dienstverlening te verbeteren.</p><h2>4. Bewaartermijnen</h2><p>Wij bewaren persoonsgegevens niet langer dan nodig is voor het doel waarvoor ze zijn verzameld, tenzij een wettelijke bewaartermijn geldt.</p><h2>5. Uw rechten</h2><p>U kunt verzoeken om inzage, correctie of verwijdering van uw persoonsgegevens door contact op te nemen via onze contactgegevens op deze website.</p>", isIndexed: true },
    { key: "terms", name: "Algemene Voorwaarden", path: "/algemene-voorwaarden", metaTitle: "Algemene Voorwaarden | FerroWorks", metaDescription: "De algemene voorwaarden van FerroWorks.", heroTitle: "ALGEMENE VOORWAARDEN", heroSubtitle: "De voorwaarden die van toepassing zijn op offertes, leveringen en opdrachten.", body: "<h2>1. Toepasselijkheid</h2><p>Deze voorwaarden zijn van toepassing op alle offertes, overeenkomsten en leveringen van FerroWorks.</p><h2>2. Offertes en opdrachten</h2><p>Offertes zijn vrijblijvend tenzij uitdrukkelijk anders vermeld. Een opdracht komt tot stand na schriftelijke bevestiging.</p><h2>3. Levering en uitvoering</h2><p>Opgegeven levertijden zijn indicatief. FerroWorks spant zich in om afspraken zorgvuldig na te komen.</p><h2>4. Betaling</h2><p>Facturen dienen te worden voldaan binnen de overeengekomen betaaltermijn. Bij overschrijding kunnen aanvullende kosten in rekening worden gebracht.</p><h2>5. Aansprakelijkheid</h2><p>Onze aansprakelijkheid is beperkt tot directe schade en tot het bedrag dat in het betreffende geval door onze verzekering wordt gedekt of anderszins contractueel is overeengekomen.</p>", isIndexed: true },
  ],

  websiteSettings: {
    robotsText: "User-agent: *\nAllow: /\nSitemap: {{siteUrl}}/sitemap.xml",
    extraHeadHtml: "",
    defaultOgImage: "",
    googleAnalyticsId: "",
    googleTagManagerId: "",
    metaPixelId: "",
    linkedInInsightTagId: "",
  },
};
