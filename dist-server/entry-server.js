import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { BrowserRouter, Link, NavLink, Navigate, Outlet, Route, Routes, StaticRouter, useLocation, useNavigate, useParams } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/api/client.js
var API_BASE = "http://localhost:4000";
async function request(path, options = {}) {
	const response = await fetch(`${API_BASE}${path}`, {
		credentials: "include",
		headers: {
			...options.body instanceof FormData ? {} : { "Content-Type": "application/json" },
			...options.headers || {}
		},
		...options
	});
	const payload = await response.json().catch(() => null);
	if (!response.ok || !payload?.ok) throw new Error(payload?.error?.message || "Request failed.");
	return payload.data;
}
var api = {
	getCms: () => request("/api/public/cms"),
	getBootstrap: (path) => request(`/api/public/bootstrap?path=${encodeURIComponent(path)}`),
	getMe: () => request("/api/auth/me"),
	login: (email, password) => request("/api/auth/login", {
		method: "POST",
		body: JSON.stringify({
			email,
			password
		})
	}),
	logout: () => request("/api/auth/logout", { method: "POST" }),
	updateSection: (key, value) => request(`/api/admin/section/${key}`, {
		method: "PUT",
		body: JSON.stringify({ value })
	}),
	getAdminLeads: () => request("/api/admin/leads"),
	replyToLead: (id, payload) => request(`/api/admin/leads/${id}/reply`, {
		method: "POST",
		body: JSON.stringify(payload)
	}),
	getEmailSettings: () => request("/api/admin/settings/email"),
	updateEmailSettings: (payload) => request("/api/admin/settings/email", {
		method: "PUT",
		body: JSON.stringify(payload)
	}),
	uploadCmsMedia: async (file) => {
		const formData = new FormData();
		formData.append("file", file);
		return request("/api/admin/upload", {
			method: "POST",
			body: formData
		});
	},
	submitContact: (formData) => request("/api/contact-submissions", {
		method: "POST",
		body: formData
	}),
	subscribeNewsletter: (email) => request("/api/newsletter-subscriptions", {
		method: "POST",
		body: JSON.stringify({ email })
	})
};
//#endregion
//#region src/cms/defaultContent.js
var DEFAULT_CMS = {
	site: {
		naam: "FerroWorks",
		tagline: "Metaalmaatwerk",
		tel: "+31 (0)165 205 617",
		email: "info@ferroworks.nl",
		adres: "Havendijk 12, 4701 LH Roosendaal",
		kvk: "12345678",
		btw: "NL123456789B01",
		website: "www.ferroworks.nl",
		linkedin: "linkedin.com/company/ferroworks",
		instagram: "",
		facebook: "",
		metaTitle: "FerroWorks – Metaalmaatwerk in Staal, RVS & Aluminium",
		metaDesc: "FerroWorks levert maatwerk metaalconstructies voor industrie, bouw en architectuur. Engineering, productie, coating en montage onder één dak."
	},
	hero: {
		line1: "VORMGEVERS IN METAAL.",
		line2: "VAN ONTWERP TOT MONTAGE.",
		subtitle: "FerroWorks begeleidt metaalprojecten van ontwerp en engineering\ntot productie en montage. Specialist in Staal, RVS & Aluminium.",
		cta: "STUUR UW TEKENING OP",
		ctaLink: "/contact",
		checkItems: [
			"Ruim 15 jaar ervaring",
			"VCA, EN-1090 & CE gecertificeerd",
			"Staal, RVS & Aluminium maatwerk",
			"Ontwerp, productie & montage"
		],
		image: null
	},
	stats: [
		{
			number: "15+",
			desc: "jaar ervaring in metaalmaatwerk"
		},
		{
			number: "3",
			desc: "materialen: Staal, RVS & Aluminium"
		},
		{
			number: "100%",
			desc: "eigen productie, geen onderaannemers"
		},
		{
			number: "A-Z",
			desc: "van ontwerp en engineering tot montage"
		}
	],
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
			"Transparant in kosten en planning."
		],
		image1: null,
		image2: null
	},
	anders: {
		items: [
			{
				title: "GROOT GENOEG OM REGIE TE VOEREN",
				desc: "Wij hebben de slagkracht en expertise om technische metaalprojecten volledig te realiseren."
			},
			{
				title: "KLEIN GENOEG OM DIRECT TE SCHAKELEN",
				desc: "Direct contact, snel schakelen en meebewegen met jouw planning."
			},
			{
				title: "PERSOONLIJK GENOEG OM VOORUIT TE DENKEN",
				desc: "We adviseren, optimaliseren en zorgen dat jouw project van begin tot eind klopt."
			}
		],
		image: null
	},
	projecten: [
		{
			title: "MEETBUIZEN T.B.V. VLOEISTOFTANK",
			desc: "Voor deze klant hebben we maatwerk meetbuizen ten behoeve van een vloeistoftank geproduceerd.",
			image: null
		},
		{
			title: "STAALCONSTRUCTIE OFFSHORE PLATFORM",
			desc: "Complexe staalconstructie vervaardigd voor een offshore platform, volledig Lloyd's-gecertificeerd.",
			image: null
		},
		{
			title: "PIJPLEIDINGWERK PETROCHEMIE",
			desc: "Maatwerkpiping en koppelstukken geleverd voor een raffinaderij in de petrochemische sector.",
			image: null
		},
		{
			title: "TANKBOUW INDUSTRIEEL COMPLEX",
			desc: "Walsdelen, daksecties en mangaten geproduceerd voor een groot industrieel tankbouwproject.",
			image: null
		}
	],
	faq: [
		{
			q: "WIJ HEBBEN AL EEN VASTE STAALPARTNER. WAAROM ZOUDEN WE MET FERROWORKS PRATEN?",
			a: "Omdat FerroWorks zich richt op de complexe, maatwerk opdrachten die vaak buiten het profiel van een standaard staalpartner vallen. We werken snel, nauwkeurig en volledig in eigen beheer — zonder onderaannemers."
		},
		{
			q: "ZIJN JULLIE GROOT GENOEG VOOR ONZE PROJECTEN?",
			a: "Met 16 gespecialiseerde vakmensen en een volledig eigen machinepark — inclusief watersnijder 6 x 3 meter — zijn we toegerust voor complexe industriële projecten. Gecertificeerd voor de meest veeleisende opdrachtgevers."
		},
		{
			q: "WELKE CERTIFICERINGEN HEEFT FERROWORKS?",
			a: "FerroWorks is VCA-gecertificeerd en voldoet aan de EN-1090 norm voor staal- en aluminiumconstructies. We leveren volledige documentatie en kwaliteitsborging mee."
		},
		{
			q: "HOE ZEKER IS DE LEVERTIJD VAN 2 TOT 4 WEKEN?",
			a: "De levertijd van 2 tot 4 weken is een belofte, geen schatting. Doordat alles in eigen werkplaats gebeurt, hebben we volledige controle over planning en kwaliteit. Bij urgente projecten denken we graag mee."
		}
	],
	overOns: {
		verhaal: {
			title1: "GEBOUWD OP",
			title2: "VAKMANSCHAP",
			tekst1: "FerroWorks is een familiebedrijf met meer dan 15 jaar ervaring in metaalmaatwerk. We begeleiden projecten van A tot Z — van ontwerp en engineering tot productie, coating en montage op locatie.",
			tekst2: "Specialist in maatwerk staal, RVS en aluminium voor industrie, bouw & utiliteit, architectuur & design en maritieme toepassingen.",
			tekst3: "Heldere afspraken, transparante kosten en één aanspreekpunt van begin tot eind. Dat is hoe wij werken.",
			image1: null,
			image2: null
		},
		watWeDoen: {
			items: [
				"Heldere afspraken, zonder verrassingen.",
				"Totaal ontzorgen van ontwerp tot montage.",
				"Reparatie en onderhoud op locatie.",
				"Advies en ondersteuning bij ontwerp en uitvoerbaarheid.",
				"Één partner voor het volledige traject.",
				"Maakbaar, praktisch en doordacht.",
				"Transparant in kosten en planning."
			],
			image: null
		},
		andersItems: [
			{
				title: "GROOT GENOEG OM REGIE TE VOEREN",
				desc: "Wij hebben de slagkracht en expertise om technische metaalprojecten volledig te realiseren."
			},
			{
				title: "KLEIN GENOEG OM DIRECT TE SCHAKELEN",
				desc: "Direct contact, snel schakelen en meebewegen met jouw planning."
			},
			{
				title: "PERSOONLIJK GENOEG OM VOORUIT TE DENKEN",
				desc: "We adviseren, optimaliseren en zorgen dat jouw project van begin tot eind klopt."
			}
		],
		team: {
			title1: "VAKMANNEN MET",
			title2: "EÉN DOEL",
			tekst1: "Ons team bestaat uit gespecialiseerde metaalbewerkers, lassers, engineers en projectleiders. Elk met diepgaande kennis van staal, RVS en aluminium.",
			tekst2: "Wij werken nauw samen met onze klanten: van de eerste tekening tot de laatste bout op locatie. Altijd één aanspreekpunt, altijd persoonlijk.",
			items: [
				"Ruim 15 jaar ervaring in metaalmaatwerk",
				"Maakbaar, praktisch en doordacht",
				"Reparatie en onderhoud op locatie"
			],
			image1: null,
			image2: null,
			image3: null
		}
	},
	diensten: [
		{
			id: "engineering",
			nr: "01",
			title: "Engineering & Ontwerp",
			subtitle: "Van eerste schets tot goedgekeurde productietekening",
			excerpt: "Elk project begint met een goed ontwerp. Onze engineers werken met moderne CAD-software en vertalen uw wensen naar haalbare, maakbare productietekeningen.",
			checklist: "2D- en 3D-tekeningen (CAD/CAM)\nConstructieve berekeningen\nMateriaalkeuze en kostenadvies\nToetsing op maakbaarheid\nGoedkeuringsproces met de opdrachtgever",
			body: "Een goed metaalproject begint niet in de werkplaats — het begint op de tekentafel. Bij FerroWorks beschikken we over een eigen engineeringsafdeling die uw idee of specificatie omzet naar een volledig uitgewerkte, maakbare productietekening.\n\nOf u nu aankomt met een gedetailleerde constructietekening, een ruwe schets op papier of enkel een idee — wij werken het uit. We stellen gerichte vragen om uw toepassing, belasting, omgeving en eindgebruik goed te begrijpen.\n\nWerkt u met een extern constructiebedrijf of architect? Dan stemmen wij direct met hen af. We brengen de uitvoerbaarheid in vanuit de fabrikant — zodat wat op papier staat ook echt te maken is.",
			image: null
		},
		{
			id: "productie",
			nr: "02",
			title: "Productie in eigen beheer",
			subtitle: "Volledig machinepark, geen uitbesteding",
			excerpt: "In onze moderne werkplaats in Roosendaal beschikken we over een volledig machinepark voor het verwerken van staal, RVS en aluminium.",
			checklist: "Zaag- en lasersnijwerk\nBoren, frezen en knippen\nGecertificeerd lassen (MIG/MAG, TIG, WIG)\nBuigen en walsen\nPrefab-productie en maatwerk in alle series",
			body: "In onze moderne werkplaats beschikken we over een volledig machinepark. Wij besteden niets uit — alles wordt bij ons in eigen beheer geproduceerd, van de eerste zaagsnede tot de laatste lassnaad.\n\nOf het nu gaat om enkelstuks maatwerk of grotere series — FerroWorks heeft de capaciteit en expertise om uw project efficiënt en nauwkeurig te produceren.\n\nOns team van gecertificeerde lassers werkt met staal, RVS en aluminium. We beheersen alle gangbare lasmethodes: MIG/MAG, TIG en WIG.",
			image: null
		},
		{
			id: "coating",
			nr: "03",
			title: "Coating & Afwerking",
			subtitle: "Meerlaagse coatingsystemen conform ISO 12944",
			excerpt: "Een goede afwerking beschermt uw constructie en bepaalt de uitstraling. FerroWorks adviseert de juiste coatingoplossing.",
			checklist: "Stralen tot Sa2,5\nZinkrijke of epoxy grondlaag\nNatlak voor grote constructies\nPoedercoating seriematig\nRVS-polijsten\nGalvaniseren",
			body: "Een coating is meer dan een verflaag. Het is de bescherming van uw investering. FerroWorks adviseert het juiste coatingsysteem op basis van de omgeving, belasting en gewenste levensduur.\n\nWij stralen, gronden en lakken in eigen beheer. Van zinkrijke grondlagen voor offshore toepassingen tot poedercoating voor architecturale elementen — we dekken het volledige spectrum.\n\nAlle coatingsystemen worden toegepast conform ISO 12944, de internationale norm voor corrosieprotectie van staalconstructies.",
			image: null
		},
		{
			id: "montage",
			nr: "04",
			title: "Montage op locatie",
			subtitle: "Eigen gecertificeerde montageploeg",
			excerpt: "Onze montageploeg plaatst uw constructie op locatie, van eenvoudige hekwerken tot complexe staalconstructies op hoogte.",
			checklist: "Eigen montageploeg, gecertificeerd VCA\nMontage van staal, RVS en aluminium\nKraanbegeleiding en veiligheidsbeheer\nAansluitlassen en correcties op locatie\nEindinspectie en opleverdossier",
			body: "Productie is pas compleet als uw constructie op de juiste plek staat. Onze eigen montageploeg plaatst alles op locatie — van eenvoudige hekwerken tot complexe staalconstructies op hoogte.\n\nWe werken VCA-gecertificeerd en nemen alle veiligheidsmaatregelen in acht. Onze monteurs zijn opgeleid voor werken op hoogte, in besloten ruimten en op industrieterreinen.\n\nNa montage voeren we een eindcontrole uit en leveren we een volledig opleverdossier op.",
			image: null
		},
		{
			id: "reparatie",
			nr: "05",
			title: "Reparatie & Onderhoud",
			subtitle: "Snel, vakkundig, zonder lange wachttijden",
			excerpt: "Staalconstructies slijten, vervormen of beschadigen. FerroWorks voert reparaties en onderhoud uit.",
			checklist: "Lasreparaties in staal, RVS en aluminium\nHerstel van corrosieschade en coating\nStructurele versterking van bestaande constructies\nSpoedreparaties op locatie mogelijk\nOnderhoudscontracten op aanvraag",
			body: "Staalconstructies slijten, vervormen of beschadigen door gebruik, corrosie of externe invloeden. FerroWorks voert reparaties snel en vakkundig uit — in de werkplaats of op locatie.\n\nWe beoordelen de schade, adviseren de beste aanpak en lossen het op. Van kleine lasreparaties tot structurele versterkingen van bestaande constructies.\n\nHeeft u een noodgeval? Bel ons direct. Spoedreparaties op locatie zijn mogelijk.",
			image: null
		}
	],
	sectoren: [
		{
			id: "bouw",
			nr: "01",
			naam: "Bouw & Utiliteit",
			tagline: "Staalconstructies, hekwerken en prefab balkons voor de bouwsector",
			description: "Staalconstructies, standaard hekwerken en prefab balkons voor bouw- en utiliteitsprojecten.",
			intro: "In de bouw- en utiliteitssector levert FerroWorks staalconstructies die voldoen aan de strengste normen. Van draagframes tot prefab balkons — alles CE-gecertificeerd conform EN-1090.",
			items: "Staalconstructies en draagframes\nStandaard hekwerken\nPrefab balkons en bordessen\nTrappen, leuningen en vluchttrapstructuren\nGevelelementen en kozijnstaal\nCE-gecertificeerd conform EN-1090",
			image: null
		},
		{
			id: "industrie",
			nr: "02",
			naam: "Industrie",
			tagline: "Machinebouw, procesinstallaties en maatwerk staalwerk",
			description: "Machinebouw, maatwerk staalconstructies, industriële installaties en laswerkzaamheden op locatie.",
			intro: "Industriële klanten vertrouwen op FerroWorks voor maatwerk staalconstructies en procesinstallaties. We leveren snel en nauwkeurig, ook op locatie.",
			items: "Machinebouw en machineframes\nMaatwerk staalconstructies\nIndustriële installaties en procesframes\nLaswerkzaamheden op locatie\nRVS voor food- en farmaceutische industrie\nDraagstructuren en mezzanine vloeren",
			image: null
		},
		{
			id: "architectuur",
			nr: "03",
			naam: "Architectuur & Design",
			tagline: "Design trappen, sierwerk en exterieur maatwerk voor architecten",
			description: "Design trappen en interieur- en exterieur maatwerk voor architectuur- en designprojecten.",
			intro: "Architecten en designers kiezen FerroWorks voor maatwerk metaalwerk dat esthetiek en vakmanschap combineert. Van design trappen tot unieke gevelpanelen.",
			items: "Design trappen in staal en RVS\nInterieur- en exterieur maatwerk\nBalustrades en leuningwerken\nSierwerk, poorten en toegangspartijen\nGevelpanelen en bekleding\nCoating en poedercoating in elke RAL-kleur",
			image: null
		},
		{
			id: "maritiem",
			nr: "04",
			naam: "Maritiem",
			tagline: "Jachtbouw, offshore constructies en maritieme coating",
			description: "Maatwerk staal- en aluminium constructies voor jachtbouw en maritieme toepassingen.",
			intro: "Maritieme omstandigheden vereisen het beste materiaal en de beste coating. FerroWorks levert voor jachtbouw, offshore en haven­infrastructuur.",
			items: "Jachtbouw en scheepsinterieurs\nOffshore staal- en RVS-constructies\nDekuitrusting en handrelingen\nAluminium loopbruggen en vlonders\nMaritieme coating (C5-M, ISO 12944)\nReparaties in haven en aan boord",
			image: null
		}
	],
	blog: [
		{
			id: 1,
			title: "Waarom kwaliteitscontrole bij lassen het verschil maakt",
			slug: "kwaliteitscontrole-lassen",
			category: "Vakmanschap",
			date: "8 april 2026",
			readTime: "4 min",
			status: "Gepubliceerd",
			featured: true,
			excerpt: "In de metaalbewerking is lassen een van de meest kritische processen. Een kleine fout in de las kan grote gevolgen hebben voor de veiligheid en levensduur van een constructie. Ontdek hoe FerroWorks kwaliteitscontrole inzet als standaard — niet als uitzondering.",
			body: "Kwaliteitscontrole bij lassen begint niet bij de eindcontrole, maar bij elk stap in het proces. Van de keuze van het lassmateriaal tot de voorbereiding van het basismateriaal.\n\nBij FerroWorks werken we uitsluitend met gecertificeerde lassers die voldoen aan de EN-1090 norm. Iedere las wordt visueel gecontroleerd en — waar vereist — getest met NDO-methoden.\n\nEen kleine afwijking in een las kan grote gevolgen hebben bij belasting. Daarom hanteren we strenge procedures en documentatie bij elk project.",
			image: null
		},
		{
			id: 2,
			title: "Staalconstructies voor offshore: eisen en uitdagingen",
			slug: "staalconstructies-offshore",
			category: "Offshore",
			date: "1 april 2026",
			readTime: "5 min",
			status: "Gepubliceerd",
			featured: false,
			excerpt: "Offshore staalwerk staat bloot aan extreme omstandigheden: zout water, hoge druk en constante mechanische belasting. Wij leggen uit welke materialen en coatings wij inzetten voor duurzame offshore constructies.",
			body: "Offshore staalconstructies worden blootgesteld aan een van de meest agressieve omgevingen denkbaar: zout zeewater, hoge windbelasting en constante mechanische stress.\n\nFerroWorks levert offshore constructies conform NORSOK en ISO 12944 klasse C5-M. We gebruiken uitsluitend gecertificeerde materialen en coatingsystemen die bestand zijn tegen de zwaarste maritieme omstandigheden.\n\nVanaf de engineeringfase houden we rekening met corrosieprotectie, onderhoudsintervallen en toegankelijkheid op locatie.",
			image: null
		},
		{
			id: 3,
			title: "Natlak vs. poedercoating: wat past bij uw project?",
			slug: "natlak-vs-poedercoating",
			category: "Afwerking",
			date: "24 maart 2026",
			readTime: "3 min",
			status: "Gepubliceerd",
			featured: false,
			excerpt: "De keuze tussen natlak en poedercoating heeft invloed op zowel de uitstraling als de beschermingsgraad van een staalconstructie. We zetten de voor- en nadelen van beide methoden op een rij.",
			body: "Natlak en poedercoating zijn beide uitstekende afwerkingsmethoden voor staal, maar ze hebben elk hun eigen toepassingsgebied.\n\nNatlak is ideaal voor grote constructies die niet in een oven passen, voor meerlaagse coatingsystemen en voor toepassingen in agressieve omgevingen. Poedercoating is duurzamer, milieuvriendelijker en geeft een uniforme afwerking — perfect voor seriematige productie.\n\nBij FerroWorks adviseren we altijd de meest geschikte methode op basis van uw specifieke situatie.",
			image: null
		},
		{
			id: 4,
			title: "Lascertificaat verplicht? Alles wat u moet weten over EN-1090",
			slug: "en-1090-certificering",
			category: "Certificering",
			date: "17 maart 2026",
			readTime: "6 min",
			status: "Gepubliceerd",
			featured: false,
			excerpt: "Sinds de invoering van de EN-1090 norm is een lascertificaat voor veel staalconstructies verplicht. Maar wat houdt dat precies in, en wanneer is het van toepassing? FerroWorks legt het u helder uit.",
			body: "De EN-1090 norm is de Europese standaard voor de fabricage van staal- en aluminiumconstructies. Constructies die vallen onder de CE-markeringsplicht moeten door een gecertificeerde fabrikant worden geproduceerd.\n\nFerroWorks is gecertificeerd conform EN-1090-2 voor uitvoeringsklasse EXC2. Dit betekent dat onze constructies voldoen aan de strengste Europese eisen voor dragende staalconstructies.\n\nVraagt u zich af of uw project EN-1090 certificering vereist? Neem contact op — wij adviseren u graag.",
			image: null
		},
		{
			id: 5,
			title: "Van tekening tot product: zo werkt ons productieproces",
			slug: "productieproces-ferroworks",
			category: "Productie",
			date: "10 maart 2026",
			readTime: "4 min",
			status: "Gepubliceerd",
			featured: false,
			excerpt: "Hoe gaat een metaalproject van CAD-tekening naar afgewerkt product? We nemen u stap voor stap mee door het productieproces van FerroWorks: van intake en engineering tot productie, afwerking en montage.",
			body: "Elk FerroWorks project doorloopt dezelfde stappen: intake, engineering, productie, coating en montage. Door alles in eigen beheer te doen, houden we grip op kwaliteit en planning in elke fase.\n\nNa de intake en goedkeuring van tekeningen gaat het product de werkplaats in. Onze CNC-machines zorgen voor nauwkeurige zaag- en freeswerk. Daarna volgt het lassen, stralen en coaten.\n\nHet eindproduct wordt gecontroleerd, opgeslagen en door onze montageploeg op locatie geplaatst.",
			image: null
		},
		{
			id: 6,
			title: "Maatwerk staal voor de industrie: 5 veelgemaakte fouten vermeden",
			slug: "maatwerk-staal-industrie",
			category: "Industrie",
			date: "3 maart 2026",
			readTime: "5 min",
			status: "Gepubliceerd",
			featured: false,
			excerpt: "Bij industrieel staalmaatwerk gaat het soms mis — niet door slechte intenties, maar door gebrek aan kennis of slechte communicatie. We bespreken vijf veelgemaakte fouten en hoe u ze kunt voorkomen.",
			body: "Fout 1: te laat betrekken van de fabrikant. Wacht niet tot de tekening klaar is — betrek FerroWorks al vroeg in het ontwerpproces voor advies over maakbaarheid.\n\nFout 2: onvoldoende toleranties specificeren. Staal heeft toleranties. Zorg dat uw tekening haalbare toleranties vermeldt voor de gekozen productietechniek.\n\nFout 3: coating vergeten in het ontwerp. Denk al in het ontwerp na over coating: toegankelijkheid, dikte en methode bepalen mede de constructie.\n\nFout 4: geen rekening houden met montage. Een constructie die in de werkplaats perfect is, maar op locatie moeilijk te plaatsen is, kost tijd en geld.\n\nFout 5: geen duidelijke documentatie. Goede tekeningen en specificaties zijn de basis voor een succesvol project. Investeer in duidelijkheid.",
			image: null
		}
	],
	contact: {
		hero: {
			title1: "NEEM",
			title2: "CONTACT OP",
			subtitle: "Stuur uw tekening op of stel uw vraag. Wij reageren binnen 24 uur."
		},
		adres: "Havendijk 12, 4701 LH Roosendaal",
		tel: "+31 (0)165 205 617",
		email: "info@ferroworks.nl",
		openingstijden: "Ma–Vr: 07:30 – 17:00",
		mapEmbed: ""
	},
	pages: [
		{
			key: "home",
			name: "Homepage",
			path: "/",
			metaTitle: "FerroWorks – Metaalmaatwerk in Staal, RVS & Aluminium",
			metaDescription: "FerroWorks levert maatwerk metaalconstructies voor industrie, bouw en architectuur. Engineering, productie, coating en montage onder één dak.",
			heroTitle: "",
			heroSubtitle: "",
			body: "",
			isIndexed: true
		},
		{
			key: "about",
			name: "Over Ons",
			path: "/over-ons",
			metaTitle: "Over Ons | FerroWorks",
			metaDescription: "Meer over FerroWorks, onze werkwijze en vakmanschap in staal, RVS en aluminium.",
			heroTitle: "",
			heroSubtitle: "",
			body: "",
			isIndexed: true
		},
		{
			key: "services",
			name: "Diensten",
			path: "/diensten",
			metaTitle: "Diensten | FerroWorks",
			metaDescription: "Engineering, productie, coating, montage en onderhoud voor maatwerk metaalprojecten.",
			heroTitle: "",
			heroSubtitle: "",
			body: "",
			isIndexed: true
		},
		{
			key: "sectors",
			name: "Sectoren",
			path: "/sectoren",
			metaTitle: "Sectoren | FerroWorks",
			metaDescription: "Metaalmaatwerk voor bouw, industrie, architectuur en maritieme toepassingen.",
			heroTitle: "",
			heroSubtitle: "",
			body: "",
			isIndexed: true
		},
		{
			key: "blog",
			name: "Blog",
			path: "/blog",
			metaTitle: "Blog | FerroWorks",
			metaDescription: "Kennisartikelen, projectverhalen en technische inzichten van FerroWorks.",
			heroTitle: "",
			heroSubtitle: "",
			body: "",
			isIndexed: true
		},
		{
			key: "contactPage",
			name: "Contact",
			path: "/contact",
			metaTitle: "Contact | FerroWorks",
			metaDescription: "Neem contact op met FerroWorks voor advies, offerte of technische afstemming.",
			heroTitle: "NEEM CONTACT OP",
			heroSubtitle: "Stuur uw tekening op of stel uw vraag. Wij reageren binnen 24 uur.",
			body: "",
			isIndexed: true
		},
		{
			key: "privacy",
			name: "Privacy Policy",
			path: "/privacy-policy",
			metaTitle: "Privacy Policy | FerroWorks",
			metaDescription: "Lees hoe FerroWorks persoonsgegevens verwerkt en beschermt.",
			heroTitle: "PRIVACY POLICY",
			heroSubtitle: "Heldere informatie over welke gegevens wij verwerken en waarom.",
			body: "<h2>1. Wie wij zijn</h2><p>FerroWorks verwerkt persoonsgegevens in het kader van offerteaanvragen, klantcommunicatie en dienstverlening.</p><h2>2. Welke gegevens wij verzamelen</h2><p>Wij verwerken contactgegevens, bedrijfsgegevens en informatie die u actief met ons deelt via formulieren, e-mail of telefonisch contact.</p><h2>3. Waarom wij deze gegevens gebruiken</h2><p>Wij gebruiken deze gegevens om aanvragen te beantwoorden, offertes op te stellen, opdrachten uit te voeren en onze dienstverlening te verbeteren.</p><h2>4. Bewaartermijnen</h2><p>Wij bewaren persoonsgegevens niet langer dan nodig is voor het doel waarvoor ze zijn verzameld, tenzij een wettelijke bewaartermijn geldt.</p><h2>5. Uw rechten</h2><p>U kunt verzoeken om inzage, correctie of verwijdering van uw persoonsgegevens door contact op te nemen via onze contactgegevens op deze website.</p>",
			isIndexed: true
		},
		{
			key: "terms",
			name: "Algemene Voorwaarden",
			path: "/algemene-voorwaarden",
			metaTitle: "Algemene Voorwaarden | FerroWorks",
			metaDescription: "De algemene voorwaarden van FerroWorks.",
			heroTitle: "ALGEMENE VOORWAARDEN",
			heroSubtitle: "De voorwaarden die van toepassing zijn op offertes, leveringen en opdrachten.",
			body: "<h2>1. Toepasselijkheid</h2><p>Deze voorwaarden zijn van toepassing op alle offertes, overeenkomsten en leveringen van FerroWorks.</p><h2>2. Offertes en opdrachten</h2><p>Offertes zijn vrijblijvend tenzij uitdrukkelijk anders vermeld. Een opdracht komt tot stand na schriftelijke bevestiging.</p><h2>3. Levering en uitvoering</h2><p>Opgegeven levertijden zijn indicatief. FerroWorks spant zich in om afspraken zorgvuldig na te komen.</p><h2>4. Betaling</h2><p>Facturen dienen te worden voldaan binnen de overeengekomen betaaltermijn. Bij overschrijding kunnen aanvullende kosten in rekening worden gebracht.</p><h2>5. Aansprakelijkheid</h2><p>Onze aansprakelijkheid is beperkt tot directe schade en tot het bedrag dat in het betreffende geval door onze verzekering wordt gedekt of anderszins contractueel is overeengekomen.</p>",
			isIndexed: true
		}
	],
	websiteSettings: {
		robotsText: "User-agent: *\nAllow: /\nSitemap: {{siteUrl}}/sitemap.xml",
		extraHeadHtml: "",
		defaultOgImage: "",
		googleAnalyticsId: "",
		googleTagManagerId: "",
		metaPixelId: "",
		linkedInInsightTagId: ""
	}
};
//#endregion
//#region src/cms/CmsContext.jsx
var CmsContext = createContext(null);
function deepMerge(defaults, saved) {
	const result = { ...defaults };
	for (const key of Object.keys(saved || {})) if (key in defaults && typeof defaults[key] === "object" && defaults[key] !== null && !Array.isArray(defaults[key]) && typeof saved[key] === "object" && saved[key] !== null && !Array.isArray(saved[key])) result[key] = deepMerge(defaults[key], saved[key]);
	else result[key] = saved[key];
	return result;
}
function CmsProvider({ children, initialCms = null }) {
	const [cms, setCms] = useState(() => deepMerge(DEFAULT_CMS, initialCms || {}));
	const [loading, setLoading] = useState(!initialCms);
	const [error, setError] = useState("");
	const refreshCms = async () => {
		setLoading(true);
		try {
			setCms(deepMerge(DEFAULT_CMS, await api.getCms()));
			setError("");
		} catch (err) {
			setCms(DEFAULT_CMS);
			setError(err.message || "Kon CMS data niet laden.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (!initialCms) refreshCms();
	}, [initialCms]);
	const updateCms = async (key, value) => {
		try {
			await api.updateSection(key, value);
			setCms((prev) => ({
				...prev,
				[key]: value
			}));
			setError("");
			return true;
		} catch (err) {
			setError(err.message || "Opslaan mislukt.");
			return false;
		}
	};
	const resetCms = async () => {
		await refreshCms();
	};
	const value = useMemo(() => ({
		cms,
		updateCms,
		resetCms,
		refreshCms,
		loading,
		error
	}), [
		cms,
		loading,
		error
	]);
	return /* @__PURE__ */ jsx(CmsContext.Provider, {
		value,
		children
	});
}
function useCms() {
	const ctx = useContext(CmsContext);
	if (!ctx) throw new Error("useCms must be used inside <CmsProvider>");
	return ctx;
}
//#endregion
//#region src/i18n/translations.js
var SUPPORTED_LANGUAGES = [{
	code: "nl",
	label: "Nederlands"
}];
var translations = { nl: { nav: {
	overOns: "Over ons",
	diensten: "Diensten",
	sectoren: "Sectoren",
	blog: "Blog",
	contact: "Contact",
	cta: "NEEM CONTACT OP",
	brandTagline: "metaalwerk",
	menuToggle: "Menu openen"
} } };
//#endregion
//#region src/i18n/LanguageContext.jsx
var LanguageContext = createContext(null);
var DEFAULT_LANGUAGE = "nl";
function getValueByPath(obj, path) {
	return path.split(".").reduce((acc, key) => {
		if (acc && Object.prototype.hasOwnProperty.call(acc, key)) return acc[key];
	}, obj);
}
function LanguageProvider({ children }) {
	const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
	useEffect(() => {
		if (typeof document !== "undefined") document.documentElement.lang = language;
	}, [language]);
	const value = useMemo(() => {
		const t = (key, fallback = "") => {
			const found = getValueByPath(translations[language] || {}, key);
			if (typeof found === "string") return found;
			return fallback || key;
		};
		return {
			language,
			setLanguage,
			supportedLanguages: SUPPORTED_LANGUAGES,
			t
		};
	}, [language]);
	return /* @__PURE__ */ jsx(LanguageContext.Provider, {
		value,
		children
	});
}
function useLanguage() {
	const ctx = useContext(LanguageContext);
	if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
	return ctx;
}
//#endregion
//#region src/components/Navbar.jsx
var navLinks = [
	{
		key: "overOns",
		to: "/over-ons"
	},
	{
		key: "diensten",
		to: "/diensten"
	},
	{
		key: "sectoren",
		to: "/sectoren"
	},
	{
		key: "blog",
		to: "/blog"
	},
	{
		key: "contact",
		to: "/contact"
	}
];
function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const { t } = useLanguage();
	const { cms } = useCms();
	const phone = cms.site?.tel || "+31 (0)165 205 617";
	return /* @__PURE__ */ jsxs("nav", {
		className: "w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between",
			style: { height: "78px" },
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "flex items-center gap-2 shrink-0 no-underline",
					style: { maxWidth: "calc(100% - 56px)" },
					children: [/* @__PURE__ */ jsxs("svg", {
						width: "36",
						height: "36",
						viewBox: "0 0 36 36",
						fill: "none",
						xmlns: "http://www.w3.org/2000/svg",
						children: [/* @__PURE__ */ jsx("rect", {
							width: "36",
							height: "36",
							rx: "4",
							fill: "#c8d400"
						}), /* @__PURE__ */ jsx("path", {
							d: "M7 28 L11 14 L16 22 L21 14 L25 28",
							stroke: "#1a1a1a",
							strokeWidth: "2.5",
							fill: "none",
							strokeLinejoin: "round"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col leading-none",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[24px] font-black text-gray-900 tracking-tight",
								children: "FERRO"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[24px] font-black tracking-tight",
								style: { color: "#c8d400" },
								children: "WORKS"
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[13px] italic text-gray-500 font-normal",
							style: { fontFamily: "Georgia, serif" },
							children: t("nav.brandTagline", "metalwork")
						})]
					})]
				}),
				/* @__PURE__ */ jsx("ul", {
					className: "hidden lg:flex items-center gap-7 xl:gap-9 list-none flex-1 justify-center m-0 p-0",
					children: navLinks.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
						to: item.to,
						className: "text-gray-800 text-[17px] font-semibold tracking-[0.01em] no-underline hover:text-[#8ab61e] transition-colors duration-200 whitespace-nowrap",
						children: t(`nav.${item.key}`, item.key)
					}) }, item.key))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "hidden lg:flex items-center gap-5 xl:gap-6 shrink-0",
					children: [/* @__PURE__ */ jsx("a", {
						href: `tel:${phone.replace(/[\s()]/g, "")}`,
						className: "text-gray-800 text-[16px] font-medium no-underline hover:text-[#8ab61e] transition-colors duration-200 whitespace-nowrap",
						children: phone
					}), /* @__PURE__ */ jsx(Link, {
						to: "/contact",
						className: "no-underline text-white text-[14px] font-bold tracking-wide px-6 py-3 rounded-full whitespace-nowrap transition-colors duration-200",
						style: { backgroundColor: "#8ab61e" },
						onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#7aa018",
						onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "#8ab61e",
						children: t("nav.cta", "CONTACT US")
					})]
				}),
				/* @__PURE__ */ jsxs("button", {
					className: "site-menu-button lg:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 bg-transparent border-none cursor-pointer p-0",
					onClick: () => setMenuOpen(!menuOpen),
					"aria-label": t("nav.menuToggle", "Toggle menu"),
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "block w-6 h-0.5 bg-gray-800 transition-all duration-300",
							style: { transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none" }
						}),
						/* @__PURE__ */ jsx("span", {
							className: "block w-6 h-0.5 bg-gray-800 transition-all duration-300",
							style: { opacity: menuOpen ? 0 : 1 }
						}),
						/* @__PURE__ */ jsx("span", {
							className: "block w-6 h-0.5 bg-gray-800 transition-all duration-300",
							style: { transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }
						})
					]
				})
			]
		}), menuOpen && /* @__PURE__ */ jsxs("div", {
			className: "lg:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4",
			children: [
				navLinks.map((item) => /* @__PURE__ */ jsx(Link, {
					to: item.to,
					className: "text-gray-800 text-[18px] font-semibold no-underline py-3 border-b border-gray-100",
					onClick: () => setMenuOpen(false),
					children: t(`nav.${item.key}`, item.key)
				}, item.key)),
				/* @__PURE__ */ jsx("a", {
					href: `tel:${phone.replace(/[\s()]/g, "")}`,
					className: "text-gray-800 text-[16px] font-medium no-underline py-3",
					children: phone
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/contact",
					className: "no-underline text-white text-[14px] font-bold tracking-wide px-6 py-3 rounded-full text-center",
					style: { backgroundColor: "#8ab61e" },
					onClick: () => setMenuOpen(false),
					children: t("nav.cta", "CONTACT US")
				})
			]
		})]
	});
}
//#endregion
//#region src/assets/hero-background.jpeg
var hero_background_default = "/assets/hero-background-a4nmQpHQ.jpeg";
//#endregion
//#region src/components/HeroBanner.jsx
function HeroBanner() {
	const { cms } = useCms();
	const hero = cms.hero || {};
	return /* @__PURE__ */ jsxs("section", {
		className: "home-hero",
		style: {
			position: "relative",
			width: "100%",
			minHeight: "calc(100vh - 72px)",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			backgroundColor: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "hero-bg",
				style: {
					position: "absolute",
					inset: 0,
					backgroundImage: `url(${hero.image || "/assets/hero-background-a4nmQpHQ.jpeg"})`,
					backgroundSize: "cover",
					backgroundPosition: "center right",
					backgroundRepeat: "no-repeat"
				}
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 md:hidden",
				style: { background: "rgba(20,22,22,0.82)" }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 hidden md:block",
				style: { background: "linear-gradient(90deg, rgba(20,22,22,0.88) 0%, rgba(20,22,22,0.80) 30%, rgba(20,22,22,0.55) 55%, rgba(20,22,22,0.15) 80%, rgba(20,22,22,0.0) 100%)" }
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "60px",
					paddingBottom: "60px"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "hidden md:block",
						style: {
							position: "absolute",
							top: "0px",
							right: "32px"
						},
						children: /* @__PURE__ */ jsxs("svg", {
							width: "96",
							height: "108",
							viewBox: "0 0 102 115",
							fill: "none",
							xmlns: "http://www.w3.org/2000/svg",
							children: [
								/* @__PURE__ */ jsx("path", {
									d: "M13 13H56V28H28V87H13V13Z",
									stroke: "#C8D400",
									strokeWidth: "7"
								}),
								/* @__PURE__ */ jsx("path", {
									d: "M89 102H46V87H74V28H89V102Z",
									stroke: "#C8D400",
									strokeWidth: "7"
								}),
								/* @__PURE__ */ jsx("path", {
									d: "M28 28H46V68H56V28H74",
									stroke: "#C8D400",
									strokeWidth: "7",
									fill: "none"
								})
							]
						})
					}),
					/* @__PURE__ */ jsx("h1", {
						style: {
							margin: 0,
							padding: 0,
							color: "#C8D400",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "clamp(30px, 3.2vw, 52px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase",
							fontWeight: 900
						},
						children: hero.line1
					}),
					/* @__PURE__ */ jsx("h2", {
						style: {
							margin: 0,
							padding: 0,
							color: "#F3F3F3",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "clamp(30px, 3.2vw, 52px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase",
							fontWeight: 900
						},
						children: hero.line2
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							marginTop: "32px",
							marginBottom: "32px",
							color: "#E0E0E0",
							fontSize: "15px",
							lineHeight: 1.65,
							fontWeight: 400,
							maxWidth: "480px"
						},
						children: hero.subtitle.split("\n").map((line, i) => /* @__PURE__ */ jsxs("span", { children: [line, i < hero.subtitle.split("\n").length - 1 && /* @__PURE__ */ jsx("br", {})] }, i))
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "100%",
						height: "1px",
						backgroundColor: "rgba(255,255,255,0.18)",
						marginBottom: "22px"
					} }),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 md:grid-cols-4 hero-checks",
						style: {
							gap: "12px",
							marginBottom: "42px"
						},
						children: (hero.checkItems || []).map((text, i) => /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "flex-start",
								gap: "10px"
							},
							children: [/* @__PURE__ */ jsx("svg", {
								width: "13",
								height: "13",
								viewBox: "0 0 16 16",
								fill: "none",
								style: {
									flexShrink: 0,
									marginTop: "2px"
								},
								children: /* @__PURE__ */ jsx("path", {
									d: "M2 8.5L6 12.5L14 4.5",
									stroke: "#C8D400",
									strokeWidth: "2.6",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							}), /* @__PURE__ */ jsx("span", {
								style: {
									color: "#D8D8D8",
									fontSize: "13px",
									lineHeight: 1.45,
									fontWeight: 400
								},
								children: text
							})]
						}, i))
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							display: "inline-block",
							textDecoration: "none",
							backgroundColor: "#C8D400",
							color: "#1a1a1a",
							borderRadius: "999px",
							padding: "15px 32px",
							fontSize: "13px",
							fontWeight: 900,
							textTransform: "uppercase",
							fontFamily: "Arial Black, Arial, sans-serif",
							letterSpacing: "1px",
							transition: "background-color 0.2s"
						},
						onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#b3be00",
						onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "#C8D400",
						children: hero.cta
					})
				]
			})
		]
	});
}
//#endregion
//#region src/assets/over-ons2.png
var over_ons2_default = "/assets/over-ons2-Cfi8JRv3.png";
//#endregion
//#region src/assets/over-ons3.png
var over_ons3_default = "/assets/over-ons3-B7TQ4OxP.png";
//#endregion
//#region src/components/WatFernaSection.jsx
var bulletItems = [
	"Heldere afspraken, zonder verrassingen.",
	"Totaal ontzorgen van ontwerp tot montage.",
	"Reparatie en onderhoud op locatie.",
	"Advies en ondersteuning bij ontwerp en uitvoerbaarheid.",
	"Eén partner voor het volledige traject.",
	"Maakbaar, praktisch en doordacht.",
	"Transparant in kosten en planning."
];
function WatFernaSection() {
	const { cms } = useCms();
	const wf = cms.watFerna || {};
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .1 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		ref,
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: [
			/* @__PURE__ */ jsx("style", { children: `
        .wf-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s ease, transform .65s ease; }
        .wf-img1  { opacity:0; transform:translateY(-24px); transition: opacity .65s .2s ease, transform .65s .2s ease; }
        .wf-img2  { opacity:0; transform:translateY(24px);  transition: opacity .65s .4s ease, transform .65s .4s ease; }
        .wf-sq    { opacity:0; transform:scale(0.4);        transition: opacity .5s .55s ease, transform .5s .55s ease; }
        .wf-on .wf-left,
        .wf-on .wf-img1,
        .wf-on .wf-img2,
        .wf-on .wf-sq { opacity:1; transform:none; }
      ` }),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-6 md:px-8 wf-grid " + (vis ? "wf-on" : ""),
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1.4fr",
					gap: "72px",
					alignItems: "start"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					className: "wf-left",
					children: [/* @__PURE__ */ jsxs("h2", {
						style: {
							margin: "0 0 24px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(20px,2.2vw,28px)",
							lineHeight: 1.1,
							textTransform: "uppercase",
							letterSpacing: "-0.2px"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								style: { color: "#c8d400" },
								children: wf.title1
							}),
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", {
								style: { color: "#1c1c1c" },
								children: wf.title2
							})
						]
					}), /* @__PURE__ */ jsx("ul", {
						style: {
							listStyle: "none",
							margin: 0,
							padding: 0,
							display: "flex",
							flexDirection: "column",
							gap: "13px"
						},
						children: (wf.bulletItems || bulletItems).map((item, i) => /* @__PURE__ */ jsxs("li", {
							style: {
								display: "flex",
								alignItems: "flex-start",
								gap: "9px"
							},
							children: [/* @__PURE__ */ jsx("span", { style: {
								width: "5px",
								height: "5px",
								borderRadius: "50%",
								background: "#555",
								marginTop: "7px",
								flexShrink: 0
							} }), /* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "15px",
									lineHeight: 1.6
								},
								children: item
							})]
						}, i))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "wf-visual",
					style: {
						position: "relative",
						height: "360px"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "wf-sq",
							style: {
								position: "absolute",
								bottom: 0,
								right: 0,
								width: "90px",
								height: "90px",
								background: "#c8d400",
								zIndex: 1
							}
						}),
						/* @__PURE__ */ jsx("div", {
							className: "wf-img1",
							style: {
								position: "absolute",
								top: 0,
								left: 0,
								width: "67%",
								height: "72%",
								overflow: "hidden",
								zIndex: 2,
								boxShadow: "0 2px 16px rgba(0,0,0,0.13)"
							},
							children: /* @__PURE__ */ jsx("img", {
								src: wf.image1 || "/assets/over-ons2-Cfi8JRv3.png",
								alt: "Ferna werkplaats",
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover",
									display: "block"
								}
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "wf-img2",
							style: {
								position: "absolute",
								bottom: 0,
								right: "36px",
								width: "42%",
								height: "68%",
								overflow: "hidden",
								zIndex: 3,
								boxShadow: "0 2px 16px rgba(0,0,0,0.16)"
							},
							children: /* @__PURE__ */ jsx("img", {
								src: wf.image2 || "/assets/over-ons3-B7TQ4OxP.png",
								alt: "Ferna medewerker",
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover",
									objectPosition: "top",
									display: "block"
								}
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .wf-grid { grid-template-columns: 1fr !important; gap: 42px !important; }
        }
      ` })
		]
	});
}
//#endregion
//#region src/components/ClientLogosSection.jsx
var logos = [
	{
		src: "/assets/volkerwessels-logo-DyhTrYGo.svg",
		alt: "VolkerWessels"
	},
	{
		src: "/assets/polytec-logo-gNLn9cuF.png",
		alt: "Polytec"
	},
	{
		src: "/assets/logo_verwater_jubileum-CF5Foz1h.svg",
		alt: "Verwater"
	},
	{
		src: "/assets/logo-de-kok-staalbouw-BTTth3jB.svg",
		alt: "De Kok Staalbouw"
	},
	{
		src: "/assets/ivens-logo-B1kdlLqy.png",
		alt: "Ivens"
	},
	{
		src: "/assets/actemium-vector-logo-qqk0EJat.svg",
		alt: "Actemium"
	}
];
function ClientLogosSection() {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			borderTop: "1px solid #e8e8e8",
			borderBottom: "1px solid #e8e8e8",
			padding: "36px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
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
      ` }), /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			style: { overflow: "hidden" },
			children: /* @__PURE__ */ jsxs("div", {
				className: "logo-track",
				children: [logos.map((logo, i) => /* @__PURE__ */ jsx("div", {
					className: "logo-item",
					children: /* @__PURE__ */ jsx("img", {
						src: logo.src,
						alt: logo.alt
					})
				}, `a-${i}`)), logos.map((logo, i) => /* @__PURE__ */ jsx("div", {
					className: "logo-item",
					children: /* @__PURE__ */ jsx("img", {
						src: logo.src,
						alt: logo.alt
					})
				}, `b-${i}`))]
			})
		})]
	});
}
//#endregion
//#region src/assets/over-ons1.png
var over_ons1_default = "/assets/over-ons1-DD0I2h8C.png";
//#endregion
//#region src/components/WatOnsAndersMaakt.jsx
var defaultItems = [
	{
		title: "GROOT GENOEG OM REGIE TE VOEREN",
		desc: "Wij hebben de slagkracht en expertise om technische metaalprojecten volledig te realiseren."
	},
	{
		title: "KLEIN GENOEG OM DIRECT TE SCHAKELEN",
		desc: "Direct contact, snel schakelen en meebewegen met jouw planning."
	},
	{
		title: "PERSOONLIJK GENOEG OM VOORUIT TE DENKEN",
		desc: "We adviseren, optimaliseren en zorgen dat jouw project van begin tot eind klopt."
	}
];
function CheckIcon$3() {
	return /* @__PURE__ */ jsx("svg", {
		width: "22",
		height: "22",
		viewBox: "0 0 22 22",
		fill: "none",
		style: {
			flexShrink: 0,
			marginTop: "3px"
		},
		children: /* @__PURE__ */ jsx("polyline", {
			points: "3,11 9,17 20,5",
			stroke: "#c8d400",
			strokeWidth: "2.8",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function WatOnsAndersMaakt() {
	const { cms } = useCms();
	const items = cms.anders && cms.anders.items || defaultItems;
	const andersImage = cms.anders && cms.anders.image || null;
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .1 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			padding: "80px 0"
		},
		children: [
			/* @__PURE__ */ jsx("style", { children: `
        .woa-left  { opacity:0; transform:translateX(-32px); transition: opacity .6s ease, transform .6s ease; }
        .woa-right { opacity:0; transform:translateX(32px);  transition: opacity .6s .2s ease, transform .6s .2s ease; }
        .woa-sq    { opacity:0; transform:scale(0.4);        transition: opacity .5s .45s ease, transform .5s .45s ease; }
        .woa-on .woa-left,
        .woa-on .woa-right,
        .woa-on .woa-sq { opacity:1; transform:none; }
      ` }),
			/* @__PURE__ */ jsxs("div", {
				ref,
				className: "max-w-7xl mx-auto px-6 md:px-8 woa-grid " + (vis ? "woa-on" : ""),
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "80px",
					alignItems: "center"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					className: "woa-left",
					children: [/* @__PURE__ */ jsx("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.4vw, 32px)",
							textTransform: "uppercase",
							color: "#1c1c1c",
							margin: "0 0 40px 0",
							lineHeight: 1.1,
							letterSpacing: "-0.3px"
						},
						children: "WAT ONS ANDERS MAAKT"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "36px"
						},
						children: items.map((item, i) => /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "14px",
								alignItems: "flex-start"
							},
							children: [/* @__PURE__ */ jsx(CheckIcon$3, {}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "13.5px",
									textTransform: "uppercase",
									color: "#1c1c1c",
									margin: "0 0 10px 0",
									lineHeight: 1.3,
									letterSpacing: "0.2px"
								},
								children: item.title
							}), /* @__PURE__ */ jsx("p", {
								style: {
									fontSize: "14.5px",
									color: "#555",
									margin: 0,
									lineHeight: 1.65
								},
								children: item.desc
							})] })]
						}, i))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "woa-right",
					style: { position: "relative" },
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							position: "relative",
							zIndex: 2,
							lineHeight: 0
						},
						children: /* @__PURE__ */ jsx("img", {
							src: andersImage || "/assets/over-ons1-DD0I2h8C.png",
							alt: "Ferna machinepark",
							style: {
								width: "100%",
								height: "440px",
								objectFit: "cover",
								objectPosition: "center",
								display: "block"
							},
							className: "woa-image"
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "woa-sq",
						style: {
							position: "absolute",
							bottom: "-24px",
							right: "-24px",
							width: "80px",
							height: "80px",
							background: "#c8d400",
							zIndex: 1
						}
					})]
				})]
			}),
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .woa-grid { grid-template-columns: 1fr !important; gap: 42px !important; }
        }
      ` })
		]
	});
}
//#endregion
//#region src/components/StatsSection.jsx
function StatItem({ number, desc, delay }) {
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			gap: "10px",
			flex: 1
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				position: "relative",
				padding: "8px 12px"
			},
			children: [
				/* @__PURE__ */ jsx("span", { style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "12px",
					height: "12px",
					borderTop: "2.5px solid #c8d400",
					borderLeft: "2.5px solid #c8d400"
				} }),
				/* @__PURE__ */ jsx("span", { style: {
					position: "absolute",
					bottom: 0,
					right: 0,
					width: "12px",
					height: "12px",
					borderBottom: "2.5px solid #c8d400",
					borderRight: "2.5px solid #c8d400"
				} }),
				/* @__PURE__ */ jsx("span", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(26px, 3vw, 38px)",
						color: "#1c1c1c",
						lineHeight: 1,
						letterSpacing: "-0.5px"
					},
					children: number
				})
			]
		}), /* @__PURE__ */ jsx("p", {
			style: {
				fontSize: "13px",
				color: "#555",
				margin: 0,
				lineHeight: 1.5,
				maxWidth: "140px"
			},
			children: desc
		})]
	});
}
function StatsSection() {
	const { cms } = useCms();
	const stats = cms.stats || [];
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .15 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "52px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .ss-item {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity .5s ease, transform .5s ease;
        }
        .ss-item:nth-child(1) { transition-delay: 0s; }
        .ss-item:nth-child(2) { transition-delay: 0.12s; }
        .ss-item:nth-child(3) { transition-delay: 0.24s; }
        .ss-item:nth-child(4) { transition-delay: 0.36s; }
        .ss-on .ss-item { opacity: 1; transform: none; }

        @media (max-width: 640px) {
          .ss-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
        }
      ` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 ss-grid " + (vis ? "ss-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(4, 1fr)",
				gap: "48px",
				alignItems: "start"
			},
			children: stats.map((s, i) => /* @__PURE__ */ jsx("div", {
				className: "ss-item",
				children: /* @__PURE__ */ jsx(StatItem, {
					number: s.number,
					desc: s.desc
				})
			}, i))
		})]
	});
}
//#endregion
//#region src/components/OnzeSectorenSection.jsx
var sectorItems = [
	{
		title: "BOUW &\nUTILITEIT",
		description: "Staalconstructies, standaard hekwerken en prefab balkons voor bouw- en utiliteitsprojecten.",
		icon: /* @__PURE__ */ jsxs("svg", {
			width: "54",
			height: "54",
			viewBox: "0 0 54 54",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: "text-[#2f2f2f]",
			children: [
				/* @__PURE__ */ jsx("rect", {
					x: "10",
					y: "24",
					width: "14",
					height: "20",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ jsx("rect", {
					x: "30",
					y: "16",
					width: "14",
					height: "28",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M8 44H46",
					stroke: "currentColor",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M14 37H20M14 32H20",
					stroke: "currentColor",
					strokeWidth: "1.8",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M34 37H40M34 32H40M34 27H40M34 22H40",
					stroke: "currentColor",
					strokeWidth: "1.8",
					strokeLinecap: "round"
				})
			]
		})
	},
	{
		title: "INDUSTRIE",
		description: "Machinebouw, maatwerk staalconstructies, industriële installaties en laswerkzaamheden op locatie.",
		icon: /* @__PURE__ */ jsxs("svg", {
			width: "54",
			height: "54",
			viewBox: "0 0 54 54",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: "text-[#2f2f2f]",
			children: [
				/* @__PURE__ */ jsx("circle", {
					cx: "27",
					cy: "27",
					r: "7",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M27 11V16M27 38V43M11 27H16M38 27H43",
					stroke: "currentColor",
					strokeWidth: "2.5",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M15.9 15.9L19.4 19.4M34.6 34.6L38.1 38.1M38.1 15.9L34.6 19.4M19.4 34.6L15.9 38.1",
					stroke: "currentColor",
					strokeWidth: "2.5",
					strokeLinecap: "round"
				})
			]
		})
	},
	{
		title: "ARCHITECTUUR\n& DESIGN",
		description: "Design trappen en interieur- en exterieur maatwerk voor architectuur- en designprojecten.",
		icon: /* @__PURE__ */ jsxs("svg", {
			width: "54",
			height: "54",
			viewBox: "0 0 54 54",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: "text-[#2f2f2f]",
			children: [/* @__PURE__ */ jsx("path", {
				d: "M10 44H44",
				stroke: "currentColor",
				strokeWidth: "2.2",
				strokeLinecap: "round"
			}), /* @__PURE__ */ jsx("path", {
				d: "M10 44V38H20V32H30V26H40V14",
				stroke: "currentColor",
				strokeWidth: "2.2",
				strokeLinejoin: "miter",
				strokeLinecap: "round"
			})]
		})
	},
	{
		title: "MARITIEM",
		description: "Maatwerk staal- en aluminium constructies voor jachtbouw en maritieme toepassingen.",
		icon: /* @__PURE__ */ jsxs("svg", {
			width: "54",
			height: "54",
			viewBox: "0 0 54 54",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: "text-[#2f2f2f]",
			children: [
				/* @__PURE__ */ jsx("circle", {
					cx: "27",
					cy: "14",
					r: "3.5",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M27 17.5V43",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M20 25H34",
					stroke: "currentColor",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M16 43C16 37 21 32.5 27 32.5C33 32.5 38 37 38 43",
					stroke: "currentColor",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				})
			]
		})
	}
];
function SectorCard({ item }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "home-sector-card bg-[#f6f6f6] shadow-[0_18px_34px_rgba(0,0,0,0.06)] flex flex-col",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "home-sector-icon",
				children: item.icon
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "home-sector-title text-[#333333] font-black uppercase whitespace-pre-line leading-[1.08] tracking-[-0.6px]",
				style: { fontFamily: "Arial Black, Arial, sans-serif" },
				children: item.title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "home-sector-desc text-[#7b7b7b] font-medium",
				children: item.description
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/contact",
				className: "home-sector-link mt-auto inline-block text-[#9ca600] font-black uppercase tracking-[-0.2px]",
				style: { fontFamily: "Arial Black, Arial, sans-serif" },
				children: "LEES MEER"
			})
		]
	});
}
function OnzeSectoren() {
	const { cms } = useCms();
	const mergedItems = sectorItems.map((item, i) => ({
		...item,
		title: cms.sectoren && cms.sectoren[i] ? cms.sectoren[i].naam.replace(" & ", " &\n") : item.title,
		description: cms.sectoren && cms.sectoren[i] ? cms.sectoren[i].description : item.description
	}));
	return /* @__PURE__ */ jsxs("section", {
		className: "w-full bg-[#f3f3f3] pt-[48px] pb-[100px]",
		children: [/* @__PURE__ */ jsx("style", { children: `
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
          background: #c8d400;
          opacity: .14;
          transform: translate(16px, -16px);
        }

        .home-sector-card:hover {
          transform: translateY(-4px);
          border-color: #c8d400;
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
            border-top-color: #c8d400;
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
            color: #7f8900;
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
      ` }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-[1200px] mx-auto px-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-[44px]",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-[#333333] uppercase font-black text-[34px] leading-none tracking-[-0.8px] mb-[16px]",
						style: { fontFamily: "Arial Black, Arial, sans-serif" },
						children: "ONZE SECTOREN"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[#6f6f6f] uppercase font-black text-[16px] tracking-[-0.2px]",
						style: { fontFamily: "Arial Black, Arial, sans-serif" },
						children: "MAATWERK VOOR ELKE SECTOR"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "home-sector-grid",
					children: mergedItems.map((item, index) => /* @__PURE__ */ jsx(SectorCard, { item }, index))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/contact",
						className: "inline-flex items-center justify-center min-w-[188px] h-[52px] rounded-full bg-[#b4bf00] text-white uppercase font-black text-[14px] px-8 hover:opacity-95 transition",
						style: { fontFamily: "Arial Black, Arial, sans-serif" },
						children: "NEEM CONTACT OP"
					})
				})
			]
		})]
	});
}
//#endregion
//#region src/assets/about/about-us1.jpeg
var about_us1_default = "/assets/about-us1-Fdlmxb8O.jpeg";
//#endregion
//#region src/assets/about/about-us2.jpeg
var about_us2_default = "/assets/about-us2-Dd2z2xke.jpeg";
//#endregion
//#region src/assets/about/about-us3.jpeg
var about_us3_default = "/assets/about-us3-De6QPg3_.jpeg";
//#endregion
//#region src/components/UwProjectSection.jsx
function UwProjectSection() {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .1 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f7f7f7",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .up-img1 { opacity:0; transform:translateX(-28px); transition: opacity .6s ease, transform .6s ease; }
        .up-img2 { opacity:0; transform:translateY(-20px); transition: opacity .6s .15s ease, transform .6s .15s ease; }
        .up-img3 { opacity:0; transform:translateY(28px);  transition: opacity .6s .3s ease, transform .6s .3s ease; }
        .up-sq   { opacity:0; transform:scale(0.4);        transition: opacity .5s .45s ease, transform .5s .45s ease; }
        .up-right { opacity:0; transform:translateX(32px); transition: opacity .65s .1s ease, transform .65s .1s ease; }
        .up-on .up-img1,
        .up-on .up-img2,
        .up-on .up-img3,
        .up-on .up-sq,
        .up-on .up-right { opacity:1; transform:none; }

        @media (max-width: 768px) {
          .up-grid { grid-template-columns: 1fr !important; }
          .up-photos { height: 380px !important; }
        }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 up-grid " + (vis ? "up-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "80px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "up-photos",
				style: {
					position: "relative",
					height: "500px"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "up-sq",
						style: {
							position: "absolute",
							bottom: "0",
							left: "8%",
							width: "88px",
							height: "88px",
							background: "#c8d400",
							zIndex: 1
						}
					}),
					/* @__PURE__ */ jsx("div", {
						className: "up-img1",
						style: {
							position: "absolute",
							top: "60px",
							left: "0",
							width: "44%",
							height: "68%",
							overflow: "hidden",
							zIndex: 2,
							boxShadow: "0 4px 18px rgba(0,0,0,0.13)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: about_us2_default,
							alt: "Ferna medewerker",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "top",
								display: "block"
							}
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "up-img2",
						style: {
							position: "absolute",
							top: "0",
							left: "36%",
							width: "30%",
							height: "30%",
							overflow: "hidden",
							zIndex: 3,
							boxShadow: "0 4px 18px rgba(0,0,0,0.13)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: about_us1_default,
							alt: "Ferna werkplaats",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "center",
								display: "block"
							}
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "up-img3",
						style: {
							position: "absolute",
							bottom: "0",
							right: "0",
							width: "56%",
							height: "62%",
							overflow: "hidden",
							zIndex: 4,
							boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: about_us3_default,
							alt: "Ferna directie",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "top",
								display: "block"
							}
						})
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "up-right",
				children: [
					/* @__PURE__ */ jsxs("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(24px, 2.8vw, 38px)",
							lineHeight: 1.1,
							margin: "0 0 28px 0",
							letterSpacing: "-0.3px"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#c8d400" },
							children: "UW PROJECT IN "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#1c1c1c" },
							children: "GOEDE HANDEN"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							fontSize: "15px",
							color: "#555",
							lineHeight: 1.7,
							margin: "0 0 20px 0"
						},
						children: "FerroWorks is opgericht als familiebedrijf en werkt nog steeds zo. Korte lijnen, persoonlijke betrokkenheid, één partner voor het volledige traject."
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							fontSize: "15px",
							color: "#555",
							lineHeight: 1.7,
							margin: "0 0 36px 0"
						},
						children: "Van ontwerp en engineering tot productie, coating en montage op locatie. Specialist in maatwerk staal, RVS en aluminium projecten voor industrie, bouw, architectuur en maritiem."
					}),
					/* @__PURE__ */ jsx("a", {
						href: "/contact",
						style: {
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
							transition: "background 0.2s"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "#7aa318",
						onMouseLeave: (e) => e.currentTarget.style.background = "#8ab61e",
						children: "NEEM CONTACT OP"
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/assets/past work/Afwerking-staalconstructie-met-natlak-300x225.webp
var Afwerking_staalconstructie_met_natlak_300x225_default = "/assets/Afwerking-staalconstructie-met-natlak-300x225-6cndE0Eo.webp";
//#endregion
//#region src/assets/past work/kwaliteitscontrole-lassen-featured-300x225.webp
var kwaliteitscontrole_lassen_featured_300x225_default = "/assets/kwaliteitscontrole-lassen-featured-300x225-Cwe_r9KD.webp";
//#endregion
//#region src/assets/past work/lascertificaat-verplicht-featured-300x158.webp
var lascertificaat_verplicht_featured_300x158_default = "/assets/lascertificaat-verplicht-featured-300x158-CWiBZQqV.webp";
//#endregion
//#region src/assets/past work/Offshore-constructie-300x190.webp
var Offshore_constructie_300x190_default = "/assets/Offshore-constructie-300x190-DmuHP4xB.webp";
//#endregion
//#region src/components/ProjectenSlider.jsx
var FALLBACK_IMAGES$3 = [
	Afwerking_staalconstructie_met_natlak_300x225_default,
	kwaliteitscontrole_lassen_featured_300x225_default,
	lascertificaat_verplicht_featured_300x158_default,
	Offshore_constructie_300x190_default
];
var defaultSlides = [
	{
		title: "MEETBUIZEN T.B.V. VLOEISTOFTANK",
		desc: "Voor deze klant hebben we maatwerk meetbuizen ten behoeve van een vloeistoftank geproduceerd.",
		image: null
	},
	{
		title: "STAALCONSTRUCTIE OFFSHORE PLATFORM",
		desc: "Complexe staalconstructie vervaardigd voor een offshore platform, volledig Lloyd's-gecertificeerd.",
		image: null
	},
	{
		title: "PIJPLEIDINGWERK PETROCHEMIE",
		desc: "Maatwerkpiping en koppelstukken geleverd voor een raffinaderij in de petrochemische sector.",
		image: null
	},
	{
		title: "TANKBOUW INDUSTRIEEL COMPLEX",
		desc: "Walsdelen, daksecties en mangaten geproduceerd voor een groot industrieel tankbouwproject.",
		image: null
	}
];
function ProjectenSlider() {
	const { cms } = useCms();
	const slides = cms.projecten && cms.projecten.length ? cms.projecten : defaultSlides;
	const [current, setCurrent] = useState(0);
	const [animating, setAnimating] = useState(false);
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .1 });
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
	const slideImg = slide.image || FALLBACK_IMAGES$3[Math.min(current, FALLBACK_IMAGES$3.length - 1)] || FALLBACK_IMAGES$3[0];
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#efefef",
			padding: "72px 0 64px"
		},
		children: [
			/* @__PURE__ */ jsx("style", { children: `
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
      ` }),
			/* @__PURE__ */ jsxs("div", {
				ref,
				className: "max-w-7xl mx-auto px-6 md:px-8 ps-wrap " + (vis ? "ps-vis" : ""),
				children: [
					/* @__PURE__ */ jsxs("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(20px, 2.4vw, 30px)",
							textTransform: "uppercase",
							margin: "0 0 40px 0",
							letterSpacing: "-0.3px",
							textAlign: "center"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#c8d400" },
							children: "PROJECTEN "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#1c1c1c" },
							children: "UIT HET VERLEDEN"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ps-row",
						style: {
							display: "flex",
							alignItems: "center",
							gap: "16px"
						},
						children: [
							/* @__PURE__ */ jsx("button", {
								className: "ps-arrow",
								onClick: prev,
								"aria-label": "Vorige",
								children: /* @__PURE__ */ jsx("svg", {
									width: "16",
									height: "16",
									viewBox: "0 0 16 16",
									fill: "none",
									children: /* @__PURE__ */ jsx("polyline", {
										points: "10,2 4,8 10,14",
										stroke: "#555",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "ps-slide" + (animating ? " fade" : ""),
								style: {
									flex: 1,
									background: "#fff",
									display: "grid",
									gridTemplateColumns: "1.1fr 1fr",
									minHeight: "260px",
									overflow: "hidden"
								},
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										overflow: "hidden",
										lineHeight: 0
									},
									children: /* @__PURE__ */ jsx("img", {
										src: slideImg,
										alt: slide.title,
										style: {
											width: "100%",
											height: "100%",
											objectFit: "cover",
											display: "block",
											minHeight: "240px"
										}
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "ps-copy",
									style: {
										padding: "36px 36px",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center"
									},
									children: [/* @__PURE__ */ jsx("h3", {
										style: {
											fontFamily: "Arial Black, Arial, sans-serif",
											fontWeight: 900,
											fontSize: "clamp(15px, 1.5vw, 18px)",
											textTransform: "uppercase",
											color: "#1c1c1c",
											margin: "0 0 16px 0",
											lineHeight: 1.2,
											letterSpacing: "0.1px"
										},
										children: slide.title
									}), /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "14px",
											color: "#666",
											lineHeight: 1.7,
											margin: 0
										},
										children: slide.desc
									})]
								})]
							}),
							/* @__PURE__ */ jsx("button", {
								className: "ps-arrow",
								onClick: next,
								"aria-label": "Volgende",
								children: /* @__PURE__ */ jsx("svg", {
									width: "16",
									height: "16",
									viewBox: "0 0 16 16",
									fill: "none",
									children: /* @__PURE__ */ jsx("polyline", {
										points: "6,2 12,8 6,14",
										stroke: "#555",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})
								})
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							justifyContent: "center",
							gap: "8px",
							marginTop: "24px"
						},
						children: slides.map((_, i) => /* @__PURE__ */ jsx("button", {
							className: "ps-dot",
							onClick: () => goTo(i),
							"aria-label": `Slide ${i + 1}`,
							style: { background: i === current ? "#c8d400" : "#bbb" }
						}, i))
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							textAlign: "center",
							marginTop: "36px"
						},
						children: /* @__PURE__ */ jsx("a", {
							href: "/contact",
							style: {
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
								transition: "background 0.2s"
							},
							onMouseEnter: (e) => e.currentTarget.style.background = "#7aa318",
							onMouseLeave: (e) => e.currentTarget.style.background = "#8ab61e",
							children: "NEEM CONTACT OP"
						})
					})
				]
			}),
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 640px) {
          .ps-slide { grid-template-columns: 1fr !important; }
        }
      ` })
		]
	});
}
//#endregion
//#region src/components/FaqSection.jsx
function FaqItem({ q, a }) {
	const [open, setOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		style: {
			background: "#fff",
			marginBottom: "12px",
			borderRadius: "2px",
			overflow: "hidden",
			boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
		},
		children: [/* @__PURE__ */ jsxs("button", {
			onClick: () => setOpen((v) => !v),
			style: {
				width: "100%",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "22px 28px",
				background: open ? "#c8d400" : "none",
				border: "none",
				cursor: "pointer",
				textAlign: "left",
				gap: "24px",
				transition: "background 0.25s ease"
			},
			children: [/* @__PURE__ */ jsx("span", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontWeight: 900,
					fontSize: "13.5px",
					textTransform: "uppercase",
					color: "#1c1c1c",
					letterSpacing: "0.1px",
					lineHeight: 1.3
				},
				children: q
			}), /* @__PURE__ */ jsx("span", {
				style: {
					flexShrink: 0,
					width: "22px",
					height: "22px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					transition: "transform 0.3s ease",
					transform: open ? "rotate(45deg)" : "rotate(0deg)"
				},
				children: /* @__PURE__ */ jsxs("svg", {
					width: "18",
					height: "18",
					viewBox: "0 0 18 18",
					fill: "none",
					children: [/* @__PURE__ */ jsx("line", {
						x1: "9",
						y1: "2",
						x2: "9",
						y2: "16",
						stroke: open ? "#1c1c1c" : "#aaa",
						strokeWidth: "1.8",
						strokeLinecap: "round"
					}), /* @__PURE__ */ jsx("line", {
						x1: "2",
						y1: "9",
						x2: "16",
						y2: "9",
						stroke: open ? "#1c1c1c" : "#aaa",
						strokeWidth: "1.8",
						strokeLinecap: "round"
					})]
				})
			})]
		}), /* @__PURE__ */ jsx("div", {
			style: {
				maxHeight: open ? "300px" : "0",
				overflow: "hidden",
				transition: "max-height 0.35s ease"
			},
			children: /* @__PURE__ */ jsx("p", {
				style: {
					margin: "0",
					padding: "0 28px 22px",
					fontSize: "14.5px",
					color: "#666",
					lineHeight: 1.7
				},
				children: a
			})
		})]
	});
}
function FaqSection() {
	const { cms } = useCms();
	const faqs = cms.faq || [];
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .1 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#ebebeb",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .faq-wrap { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .faq-vis  { opacity:1; transform:none; }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 faq-wrap " + (vis ? "faq-vis" : ""),
			children: [/* @__PURE__ */ jsx("h2", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontWeight: 900,
					fontSize: "clamp(22px, 2.6vw, 32px)",
					textTransform: "uppercase",
					color: "#1c1c1c",
					textAlign: "center",
					margin: "0 0 48px 0",
					letterSpacing: "-0.3px"
				},
				children: "VRAGEN DIE INKOPERS ONS STELLEN"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					maxWidth: "720px",
					margin: "0 auto"
				},
				children: faqs.map((item, i) => /* @__PURE__ */ jsx(FaqItem, {
					q: item.q,
					a: item.a
				}, item.q + i))
			})]
		})]
	});
}
//#endregion
//#region src/components/Footer.jsx
function Footer() {
	const { cms } = useCms();
	const site = cms.site || {};
	const phone = site.tel || "+31 (0)165 205 601";
	const email = site.email || "info@ferroworks.nl";
	const addressLines = (site.adres || "WESTELIJKE HAVENDIJK 31\n4703 RL ROOSENDAAL").split("\n");
	const linkedin = site.linkedin ? `https://${site.linkedin.replace(/^https?:\/\//, "")}` : "#";
	const instagram = site.instagram ? `https://${site.instagram.replace(/^https?:\/\//, "")}` : "#";
	return /* @__PURE__ */ jsxs("footer", {
		style: { background: "#3a3a3a" },
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-6 md:px-8",
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "40px 0",
					flexWrap: "wrap",
					gap: "28px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "10px",
							flexShrink: 0
						},
						children: [/* @__PURE__ */ jsxs("svg", {
							width: "36",
							height: "36",
							viewBox: "0 0 36 36",
							fill: "none",
							children: [
								/* @__PURE__ */ jsx("rect", {
									width: "36",
									height: "36",
									fill: "#c8d400"
								}),
								/* @__PURE__ */ jsx("rect", {
									x: "7",
									y: "7",
									width: "10",
									height: "22",
									fill: "#1c1c1c"
								}),
								/* @__PURE__ */ jsx("rect", {
									x: "19",
									y: "7",
									width: "10",
									height: "10",
									fill: "#1c1c1c"
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							style: { lineHeight: 1 },
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "baseline",
									gap: "1px"
								},
								children: [/* @__PURE__ */ jsx("span", {
									style: {
										fontFamily: "Arial Black, Arial, sans-serif",
										fontWeight: 900,
										fontSize: "22px",
										color: "#fff",
										letterSpacing: "-0.5px"
									},
									children: "FERRO"
								}), /* @__PURE__ */ jsx("span", {
									style: {
										fontFamily: "Arial Black, Arial, sans-serif",
										fontWeight: 900,
										fontSize: "22px",
										color: "#c8d400",
										letterSpacing: "-0.5px"
									},
									children: "WORKS"
								})]
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "Georgia, serif",
									fontStyle: "italic",
									fontSize: "11px",
									color: "#c8d400",
									marginTop: "1px",
									letterSpacing: "0.5px"
								},
								children: site.tagline || "metaalwerk"
							})]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							color: "#ccc",
							fontSize: "13px",
							lineHeight: 1.7,
							fontWeight: 700,
							textTransform: "uppercase",
							letterSpacing: "0.2px"
						},
						children: addressLines.map((line) => /* @__PURE__ */ jsx("div", { children: line }, line))
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							width: "1px",
							height: "40px",
							background: "#555",
							flexShrink: 0
						},
						className: "hidden md:block"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: "13px",
							lineHeight: 1.8
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								color: "#ccc",
								fontWeight: 700,
								letterSpacing: "0.2px"
							},
							children: phone
						}), /* @__PURE__ */ jsx("a", {
							href: `mailto:${email}`,
							style: {
								color: "#c8d400",
								fontWeight: 700,
								letterSpacing: "0.2px",
								textDecoration: "none"
							},
							children: email.toUpperCase()
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "10px",
							flexShrink: 0
						},
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "#",
								"aria-label": "Facebook",
								style: socialStyle,
								children: /* @__PURE__ */ jsx("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "white",
									children: /* @__PURE__ */ jsx("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })
								})
							}),
							/* @__PURE__ */ jsx("a", {
								href: linkedin,
								"aria-label": "LinkedIn",
								style: socialStyle,
								children: /* @__PURE__ */ jsxs("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "white",
									children: [/* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" }), /* @__PURE__ */ jsx("circle", {
										cx: "4",
										cy: "4",
										r: "2",
										fill: "white"
									})]
								})
							}),
							/* @__PURE__ */ jsx("a", {
								href: instagram,
								"aria-label": "Instagram",
								style: socialStyle,
								children: /* @__PURE__ */ jsxs("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "none",
									children: [
										/* @__PURE__ */ jsx("rect", {
											x: "3",
											y: "3",
											width: "18",
											height: "18",
											rx: "5",
											stroke: "white",
											strokeWidth: "2"
										}),
										/* @__PURE__ */ jsx("circle", {
											cx: "12",
											cy: "12",
											r: "4",
											stroke: "white",
											strokeWidth: "2"
										}),
										/* @__PURE__ */ jsx("circle", {
											cx: "17.5",
											cy: "6.5",
											r: "1.2",
											fill: "white"
										})
									]
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", { style: { borderTop: "1px solid #4e4e4e" } }),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-6 md:px-8",
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "20px 0",
					flexWrap: "wrap",
					gap: "16px"
				},
				children: [/* @__PURE__ */ jsxs("p", {
					style: {
						color: "#888",
						fontSize: "12.5px",
						margin: 0
					},
					children: [
						"© FerroWorks. All Rights Reserved | Marketing door",
						" ",
						/* @__PURE__ */ jsx("a", {
							href: "https://leadi.nl",
							target: "_blank",
							rel: "noopener noreferrer",
							style: {
								color: "#888",
								textDecoration: "underline"
							},
							children: "Leadi"
						})
					]
				}), /* @__PURE__ */ jsx("nav", {
					style: {
						display: "flex",
						gap: "32px",
						flexWrap: "wrap"
					},
					children: [
						{
							label: "VACATURES",
							href: "#"
						},
						{
							label: "MACHINEPARK",
							href: "#"
						},
						{
							label: "PRIVACY POLICY",
							href: "/privacy-policy"
						},
						{
							label: "ALGEMENE VOORWAARDEN",
							href: "/algemene-voorwaarden"
						}
					].map((link) => /* @__PURE__ */ jsx("a", {
						href: link.href,
						style: {
							color: "#ccc",
							fontSize: "12px",
							fontWeight: 700,
							letterSpacing: "0.5px",
							textDecoration: "none",
							fontFamily: "Arial Black, Arial, sans-serif"
						},
						onMouseEnter: (e) => e.currentTarget.style.color = "#c8d400",
						onMouseLeave: (e) => e.currentTarget.style.color = "#ccc",
						children: link.label
					}, link.label))
				})]
			})
		]
	});
}
var socialStyle = {
	width: "36px",
	height: "36px",
	borderRadius: "50%",
	background: "#555",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	transition: "background 0.2s",
	textDecoration: "none"
};
//#endregion
//#region src/pages/OverOnsPage.jsx
function useInView$6(threshold = .12) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
function CheckIcon$2() {
	return /* @__PURE__ */ jsx("svg", {
		width: "22",
		height: "22",
		viewBox: "0 0 22 22",
		fill: "none",
		style: {
			flexShrink: 0,
			marginTop: "3px"
		},
		children: /* @__PURE__ */ jsx("polyline", {
			points: "3,11 9,17 20,5",
			stroke: "#c8d400",
			strokeWidth: "2.8",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function PageHero$4() {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "380px",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${hero_background_default})`,
				backgroundSize: "cover",
				backgroundPosition: "center right"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "64px",
					paddingBottom: "64px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "24px"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "#c8d400",
									fontSize: "13px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#666",
									fontSize: "13px"
								},
								children: "›"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Over Ons"
							})
						]
					}),
					/* @__PURE__ */ jsxs("h1", {
						style: {
							margin: "0 0 16px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px, 4vw, 56px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#c8d400" },
							children: "VORMGEVERS "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#fff" },
							children: "IN METAAL"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: 0,
							color: "#bbb",
							fontSize: "clamp(14px, 1.6vw, 17px)",
							lineHeight: 1.6,
							maxWidth: "520px"
						},
						children: "FerroWorks begeleidt metaalprojecten van ontwerp en engineering tot productie en montage. Specialist in maatwerk Staal, RVS en Aluminium."
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "#c8d400",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function OnsVerhaal() {
	const [ref, vis] = useInView$6();
	const { cms } = useCms();
	const v = cms.overOns && cms.overOns.verhaal || {};
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .ov-left { opacity:0; transform:translateX(-36px); transition: opacity .65s ease, transform .65s ease; }
        .ov-img1 { opacity:0; transform:translateY(-24px); transition: opacity .65s .2s ease, transform .65s .2s ease; }
        .ov-img2 { opacity:0; transform:translateY(24px);  transition: opacity .65s .4s ease, transform .65s .4s ease; }
        .ov-sq   { opacity:0; transform:scale(0.4);        transition: opacity .5s .55s ease, transform .5s .55s ease; }
        .ov-on .ov-left, .ov-on .ov-img1, .ov-on .ov-img2, .ov-on .ov-sq { opacity:1; transform:none; }
        @media (max-width: 768px) { .ov-grid { grid-template-columns: 1fr !important; } .ov-photos { height: 300px !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 ov-grid " + (vis ? "ov-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1.3fr",
				gap: "72px",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ov-left",
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "#c8d400",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "ONS VERHAAL"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							margin: "0 0 24px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(20px, 2.4vw, 30px)",
							lineHeight: 1.1,
							textTransform: "uppercase",
							letterSpacing: "-0.3px"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								style: { color: "#c8d400" },
								children: v.title1 || "GEBOUWD OP"
							}),
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", {
								style: { color: "#1c1c1c" },
								children: v.title2 || "VAKMANSCHAP"
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: "0 0 18px 0"
						},
						children: v.tekst1 || "FerroWorks is een familiebedrijf met meer dan 15 jaar ervaring in metaalmaatwerk. We begeleiden projecten van A tot Z — van ontwerp en engineering tot productie, coating en montage op locatie."
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: "0 0 18px 0"
						},
						children: v.tekst2 || "Specialist in maatwerk staal, RVS en aluminium voor industrie, bouw & utiliteit, architectuur & design en maritieme toepassingen."
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: 0
						},
						children: v.tekst3 || "Heldere afspraken, transparante kosten en één aanspreekpunt van begin tot eind. Dat is hoe wij werken."
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "ov-photos",
				style: {
					position: "relative",
					height: "380px"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "ov-sq",
						style: {
							position: "absolute",
							top: 0,
							right: 0,
							width: "80px",
							height: "80px",
							background: "#c8d400",
							zIndex: 1
						}
					}),
					/* @__PURE__ */ jsx("div", {
						className: "ov-img1",
						style: {
							position: "absolute",
							top: "40px",
							left: 0,
							width: "56%",
							height: "65%",
							overflow: "hidden",
							zIndex: 2,
							boxShadow: "0 4px 18px rgba(0,0,0,0.13)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: v.image1 || "/assets/over-ons2-Cfi8JRv3.png",
							alt: "FerroWorks productie",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "center",
								display: "block"
							}
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "ov-img2",
						style: {
							position: "absolute",
							bottom: 0,
							right: 0,
							width: "52%",
							height: "60%",
							overflow: "hidden",
							zIndex: 3,
							boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: v.image2 || "/assets/over-ons3-B7TQ4OxP.png",
							alt: "FerroWorks medewerker",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "top",
								display: "block"
							}
						})
					})
				]
			})]
		})]
	});
}
function StatsRow() {
	const [ref, vis] = useInView$6(.15);
	const { cms } = useCms();
	const stats = cms.stats || [];
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "60px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .st2-item { opacity:0; transform:translateY(20px); transition: opacity .5s ease, transform .5s ease; }
        .st2-on .st2-item:nth-child(1) { opacity:1; transform:none; transition-delay:.0s; }
        .st2-on .st2-item:nth-child(2) { opacity:1; transform:none; transition-delay:.12s; }
        .st2-on .st2-item:nth-child(3) { opacity:1; transform:none; transition-delay:.24s; }
        .st2-on .st2-item:nth-child(4) { opacity:1; transform:none; transition-delay:.36s; }
      ` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 st2-grid " + (vis ? "st2-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: `repeat(${stats.length || 4}, 1fr)`,
				gap: "32px"
			},
			children: stats.map((s, i) => /* @__PURE__ */ jsxs("div", {
				className: "st2-item",
				style: {
					borderLeft: "3px solid #c8d400",
					paddingLeft: "20px"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(28px, 3vw, 40px)",
						color: "#c8d400",
						lineHeight: 1,
						letterSpacing: "-0.5px"
					},
					children: s.number
				}), /* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "13px",
						color: "#fff",
						textTransform: "uppercase",
						letterSpacing: "0.3px",
						marginTop: "6px"
					},
					children: s.desc
				})]
			}, i))
		})]
	});
}
var FALLBACK_SERVICES = [
	"Heldere afspraken, zonder verrassingen.",
	"Totaal ontzorgen van ontwerp tot montage.",
	"Reparatie en onderhoud op locatie.",
	"Advies en ondersteuning bij ontwerp en uitvoerbaarheid.",
	"Één partner voor het volledige traject.",
	"Maakbaar, praktisch en doordacht.",
	"Transparant in kosten en planning."
];
function WatWeDoen() {
	const [ref, vis] = useInView$6();
	const { cms } = useCms();
	const wwd = cms.overOns && cms.overOns.watWeDoen || {};
	const services = wwd.items ? typeof wwd.items === "string" ? wwd.items.split("\n").filter(Boolean) : wwd.items : FALLBACK_SERVICES;
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .wwd-left  { opacity:0; transform:translateX(-32px); transition: opacity .6s ease, transform .6s ease; }
        .wwd-right { opacity:0; transform:translateX(32px);  transition: opacity .6s .2s ease, transform .6s .2s ease; }
        .wwd-on .wwd-left, .wwd-on .wwd-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .wwd-grid { grid-template-columns: 1fr !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 wwd-grid " + (vis ? "wwd-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "80px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "wwd-left",
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "#c8d400",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "ONZE DIENSTEN"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							margin: "0 0 32px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.6vw, 34px)",
							textTransform: "uppercase",
							lineHeight: 1.1,
							letterSpacing: "-0.3px"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								style: { color: "#c8d400" },
								children: "WAT FERROWORKS"
							}),
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", {
								style: { color: "#1c1c1c" },
								children: "VOOR JE DOET"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "14px"
						},
						children: services.map((s, i) => /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "flex-start",
								gap: "10px"
							},
							children: [/* @__PURE__ */ jsx(CheckIcon$2, {}), /* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "15px",
									lineHeight: 1.6
								},
								children: s
							})]
						}, i))
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "wwd-right",
				style: { position: "relative" },
				children: [/* @__PURE__ */ jsx("div", {
					className: "wwd-accent",
					style: {
						position: "absolute",
						bottom: "-16px",
						right: "-16px",
						width: "64px",
						height: "64px",
						background: "#c8d400",
						zIndex: 0
					}
				}), /* @__PURE__ */ jsx("div", {
					style: {
						position: "relative",
						zIndex: 1,
						overflow: "hidden",
						boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
					},
					children: /* @__PURE__ */ jsx("img", {
						className: "wwd-image",
						src: wwd.image || "/assets/over-ons1-DD0I2h8C.png",
						alt: "FerroWorks productie",
						style: {
							width: "100%",
							height: "340px",
							objectFit: "cover",
							objectPosition: "center",
							display: "block"
						}
					})
				})]
			})]
		})]
	});
}
var FALLBACK_DIFFERENTIATORS = [
	{
		title: "GROOT GENOEG OM REGIE TE VOEREN",
		desc: "Wij hebben de slagkracht en expertise om technische metaalprojecten volledig te realiseren."
	},
	{
		title: "KLEIN GENOEG OM DIRECT TE SCHAKELEN",
		desc: "Direct contact, snel schakelen en meebewegen met jouw planning."
	},
	{
		title: "PERSOONLIJK GENOEG OM VOORUIT TE DENKEN",
		desc: "We adviseren, optimaliseren en zorgen dat jouw project van begin tot eind klopt."
	}
];
function WatOnsAnders() {
	const [ref, vis] = useInView$6();
	const { cms } = useCms();
	const differentiators = cms.overOns && cms.overOns.andersItems && cms.overOns.andersItems.length ? cms.overOns.andersItems : FALLBACK_DIFFERENTIATORS;
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .woa2-head { opacity:0; transform:translateY(-20px); transition: opacity .55s ease, transform .55s ease; }
        .woa2-card { opacity:0; transform:translateY(28px); transition: opacity .55s ease, transform .55s ease; }
        .woa2-on .woa2-head { opacity:1; transform:none; }
        .woa2-on .woa2-card:nth-child(1) { opacity:1; transform:none; transition-delay:.1s; }
        .woa2-on .woa2-card:nth-child(2) { opacity:1; transform:none; transition-delay:.22s; }
        .woa2-on .woa2-card:nth-child(3) { opacity:1; transform:none; transition-delay:.34s; }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "woa2-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "woa2-head",
				style: { marginBottom: "48px" },
				children: [/* @__PURE__ */ jsx("p", {
					style: {
						margin: "0 0 10px 0",
						color: "#c8d400",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						letterSpacing: "2px",
						textTransform: "uppercase"
					},
					children: "WAAROM FERROWORKS"
				}), /* @__PURE__ */ jsxs("h2", {
					style: {
						margin: 0,
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(22px, 2.6vw, 34px)",
						textTransform: "uppercase",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#1c1c1c" },
						children: "WAT ONS "
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "ANDERS MAAKT"
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "fw-three-col-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "32px"
				},
				children: differentiators.map((d, i) => /* @__PURE__ */ jsxs("div", {
					className: "woa2-card",
					style: {
						background: "#fff",
						padding: "36px 28px",
						borderBottom: "4px solid #c8d400"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							style: {
								width: "40px",
								height: "40px",
								background: "#c8d400",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: "20px"
							},
							children: /* @__PURE__ */ jsx(CheckIcon$2, {})
						}),
						/* @__PURE__ */ jsx("h3", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "14px",
								textTransform: "uppercase",
								letterSpacing: "0.2px",
								color: "#1c1c1c",
								margin: "0 0 12px 0",
								lineHeight: 1.25
							},
							children: d.title
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								fontSize: "14px",
								color: "#666",
								lineHeight: 1.7,
								margin: 0
							},
							children: d.desc
						})
					]
				}, i))
			})]
		})]
	});
}
function TeamSection() {
	const [ref, vis] = useInView$6();
	const { cms } = useCms();
	const team = cms.overOns && cms.overOns.team || {};
	const teamItems = team.items ? typeof team.items === "string" ? team.items.split("\n").filter(Boolean) : team.items : [
		"Ruim 15 jaar ervaring in metaalmaatwerk",
		"Maakbaar, praktisch en doordacht",
		"Reparatie en onderhoud op locatie"
	];
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .tm2-right { opacity:0; transform:translateX(36px); transition: opacity .65s ease, transform .65s ease; }
        .tm2-img1  { opacity:0; transform:translateX(-28px); transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .tm2-img2  { opacity:0; transform:translateY(-20px); transition: opacity .65s .3s ease, transform .65s .3s ease; }
        .tm2-img3  { opacity:0; transform:translateY(28px);  transition: opacity .65s .45s ease, transform .65s .45s ease; }
        .tm2-sq    { opacity:0; transform:scale(0.4);        transition: opacity .5s .6s ease, transform .5s .6s ease; }
        .tm2-on .tm2-right, .tm2-on .tm2-img1, .tm2-on .tm2-img2, .tm2-on .tm2-img3, .tm2-on .tm2-sq { opacity:1; transform:none; }
        @media (max-width: 768px) { .tm2-grid { grid-template-columns: 1fr !important; } .tm2-photos { height: 340px !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 tm2-grid " + (vis ? "tm2-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "80px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "tm2-photos",
				style: {
					position: "relative",
					height: "480px"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "tm2-sq",
						style: {
							position: "absolute",
							bottom: 0,
							left: "6%",
							width: "84px",
							height: "84px",
							background: "#c8d400",
							zIndex: 1
						}
					}),
					/* @__PURE__ */ jsx("div", {
						className: "tm2-img1",
						style: {
							position: "absolute",
							top: "60px",
							left: 0,
							width: "44%",
							height: "66%",
							overflow: "hidden",
							zIndex: 2,
							boxShadow: "0 4px 18px rgba(0,0,0,0.13)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: team.image1 || "/assets/about-us2-Dd2z2xke.jpeg",
							alt: "FerroWorks medewerker",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "top",
								display: "block"
							}
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "tm2-img2",
						style: {
							position: "absolute",
							top: 0,
							left: "36%",
							width: "30%",
							height: "30%",
							overflow: "hidden",
							zIndex: 3,
							boxShadow: "0 4px 18px rgba(0,0,0,0.13)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: team.image2 || "/assets/about-us1-Fdlmxb8O.jpeg",
							alt: "FerroWorks werkplaats",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "center",
								display: "block"
							}
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "tm2-img3",
						style: {
							position: "absolute",
							bottom: 0,
							right: 0,
							width: "54%",
							height: "60%",
							overflow: "hidden",
							zIndex: 4,
							boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: team.image3 || "/assets/about-us3-De6QPg3_.jpeg",
							alt: "FerroWorks team",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "top",
								display: "block"
							}
						})
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "tm2-right",
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "#c8d400",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "ONS TEAM"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.6vw, 34px)",
							textTransform: "uppercase",
							lineHeight: 1.1,
							letterSpacing: "-0.3px",
							margin: "0 0 24px 0"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#1c1c1c" },
							children: team.title1 || "VAKMANNEN MET "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#c8d400" },
							children: team.title2 || "EÉN DOEL"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: "0 0 18px 0"
						},
						children: team.tekst1 || "Ons team bestaat uit gespecialiseerde metaalbewerkers, lassers, engineers en projectleiders. Elk met diepgaande kennis van staal, RVS en aluminium."
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: "0 0 32px 0"
						},
						children: team.tekst2 || "Wij werken nauw samen met onze klanten: van de eerste tekening tot de laatste bout op locatie. Altijd één aanspreekpunt, altijd persoonlijk."
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "14px"
						},
						children: teamItems.map((item, i) => /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "flex-start",
								gap: "10px"
							},
							children: [/* @__PURE__ */ jsx(CheckIcon$2, {}), /* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "15px",
									lineHeight: 1.6
								},
								children: item
							})]
						}, i))
					})
				]
			})]
		})]
	});
}
var sectoren = [
	{
		naam: "Bouw & Utiliteit",
		diensten: [
			"Staalconstructies",
			"Standaard hekwerken",
			"Prefab balkons"
		]
	},
	{
		naam: "Industrie",
		diensten: [
			"Machinebouw",
			"Maatwerk staalconstructies",
			"Industriële installaties",
			"Laswerkzaamheden op locatie"
		]
	},
	{
		naam: "Architectuur & Design",
		diensten: ["Design trappen", "Interieur- en exterieur maatwerk"]
	},
	{
		naam: "Maritiem",
		diensten: ["Jachtbouw"]
	}
];
function SectorenOverzicht() {
	const [ref, vis] = useInView$6();
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .so-head { opacity:0; transform:translateY(-20px); transition: opacity .5s ease, transform .5s ease; }
        .so-card { opacity:0; transform:translateY(24px); transition: opacity .5s ease, transform .5s ease; }
        .so-on .so-head { opacity:1; transform:none; }
        .so-on .so-card:nth-child(1) { opacity:1; transform:none; transition-delay:.08s; }
        .so-on .so-card:nth-child(2) { opacity:1; transform:none; transition-delay:.18s; }
        .so-on .so-card:nth-child(3) { opacity:1; transform:none; transition-delay:.28s; }
        .so-on .so-card:nth-child(4) { opacity:1; transform:none; transition-delay:.38s; }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "so-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "so-head",
				style: { marginBottom: "48px" },
				children: [/* @__PURE__ */ jsx("p", {
					style: {
						margin: "0 0 10px 0",
						color: "#c8d400",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						letterSpacing: "2px",
						textTransform: "uppercase"
					},
					children: "WAT WE BOUWEN"
				}), /* @__PURE__ */ jsxs("h2", {
					style: {
						margin: 0,
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(22px, 2.6vw, 34px)",
						textTransform: "uppercase",
						lineHeight: 1.1,
						letterSpacing: "-0.3px",
						color: "#fff"
					},
					children: ["ONZE ", /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "SECTOREN"
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "fw-four-col-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: "24px"
				},
				children: sectoren.map((s, i) => /* @__PURE__ */ jsxs("div", {
					className: "so-card",
					style: {
						background: "#2a2a2a",
						padding: "32px 24px",
						borderTop: "4px solid #c8d400"
					},
					children: [/* @__PURE__ */ jsx("h3", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "16px",
							textTransform: "uppercase",
							color: "#fff",
							margin: "0 0 20px 0",
							letterSpacing: "-0.2px",
							lineHeight: 1.2
						},
						children: s.naam
					}), /* @__PURE__ */ jsx("ul", {
						style: {
							listStyle: "none",
							margin: 0,
							padding: 0,
							display: "flex",
							flexDirection: "column",
							gap: "8px"
						},
						children: s.diensten.map((d, j) => /* @__PURE__ */ jsxs("li", {
							style: {
								display: "flex",
								alignItems: "flex-start",
								gap: "8px"
							},
							children: [/* @__PURE__ */ jsx("div", { style: {
								width: "6px",
								height: "6px",
								background: "#c8d400",
								flexShrink: 0,
								marginTop: "6px"
							} }), /* @__PURE__ */ jsx("span", {
								style: {
									color: "#bbb",
									fontSize: "13px",
									lineHeight: 1.5
								},
								children: d
							})]
						}, j))
					})]
				}, i))
			})]
		})]
	});
}
var certs = [
	{
		code: "VCA",
		label: "Veiligheid, gezondheid & milieu"
	},
	{
		code: "EN-1090",
		label: "Staal- en aluminiumconstructies"
	},
	{
		code: "CE",
		label: "Conformiteit & veiligheidsstandaard"
	}
];
function Certificeringen() {
	const [ref, vis] = useInView$6();
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .ce2-head { opacity:0; transform:translateY(-18px); transition: opacity .5s ease, transform .5s ease; }
        .ce2-card { opacity:0; transform:translateY(24px); transition: opacity .5s ease, transform .5s ease; }
        .ce2-on .ce2-head { opacity:1; transform:none; }
        .ce2-on .ce2-card:nth-child(1) { opacity:1; transform:none; transition-delay:.08s; }
        .ce2-on .ce2-card:nth-child(2) { opacity:1; transform:none; transition-delay:.2s; }
        .ce2-on .ce2-card:nth-child(3) { opacity:1; transform:none; transition-delay:.32s; }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "ce2-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ce2-head",
				style: { marginBottom: "48px" },
				children: [/* @__PURE__ */ jsx("p", {
					style: {
						margin: "0 0 10px 0",
						color: "#c8d400",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						letterSpacing: "2px",
						textTransform: "uppercase"
					},
					children: "ONZE CERTIFICERINGEN"
				}), /* @__PURE__ */ jsxs("h2", {
					style: {
						margin: 0,
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(22px, 2.6vw, 34px)",
						textTransform: "uppercase",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#1c1c1c" },
						children: "GECERTIFICEERD "
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "VCA, EN-1090 & CE"
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "fw-three-col-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "24px"
				},
				children: certs.map((c, i) => /* @__PURE__ */ jsxs("div", {
					className: "ce2-card",
					style: {
						border: "1.5px solid #e0e0e0",
						padding: "36px 28px",
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						gap: "10px",
						position: "relative",
						overflow: "hidden"
					},
					children: [
						/* @__PURE__ */ jsx("div", { style: {
							position: "absolute",
							top: 0,
							left: 0,
							width: "4px",
							height: "100%",
							background: "#c8d400"
						} }),
						/* @__PURE__ */ jsx("span", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "26px",
								color: "#1c1c1c",
								letterSpacing: "-0.3px"
							},
							children: c.code
						}),
						/* @__PURE__ */ jsx("span", {
							style: {
								fontSize: "13px",
								color: "#777",
								lineHeight: 1.4
							},
							children: c.label
						}),
						/* @__PURE__ */ jsx("div", { style: {
							width: "32px",
							height: "3px",
							background: "#c8d400",
							marginTop: "4px"
						} })
					]
				}, i))
			})]
		})]
	});
}
function CtaSection$2() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "80px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "56px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "28px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(20px, 2.4vw, 30px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 10px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["KLAAR OM ", /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "TE STARTEN?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#999",
						fontSize: "15px",
						margin: 0,
						lineHeight: 1.5
					},
					children: "Stuur uw tekening op of neem contact op — wij reageren binnen 24 uur."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "fw-cta-actions",
					style: {
						display: "flex",
						gap: "16px",
						flexWrap: "wrap"
					},
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "#c8d400",
							padding: "16px 32px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
						onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
						children: "NEEM CONTACT OP"
					}), /* @__PURE__ */ jsx("a", {
						href: "tel:+31165205617",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#fff",
							background: "transparent",
							border: "2px solid #555",
							padding: "14px 28px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.borderColor = "#c8d400",
						onMouseLeave: (e) => e.currentTarget.style.borderColor = "#555",
						children: "BEL ONS"
					})]
				})]
			})
		})
	});
}
function OverOnsPage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHero$4, {}),
		/* @__PURE__ */ jsx(OnsVerhaal, {}),
		/* @__PURE__ */ jsx(StatsRow, {}),
		/* @__PURE__ */ jsx(WatWeDoen, {}),
		/* @__PURE__ */ jsx(WatOnsAnders, {}),
		/* @__PURE__ */ jsx(TeamSection, {}),
		/* @__PURE__ */ jsx(SectorenOverzicht, {}),
		/* @__PURE__ */ jsx(Certificeringen, {}),
		/* @__PURE__ */ jsx(CtaSection$2, {})
	] });
}
//#endregion
//#region src/pages/ContactPage.jsx
function useInView$5(threshold = .12) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
function PageHero$3() {
	const { cms } = useCms();
	const hero = (cms.contact || {}).hero || {};
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "340px",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${hero_background_default})`,
				backgroundSize: "cover",
				backgroundPosition: "center right"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "64px",
					paddingBottom: "64px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "24px"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "#c8d400",
									fontSize: "13px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#666",
									fontSize: "13px"
								},
								children: "›"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Contact"
							})
						]
					}),
					/* @__PURE__ */ jsxs("h1", {
						style: {
							margin: "0 0 16px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px, 4vw, 56px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase"
						},
						children: [/* @__PURE__ */ jsxs("span", {
							style: { color: "#c8d400" },
							children: [hero.title1 || "NEEM", " "]
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#fff" },
							children: hero.title2 || "CONTACT OP"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: 0,
							color: "#bbb",
							fontSize: "clamp(14px, 1.6vw, 17px)",
							lineHeight: 1.6,
							maxWidth: "520px"
						},
						children: hero.subtitle || "Stuur uw tekening op of stel uw vraag. Wij reageren binnen 24 uur."
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "#c8d400",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function ContactMain() {
	const [ref, vis] = useInView$5(.08);
	const { cms } = useCms();
	const c = cms.contact || {};
	const site = cms.site || {};
	const [formData, setFormData] = useState({
		naam: "",
		bedrijf: "",
		email: "",
		telefoon: "",
		bericht: ""
	});
	const [attachment, setAttachment] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState("");
	const tel = site.tel || c.tel || "+31 (0)165 205 601";
	const email = site.email || c.email || "info@ferroworks.nl";
	const adres = site.adres || c.adres || "Westelijke Havendijk 31\n4703 RL Roosendaal";
	const openingstijden = c.openingstijden ? c.openingstijden.split("\n").map((line) => {
		const parts = line.split(":");
		const time = parts.slice(1).join(":").trim();
		return [parts[0].trim(), time];
	}).filter((p) => p[0]) : [
		["Maandag – Vrijdag", "07:30 – 17:00"],
		["Zaterdag", "Op afspraak"],
		["Zondag", "Gesloten"]
	];
	function handleChange(e) {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	}
	async function handleSubmit(e) {
		e.preventDefault();
		setSending(true);
		setError("");
		try {
			const payload = new FormData();
			payload.append("naam", formData.naam);
			payload.append("bedrijf", formData.bedrijf);
			payload.append("email", formData.email);
			payload.append("telefoon", formData.telefoon);
			payload.append("bericht", formData.bericht);
			if (attachment) payload.append("attachment", attachment);
			await api.submitContact(payload);
			setSending(false);
			setSubmitted(true);
		} catch (err) {
			setSending(false);
			setError(err.message || "Versturen mislukt.");
		}
	}
	const inputStyle = {
		width: "100%",
		background: "#f4f4f4",
		border: "1.5px solid #e0e0e0",
		padding: "14px 16px",
		fontSize: "14px",
		color: "#1c1c1c",
		outline: "none",
		fontFamily: "Arial, sans-serif",
		boxSizing: "border-box",
		transition: "border-color .2s"
	};
	const labelStyle = {
		fontFamily: "Arial Black, Arial, sans-serif",
		fontWeight: 900,
		fontSize: "11px",
		letterSpacing: "1.2px",
		textTransform: "uppercase",
		color: "#444",
		display: "block",
		marginBottom: "6px"
	};
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .cm-form  { opacity:0; transform:translateX(-32px); transition: opacity .65s ease, transform .65s ease; }
        .cm-info  { opacity:0; transform:translateX(32px);  transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .cm-on .cm-form, .cm-on .cm-info { opacity:1; transform:none; }
        .fw-input:focus { border-color: #c8d400 !important; }
        @media (max-width: 768px) { .cm-grid { grid-template-columns: 1fr !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 cm-grid " + (vis ? "cm-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1.1fr 0.9fr",
				gap: "72px",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "cm-form",
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "#c8d400",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "STUUR EEN BERICHT"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							margin: "0 0 36px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.4vw, 30px)",
							lineHeight: 1.1,
							textTransform: "uppercase",
							letterSpacing: "-0.3px"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#1c1c1c" },
							children: "WIJ REAGEREN "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#c8d400" },
							children: "BINNEN 24 UUR"
						})]
					}),
					submitted ? /* @__PURE__ */ jsxs("div", {
						style: {
							background: "#f4f4f4",
							borderLeft: "4px solid #c8d400",
							padding: "32px 28px"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "18px",
								color: "#1c1c1c",
								textTransform: "uppercase",
								marginBottom: "10px"
							},
							children: "Bericht ontvangen!"
						}), /* @__PURE__ */ jsx("p", {
							style: {
								color: "#555",
								fontSize: "15px",
								lineHeight: 1.7,
								margin: 0
							},
							children: "Bedankt voor uw bericht. Wij nemen zo snel mogelijk contact met u op."
						})]
					}) : /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "20px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "form-row",
								style: {
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "16px"
								},
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: labelStyle,
									children: "Naam *"
								}), /* @__PURE__ */ jsx("input", {
									className: "fw-input",
									style: inputStyle,
									type: "text",
									name: "naam",
									value: formData.naam,
									onChange: handleChange,
									placeholder: "Uw naam",
									required: true
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: labelStyle,
									children: "Bedrijf"
								}), /* @__PURE__ */ jsx("input", {
									className: "fw-input",
									style: inputStyle,
									type: "text",
									name: "bedrijf",
									value: formData.bedrijf,
									onChange: handleChange,
									placeholder: "Uw bedrijfsnaam"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "form-row",
								style: {
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "16px"
								},
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: labelStyle,
									children: "E-mailadres *"
								}), /* @__PURE__ */ jsx("input", {
									className: "fw-input",
									style: inputStyle,
									type: "email",
									name: "email",
									value: formData.email,
									onChange: handleChange,
									placeholder: "uw@email.nl",
									required: true
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: labelStyle,
									children: "Telefoon"
								}), /* @__PURE__ */ jsx("input", {
									className: "fw-input",
									style: inputStyle,
									type: "tel",
									name: "telefoon",
									value: formData.telefoon,
									onChange: handleChange,
									placeholder: "+31 ..."
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: labelStyle,
								children: "Bericht *"
							}), /* @__PURE__ */ jsx("textarea", {
								className: "fw-input",
								style: {
									...inputStyle,
									resize: "vertical",
									minHeight: "140px"
								},
								name: "bericht",
								value: formData.bericht,
								onChange: handleChange,
								placeholder: "Beschrijf uw project of vraag...",
								required: true
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: labelStyle,
								children: "Tekening / bijlage"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									border: "1.5px dashed #ccc",
									background: "#f9f9f9",
									padding: "20px 16px",
									textAlign: "center",
									cursor: "pointer",
									position: "relative"
								},
								children: [
									/* @__PURE__ */ jsx("input", {
										type: "file",
										accept: ".pdf,.dwg,.dxf,.jpg,.jpeg,.png",
										onChange: (e) => setAttachment(e.target.files?.[0] || null),
										style: {
											position: "absolute",
											inset: 0,
											opacity: 0,
											cursor: "pointer",
											width: "100%",
											height: "100%"
										}
									}),
									/* @__PURE__ */ jsxs("svg", {
										width: "28",
										height: "28",
										viewBox: "0 0 24 24",
										fill: "none",
										style: { margin: "0 auto 8px" },
										children: [
											/* @__PURE__ */ jsx("path", {
												d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
												stroke: "#c8d400",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round"
											}),
											/* @__PURE__ */ jsx("polyline", {
												points: "17 8 12 3 7 8",
												stroke: "#c8d400",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round"
											}),
											/* @__PURE__ */ jsx("line", {
												x1: "12",
												y1: "3",
												x2: "12",
												y2: "15",
												stroke: "#c8d400",
												strokeWidth: "2",
												strokeLinecap: "round"
											})
										]
									}),
									/* @__PURE__ */ jsxs("p", {
										style: {
											fontSize: "13px",
											color: "#888",
											margin: 0
										},
										children: ["Sleep een bestand of ", /* @__PURE__ */ jsx("span", {
											style: {
												color: "#c8d400",
												fontWeight: 700
											},
											children: "klik om te uploaden"
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "11px",
											color: "#bbb",
											margin: "4px 0 0"
										},
										children: attachment ? attachment.name : "PDF, DWG, DXF, JPG, PNG"
									})
								]
							})] }),
							error && /* @__PURE__ */ jsx("div", {
								style: {
									color: "#dc2626",
									fontSize: "13px"
								},
								children: error
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: sending,
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "13px",
									textTransform: "uppercase",
									letterSpacing: "0.8px",
									color: "#1c1c1c",
									background: sending ? "#b3be00" : "#c8d400",
									border: "none",
									padding: "18px 40px",
									cursor: sending ? "default" : "pointer",
									transition: "background .2s",
									alignSelf: "flex-start"
								},
								onMouseEnter: (e) => {
									if (!sending) e.currentTarget.style.background = "#b3be00";
								},
								onMouseLeave: (e) => {
									if (!sending) e.currentTarget.style.background = "#c8d400";
								},
								children: sending ? "VERZENDEN..." : "VERSTUUR BERICHT"
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "cm-info",
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "0"
				},
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "#c8d400",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "CONTACTGEGEVENS"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							margin: "0 0 36px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.4vw, 30px)",
							lineHeight: 1.1,
							textTransform: "uppercase",
							letterSpacing: "-0.3px"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#1c1c1c" },
							children: "DIRECT "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#c8d400" },
							children: "BEREIKBAAR"
						})]
					}),
					[
						{
							icon: /* @__PURE__ */ jsx("svg", {
								width: "22",
								height: "22",
								viewBox: "0 0 24 24",
								fill: "none",
								children: /* @__PURE__ */ jsx("path", {
									d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
									stroke: "#c8d400",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							}),
							label: "Telefoon",
							value: tel,
							href: `tel:${tel.replace(/[\s()]/g, "")}`
						},
						{
							icon: /* @__PURE__ */ jsxs("svg", {
								width: "22",
								height: "22",
								viewBox: "0 0 24 24",
								fill: "none",
								children: [/* @__PURE__ */ jsx("path", {
									d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
									stroke: "#c8d400",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								}), /* @__PURE__ */ jsx("polyline", {
									points: "22,6 12,13 2,6",
									stroke: "#c8d400",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})]
							}),
							label: "E-mail",
							value: email,
							href: `mailto:${email}`
						},
						{
							icon: /* @__PURE__ */ jsxs("svg", {
								width: "22",
								height: "22",
								viewBox: "0 0 24 24",
								fill: "none",
								children: [/* @__PURE__ */ jsx("path", {
									d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
									stroke: "#c8d400",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								}), /* @__PURE__ */ jsx("circle", {
									cx: "12",
									cy: "10",
									r: "3",
									stroke: "#c8d400",
									strokeWidth: "2"
								})]
							}),
							label: "Adres",
							value: adres,
							href: `https://maps.google.com/?q=${encodeURIComponent(adres.replace(/\n/g, " "))}`
						}
					].map((item, i) => /* @__PURE__ */ jsxs("a", {
						href: item.href,
						target: item.label === "Adres" ? "_blank" : void 0,
						rel: item.label === "Adres" ? "noopener noreferrer" : void 0,
						style: {
							display: "flex",
							alignItems: "flex-start",
							gap: "16px",
							padding: "24px 0",
							borderBottom: "1px solid #eee",
							textDecoration: "none"
						},
						onMouseEnter: (e) => e.currentTarget.style.opacity = "0.75",
						onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								width: "44px",
								height: "44px",
								background: "#f4f4f4",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0
							},
							children: item.icon
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "11px",
								letterSpacing: "1.5px",
								textTransform: "uppercase",
								color: "#999",
								marginBottom: "4px"
							},
							children: item.label
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "15px",
								color: "#1c1c1c",
								whiteSpace: "pre-line",
								lineHeight: 1.5
							},
							children: item.value
						})] })]
					}, i)),
					/* @__PURE__ */ jsxs("div", {
						style: {
							marginTop: "32px",
							background: "#f4f4f4",
							padding: "24px 24px"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "11px",
								letterSpacing: "2px",
								textTransform: "uppercase",
								color: "#c8d400",
								marginBottom: "16px"
							},
							children: "OPENINGSTIJDEN"
						}), openingstijden.map(([dag, tijd], i) => /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								padding: "8px 0",
								borderBottom: i < openingstijden.length - 1 ? "1px solid #e4e4e4" : "none"
							},
							children: [/* @__PURE__ */ jsx("span", {
								style: {
									fontSize: "13px",
									color: "#555"
								},
								children: dag
							}), /* @__PURE__ */ jsx("span", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "13px",
									color: "#1c1c1c"
								},
								children: tijd
							})]
						}, i))]
					})
				]
			})]
		})]
	});
}
function MapSection() {
	const { cms } = useCms();
	const c = cms.contact || {};
	const adres = (cms.site || {}).adres || c.adres || "Westelijke Havendijk 31\n4703 RL Roosendaal";
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "0"
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				width: "100%",
				height: "420px",
				position: "relative",
				overflow: "hidden"
			},
			children: [/* @__PURE__ */ jsx("iframe", {
				title: "FerroWorks locatie",
				src: c.mapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.8!2d4.4630!3d51.5300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c417d4d3e40000%3A0x0!2sWestelijke+Havendijk+31%2C+4703+RL+Roosendaal!5e0!3m2!1snl!2snl!4v1",
				width: "100%",
				height: "420",
				style: {
					border: 0,
					display: "block",
					filter: "grayscale(0.3)"
				},
				allowFullScreen: "",
				loading: "lazy",
				referrerPolicy: "no-referrer-when-downgrade"
			}), /* @__PURE__ */ jsxs("div", {
				className: "map-badge",
				style: {
					position: "absolute",
					top: "24px",
					left: "24px",
					background: "#1c1c1c",
					padding: "14px 20px",
					display: "flex",
					alignItems: "center",
					gap: "10px"
				},
				children: [/* @__PURE__ */ jsx("div", { style: {
					width: "8px",
					height: "8px",
					background: "#c8d400",
					flexShrink: 0
				} }), /* @__PURE__ */ jsx("span", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						color: "#fff",
						letterSpacing: "0.5px"
					},
					children: adres.replace("\n", " · ")
				})]
			})]
		})
	});
}
function ContactStrip() {
	const [ref, vis] = useInView$5(.2);
	const { cms } = useCms();
	const c = cms.contact || {};
	const site = cms.site || {};
	const tel = site.tel || c.tel || "+31 (0)165 205 601";
	const email = site.email || c.email || "info@ferroworks.nl";
	const adres = site.adres || c.adres || "Westelijke Havendijk 31\nRoosendaal";
	const items = [
		{
			icon: /* @__PURE__ */ jsx("svg", {
				width: "28",
				height: "28",
				viewBox: "0 0 24 24",
				fill: "none",
				children: /* @__PURE__ */ jsx("path", {
					d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
					stroke: "#c8d400",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			}),
			title: "BELLEN",
			value: tel,
			href: `tel:${tel.replace(/[\s()]/g, "")}`
		},
		{
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "28",
				height: "28",
				viewBox: "0 0 24 24",
				fill: "none",
				children: [/* @__PURE__ */ jsx("path", {
					d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
					stroke: "#c8d400",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}), /* @__PURE__ */ jsx("polyline", {
					points: "22,6 12,13 2,6",
					stroke: "#c8d400",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})]
			}),
			title: "MAILEN",
			value: email,
			href: `mailto:${email}`
		},
		{
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "28",
				height: "28",
				viewBox: "0 0 24 24",
				fill: "none",
				children: [/* @__PURE__ */ jsx("path", {
					d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
					stroke: "#c8d400",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}), /* @__PURE__ */ jsx("circle", {
					cx: "12",
					cy: "10",
					r: "3",
					stroke: "#c8d400",
					strokeWidth: "2"
				})]
			}),
			title: "BEZOEKEN",
			value: adres,
			href: `https://maps.google.com/?q=${encodeURIComponent(adres.replace(/\n/g, " "))}`
		}
	];
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "52px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .cs-item { opacity:0; transform:translateY(16px); transition: opacity .5s ease, transform .5s ease; }
        .cs-on .cs-item:nth-child(1) { opacity:1; transform:none; transition-delay:.0s; }
        .cs-on .cs-item:nth-child(2) { opacity:1; transform:none; transition-delay:.12s; }
        .cs-on .cs-item:nth-child(3) { opacity:1; transform:none; transition-delay:.24s; }
      ` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 contact-strip-grid " + (vis ? "cs-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(3, 1fr)",
				gap: "0",
				alignItems: "stretch"
			},
			children: items.map((item, i) => /* @__PURE__ */ jsxs("a", {
				href: item.href,
				target: item.title === "BEZOEKEN" ? "_blank" : void 0,
				rel: item.title === "BEZOEKEN" ? "noopener noreferrer" : void 0,
				className: "cs-item",
				style: {
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "12px",
					padding: "36px 24px",
					textDecoration: "none",
					borderRight: i < 2 ? "1px solid #333" : "none",
					transition: "background .2s"
				},
				onMouseEnter: (e) => e.currentTarget.style.background = "#252525",
				onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
				children: [
					item.icon,
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							letterSpacing: "1.5px",
							textTransform: "uppercase",
							color: "#888"
						},
						children: item.title
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "15px",
							color: "#fff",
							textAlign: "center",
							whiteSpace: "pre-line",
							lineHeight: 1.5
						},
						children: item.value
					})
				]
			}, i))
		})]
	});
}
function ContactPage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHero$3, {}),
		/* @__PURE__ */ jsx(ContactMain, {}),
		/* @__PURE__ */ jsx(MapSection, {}),
		/* @__PURE__ */ jsx(ContactStrip, {})
	] });
}
//#endregion
//#region src/pages/BlogPage.jsx
var BLOG_FALLBACK_IMAGES$1 = [
	kwaliteitscontrole_lassen_featured_300x225_default,
	Offshore_constructie_300x190_default,
	Afwerking_staalconstructie_met_natlak_300x225_default,
	lascertificaat_verplicht_featured_300x158_default,
	over_ons1_default,
	over_ons2_default
];
function useInView$4(threshold = .1) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
var FALLBACK_POSTS$1 = [
	{
		id: 1,
		category: "Vakmanschap",
		date: "8 april 2026",
		readTime: "4 min",
		title: "Waarom kwaliteitscontrole bij lassen het verschil maakt",
		excerpt: "In de metaalbewerking is lassen een van de meest kritische processen. Een kleine fout in de las kan grote gevolgen hebben voor de veiligheid en levensduur van een constructie. Ontdek hoe FerroWorks kwaliteitscontrole inzet als standaard — niet als uitzondering.",
		img: kwaliteitscontrole_lassen_featured_300x225_default,
		featured: true
	},
	{
		id: 2,
		category: "Offshore",
		date: "1 april 2026",
		readTime: "5 min",
		title: "Staalconstructies voor offshore: eisen en uitdagingen",
		excerpt: "Offshore staalwerk staat bloot aan extreme omstandigheden: zout water, hoge druk en constante mechanische belasting. Wij leggen uit welke materialen en coatings wij inzetten voor duurzame offshore constructies.",
		img: Offshore_constructie_300x190_default,
		featured: false
	},
	{
		id: 3,
		category: "Afwerking",
		date: "24 maart 2026",
		readTime: "3 min",
		title: "Natlak vs. poedercoating: wat past bij uw project?",
		excerpt: "De keuze tussen natlak en poedercoating heeft invloed op zowel de uitstraling als de beschermingsgraad van een staalconstructie. We zetten de voor- en nadelen van beide methoden op een rij.",
		img: Afwerking_staalconstructie_met_natlak_300x225_default,
		featured: false
	},
	{
		id: 4,
		category: "Certificering",
		date: "17 maart 2026",
		readTime: "6 min",
		title: "Lascertificaat verplicht? Alles wat u moet weten over EN-1090",
		excerpt: "Sinds de invoering van de EN-1090 norm is een lascertificaat voor veel staalconstructies verplicht. Maar wat houdt dat precies in, en wanneer is het van toepassing? FerroWorks legt het u helder uit.",
		img: lascertificaat_verplicht_featured_300x158_default,
		featured: false
	},
	{
		id: 5,
		category: "Productie",
		date: "10 maart 2026",
		readTime: "4 min",
		title: "Van tekening tot product: zo werkt ons productieproces",
		excerpt: "Hoe gaat een metaalproject van CAD-tekening naar afgewerkt product? We nemen u stap voor stap mee door het productieproces van FerroWorks: van intake en engineering tot productie, afwerking en montage.",
		img: over_ons1_default,
		featured: false
	},
	{
		id: 6,
		category: "Industrie",
		date: "3 maart 2026",
		readTime: "5 min",
		title: "Maatwerk staal voor de industrie: 5 veelgemaakte fouten vermeden",
		excerpt: "Bij industrieel staalmaatwerk gaat het soms mis — niet door slechte intenties, maar door gebrek aan kennis of slechte communicatie. We bespreken vijf veelgemaakte fouten en hoe u ze kunt voorkomen.",
		img: over_ons2_default,
		featured: false
	}
];
var categories = [
	"Alle",
	"Vakmanschap",
	"Offshore",
	"Afwerking",
	"Certificering",
	"Productie",
	"Industrie"
];
function PageHero$2() {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "340px",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${hero_background_default})`,
				backgroundSize: "cover",
				backgroundPosition: "center right"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "64px",
					paddingBottom: "64px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "24px"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "#c8d400",
									fontSize: "13px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#666",
									fontSize: "13px"
								},
								children: "›"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Blog"
							})
						]
					}),
					/* @__PURE__ */ jsxs("h1", {
						style: {
							margin: "0 0 16px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px, 4vw, 56px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#c8d400" },
							children: "KENNIS & "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#fff" },
							children: "INZICHTEN"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: 0,
							color: "#bbb",
							fontSize: "clamp(14px, 1.6vw, 17px)",
							lineHeight: 1.6,
							maxWidth: "520px"
						},
						children: "Vakartikelen, projectverhalen en technische inzichten vanuit de dagelijkse praktijk van FerroWorks."
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "#c8d400",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function FeaturedPost({ post, imgSrc }) {
	const [ref, vis] = useInView$4();
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .fp-left  { opacity:0; transform:translateX(-32px); transition: opacity .65s ease, transform .65s ease; }
        .fp-right { opacity:0; transform:translateX(32px);  transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .fp-on .fp-left, .fp-on .fp-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .fp-grid { grid-template-columns: 1fr !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 fp-grid " + (vis ? "fp-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1.2fr 1fr",
				gap: "64px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "fp-left",
				style: {
					position: "relative",
					overflow: "hidden"
				},
				children: [
					/* @__PURE__ */ jsx("div", { style: {
						position: "absolute",
						top: "-12px",
						left: "-12px",
						width: "64px",
						height: "64px",
						background: "#c8d400",
						zIndex: 0
					} }),
					/* @__PURE__ */ jsx("img", {
						className: "fp-image",
						src: imgSrc,
						alt: post.title,
						style: {
							position: "relative",
							zIndex: 1,
							width: "100%",
							height: "400px",
							objectFit: "cover",
							display: "block",
							boxShadow: "0 8px 32px rgba(0,0,0,0.14)"
						}
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							position: "absolute",
							bottom: "20px",
							left: "20px",
							zIndex: 2,
							background: "#c8d400",
							padding: "6px 14px"
						},
						children: /* @__PURE__ */ jsx("span", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "11px",
								textTransform: "uppercase",
								letterSpacing: "1px",
								color: "#1c1c1c"
							},
							children: "Uitgelicht"
						})
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "fp-right",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "fp-meta",
						style: {
							display: "flex",
							alignItems: "center",
							gap: "12px",
							marginBottom: "16px"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								style: {
									background: "#1c1c1c",
									color: "#c8d400",
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "10px",
									letterSpacing: "1.5px",
									textTransform: "uppercase",
									padding: "4px 10px"
								},
								children: post.category
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px"
								},
								children: post.date
							}),
							/* @__PURE__ */ jsxs("span", {
								style: {
									color: "#aaa",
									fontSize: "13px"
								},
								children: [
									"· ",
									post.readTime,
									" leestijd"
								]
							})
						]
					}),
					/* @__PURE__ */ jsx("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(20px, 2.4vw, 28px)",
							lineHeight: 1.15,
							letterSpacing: "-0.3px",
							color: "#1c1c1c",
							textTransform: "uppercase",
							margin: "0 0 20px 0"
						},
						children: post.title
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: "0 0 32px 0"
						},
						children: post.excerpt
					}),
					/* @__PURE__ */ jsx(Link, {
						to: `/blog/${post.slug || post.id}`,
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "#c8d400",
							padding: "16px 32px",
							textDecoration: "none",
							display: "inline-block",
							transition: "background .2s"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
						onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
						children: "LEES ARTIKEL"
					})
				]
			})]
		})]
	});
}
function BlogCard({ post, imgSrc, delay = 0 }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "blog-card",
		style: {
			background: "#fff",
			display: "flex",
			flexDirection: "column",
			boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
			transition: "transform .25s ease, box-shadow .25s ease",
			animationDelay: `${delay}s`
		},
		onMouseEnter: (e) => {
			e.currentTarget.style.transform = "translateY(-4px)";
			e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.11)";
		},
		onMouseLeave: (e) => {
			e.currentTarget.style.transform = "translateY(0)";
			e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				position: "relative",
				overflow: "hidden",
				height: "200px"
			},
			children: [/* @__PURE__ */ jsx("img", {
				src: imgSrc,
				alt: post.title,
				style: {
					width: "100%",
					height: "100%",
					objectFit: "cover",
					display: "block",
					transition: "transform .4s ease"
				},
				onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.04)",
				onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					position: "absolute",
					top: "14px",
					left: "14px",
					background: "#c8d400",
					padding: "4px 10px"
				},
				children: /* @__PURE__ */ jsx("span", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "10px",
						textTransform: "uppercase",
						letterSpacing: "1px",
						color: "#1c1c1c"
					},
					children: post.category
				})
			})]
		}), /* @__PURE__ */ jsxs("div", {
			style: {
				padding: "28px 24px",
				display: "flex",
				flexDirection: "column",
				flex: 1
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "blog-meta",
					style: {
						display: "flex",
						gap: "12px",
						marginBottom: "12px"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: {
							color: "#aaa",
							fontSize: "12px"
						},
						children: post.date
					}), /* @__PURE__ */ jsxs("span", {
						style: {
							color: "#aaa",
							fontSize: "12px"
						},
						children: [
							"· ",
							post.readTime,
							" leestijd"
						]
					})]
				}),
				/* @__PURE__ */ jsx("h3", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "16px",
						lineHeight: 1.25,
						letterSpacing: "-0.2px",
						color: "#1c1c1c",
						textTransform: "uppercase",
						margin: "0 0 14px 0"
					},
					children: post.title
				}),
				/* @__PURE__ */ jsxs("p", {
					style: {
						color: "#777",
						fontSize: "13.5px",
						lineHeight: 1.7,
						margin: "0 0 24px 0",
						flex: 1
					},
					children: [post.excerpt.substring(0, 120), "..."]
				}),
				/* @__PURE__ */ jsxs(Link, {
					to: `/blog/${post.slug || post.id}`,
					style: {
						display: "inline-flex",
						alignItems: "center",
						gap: "6px",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						color: "#c8d400",
						textDecoration: "none",
						marginTop: "auto"
					},
					onMouseEnter: (e) => e.currentTarget.style.gap = "10px",
					onMouseLeave: (e) => e.currentTarget.style.gap = "6px",
					children: ["LEES MEER", /* @__PURE__ */ jsx("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						children: /* @__PURE__ */ jsx("path", {
							d: "M5 12h14M12 5l7 7-7 7",
							stroke: "#c8d400",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})]
				})
			]
		})]
	});
}
function BlogGrid({ posts }) {
	const [ref, vis] = useInView$4(.05);
	const [activeCategory, setActiveCategory] = useState("Alle");
	const filtered = activeCategory === "Alle" ? posts.filter((p) => !p.featured) : posts.filter((p) => !p.featured && p.category === activeCategory);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .bg-grid { opacity:0; transform:translateY(24px); transition: opacity .6s ease, transform .6s ease; }
        .bg-on .bg-grid { opacity:1; transform:none; }
        .cat-btn { background: transparent; border: 1.5px solid #ddd; cursor: pointer; transition: all .2s; }
        .cat-btn:hover { border-color: #c8d400; color: #1c1c1c !important; }
        .cat-btn.active { background: #c8d400 !important; border-color: #c8d400 !important; color: #1c1c1c !important; }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "bg-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "flex-end",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "20px",
					marginBottom: "48px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					style: {
						margin: "0 0 10px 0",
						color: "#c8d400",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						letterSpacing: "2px",
						textTransform: "uppercase"
					},
					children: "ALLE ARTIKELEN"
				}), /* @__PURE__ */ jsxs("h2", {
					style: {
						margin: 0,
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(22px, 2.4vw, 30px)",
						textTransform: "uppercase",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#1c1c1c" },
						children: "RECENTE "
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "PUBLICATIES"
					})]
				})] }), /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexWrap: "wrap",
						gap: "8px"
					},
					children: categories.map((cat) => /* @__PURE__ */ jsx("button", {
						onClick: () => setActiveCategory(cat),
						className: "cat-btn" + (activeCategory === cat ? " active" : ""),
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "0.8px",
							textTransform: "uppercase",
							color: activeCategory === cat ? "#1c1c1c" : "#777",
							padding: "8px 16px"
						},
						children: cat
					}, cat))
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "bg-grid fw-three-col-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "28px"
				},
				children: filtered.length > 0 ? filtered.map((post, i) => /* @__PURE__ */ jsx(BlogCard, {
					post,
					imgSrc: post.image || BLOG_FALLBACK_IMAGES$1[i % BLOG_FALLBACK_IMAGES$1.length],
					delay: i * .1
				}, post.id)) : /* @__PURE__ */ jsx("div", {
					style: {
						gridColumn: "1 / -1",
						textAlign: "center",
						padding: "60px 0",
						color: "#aaa",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontSize: "14px",
						textTransform: "uppercase",
						letterSpacing: "1px"
					},
					children: "Geen artikelen gevonden in deze categorie."
				})
			})]
		})]
	});
}
function NewsletterCta() {
	const [ref, vis] = useInView$4(.2);
	const [email, setEmail] = useState("");
	const [done, setDone] = useState(false);
	const [error, setError] = useState("");
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			await api.subscribeNewsletter(email);
			setDone(true);
			setError("");
		} catch (err) {
			setError(err.message || "Inschrijven mislukt.");
		}
	}
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .nl-inner { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .nl-on .nl-inner { opacity:1; transform:none; }
      ` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "nl-on" : ""),
			children: /* @__PURE__ */ jsxs("div", {
				className: "nl-inner",
				style: {
					maxWidth: "600px",
					margin: "0 auto",
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "#c8d400",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "BLIJF OP DE HOOGTE"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.4vw, 30px)",
							textTransform: "uppercase",
							lineHeight: 1.1,
							letterSpacing: "-0.3px",
							color: "#fff",
							margin: "0 0 16px 0"
						},
						children: ["ONTVANG ONZE ", /* @__PURE__ */ jsx("span", {
							style: { color: "#c8d400" },
							children: "NIEUWSBRIEF"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#888",
							fontSize: "15px",
							lineHeight: 1.6,
							margin: "0 0 32px 0"
						},
						children: "Nieuwe artikelen, projectupdates en technische tips — direct in uw inbox."
					}),
					done ? /* @__PURE__ */ jsx("div", {
						style: {
							background: "#252525",
							borderLeft: "4px solid #c8d400",
							padding: "20px 24px",
							textAlign: "left"
						},
						children: /* @__PURE__ */ jsx("span", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "14px",
								color: "#fff",
								textTransform: "uppercase"
							},
							children: "Inschrijving gelukt! ✓"
						})
					}) : /* @__PURE__ */ jsxs("form", {
						className: "nl-form",
						onSubmit: handleSubmit,
						style: {
							display: "flex",
							gap: "0",
							maxWidth: "480px",
							margin: "0 auto"
						},
						children: [/* @__PURE__ */ jsx("input", {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "uw@email.nl",
							required: true,
							style: {
								flex: 1,
								background: "#2a2a2a",
								border: "1.5px solid #444",
								borderRight: "none",
								padding: "16px 18px",
								fontSize: "14px",
								color: "#fff",
								fontFamily: "Arial, sans-serif",
								outline: "none"
							},
							onFocus: (e) => e.currentTarget.style.borderColor = "#c8d400",
							onBlur: (e) => e.currentTarget.style.borderColor = "#444"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							style: {
								background: "#c8d400",
								border: "none",
								padding: "16px 28px",
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "12px",
								textTransform: "uppercase",
								letterSpacing: "0.8px",
								color: "#1c1c1c",
								cursor: "pointer",
								transition: "background .2s",
								flexShrink: 0
							},
							onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
							onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
							children: "INSCHRIJVEN"
						})]
					}),
					error && /* @__PURE__ */ jsx("p", {
						style: {
							color: "#fca5a5",
							fontSize: "13px",
							marginTop: "14px"
						},
						children: error
					})
				]
			})
		})]
	});
}
function CtaStrip$2() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "48px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "24px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(18px, 2.2vw, 26px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 8px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["EEN PROJECT IN ", /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "GEDACHTEN?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#888",
						fontSize: "14px",
						margin: 0
					},
					children: "Neem contact op — wij denken graag met u mee."
				})] }), /* @__PURE__ */ jsx(Link, {
					to: "/contact",
					className: "fw-primary-action",
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "13px",
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						color: "#1c1c1c",
						background: "#c8d400",
						padding: "16px 32px",
						textDecoration: "none",
						display: "inline-block",
						transition: "background .2s",
						flexShrink: 0
					},
					onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
					onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
					children: "NEEM CONTACT OP"
				})]
			})
		})
	});
}
function BlogPage() {
	const { cms } = useCms();
	const posts = cms.blog && cms.blog.length ? cms.blog : FALLBACK_POSTS$1;
	const featIdx = posts.findIndex((p) => p.featured);
	const featured = featIdx >= 0 ? posts[featIdx] : null;
	const featuredImgSrc = featured ? featured.image || BLOG_FALLBACK_IMAGES$1[0] : null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHero$2, {}),
		featured && /* @__PURE__ */ jsx(FeaturedPost, {
			post: featured,
			imgSrc: featuredImgSrc
		}),
		/* @__PURE__ */ jsx(BlogGrid, { posts }),
		/* @__PURE__ */ jsx(NewsletterCta, {}),
		/* @__PURE__ */ jsx(CtaStrip$2, {})
	] });
}
//#endregion
//#region src/components/RichTextContent.jsx
function sanitizeRichText(html) {
	return (html || "").replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "").replace(/\son\w+="[^"]*"/gi, "").replace(/\son\w+='[^']*'/gi, "").replace(/javascript:/gi, "");
}
function stripHtml(value) {
	return (value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function RichTextContent({ html, className = "", style }) {
	return /* @__PURE__ */ jsx("div", {
		className,
		style,
		dangerouslySetInnerHTML: { __html: sanitizeRichText(html) }
	});
}
//#endregion
//#region src/pages/BlogDetailPage.jsx
var BLOG_FALLBACK_IMAGES = [
	kwaliteitscontrole_lassen_featured_300x225_default,
	Offshore_constructie_300x190_default,
	Afwerking_staalconstructie_met_natlak_300x225_default,
	lascertificaat_verplicht_featured_300x158_default,
	over_ons1_default,
	over_ons2_default
];
function useInView$3(threshold = .1) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
var FALLBACK_POSTS = [
	{
		id: 1,
		category: "Vakmanschap",
		date: "8 april 2026",
		readTime: "4 min",
		title: "Waarom kwaliteitscontrole bij lassen het verschil maakt",
		excerpt: "In de metaalbewerking is lassen een van de meest kritische processen. Een kleine fout in de las kan grote gevolgen hebben voor de veiligheid en levensduur van een constructie. Ontdek hoe FerroWorks kwaliteitscontrole inzet als standaard — niet als uitzondering.",
		img: kwaliteitscontrole_lassen_featured_300x225_default,
		featured: true,
		body: [
			{
				type: "intro",
				text: "Lassen is het hart van elke staalconstructie. Of het nu gaat om een industriële installatie, een offshore platform of een architectonische trap — de kwaliteit van de las bepaalt in grote mate hoe lang een constructie meegaat en hoe veilig die is. Bij FerroWorks behandelen we kwaliteitscontrole niet als een afsluiting van het productieproces, maar als een rode draad die door het hele traject loopt."
			},
			{
				type: "h2",
				text: "Wat kan er misgaan bij lassen?"
			},
			{ text: "Een onvolledige doorlassing, poreusheid in het lasmateriaal of een verkeerde electrodekeuze — het zijn fouten die met het blote oog niet altijd zichtbaar zijn, maar die onder belasting tot breuk kunnen leiden. Met name bij constructies die dynamische krachten opvangen, zoals kabelgoten, hefconstructies of dragende balken, is een tekortkoming in de las een veiligheidsrisico." },
			{
				type: "h2",
				text: "Hoe werkt kwaliteitscontrole bij FerroWorks?"
			},
			{ text: "Ons kwaliteitsproces bestaat uit meerdere lagen. Elke lasser die bij FerroWorks werkt, is gecertificeerd en werkt volgens vastgestelde lasprocedures (WPS). Tijdens productie worden lasnaden visueel beoordeeld en indien vereist getest via niet-destructief onderzoek (NDO) — zoals magnetisch poederonderzoek, penetrantonderzoek of ultrageluidsinspectie." },
			{
				type: "bullets",
				items: [
					"Gecertificeerde lassers conform EN-1090 en VCA",
					"Vastgestelde lasprocedures (WPS) per project",
					"Visuele inspectie na elke lasstap",
					"NDO-testen waar van toepassing",
					"Digitale laslogboeken per constructie"
				]
			},
			{
				type: "h2",
				text: "Waarom EN-1090 zo belangrijk is"
			},
			{ text: "De EN-1090 norm stelt minimumeisen aan de uitvoering van staal- en aluminiumconstructies die op de Europese markt worden gebracht. Voor FerroWorks is dit no-nonsense vakwerk: we werken standaard volgens deze norm, ongeacht of een klant er expliciet om vraagt. Dat zorgt voor een consistent, controleerbaar niveau van uitvoering bij elk project." },
			{
				type: "quote",
				text: "Kwaliteit zit niet in de afronding — het zit in elke stap van het proces."
			},
			{
				type: "h2",
				text: "Wat betekent dit voor uw project?"
			},
			{ text: "Als u een project uitbesteedt aan FerroWorks, weet u dat elke las gedocumenteerd is, dat onze lassers gecertificeerd zijn en dat er een duidelijk kwaliteitsprotocol achter uw product zit. Geen verrassingen achteraf, geen discussies over aansprakelijkheid. Gewoon degelijk vakwerk dat u kunt vertrouwen." }
		],
		tags: [
			"Kwaliteit",
			"Lassen",
			"EN-1090",
			"Vakmanschap"
		]
	},
	{
		id: 2,
		category: "Offshore",
		date: "1 april 2026",
		readTime: "5 min",
		title: "Staalconstructies voor offshore: eisen en uitdagingen",
		excerpt: "Offshore staalwerk staat bloot aan extreme omstandigheden: zout water, hoge druk en constante mechanische belasting. Wij leggen uit welke materialen en coatings wij inzetten voor duurzame offshore constructies.",
		img: Offshore_constructie_300x190_default,
		featured: false,
		body: [
			{
				type: "intro",
				text: "De offshore-industrie stelt extreem hoge eisen aan staalconstructies. Waar landgebonden constructies doorgaans beschermd zijn tegen de ergste weersinvloeden, worden offshore constructies continu blootgesteld aan zeewatercorrosie, hoge windkrachten, dynamische belastingen en temperatuurwisselingen. FerroWorks heeft jarenlange ervaring met maatwerk staalwerk voor maritieme en offshore toepassingen."
			},
			{
				type: "h2",
				text: "De vijf grootste uitdagingen bij offshore staalwerk"
			},
			{
				type: "bullets",
				items: [
					"Corrosie door zout zeewatermilieu",
					"Dynamische belastingen door golven en trillingen",
					"Extreme temperatuurwisselingen tussen dag en nacht",
					"Zware montageomstandigheden op locatie",
					"Strenge certificeringseisen (DNVGL, Lloyd's, etc.)"
				]
			},
			{
				type: "h2",
				text: "Materiaalkeuze: staal, RVS of duplex?"
			},
			{ text: "Voor offshore toepassingen is de materiaalkeuze cruciaal. Gewoon constructiestaal (S235 of S355) is prima voor constructies die goed beschermd worden met coatings en regelmatig onderhoud krijgen. RVS (AISI 316L) biedt betere corrosiebestendigheid maar is zwaarder en duurder. Duplex roestvast staal combineert de sterkte van constructiestaal met de corrosiebestendigheid van RVS — ideaal voor kritische offshore componenten." },
			{
				type: "h2",
				text: "Coating en corrosiebescherming"
			},
			{ text: "Een goede coating is onmisbaar bij offshore staalwerk. Wij werken met meerlaagse sytemen: een zinkrijke grondlaag, een epoxy-midcoat en een polyurethaan-topcoat. Dit systeem voldoet aan de corrosiviteitscategorie C5 (mariene omgeving) zoals beschreven in ISO 12944. De voorbereiding van het staaloppervlak — staalstralen tot Sa2,5 — is minstens zo belangrijk als de coating zelf." },
			{
				type: "quote",
				text: "Een offshore constructie is zo sterk als zijn zwakste las — en zo duurzaam als zijn coating."
			},
			{
				type: "h2",
				text: "FerroWorks en offshore: wat wij bieden"
			},
			{ text: "Van het ontwerp en engineering op basis van uw specificaties, tot de productie, coatingbehandeling en levering kant-en-klaar op uw locatie. Wij werken nauw samen met onze opdrachtgevers en hun inspectie-engineers om te zorgen dat elk onderdeel aan de gestelde eisen voldoet. Documentatie, materiaalcertificaten en inspectierapporten worden standaard meegeleverd." }
		],
		tags: [
			"Offshore",
			"Corrosie",
			"Coating",
			"Maritiem"
		]
	},
	{
		id: 3,
		category: "Afwerking",
		date: "24 maart 2026",
		readTime: "3 min",
		title: "Natlak vs. poedercoating: wat past bij uw project?",
		excerpt: "De keuze tussen natlak en poedercoating heeft invloed op zowel de uitstraling als de beschermingsgraad van een staalconstructie. We zetten de voor- en nadelen van beide methoden op een rij.",
		img: Afwerking_staalconstructie_met_natlak_300x225_default,
		featured: false,
		body: [
			{
				type: "intro",
				text: "Wanneer uw staalconstructie klaar is voor de afwerking, staat u voor een belangrijke keuze: natlak of poedercoating? Beide methoden bieden uitstekende bescherming, maar ze verschillen in toepassing, uitstraling en geschiktheid voor specifieke situaties. In dit artikel zetten we de voornaamste verschillen op een rij, zodat u samen met FerroWorks de juiste keuze kunt maken."
			},
			{
				type: "h2",
				text: "Wat is poedercoating?"
			},
			{ text: "Poedercoating is een droog verfproces waarbij kleurpoeder elektrostatisch op het metaal wordt aangebracht en vervolgens wordt uitgehard in een oven (180–200 °C). Het resultaat is een egale, harde laag die krasbestendig en milieuvriendelijk is (geen oplosmiddelen). Poedercoating is bij uitstek geschikt voor geveltoepassingen, hekwerken, sporttoestellen en binnendeuren." },
			{
				type: "h2",
				text: "Wat is natlak?"
			},
			{ text: "Natlak (vloeibare verf) wordt aangebracht via spuiten, kwast of roller. Het droogt door verdamping van oplosmiddelen of door chemische uitharding (2K-systemen). Natlak is flexibeler qua toepasbaarheid: het werkt ook op grote constructies die niet in een oven passen, complexe geometrieën en herstellingen in het veld." },
			{
				type: "bullets",
				items: [
					"Poedercoating: ideaal voor seriematige productie in standaardmaten",
					"Natlak: noodzakelijk voor grote of complexe constructies",
					"Poedercoating: egaler en krasbestendiger oppervlak",
					"Natlak: geschikt voor C4/C5 corrosiviteitscategorieën (industrieel, offshore)",
					"Natlak: makkelijker te herstellen ter plaatse"
				]
			},
			{
				type: "h2",
				text: "Wanneer kiest u voor welke methode?"
			},
			{ text: "De vuistregel is simpel: past het in de oven? Dan is poedercoating doorgaans de beste keuze voor binnenwerk, lichte construties en gevelelementen. Voor zware staaldelen, buitentoepassingen in agressieve omgevingen of grote constructies die niet verplaatst kunnen worden, is natlak de aangewezen route." },
			{
				type: "quote",
				text: "De beste coating is degene die aansluit op de omgeving, het gebruik en het budget van uw project."
			}
		],
		tags: [
			"Afwerking",
			"Coating",
			"Poedercoating",
			"Natlak"
		]
	},
	{
		id: 4,
		category: "Certificering",
		date: "17 maart 2026",
		readTime: "6 min",
		title: "Lascertificaat verplicht? Alles wat u moet weten over EN-1090",
		excerpt: "Sinds de invoering van de EN-1090 norm is een lascertificaat voor veel staalconstructies verplicht. Maar wat houdt dat precies in, en wanneer is het van toepassing? FerroWorks legt het u helder uit.",
		img: lascertificaat_verplicht_featured_300x158_default,
		featured: false,
		body: [
			{
				type: "intro",
				text: "Steeds vaker krijgen wij de vraag: 'Is een lascertificaat verplicht voor mijn project?' Het antwoord hangt af van het type constructie en de toepassing — maar in veel gevallen is het antwoord simpelweg: ja. De Europese norm EN-1090 regelt de uitvoering van staal- en aluminiumconstructies en stelt eisen aan zowel het bedrijf als de individuele lassers. In dit artikel leggen we het u stap voor stap uit."
			},
			{
				type: "h2",
				text: "Wat is EN-1090?"
			},
			{ text: "EN-1090 is de Europese norm voor de fabricage van staal- en aluminiumconstructies. De norm bestaat uit twee delen: EN-1090-1 (CE-markering en conformiteitsbeoordeling) en EN-1090-2 (technische eisen voor staalconstructies). Een bedrijf dat CE-gemarkeerde staalconstructies op de Europese markt wil brengen, moet gecertificeerd zijn conform EN-1090-1." },
			{
				type: "h2",
				text: "Voor welke constructies is het verplicht?"
			},
			{ text: "De CE-markering op basis van EN-1090 is verplicht voor constructieve staalproducten die vallen onder de Europese Bouwproductenverordening (CPR). Concreet gaat het om dragende elementen zoals kolommen, liggers, vakwerkspanten, trappen en balustrades die deel uitmaken van gebouwen of civieltechnische werken." },
			{
				type: "bullets",
				items: [
					"Dragende staalconstructies in gebouwen (EXC2 of hoger)",
					"Bruggen en civieltechnische constructies",
					"Industriële platforms en loopbruggen",
					"Trappen en balustrades als constructief element",
					"Offshore- en industriële constructies met hoge veiligheidseisen"
				]
			},
			{
				type: "h2",
				text: "Uitvoeringsklassen: EXC1 t/m EXC4"
			},
			{ text: "De norm kent vier uitvoeringsklassen (EXC1 t/m EXC4), waarbij EXC1 de laagste eisen stelt en EXC4 de hoogste. De keuze van de uitvoeringsklasse hangt af van de gevolgklasse (consequence class) van de constructie: hoe groter de gevolgen bij falen, hoe hoger de klasse. Voor de meeste industriële en utiliteitsbouwprojecten geldt EXC2 als standaard." },
			{
				type: "quote",
				text: "FerroWorks is gecertificeerd voor uitvoeringsklassen EXC1 en EXC2 — de meest voorkomende klassen in bouw, industrie en architectuur."
			},
			{
				type: "h2",
				text: "Wat betekent dit voor u als opdrachtgever?"
			},
			{ text: "Als u een gecertificeerd bedrijf inschakelt zoals FerroWorks, ontvangt u bij oplevering een volledige CE-verklaring van prestatie (DoP) met bijbehorende documentatie. Dit beschermt u als opdrachtgever juridisch en garandeert dat de constructie voldoet aan de Europese veiligheidseisen." }
		],
		tags: [
			"EN-1090",
			"Certificering",
			"CE-markering",
			"Uitvoeringsklassen"
		]
	},
	{
		id: 5,
		category: "Productie",
		date: "10 maart 2026",
		readTime: "4 min",
		title: "Van tekening tot product: zo werkt ons productieproces",
		excerpt: "Hoe gaat een metaalproject van CAD-tekening naar afgewerkt product? We nemen u stap voor stap mee door het productieproces van FerroWorks: van intake en engineering tot productie, afwerking en montage.",
		img: over_ons1_default,
		featured: false,
		body: [
			{
				type: "intro",
				text: "Een metaalproject bouwen is meer dan knippen, lassen en lakken. Achter elk FerroWorks-product zit een gestructureerd proces dat begint op het moment dat u contact met ons opneemt — en eindigt pas als uw constructie gemonteerd, geïnspecteerd en opgeleverd is. In dit artikel nemen we u mee door onze werkwijze."
			},
			{
				type: "h2",
				text: "Stap 1: Intake en offerte"
			},
			{ text: "Elk project begint met een gesprek. We willen begrijpen wat u nodig heeft: de toepassing, de omgeving, de belastingen en uw budget. Op basis hiervan stellen wij een heldere offerte op met vaste prijs, duidelijke scope en realistische planning. Geen verrassingen achteraf." },
			{
				type: "h2",
				text: "Stap 2: Engineering en tekeningen"
			},
			{ text: "Na akkoord op de offerte start onze engineeringsafdeling met het uitwerken van de productietekeningen. We werken met moderne CAD-software en stemmen de tekeningen af met uw ontwerper of constructeur. Pas als u de tekeningen goedkeurt, gaan we de productie in." },
			{
				type: "h2",
				text: "Stap 3: Productie"
			},
			{ text: "In onze eigen werkplaats in Roosendaal beschikken we over moderne zaagmachines, lasersnijders, knipmachines, lasmachines en buigapparatuur. We werken met staal, RVS en aluminium en produceren alles in eigen beheer — geen uitbesteding, volledige controle." },
			{
				type: "bullets",
				items: [
					"Zaag- en laserwerkzaamheden in eigen beheer",
					"Gecertificeerd laswerk conform EN-1090",
					"Bewerkingen voor RVS, staal en aluminium",
					"Kwaliteitscontrole tijdens en na productie"
				]
			},
			{
				type: "h2",
				text: "Stap 4: Afwerking en coating"
			},
			{ text: "Na productie volgt de oppervlaktebehandeling: stralen, gronden, natlakken of poedercoaten. We adviseren u over de meest geschikte methode op basis van de toepassing en omgevingscondities. Alle coatings worden aangebracht conform de geldende normen." },
			{
				type: "h2",
				text: "Stap 5: Montage en oplevering"
			},
			{ text: "Onze montageploeg plaatst de constructie op uw locatie. Na montage volgt een eindinspectie en ontvangen u een volledig opleverdossier: tekeningen, materiaalcertificaten, laskwaliteitsrapporten en — indien van toepassing — een CE-verklaring." },
			{
				type: "quote",
				text: "Eén aanspreekpunt, van eerste schets tot laatste bout. Dat is de FerroWorks-werkwijze."
			}
		],
		tags: [
			"Productie",
			"Werkwijze",
			"Engineering",
			"Montage"
		]
	},
	{
		id: 6,
		category: "Industrie",
		date: "3 maart 2026",
		readTime: "5 min",
		title: "Maatwerk staal voor de industrie: 5 veelgemaakte fouten vermeden",
		excerpt: "Bij industrieel staalmaatwerk gaat het soms mis — niet door slechte intenties, maar door gebrek aan kennis of slechte communicatie. We bespreken vijf veelgemaakte fouten en hoe u ze kunt voorkomen.",
		img: over_ons2_default,
		featured: false,
		body: [
			{
				type: "intro",
				text: "Industrieel staalmaatwerk is complex. Er zijn veel partijen bij betrokken — opdrachtgevers, constructeurs, uitvoerders, toeleveranciers — en elke schakel kan een foutbron zijn. In onze jarenlange praktijk bij FerroWorks hebben we bepaalde patronen zien terugkomen. In dit artikel bespreken we vijf veelgemaakte fouten en hoe u ze kunt voorkomen."
			},
			{
				type: "h2",
				text: "Fout 1: Onvolledige of vage specificaties"
			},
			{ text: "De meest voorkomende oorzaak van meerkosten en vertraging is een onvolledige opdracht. 'Zo sterk als nodig' of 'standaard kwaliteit' zijn geen bruikbare specificaties voor een staalconstructie. Definieer vooraf: het materiaaltype (staal/RVS/alu), de belastingen, de omgeving, de uitvoeringsklasse (EXC) en de coatingeis." },
			{
				type: "h2",
				text: "Fout 2: Certificering vergeten"
			},
			{ text: "Pas als de constructie al gebouwd is, blijkt dat er een EN-1090-certificaat vereist is. Dit leidt in het beste geval tot extra documentatiewerk — in het slechtste geval tot herbouw. Check vooraf of uw constructie CE-markering vereist en of uw leverancier gecertificeerd is." },
			{
				type: "h2",
				text: "Fout 3: Geen rekening houden met montageomstandigheden"
			},
			{ text: "Een constructie die in de werkplaats perfect past, past niet door de toegangsdeur van de fabriek. Of de liftcapaciteit op locatie is onvoldoende. Denk al in de engineeringsfase na over transport, kraaninzet, toegankelijkheid en montagevolgorde." },
			{
				type: "h2",
				text: "Fout 4: Coating kiezen op basis van prijs alleen"
			},
			{ text: "Een goedkope coating die na twee jaar loslaat, is duurder dan een degelijk systeem dat tien jaar meegaat. De coatingkeuze hangt af van de omgeving (C1–C5), de gewenste levensduur en het onderhoudsprofiel. Vraag advies — het betaalt zichzelf terug." },
			{
				type: "h2",
				text: "Fout 5: Één leverancier met alles uitbesteden zonder controle"
			},
			{ text: "Vertrouwen is goed, controle is beter. Een goede leverancier verwelkomt tussentijdse inspecties, levert materiaalcertificaten en rapporteert transparant over afwijkingen. Als een partij dit niet doet, is dat een waarschuwingssignaal." },
			{
				type: "bullets",
				items: [
					"Vraag altijd om materiaalcertificaten (EN 10204 3.1 of 3.2)",
					"Laat lasrapporten overleggen bij certificeringsplichtige constructies",
					"Plan een tussentijdse inspectie in de productie",
					"Controleer coatingdikte na oplevering met een meetapparaat"
				]
			},
			{
				type: "quote",
				text: "Goede communicatie en heldere afspraken zijn de beste bescherming tegen kostbare fouten."
			}
		],
		tags: [
			"Industrie",
			"Maatwerk",
			"Kwaliteit",
			"Tips"
		]
	}
];
function PostHero({ post, imgSrc }) {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "400px",
			display: "flex",
			alignItems: "flex-end",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${imgSrc})`,
				backgroundSize: "cover",
				backgroundPosition: "center"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(0deg, rgba(20,22,22,0.97) 0%, rgba(20,22,22,0.7) 50%, rgba(20,22,22,0.35) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingBottom: "56px",
					paddingTop: "96px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "20px",
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "#c8d400",
									fontSize: "12px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "12px"
								},
								children: "›"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/blog",
								style: {
									color: "#c8d400",
									fontSize: "12px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Blog"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "12px"
								},
								children: "›"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#888",
									fontSize: "12px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: post.category
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: { marginBottom: "16px" },
						children: /* @__PURE__ */ jsx("span", {
							style: {
								background: "#c8d400",
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "10px",
								letterSpacing: "1.5px",
								textTransform: "uppercase",
								color: "#1c1c1c",
								padding: "5px 12px"
							},
							children: post.category
						})
					}),
					/* @__PURE__ */ jsx("h1", {
						style: {
							margin: "0 0 20px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(24px, 3.5vw, 48px)",
							lineHeight: 1.08,
							letterSpacing: "-0.5px",
							textTransform: "uppercase",
							color: "#fff",
							maxWidth: "820px"
						},
						children: post.title
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "20px",
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#888",
									fontSize: "13px"
								},
								children: post.date
							}),
							/* @__PURE__ */ jsx("span", { style: {
								width: "4px",
								height: "4px",
								background: "#c8d400",
								borderRadius: "50%",
								flexShrink: 0
							} }),
							/* @__PURE__ */ jsxs("span", {
								style: {
									color: "#888",
									fontSize: "13px"
								},
								children: [post.readTime, " leestijd"]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "#c8d400",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function ArticleBody({ post, allPosts }) {
	const [ref, vis] = useInView$3(.05);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
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
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 ab-layout " + (vis ? "ab-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 340px",
				gap: "64px",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsxs("article", {
				className: "ab-wrap ab-body",
				children: [typeof post.body === "string" ? /<[^>]+>/.test(post.body) ? /* @__PURE__ */ jsx(RichTextContent, { html: post.body }) : post.body.split("\n\n").map((paragraph, i) => i === 0 ? /* @__PURE__ */ jsx("p", {
					className: "intro-p",
					children: paragraph
				}, i) : /* @__PURE__ */ jsx("p", { children: paragraph }, i)) : post.body.map((block, i) => {
					if (block.type === "intro") return /* @__PURE__ */ jsx("p", {
						className: "intro-p",
						children: block.text
					}, i);
					if (block.type === "h2") return /* @__PURE__ */ jsx("h2", { children: block.text }, i);
					if (block.type === "quote") return /* @__PURE__ */ jsxs("blockquote", { children: [
						"\"",
						block.text,
						"\""
					] }, i);
					if (block.type === "bullets") return /* @__PURE__ */ jsx("ul", { children: block.items.map((item, j) => /* @__PURE__ */ jsx("li", { children: item }, j)) }, i);
					return /* @__PURE__ */ jsx("p", { children: block.text }, i);
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						marginTop: "48px",
						paddingTop: "32px",
						borderTop: "1.5px solid #e0e0e0"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "1.5px",
							textTransform: "uppercase",
							color: "#aaa",
							marginRight: "12px"
						},
						children: "Tags:"
					}), (post.tags || []).map((tag, i) => /* @__PURE__ */ jsx("span", {
						style: {
							display: "inline-block",
							background: "#e8e8e8",
							color: "#555",
							fontSize: "12px",
							fontWeight: 700,
							padding: "4px 12px",
							marginRight: "8px",
							marginBottom: "8px",
							letterSpacing: "0.3px"
						},
						children: tag
					}, i))]
				})]
			}), /* @__PURE__ */ jsx(Sidebar$2, {
				post,
				allPosts
			})]
		})]
	});
}
function Sidebar$2({ post, allPosts }) {
	const others = allPosts.filter((p) => p.id !== post.id).slice(0, 3);
	return /* @__PURE__ */ jsxs("aside", {
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "32px"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "#1c1c1c",
					padding: "28px 24px"
				},
				children: [
					/* @__PURE__ */ jsxs("h3", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "14px",
							textTransform: "uppercase",
							letterSpacing: "-0.1px",
							color: "#fff",
							margin: "0 0 12px 0",
							lineHeight: 1.2
						},
						children: ["EEN PROJECT ", /* @__PURE__ */ jsx("span", {
							style: { color: "#c8d400" },
							children: "IN GEDACHTEN?"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#888",
							fontSize: "13px",
							lineHeight: 1.6,
							margin: "0 0 20px 0"
						},
						children: "Neem contact op met ons team. We reageren binnen 24 uur."
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							display: "block",
							textAlign: "center",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "#c8d400",
							padding: "14px 20px",
							textDecoration: "none",
							transition: "background .2s"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
						onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
						children: "NEEM CONTACT OP"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fff",
					padding: "24px",
					borderTop: "4px solid #c8d400"
				},
				children: [/* @__PURE__ */ jsx("h4", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						letterSpacing: "1px",
						color: "#1c1c1c",
						margin: "0 0 16px 0"
					},
					children: "DIRECT CONTACT"
				}), /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "10px"
					},
					children: [{
						label: "Telefoon",
						val: "+31 (0)165 205 601",
						href: "tel:+31165205601"
					}, {
						label: "E-mail",
						val: "info@ferroworks.nl",
						href: "mailto:info@ferroworks.nl"
					}].map((item, i) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "10px",
							fontWeight: 700,
							letterSpacing: "1px",
							textTransform: "uppercase",
							color: "#aaa",
							marginBottom: "2px"
						},
						children: item.label
					}), /* @__PURE__ */ jsx("a", {
						href: item.href,
						style: {
							color: "#1c1c1c",
							fontSize: "13px",
							fontWeight: 700,
							textDecoration: "none"
						},
						onMouseEnter: (e) => e.currentTarget.style.color = "#c8d400",
						onMouseLeave: (e) => e.currentTarget.style.color = "#1c1c1c",
						children: item.val
					})] }, i))
				})]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontWeight: 900,
					fontSize: "12px",
					textTransform: "uppercase",
					letterSpacing: "1.5px",
					color: "#1c1c1c",
					margin: "0 0 20px 0",
					paddingBottom: "12px",
					borderBottom: "2px solid #c8d400"
				},
				children: "MEER ARTIKELEN"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "16px"
				},
				children: others.map((p) => /* @__PURE__ */ jsxs(Link, {
					to: `/blog/${p.slug || p.id}`,
					style: {
						display: "flex",
						gap: "12px",
						textDecoration: "none",
						alignItems: "flex-start"
					},
					onMouseEnter: (e) => e.currentTarget.querySelector(".rel-title").style.color = "#c8d400",
					onMouseLeave: (e) => e.currentTarget.querySelector(".rel-title").style.color = "#1c1c1c",
					children: [/* @__PURE__ */ jsx("img", {
						src: p.image || BLOG_FALLBACK_IMAGES[allPosts.indexOf(p) % BLOG_FALLBACK_IMAGES.length],
						alt: p.title,
						style: {
							width: "64px",
							height: "48px",
							objectFit: "cover",
							flexShrink: 0
						}
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "10px",
							fontWeight: 700,
							letterSpacing: "1px",
							color: "#c8d400",
							textTransform: "uppercase",
							marginBottom: "4px"
						},
						children: p.category
					}), /* @__PURE__ */ jsx("div", {
						className: "rel-title",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							color: "#1c1c1c",
							lineHeight: 1.3,
							transition: "color .2s"
						},
						children: p.title
					})] })]
				}, p.id))
			})] })
		]
	});
}
function MorePosts({ currentId, allPosts }) {
	const [ref, vis] = useInView$3(.1);
	const related = allPosts.filter((p) => p.id !== currentId).slice(0, 3);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .mp-card { opacity:0; transform:translateY(24px); transition: opacity .55s ease, transform .55s ease; }
        .mp-on .mp-card:nth-child(1) { opacity:1; transform:none; transition-delay:.05s; }
        .mp-on .mp-card:nth-child(2) { opacity:1; transform:none; transition-delay:.18s; }
        .mp-on .mp-card:nth-child(3) { opacity:1; transform:none; transition-delay:.31s; }
        @media (max-width: 768px) { .mp-grid { grid-template-columns: 1fr !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "mp-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "40px",
					flexWrap: "wrap",
					gap: "16px"
				},
				children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(18px, 2vw, 24px)",
						textTransform: "uppercase",
						letterSpacing: "-0.3px",
						margin: 0
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#fff" },
						children: "MEER "
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "ARTIKELEN"
					})]
				}), /* @__PURE__ */ jsxs(Link, {
					to: "/blog",
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						color: "#c8d400",
						textDecoration: "none",
						display: "flex",
						alignItems: "center",
						gap: "6px"
					},
					onMouseEnter: (e) => e.currentTarget.style.gap = "10px",
					onMouseLeave: (e) => e.currentTarget.style.gap = "6px",
					children: ["ALLE ARTIKELEN", /* @__PURE__ */ jsx("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						children: /* @__PURE__ */ jsx("path", {
							d: "M5 12h14M12 5l7 7-7 7",
							stroke: "#c8d400",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "mp-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "24px"
				},
				children: related.map((p) => /* @__PURE__ */ jsxs(Link, {
					to: `/blog/${p.slug || p.id}`,
					className: "mp-card",
					style: {
						textDecoration: "none",
						background: "#252525",
						display: "block",
						transition: "transform .25s ease, box-shadow .25s ease"
					},
					onMouseEnter: (e) => {
						e.currentTarget.style.transform = "translateY(-4px)";
						e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.3)";
					},
					onMouseLeave: (e) => {
						e.currentTarget.style.transform = "none";
						e.currentTarget.style.boxShadow = "none";
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							overflow: "hidden",
							height: "180px"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: p.image || BLOG_FALLBACK_IMAGES[allPosts.indexOf(p) % BLOG_FALLBACK_IMAGES.length],
							alt: p.title,
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								display: "block",
								transition: "transform .4s ease"
							},
							onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.05)",
							onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)"
						})
					}), /* @__PURE__ */ jsxs("div", {
						style: { padding: "22px 20px" },
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px",
									marginBottom: "10px"
								},
								children: [/* @__PURE__ */ jsx("span", {
									style: {
										background: "#c8d400",
										fontFamily: "Arial Black, Arial, sans-serif",
										fontWeight: 900,
										fontSize: "9px",
										letterSpacing: "1px",
										textTransform: "uppercase",
										color: "#1c1c1c",
										padding: "3px 8px"
									},
									children: p.category
								}), /* @__PURE__ */ jsx("span", {
									style: {
										color: "#666",
										fontSize: "12px"
									},
									children: p.date
								})]
							}),
							/* @__PURE__ */ jsx("h3", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "13px",
									textTransform: "uppercase",
									color: "#fff",
									margin: "0 0 10px 0",
									lineHeight: 1.3,
									letterSpacing: "-0.1px"
								},
								children: p.title
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#c8d400",
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "11px",
									textTransform: "uppercase",
									letterSpacing: "0.5px"
								},
								children: "LEES MEER →"
							})
						]
					})]
				}, p.id))
			})]
		})]
	});
}
function CtaStrip$1() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "48px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "24px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(18px, 2.2vw, 26px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 8px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["KLAAR VOOR UW ", /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "METAALPROJECT?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#888",
						fontSize: "14px",
						margin: 0
					},
					children: "Stuur uw tekening op of bel ons direct — wij reageren binnen 24 uur."
				})] }), /* @__PURE__ */ jsx(Link, {
					to: "/contact",
					className: "fw-primary-action",
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "13px",
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						color: "#1c1c1c",
						background: "#c8d400",
						padding: "16px 32px",
						textDecoration: "none",
						display: "inline-block",
						transition: "background .2s",
						flexShrink: 0
					},
					onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
					onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
					children: "NEEM CONTACT OP"
				})]
			})
		})
	});
}
function BlogDetailPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { cms } = useCms();
	const allPosts = cms.blog && cms.blog.length ? cms.blog : FALLBACK_POSTS;
	const post = allPosts.find((p) => p.slug === slug) || allPosts.find((p) => String(p.id) === String(slug));
	const postIdx = allPosts.indexOf(post);
	const imgSrc = post ? post.image || BLOG_FALLBACK_IMAGES[postIdx % BLOG_FALLBACK_IMAGES.length] : null;
	useEffect(() => {
		if (!post) navigate("/blog", { replace: true });
		else window.scrollTo({
			top: 0,
			behavior: "instant"
		});
	}, [
		id,
		post,
		navigate
	]);
	if (!post) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PostHero, {
			post,
			imgSrc
		}),
		/* @__PURE__ */ jsx(ArticleBody, {
			post,
			allPosts
		}),
		/* @__PURE__ */ jsx(MorePosts, {
			currentId: post.id,
			allPosts
		}),
		/* @__PURE__ */ jsx(CtaStrip$1, {})
	] });
}
//#endregion
//#region src/pages/DienstenPage.jsx
var FALLBACK_IMAGES$2 = [
	about_us1_default,
	over_ons1_default,
	over_ons2_default,
	over_ons3_default,
	about_us2_default
];
function useInView$2(threshold = .1) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
function CheckIcon$1() {
	return /* @__PURE__ */ jsx("svg", {
		width: "20",
		height: "20",
		viewBox: "0 0 22 22",
		fill: "none",
		style: {
			flexShrink: 0,
			marginTop: "2px"
		},
		children: /* @__PURE__ */ jsx("polyline", {
			points: "3,11 9,17 20,5",
			stroke: "#c8d400",
			strokeWidth: "2.8",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function PageHero$1() {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "380px",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${hero_background_default})`,
				backgroundSize: "cover",
				backgroundPosition: "center right"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(90deg,rgba(20,22,22,0.94) 0%,rgba(20,22,22,0.76) 55%,rgba(20,22,22,0.4) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "64px",
					paddingBottom: "64px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "24px"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "#c8d400",
									fontSize: "13px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#666",
									fontSize: "13px"
								},
								children: "›"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Diensten"
							})
						]
					}),
					/* @__PURE__ */ jsxs("h1", {
						style: {
							margin: "0 0 16px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px,4vw,56px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#c8d400" },
							children: "ONZE "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#fff" },
							children: "DIENSTEN"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: 0,
							color: "#bbb",
							fontSize: "clamp(14px,1.6vw,17px)",
							lineHeight: 1.6,
							maxWidth: "560px"
						},
						children: "Van ontwerp en engineering tot productie, coating en montage — FerroWorks ontzorgt u volledig in metaalmaatwerk van A tot Z."
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "#c8d400",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function IntroStrip$1() {
	const [ref, vis] = useInView$2(.2);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "48px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `.is-d{opacity:0;transform:translateY(16px);transition:opacity .55s ease,transform .55s ease}.is-d-on .is-d{opacity:1;transform:none}` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 is-d-grid " + (vis ? "is-d-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(3,1fr)",
				borderLeft: "3px solid #c8d400"
			},
			children: [
				{
					num: "15+",
					label: "Jaar ervaring",
					sub: "in metaalmaatwerk"
				},
				{
					num: "100%",
					label: "Eigen productie",
					sub: "zonder onderaannemers"
				},
				{
					num: "A-Z",
					label: "Volledig ontzorgd",
					sub: "van ontwerp tot montage"
				}
			].map((item, i) => /* @__PURE__ */ jsxs("div", {
				className: "is-d",
				style: {
					padding: "8px 32px",
					borderRight: i < 2 ? "1px solid #333" : "none"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(26px,3vw,38px)",
							color: "#c8d400",
							lineHeight: 1,
							letterSpacing: "-0.5px"
						},
						children: item.num
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							color: "#fff",
							textTransform: "uppercase",
							letterSpacing: "0.3px",
							marginTop: "4px"
						},
						children: item.label
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "12px",
							color: "#777",
							marginTop: "2px"
						},
						children: item.sub
					})
				]
			}, i))
		})]
	});
}
function DienstBlock({ dienst, index }) {
	const [ref, vis] = useInView$2();
	const isEven = index % 2 === 0;
	const bg = isEven ? "#f4f4f4" : "#fff";
	const img = dienst.image || FALLBACK_IMAGES$2[index % FALLBACK_IMAGES$2.length];
	const checkItems = dienst.checklist ? dienst.checklist.split("\n").filter(Boolean) : [];
	const textBlock = /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("div", {
			style: {
				display: "inline-block",
				background: isEven ? "#c8d400" : "#1c1c1c",
				padding: "6px 14px",
				marginBottom: "20px"
			},
			children: /* @__PURE__ */ jsxs("span", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontWeight: 900,
					fontSize: "10px",
					letterSpacing: "1.5px",
					textTransform: "uppercase",
					color: isEven ? "#1c1c1c" : "#c8d400"
				},
				children: [
					dienst.nr,
					" — ",
					dienst.title
				]
			})
		}),
		/* @__PURE__ */ jsx("h2", {
			style: {
				margin: "0 0 12px 0",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "clamp(22px,2.6vw,34px)",
				textTransform: "uppercase",
				lineHeight: 1.1,
				letterSpacing: "-0.3px",
				color: "#1c1c1c"
			},
			children: dienst.title
		}),
		/* @__PURE__ */ jsx("p", {
			style: {
				color: "#777",
				fontSize: "13.5px",
				fontStyle: "italic",
				margin: "0 0 20px 0"
			},
			children: dienst.subtitle
		}),
		/* @__PURE__ */ jsx("p", {
			style: {
				color: "#555",
				fontSize: "15px",
				lineHeight: 1.8,
				margin: "0 0 24px 0"
			},
			children: dienst.excerpt
		}),
		/* @__PURE__ */ jsx("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: "12px",
				marginBottom: "28px"
			},
			children: checkItems.map((item, i) => /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "flex-start",
					gap: "10px"
				},
				children: [/* @__PURE__ */ jsx(CheckIcon$1, {}), /* @__PURE__ */ jsx("span", {
					style: {
						color: "#555",
						fontSize: "14.5px",
						lineHeight: 1.6
					},
					children: item
				})]
			}, i))
		}),
		/* @__PURE__ */ jsxs(Link, {
			to: `/diensten/${dienst.id}`,
			style: {
				display: "inline-flex",
				alignItems: "center",
				gap: "8px",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "13px",
				textTransform: "uppercase",
				letterSpacing: "0.5px",
				color: "#1c1c1c",
				background: "#c8d400",
				padding: "14px 28px",
				textDecoration: "none"
			},
			onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
			onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
			children: ["MEER INFORMATIE", /* @__PURE__ */ jsx("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 24 24",
				fill: "none",
				children: /* @__PURE__ */ jsx("path", {
					d: "M5 12h14M12 5l7 7-7 7",
					stroke: "#1c1c1c",
					strokeWidth: "2.5",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			})]
		})
	] });
	const imageBlock = /* @__PURE__ */ jsxs("div", {
		style: { position: "relative" },
		children: [/* @__PURE__ */ jsx("div", {
			className: "service-accent",
			style: {
				position: "absolute",
				...isEven ? {
					top: "-16px",
					right: "-16px"
				} : {
					bottom: "-16px",
					left: "-16px"
				},
				width: "72px",
				height: "72px",
				background: "#c8d400",
				zIndex: 0
			}
		}), /* @__PURE__ */ jsx("div", {
			style: {
				position: "relative",
				zIndex: 1,
				overflow: "hidden",
				boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
			},
			children: /* @__PURE__ */ jsx("img", {
				className: "service-image",
				src: img,
				alt: dienst.title,
				style: {
					width: "100%",
					height: "380px",
					objectFit: "cover",
					objectPosition: "center",
					display: "block"
				}
			})
		})]
	});
	return /* @__PURE__ */ jsxs("section", {
		id: dienst.id,
		style: {
			background: bg,
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .db${index}-l{opacity:0;transform:translateX(-36px);transition:opacity .65s ease,transform .65s ease}
        .db${index}-r{opacity:0;transform:translateX(36px);transition:opacity .65s .15s ease,transform .65s .15s ease}
        .db${index}-on .db${index}-l,.db${index}-on .db${index}-r{opacity:1;transform:none}
        @media(max-width:768px){.db${index}-g{grid-template-columns:1fr!important}}
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: `max-w-7xl mx-auto px-6 md:px-8 fw-service-grid db${index}-g` + (vis ? ` db${index}-on` : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "80px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: `db${index}-l`,
				children: isEven ? textBlock : imageBlock
			}), /* @__PURE__ */ jsx("div", {
				className: `db${index}-r`,
				children: isEven ? imageBlock : textBlock
			})]
		})]
	});
}
function CtaSection$1() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "80px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "56px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "28px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(20px,2.4vw,30px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 10px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["KLAAR OM ", /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "TE STARTEN?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#999",
						fontSize: "15px",
						margin: 0,
						lineHeight: 1.5
					},
					children: "Stuur uw tekening op of neem contact op — wij reageren binnen 24 uur."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "fw-cta-actions",
					style: {
						display: "flex",
						gap: "16px",
						flexWrap: "wrap"
					},
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "#c8d400",
							padding: "16px 32px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
						onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
						children: "OFFERTE AANVRAGEN"
					}), /* @__PURE__ */ jsx("a", {
						href: "tel:+31165205617",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#fff",
							background: "transparent",
							border: "2px solid #555",
							padding: "14px 28px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.borderColor = "#c8d400",
						onMouseLeave: (e) => e.currentTarget.style.borderColor = "#555",
						children: "BEL ONS"
					})]
				})]
			})
		})
	});
}
function DienstenPage() {
	const { cms } = useCms();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHero$1, {}),
		/* @__PURE__ */ jsx(IntroStrip$1, {}),
		(cms.diensten || []).map((dienst, i) => /* @__PURE__ */ jsx(DienstBlock, {
			dienst,
			index: i
		}, dienst.id)),
		/* @__PURE__ */ jsx(CtaSection$1, {})
	] });
}
//#endregion
//#region src/pages/DienstDetailPage.jsx
var FALLBACK_IMAGES$1 = {
	engineering: about_us1_default,
	productie: over_ons1_default,
	coating: over_ons2_default,
	montage: about_us2_default,
	reparatie: about_us3_default
};
function useInView$1(threshold = .1) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
var diensten_fallback = [
	{
		id: "engineering",
		nr: "01",
		title: "Engineering & Ontwerp",
		subtitle: "Van eerste schets tot goedgekeurde productietekening",
		img: about_us1_default,
		excerpt: "Elk project begint met een goed ontwerp. Onze engineers werken met moderne CAD-software en vertalen uw wensen naar haalbare, maakbare productietekeningen.",
		body: [
			{
				type: "intro",
				text: "Een goed metaalproject begint niet in de werkplaats — het begint op de tekentafel. Bij FerroWorks beschikken we over een eigen engineeringsafdeling die uw idee of specificatie omzet naar een volledig uitgewerkte, maakbare productietekening. We denken actief mee over de beste constructieve oplossing, de juiste materiaalkeuze en eventuele kostenbesparingen."
			},
			{
				type: "h2",
				text: "Van schets tot goedgekeurde tekening"
			},
			{ text: "Of u nu aankomt met een gedetailleerde constructietekening, een ruwe schets op papier of enkel een idee — wij werken het uit. We stellen gerichte vragen om uw toepassing, belasting, omgeving en eindgebruik goed te begrijpen. Vervolgens werken onze engineers de productietekeningen uit in 2D of 3D, afhankelijk van de complexiteit." },
			{
				type: "h2",
				text: "Wat wij bieden"
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
					"Revisietekeningen na wijzigingen"
				]
			},
			{
				type: "h2",
				text: "Heeft u al een tekening?"
			},
			{ text: "Geen probleem — we reviewen uw bestaande tekeningen op maakbaarheid, normconformiteit (EN-1090) en eventuele verbeterpunten. We passen tekeningen aan waar nodig en zorgen dat de uiteindelijke productietekening overeenkomt met wat u wilt en wat wij kunnen maken." },
			{
				type: "quote",
				text: "Een uur extra aandacht in het ontwerp bespaart een dag in de productie."
			},
			{
				type: "h2",
				text: "Samenwerking met uw constructeur"
			},
			{ text: "Werkt u met een extern constructiebedrijf of architect? Dan stemmen wij direct met hen af. We brengen de uitvoerbaarheid in vanuit de fabrikant — zodat wat op papier staat ook echt te maken is." }
		],
		checkitems: [
			"2D- en 3D-tekeningen (CAD/CAM)",
			"Constructieve berekeningen",
			"Materiaalkeuze en kostenadvies",
			"Toetsing op maakbaarheid",
			"Goedkeuringsproces met de opdrachtgever"
		],
		tags: [
			"Engineering",
			"CAD",
			"Ontwerp",
			"Tekeningen"
		]
	},
	{
		id: "productie",
		nr: "02",
		title: "Productie in eigen beheer",
		subtitle: "Volledig machinepark, gecertificeerde lassers, volledige controle",
		img: over_ons1_default,
		excerpt: "In onze moderne werkplaats in Roosendaal produceren we alles in eigen beheer — staal, RVS en aluminium — zonder uitbesteding, met volledige kwaliteitscontrole.",
		body: [
			{
				type: "intro",
				text: "In de werkplaats van FerroWorks in Roosendaal ziet u vakmanschap in actie. Onze eigen machinisten, lassers en metaalbewerkers verwerken staal, RVS en aluminium tot producten die nauwkeurig aansluiten op uw specificaties. Geen uitbesteding, geen kwaliteitsverlies — volledige controle van begin tot eind."
			},
			{
				type: "h2",
				text: "Ons machinepark"
			},
			{ text: "We beschikken over moderne machines voor het gehele bewerkingstraject: van zaag en lasersnijder tot knipmachine, buigpers en lasapparatuur. Dit stelt ons in staat om zowel enkelstuks als series efficiënt en nauwkeurig te produceren." },
			{
				type: "bullets",
				items: [
					"Bandzaag en cirkelzaag voor staal en aluminium",
					"Lasersnijwerk met hoge nauwkeurigheid",
					"Knipmachine en afkantpers voor plaatwerk",
					"Buigen en walsen van buizen en profielen",
					"Boren en frezen"
				]
			},
			{
				type: "h2",
				text: "Gecertificeerd laswerk"
			},
			{ text: "Al onze lassers zijn gecertificeerd en werken conform de Europese norm EN-1090. We gebruiken MIG/MAG-, TIG- en WIG-lassen, afhankelijk van het materiaal en de toepassing. Elk laswerk wordt tijdens en na productie visueel geïnspecteerd. Waar vereist passen we niet-destructief onderzoek (NDO) toe." },
			{
				type: "h2",
				text: "Kwaliteitscontrole"
			},
			{ text: "Kwaliteit zit ingebakken in ons proces. We werken met vastgestelde lasprocedures (WPS), houden een digitaal laslogboek bij en leveren bij gecertificeerde projecten volledige documentatie: materiaalcertificaten (EN 10204), inspectierapporten en de CE-verklaring van prestatie." },
			{
				type: "quote",
				text: "Eigen productie betekent geen verrassingen — wij zijn verantwoordelijk van eerste zaagsnede tot laatste las."
			},
			{
				type: "h2",
				text: "Materialen"
			},
			{ text: "We verwerken constructiestaal (S235/S355/S420), roestvast staal (AISI 304, AISI 316L, duplex) en aluminium (6060, 6082, 5083). Ons team kent de specifieke eigenschappen van elk materiaal en past de bewerkings- en lasparameters dienovereenkomstig aan." }
		],
		checkitems: [
			"Zaag- en lasersnijwerk",
			"Boren, frezen en knippen",
			"Gecertificeerd lassen (MIG/MAG, TIG, WIG)",
			"Buigen en walsen",
			"Prefab-productie en maatwerk in alle series"
		],
		tags: [
			"Productie",
			"Lassen",
			"Machinepark",
			"EN-1090"
		]
	},
	{
		id: "coating",
		nr: "03",
		title: "Coating & Afwerking",
		subtitle: "De juiste bescherming en uitstraling voor uw constructie",
		img: over_ons2_default,
		excerpt: "Een goede afwerking beschermt uw constructie en bepaalt de uitstraling. FerroWorks adviseert en verzorgt de juiste coatingoplossing op basis van omgeving, gebruik en levensduur.",
		body: [
			{
				type: "intro",
				text: "De coating is het laatste — en een van de belangrijkste — onderdelen van het productieproces. Het beschermt de constructie tegen corrosie, slijtage en weersinvloeden, en bepaalt mede de uitstraling. FerroWorks adviseert u over de meest geschikte coatingmethode en -systeem, en verzorgt de uitvoering conform de geldende normen."
			},
			{
				type: "h2",
				text: "Welke coatingmethode past bij uw project?"
			},
			{ text: "De keuze voor een coating hangt af van meerdere factoren: de omgevingscategorie (C1 t/m C5), de gewenste levensduur, het materiaal (staal, RVS, aluminium) en het gebruik. We adviseren u proactief en transparant over de voor- en nadelen van elke optie." },
			{
				type: "h2",
				text: "Onze coatingmethoden"
			},
			{
				type: "bullets",
				items: [
					"Stralen tot Sa2,5 voor optimale hechting van de coating",
					"Zinkrijke of epoxy grondlaag (corrosiewerende basislaag)",
					"Natlak — geschikt voor grote constructies, complexe geometrieën en C4/C5",
					"Poedercoating — egaal, krasbestendig, ideaal voor seriematige productie",
					"RVS-polijsten — decoratief of hygiënisch finish (spiegel, geborsteld)",
					"Galvaniseren — langdurige zinkbescherming voor buitenapplicaties"
				]
			},
			{
				type: "h2",
				text: "Conform ISO 12944"
			},
			{ text: "Onze coatingsystemen worden toegepast conform ISO 12944 voor de corrosiviteitscategorie die aansluit op uw project. Dit varieert van C1 (droog binnenmilieu) tot C5 (industrieel of mariene omgeving). We documenteren de coatingdikte, laagopbouw en gebruikte producten in een coatingrapport." },
			{
				type: "quote",
				text: "Een goede coating kost geld eenmalig. Een slechte coating kost u elke paar jaar opnieuw."
			},
			{
				type: "h2",
				text: "Natlak vs. Poedercoating"
			},
			{ text: "Poedercoating is snel, egaal en milieuvriendelijk — ideaal voor seriematige, kleinere constructies die in een oven passen. Natlak is flexibeler en noodzakelijk voor grote of complexe constructies die niet verplaatst of verhit kunnen worden. We adviseren altijd de beste oplossing voor uw situatie." }
		],
		checkitems: [
			"Stralen tot Sa2,5",
			"Grondlagen (zinkrijk/epoxy)",
			"Natlak voor complexe constructies",
			"Poedercoating seriematig",
			"RVS-polijsten en galvaniseren"
		],
		tags: [
			"Coating",
			"Afwerking",
			"ISO 12944",
			"Corrosiebescherming"
		]
	},
	{
		id: "montage",
		nr: "04",
		title: "Montage op locatie",
		subtitle: "Eigen montageploeg — van prefab tot oplevering",
		img: about_us2_default,
		excerpt: "Onze montageploeg plaatst uw constructie op locatie, coördineert het kraanwerk en levert op met volledig documentatiepakket inclusief CE-verklaring.",
		body: [
			{
				type: "intro",
				text: "Een ijzersterke constructie verdient ook een professionele montage. FerroWorks beschikt over een eigen montageploeg die uw project op locatie plaatst — veilig, nauwkeurig en conform de geldende bouwnormen. Van eenvoudige hekplaatsing tot complexe staalconstructies op hoogte: wij coördineren het gehele montageproces."
			},
			{
				type: "h2",
				text: "Wat doet onze montageploeg?"
			},
			{ text: "Onze monteurs zijn VCA-gecertificeerd en hebben jarenlange ervaring met montage op industriële locaties, bouwplaatsen en offshore-toepassingen. Ze brengen de benodigde gereedschappen, hef- en hijsmiddelen mee en werken nauw samen met de hoofdaannemer of projectleider ter plaatse." },
			{
				type: "bullets",
				items: [
					"Montage van staal-, RVS- en aluminiumconstructies",
					"Kraanbegeleiding en coördinatie hef- en hijswerk",
					"Aansluitlassen en correcties op locatie",
					"Werken op hoogte (gecertificeerd)",
					"Afstemming met bouwplaatsleiding en hoofdaannemer",
					"Eindinspectie na montage"
				]
			},
			{
				type: "h2",
				text: "Veiligheid staat voorop"
			},
			{ text: "Al onze monteurs werken VCA-gecertificeerd. Voor elke montage stellen we een werkplan op met de montagevolgorde, de benodigde hef- en veiligheidsmiddelen en de risicobeoordeling. We werken altijd met een actueel VCA-veiligheidsplan en registreren incidenten conform de norm." },
			{
				type: "quote",
				text: "Wij leveren niet aan de poort — wij leveren op locatie, gemonteerd en goedgekeurd."
			},
			{
				type: "h2",
				text: "Opleverdossier"
			},
			{ text: "Bij oplevering ontvangt u een volledig documentatiepakket: as-built tekeningen, materiaalcertificaten (EN 10204 3.1 of 3.2), lasrapporten en — indien van toepassing — een CE-verklaring van prestatie (DoP) conform EN-1090-1. Zo heeft u alles wat u nodig heeft voor uw eigen dossier en eventuele keuring door derden." }
		],
		checkitems: [
			"Eigen montageploeg, VCA gecertificeerd",
			"Montage van staal, RVS en aluminium",
			"Kraanbegeleiding en veiligheidsbeheer",
			"Aansluitlassen en correcties op locatie",
			"Eindinspectie en opleverdossier"
		],
		tags: [
			"Montage",
			"VCA",
			"Oplevering",
			"CE-markering"
		]
	},
	{
		id: "reparatie",
		nr: "05",
		title: "Reparatie & Onderhoud",
		subtitle: "Snel ter plaatse — ook voor spoedreparaties",
		img: about_us3_default,
		excerpt: "FerroWorks voert reparaties en onderhoud uit op staalconstructies, zowel in de werkplaats als direct op uw locatie. Snel, vakkundig, conform de normen.",
		body: [
			{
				type: "intro",
				text: "Staalconstructies zijn duurzaam — maar niet onverwoestbaar. Door mechanische schade, corrosie, vermoeiing of onvoorziene belastingen kunnen reparaties noodzakelijk zijn. FerroWorks voert deze reparaties snel en vakkundig uit, zowel in onze eigen werkplaats als bij u op locatie."
			},
			{
				type: "h2",
				text: "Welke reparaties voeren wij uit?"
			},
			{ text: "We behandelen zowel structurele reparaties (gebroken lassen, vervormd staalwerk, scheurvorming) als oppervlaktereparaties (corrosie, beschadigde coating). Onze lassers beoordelen de schade, bepalen de oorzaak en voeren de reparatie uit conform de geldende normen." },
			{
				type: "bullets",
				items: [
					"Lasreparaties in staal, RVS en aluminium",
					"Herstel van corrosieschade en beschadigde coating",
					"Structurele versterking van bestaande constructies",
					"Vervanging van slijtdelen en beschadigde onderdelen",
					"Spoedreparaties op locatie (korte responstijd)",
					"Onderhoudscontracten op aanvraag"
				]
			},
			{
				type: "h2",
				text: "Reparatie op locatie"
			},
			{ text: "Niet alles kan naar onze werkplaats worden gebracht. Daarom beschikken we over een mobiele reparatieploeg die bij u op locatie aan de slag gaat — of het nu gaat om een industrieel platform, een hekwerk op een bouwplaats of een maritieme constructie. We brengen alles mee wat nodig is." },
			{
				type: "quote",
				text: "Stilstand kost geld. Wij zorgen dat uw constructie snel en veilig weer in bedrijf is."
			},
			{
				type: "h2",
				text: "Preventief onderhoud"
			},
			{ text: "Voorkomen is beter dan genezen. We bieden ook preventieve inspecties en onderhoudsprogramma's aan voor bedrijven die regelmatig staalwerk in gebruik hebben. Tijdige inspectie en coatingherstel verlengen de levensduur van uw constructies aanzienlijk en voorkomt dure onverwachte uitval." },
			{
				type: "h2",
				text: "Documentatie na reparatie"
			},
			{ text: "Na elke reparatie leveren we een kortrapport met de aard van de schade, de uitgevoerde werkzaamheden en de gebruikte materialen. Zo heeft u een volledig dossier voor uw eigen administratie en eventuele keuringsinstanties." }
		],
		checkitems: [
			"Lasreparaties in staal, RVS en aluminium",
			"Herstel van corrosieschade en coating",
			"Structurele versterking",
			"Spoedreparaties op locatie",
			"Onderhoudscontracten op aanvraag"
		],
		tags: [
			"Reparatie",
			"Onderhoud",
			"Spoed",
			"Locatie"
		]
	}
];
function DienstHero({ dienst }) {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "400px",
			display: "flex",
			alignItems: "flex-end",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${dienst.image || FALLBACK_IMAGES$1[dienst.id] || "/assets/about-us1-Fdlmxb8O.jpeg"})`,
				backgroundSize: "cover",
				backgroundPosition: "center"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(0deg, rgba(20,22,22,0.97) 0%, rgba(20,22,22,0.72) 50%, rgba(20,22,22,0.35) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingBottom: "56px",
					paddingTop: "96px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "20px",
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "#c8d400",
									fontSize: "12px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "12px"
								},
								children: "›"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/diensten",
								style: {
									color: "#c8d400",
									fontSize: "12px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Diensten"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "12px"
								},
								children: "›"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#888",
									fontSize: "12px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: dienst.title
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: { marginBottom: "16px" },
						children: /* @__PURE__ */ jsxs("span", {
							style: {
								background: "#c8d400",
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "10px",
								letterSpacing: "1.5px",
								textTransform: "uppercase",
								color: "#1c1c1c",
								padding: "5px 12px"
							},
							children: [dienst.nr, " — DIENST"]
						})
					}),
					/* @__PURE__ */ jsx("h1", {
						style: {
							margin: "0 0 14px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(24px, 3.5vw, 52px)",
							lineHeight: 1.08,
							letterSpacing: "-0.5px",
							textTransform: "uppercase",
							color: "#fff",
							maxWidth: "780px"
						},
						children: dienst.title.toUpperCase()
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 28px 0",
							color: "#aaa",
							fontSize: "clamp(13px, 1.4vw, 16px)",
							lineHeight: 1.6,
							maxWidth: "520px"
						},
						children: dienst.subtitle
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "#c8d400",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function DienstBody({ dienst, allDiensten = [] }) {
	const [ref, vis] = useInView$1(.05);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
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
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 db-layout " + (vis ? "db-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 320px",
				gap: "64px",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsxs("article", {
				className: "db-wrap db-article",
				children: [typeof dienst.body === "string" ? /<[^>]+>/.test(dienst.body) ? /* @__PURE__ */ jsx(RichTextContent, { html: dienst.body }) : dienst.body.split("\n\n").map((para, i) => i === 0 ? /* @__PURE__ */ jsx("p", {
					className: "intro-p",
					children: para
				}, i) : /* @__PURE__ */ jsx("p", { children: para }, i)) : (dienst.body || []).map((block, i) => {
					if (block.type === "intro") return /* @__PURE__ */ jsx("p", {
						className: "intro-p",
						children: block.text
					}, i);
					if (block.type === "h2") return /* @__PURE__ */ jsx("h2", { children: block.text }, i);
					if (block.type === "quote") return /* @__PURE__ */ jsxs("blockquote", { children: [
						"\"",
						block.text,
						"\""
					] }, i);
					if (block.type === "bullets") return /* @__PURE__ */ jsx("ul", { children: block.items.map((item, j) => /* @__PURE__ */ jsx("li", { children: item }, j)) }, i);
					return /* @__PURE__ */ jsx("p", { children: block.text }, i);
				}), dienst.tags && dienst.tags.length > 0 && /* @__PURE__ */ jsxs("div", {
					style: {
						marginTop: "48px",
						paddingTop: "32px",
						borderTop: "1.5px solid #e0e0e0"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "1.5px",
							textTransform: "uppercase",
							color: "#aaa",
							marginRight: "12px"
						},
						children: "Tags:"
					}), dienst.tags.map((tag, i) => /* @__PURE__ */ jsx("span", {
						style: {
							display: "inline-block",
							background: "#e8e8e8",
							color: "#555",
							fontSize: "12px",
							fontWeight: 700,
							padding: "4px 12px",
							marginRight: "8px",
							marginBottom: "8px",
							letterSpacing: "0.3px"
						},
						children: tag
					}, i))]
				})]
			}), /* @__PURE__ */ jsx(Sidebar$1, {
				dienst,
				allDiensten
			})]
		})]
	});
}
function Sidebar$1({ dienst, allDiensten = [] }) {
	const others = allDiensten.filter((d) => d.id !== dienst.id);
	return /* @__PURE__ */ jsxs("aside", {
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "32px"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "#1c1c1c",
					padding: "28px 24px"
				},
				children: [/* @__PURE__ */ jsxs("h3", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						letterSpacing: "1px",
						color: "#fff",
						margin: "0 0 20px 0"
					},
					children: ["WAT WIJ ", /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "LEVEREN"
					})]
				}), /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "10px"
					},
					children: (typeof dienst.checklist === "string" ? dienst.checklist.split("\n").filter(Boolean) : dienst.checkitems || []).map((item, i) => /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "flex-start",
							gap: "8px"
						},
						children: [/* @__PURE__ */ jsx("svg", {
							width: "16",
							height: "16",
							viewBox: "0 0 22 22",
							fill: "none",
							style: {
								flexShrink: 0,
								marginTop: "2px"
							},
							children: /* @__PURE__ */ jsx("polyline", {
								points: "3,11 9,17 20,5",
								stroke: "#c8d400",
								strokeWidth: "2.8",
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})
						}), /* @__PURE__ */ jsx("span", {
							style: {
								color: "#ccc",
								fontSize: "13px",
								lineHeight: 1.55
							},
							children: item
						})]
					}, i))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fff",
					padding: "24px",
					borderTop: "4px solid #c8d400"
				},
				children: [
					/* @__PURE__ */ jsx("h4", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							letterSpacing: "1px",
							color: "#1c1c1c",
							margin: "0 0 10px 0"
						},
						children: "OFFERTE AANVRAGEN"
					}),
					/* @__PURE__ */ jsxs("p", {
						style: {
							color: "#888",
							fontSize: "13px",
							lineHeight: 1.6,
							margin: "0 0 16px 0"
						},
						children: [
							"Interesse in ",
							dienst.title.toLowerCase(),
							"? Neem contact op — we reageren binnen 24 uur."
						]
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							display: "block",
							textAlign: "center",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "#c8d400",
							padding: "14px 20px",
							textDecoration: "none",
							transition: "background .2s",
							marginBottom: "10px"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
						onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
						children: "NEEM CONTACT OP"
					}),
					/* @__PURE__ */ jsx("a", {
						href: "tel:+31165205601",
						style: {
							display: "block",
							textAlign: "center",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#888",
							textDecoration: "none",
							fontSize: "12px",
							marginTop: "8px"
						},
						children: "+31 (0)165 205 601"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontWeight: 900,
					fontSize: "12px",
					textTransform: "uppercase",
					letterSpacing: "1.5px",
					color: "#1c1c1c",
					margin: "0 0 20px 0",
					paddingBottom: "12px",
					borderBottom: "2px solid #c8d400"
				},
				children: "ANDERE DIENSTEN"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "4px"
				},
				children: others.map((d) => /* @__PURE__ */ jsxs(Link, {
					to: `/diensten/${d.id}`,
					style: {
						display: "flex",
						alignItems: "center",
						gap: "10px",
						padding: "10px 0",
						borderBottom: "1px solid #eee",
						textDecoration: "none"
					},
					onMouseEnter: (e) => {
						e.currentTarget.querySelector(".od-nr").style.background = "#c8d400";
						e.currentTarget.querySelector(".od-title").style.color = "#c8d400";
					},
					onMouseLeave: (e) => {
						e.currentTarget.querySelector(".od-nr").style.background = "#1c1c1c";
						e.currentTarget.querySelector(".od-title").style.color = "#1c1c1c";
					},
					children: [/* @__PURE__ */ jsx("span", {
						className: "od-nr",
						style: {
							background: "#1c1c1c",
							color: "#c8d400",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "10px",
							padding: "3px 7px",
							flexShrink: 0,
							transition: "background .2s"
						},
						children: d.nr
					}), /* @__PURE__ */ jsx("span", {
						className: "od-title",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							color: "#1c1c1c",
							lineHeight: 1.3,
							transition: "color .2s"
						},
						children: d.title
					})]
				}, d.id))
			})] })
		]
	});
}
function MeerDiensten({ currentId, allDiensten }) {
	const [ref, vis] = useInView$1(.1);
	const related = allDiensten.filter((d) => d.id !== currentId).slice(0, 3);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .md-card { opacity:0; transform:translateY(24px); transition: opacity .55s ease, transform .55s ease; }
        .md-on .md-card:nth-child(1) { opacity:1; transform:none; transition-delay:.05s; }
        .md-on .md-card:nth-child(2) { opacity:1; transform:none; transition-delay:.18s; }
        .md-on .md-card:nth-child(3) { opacity:1; transform:none; transition-delay:.31s; }
        @media (max-width: 768px) { .md-grid { grid-template-columns: 1fr !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "md-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "40px",
					flexWrap: "wrap",
					gap: "16px"
				},
				children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(18px, 2vw, 24px)",
						textTransform: "uppercase",
						letterSpacing: "-0.3px",
						margin: 0
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#fff" },
						children: "ANDERE "
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "DIENSTEN"
					})]
				}), /* @__PURE__ */ jsxs(Link, {
					to: "/diensten",
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						color: "#c8d400",
						textDecoration: "none",
						display: "flex",
						alignItems: "center",
						gap: "6px",
						transition: "gap .2s"
					},
					onMouseEnter: (e) => e.currentTarget.style.gap = "10px",
					onMouseLeave: (e) => e.currentTarget.style.gap = "6px",
					children: ["ALLE DIENSTEN", /* @__PURE__ */ jsx("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						children: /* @__PURE__ */ jsx("path", {
							d: "M5 12h14M12 5l7 7-7 7",
							stroke: "#c8d400",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "md-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "24px"
				},
				children: related.map((d) => /* @__PURE__ */ jsxs(Link, {
					to: `/diensten/${d.id}`,
					className: "md-card",
					style: {
						textDecoration: "none",
						background: "#252525",
						display: "block",
						transition: "transform .25s ease, box-shadow .25s ease"
					},
					onMouseEnter: (e) => {
						e.currentTarget.style.transform = "translateY(-4px)";
						e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.3)";
					},
					onMouseLeave: (e) => {
						e.currentTarget.style.transform = "none";
						e.currentTarget.style.boxShadow = "none";
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							overflow: "hidden",
							height: "180px"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: d.image || FALLBACK_IMAGES$1[d.id] || "/assets/about-us1-Fdlmxb8O.jpeg",
							alt: d.title,
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								display: "block",
								transition: "transform .4s ease"
							},
							onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.05)",
							onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)"
						})
					}), /* @__PURE__ */ jsxs("div", {
						style: { padding: "22px 20px" },
						children: [
							/* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "10px",
									marginBottom: "10px"
								},
								children: /* @__PURE__ */ jsx("span", {
									style: {
										background: "#c8d400",
										fontFamily: "Arial Black, Arial, sans-serif",
										fontWeight: 900,
										fontSize: "9px",
										letterSpacing: "1px",
										textTransform: "uppercase",
										color: "#1c1c1c",
										padding: "3px 8px"
									},
									children: d.nr
								})
							}),
							/* @__PURE__ */ jsx("h3", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "14px",
									textTransform: "uppercase",
									color: "#fff",
									margin: "0 0 10px 0",
									lineHeight: 1.3,
									letterSpacing: "-0.1px"
								},
								children: d.title
							}),
							/* @__PURE__ */ jsxs("p", {
								style: {
									color: "#777",
									fontSize: "12.5px",
									lineHeight: 1.6,
									margin: "0 0 14px 0"
								},
								children: [d.excerpt.substring(0, 90), "..."]
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#c8d400",
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "11px",
									textTransform: "uppercase",
									letterSpacing: "0.5px"
								},
								children: "MEER INFORMATIE →"
							})
						]
					})]
				}, d.id))
			})]
		})]
	});
}
function CtaStrip() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "48px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "24px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(18px, 2.2vw, 26px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 8px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["KLAAR VOOR UW ", /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "PROJECT?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#888",
						fontSize: "14px",
						margin: 0
					},
					children: "Stuur uw tekening op of bel ons direct — wij reageren binnen 24 uur."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "fw-cta-actions",
					style: {
						display: "flex",
						gap: "14px",
						flexWrap: "wrap"
					},
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "#c8d400",
							padding: "16px 32px",
							textDecoration: "none",
							display: "inline-block",
							transition: "background .2s",
							flexShrink: 0
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
						onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
						children: "NEEM CONTACT OP"
					}), /* @__PURE__ */ jsx("a", {
						href: "tel:+31165205601",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#fff",
							background: "transparent",
							border: "2px solid #555",
							padding: "14px 28px",
							textDecoration: "none",
							display: "inline-block",
							transition: "border-color .2s",
							flexShrink: 0
						},
						onMouseEnter: (e) => e.currentTarget.style.borderColor = "#c8d400",
						onMouseLeave: (e) => e.currentTarget.style.borderColor = "#555",
						children: "BEL ONS"
					})]
				})]
			})
		})
	});
}
function DienstDetailPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { cms } = useCms();
	const allDiensten = cms.diensten && cms.diensten.length ? cms.diensten : diensten_fallback;
	const dienst = allDiensten.find((d) => d.id === slug);
	useEffect(() => {
		if (!dienst) navigate("/diensten", { replace: true });
		else window.scrollTo({
			top: 0,
			behavior: "instant"
		});
	}, [
		id,
		dienst,
		navigate
	]);
	if (!dienst) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(DienstHero, { dienst }),
		/* @__PURE__ */ jsx(DienstBody, {
			dienst,
			allDiensten
		}),
		/* @__PURE__ */ jsx(MeerDiensten, {
			currentId: dienst.id,
			allDiensten
		}),
		/* @__PURE__ */ jsx(CtaStrip, {})
	] });
}
//#endregion
//#region src/pages/SectorenPage.jsx
var FALLBACK_IMAGES = [
	about_us1_default,
	over_ons1_default,
	over_ons2_default,
	about_us2_default,
	about_us3_default
];
function useInView(threshold = .1) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
function CheckIcon() {
	return /* @__PURE__ */ jsx("svg", {
		width: "20",
		height: "20",
		viewBox: "0 0 22 22",
		fill: "none",
		style: {
			flexShrink: 0,
			marginTop: "3px"
		},
		children: /* @__PURE__ */ jsx("polyline", {
			points: "3,11 9,17 20,5",
			stroke: "#c8d400",
			strokeWidth: "2.8",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function PageHero() {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "380px",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${hero_background_default})`,
				backgroundSize: "cover",
				backgroundPosition: "center right"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(90deg,rgba(20,22,22,0.94) 0%,rgba(20,22,22,0.76) 55%,rgba(20,22,22,0.4) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "64px",
					paddingBottom: "64px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "24px"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "#c8d400",
									fontSize: "13px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#666",
									fontSize: "13px"
								},
								children: "›"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Sectoren"
							})
						]
					}),
					/* @__PURE__ */ jsxs("h1", {
						style: {
							margin: "0 0 16px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px,4vw,56px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#c8d400" },
							children: "STAAL, RVS & ALU "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#fff" },
							children: "IN ELKE SECTOR"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: 0,
							color: "#bbb",
							fontSize: "clamp(14px,1.6vw,17px)",
							lineHeight: 1.6,
							maxWidth: "540px"
						},
						children: "FerroWorks levert maatwerk metaaloplossingen voor bouw, industrie, architectuur en maritieme toepassingen. Altijd vakkundig, altijd op maat."
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "#c8d400",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function IntroStrip() {
	const [ref, vis] = useInView(.15);
	const { cms } = useCms();
	const stats = cms.stats || [];
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "56px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `.is-sp{opacity:0;transform:translateY(18px);transition:opacity .5s ease,transform .5s ease}.is-sp-on .is-sp{opacity:1;transform:none}` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 is-sp-grid " + (vis ? "is-sp-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: `repeat(${stats.length},1fr)`,
				gap: "24px"
			},
			children: stats.map((item, i) => /* @__PURE__ */ jsxs("div", {
				className: "is-sp",
				style: {
					borderLeft: "3px solid #c8d400",
					paddingLeft: "20px",
					transitionDelay: `${i * .1}s`
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px,3vw,40px)",
							color: "#c8d400",
							lineHeight: 1,
							letterSpacing: "-0.5px"
						},
						children: item.number
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							color: "#fff",
							textTransform: "uppercase",
							letterSpacing: "0.3px",
							marginTop: "6px"
						},
						children: item.desc.split(" ").slice(0, 2).join(" ")
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "12px",
							color: "#888",
							marginTop: "4px",
							lineHeight: 1.4
						},
						children: item.desc
					})
				]
			}, i))
		})]
	});
}
function SectorBlock({ sector, index }) {
	const [ref, vis] = useInView();
	const isEven = index % 2 === 0;
	const bg = isEven ? "#f4f4f4" : "#fff";
	const img = sector.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
	const checkItems = sector.items ? sector.items.split("\n").filter(Boolean) : [];
	const textBlock = /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("span", {
			style: {
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "11px",
				color: "#c8d400",
				textTransform: "uppercase",
				letterSpacing: "1.5px"
			},
			children: [sector.nr, " — SECTOR"]
		}),
		/* @__PURE__ */ jsx("h2", {
			style: {
				margin: "12px 0 16px 0",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "clamp(22px,2.6vw,36px)",
				textTransform: "uppercase",
				lineHeight: 1.1,
				letterSpacing: "-0.3px",
				color: "#1c1c1c"
			},
			children: sector.naam
		}),
		sector.intro && /<[^>]+>/.test(sector.intro) ? /* @__PURE__ */ jsx(RichTextContent, {
			html: sector.intro,
			style: {
				color: "#666",
				fontSize: "15px",
				lineHeight: 1.7,
				margin: "0 0 28px 0"
			}
		}) : /* @__PURE__ */ jsx("p", {
			style: {
				color: "#666",
				fontSize: "15px",
				lineHeight: 1.7,
				margin: "0 0 28px 0"
			},
			children: sector.intro || sector.tagline
		}),
		/* @__PURE__ */ jsx("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: "11px",
				marginBottom: "32px"
			},
			children: checkItems.map((item, i) => /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "flex-start",
					gap: "10px"
				},
				children: [/* @__PURE__ */ jsx(CheckIcon, {}), /* @__PURE__ */ jsx("span", {
					style: {
						color: "#555",
						fontSize: "14.5px",
						lineHeight: 1.6
					},
					children: item
				})]
			}, i))
		}),
		/* @__PURE__ */ jsxs(Link, {
			to: "/contact",
			style: {
				display: "inline-flex",
				alignItems: "center",
				gap: "8px",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "13px",
				textTransform: "uppercase",
				letterSpacing: "0.5px",
				color: "#1c1c1c",
				background: "#c8d400",
				padding: "14px 28px",
				textDecoration: "none"
			},
			onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
			onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
			children: ["OFFERTE AANVRAGEN", /* @__PURE__ */ jsx("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 24 24",
				fill: "none",
				children: /* @__PURE__ */ jsx("path", {
					d: "M5 12h14M12 5l7 7-7 7",
					stroke: "#1c1c1c",
					strokeWidth: "2.5",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			})]
		})
	] });
	const imageBlock = /* @__PURE__ */ jsxs("div", {
		style: { position: "relative" },
		children: [/* @__PURE__ */ jsx("div", {
			className: "sector-accent",
			style: {
				position: "absolute",
				...isEven ? {
					top: "-16px",
					right: "-16px"
				} : {
					bottom: "-16px",
					left: "-16px"
				},
				width: "72px",
				height: "72px",
				background: "#c8d400",
				zIndex: 0
			}
		}), /* @__PURE__ */ jsx("div", {
			style: {
				position: "relative",
				zIndex: 1,
				overflow: "hidden",
				boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
			},
			children: /* @__PURE__ */ jsx("img", {
				className: "sector-image",
				src: img,
				alt: sector.naam,
				style: {
					width: "100%",
					height: "400px",
					objectFit: "cover",
					objectPosition: "center",
					display: "block"
				}
			})
		})]
	});
	return /* @__PURE__ */ jsxs("section", {
		id: sector.id,
		style: {
			background: bg,
			padding: "88px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .sb${index}-l{opacity:0;transform:translateX(-36px);transition:opacity .65s ease,transform .65s ease}
        .sb${index}-r{opacity:0;transform:translateX(36px);transition:opacity .65s .15s ease,transform .65s .15s ease}
        .sb${index}-on .sb${index}-l,.sb${index}-on .sb${index}-r{opacity:1;transform:none}
        @media(max-width:768px){.sb${index}-g{grid-template-columns:1fr!important}}
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: `max-w-7xl mx-auto px-6 md:px-8 fw-sector-grid sb${index}-g` + (vis ? ` sb${index}-on` : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "80px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: `sb${index}-l`,
				children: isEven ? textBlock : imageBlock
			}), /* @__PURE__ */ jsx("div", {
				className: `sb${index}-r`,
				children: isEven ? imageBlock : textBlock
			})]
		})]
	});
}
function DienstenBanner() {
	const [ref, vis] = useInView(.15);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `.db-card{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}.db-on .db-card{opacity:1;transform:none}` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "db-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				style: { marginBottom: "40px" },
				children: [/* @__PURE__ */ jsx("p", {
					style: {
						margin: "0 0 10px 0",
						color: "#c8d400",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						letterSpacing: "2px",
						textTransform: "uppercase"
					},
					children: "OOK INTERESSANT"
				}), /* @__PURE__ */ jsxs("h2", {
					style: {
						margin: 0,
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(22px,2.6vw,34px)",
						textTransform: "uppercase",
						color: "#fff",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["ONZE ", /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "DIENSTEN"
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "fw-five-col-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(5,1fr)",
					gap: "16px"
				},
				children: [
					{
						title: "Engineering & Ontwerp",
						to: "/diensten/engineering"
					},
					{
						title: "Productie in eigen beheer",
						to: "/diensten/productie"
					},
					{
						title: "Coating & Afwerking",
						to: "/diensten/coating"
					},
					{
						title: "Montage op locatie",
						to: "/diensten/montage"
					},
					{
						title: "Reparatie & Onderhoud",
						to: "/diensten/reparatie"
					}
				].map((item, i) => /* @__PURE__ */ jsxs(Link, {
					to: item.to,
					className: "db-card",
					style: {
						background: "#252525",
						padding: "24px 20px",
						display: "block",
						textDecoration: "none",
						borderTop: "3px solid #c8d400",
						transitionDelay: `${i * .08}s`
					},
					onMouseEnter: (e) => e.currentTarget.style.background = "#2e2e2e",
					onMouseLeave: (e) => e.currentTarget.style.background = "#252525",
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12.5px",
							textTransform: "uppercase",
							color: "#fff",
							lineHeight: 1.3
						},
						children: item.title
					}), /* @__PURE__ */ jsx("div", {
						style: {
							marginTop: "10px",
							color: "#c8d400",
							fontSize: "12px"
						},
						children: "→ Meer info"
					})]
				}, i))
			})]
		})]
	});
}
function CtaSection() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "80px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "56px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "28px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(20px,2.4vw,30px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 10px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["KLAAR OM ", /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "TE STARTEN?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#999",
						fontSize: "15px",
						margin: 0,
						lineHeight: 1.5
					},
					children: "Stuur uw tekening op of neem contact op — wij reageren binnen 24 uur."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "fw-cta-actions",
					style: {
						display: "flex",
						gap: "16px",
						flexWrap: "wrap"
					},
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "#c8d400",
							padding: "16px 32px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "#b3be00",
						onMouseLeave: (e) => e.currentTarget.style.background = "#c8d400",
						children: "OFFERTE AANVRAGEN"
					}), /* @__PURE__ */ jsx("a", {
						href: "tel:+31165205617",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#fff",
							background: "transparent",
							border: "2px solid #555",
							padding: "14px 28px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.borderColor = "#c8d400",
						onMouseLeave: (e) => e.currentTarget.style.borderColor = "#555",
						children: "BEL ONS"
					})]
				})]
			})
		})
	});
}
function SectorenPage() {
	const { cms } = useCms();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHero, {}),
		/* @__PURE__ */ jsx(IntroStrip, {}),
		(cms.sectoren || []).map((sector, i) => /* @__PURE__ */ jsx(SectorBlock, {
			sector,
			index: i
		}, sector.id)),
		/* @__PURE__ */ jsx(DienstenBanner, {}),
		/* @__PURE__ */ jsx(CtaSection, {})
	] });
}
//#endregion
//#region src/pages/ManagedContentPage.jsx
function ManagedContentPage() {
	const { cms } = useCms();
	const location = useLocation();
	const page = (cms.pages || []).find((item) => item.path === location.pathname);
	if (!page) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("section", {
			style: {
				position: "relative",
				width: "100%",
				minHeight: "320px",
				display: "flex",
				alignItems: "center",
				overflow: "hidden",
				background: "#141616"
			},
			children: [
				/* @__PURE__ */ jsx("div", { style: {
					position: "absolute",
					inset: 0,
					backgroundImage: `url(${hero_background_default})`,
					backgroundSize: "cover",
					backgroundPosition: "center right"
				} }),
				/* @__PURE__ */ jsx("div", { style: {
					position: "absolute",
					inset: 0,
					background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)"
				} }),
				/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
					style: {
						paddingTop: "64px",
						paddingBottom: "64px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "8px",
								marginBottom: "24px"
							},
							children: [
								/* @__PURE__ */ jsx(Link, {
									to: "/",
									style: {
										color: "#c8d400",
										fontSize: "13px",
										textDecoration: "none",
										fontWeight: 700,
										letterSpacing: "0.5px",
										textTransform: "uppercase"
									},
									children: "Home"
								}),
								/* @__PURE__ */ jsx("span", {
									style: {
										color: "#666",
										fontSize: "13px"
									},
									children: "›"
								}),
								/* @__PURE__ */ jsx("span", {
									style: {
										color: "#aaa",
										fontSize: "13px",
										fontWeight: 700,
										letterSpacing: "0.5px",
										textTransform: "uppercase"
									},
									children: page.name
								})
							]
						}),
						/* @__PURE__ */ jsx("h1", {
							style: {
								margin: "0 0 16px 0",
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "clamp(28px, 4vw, 56px)",
								lineHeight: 1.05,
								letterSpacing: "-0.5px",
								textTransform: "uppercase"
							},
							children: /* @__PURE__ */ jsx("span", {
								style: { color: "#c8d400" },
								children: page.heroTitle || page.name
							})
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								margin: 0,
								color: "#bbb",
								fontSize: "clamp(14px, 1.6vw, 17px)",
								lineHeight: 1.6,
								maxWidth: "680px"
							},
							children: page.heroSubtitle || page.metaDescription
						})
					]
				})
			]
		}),
		/* @__PURE__ */ jsx("section", {
			style: {
				background: "#f4f4f4",
				padding: "80px 0"
			},
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-5xl mx-auto px-6 md:px-8",
				children: /* @__PURE__ */ jsx("div", {
					style: {
						background: "#fff",
						padding: "48px",
						boxShadow: "0 10px 35px rgba(0,0,0,0.05)"
					},
					children: /* @__PURE__ */ jsx(RichTextContent, {
						html: page.body || "<p>Geen inhoud ingesteld.</p>",
						className: "managed-content-page"
					})
				})
			})
		}),
		/* @__PURE__ */ jsx("style", { children: `
        .managed-content-page h2 {
          font-family: Arial Black, Arial, sans-serif;
          font-size: 24px;
          line-height: 1.15;
          text-transform: uppercase;
          color: #1c1c1c;
          margin: 32px 0 16px;
        }
        .managed-content-page p {
          color: #555;
          font-size: 15px;
          line-height: 1.8;
          margin: 0 0 18px;
        }
        .managed-content-page ul {
          margin: 0 0 24px;
          padding-left: 20px;
          color: #555;
          line-height: 1.8;
        }
      ` })
	] });
}
//#endregion
//#region src/auth/AuthContext.jsx
var AuthContext = createContext(null);
function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let cancelled = false;
		api.getMe().then((data) => {
			if (!cancelled) setUser(data);
		}).catch(() => {
			if (!cancelled) setUser(null);
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const value = useMemo(() => ({
		user,
		loading,
		login: async (email, password) => {
			const data = await api.login(email, password);
			setUser(data);
			return data;
		},
		logout: async () => {
			await api.logout();
			setUser(null);
		}
	}), [user, loading]);
	return /* @__PURE__ */ jsx(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
}
//#endregion
//#region src/components/RichTextEditor.jsx
var TOOLBAR = [
	{
		label: "B",
		action: "bold"
	},
	{
		label: "I",
		action: "italic"
	},
	{
		label: "H2",
		action: "formatBlock",
		value: "h2"
	},
	{
		label: "P",
		action: "formatBlock",
		value: "p"
	},
	{
		label: "UL",
		action: "insertUnorderedList"
	},
	{
		label: "OL",
		action: "insertOrderedList"
	},
	{
		label: "\"",
		action: "formatBlock",
		value: "blockquote"
	}
];
function exec(action, value) {
	if (typeof document === "undefined") return;
	document.execCommand(action, false, value);
}
function RichTextEditor({ label, value, onChange, placeholder = "Voeg tekst toe..." }) {
	const editorRef = useRef(null);
	useEffect(() => {
		if (!editorRef.current) return;
		if (editorRef.current.innerHTML !== (value || "")) editorRef.current.innerHTML = value || "";
	}, [value]);
	const handleInput = () => {
		onChange(editorRef.current?.innerHTML || "");
	};
	const handleLink = () => {
		const url = window.prompt("Voer de URL in");
		if (!url) return;
		exec("createLink", url);
		handleInput();
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		label ? /* @__PURE__ */ jsx("label", {
			style: {
				display: "block",
				fontSize: "11px",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				textTransform: "uppercase",
				color: "#999",
				letterSpacing: "0.5px",
				marginBottom: "8px"
			},
			children: label
		}) : null,
		/* @__PURE__ */ jsxs("div", {
			style: {
				border: "1.5px solid #e0e0e0",
				borderRadius: "8px",
				overflow: "hidden",
				background: "#fff"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexWrap: "wrap",
					gap: "8px",
					padding: "10px",
					borderBottom: "1px solid #efefef",
					background: "#fafafa"
				},
				children: [TOOLBAR.map((item) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => {
						exec(item.action, item.value);
						handleInput();
					},
					style: {
						padding: "7px 10px",
						minWidth: "38px",
						border: "none",
						borderRadius: "6px",
						background: "#f0f0f0",
						color: "#333",
						cursor: "pointer",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						textTransform: "uppercase"
					},
					children: item.label
				}, `${item.label}-${item.action}`)), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: handleLink,
					style: {
						padding: "7px 10px",
						border: "none",
						borderRadius: "6px",
						background: "#f0f0f0",
						color: "#333",
						cursor: "pointer",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						textTransform: "uppercase"
					},
					children: "Link"
				})]
			}), /* @__PURE__ */ jsx("div", {
				ref: editorRef,
				contentEditable: true,
				suppressContentEditableWarning: true,
				onInput: handleInput,
				"data-placeholder": placeholder,
				style: {
					minHeight: "220px",
					padding: "16px",
					outline: "none",
					fontSize: "15px",
					lineHeight: 1.7,
					color: "#333"
				}
			})]
		}),
		/* @__PURE__ */ jsx("style", { children: `
        [contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #b6b6b6;
        }
      ` })
	] });
}
//#endregion
//#region src/pages/AdminPage.jsx
function SvgIcon({ d, size = 18, stroke = "currentColor", strokeWidth = 2 }) {
	return /* @__PURE__ */ jsx("svg", {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke,
		strokeWidth,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		style: { flexShrink: 0 },
		children: /* @__PURE__ */ jsx("path", { d })
	});
}
function makeSlug(value, fallback = "item") {
	return (value || fallback).toString().toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}
function parseLines(value) {
	return (value || "").split("\n").map((item) => item.trim()).filter(Boolean);
}
function toMultiline(value) {
	return Array.isArray(value) ? value.join("\n") : value || "";
}
function baseInputStyle() {
	return {
		width: "100%",
		padding: "10px 14px",
		border: "1.5px solid #e0e0e0",
		borderRadius: "6px",
		fontSize: "14px",
		color: "#333",
		outline: "none",
		boxSizing: "border-box",
		fontFamily: "inherit",
		transition: "border-color .15s",
		background: "#fff"
	};
}
function FieldLabel({ children }) {
	return /* @__PURE__ */ jsx("label", {
		style: {
			display: "block",
			fontSize: "11px",
			fontFamily: "Arial Black, Arial, sans-serif",
			fontWeight: 900,
			textTransform: "uppercase",
			color: "#999",
			letterSpacing: "0.5px",
			marginBottom: "8px"
		},
		children
	});
}
function FormField({ label, value, onChange, placeholder, multiline, rows = 3, type = "text" }) {
	const shared = baseInputStyle();
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(FieldLabel, { children: label }), multiline ? /* @__PURE__ */ jsx("textarea", {
		value: value || "",
		onChange: (e) => onChange(e.target.value),
		rows,
		placeholder,
		style: {
			...shared,
			resize: "vertical"
		},
		onFocus: (e) => {
			e.target.style.borderColor = "#c8d400";
		},
		onBlur: (e) => {
			e.target.style.borderColor = "#e0e0e0";
		}
	}) : /* @__PURE__ */ jsx("input", {
		type,
		value: value || "",
		onChange: (e) => onChange(e.target.value),
		placeholder,
		style: shared,
		onFocus: (e) => {
			e.target.style.borderColor = "#c8d400";
		},
		onBlur: (e) => {
			e.target.style.borderColor = "#e0e0e0";
		}
	})] });
}
function SelectField({ label, value, onChange, options }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(FieldLabel, { children: label }), /* @__PURE__ */ jsx("select", {
		value: value || "",
		onChange: (e) => onChange(e.target.value),
		style: baseInputStyle(),
		onFocus: (e) => {
			e.target.style.borderColor = "#c8d400";
		},
		onBlur: (e) => {
			e.target.style.borderColor = "#e0e0e0";
		},
		children: options.map((option) => /* @__PURE__ */ jsx("option", {
			value: option.value,
			children: option.label
		}, option.value))
	})] });
}
function CheckboxField({ label, checked, onChange }) {
	return /* @__PURE__ */ jsxs("label", {
		style: {
			display: "flex",
			alignItems: "center",
			gap: "10px",
			fontSize: "14px",
			color: "#444",
			cursor: "pointer"
		},
		children: [/* @__PURE__ */ jsx("input", {
			type: "checkbox",
			checked: Boolean(checked),
			onChange: (e) => onChange(e.target.checked)
		}), /* @__PURE__ */ jsx("span", { children: label })]
	});
}
function Card({ children, style = {} }) {
	return /* @__PURE__ */ jsx("div", {
		style: {
			background: "#fff",
			borderRadius: "8px",
			boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
			overflow: "hidden",
			...style
		},
		children
	});
}
function SectionHeader({ title, sub, action }) {
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: "16px",
			marginBottom: "24px",
			flexWrap: "wrap"
		},
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
			style: {
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "16px",
				textTransform: "uppercase",
				color: "#1c1c1c",
				margin: "0 0 4px 0",
				letterSpacing: "-0.2px"
			},
			children: title
		}), sub ? /* @__PURE__ */ jsx("p", {
			style: {
				fontSize: "13px",
				color: "#999",
				margin: 0
			},
			children: sub
		}) : null] }), action]
	});
}
function PrimaryButton({ children, ...props }) {
	return /* @__PURE__ */ jsx("button", {
		...props,
		style: {
			padding: "12px 24px",
			background: "#c8d400",
			color: "#1c1c1c",
			border: "none",
			borderRadius: "6px",
			cursor: "pointer",
			fontFamily: "Arial Black, Arial, sans-serif",
			fontWeight: 900,
			fontSize: "12px",
			textTransform: "uppercase",
			...props.style
		},
		children
	});
}
function SecondaryButton({ children, ...props }) {
	return /* @__PURE__ */ jsx("button", {
		...props,
		style: {
			padding: "12px 20px",
			background: "#f4f4f4",
			color: "#666",
			border: "none",
			borderRadius: "6px",
			cursor: "pointer",
			fontFamily: "Arial Black, Arial, sans-serif",
			fontWeight: 900,
			fontSize: "12px",
			textTransform: "uppercase",
			...props.style
		},
		children
	});
}
function ImageUpload({ label = "Afbeelding", value, onChange }) {
	const [uploading, setUploading] = useState(false);
	const handleFile = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			onChange((await api.uploadCmsMedia(file)).publicUrl);
		} catch (error) {
			window.alert(error.message || "Upload mislukt.");
		} finally {
			setUploading(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(FieldLabel, { children: label }),
		/* @__PURE__ */ jsxs("label", {
			style: {
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: "10px",
				border: "2px dashed #e0e0e0",
				borderRadius: "6px",
				padding: "20px",
				cursor: "pointer",
				background: value ? "transparent" : "#fafafa",
				overflow: "hidden",
				minHeight: "120px",
				position: "relative",
				transition: "border-color .15s"
			},
			children: [value ? /* @__PURE__ */ jsx("img", {
				src: value,
				alt: "preview",
				style: {
					maxHeight: "160px",
					maxWidth: "100%",
					objectFit: "contain",
					borderRadius: "4px"
				}
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx(SvgIcon, {
					d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
					size: 28,
					stroke: "#c8d400",
					strokeWidth: 1.8
				}),
				/* @__PURE__ */ jsx("span", {
					style: {
						fontSize: "13px",
						color: "#aaa"
					},
					children: uploading ? "Uploaden..." : "Klik om afbeelding te uploaden"
				}),
				/* @__PURE__ */ jsx("span", {
					style: {
						fontSize: "11px",
						color: "#ccc"
					},
					children: "PNG, JPG, WEBP"
				})
			] }), /* @__PURE__ */ jsx("input", {
				type: "file",
				accept: "image/*",
				onChange: handleFile,
				style: {
					position: "absolute",
					inset: 0,
					opacity: 0,
					cursor: "pointer",
					width: "100%",
					height: "100%"
				}
			})]
		}),
		value ? /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: () => onChange(""),
			style: {
				marginTop: "8px",
				fontSize: "11px",
				color: "#dc2626",
				background: "none",
				border: "none",
				cursor: "pointer",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				padding: 0
			},
			children: "Afbeelding verwijderen"
		}) : null
	] });
}
function SaveBar({ saving, message, onSave, saveLabel = "Opslaan" }) {
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: "14px",
			marginTop: "28px",
			flexWrap: "wrap"
		},
		children: [/* @__PURE__ */ jsx("div", {
			style: {
				color: message ? "#10b981" : "#999",
				fontSize: "13px"
			},
			children: message || "Wijzigingen worden direct naar de database opgeslagen."
		}), /* @__PURE__ */ jsx(PrimaryButton, {
			type: "button",
			onClick: onSave,
			disabled: saving,
			style: { opacity: saving ? .7 : 1 },
			children: saving ? "Opslaan..." : saveLabel
		})]
	});
}
function Modal({ title, onClose, children }) {
	return /* @__PURE__ */ jsx("div", {
		style: {
			position: "fixed",
			inset: 0,
			background: "rgba(0,0,0,0.55)",
			zIndex: 400,
			display: "flex",
			alignItems: "flex-start",
			justifyContent: "center",
			padding: "40px 20px",
			overflowY: "auto"
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				background: "#fff",
				width: "100%",
				maxWidth: "720px",
				borderRadius: "8px",
				overflow: "hidden",
				boxShadow: "0 24px 64px rgba(0,0,0,0.35)"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					padding: "20px 28px",
					background: "#1c1c1c",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between"
				},
				children: [/* @__PURE__ */ jsx("h3", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "14px",
						textTransform: "uppercase",
						color: "#fff",
						margin: 0
					},
					children: title
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					style: {
						background: "none",
						border: "none",
						color: "#888",
						cursor: "pointer",
						fontSize: "22px",
						lineHeight: 1,
						padding: "0 4px"
					},
					children: "x"
				})]
			}), /* @__PURE__ */ jsx("div", {
				style: { padding: "28px" },
				children
			})]
		})
	});
}
var NAV_GROUPS = [
	{
		label: "Overzicht",
		items: [{
			to: "/admin/dashboard",
			label: "Dashboard",
			d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10"
		}]
	},
	{
		label: "Content",
		items: [
			{
				to: "/admin/homepage",
				label: "Homepage Blocks",
				d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10"
			},
			{
				to: "/admin/over-ons",
				label: "Over Ons",
				d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
			},
			{
				to: "/admin/pages",
				label: "Pages",
				d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
			}
		]
	},
	{
		label: "Collections",
		items: [
			{
				to: "/admin/blog",
				label: "Blog",
				d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"
			},
			{
				to: "/admin/diensten",
				label: "Diensten",
				d: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5"
			},
			{
				to: "/admin/sectoren",
				label: "Sectoren",
				d: "M1 6l11-5 11 5v6c0 5.5-4.67 10.74-11 12C5.67 22.74 1 17.5 1 12V6z"
			},
			{
				to: "/admin/leads",
				label: "Contacts",
				d: "M21 8a2 2 0 01-2 2H5l-4 4V6a2 2 0 012-2h16a2 2 0 012 2z M8 14h8 M8 18h5"
			}
		]
	},
	{
		label: "Platform",
		items: [{
			to: "/admin/instellingen",
			label: "Settings",
			d: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
		}]
	}
];
function pageMeta(pathname) {
	const list = [
		{
			match: "/admin/dashboard",
			title: "Dashboard",
			sub: "Overzicht van content en snelle acties"
		},
		{
			match: "/admin/blog",
			title: "Blog",
			sub: "Beheer alle blogposts via aparte overzichts- en editpagina's"
		},
		{
			match: "/admin/diensten",
			title: "Diensten",
			sub: "Beheer diensten en hun SEO apart"
		},
		{
			match: "/admin/sectoren",
			title: "Sectoren",
			sub: "Beheer sectoren en hun SEO apart"
		},
		{
			match: "/admin/leads",
			title: "Contacts",
			sub: "Bekijk contactaanvragen en stuur replies vanuit het panel"
		},
		{
			match: "/admin/homepage",
			title: "Homepage Blocks",
			sub: "Bewerk homepage-secties zonder het design te wijzigen"
		},
		{
			match: "/admin/over-ons",
			title: "Over Ons",
			sub: "Bewerk de content van de Over Ons-pagina"
		},
		{
			match: "/admin/pages",
			title: "Pages",
			sub: "Beheer pagina-meta, indexatie en statische pagina-inhoud"
		},
		{
			match: "/admin/instellingen",
			title: "Settings",
			sub: "Website, robots en e-mailconfiguratie"
		}
	];
	return list.find((item) => pathname.startsWith(item.match)) || list[0];
}
function Sidebar({ collapsed, setCollapsed }) {
	const location = useLocation();
	const [openGroups, setOpenGroups] = useState(() => ({
		Content: true,
		Collections: true,
		Platform: true,
		Overzicht: true
	}));
	return /* @__PURE__ */ jsxs("aside", {
		style: {
			width: collapsed ? 72 : 240,
			background: "#141616",
			minHeight: "100vh",
			display: "flex",
			flexDirection: "column",
			position: "fixed",
			top: 0,
			left: 0,
			zIndex: 200,
			height: "100vh",
			overflowY: "auto",
			transition: "width .2s ease",
			flexShrink: 0
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				onClick: () => setCollapsed(!collapsed),
				style: {
					padding: "18px 16px",
					borderBottom: "1px solid #252525",
					display: "flex",
					alignItems: "center",
					gap: "12px",
					cursor: "pointer",
					userSelect: "none"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						width: "38px",
						height: "38px",
						background: "#c8d400",
						borderRadius: "6px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0
					},
					children: /* @__PURE__ */ jsx("svg", {
						width: "22",
						height: "22",
						viewBox: "0 0 36 36",
						fill: "none",
						children: /* @__PURE__ */ jsx("path", {
							d: "M7 28 L11 14 L16 22 L21 14 L25 28",
							stroke: "#1a1a1a",
							strokeWidth: "2.8",
							fill: "none",
							strokeLinejoin: "round"
						})
					})
				}), !collapsed ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "15px",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#fff" },
						children: "FERRO"
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "#c8d400" },
						children: "WORKS"
					})]
				}), /* @__PURE__ */ jsx("div", {
					style: {
						fontSize: "10px",
						color: "#555",
						fontStyle: "italic",
						marginTop: "2px"
					},
					children: "Admin Panel"
				})] }) : null]
			}),
			/* @__PURE__ */ jsx("nav", {
				style: {
					padding: "12px 0",
					flex: 1
				},
				children: NAV_GROUPS.map((group) => /* @__PURE__ */ jsxs("div", {
					style: { marginBottom: "10px" },
					children: [!collapsed ? /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setOpenGroups((prev) => ({
							...prev,
							[group.label]: !prev[group.label]
						})),
						style: {
							width: "100%",
							padding: "10px 20px",
							background: "transparent",
							border: "none",
							color: "#8a8a8a",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "10px",
							textTransform: "uppercase",
							letterSpacing: "1px",
							cursor: "pointer"
						},
						children: [/* @__PURE__ */ jsx("span", { children: group.label }), /* @__PURE__ */ jsx("span", { children: openGroups[group.label] ? "v" : ">" })]
					}) : null, collapsed || openGroups[group.label] ? group.items.map((item) => {
						const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
						return /* @__PURE__ */ jsxs(NavLink, {
							to: item.to,
							style: {
								width: "100%",
								display: "flex",
								alignItems: "center",
								gap: "12px",
								padding: collapsed ? "13px 0" : "13px 20px",
								justifyContent: collapsed ? "center" : "flex-start",
								background: isActive ? "rgba(200,212,0,0.1)" : "transparent",
								borderLeft: isActive ? "3px solid #c8d400" : "3px solid transparent",
								color: isActive ? "#c8d400" : "#666",
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "12px",
								letterSpacing: "0.4px",
								textTransform: "uppercase",
								transition: "all .15s ease",
								textDecoration: "none"
							},
							children: [/* @__PURE__ */ jsx(SvgIcon, {
								d: item.d,
								size: 17,
								stroke: "currentColor"
							}), !collapsed ? item.label : null]
						}, item.to);
					}) : null]
				}, group.label))
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					padding: "14px 16px",
					borderTop: "1px solid #252525"
				},
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/",
					target: "_blank",
					style: {
						display: "flex",
						alignItems: "center",
						gap: "9px",
						justifyContent: collapsed ? "center" : "flex-start",
						color: "#555",
						fontSize: "11px",
						textDecoration: "none",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						textTransform: "uppercase",
						letterSpacing: "0.4px"
					},
					children: [/* @__PURE__ */ jsx(SvgIcon, {
						d: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3",
						size: 16
					}), !collapsed ? "Bekijk site" : null]
				})
			})
		]
	});
}
function TopBar({ onLogout }) {
	const meta = pageMeta(useLocation().pathname);
	return /* @__PURE__ */ jsxs("header", {
		style: {
			background: "#fff",
			borderBottom: "1px solid #ebebeb",
			padding: "0 28px",
			height: "64px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			flexShrink: 0
		},
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			style: {
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "17px",
				textTransform: "uppercase",
				color: "#1c1c1c",
				margin: 0,
				letterSpacing: "-0.2px"
			},
			children: meta.title
		}), /* @__PURE__ */ jsx("p", {
			style: {
				fontSize: "12px",
				color: "#aaa",
				margin: 0
			},
			children: meta.sub
		})] }), /* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: "12px"
			},
			children: [/* @__PURE__ */ jsx("div", {
				style: {
					width: "34px",
					height: "34px",
					borderRadius: "50%",
					background: "#c8d400",
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				},
				children: /* @__PURE__ */ jsx(SvgIcon, {
					d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
					size: 16,
					stroke: "#1c1c1c",
					strokeWidth: 2.5
				})
			}), /* @__PURE__ */ jsx(SecondaryButton, {
				type: "button",
				onClick: onLogout,
				children: "Logout"
			})]
		})]
	});
}
function LoginScreen() {
	const { login } = useAuth();
	const [credentials, setCredentials] = useState({
		email: "",
		password: ""
	});
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const handleLogin = async (event) => {
		event.preventDefault();
		setSubmitting(true);
		setError("");
		try {
			await login(credentials.email, credentials.password);
		} catch (err) {
			setError(err.message || "Inloggen mislukt.");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		style: {
			minHeight: "100vh",
			background: "#141616",
			display: "grid",
			placeItems: "center",
			padding: "24px"
		},
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleLogin,
			style: {
				width: "100%",
				maxWidth: "420px",
				background: "#fff",
				padding: "32px",
				borderRadius: "10px",
				boxShadow: "0 24px 64px rgba(0,0,0,0.28)"
			},
			children: [
				/* @__PURE__ */ jsx("h1", {
					style: {
						margin: "0 0 8px 0",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "24px",
						textTransform: "uppercase",
						color: "#1c1c1c"
					},
					children: "Admin Login"
				}),
				/* @__PURE__ */ jsx("p", {
					style: {
						margin: "0 0 24px 0",
						color: "#777",
						lineHeight: 1.6
					},
					children: "Log in om CMS-content en SEO te beheren."
				}),
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gap: "16px"
					},
					children: [/* @__PURE__ */ jsx(FormField, {
						label: "E-mail",
						value: credentials.email,
						onChange: (value) => setCredentials((prev) => ({
							...prev,
							email: value
						})),
						type: "email"
					}), /* @__PURE__ */ jsx(FormField, {
						label: "Wachtwoord",
						value: credentials.password,
						onChange: (value) => setCredentials((prev) => ({
							...prev,
							password: value
						})),
						type: "password"
					})]
				}),
				error ? /* @__PURE__ */ jsx("div", {
					style: {
						marginTop: "16px",
						color: "#dc2626",
						fontSize: "13px"
					},
					children: error
				}) : null,
				/* @__PURE__ */ jsx(PrimaryButton, {
					type: "submit",
					disabled: submitting,
					style: {
						marginTop: "24px",
						width: "100%"
					},
					children: submitting ? "Bezig..." : "Inloggen"
				})
			]
		})
	});
}
function AdminShell() {
	const { user, loading, logout } = useAuth();
	const [collapsed, setCollapsed] = useState(false);
	const sidebarWidth = collapsed ? 72 : 240;
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			minHeight: "100vh",
			display: "grid",
			placeItems: "center",
			fontFamily: "Arial Black, Arial, sans-serif",
			color: "#555"
		},
		children: "Admin laden..."
	});
	if (!user) return /* @__PURE__ */ jsx(LoginScreen, {});
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			minHeight: "100vh",
			background: "#f2f3f5",
			fontFamily: "system-ui, -apple-system, sans-serif"
		},
		children: [/* @__PURE__ */ jsx(Sidebar, {
			collapsed,
			setCollapsed
		}), /* @__PURE__ */ jsxs("div", {
			style: {
				flex: 1,
				marginLeft: sidebarWidth,
				transition: "margin-left .2s ease",
				display: "flex",
				flexDirection: "column",
				minWidth: 0,
				minHeight: "100vh"
			},
			children: [/* @__PURE__ */ jsx(TopBar, { onLogout: logout }), /* @__PURE__ */ jsx("main", {
				style: {
					flex: 1,
					overflowY: "auto",
					padding: "28px 32px"
				},
				children: /* @__PURE__ */ jsx(Outlet, {})
			})]
		})]
	});
}
function DashboardPage() {
	const { cms } = useCms();
	const stats = [
		{
			label: "Blog Posts",
			value: String((cms.blog || []).length),
			color: "#c8d400",
			d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"
		},
		{
			label: "Diensten",
			value: String((cms.diensten || []).length),
			color: "#3b82f6",
			d: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5"
		},
		{
			label: "Sectoren",
			value: String((cms.sectoren || []).length),
			color: "#10b981",
			d: "M1 6l11-5 11 5v6c0 5.5-4.67 10.74-11 12C5.67 22.74 1 17.5 1 12V6z"
		},
		{
			label: "FAQ",
			value: String((cms.faq || []).length),
			color: "#f59e0b",
			d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		}
	];
	const recentBlog = [...cms.blog || []].slice(0, 4);
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(SectionHeader, {
			title: "Dashboard",
			sub: "Snel overzicht van de belangrijkste contentblokken"
		}),
		/* @__PURE__ */ jsx("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
				gap: "18px",
				marginBottom: "24px"
			},
			children: stats.map((item) => /* @__PURE__ */ jsxs(Card, {
				style: {
					padding: "22px",
					display: "flex",
					alignItems: "center",
					gap: "16px"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						width: "46px",
						height: "46px",
						borderRadius: "8px",
						background: `${item.color}1a`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0
					},
					children: /* @__PURE__ */ jsx(SvgIcon, {
						d: item.d,
						size: 22,
						stroke: item.color,
						strokeWidth: 1.8
					})
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "30px",
						color: "#1c1c1c",
						lineHeight: 1
					},
					children: item.value
				}), /* @__PURE__ */ jsx("div", {
					style: {
						fontSize: "11px",
						color: "#aaa",
						marginTop: "4px",
						textTransform: "uppercase",
						letterSpacing: "0.5px"
					},
					children: item.label
				})] })]
			}, item.label))
		}),
		/* @__PURE__ */ jsxs("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "minmax(0, 1fr) 320px",
				gap: "20px"
			},
			children: [/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs("div", {
				style: {
					padding: "18px 22px",
					borderBottom: "1px solid #f2f2f2",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between"
				},
				children: [/* @__PURE__ */ jsx("span", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "13px",
						textTransform: "uppercase",
						color: "#1c1c1c"
					},
					children: "Recente blogposts"
				}), /* @__PURE__ */ jsx(Link, {
					to: "/admin/blog",
					style: {
						fontSize: "12px",
						color: "#c8d400",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						textTransform: "uppercase",
						textDecoration: "none"
					},
					children: "Alles bekijken"
				})]
			}), /* @__PURE__ */ jsx("div", {
				style: { padding: "10px 22px 22px" },
				children: recentBlog.length ? recentBlog.map((post) => /* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "1fr auto auto",
						gap: "16px",
						padding: "16px 0",
						borderBottom: "1px solid #f3f3f3",
						alignItems: "center"
					},
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontSize: "12px",
								textTransform: "uppercase",
								color: "#1c1c1c",
								marginBottom: "5px"
							},
							children: post.title
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								fontSize: "12px",
								color: "#888"
							},
							children: [
								post.category,
								" • ",
								post.date
							]
						})] }),
						/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "11px",
								color: post.status === "Gepubliceerd" ? "#10b981" : "#999",
								fontFamily: "Arial Black, Arial, sans-serif",
								textTransform: "uppercase"
							},
							children: post.status
						}),
						/* @__PURE__ */ jsx(Link, {
							to: `/admin/blog/${post.slug || post.id}/edit`,
							style: {
								fontSize: "12px",
								color: "#1c1c1c",
								textDecoration: "none"
							},
							children: "Bewerken"
						})
					]
				}, post.slug || post.id)) : /* @__PURE__ */ jsx("div", {
					style: {
						padding: "18px 0",
						color: "#999"
					},
					children: "Nog geen posts."
				})
			})] }), /* @__PURE__ */ jsxs(Card, {
				style: { padding: "22px" },
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "13px",
						textTransform: "uppercase",
						color: "#1c1c1c",
						marginBottom: "16px"
					},
					children: "Snelle acties"
				}), /* @__PURE__ */ jsx("div", {
					style: {
						display: "grid",
						gap: "12px"
					},
					children: [
						{
							label: "Nieuwe blogpost",
							to: "/admin/blog/new"
						},
						{
							label: "Nieuwe dienst",
							to: "/admin/diensten/new"
						},
						{
							label: "Nieuwe sector",
							to: "/admin/sectoren/new"
						},
						{
							label: "Bekijk leads",
							to: "/admin/leads"
						},
						{
							label: "SEO instellingen",
							to: "/admin/instellingen"
						}
					].map((item) => /* @__PURE__ */ jsx(Link, {
						to: item.to,
						style: {
							padding: "14px 16px",
							background: "#f8f8f8",
							borderRadius: "8px",
							textDecoration: "none",
							color: "#222",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "12px",
							textTransform: "uppercase"
						},
						children: item.label
					}, item.to))
				})]
			})]
		})
	] });
}
function LeadsPage() {
	const [leads, setLeads] = useState([]);
	const [mailConfigured, setMailConfigured] = useState(false);
	const [emailSettings, setEmailSettings] = useState({ templates: [] });
	const [loadingLeads, setLoadingLeads] = useState(true);
	const [leadError, setLeadError] = useState("");
	const [viewLead, setViewLead] = useState(null);
	const [selectedLead, setSelectedLead] = useState(null);
	const [replyForm, setReplyForm] = useState({
		subject: "",
		message: ""
	});
	const [replying, setReplying] = useState(false);
	useEffect(() => {
		let cancelled = false;
		Promise.all([api.getAdminLeads(), api.getEmailSettings()]).then(([leadData, emailData]) => {
			if (cancelled) return;
			setLeads(leadData.items || []);
			setMailConfigured(Boolean(leadData.mailConfigured));
			setEmailSettings(emailData || { templates: [] });
			setLeadError("");
		}).catch((error) => {
			if (cancelled) return;
			setLeadError(error.message || "Kon contactaanvragen niet laden.");
		}).finally(() => {
			if (!cancelled) setLoadingLeads(false);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const openReply = (lead) => {
		const firstTemplate = emailSettings.templates?.[0];
		setSelectedLead(lead);
		setReplyForm({
			subject: firstTemplate?.subject?.replace(/\{\{name\}\}/g, lead.name) || "Re: uw aanvraag bij FerroWorks",
			message: firstTemplate?.body?.replace(/\{\{name\}\}/g, lead.name) || `Beste ${lead.name},\n\nBedankt voor uw bericht.\n\nMet vriendelijke groet,\nFerroWorks`,
			templateId: firstTemplate?.id || ""
		});
	};
	const applyTemplate = (templateId) => {
		if (!selectedLead) return;
		const template = (emailSettings.templates || []).find((item) => item.id === templateId);
		if (!template) return;
		setReplyForm({
			templateId,
			subject: template.subject.replace(/\{\{name\}\}/g, selectedLead.name),
			message: template.body.replace(/\{\{name\}\}/g, selectedLead.name)
		});
	};
	const sendReply = async () => {
		if (!selectedLead) return;
		setReplying(true);
		try {
			const updated = await api.replyToLead(selectedLead.id, replyForm);
			setLeads((prev) => prev.map((item) => item.id === updated.id ? updated : item));
			setSelectedLead(null);
		} catch (error) {
			window.alert(error.message || "E-mail verzenden mislukt.");
		} finally {
			setReplying(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(SectionHeader, {
			title: "Contacts / Leads",
			sub: mailConfigured ? "Nieuwe inzendingen uit het contactformulier" : "Nieuwe inzendingen uit het contactformulier. SMTP is nog niet geconfigureerd."
		}),
		/* @__PURE__ */ jsxs(Card, { children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					padding: "18px 22px",
					borderBottom: "1px solid #f2f2f2",
					display: "grid",
					gridTemplateColumns: "1.4fr 1fr 1fr 120px 1.2fr",
					gap: "16px",
					fontSize: "11px",
					color: "#bbb",
					fontFamily: "Arial Black, Arial, sans-serif",
					textTransform: "uppercase"
				},
				children: [
					/* @__PURE__ */ jsx("div", { children: "Naam" }),
					/* @__PURE__ */ jsx("div", { children: "E-mail" }),
					/* @__PURE__ */ jsx("div", { children: "Datum" }),
					/* @__PURE__ */ jsx("div", { children: "Status" }),
					/* @__PURE__ */ jsx("div", {
						style: { textAlign: "right" },
						children: "Acties"
					})
				]
			}),
			loadingLeads ? /* @__PURE__ */ jsx("div", {
				style: {
					padding: "24px",
					color: "#999"
				},
				children: "Contactaanvragen laden..."
			}) : null,
			!loadingLeads && leadError ? /* @__PURE__ */ jsx("div", {
				style: {
					padding: "24px",
					color: "#dc2626"
				},
				children: leadError
			}) : null,
			!loadingLeads && !leadError && !leads.length ? /* @__PURE__ */ jsx("div", {
				style: {
					padding: "24px",
					color: "#999"
				},
				children: "Nog geen contactaanvragen ontvangen."
			}) : null,
			!loadingLeads && !leadError ? leads.map((lead) => /* @__PURE__ */ jsxs("div", {
				style: {
					padding: "18px 22px",
					borderBottom: "1px solid #f5f5f5",
					display: "grid",
					gridTemplateColumns: "1.4fr 1fr 1fr 120px 1.2fr",
					gap: "16px",
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "13px",
							color: "#1c1c1c",
							marginBottom: "5px"
						},
						children: lead.name
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "12px",
							color: "#888"
						},
						children: lead.company || stripHtml(lead.message).slice(0, 90)
					})] }),
					/* @__PURE__ */ jsx("div", {
						style: {
							color: "#666",
							fontSize: "13px"
						},
						children: lead.email
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							color: "#666",
							fontSize: "13px"
						},
						children: new Date(lead.createdAt).toLocaleDateString()
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							color: lead.status === "replied" ? "#10b981" : "#f59e0b",
							fontSize: "11px",
							fontFamily: "Arial Black, Arial, sans-serif",
							textTransform: "uppercase"
						},
						children: lead.status
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "flex-end",
							gap: "8px",
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ jsx("button", {
								onClick: () => setViewLead(lead),
								style: {
									padding: "7px 14px",
									background: "#f0f0f0",
									color: "#555",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
									fontSize: "11px",
									fontFamily: "Arial Black, Arial, sans-serif",
									textTransform: "uppercase"
								},
								children: "Bekijk"
							}),
							lead.attachment?.publicUrl ? /* @__PURE__ */ jsx(Link, {
								to: lead.attachment.publicUrl,
								target: "_blank",
								style: {
									padding: "7px 14px",
									background: "#f0f0f0",
									color: "#555",
									borderRadius: "4px",
									textDecoration: "none",
									fontSize: "11px",
									fontFamily: "Arial Black, Arial, sans-serif",
									textTransform: "uppercase"
								},
								children: "Bijlage"
							}) : null,
							/* @__PURE__ */ jsx("button", {
								onClick: () => openReply(lead),
								style: {
									padding: "7px 14px",
									background: "#f0f4e0",
									color: "#6b7a00",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
									fontSize: "11px",
									fontFamily: "Arial Black, Arial, sans-serif",
									textTransform: "uppercase"
								},
								children: "Mail"
							})
						]
					})
				]
			}, lead.id)) : null
		] }),
		viewLead ? /* @__PURE__ */ jsx(Modal, {
			title: `Lead van ${viewLead.name}`,
			onClose: () => setViewLead(null),
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gap: "16px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "160px 1fr",
							gap: "12px",
							fontSize: "14px",
							color: "#444"
						},
						children: [
							/* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									textTransform: "uppercase",
									color: "#999",
									fontSize: "11px"
								},
								children: "Naam"
							}),
							/* @__PURE__ */ jsx("div", { children: viewLead.name }),
							/* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									textTransform: "uppercase",
									color: "#999",
									fontSize: "11px"
								},
								children: "Bedrijf"
							}),
							/* @__PURE__ */ jsx("div", { children: viewLead.company || "-" }),
							/* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									textTransform: "uppercase",
									color: "#999",
									fontSize: "11px"
								},
								children: "E-mail"
							}),
							/* @__PURE__ */ jsx("div", { children: viewLead.email }),
							/* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									textTransform: "uppercase",
									color: "#999",
									fontSize: "11px"
								},
								children: "Telefoon"
							}),
							/* @__PURE__ */ jsx("div", { children: viewLead.phone || "-" }),
							/* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									textTransform: "uppercase",
									color: "#999",
									fontSize: "11px"
								},
								children: "Datum"
							}),
							/* @__PURE__ */ jsx("div", { children: new Date(viewLead.createdAt).toLocaleString() }),
							/* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									textTransform: "uppercase",
									color: "#999",
									fontSize: "11px"
								},
								children: "Status"
							}),
							/* @__PURE__ */ jsx("div", { children: viewLead.status })
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							padding: "16px",
							background: "#fafafa",
							borderRadius: "8px",
							color: "#555",
							fontSize: "14px",
							lineHeight: 1.8,
							whiteSpace: "pre-wrap"
						},
						children: viewLead.message
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "flex-end",
							gap: "12px"
						},
						children: [viewLead.attachment?.publicUrl ? /* @__PURE__ */ jsx(Link, {
							to: viewLead.attachment.publicUrl,
							target: "_blank",
							style: { textDecoration: "none" },
							children: /* @__PURE__ */ jsx(SecondaryButton, {
								type: "button",
								children: "Bijlage openen"
							})
						}) : null, /* @__PURE__ */ jsx(PrimaryButton, {
							type: "button",
							onClick: () => {
								setViewLead(null);
								openReply(viewLead);
							},
							children: "Mail sturen"
						})]
					})
				]
			})
		}) : null,
		selectedLead ? /* @__PURE__ */ jsx(Modal, {
			title: `Mail naar ${selectedLead.name}`,
			onClose: () => setSelectedLead(null),
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gap: "16px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							padding: "16px",
							background: "#fafafa",
							borderRadius: "8px",
							color: "#555",
							fontSize: "14px",
							lineHeight: 1.7
						},
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("strong", { children: "E-mail:" }),
								" ",
								selectedLead.email
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("strong", { children: "Telefoon:" }),
								" ",
								selectedLead.phone || "-"
							] }),
							/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("strong", { children: "Bericht:" }) }),
							/* @__PURE__ */ jsx("div", { children: selectedLead.message })
						]
					}),
					!mailConfigured ? /* @__PURE__ */ jsxs("div", {
						style: {
							padding: "14px 16px",
							background: "#fff7e6",
							color: "#8a5a00",
							borderRadius: "8px",
							fontSize: "13px",
							lineHeight: 1.6
						},
						children: [
							"SMTP is nog niet geconfigureerd in ",
							/* @__PURE__ */ jsx("strong", { children: "server/.env" }),
							". Je kunt het bericht hier wel voorbereiden, maar verzenden werkt pas nadat `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` en `SMTP_FROM` zijn ingesteld."
						]
					}) : null,
					/* @__PURE__ */ jsx(SelectField, {
						label: "Template",
						value: replyForm.templateId || "",
						onChange: applyTemplate,
						options: [{
							value: "",
							label: "Kies template"
						}, ...(emailSettings.templates || []).map((item) => ({
							value: item.id,
							label: item.name
						}))]
					}),
					/* @__PURE__ */ jsx(FormField, {
						label: "Onderwerp",
						value: replyForm.subject,
						onChange: (value) => setReplyForm((prev) => ({
							...prev,
							subject: value
						}))
					}),
					/* @__PURE__ */ jsx(FormField, {
						label: "Bericht",
						value: replyForm.message,
						onChange: (value) => setReplyForm((prev) => ({
							...prev,
							message: value
						})),
						multiline: true,
						rows: 10
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "flex-end",
							gap: "12px"
						},
						children: [/* @__PURE__ */ jsx(SecondaryButton, {
							type: "button",
							onClick: () => setSelectedLead(null),
							children: "Annuleren"
						}), /* @__PURE__ */ jsx(PrimaryButton, {
							type: "button",
							onClick: sendReply,
							disabled: replying || !mailConfigured,
							style: { opacity: replying || !mailConfigured ? .65 : 1 },
							children: replying ? "Verzenden..." : "Verzend mail"
						})]
					})
				]
			})
		}) : null
	] });
}
function CollectionRowActions({ editTo, publicTo, onDelete }) {
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			gap: "8px",
			justifyContent: "flex-end",
			flexWrap: "wrap"
		},
		children: [
			publicTo ? /* @__PURE__ */ jsx(Link, {
				to: publicTo,
				target: "_blank",
				style: {
					padding: "7px 14px",
					background: "#f0f0f0",
					color: "#555",
					borderRadius: "4px",
					textDecoration: "none",
					fontSize: "11px",
					fontFamily: "Arial Black, Arial, sans-serif",
					textTransform: "uppercase"
				},
				children: "Bekijk"
			}) : null,
			/* @__PURE__ */ jsx(Link, {
				to: editTo,
				style: {
					padding: "7px 14px",
					background: "#f0f4e0",
					color: "#6b7a00",
					borderRadius: "4px",
					textDecoration: "none",
					fontSize: "11px",
					fontFamily: "Arial Black, Arial, sans-serif",
					textTransform: "uppercase"
				},
				children: "Bewerk"
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: onDelete,
				style: {
					padding: "7px 14px",
					background: "#fef2f2",
					color: "#dc2626",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer",
					fontSize: "11px",
					fontFamily: "Arial Black, Arial, sans-serif",
					textTransform: "uppercase"
				},
				children: "Verwijder"
			})
		]
	});
}
function BlogListPage() {
	const { cms, updateCms } = useCms();
	const handleDelete = async (slug) => {
		if (!window.confirm("Weet je zeker dat je deze blogpost wilt verwijderen?")) return;
		await updateCms("blog", (cms.blog || []).filter((item) => (item.slug || item.id) !== slug));
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: "Blog",
		sub: "Elke post heeft een eigen create- en editpagina",
		action: /* @__PURE__ */ jsx(Link, {
			to: "/admin/blog/new",
			style: { textDecoration: "none" },
			children: /* @__PURE__ */ jsx(PrimaryButton, {
				type: "button",
				children: "Nieuwe blogpost"
			})
		})
	}), /* @__PURE__ */ jsxs(Card, { children: [
		/* @__PURE__ */ jsxs("div", {
			style: {
				padding: "20px 22px",
				borderBottom: "1px solid #f2f2f2",
				display: "grid",
				gridTemplateColumns: "2fr 1fr 120px 1fr",
				gap: "16px",
				fontSize: "11px",
				color: "#bbb",
				fontFamily: "Arial Black, Arial, sans-serif",
				textTransform: "uppercase"
			},
			children: [
				/* @__PURE__ */ jsx("div", { children: "Titel" }),
				/* @__PURE__ */ jsx("div", { children: "Categorie" }),
				/* @__PURE__ */ jsx("div", { children: "Status" }),
				/* @__PURE__ */ jsx("div", {
					style: { textAlign: "right" },
					children: "Acties"
				})
			]
		}),
		(cms.blog || []).map((post) => /* @__PURE__ */ jsxs("div", {
			style: {
				padding: "18px 22px",
				borderBottom: "1px solid #f5f5f5",
				display: "grid",
				gridTemplateColumns: "2fr 1fr 120px 1fr",
				gap: "16px",
				alignItems: "center"
			},
			children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontSize: "13px",
						color: "#1c1c1c",
						marginBottom: "5px"
					},
					children: post.title
				}), /* @__PURE__ */ jsx("div", {
					style: {
						fontSize: "12px",
						color: "#888"
					},
					children: stripHtml(post.excerpt).slice(0, 120)
				})] }),
				/* @__PURE__ */ jsx("div", {
					style: {
						color: "#666",
						fontSize: "13px"
					},
					children: post.category
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						color: post.status === "Gepubliceerd" ? "#10b981" : "#999",
						fontSize: "11px",
						fontFamily: "Arial Black, Arial, sans-serif",
						textTransform: "uppercase"
					},
					children: post.status
				}),
				/* @__PURE__ */ jsx(CollectionRowActions, {
					editTo: `/admin/blog/${post.slug || post.id}/edit`,
					publicTo: `/blog/${post.slug || post.id}`,
					onDelete: () => handleDelete(post.slug || post.id)
				})
			]
		}, post.slug || post.id)),
		!(cms.blog || []).length ? /* @__PURE__ */ jsx("div", {
			style: {
				padding: "24px",
				color: "#999"
			},
			children: "Nog geen blogposts."
		}) : null
	] })] });
}
function ServiceListPage() {
	const { cms, updateCms } = useCms();
	const handleDelete = async (slug) => {
		if (!window.confirm("Weet je zeker dat je deze dienst wilt verwijderen?")) return;
		await updateCms("diensten", (cms.diensten || []).filter((item) => item.id !== slug));
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: "Diensten",
		sub: "Elke dienst heeft een eigen create- en editpagina",
		action: /* @__PURE__ */ jsx(Link, {
			to: "/admin/diensten/new",
			style: { textDecoration: "none" },
			children: /* @__PURE__ */ jsx(PrimaryButton, {
				type: "button",
				children: "Nieuwe dienst"
			})
		})
	}), /* @__PURE__ */ jsxs(Card, { children: [(cms.diensten || []).map((item) => /* @__PURE__ */ jsxs("div", {
		style: {
			padding: "18px 22px",
			borderBottom: "1px solid #f5f5f5",
			display: "grid",
			gridTemplateColumns: "90px 1.5fr 1fr 1fr",
			gap: "16px",
			alignItems: "center"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					color: "#c8d400"
				},
				children: item.nr
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontSize: "13px",
					color: "#1c1c1c",
					marginBottom: "5px"
				},
				children: item.title
			}), /* @__PURE__ */ jsx("div", {
				style: {
					fontSize: "12px",
					color: "#888"
				},
				children: item.subtitle
			})] }),
			/* @__PURE__ */ jsx("div", {
				style: {
					color: "#666",
					fontSize: "13px"
				},
				children: stripHtml(item.excerpt).slice(0, 90)
			}),
			/* @__PURE__ */ jsx(CollectionRowActions, {
				editTo: `/admin/diensten/${item.id}/edit`,
				publicTo: `/diensten/${item.id}`,
				onDelete: () => handleDelete(item.id)
			})
		]
	}, item.id)), !(cms.diensten || []).length ? /* @__PURE__ */ jsx("div", {
		style: {
			padding: "24px",
			color: "#999"
		},
		children: "Nog geen diensten."
	}) : null] })] });
}
function SectorListPage() {
	const { cms, updateCms } = useCms();
	const handleDelete = async (slug) => {
		if (!window.confirm("Weet je zeker dat je deze sector wilt verwijderen?")) return;
		await updateCms("sectoren", (cms.sectoren || []).filter((item) => item.id !== slug));
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: "Sectoren",
		sub: "Elke sector heeft een eigen create- en editpagina",
		action: /* @__PURE__ */ jsx(Link, {
			to: "/admin/sectoren/new",
			style: { textDecoration: "none" },
			children: /* @__PURE__ */ jsx(PrimaryButton, {
				type: "button",
				children: "Nieuwe sector"
			})
		})
	}), /* @__PURE__ */ jsxs(Card, { children: [(cms.sectoren || []).map((item) => /* @__PURE__ */ jsxs("div", {
		style: {
			padding: "18px 22px",
			borderBottom: "1px solid #f5f5f5",
			display: "grid",
			gridTemplateColumns: "90px 1.5fr 1fr",
			gap: "16px",
			alignItems: "center"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					color: "#c8d400"
				},
				children: item.nr
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontSize: "13px",
					color: "#1c1c1c",
					marginBottom: "5px"
				},
				children: item.naam
			}), /* @__PURE__ */ jsx("div", {
				style: {
					fontSize: "12px",
					color: "#888"
				},
				children: item.tagline
			})] }),
			/* @__PURE__ */ jsx(CollectionRowActions, {
				editTo: `/admin/sectoren/${item.id}/edit`,
				onDelete: () => handleDelete(item.id)
			})
		]
	}, item.id)), !(cms.sectoren || []).length ? /* @__PURE__ */ jsx("div", {
		style: {
			padding: "24px",
			color: "#999"
		},
		children: "Nog geen sectoren."
	}) : null] })] });
}
function BlogFormPage() {
	const { slug } = useParams();
	const { cms, updateCms } = useCms();
	const navigate = useNavigate();
	const editing = Boolean(slug);
	const source = useMemo(() => (cms.blog || []).find((item) => (item.slug || item.id) === slug), [cms.blog, slug]);
	const [form, setForm] = useState({
		title: "",
		slug: "",
		category: "",
		date: "",
		readTime: "",
		status: "Concept",
		featured: false,
		excerpt: "",
		body: "",
		image: "",
		seoTitle: "",
		seoDescription: ""
	});
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	useEffect(() => {
		if (source) setForm({
			title: source.title || "",
			slug: source.slug || source.id || "",
			category: source.category || "",
			date: source.date || "",
			readTime: source.readTime || "",
			status: source.status || "Concept",
			featured: Boolean(source.featured),
			excerpt: source.excerpt || "",
			body: source.body || "",
			image: source.image || "",
			seoTitle: source.seoTitle || "",
			seoDescription: source.seoDescription || ""
		});
	}, [source]);
	if (editing && !source) return /* @__PURE__ */ jsx(Navigate, {
		to: "/admin/blog",
		replace: true
	});
	const setField = (key) => (value) => setForm((prev) => ({
		...prev,
		[key]: value
	}));
	const save = async () => {
		setSaving(true);
		const finalSlug = makeSlug(form.slug || form.title, "blog-post");
		const payload = {
			...form,
			slug: finalSlug
		};
		const ok = await updateCms("blog", editing ? (cms.blog || []).map((item) => (item.slug || item.id) === slug ? {
			...item,
			...payload,
			id: finalSlug
		} : item) : [...cms.blog || [], {
			...payload,
			id: finalSlug
		}]);
		setSaving(false);
		if (ok) {
			setMessage("Blogpost opgeslagen.");
			navigate("/admin/blog");
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: editing ? "Blogpost Bewerken" : "Nieuwe Blogpost",
		sub: "Titel, inhoud, rich text en SEO op een eigen pagina"
	}), /* @__PURE__ */ jsxs(Card, {
		style: {
			padding: "28px",
			maxWidth: "980px"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				display: "grid",
				gap: "18px"
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "1.3fr 1fr",
						gap: "16px"
					},
					children: [/* @__PURE__ */ jsx(FormField, {
						label: "Titel",
						value: form.title,
						onChange: setField("title")
					}), /* @__PURE__ */ jsx(FormField, {
						label: "Slug",
						value: form.slug,
						onChange: setField("slug"),
						placeholder: "automatisch uit titel"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "1fr 160px 160px 160px",
						gap: "16px"
					},
					children: [
						/* @__PURE__ */ jsx(FormField, {
							label: "Categorie",
							value: form.category,
							onChange: setField("category")
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Datum",
							value: form.date,
							onChange: setField("date"),
							placeholder: "17 april 2026"
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Leestijd",
							value: form.readTime,
							onChange: setField("readTime"),
							placeholder: "4 min"
						}),
						/* @__PURE__ */ jsx(SelectField, {
							label: "Status",
							value: form.status,
							onChange: setField("status"),
							options: [{
								value: "Concept",
								label: "Concept"
							}, {
								value: "Gepubliceerd",
								label: "Gepubliceerd"
							}]
						})
					]
				}),
				/* @__PURE__ */ jsx(CheckboxField, {
					label: "Uitgelichte blogpost",
					checked: form.featured,
					onChange: setField("featured")
				}),
				/* @__PURE__ */ jsx(FormField, {
					label: "Excerpt",
					value: form.excerpt,
					onChange: setField("excerpt"),
					multiline: true,
					rows: 4
				}),
				/* @__PURE__ */ jsx(RichTextEditor, {
					label: "Beschrijving / artikelinhoud",
					value: form.body,
					onChange: setField("body")
				}),
				/* @__PURE__ */ jsx(ImageUpload, {
					label: "Uitgelichte afbeelding",
					value: form.image,
					onChange: setField("image")
				}),
				/* @__PURE__ */ jsxs(Card, {
					style: {
						padding: "18px",
						background: "#fafafa",
						boxShadow: "none"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							color: "#1c1c1c",
							marginBottom: "16px"
						},
						children: "SEO Meta Info"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gap: "16px"
						},
						children: [/* @__PURE__ */ jsx(FormField, {
							label: "Meta title",
							value: form.seoTitle,
							onChange: setField("seoTitle")
						}), /* @__PURE__ */ jsx(FormField, {
							label: "Meta description",
							value: form.seoDescription,
							onChange: setField("seoDescription"),
							multiline: true,
							rows: 3
						})]
					})]
				})
			]
		}), /* @__PURE__ */ jsx(SaveBar, {
			saving,
			message,
			onSave: save,
			saveLabel: editing ? "Wijzigingen opslaan" : "Blogpost aanmaken"
		})]
	})] });
}
function ServiceFormPage() {
	const { slug } = useParams();
	const { cms, updateCms } = useCms();
	const navigate = useNavigate();
	const editing = Boolean(slug);
	const source = useMemo(() => (cms.diensten || []).find((item) => item.id === slug), [cms.diensten, slug]);
	const [form, setForm] = useState({
		nr: "",
		title: "",
		subtitle: "",
		slug: "",
		excerpt: "",
		checklist: "",
		body: "",
		image: "",
		seoTitle: "",
		seoDescription: ""
	});
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	useEffect(() => {
		if (source) setForm({
			nr: source.nr || "",
			title: source.title || "",
			subtitle: source.subtitle || "",
			slug: source.id || "",
			excerpt: source.excerpt || "",
			checklist: source.checklist || "",
			body: source.body || "",
			image: source.image || "",
			seoTitle: source.seoTitle || "",
			seoDescription: source.seoDescription || ""
		});
	}, [source]);
	if (editing && !source) return /* @__PURE__ */ jsx(Navigate, {
		to: "/admin/diensten",
		replace: true
	});
	const setField = (key) => (value) => setForm((prev) => ({
		...prev,
		[key]: value
	}));
	const save = async () => {
		setSaving(true);
		const finalSlug = makeSlug(form.slug || form.title, "dienst");
		const payload = {
			...form,
			id: finalSlug
		};
		const ok = await updateCms("diensten", editing ? (cms.diensten || []).map((item) => item.id === slug ? payload : item) : [...cms.diensten || [], payload]);
		setSaving(false);
		if (ok) {
			setMessage("Dienst opgeslagen.");
			navigate("/admin/diensten");
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: editing ? "Dienst Bewerken" : "Nieuwe Dienst",
		sub: "Eigen pagina voor inhoud, checklist en SEO"
	}), /* @__PURE__ */ jsxs(Card, {
		style: {
			padding: "28px",
			maxWidth: "980px"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				display: "grid",
				gap: "18px"
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "120px 1.4fr 1fr",
						gap: "16px"
					},
					children: [
						/* @__PURE__ */ jsx(FormField, {
							label: "Nummer",
							value: form.nr,
							onChange: setField("nr")
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Titel",
							value: form.title,
							onChange: setField("title")
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Slug",
							value: form.slug,
							onChange: setField("slug")
						})
					]
				}),
				/* @__PURE__ */ jsx(FormField, {
					label: "Subtitel",
					value: form.subtitle,
					onChange: setField("subtitle")
				}),
				/* @__PURE__ */ jsx(FormField, {
					label: "Korte beschrijving",
					value: form.excerpt,
					onChange: setField("excerpt"),
					multiline: true,
					rows: 3
				}),
				/* @__PURE__ */ jsx(FormField, {
					label: "Checklist (één per regel)",
					value: form.checklist,
					onChange: setField("checklist"),
					multiline: true,
					rows: 6
				}),
				/* @__PURE__ */ jsx(RichTextEditor, {
					label: "Beschrijving",
					value: form.body,
					onChange: setField("body")
				}),
				/* @__PURE__ */ jsx(ImageUpload, {
					label: "Afbeelding",
					value: form.image,
					onChange: setField("image")
				}),
				/* @__PURE__ */ jsxs(Card, {
					style: {
						padding: "18px",
						background: "#fafafa",
						boxShadow: "none"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							color: "#1c1c1c",
							marginBottom: "16px"
						},
						children: "SEO Meta Info"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gap: "16px"
						},
						children: [/* @__PURE__ */ jsx(FormField, {
							label: "Meta title",
							value: form.seoTitle,
							onChange: setField("seoTitle")
						}), /* @__PURE__ */ jsx(FormField, {
							label: "Meta description",
							value: form.seoDescription,
							onChange: setField("seoDescription"),
							multiline: true,
							rows: 3
						})]
					})]
				})
			]
		}), /* @__PURE__ */ jsx(SaveBar, {
			saving,
			message,
			onSave: save,
			saveLabel: editing ? "Wijzigingen opslaan" : "Dienst aanmaken"
		})]
	})] });
}
function SectorFormPage() {
	const { slug } = useParams();
	const { cms, updateCms } = useCms();
	const navigate = useNavigate();
	const editing = Boolean(slug);
	const source = useMemo(() => (cms.sectoren || []).find((item) => item.id === slug), [cms.sectoren, slug]);
	const [form, setForm] = useState({
		nr: "",
		naam: "",
		tagline: "",
		slug: "",
		description: "",
		intro: "",
		items: "",
		image: "",
		seoTitle: "",
		seoDescription: ""
	});
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	useEffect(() => {
		if (source) setForm({
			nr: source.nr || "",
			naam: source.naam || "",
			tagline: source.tagline || "",
			slug: source.id || "",
			description: source.description || "",
			intro: source.intro || "",
			items: source.items || "",
			image: source.image || "",
			seoTitle: source.seoTitle || "",
			seoDescription: source.seoDescription || ""
		});
	}, [source]);
	if (editing && !source) return /* @__PURE__ */ jsx(Navigate, {
		to: "/admin/sectoren",
		replace: true
	});
	const setField = (key) => (value) => setForm((prev) => ({
		...prev,
		[key]: value
	}));
	const save = async () => {
		setSaving(true);
		const finalSlug = makeSlug(form.slug || form.naam, "sector");
		const payload = {
			...form,
			id: finalSlug
		};
		const ok = await updateCms("sectoren", editing ? (cms.sectoren || []).map((item) => item.id === slug ? payload : item) : [...cms.sectoren || [], payload]);
		setSaving(false);
		if (ok) {
			setMessage("Sector opgeslagen.");
			navigate("/admin/sectoren");
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: editing ? "Sector Bewerken" : "Nieuwe Sector",
		sub: "Eigen pagina voor sectorinformatie en SEO"
	}), /* @__PURE__ */ jsxs(Card, {
		style: {
			padding: "28px",
			maxWidth: "980px"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				display: "grid",
				gap: "18px"
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "120px 1.4fr 1fr",
						gap: "16px"
					},
					children: [
						/* @__PURE__ */ jsx(FormField, {
							label: "Nummer",
							value: form.nr,
							onChange: setField("nr")
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Naam",
							value: form.naam,
							onChange: setField("naam")
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Slug",
							value: form.slug,
							onChange: setField("slug")
						})
					]
				}),
				/* @__PURE__ */ jsx(FormField, {
					label: "Tagline",
					value: form.tagline,
					onChange: setField("tagline")
				}),
				/* @__PURE__ */ jsx(RichTextEditor, {
					label: "Korte beschrijving",
					value: form.description,
					onChange: setField("description")
				}),
				/* @__PURE__ */ jsx(RichTextEditor, {
					label: "Intro",
					value: form.intro,
					onChange: setField("intro")
				}),
				/* @__PURE__ */ jsx(FormField, {
					label: "USP / items (één per regel)",
					value: form.items,
					onChange: setField("items"),
					multiline: true,
					rows: 6
				}),
				/* @__PURE__ */ jsx(ImageUpload, {
					label: "Afbeelding",
					value: form.image,
					onChange: setField("image")
				}),
				/* @__PURE__ */ jsxs(Card, {
					style: {
						padding: "18px",
						background: "#fafafa",
						boxShadow: "none"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							color: "#1c1c1c",
							marginBottom: "16px"
						},
						children: "SEO Meta Info"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gap: "16px"
						},
						children: [/* @__PURE__ */ jsx(FormField, {
							label: "Meta title",
							value: form.seoTitle,
							onChange: setField("seoTitle")
						}), /* @__PURE__ */ jsx(FormField, {
							label: "Meta description",
							value: form.seoDescription,
							onChange: setField("seoDescription"),
							multiline: true,
							rows: 3
						})]
					})]
				})
			]
		}), /* @__PURE__ */ jsx(SaveBar, {
			saving,
			message,
			onSave: save,
			saveLabel: editing ? "Wijzigingen opslaan" : "Sector aanmaken"
		})]
	})] });
}
function HomepagePage() {
	const { cms, updateCms } = useCms();
	const [hero, setHero] = useState(cms.hero || {});
	const [watFerna, setWatFerna] = useState(cms.watFerna || {});
	const [anders, setAnders] = useState(cms.anders || { items: [] });
	const [projecten, setProjecten] = useState(cms.projecten || []);
	const [faq, setFaq] = useState(cms.faq || []);
	const [statsText, setStatsText] = useState(() => (cms.stats || []).map((item) => `${item.number} | ${item.desc}`).join("\n"));
	const [saved, setSaved] = useState("");
	useEffect(() => {
		setHero(cms.hero || {});
		setWatFerna(cms.watFerna || {});
		setAnders(cms.anders || { items: [] });
		setProjecten(cms.projecten || []);
		setFaq(cms.faq || []);
		setStatsText((cms.stats || []).map((item) => `${item.number} | ${item.desc}`).join("\n"));
	}, [cms]);
	const saveSection = async (key, value) => {
		if (await updateCms(key, value)) {
			setSaved(key);
			window.setTimeout(() => setSaved(""), 1600);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "grid",
			gap: "24px",
			maxWidth: "1040px"
		},
		children: [
			/* @__PURE__ */ jsx(SectionHeader, {
				title: "Homepage",
				sub: "Elke homepage-sectie heeft hier zijn eigen blok"
			}),
			/* @__PURE__ */ jsxs(Card, {
				style: { padding: "24px" },
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "12px",
							textTransform: "uppercase",
							marginBottom: "16px"
						},
						children: "Hero"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gap: "16px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "16px"
								},
								children: [/* @__PURE__ */ jsx(FormField, {
									label: "Titel regel 1",
									value: hero.line1,
									onChange: (value) => setHero((prev) => ({
										...prev,
										line1: value
									}))
								}), /* @__PURE__ */ jsx(FormField, {
									label: "Titel regel 2",
									value: hero.line2,
									onChange: (value) => setHero((prev) => ({
										...prev,
										line2: value
									}))
								})]
							}),
							/* @__PURE__ */ jsx(FormField, {
								label: "Subtitel",
								value: hero.subtitle,
								onChange: (value) => setHero((prev) => ({
									...prev,
									subtitle: value
								})),
								multiline: true,
								rows: 4
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "16px"
								},
								children: [/* @__PURE__ */ jsx(FormField, {
									label: "CTA tekst",
									value: hero.cta,
									onChange: (value) => setHero((prev) => ({
										...prev,
										cta: value
									}))
								}), /* @__PURE__ */ jsx(FormField, {
									label: "CTA link",
									value: hero.ctaLink,
									onChange: (value) => setHero((prev) => ({
										...prev,
										ctaLink: value
									}))
								})]
							}),
							/* @__PURE__ */ jsx(FormField, {
								label: "USP's (één per regel)",
								value: toMultiline(hero.checkItems),
								onChange: (value) => setHero((prev) => ({
									...prev,
									checkItems: parseLines(value)
								})),
								multiline: true,
								rows: 5
							}),
							/* @__PURE__ */ jsx(ImageUpload, {
								label: "Hero afbeelding",
								value: hero.image || "",
								onChange: (value) => setHero((prev) => ({
									...prev,
									image: value
								}))
							})
						]
					}),
					/* @__PURE__ */ jsx(SaveBar, {
						saving: false,
						message: saved === "hero" ? "Hero opgeslagen." : "",
						onSave: () => saveSection("hero", hero)
					})
				]
			}),
			/* @__PURE__ */ jsxs(Card, {
				style: { padding: "24px" },
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "12px",
							textTransform: "uppercase",
							marginBottom: "16px"
						},
						children: "Stats"
					}),
					/* @__PURE__ */ jsx(FormField, {
						label: "Één item per regel in formaat: getal | omschrijving",
						value: statsText,
						onChange: setStatsText,
						multiline: true,
						rows: 6
					}),
					/* @__PURE__ */ jsx(SaveBar, {
						saving: false,
						message: saved === "stats" ? "Stats opgeslagen." : "",
						onSave: () => saveSection("stats", parseLines(statsText).map((line) => {
							const [number, ...descParts] = line.split("|");
							return {
								number: (number || "").trim(),
								desc: descParts.join("|").trim()
							};
						}))
					})
				]
			}),
			/* @__PURE__ */ jsxs(Card, {
				style: { padding: "24px" },
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "12px",
							textTransform: "uppercase",
							marginBottom: "16px"
						},
						children: "Wat FerroWorks Voor Je Doet"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gap: "16px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "16px"
								},
								children: [/* @__PURE__ */ jsx(FormField, {
									label: "Titel regel 1",
									value: watFerna.title1,
									onChange: (value) => setWatFerna((prev) => ({
										...prev,
										title1: value
									}))
								}), /* @__PURE__ */ jsx(FormField, {
									label: "Titel regel 2",
									value: watFerna.title2,
									onChange: (value) => setWatFerna((prev) => ({
										...prev,
										title2: value
									}))
								})]
							}),
							/* @__PURE__ */ jsx(FormField, {
								label: "Bullet items (één per regel)",
								value: toMultiline(watFerna.bulletItems),
								onChange: (value) => setWatFerna((prev) => ({
									...prev,
									bulletItems: parseLines(value)
								})),
								multiline: true,
								rows: 8
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "16px"
								},
								children: [/* @__PURE__ */ jsx(ImageUpload, {
									label: "Afbeelding 1",
									value: watFerna.image1 || "",
									onChange: (value) => setWatFerna((prev) => ({
										...prev,
										image1: value
									}))
								}), /* @__PURE__ */ jsx(ImageUpload, {
									label: "Afbeelding 2",
									value: watFerna.image2 || "",
									onChange: (value) => setWatFerna((prev) => ({
										...prev,
										image2: value
									}))
								})]
							})
						]
					}),
					/* @__PURE__ */ jsx(SaveBar, {
						saving: false,
						message: saved === "watFerna" ? "Sectie opgeslagen." : "",
						onSave: () => saveSection("watFerna", watFerna)
					})
				]
			}),
			/* @__PURE__ */ jsxs(Card, {
				style: { padding: "24px" },
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "12px",
							textTransform: "uppercase",
							marginBottom: "16px"
						},
						children: "Wat Ons Anders Maakt"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gap: "16px"
						},
						children: [(anders.items || []).map((item, index) => /* @__PURE__ */ jsx(Card, {
							style: {
								padding: "18px",
								background: "#fafafa",
								boxShadow: "none"
							},
							children: /* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gap: "14px"
								},
								children: [/* @__PURE__ */ jsx(FormField, {
									label: `Titel ${index + 1}`,
									value: item.title,
									onChange: (value) => setAnders((prev) => ({
										...prev,
										items: prev.items.map((row, rowIndex) => rowIndex === index ? {
											...row,
											title: value
										} : row)
									}))
								}), /* @__PURE__ */ jsx(FormField, {
									label: "Omschrijving",
									value: item.desc,
									onChange: (value) => setAnders((prev) => ({
										...prev,
										items: prev.items.map((row, rowIndex) => rowIndex === index ? {
											...row,
											desc: value
										} : row)
									})),
									multiline: true,
									rows: 3
								})]
							})
						}, index)), /* @__PURE__ */ jsx(ImageUpload, {
							label: "Sectie afbeelding",
							value: anders.image || "",
							onChange: (value) => setAnders((prev) => ({
								...prev,
								image: value
							}))
						})]
					}),
					/* @__PURE__ */ jsx(SaveBar, {
						saving: false,
						message: saved === "anders" ? "Sectie opgeslagen." : "",
						onSave: () => saveSection("anders", anders)
					})
				]
			}),
			/* @__PURE__ */ jsxs(Card, {
				style: { padding: "24px" },
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "12px",
							textTransform: "uppercase",
							marginBottom: "16px"
						},
						children: "Projecten"
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "grid",
							gap: "16px"
						},
						children: projecten.map((project, index) => /* @__PURE__ */ jsx(Card, {
							style: {
								padding: "18px",
								background: "#fafafa",
								boxShadow: "none"
							},
							children: /* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gap: "14px"
								},
								children: [
									/* @__PURE__ */ jsx(FormField, {
										label: "Titel",
										value: project.title,
										onChange: (value) => setProjecten((prev) => prev.map((row, rowIndex) => rowIndex === index ? {
											...row,
											title: value
										} : row))
									}),
									/* @__PURE__ */ jsx(FormField, {
										label: "Beschrijving",
										value: project.desc,
										onChange: (value) => setProjecten((prev) => prev.map((row, rowIndex) => rowIndex === index ? {
											...row,
											desc: value
										} : row)),
										multiline: true,
										rows: 3
									}),
									/* @__PURE__ */ jsx(ImageUpload, {
										label: "Afbeelding",
										value: project.image || "",
										onChange: (value) => setProjecten((prev) => prev.map((row, rowIndex) => rowIndex === index ? {
											...row,
											image: value
										} : row))
									})
								]
							})
						}, index))
					}),
					/* @__PURE__ */ jsx(SaveBar, {
						saving: false,
						message: saved === "projecten" ? "Projecten opgeslagen." : "",
						onSave: () => saveSection("projecten", projecten)
					})
				]
			}),
			/* @__PURE__ */ jsxs(Card, {
				style: { padding: "24px" },
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "12px",
							textTransform: "uppercase",
							marginBottom: "16px"
						},
						children: "FAQ"
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "grid",
							gap: "16px"
						},
						children: faq.map((item, index) => /* @__PURE__ */ jsx(Card, {
							style: {
								padding: "18px",
								background: "#fafafa",
								boxShadow: "none"
							},
							children: /* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gap: "14px"
								},
								children: [/* @__PURE__ */ jsx(FormField, {
									label: "Vraag",
									value: item.q,
									onChange: (value) => setFaq((prev) => prev.map((row, rowIndex) => rowIndex === index ? {
										...row,
										q: value
									} : row))
								}), /* @__PURE__ */ jsx(FormField, {
									label: "Antwoord",
									value: item.a,
									onChange: (value) => setFaq((prev) => prev.map((row, rowIndex) => rowIndex === index ? {
										...row,
										a: value
									} : row)),
									multiline: true,
									rows: 4
								})]
							})
						}, index))
					}),
					/* @__PURE__ */ jsx(SaveBar, {
						saving: false,
						message: saved === "faq" ? "FAQ opgeslagen." : "",
						onSave: () => saveSection("faq", faq)
					})
				]
			})
		]
	});
}
function AboutPage() {
	const { cms, updateCms } = useCms();
	const [overOns, setOverOns] = useState(cms.overOns || {});
	const [saved, setSaved] = useState("");
	useEffect(() => {
		setOverOns(cms.overOns || {});
	}, [cms]);
	const updateNested = (section, field, value) => {
		setOverOns((prev) => ({
			...prev,
			[section]: {
				...prev[section] || {},
				[field]: value
			}
		}));
	};
	const save = async () => {
		if (await updateCms("overOns", overOns)) {
			setSaved("Over Ons opgeslagen.");
			window.setTimeout(() => setSaved(""), 1600);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "grid",
			gap: "24px",
			maxWidth: "1040px"
		},
		children: [
			/* @__PURE__ */ jsx(SectionHeader, {
				title: "Over Ons",
				sub: "Alle content van de Over Ons-pagina op één dedicated beheerpagina"
			}),
			/* @__PURE__ */ jsxs(Card, {
				style: { padding: "24px" },
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontSize: "12px",
						textTransform: "uppercase",
						marginBottom: "16px"
					},
					children: "Ons Verhaal"
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gap: "16px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsx(FormField, {
								label: "Titel regel 1",
								value: overOns.verhaal?.title1,
								onChange: (value) => updateNested("verhaal", "title1", value)
							}), /* @__PURE__ */ jsx(FormField, {
								label: "Titel regel 2",
								value: overOns.verhaal?.title2,
								onChange: (value) => updateNested("verhaal", "title2", value)
							})]
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Tekst 1",
							value: overOns.verhaal?.tekst1,
							onChange: (value) => updateNested("verhaal", "tekst1", value),
							multiline: true,
							rows: 4
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Tekst 2",
							value: overOns.verhaal?.tekst2,
							onChange: (value) => updateNested("verhaal", "tekst2", value),
							multiline: true,
							rows: 4
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Tekst 3",
							value: overOns.verhaal?.tekst3,
							onChange: (value) => updateNested("verhaal", "tekst3", value),
							multiline: true,
							rows: 4
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsx(ImageUpload, {
								label: "Afbeelding 1",
								value: overOns.verhaal?.image1 || "",
								onChange: (value) => updateNested("verhaal", "image1", value)
							}), /* @__PURE__ */ jsx(ImageUpload, {
								label: "Afbeelding 2",
								value: overOns.verhaal?.image2 || "",
								onChange: (value) => updateNested("verhaal", "image2", value)
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				style: { padding: "24px" },
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontSize: "12px",
						textTransform: "uppercase",
						marginBottom: "16px"
					},
					children: "Wat We Doen"
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gap: "16px"
					},
					children: [/* @__PURE__ */ jsx(FormField, {
						label: "Items (één per regel)",
						value: toMultiline(overOns.watWeDoen?.items),
						onChange: (value) => updateNested("watWeDoen", "items", parseLines(value)),
						multiline: true,
						rows: 8
					}), /* @__PURE__ */ jsx(ImageUpload, {
						label: "Afbeelding",
						value: overOns.watWeDoen?.image || "",
						onChange: (value) => updateNested("watWeDoen", "image", value)
					})]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				style: { padding: "24px" },
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontSize: "12px",
						textTransform: "uppercase",
						marginBottom: "16px"
					},
					children: "Anders Maakt"
				}), /* @__PURE__ */ jsx("div", {
					style: {
						display: "grid",
						gap: "16px"
					},
					children: (overOns.andersItems || []).map((item, index) => /* @__PURE__ */ jsx(Card, {
						style: {
							padding: "18px",
							background: "#fafafa",
							boxShadow: "none"
						},
						children: /* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gap: "14px"
							},
							children: [/* @__PURE__ */ jsx(FormField, {
								label: "Titel",
								value: item.title,
								onChange: (value) => setOverOns((prev) => ({
									...prev,
									andersItems: prev.andersItems.map((row, rowIndex) => rowIndex === index ? {
										...row,
										title: value
									} : row)
								}))
							}), /* @__PURE__ */ jsx(FormField, {
								label: "Omschrijving",
								value: item.desc,
								onChange: (value) => setOverOns((prev) => ({
									...prev,
									andersItems: prev.andersItems.map((row, rowIndex) => rowIndex === index ? {
										...row,
										desc: value
									} : row)
								})),
								multiline: true,
								rows: 3
							})]
						})
					}, index))
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				style: { padding: "24px" },
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontSize: "12px",
						textTransform: "uppercase",
						marginBottom: "16px"
					},
					children: "Team"
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gap: "16px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsx(FormField, {
								label: "Titel regel 1",
								value: overOns.team?.title1,
								onChange: (value) => updateNested("team", "title1", value)
							}), /* @__PURE__ */ jsx(FormField, {
								label: "Titel regel 2",
								value: overOns.team?.title2,
								onChange: (value) => updateNested("team", "title2", value)
							})]
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Tekst 1",
							value: overOns.team?.tekst1,
							onChange: (value) => updateNested("team", "tekst1", value),
							multiline: true,
							rows: 4
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Tekst 2",
							value: overOns.team?.tekst2,
							onChange: (value) => updateNested("team", "tekst2", value),
							multiline: true,
							rows: 4
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Team items (één per regel)",
							value: toMultiline(overOns.team?.items),
							onChange: (value) => updateNested("team", "items", parseLines(value)),
							multiline: true,
							rows: 6
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr 1fr",
								gap: "16px"
							},
							children: [
								/* @__PURE__ */ jsx(ImageUpload, {
									label: "Afbeelding 1",
									value: overOns.team?.image1 || "",
									onChange: (value) => updateNested("team", "image1", value)
								}),
								/* @__PURE__ */ jsx(ImageUpload, {
									label: "Afbeelding 2",
									value: overOns.team?.image2 || "",
									onChange: (value) => updateNested("team", "image2", value)
								}),
								/* @__PURE__ */ jsx(ImageUpload, {
									label: "Afbeelding 3",
									value: overOns.team?.image3 || "",
									onChange: (value) => updateNested("team", "image3", value)
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(SaveBar, {
				saving: false,
				message: saved,
				onSave: save
			})
		]
	});
}
function PagesPage() {
	const { cms, updateCms } = useCms();
	const [pages, setPages] = useState(cms.pages || []);
	const [activeKey, setActiveKey] = useState((cms.pages || [])[0]?.key || "");
	const [saved, setSaved] = useState("");
	useEffect(() => {
		setPages(cms.pages || []);
		if (!activeKey && cms.pages?.length) setActiveKey(cms.pages[0].key);
	}, [cms.pages, activeKey]);
	const activePage = pages.find((item) => item.key === activeKey) || pages[0];
	const updatePage = (field, value) => {
		setPages((prev) => prev.map((item) => item.key === activePage.key ? {
			...item,
			[field]: value
		} : item));
	};
	const save = async () => {
		if (await updateCms("pages", pages)) {
			setSaved("Pagina-instellingen opgeslagen.");
			window.setTimeout(() => setSaved(""), 1600);
		}
	};
	if (!activePage) return null;
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "grid",
			gridTemplateColumns: "320px minmax(0, 1fr)",
			gap: "24px"
		},
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
			title: "Pages",
			sub: "SEO, indexatie en statische pagina-inhoud"
		}), /* @__PURE__ */ jsx(Card, { children: pages.map((page) => /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => setActiveKey(page.key),
			style: {
				width: "100%",
				textAlign: "left",
				padding: "18px 20px",
				border: "none",
				borderBottom: "1px solid #f2f2f2",
				background: page.key === activeKey ? "#f8fbeb" : "#fff",
				cursor: "pointer"
			},
			children: [/* @__PURE__ */ jsx("div", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontSize: "12px",
					textTransform: "uppercase",
					color: "#1c1c1c",
					marginBottom: "4px"
				},
				children: page.name
			}), /* @__PURE__ */ jsx("div", {
				style: {
					color: "#888",
					fontSize: "12px"
				},
				children: page.path
			})]
		}, page.key)) })] }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Card, {
			style: { padding: "28px" },
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gap: "18px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "1fr 220px",
							gap: "16px"
						},
						children: [/* @__PURE__ */ jsx(FormField, {
							label: "Naam",
							value: activePage.name,
							onChange: (value) => updatePage("name", value)
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(FieldLabel, { children: "Path" }), /* @__PURE__ */ jsx("div", {
							style: {
								...baseInputStyle(),
								background: "#f7f7f7",
								color: "#666"
							},
							children: activePage.path
						})] })]
					}),
					/* @__PURE__ */ jsx(CheckboxField, {
						label: "Opnemen in index / sitemap",
						checked: activePage.isIndexed,
						onChange: (value) => updatePage("isIndexed", value)
					}),
					/* @__PURE__ */ jsx(FormField, {
						label: "Meta title",
						value: activePage.metaTitle,
						onChange: (value) => updatePage("metaTitle", value)
					}),
					/* @__PURE__ */ jsx(FormField, {
						label: "Meta description",
						value: activePage.metaDescription,
						onChange: (value) => updatePage("metaDescription", value),
						multiline: true,
						rows: 3
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "16px"
						},
						children: [/* @__PURE__ */ jsx(FormField, {
							label: "Hero title",
							value: activePage.heroTitle,
							onChange: (value) => updatePage("heroTitle", value)
						}), /* @__PURE__ */ jsx(FormField, {
							label: "Hero subtitle",
							value: activePage.heroSubtitle,
							onChange: (value) => updatePage("heroSubtitle", value)
						})]
					}),
					["privacy", "terms"].includes(activePage.key) ? /* @__PURE__ */ jsx(RichTextEditor, {
						label: "Pagina-inhoud",
						value: activePage.body || "",
						onChange: (value) => updatePage("body", value)
					}) : null
				]
			}), /* @__PURE__ */ jsx(SaveBar, {
				saving: false,
				message: saved,
				onSave: save
			})]
		}) })]
	});
}
function SettingsPage() {
	const { cms, updateCms } = useCms();
	const [tab, setTab] = useState("general");
	const [site, setSite] = useState(cms.site || {});
	const [websiteSettings, setWebsiteSettings] = useState(cms.websiteSettings || {});
	const [emailSettings, setEmailSettings] = useState({
		host: "",
		port: 587,
		secure: false,
		user: "",
		pass: "",
		from: "",
		replyTo: "",
		templates: []
	});
	const [saved, setSaved] = useState("");
	useEffect(() => {
		setSite(cms.site || {});
		setWebsiteSettings(cms.websiteSettings || {});
	}, [cms]);
	useEffect(() => {
		api.getEmailSettings().then((data) => setEmailSettings(data)).catch(() => {});
	}, []);
	const setField = (key) => (value) => setSite((prev) => ({
		...prev,
		[key]: value
	}));
	const setEmailField = (key) => (value) => setEmailSettings((prev) => ({
		...prev,
		[key]: value
	}));
	const saveGeneral = async () => {
		if (await updateCms("site", site)) {
			setSaved("Algemene instellingen opgeslagen.");
			window.setTimeout(() => setSaved(""), 1600);
		}
	};
	const saveWebsite = async () => {
		if (await updateCms("websiteSettings", websiteSettings)) {
			setSaved("Website-instellingen opgeslagen.");
			window.setTimeout(() => setSaved(""), 1600);
		}
	};
	const saveEmail = async () => {
		try {
			await api.updateEmailSettings(emailSettings);
			setSaved("E-mailconfiguratie opgeslagen.");
			window.setTimeout(() => setSaved(""), 1600);
		} catch (error) {
			window.alert(error.message || "Opslaan mislukt.");
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(SectionHeader, {
			title: "Settings",
			sub: "Website, robots.txt, SMTP en e-mailtemplates"
		}),
		/* @__PURE__ */ jsx("div", {
			style: {
				display: "flex",
				gap: "8px",
				marginBottom: "20px",
				flexWrap: "wrap"
			},
			children: [
				{
					id: "general",
					label: "General"
				},
				{
					id: "website",
					label: "Website"
				},
				{
					id: "email",
					label: "Email"
				}
			].map((item) => /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => setTab(item.id),
				style: {
					padding: "10px 18px",
					border: "none",
					borderRadius: "999px",
					cursor: "pointer",
					background: tab === item.id ? "#1c1c1c" : "#fff",
					color: tab === item.id ? "#fff" : "#666",
					fontFamily: "Arial Black, Arial, sans-serif",
					fontSize: "11px",
					textTransform: "uppercase"
				},
				children: item.label
			}, item.id))
		}),
		/* @__PURE__ */ jsxs(Card, {
			style: {
				padding: "28px",
				width: "100%"
			},
			children: [
				tab === "general" ? /* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gap: "18px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsx(FormField, {
								label: "Bedrijfsnaam",
								value: site.naam,
								onChange: setField("naam")
							}), /* @__PURE__ */ jsx(FormField, {
								label: "Tagline",
								value: site.tagline,
								onChange: setField("tagline")
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsx(FormField, {
								label: "Telefoon",
								value: site.tel,
								onChange: setField("tel")
							}), /* @__PURE__ */ jsx(FormField, {
								label: "E-mail",
								value: site.email,
								onChange: setField("email")
							})]
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Adres",
							value: site.adres,
							onChange: setField("adres")
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
								gap: "16px"
							},
							children: [
								/* @__PURE__ */ jsx(FormField, {
									label: "KVK",
									value: site.kvk,
									onChange: setField("kvk")
								}),
								/* @__PURE__ */ jsx(FormField, {
									label: "BTW",
									value: site.btw,
									onChange: setField("btw")
								}),
								/* @__PURE__ */ jsx(FormField, {
									label: "Website",
									value: site.website,
									onChange: setField("website")
								}),
								/* @__PURE__ */ jsx(FormField, {
									label: "LinkedIn",
									value: site.linkedin,
									onChange: setField("linkedin")
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsx(FormField, {
								label: "Instagram",
								value: site.instagram,
								onChange: setField("instagram")
							}), /* @__PURE__ */ jsx(FormField, {
								label: "Facebook",
								value: site.facebook,
								onChange: setField("facebook")
							})]
						}),
						/* @__PURE__ */ jsx(Card, {
							style: {
								padding: "18px",
								background: "#fafafa",
								boxShadow: "none"
							},
							children: /* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gap: "16px"
								},
								children: [/* @__PURE__ */ jsx(FormField, {
									label: "Globale meta title",
									value: site.metaTitle,
									onChange: setField("metaTitle")
								}), /* @__PURE__ */ jsx(FormField, {
									label: "Globale meta description",
									value: site.metaDesc,
									onChange: setField("metaDesc"),
									multiline: true,
									rows: 4
								})]
							})
						}),
						/* @__PURE__ */ jsx(SaveBar, {
							saving: false,
							message: saved,
							onSave: saveGeneral
						})
					]
				}) : null,
				tab === "website" ? /* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gap: "18px"
					},
					children: [
						/* @__PURE__ */ jsx(FormField, {
							label: "Default OG image URL",
							value: websiteSettings.defaultOgImage || "",
							onChange: (value) => setWebsiteSettings((prev) => ({
								...prev,
								defaultOgImage: value
							}))
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsx(FormField, {
								label: "Google Analytics ID",
								value: websiteSettings.googleAnalyticsId || "",
								onChange: (value) => setWebsiteSettings((prev) => ({
									...prev,
									googleAnalyticsId: value
								})),
								placeholder: "G-XXXXXXXXXX"
							}), /* @__PURE__ */ jsx(FormField, {
								label: "Google Tag Manager ID",
								value: websiteSettings.googleTagManagerId || "",
								onChange: (value) => setWebsiteSettings((prev) => ({
									...prev,
									googleTagManagerId: value
								})),
								placeholder: "GTM-XXXXXXX"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsx(FormField, {
								label: "Meta Pixel ID",
								value: websiteSettings.metaPixelId || "",
								onChange: (value) => setWebsiteSettings((prev) => ({
									...prev,
									metaPixelId: value
								})),
								placeholder: "123456789012345"
							}), /* @__PURE__ */ jsx(FormField, {
								label: "LinkedIn Insight Tag ID",
								value: websiteSettings.linkedInInsightTagId || "",
								onChange: (value) => setWebsiteSettings((prev) => ({
									...prev,
									linkedInInsightTagId: value
								})),
								placeholder: "1234567"
							})]
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "robots.txt configuratie",
							value: websiteSettings.robotsText || "",
							onChange: (value) => setWebsiteSettings((prev) => ({
								...prev,
								robotsText: value
							})),
							multiline: true,
							rows: 8
						}),
						/* @__PURE__ */ jsx(FormField, {
							label: "Extra head HTML",
							value: websiteSettings.extraHeadHtml || "",
							onChange: (value) => setWebsiteSettings((prev) => ({
								...prev,
								extraHeadHtml: value
							})),
							multiline: true,
							rows: 8
						}),
						/* @__PURE__ */ jsx(SaveBar, {
							saving: false,
							message: saved,
							onSave: saveWebsite
						})
					]
				}) : null,
				tab === "email" ? /* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gap: "18px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1.2fr 120px 120px",
								gap: "16px"
							},
							children: [
								/* @__PURE__ */ jsx(FormField, {
									label: "SMTP host",
									value: emailSettings.host || "",
									onChange: setEmailField("host")
								}),
								/* @__PURE__ */ jsx(FormField, {
									label: "Port",
									value: String(emailSettings.port || 587),
									onChange: (value) => setEmailField("port")(Number(value))
								}),
								/* @__PURE__ */ jsx(CheckboxField, {
									label: "Secure",
									checked: emailSettings.secure,
									onChange: setEmailField("secure")
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsx(FormField, {
								label: "SMTP user",
								value: emailSettings.user || "",
								onChange: setEmailField("user")
							}), /* @__PURE__ */ jsx(FormField, {
								label: "SMTP password",
								value: emailSettings.pass || "",
								onChange: setEmailField("pass"),
								type: "password"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsx(FormField, {
								label: "From e-mail",
								value: emailSettings.from || "",
								onChange: setEmailField("from")
							}), /* @__PURE__ */ jsx(FormField, {
								label: "Default reply-to",
								value: emailSettings.replyTo || "",
								onChange: setEmailField("replyTo")
							})]
						}),
						/* @__PURE__ */ jsxs(Card, {
							style: {
								padding: "18px",
								background: "#fafafa",
								boxShadow: "none"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "12px",
									textTransform: "uppercase",
									color: "#1c1c1c",
									marginBottom: "16px"
								},
								children: "Templates"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									display: "grid",
									gap: "18px"
								},
								children: (emailSettings.templates || []).map((template, index) => /* @__PURE__ */ jsx(Card, {
									style: {
										padding: "18px",
										background: "#fff",
										boxShadow: "none",
										border: "1px solid #eee"
									},
									children: /* @__PURE__ */ jsxs("div", {
										style: {
											display: "grid",
											gap: "14px"
										},
										children: [
											/* @__PURE__ */ jsx(FormField, {
												label: "Template naam",
												value: template.name,
												onChange: (value) => setEmailSettings((prev) => ({
													...prev,
													templates: prev.templates.map((item, i) => i === index ? {
														...item,
														name: value
													} : item)
												}))
											}),
											/* @__PURE__ */ jsx(FormField, {
												label: "Onderwerp",
												value: template.subject,
												onChange: (value) => setEmailSettings((prev) => ({
													...prev,
													templates: prev.templates.map((item, i) => i === index ? {
														...item,
														subject: value
													} : item)
												}))
											}),
											/* @__PURE__ */ jsx(FormField, {
												label: "Bericht",
												value: template.body,
												onChange: (value) => setEmailSettings((prev) => ({
													...prev,
													templates: prev.templates.map((item, i) => i === index ? {
														...item,
														body: value
													} : item)
												})),
												multiline: true,
												rows: 6
											})
										]
									})
								}, template.id || index))
							})]
						}),
						/* @__PURE__ */ jsx(SaveBar, {
							saving: false,
							message: saved,
							onSave: saveEmail
						})
					]
				}) : null
			]
		})
	] });
}
function AdminPage() {
	return /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsxs(Route, {
		element: /* @__PURE__ */ jsx(AdminShell, {}),
		children: [
			/* @__PURE__ */ jsx(Route, {
				index: true,
				element: /* @__PURE__ */ jsx(Navigate, {
					to: "dashboard",
					replace: true
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "dashboard",
				element: /* @__PURE__ */ jsx(DashboardPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "blog",
				element: /* @__PURE__ */ jsx(BlogListPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "blog/new",
				element: /* @__PURE__ */ jsx(BlogFormPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "blog/:slug/edit",
				element: /* @__PURE__ */ jsx(BlogFormPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "diensten",
				element: /* @__PURE__ */ jsx(ServiceListPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "diensten/new",
				element: /* @__PURE__ */ jsx(ServiceFormPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "diensten/:slug/edit",
				element: /* @__PURE__ */ jsx(ServiceFormPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "sectoren",
				element: /* @__PURE__ */ jsx(SectorListPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "sectoren/new",
				element: /* @__PURE__ */ jsx(SectorFormPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "sectoren/:slug/edit",
				element: /* @__PURE__ */ jsx(SectorFormPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "leads",
				element: /* @__PURE__ */ jsx(LeadsPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "homepage",
				element: /* @__PURE__ */ jsx(HomepagePage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "over-ons",
				element: /* @__PURE__ */ jsx(AboutPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "pages",
				element: /* @__PURE__ */ jsx(PagesPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "instellingen",
				element: /* @__PURE__ */ jsx(SettingsPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "*",
				element: /* @__PURE__ */ jsx(Navigate, {
					to: "dashboard",
					replace: true
				})
			})
		]
	}) });
}
//#endregion
//#region src/seo/RouteSeo.jsx
function upsertMeta(name, value, property = false) {
	if (!value) return;
	const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
	let element = document.head.querySelector(selector);
	if (!element) {
		element = document.createElement("meta");
		if (property) element.setAttribute("property", name);
		else element.setAttribute("name", name);
		document.head.appendChild(element);
	}
	element.setAttribute("content", value);
}
function upsertCanonical(href) {
	let link = document.head.querySelector("link[rel=\"canonical\"]");
	if (!link) {
		link = document.createElement("link");
		link.setAttribute("rel", "canonical");
		document.head.appendChild(link);
	}
	link.setAttribute("href", href);
}
function RouteSeo() {
	const { cms } = useCms();
	const location = useLocation();
	const site = cms.site || {};
	const path = location.pathname;
	useEffect(() => {
		const origin = window.location.origin;
		const pageConfig = (cms.pages || []).find((item) => item.path === path);
		let title = site.metaTitle || site.naam || "FerroWorks";
		let description = site.metaDesc || "";
		if (pageConfig?.metaTitle) {
			title = pageConfig.metaTitle;
			description = pageConfig.metaDescription || description;
		} else if (path === "/over-ons") {
			title = `Over Ons | ${site.naam || "FerroWorks"}`;
			description = cms.overOns?.verhaal?.tekst1 || description;
		} else if (path === "/diensten") {
			title = `Diensten | ${site.naam || "FerroWorks"}`;
			description = "Engineering, productie, coating, montage en onderhoud voor maatwerk metaalprojecten.";
		} else if (path.startsWith("/diensten/")) {
			const slug = path.split("/").pop();
			const service = (cms.diensten || []).find((item) => item.id === slug);
			title = service?.seoTitle || `${service?.title || "Dienst"} | ${site.naam || "FerroWorks"}`;
			description = service?.seoDescription || service?.excerpt || description;
		} else if (path === "/sectoren") {
			title = `Sectoren | ${site.naam || "FerroWorks"}`;
			description = "Metaalmaatwerk voor bouw, industrie, architectuur en maritieme toepassingen.";
		} else if (path === "/blog") {
			title = `Blog | ${site.naam || "FerroWorks"}`;
			description = "Kennisartikelen, projectverhalen en technische inzichten van FerroWorks.";
		} else if (path.startsWith("/blog/")) {
			const slug = path.split("/").pop();
			const post = (cms.blog || []).find((item) => item.slug === slug || String(item.id) === slug);
			title = post?.seoTitle || `${post?.title || "Artikel"} | ${site.naam || "FerroWorks"}`;
			description = post?.seoDescription || post?.excerpt || description;
		}
		document.title = title;
		upsertMeta("description", description);
		upsertMeta("og:title", title, true);
		upsertMeta("og:description", description, true);
		upsertMeta("og:url", `${origin}${path}`, true);
		upsertCanonical(`${origin}${path}`);
		const website = cms.websiteSettings || {};
		if (website.googleAnalyticsId && typeof window.gtag === "function") window.gtag("config", website.googleAnalyticsId, {
			page_path: path,
			page_location: `${origin}${path}`
		});
		if (website.metaPixelId && typeof window.fbq === "function") window.fbq("track", "PageView");
	}, [
		cms,
		path,
		site.metaDesc,
		site.metaTitle,
		site.naam
	]);
	return null;
}
//#endregion
//#region src/App.jsx
function HomePage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(HeroBanner, {}),
		/* @__PURE__ */ jsx(WatFernaSection, {}),
		/* @__PURE__ */ jsx(ClientLogosSection, {}),
		/* @__PURE__ */ jsx(WatOnsAndersMaakt, {}),
		/* @__PURE__ */ jsx(StatsSection, {}),
		/* @__PURE__ */ jsx(OnzeSectoren, {}),
		/* @__PURE__ */ jsx(ProjectenSlider, {}),
		/* @__PURE__ */ jsx(UwProjectSection, {}),
		/* @__PURE__ */ jsx(FaqSection, {})
	] });
}
function PublicLayout() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(RouteSeo, {}),
		/* @__PURE__ */ jsx(Navbar, {}),
		/* @__PURE__ */ jsx(Outlet, {}),
		/* @__PURE__ */ jsx(Footer, {})
	] });
}
function AppRoutes() {
	return /* @__PURE__ */ jsxs(Routes, { children: [/* @__PURE__ */ jsxs(Route, {
		element: /* @__PURE__ */ jsx(PublicLayout, {}),
		children: [
			/* @__PURE__ */ jsx(Route, {
				path: "/",
				element: /* @__PURE__ */ jsx(HomePage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/over-ons",
				element: /* @__PURE__ */ jsx(OverOnsPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/diensten",
				element: /* @__PURE__ */ jsx(DienstenPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/diensten/:slug",
				element: /* @__PURE__ */ jsx(DienstDetailPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/sectoren",
				element: /* @__PURE__ */ jsx(SectorenPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/blog",
				element: /* @__PURE__ */ jsx(BlogPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/blog/:slug",
				element: /* @__PURE__ */ jsx(BlogDetailPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/contact",
				element: /* @__PURE__ */ jsx(ContactPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/privacy-policy",
				element: /* @__PURE__ */ jsx(ManagedContentPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/algemene-voorwaarden",
				element: /* @__PURE__ */ jsx(ManagedContentPage, {})
			})
		]
	}), /* @__PURE__ */ jsx(Route, {
		path: "/admin/*",
		element: /* @__PURE__ */ jsx(AdminPage, {})
	})] });
}
function App({ RouterComponent = BrowserRouter, routerProps = {}, initialCms = null }) {
	return /* @__PURE__ */ jsx(CmsProvider, {
		initialCms,
		children: /* @__PURE__ */ jsx(RouterComponent, {
			...routerProps,
			children: /* @__PURE__ */ jsx(AppRoutes, {})
		})
	});
}
//#endregion
//#region src/entry-server.jsx
function render(url, cms) {
	return { html: renderToString(/* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(App, {
		RouterComponent: StaticRouter,
		routerProps: { location: url },
		initialCms: cms
	}) }) })) };
}
//#endregion
export { render };
