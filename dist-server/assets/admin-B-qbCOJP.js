import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
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
	getStaff: () => request("/api/admin/staff"),
	createStaff: (payload) => request("/api/admin/staff", {
		method: "POST",
		body: JSON.stringify(payload)
	}),
	updateStaff: (id, payload) => request(`/api/admin/staff/${id}`, {
		method: "PUT",
		body: JSON.stringify(payload)
	}),
	replyToLead: (id, payload) => request(`/api/admin/leads/${id}/reply`, {
		method: "POST",
		body: JSON.stringify(payload)
	}),
	getEmailSettings: () => request("/api/admin/settings/email"),
	updateEmailSettings: (payload) => request("/api/admin/settings/email", {
		method: "PUT",
		body: JSON.stringify(payload)
	}),
	sendTestEmail: (to) => request("/api/admin/settings/email/test", {
		method: "POST",
		body: JSON.stringify({ to })
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
		},
		can: (permission) => {
			if (!user?.permissions) return false;
			return user.permissions.includes("*") || user.permissions.includes(permission);
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
var AdminPage_exports = /* @__PURE__ */ __exportAll({ default: () => AdminPage });
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
function ChevronIcon({ open, size = 14, color = "currentColor" }) {
	return /* @__PURE__ */ jsx("svg", {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsx("path", {
			d: open ? "M6 15l6-6 6 6" : "M9 6l6 6-6 6",
			stroke: color,
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
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
			permission: "dashboard.view",
			d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10"
		}]
	},
	{
		label: "Content",
		items: [
			{
				to: "/admin/homepage",
				label: "Homepage Blocks",
				permission: "content.homepage",
				d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10"
			},
			{
				to: "/admin/over-ons",
				label: "Over Ons",
				permission: "content.about",
				d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
			},
			{
				to: "/admin/pages",
				label: "Pages",
				permission: "content.pages",
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
				permission: "collections.blog",
				d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"
			},
			{
				to: "/admin/diensten",
				label: "Diensten",
				permission: "collections.services",
				d: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5"
			},
			{
				to: "/admin/sectoren",
				label: "Sectoren",
				permission: "collections.sectors",
				d: "M1 6l11-5 11 5v6c0 5.5-4.67 10.74-11 12C5.67 22.74 1 17.5 1 12V6z"
			},
			{
				to: "/admin/leads",
				label: "Contacts",
				permission: "leads.view",
				d: "M21 8a2 2 0 01-2 2H5l-4 4V6a2 2 0 012-2h16a2 2 0 012 2z M8 14h8 M8 18h5"
			}
		]
	},
	{
		label: "Platform",
		items: [{
			to: "/admin/staff",
			label: "Staff",
			permission: "staff.manage",
			d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75"
		}, {
			to: "/admin/instellingen",
			label: "Settings",
			permission: "settings.manage",
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
			match: "/admin/staff",
			title: "Staff",
			sub: "Beheer accounts, rollen en toegangsrechten"
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
	const { can } = useAuth();
	const [openGroups, setOpenGroups] = useState(() => ({
		Content: true,
		Collections: true,
		Platform: true,
		Overzicht: true
	}));
	const groups = NAV_GROUPS.map((group) => ({
		...group,
		items: group.items.filter((item) => !item.permission || can(item.permission))
	})).filter((group) => group.items.length);
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
				children: groups.map((group) => /* @__PURE__ */ jsxs("div", {
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
						children: [/* @__PURE__ */ jsx("span", { children: group.label }), /* @__PURE__ */ jsx(ChevronIcon, {
							open: openGroups[group.label],
							size: 14,
							color: "#8a8a8a"
						})]
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
	const location = useLocation();
	const { user } = useAuth();
	const meta = pageMeta(location.pathname);
	const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Staff";
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);
	useEffect(() => {
		const handleOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
		};
		document.addEventListener("mousedown", handleOutside);
		return () => document.removeEventListener("mousedown", handleOutside);
	}, []);
	return /* @__PURE__ */ jsxs("header", {
		style: {
			background: "#fff",
			borderBottom: "1px solid #ebebeb",
			padding: "0 28px",
			minHeight: "72px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: "20px",
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
		})] }), /* @__PURE__ */ jsx("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: "12px",
				flexWrap: "wrap",
				justifyContent: "flex-end"
			},
			children: /* @__PURE__ */ jsxs("div", {
				ref: menuRef,
				style: { position: "relative" },
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setMenuOpen((prev) => !prev),
					style: {
						display: "flex",
						alignItems: "center",
						gap: "10px",
						padding: "8px 10px",
						border: "1px solid #ececec",
						borderRadius: "999px",
						background: "#fafafa",
						cursor: "pointer"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								textAlign: "right",
								minWidth: "74px"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontSize: "11px",
									textTransform: "uppercase",
									color: "#1c1c1c",
									whiteSpace: "nowrap"
								},
								children: user?.name || "Admin"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "11px",
									color: "#888"
								},
								children: roleLabel
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								width: "32px",
								height: "32px",
								borderRadius: "50%",
								background: "#c8d400",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0
							},
							children: /* @__PURE__ */ jsx(SvgIcon, {
								d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
								size: 15,
								stroke: "#1c1c1c",
								strokeWidth: 2.4
							})
						}),
						/* @__PURE__ */ jsx(ChevronIcon, {
							open: menuOpen,
							size: 14,
							color: "#666"
						})
					]
				}), menuOpen ? /* @__PURE__ */ jsxs("div", {
					style: {
						position: "absolute",
						top: "calc(100% + 10px)",
						right: 0,
						minWidth: "180px",
						background: "#fff",
						border: "1px solid #ececec",
						borderRadius: "12px",
						boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
						padding: "8px",
						zIndex: 30
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							padding: "10px 12px",
							borderBottom: "1px solid #f1f1f1",
							marginBottom: "6px"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontSize: "11px",
								textTransform: "uppercase",
								color: "#1c1c1c"
							},
							children: user?.name || "Admin"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "11px",
								color: "#888",
								marginTop: "2px"
							},
							children: user?.email || ""
						})]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							setMenuOpen(false);
							onLogout();
						},
						style: {
							width: "100%",
							textAlign: "left",
							border: "none",
							background: "#fff7f7",
							color: "#b42318",
							borderRadius: "8px",
							padding: "12px 14px",
							cursor: "pointer",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "11px",
							textTransform: "uppercase"
						},
						children: "Logout"
					})]
				}) : null]
			})
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
function ForbiddenPage({ title = "Geen toegang", text = "Je account heeft geen toegang tot dit onderdeel." }) {
	return /* @__PURE__ */ jsxs(Card, {
		style: {
			padding: "28px",
			maxWidth: "720px"
		},
		children: [/* @__PURE__ */ jsx("h2", {
			style: {
				margin: "0 0 8px 0",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "18px",
				textTransform: "uppercase",
				color: "#1c1c1c"
			},
			children: title
		}), /* @__PURE__ */ jsx("p", {
			style: {
				margin: 0,
				color: "#666",
				lineHeight: 1.7
			},
			children: text
		})]
	});
}
function PermissionRoute({ permission, children }) {
	const { can } = useAuth();
	if (!can(permission)) return /* @__PURE__ */ jsx(ForbiddenPage, {});
	return children;
}
function getDefaultAdminPath(can) {
	return [
		["/admin/dashboard", "dashboard.view"],
		["/admin/homepage", "content.homepage"],
		["/admin/over-ons", "content.about"],
		["/admin/pages", "content.pages"],
		["/admin/blog", "collections.blog"],
		["/admin/diensten", "collections.services"],
		["/admin/sectoren", "collections.sectors"],
		["/admin/leads", "leads.view"],
		["/admin/staff", "staff.manage"],
		["/admin/instellingen", "settings.manage"]
	].find((item) => can(item[1]))?.[0] || "/admin/dashboard";
}
function DefaultAdminRedirect() {
	const { can } = useAuth();
	return /* @__PURE__ */ jsx(Navigate, {
		to: getDefaultAdminPath(can),
		replace: true
	});
}
function DashboardPage() {
	const { can } = useAuth();
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
	const quickLinks = [
		{
			label: "Nieuwe blogpost",
			to: "/admin/blog/new",
			permission: "collections.blog"
		},
		{
			label: "Nieuwe dienst",
			to: "/admin/diensten/new",
			permission: "collections.services"
		},
		{
			label: "Nieuwe sector",
			to: "/admin/sectoren/new",
			permission: "collections.sectors"
		},
		{
			label: "Bekijk leads",
			to: "/admin/leads",
			permission: "leads.view"
		},
		{
			label: "SEO instellingen",
			to: "/admin/instellingen",
			permission: "settings.manage"
		},
		{
			label: "Staff beheren",
			to: "/admin/staff",
			permission: "staff.manage"
		}
	].filter((item) => can(item.permission));
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
					children: quickLinks.map((item) => /* @__PURE__ */ jsx(Link, {
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
	const { can } = useAuth();
	const [leads, setLeads] = useState([]);
	const [mailConfigured, setMailConfigured] = useState(false);
	const [emailSettings, setEmailSettings] = useState({ templates: [] });
	const [loadingLeads, setLoadingLeads] = useState(true);
	const [leadError, setLeadError] = useState("");
	const [viewLead, setViewLead] = useState(null);
	const [selectedLead, setSelectedLead] = useState(null);
	const [replyForm, setReplyForm] = useState({
		subject: "",
		message: "",
		htmlMessage: "",
		templateId: ""
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
		if (!can("leads.reply")) return;
		const firstTemplate = emailSettings.templates?.[0];
		const htmlMessage = firstTemplate?.htmlBody?.replace(/\{\{name\}\}/g, lead.name) || "";
		setSelectedLead(lead);
		setReplyForm({
			subject: firstTemplate?.subject?.replace(/\{\{name\}\}/g, lead.name) || "Re: uw aanvraag bij FerroWorks",
			message: firstTemplate?.body?.replace(/\{\{name\}\}/g, lead.name) || `Beste ${lead.name},\n\nBedankt voor uw bericht.\n\nMet vriendelijke groet,\nFerroWorks`,
			htmlMessage,
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
			message: template.body.replace(/\{\{name\}\}/g, selectedLead.name),
			htmlMessage: (template.htmlBody || "").replace(/\{\{name\}\}/g, selectedLead.name)
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
							can("leads.reply") ? /* @__PURE__ */ jsx("button", {
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
							}) : null
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
						}) : null, can("leads.reply") ? /* @__PURE__ */ jsx(PrimaryButton, {
							type: "button",
							onClick: () => {
								setViewLead(null);
								openReply(viewLead);
							},
							children: "Mail sturen"
						}) : null]
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
					/* @__PURE__ */ jsx(RichTextEditor, {
						label: "HTML template",
						value: replyForm.htmlMessage,
						onChange: (value) => setReplyForm((prev) => ({
							...prev,
							htmlMessage: value
						})),
						placeholder: "Ontwerp hier je HTML e-mailtemplate..."
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
function StaffPage() {
	const [staff, setStaff] = useState([]);
	const [roles, setRoles] = useState([]);
	const [permissions, setPermissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState("");
	const [selectedId, setSelectedId] = useState("new");
	const blankForm = {
		id: "new",
		name: "",
		email: "",
		password: "",
		role: "editor",
		isActive: true,
		customPermissions: []
	};
	const [form, setForm] = useState(blankForm);
	const loadStaff = async () => {
		setLoading(true);
		try {
			const data = await api.getStaff();
			setStaff(data.items || []);
			setRoles(data.roles || []);
			setPermissions(data.permissions || []);
			if (selectedId !== "new" && !(data.items || []).some((item) => item.id === selectedId)) {
				setSelectedId("new");
				setForm(blankForm);
			}
		} catch (error) {
			window.alert(error.message || "Kon staff niet laden.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadStaff();
	}, []);
	const selectedRole = useMemo(() => roles.find((item) => item.key === form.role) || roles[0] || {
		key: "editor",
		permissions: []
	}, [roles, form.role]);
	const effectivePermissions = useMemo(() => {
		if ((selectedRole.permissions || []).includes("*")) return ["*"];
		return Array.from(new Set([...selectedRole.permissions || [], ...form.customPermissions || []]));
	}, [selectedRole, form.customPermissions]);
	const selectStaff = (item) => {
		if (!item) {
			setSelectedId("new");
			setForm(blankForm);
			return;
		}
		const basePermissions = item.role === "owner" ? [] : (roles.find((role) => role.key === item.role)?.permissions || []).filter((permission) => permission !== "*");
		const customPermissions = (item.permissions || []).filter((permission) => permission !== "*" && !basePermissions.includes(permission));
		setSelectedId(item.id);
		setForm({
			id: item.id,
			name: item.name || "",
			email: item.email || "",
			password: "",
			role: item.role || "editor",
			isActive: item.isActive !== false,
			customPermissions
		});
	};
	const togglePermission = (permissionKey) => {
		setForm((prev) => ({
			...prev,
			customPermissions: prev.customPermissions.includes(permissionKey) ? prev.customPermissions.filter((item) => item !== permissionKey) : [...prev.customPermissions, permissionKey]
		}));
	};
	const save = async () => {
		try {
			setSaving(true);
			const payload = {
				name: form.name,
				email: form.email,
				password: form.password,
				role: form.role,
				isActive: form.isActive,
				customPermissions: form.role === "owner" ? [] : form.customPermissions
			};
			if (selectedId === "new") await api.createStaff(payload);
			else await api.updateStaff(selectedId, payload);
			await loadStaff();
			setSaved(selectedId === "new" ? "Staff account aangemaakt." : "Staff account bijgewerkt.");
			window.setTimeout(() => setSaved(""), 1600);
			setForm((prev) => ({
				...prev,
				password: ""
			}));
			if (selectedId === "new") setSelectedId("new");
		} catch (error) {
			window.alert(error.message || "Opslaan mislukt.");
		} finally {
			setSaving(false);
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: { color: "#666" },
		children: "Staff laden..."
	});
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "grid",
			gridTemplateColumns: "320px minmax(0, 1fr)",
			gap: "24px"
		},
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
			title: "Staff",
			sub: "Beheer teamaccounts, rollen en extra rechten",
			action: /* @__PURE__ */ jsx(PrimaryButton, {
				type: "button",
				onClick: () => selectStaff(null),
				children: "Nieuw account"
			})
		}), /* @__PURE__ */ jsx(Card, { children: staff.map((item) => /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => selectStaff(item),
			style: {
				width: "100%",
				textAlign: "left",
				padding: "18px 20px",
				border: "none",
				borderBottom: "1px solid #f2f2f2",
				background: item.id === selectedId ? "#f8fbeb" : "#fff",
				cursor: "pointer"
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: "12px"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontSize: "12px",
							textTransform: "uppercase",
							color: "#1c1c1c"
						},
						children: item.name
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "10px",
							color: item.isActive ? "#10b981" : "#999",
							textTransform: "uppercase",
							fontFamily: "Arial Black, Arial, sans-serif"
						},
						children: item.isActive ? "Actief" : "Inactief"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						color: "#888",
						fontSize: "12px",
						marginTop: "4px"
					},
					children: item.email
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						color: "#666",
						fontSize: "11px",
						marginTop: "8px",
						textTransform: "capitalize"
					},
					children: item.role
				})
			]
		}, item.id)) })] }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Card, {
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
							gridTemplateColumns: "1fr 1fr",
							gap: "16px"
						},
						children: [/* @__PURE__ */ jsx(FormField, {
							label: "Naam",
							value: form.name,
							onChange: (value) => setForm((prev) => ({
								...prev,
								name: value
							}))
						}), /* @__PURE__ */ jsx(FormField, {
							label: "E-mail",
							value: form.email,
							onChange: (value) => setForm((prev) => ({
								...prev,
								email: value
							})),
							type: "email"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "1fr 220px",
							gap: "16px"
						},
						children: [/* @__PURE__ */ jsx(FormField, {
							label: selectedId === "new" ? "Wachtwoord" : "Nieuw wachtwoord (optioneel)",
							value: form.password,
							onChange: (value) => setForm((prev) => ({
								...prev,
								password: value
							})),
							type: "password"
						}), /* @__PURE__ */ jsx(SelectField, {
							label: "Rol",
							value: form.role,
							onChange: (value) => setForm((prev) => ({
								...prev,
								role: value,
								customPermissions: []
							})),
							options: roles.map((role) => ({
								value: role.key,
								label: role.label
							}))
						})]
					}),
					/* @__PURE__ */ jsx(CheckboxField, {
						label: "Account actief",
						checked: form.isActive,
						onChange: (value) => setForm((prev) => ({
							...prev,
							isActive: value
						}))
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
								fontSize: "12px",
								textTransform: "uppercase",
								color: "#1c1c1c",
								marginBottom: "8px"
							},
							children: "Rolbeschrijving"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								color: "#666",
								fontSize: "13px",
								lineHeight: 1.7
							},
							children: selectedRole.description || "Geen beschrijving beschikbaar."
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
								fontSize: "12px",
								textTransform: "uppercase",
								color: "#1c1c1c",
								marginBottom: "16px"
							},
							children: "Extra permissies"
						}), form.role === "owner" ? /* @__PURE__ */ jsx("div", {
							style: {
								color: "#666",
								fontSize: "13px"
							},
							children: "Owner heeft altijd volledige toegang."
						}) : /* @__PURE__ */ jsx("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
								gap: "12px"
							},
							children: permissions.map((permission) => {
								const inherited = (selectedRole.permissions || []).includes(permission.key);
								return /* @__PURE__ */ jsx("label", {
									style: {
										border: "1px solid #e8e8e8",
										borderRadius: "8px",
										padding: "12px 14px",
										background: inherited ? "#f2f7df" : "#fff",
										cursor: inherited ? "default" : "pointer",
										opacity: inherited ? .9 : 1
									},
									children: /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "10px",
											alignItems: "flex-start"
										},
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: inherited || form.customPermissions.includes(permission.key),
											disabled: inherited,
											onChange: () => togglePermission(permission.key)
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "13px",
												color: "#1c1c1c",
												fontWeight: 600
											},
											children: permission.label
										}), /* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: "11px",
												color: "#888",
												marginTop: "4px"
											},
											children: [permission.key, inherited ? " • via rol" : ""]
										})] })]
									})
								}, permission.key);
							})
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
								fontSize: "12px",
								textTransform: "uppercase",
								color: "#1c1c1c",
								marginBottom: "10px"
							},
							children: "Effectieve toegang"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								display: "flex",
								flexWrap: "wrap",
								gap: "8px"
							},
							children: effectivePermissions.includes("*") ? /* @__PURE__ */ jsx("span", {
								style: {
									padding: "6px 10px",
									borderRadius: "999px",
									background: "#1c1c1c",
									color: "#fff",
									fontSize: "11px",
									textTransform: "uppercase",
									fontFamily: "Arial Black, Arial, sans-serif"
								},
								children: "Volledige toegang"
							}) : effectivePermissions.map((item) => /* @__PURE__ */ jsx("span", {
								style: {
									padding: "6px 10px",
									borderRadius: "999px",
									background: "#fff",
									color: "#555",
									fontSize: "11px",
									border: "1px solid #e6e6e6"
								},
								children: item
							}, item))
						})]
					})
				]
			}), /* @__PURE__ */ jsx(SaveBar, {
				saving,
				message: saved,
				onSave: save,
				saveLabel: selectedId === "new" ? "Staff aanmaken" : "Wijzigingen opslaan"
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
		hasPassword: false,
		from: "",
		replyTo: "",
		templates: [],
		mailConfigured: false
	});
	const [testEmail, setTestEmail] = useState("");
	const [saved, setSaved] = useState("");
	const [emailBusy, setEmailBusy] = useState(false);
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
			setEmailBusy(true);
			const updated = await api.updateEmailSettings(emailSettings);
			setEmailSettings((prev) => ({
				...prev,
				...updated,
				pass: ""
			}));
			setSaved("E-mailconfiguratie opgeslagen.");
			window.setTimeout(() => setSaved(""), 1600);
		} catch (error) {
			window.alert(error.message || "Opslaan mislukt.");
		} finally {
			setEmailBusy(false);
		}
	};
	const sendTest = async () => {
		try {
			setEmailBusy(true);
			await api.sendTestEmail(testEmail);
			setSaved("Test e-mail verzonden.");
			window.setTimeout(() => setSaved(""), 1600);
		} catch (error) {
			window.alert(error.message || "Test e-mail mislukt.");
		} finally {
			setEmailBusy(false);
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
								children: "Tracking status"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									display: "grid",
									gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
									gap: "12px"
								},
								children: [
									{
										label: "GA4",
										active: Boolean(websiteSettings.googleAnalyticsId),
										value: websiteSettings.googleAnalyticsId || "Niet ingesteld"
									},
									{
										label: "GTM",
										active: Boolean(websiteSettings.googleTagManagerId),
										value: websiteSettings.googleTagManagerId || "Niet ingesteld"
									},
									{
										label: "Meta Pixel",
										active: Boolean(websiteSettings.metaPixelId),
										value: websiteSettings.metaPixelId || "Niet ingesteld"
									},
									{
										label: "LinkedIn",
										active: Boolean(websiteSettings.linkedInInsightTagId),
										value: websiteSettings.linkedInInsightTagId || "Niet ingesteld"
									}
								].map((item) => /* @__PURE__ */ jsxs("div", {
									style: {
										padding: "14px",
										background: "#fff",
										border: "1px solid #eee",
										borderRadius: "8px"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontFamily: "Arial Black, Arial, sans-serif",
											fontSize: "11px",
											textTransform: "uppercase",
											color: item.active ? "#10b981" : "#999",
											marginBottom: "8px"
										},
										children: item.label
									}), /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "12px",
											color: "#555",
											wordBreak: "break-word"
										},
										children: item.value
									})]
								}, item.label))
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
						/* @__PURE__ */ jsx(Card, {
							style: {
								padding: "18px",
								background: "#fafafa",
								boxShadow: "none"
							},
							children: /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									gap: "16px",
									flexWrap: "wrap"
								},
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontFamily: "Arial Black, Arial, sans-serif",
										fontSize: "12px",
										textTransform: "uppercase",
										color: emailSettings.mailConfigured ? "#10b981" : "#999"
									},
									children: emailSettings.mailConfigured ? "SMTP actief" : "SMTP nog niet actief"
								}), /* @__PURE__ */ jsx("div", {
									style: {
										color: "#666",
										fontSize: "13px",
										marginTop: "6px"
									},
									children: emailSettings.mailConfigured ? "Configuratie lijkt compleet." : "Sla eerst host, poort, afzender en credentials op."
								})] }), /* @__PURE__ */ jsxs("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "1fr auto",
										gap: "10px",
										minWidth: "360px",
										flex: "1 1 360px"
									},
									children: [/* @__PURE__ */ jsx(FormField, {
										label: "Test e-mail naar",
										value: testEmail,
										onChange: setTestEmail,
										type: "email",
										placeholder: "naam@bedrijf.nl"
									}), /* @__PURE__ */ jsx(PrimaryButton, {
										type: "button",
										onClick: sendTest,
										disabled: emailBusy || !testEmail,
										style: {
											alignSelf: "end",
											opacity: emailBusy || !testEmail ? .65 : 1
										},
										children: emailBusy ? "Bezig..." : "Test mail"
									})]
								})]
							})
						}),
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
								label: emailSettings.hasPassword ? "SMTP password (laat leeg om te behouden)" : "SMTP password",
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
											}),
											/* @__PURE__ */ jsx(RichTextEditor, {
												label: "HTML design template",
												value: template.htmlBody || "",
												onChange: (value) => setEmailSettings((prev) => ({
													...prev,
													templates: prev.templates.map((item, i) => i === index ? {
														...item,
														htmlBody: value
													} : item)
												})),
												placeholder: "Ontwerp hier de HTML-versie van deze e-mail..."
											})
										]
									})
								}, template.id || index))
							})]
						}),
						/* @__PURE__ */ jsx(SaveBar, {
							saving: emailBusy,
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
				element: /* @__PURE__ */ jsx(DefaultAdminRedirect, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "dashboard",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "dashboard.view",
					children: /* @__PURE__ */ jsx(DashboardPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "blog",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "collections.blog",
					children: /* @__PURE__ */ jsx(BlogListPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "blog/new",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "collections.blog",
					children: /* @__PURE__ */ jsx(BlogFormPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "blog/:slug/edit",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "collections.blog",
					children: /* @__PURE__ */ jsx(BlogFormPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "diensten",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "collections.services",
					children: /* @__PURE__ */ jsx(ServiceListPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "diensten/new",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "collections.services",
					children: /* @__PURE__ */ jsx(ServiceFormPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "diensten/:slug/edit",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "collections.services",
					children: /* @__PURE__ */ jsx(ServiceFormPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "sectoren",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "collections.sectors",
					children: /* @__PURE__ */ jsx(SectorListPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "sectoren/new",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "collections.sectors",
					children: /* @__PURE__ */ jsx(SectorFormPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "sectoren/:slug/edit",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "collections.sectors",
					children: /* @__PURE__ */ jsx(SectorFormPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "leads",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "leads.view",
					children: /* @__PURE__ */ jsx(LeadsPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "homepage",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "content.homepage",
					children: /* @__PURE__ */ jsx(HomepagePage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "over-ons",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "content.about",
					children: /* @__PURE__ */ jsx(AboutPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "pages",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "content.pages",
					children: /* @__PURE__ */ jsx(PagesPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "staff",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "staff.manage",
					children: /* @__PURE__ */ jsx(StaffPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "instellingen",
				element: /* @__PURE__ */ jsx(PermissionRoute, {
					permission: "settings.manage",
					children: /* @__PURE__ */ jsx(SettingsPage, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "*",
				element: /* @__PURE__ */ jsx(DefaultAdminRedirect, {})
			})
		]
	}) });
}
//#endregion
export { useCms as a, CmsProvider as i, AuthProvider as n, api as o, RichTextContent as r, AdminPage_exports as t };
