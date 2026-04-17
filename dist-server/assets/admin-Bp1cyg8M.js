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
var SUPPORTED_LOCALES = [{
	code: "nl",
	label: "Nederlands",
	shortLabel: "NL"
}, {
	code: "en",
	label: "English",
	shortLabel: "EN"
}];
var LOCALE_SET = new Set(SUPPORTED_LOCALES.map((item) => item.code));
var LOCALIZED_ROUTE_MAP = {
	"/": {
		nl: "/",
		en: "/en"
	},
	"/over-ons": {
		nl: "/over-ons",
		en: "/en/about"
	},
	"/diensten": {
		nl: "/diensten",
		en: "/en/services"
	},
	"/sectoren": {
		nl: "/sectoren",
		en: "/en/sectors"
	},
	"/blog": {
		nl: "/blog",
		en: "/en/blog"
	},
	"/contact": {
		nl: "/contact",
		en: "/en/contact"
	},
	"/privacy-policy": {
		nl: "/privacy-policy",
		en: "/en/privacy-policy"
	},
	"/algemene-voorwaarden": {
		nl: "/algemene-voorwaarden",
		en: "/en/terms-and-conditions"
	}
};
var CANONICAL_BASES = Object.keys(LOCALIZED_ROUTE_MAP).sort((a, b) => b.length - a.length);
var LOCALIZED_ENTRIES = CANONICAL_BASES.flatMap((basePath) => Object.entries(LOCALIZED_ROUTE_MAP[basePath]).map(([locale, localizedPath]) => ({
	canonicalBasePath: basePath,
	locale,
	localizedBasePath: localizedPath
}))).sort((a, b) => b.localizedBasePath.length - a.localizedBasePath.length);
function ensureLeadingSlash(pathname) {
	if (!pathname) return "/";
	return pathname.startsWith("/") ? pathname : `/${pathname}`;
}
function trimTrailingSlash(pathname) {
	if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
	return pathname;
}
function normalizePathname(pathname) {
	return trimTrailingSlash(ensureLeadingSlash(pathname));
}
function getLocaleFromPathname(pathname) {
	const normalized = normalizePathname(pathname);
	for (const entry of LOCALIZED_ENTRIES) if (normalized === entry.localizedBasePath || normalized.startsWith(`${entry.localizedBasePath}/`)) return entry.locale;
	return "nl";
}
function getCanonicalPathname(pathname) {
	const normalized = normalizePathname(pathname);
	for (const entry of LOCALIZED_ENTRIES) {
		if (normalized === entry.localizedBasePath) return entry.canonicalBasePath;
		if (normalized.startsWith(`${entry.localizedBasePath}/`)) {
			const suffix = normalized.slice(entry.localizedBasePath.length);
			return trimTrailingSlash(`${entry.canonicalBasePath}${suffix}`);
		}
	}
	return normalized;
}
function localizePath(pathname, locale = "nl") {
	const safeLocale = LOCALE_SET.has(locale) ? locale : "nl";
	const canonicalPath = getCanonicalPathname(pathname);
	for (const basePath of CANONICAL_BASES) if (canonicalPath === basePath || canonicalPath.startsWith(`${basePath}/`)) return trimTrailingSlash(`${LOCALIZED_ROUTE_MAP[basePath]?.[safeLocale] ?? LOCALIZED_ROUTE_MAP[basePath]?.["nl"] ?? basePath}${canonicalPath.slice(basePath.length)}`) || "/";
	if (safeLocale === "nl") return canonicalPath;
	return canonicalPath === "/" ? `/${safeLocale}` : `/${safeLocale}${canonicalPath}`;
}
//#endregion
function isPlainObject(value) {
	return value && typeof value === "object" && !Array.isArray(value);
}
function getItemIdentifier(item) {
	if (!item || typeof item !== "object") return null;
	return item.key ?? item.id ?? item.slug ?? item.path ?? item.title ?? item.name ?? null;
}
function mergeLocalizedValue(baseValue, overlayValue) {
	if (overlayValue === void 0) return baseValue;
	if (Array.isArray(baseValue) && Array.isArray(overlayValue)) {
		const keyed = /* @__PURE__ */ new Map();
		baseValue.forEach((item, index) => {
			const identifier = getItemIdentifier(item);
			if (identifier) keyed.set(identifier, {
				item,
				index
			});
		});
		return baseValue.map((item, index) => {
			return mergeLocalizedValue(item, (() => {
				const identifier = getItemIdentifier(item);
				if (identifier && keyed.has(identifier)) return overlayValue.find((candidate) => getItemIdentifier(candidate) === identifier);
				return overlayValue[index];
			})());
		});
	}
	if (isPlainObject(baseValue) && isPlainObject(overlayValue)) {
		const result = { ...baseValue };
		for (const [key, value] of Object.entries(overlayValue)) result[key] = mergeLocalizedValue(baseValue?.[key], value);
		return result;
	}
	return overlayValue;
}
var CONTENT_OVERLAYS = { en: {
	site: {
		tagline: "Metalwork",
		metaTitle: "FerroWorks - Custom Metalwork in Steel, Stainless Steel & Aluminium",
		metaDesc: "FerroWorks delivers custom metal constructions for industry, construction and architecture. Engineering, production, coating and installation under one roof."
	},
	hero: {
		line1: "METAL MAKERS.",
		line2: "FROM DESIGN TO INSTALLATION.",
		subtitle: "FerroWorks guides metal projects from design and engineering to production and installation. Specialists in Steel, Stainless Steel and Aluminium.",
		cta: "SEND YOUR DRAWING",
		checkItems: [
			"More than 15 years of experience",
			"VCA, EN-1090 & CE certified",
			"Steel, stainless steel & aluminium custom work",
			"Design, production & installation"
		]
	},
	stats: [
		{ desc: "years of experience in custom metalwork" },
		{ desc: "materials: Steel, Stainless Steel & Aluminium" },
		{ desc: "in-house production, no subcontractors" },
		{ desc: "from design and engineering to installation" }
	],
	watFerna: {
		title1: "WHAT FERROWORKS",
		title2: "DOES FOR YOU",
		bulletItems: [
			"Clear agreements, no surprises.",
			"Complete support from design to installation.",
			"Repair and maintenance on site.",
			"Advice and support on design and feasibility.",
			"One partner for the full process.",
			"Practical, buildable and well considered.",
			"Transparent in costs and planning."
		]
	},
	anders: { items: [
		{
			title: "LARGE ENOUGH TO TAKE THE LEAD",
			desc: "We have the capacity and expertise to deliver technical metal projects from start to finish."
		},
		{
			title: "SMALL ENOUGH TO SWITCH QUICKLY",
			desc: "Direct contact, fast communication and flexibility in your planning."
		},
		{
			title: "PERSONAL ENOUGH TO THINK AHEAD",
			desc: "We advise, optimise and make sure your project works from day one."
		}
	] },
	projecten: [
		{
			title: "MEASURING TUBES FOR A LIQUID TANK",
			desc: "For this client we produced custom measuring tubes for a liquid storage tank."
		},
		{
			title: "STEEL STRUCTURE FOR AN OFFSHORE PLATFORM",
			desc: "Complex steel structure manufactured for an offshore platform, fully Lloyd's certified."
		},
		{
			title: "PIPEWORK FOR PETROCHEMICALS",
			desc: "Custom piping and fittings delivered for a refinery in the petrochemical sector."
		},
		{
			title: "TANK CONSTRUCTION FOR AN INDUSTRIAL COMPLEX",
			desc: "Rolled sections, roof sections and manholes produced for a major industrial tank project."
		}
	],
	faq: [
		{
			q: "WE ALREADY HAVE A REGULAR STEEL PARTNER. WHY SHOULD WE TALK TO FERROWORKS?",
			a: "Because FerroWorks focuses on the complex custom jobs that often fall outside the scope of a standard steel supplier. We work fast, accurately and fully in house."
		},
		{
			q: "ARE YOU LARGE ENOUGH FOR OUR PROJECTS?",
			a: "With 16 specialised professionals and our own machine park, including a 6 x 3 metre water cutter, we are equipped for demanding industrial work."
		},
		{
			q: "WHICH CERTIFICATIONS DOES FERROWORKS HAVE?",
			a: "FerroWorks is VCA certified and complies with EN-1090 for steel and aluminium constructions. We deliver the required documentation and quality assurance with every project."
		},
		{
			q: "HOW RELIABLE IS THE 2 TO 4 WEEK LEAD TIME?",
			a: "That lead time is a commitment, not an estimate. Because everything happens in our own workshop we stay in control of planning and quality."
		}
	],
	overOns: {
		verhaal: {
			title1: "BUILT ON",
			title2: "CRAFTSMANSHIP",
			tekst1: "FerroWorks is a family business with more than 15 years of experience in custom metalwork. We guide projects from A to Z, from design and engineering to production, coating and installation on site.",
			tekst2: "Specialists in custom steel, stainless steel and aluminium for industry, construction, architecture, design and maritime applications.",
			tekst3: "Clear agreements, transparent costs and one point of contact from start to finish. That is how we work."
		},
		watWeDoen: { items: [
			"Clear agreements, no surprises.",
			"Complete support from design to installation.",
			"Repair and maintenance on site.",
			"Advice and support on design and feasibility.",
			"One partner for the full process.",
			"Practical, buildable and well considered.",
			"Transparent in costs and planning."
		] },
		andersItems: [
			{
				title: "LARGE ENOUGH TO TAKE THE LEAD",
				desc: "We have the capacity and expertise to deliver technical metal projects from start to finish."
			},
			{
				title: "SMALL ENOUGH TO SWITCH QUICKLY",
				desc: "Direct contact, fast communication and flexibility in your planning."
			},
			{
				title: "PERSONAL ENOUGH TO THINK AHEAD",
				desc: "We advise, optimise and make sure your project works from day one."
			}
		],
		team: {
			title1: "CRAFTSMEN WITH",
			title2: "ONE GOAL",
			tekst1: "Our team includes specialised metalworkers, welders, engineers and project leads, each with deep knowledge of steel, stainless steel and aluminium.",
			tekst2: "We work closely with our clients from the first drawing to the final bolt on site. Always one point of contact, always personal.",
			items: [
				"More than 15 years of experience in custom metalwork",
				"Practical, buildable and well considered",
				"Repair and maintenance on site"
			]
		}
	},
	diensten: [
		{
			title: "Engineering & Design",
			subtitle: "From the first sketch to an approved production drawing",
			excerpt: "Every project starts with a strong design. Our engineers translate your requirements into practical production drawings using modern CAD software.",
			checklist: "2D and 3D drawings (CAD/CAM)\nStructural calculations\nMaterial selection and cost advice\nFeasibility review\nApproval process with the client",
			body: "A strong metal project does not start in the workshop. It starts at the drawing table. At FerroWorks our engineering department turns your idea or specification into a fully developed production drawing.\n\nWhether you arrive with a detailed structural drawing, a rough paper sketch or only an idea, we work it out with you. We ask the right questions to understand the application, load, environment and end use.\n\nIf you work with an external structural engineer or architect, we coordinate directly with them. That way what looks good on paper is also practical to manufacture."
		},
		{
			title: "In-house Production",
			subtitle: "Complete machine park, no outsourcing",
			excerpt: "Our modern workshop in Roosendaal is equipped for steel, stainless steel and aluminium processing in-house.",
			checklist: "Sawing and laser cutting\nDrilling, milling and shearing\nCertified welding (MIG/MAG, TIG, WIG)\nBending and rolling\nPrefab production and custom work in every batch size",
			body: "Our workshop is equipped with a complete machine park. We outsource nothing. Everything is produced in-house, from the first cut to the final weld.\n\nWhether it is one-off custom work or larger series, FerroWorks has the capacity and expertise to manufacture your project efficiently and accurately.\n\nOur certified welders work with steel, stainless steel and aluminium and handle all common welding methods, including MIG/MAG, TIG and WIG."
		},
		{
			title: "Coating & Finishing",
			subtitle: "Multi-layer coating systems in line with ISO 12944",
			excerpt: "The right finish protects your construction and defines its appearance. FerroWorks advises on the best coating solution for every project.",
			checklist: "Blasting to Sa2.5\nZinc-rich or epoxy primer\nWet paint for large structures\nPowder coating for series work\nStainless steel polishing\nGalvanising",
			body: "A coating is more than a layer of paint. It protects your investment. FerroWorks advises on the right system based on environment, load and expected service life.\n\nWe blast, prime and paint in-house. From zinc-rich primers for offshore applications to powder coating for architectural elements, we cover the full range.\n\nAll systems are applied in accordance with ISO 12944, the international standard for corrosion protection of steel structures."
		},
		{
			title: "On-site Installation",
			subtitle: "Own certified installation team",
			excerpt: "Our installation team places your construction on site, from simple guardrails to complex steel structures at height.",
			checklist: "Own VCA-certified installation team\nInstallation of steel, stainless steel and aluminium\nCrane coordination and safety management\nConnection welding and on-site corrections\nFinal inspection and handover file",
			body: "Production is only complete once your construction is in the right place. Our own installation team assembles everything on site, from simple barriers to complex elevated steel structures.\n\nWe work VCA certified and follow all safety measures. Our team is trained for working at height, in confined spaces and on industrial sites.\n\nAfter installation we complete a final inspection and hand over the project documentation."
		},
		{
			title: "Repair & Maintenance",
			subtitle: "Fast, skilled, without long waiting times",
			excerpt: "Steel structures wear, deform or get damaged. FerroWorks handles repairs and maintenance both in the workshop and on site.",
			checklist: "Weld repairs in steel, stainless steel and aluminium\nRepair of corrosion damage and coatings\nStructural reinforcement of existing constructions\nEmergency on-site repairs possible\nMaintenance contracts on request",
			body: "Steel structures wear out, deform or get damaged through use, corrosion or external forces. FerroWorks carries out repairs quickly and professionally, in the workshop or on site.\n\nWe assess the damage, advise on the best solution and solve it. From small weld repairs to structural reinforcement of existing constructions.\n\nHave an emergency? Call us directly. Urgent repairs on site are possible."
		}
	],
	sectoren: [
		{
			naam: "Construction & Utilities",
			tagline: "Steel structures, guardrails and prefab balconies for the construction sector",
			description: "Steel structures, standard guardrails and prefab balconies for construction and utility projects.",
			intro: "In construction and utilities FerroWorks delivers steel structures that meet the strictest standards. From support frames to prefab balconies, everything is CE certified in line with EN-1090.",
			items: "Steel structures and support frames\nStandard guardrails\nPrefab balconies and landings\nStairs, railings and escape stair structures\nFacade elements and steel window frames\nCE certified according to EN-1090"
		},
		{
			naam: "Industry",
			tagline: "Machine building, process installations and custom steelwork",
			description: "Machine building, custom steel structures, industrial installations and on-site welding work.",
			intro: "Industrial clients rely on FerroWorks for custom steel structures and process installations. We deliver quickly and accurately, including on site.",
			items: "Machine building and machine frames\nCustom steel constructions\nIndustrial installations and process frames\nOn-site welding work\nStainless steel for food and pharmaceutical industries\nSupport structures and mezzanine floors"
		},
		{
			naam: "Architecture & Design",
			tagline: "Design stairs, ornamental work and exterior custom work for architects",
			description: "Design stairs and interior and exterior custom work for architecture and design projects.",
			intro: "Architects and designers choose FerroWorks for custom metalwork that combines aesthetics and craftsmanship. From design stairs to unique facade panels.",
			items: "Design stairs in steel and stainless steel\nInterior and exterior custom work\nBalustrades and railings\nOrnamental work, gates and entrance structures\nFacade panels and cladding\nCoating and powder coating in every RAL colour"
		},
		{
			naam: "Maritime",
			tagline: "Yacht building, offshore structures and maritime coating",
			description: "Custom steel and aluminium constructions for yacht building and maritime applications.",
			intro: "Maritime conditions demand the best material and coating systems. FerroWorks delivers for yacht building, offshore and harbour infrastructure.",
			items: "Yacht building and ship interiors\nOffshore steel and stainless steel structures\nDeck equipment and handrails\nAluminium gangways and platforms\nMaritime coating (C5-M, ISO 12944)\nRepairs in harbour and on board"
		}
	],
	blog: [
		{
			title: "Why weld quality control makes all the difference",
			category: "Craftsmanship",
			date: "8 April 2026",
			readTime: "4 min",
			excerpt: "In metalworking, welding is one of the most critical processes. A small welding defect can have major consequences for safety and service life. Discover how FerroWorks treats quality control as standard practice, not an exception.",
			body: "Weld quality control does not start at final inspection. It starts with every step in the process, from filler material selection to preparation of the base material.\n\nAt FerroWorks we work exclusively with certified welders who meet EN-1090 requirements. Every weld is visually inspected and, where required, tested with non-destructive methods.\n\nA small deviation in a weld can create major consequences under load. That is why we use strict procedures and documentation for every project."
		},
		{
			title: "Offshore steel structures: requirements and challenges",
			category: "Offshore",
			date: "1 April 2026",
			readTime: "5 min",
			excerpt: "Offshore steelwork faces extreme conditions: salt water, high loads and constant mechanical stress. We explain which materials and coatings we use for durable offshore constructions.",
			body: "Offshore steel structures operate in one of the most aggressive environments imaginable: salt seawater, high wind loads and constant mechanical stress.\n\nFerroWorks delivers offshore structures in line with NORSOK and ISO 12944 class C5-M. We use certified materials and coating systems designed for the toughest maritime environments.\n\nFrom the engineering phase onward we account for corrosion protection, maintenance intervals and site accessibility."
		},
		{
			title: "Wet paint vs powder coating: what suits your project?",
			category: "Finishing",
			date: "24 March 2026",
			readTime: "3 min",
			excerpt: "The choice between wet paint and powder coating affects both appearance and protection level. We compare the strengths and trade-offs of both methods.",
			body: "Wet paint and powder coating are both strong finishing methods for steel, but each has its own application range.\n\nWet paint is ideal for large structures that do not fit into an oven, for multi-layer coating systems and for aggressive environments. Powder coating is more durable, more environmentally friendly and gives a uniform finish.\n\nAt FerroWorks we always advise the most suitable method for your specific situation."
		},
		{
			title: "Is a welding certificate mandatory? What to know about EN-1090",
			category: "Certification",
			date: "17 March 2026",
			readTime: "6 min",
			excerpt: "Since EN-1090 came into force, certification is mandatory for many steel structures. But what does that mean in practice, and when does it apply? FerroWorks explains it clearly.",
			body: "EN-1090 is the European standard for manufacturing steel and aluminium structures. Constructions that fall under CE marking requirements must be produced by a certified manufacturer.\n\nFerroWorks is certified in line with EN-1090-2 for execution class EXC2. This means our constructions meet strict European requirements for load-bearing steel structures.\n\nNot sure whether your project requires EN-1090 certification? Get in touch and we will advise you."
		},
		{
			title: "From drawing to product: how our production process works",
			category: "Production",
			date: "10 March 2026",
			readTime: "4 min",
			excerpt: "How does a metal project move from CAD drawing to finished product? We walk through the FerroWorks process step by step, from intake and engineering to production, finishing and installation.",
			body: "Every FerroWorks project follows the same phases: intake, engineering, production, coating and installation. Because we manage everything in-house, we stay in control of quality and planning in every phase.\n\nAfter intake and drawing approval the product moves into the workshop. Our CNC machines handle precise cutting and machining, followed by welding, blasting and coating.\n\nThe final product is checked, stored and installed on site by our assembly team."
		},
		{
			title: "Custom industrial steel: 5 common mistakes avoided",
			category: "Industry",
			date: "3 March 2026",
			readTime: "5 min",
			excerpt: "Industrial custom steelwork often goes wrong not because of bad intent, but because of missing knowledge or weak communication. We cover five common mistakes and how to avoid them.",
			body: "Mistake 1: involving the manufacturer too late. Do not wait until the drawing is finished. Bring FerroWorks in early for manufacturability advice.\n\nMistake 2: specifying unrealistic tolerances. Steel has tolerances. Make sure your drawing reflects what is achievable for the chosen production method.\n\nMistake 3: forgetting coating during design. Think about coating early, because accessibility, thickness and method affect the construction.\n\nMistake 4: ignoring installation. A structure that works in the workshop but is hard to place on site costs time and money.\n\nMistake 5: poor documentation. Clear drawings and specifications are the basis of a successful project."
		}
	],
	contact: {
		hero: {
			title1: "GET IN",
			title2: "TOUCH",
			subtitle: "Send your drawing or ask your question. We respond within 24 hours."
		},
		openingstijden: "Monday - Friday: 07:30 - 17:00\nSaturday: By appointment\nSunday: Closed"
	},
	pages: [
		{
			key: "home",
			name: "Homepage",
			metaTitle: "FerroWorks - Custom Metalwork in Steel, Stainless Steel & Aluminium",
			metaDescription: "FerroWorks delivers custom metal constructions for industry, construction and architecture. Engineering, production, coating and installation under one roof."
		},
		{
			key: "about",
			name: "About",
			path: "/en/about",
			metaTitle: "About | FerroWorks",
			metaDescription: "Learn more about FerroWorks, our way of working and our craftsmanship in steel, stainless steel and aluminium."
		},
		{
			key: "services",
			name: "Services",
			path: "/en/services",
			metaTitle: "Services | FerroWorks",
			metaDescription: "Engineering, production, coating, installation and maintenance for custom metal projects."
		},
		{
			key: "sectors",
			name: "Sectors",
			path: "/en/sectors",
			metaTitle: "Sectors | FerroWorks",
			metaDescription: "Custom metalwork for construction, industry, architecture and maritime applications."
		},
		{
			key: "blog",
			name: "Blog",
			path: "/en/blog",
			metaTitle: "Blog | FerroWorks",
			metaDescription: "Knowledge articles, project stories and technical insights from FerroWorks."
		},
		{
			key: "contactPage",
			name: "Contact",
			path: "/en/contact",
			metaTitle: "Contact | FerroWorks",
			metaDescription: "Contact FerroWorks for advice, quotations or technical coordination.",
			heroTitle: "GET IN TOUCH",
			heroSubtitle: "Send your drawing or ask your question. We respond within 24 hours."
		},
		{
			key: "privacy",
			name: "Privacy Policy",
			path: "/en/privacy-policy",
			metaTitle: "Privacy Policy | FerroWorks",
			metaDescription: "Read how FerroWorks processes and protects personal data.",
			heroTitle: "PRIVACY POLICY",
			heroSubtitle: "Clear information about what data we process and why.",
			body: "<h2>1. Who we are</h2><p>FerroWorks processes personal data in the context of quotation requests, client communication and service delivery.</p><h2>2. What data we collect</h2><p>We process contact details, company details and information that you actively share with us through forms, email or phone contact.</p><h2>3. Why we use this data</h2><p>We use this data to answer requests, prepare quotations, carry out assignments and improve our services.</p><h2>4. Retention periods</h2><p>We do not store personal data longer than necessary for the purpose for which it was collected, unless a legal retention period applies.</p><h2>5. Your rights</h2><p>You can request access, correction or deletion of your personal data by contacting us using the details on this website.</p>"
		},
		{
			key: "terms",
			name: "Terms & Conditions",
			path: "/en/terms-and-conditions",
			metaTitle: "Terms & Conditions | FerroWorks",
			metaDescription: "The general terms and conditions of FerroWorks.",
			heroTitle: "TERMS & CONDITIONS",
			heroSubtitle: "The terms that apply to quotations, deliveries and assignments.",
			body: "<h2>1. Applicability</h2><p>These terms apply to all quotations, agreements and deliveries of FerroWorks.</p><h2>2. Quotations and assignments</h2><p>Quotations are non-binding unless explicitly stated otherwise. An assignment takes effect after written confirmation.</p><h2>3. Delivery and execution</h2><p>Delivery times are indicative. FerroWorks makes every effort to fulfil agreements carefully and professionally.</p><h2>4. Payment</h2><p>Invoices must be paid within the agreed payment term. Additional costs may be charged in case of delay.</p><h2>5. Liability</h2><p>Our liability is limited to direct damage and to the amount covered by our insurance or otherwise contractually agreed for the relevant case.</p>"
		}
	]
} };
function getLocalizationConfig(websiteSettings = {}) {
	const config = websiteSettings?.localization || {};
	const locales = Array.isArray(config.locales) && config.locales.length > 0 ? config.locales : ["nl", "en"];
	return {
		enabled: Boolean(config.enabled),
		defaultLocale: config.defaultLocale || "nl",
		locales,
		localizedContent: config.localizedContent || {}
	};
}
function isLocalizationEnabled(websiteSettings = {}) {
	return getLocalizationConfig(websiteSettings).enabled;
}
function getActiveLocales(websiteSettings = {}) {
	const config = getLocalizationConfig(websiteSettings);
	return config.enabled ? config.locales : [config.defaultLocale || "nl"];
}
function localizeCmsContent(cms, locale = "nl") {
	if (!cms) return cms;
	const localization = getLocalizationConfig(cms.websiteSettings || {});
	if (!localization.enabled || locale === localization.defaultLocale || locale === "nl") return cms;
	const systemOverlay = CONTENT_OVERLAYS[locale] || {};
	const userOverlay = localization.localizedContent?.[locale] || {};
	return mergeLocalizedValue(mergeLocalizedValue(cms, systemOverlay), userOverlay);
}
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
//#region src/i18n/translations.js
var SUPPORTED_LANGUAGES = SUPPORTED_LOCALES;
var translations = {
	nl: {
		nav: {
			overOns: "Over ons",
			diensten: "Diensten",
			sectoren: "Sectoren",
			blog: "Blog",
			contact: "Contact",
			cta: "NEEM CONTACT OP",
			brandTagline: "metaalwerk",
			menuToggle: "Menu openen",
			languageLabel: "Taal"
		},
		common: {
			home: "Home",
			readMore: "LEES MEER",
			readArticle: "LEES ARTIKEL",
			getQuote: "OFFERTE AANVRAGEN",
			contactUs: "NEEM CONTACT OP",
			callUs: "BEL ONS",
			startProject: "KLAAR OM",
			startProjectAccent: "TE STARTEN?",
			startProjectText: "Stuur uw tekening op of neem contact op - wij reageren binnen 24 uur.",
			loading: "Laden..."
		},
		footer: {
			rights: "© FerroWorks. All Rights Reserved | Marketing door",
			vacancies: "VACATURES",
			machinePark: "MACHINEPARK",
			privacy: "PRIVACY POLICY",
			terms: "ALGEMENE VOORWAARDEN"
		},
		contactPage: {
			breadcrumb: "Contact",
			sendMessage: "STUUR EEN BERICHT",
			replyWithin: "WIJ REAGEREN ",
			replyWithinAccent: "BINNEN 24 UUR",
			successTitle: "Bericht ontvangen!",
			successText: "Bedankt voor uw bericht. Wij nemen zo snel mogelijk contact met u op.",
			fieldName: "Naam *",
			fieldCompany: "Bedrijf",
			fieldEmail: "E-mailadres *",
			fieldPhone: "Telefoon",
			fieldMessage: "Bericht *",
			fieldAttachment: "Tekening / bijlage",
			placeholderName: "Uw naam",
			placeholderCompany: "Uw bedrijfsnaam",
			placeholderEmail: "uw@email.nl",
			placeholderPhone: "+31 ...",
			placeholderMessage: "Beschrijf uw project of vraag...",
			uploadPrompt: "Sleep een bestand of ",
			uploadAction: "klik om te uploaden",
			uploadTypes: "PDF, DWG, DXF, JPG, PNG",
			send: "VERSTUUR BERICHT",
			sending: "VERZENDEN...",
			details: "CONTACTGEGEVENS",
			reachable: "DIRECT ",
			reachableAccent: "BEREIKBAAR",
			phone: "Telefoon",
			email: "E-mail",
			address: "Adres",
			hours: "OPENINGSTIJDEN",
			call: "BELLEN",
			mail: "MAILEN",
			visit: "BEZOEKEN",
			mapTitle: "FerroWorks locatie",
			error: "Versturen mislukt."
		},
		blogPage: {
			heroTitle: "KENNIS & ",
			heroAccent: "INZICHTEN",
			heroText: "Vakartikelen, projectverhalen en technische inzichten vanuit de dagelijkse praktijk van FerroWorks.",
			featured: "Uitgelicht",
			readTime: "leestijd",
			allArticles: "ALLE ARTIKELEN",
			recentTitle: "RECENTE ",
			recentAccent: "PUBLICATIES",
			noResults: "Geen artikelen gevonden in deze categorie.",
			newsletterEyebrow: "BLIJF OP DE HOOGTE",
			newsletterTitle: "ONTVANG ONZE ",
			newsletterAccent: "NIEUWSBRIEF",
			newsletterText: "Nieuwe artikelen, projectupdates en technische tips - direct in uw inbox.",
			newsletterSuccess: "Inschrijving gelukt! ✓",
			newsletterCta: "INSCHRIJVEN",
			newsletterError: "Inschrijven mislukt.",
			ctaTitle: "EEN PROJECT IN ",
			ctaAccent: "GEDACHTEN?",
			ctaText: "Neem contact op - wij denken graag met u mee.",
			categories: {
				all: "Alle",
				craftsmanship: "Vakmanschap",
				offshore: "Offshore",
				finishing: "Afwerking",
				certification: "Certificering",
				production: "Productie",
				industry: "Industrie"
			}
		},
		servicesPage: {
			breadcrumb: "Diensten",
			heroTitle: "ONZE ",
			heroAccent: "DIENSTEN",
			heroText: "Van ontwerp en engineering tot productie, coating en montage - FerroWorks ontzorgt u volledig in metaalmaatwerk van A tot Z.",
			stats: [
				{
					label: "Jaar ervaring",
					sub: "in metaalmaatwerk"
				},
				{
					label: "Eigen productie",
					sub: "zonder onderaannemers"
				},
				{
					label: "Volledig ontzorgd",
					sub: "van ontwerp tot montage"
				}
			],
			moreInfo: "MEER INFORMATIE"
		},
		sectorsPage: {
			breadcrumb: "Sectoren",
			heroTitle: "STAAL, RVS & ALU ",
			heroAccent: "IN ELKE SECTOR",
			heroText: "FerroWorks levert maatwerk metaaloplossingen voor bouw, industrie, architectuur en maritieme toepassingen. Altijd vakkundig, altijd op maat.",
			sectorLabel: "SECTOR",
			relatedEyebrow: "OOK INTERESSANT",
			relatedTitle: "ONZE ",
			relatedAccent: "DIENSTEN",
			moreInfo: "→ Meer info"
		},
		aboutPage: {
			breadcrumb: "Over Ons",
			heroTitle: "VORMGEVERS ",
			heroAccent: "IN METAAL",
			heroText: "FerroWorks begeleidt metaalprojecten van ontwerp en engineering tot productie en montage. Specialist in maatwerk Staal, RVS en Aluminium.",
			storyEyebrow: "ONS VERHAAL",
			servicesEyebrow: "ONZE DIENSTEN",
			servicesTitle: "WAT FERROWORKS",
			servicesAccent: "VOOR JE DOET",
			whyEyebrow: "WAAROM FERROWORKS",
			whyTitle: "WAT ONS ",
			whyAccent: "ANDERS MAAKT",
			teamEyebrow: "ONS TEAM",
			sectorsEyebrow: "WAT WE BOUWEN",
			sectorsTitle: "ONZE ",
			sectorsAccent: "SECTOREN",
			certEyebrow: "ONZE CERTIFICERINGEN",
			certTitle: "GECERTIFICEERD ",
			certAccent: "VCA, EN-1090 & CE",
			certs: [
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
			],
			sectors: [
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
			]
		},
		managedPage: { noContent: "Geen inhoud ingesteld." }
	},
	en: {
		nav: {
			overOns: "About",
			diensten: "Services",
			sectoren: "Sectors",
			blog: "Blog",
			contact: "Contact",
			cta: "CONTACT US",
			brandTagline: "metalwork",
			menuToggle: "Open menu",
			languageLabel: "Language"
		},
		common: {
			home: "Home",
			readMore: "READ MORE",
			readArticle: "READ ARTICLE",
			getQuote: "REQUEST A QUOTE",
			contactUs: "CONTACT US",
			callUs: "CALL US",
			startProject: "READY TO",
			startProjectAccent: "GET STARTED?",
			startProjectText: "Send your drawing or contact us - we respond within 24 hours.",
			loading: "Loading..."
		},
		footer: {
			rights: "© FerroWorks. All Rights Reserved | Marketing by",
			vacancies: "CAREERS",
			machinePark: "MACHINE PARK",
			privacy: "PRIVACY POLICY",
			terms: "TERMS & CONDITIONS"
		},
		contactPage: {
			breadcrumb: "Contact",
			sendMessage: "SEND A MESSAGE",
			replyWithin: "WE RESPOND ",
			replyWithinAccent: "WITHIN 24 HOURS",
			successTitle: "Message received!",
			successText: "Thank you for your message. We will get back to you as soon as possible.",
			fieldName: "Name *",
			fieldCompany: "Company",
			fieldEmail: "Email address *",
			fieldPhone: "Phone",
			fieldMessage: "Message *",
			fieldAttachment: "Drawing / attachment",
			placeholderName: "Your name",
			placeholderCompany: "Your company name",
			placeholderEmail: "your@email.com",
			placeholderPhone: "+31 ...",
			placeholderMessage: "Describe your project or question...",
			uploadPrompt: "Drop a file or ",
			uploadAction: "click to upload",
			uploadTypes: "PDF, DWG, DXF, JPG, PNG",
			send: "SEND MESSAGE",
			sending: "SENDING...",
			details: "CONTACT DETAILS",
			reachable: "DIRECTLY ",
			reachableAccent: "AVAILABLE",
			phone: "Phone",
			email: "Email",
			address: "Address",
			hours: "OPENING HOURS",
			call: "CALL",
			mail: "EMAIL",
			visit: "VISIT",
			mapTitle: "FerroWorks location",
			error: "Sending failed."
		},
		blogPage: {
			heroTitle: "KNOWLEDGE & ",
			heroAccent: "INSIGHTS",
			heroText: "Industry articles, project stories and technical insights from FerroWorks' day-to-day practice.",
			featured: "Featured",
			readTime: "read time",
			allArticles: "ALL ARTICLES",
			recentTitle: "RECENT ",
			recentAccent: "PUBLICATIONS",
			noResults: "No articles found in this category.",
			newsletterEyebrow: "STAY INFORMED",
			newsletterTitle: "RECEIVE OUR ",
			newsletterAccent: "NEWSLETTER",
			newsletterText: "New articles, project updates and technical tips - straight to your inbox.",
			newsletterSuccess: "Subscription successful! ✓",
			newsletterCta: "SUBSCRIBE",
			newsletterError: "Subscription failed.",
			ctaTitle: "HAVE A PROJECT ",
			ctaAccent: "IN MIND?",
			ctaText: "Get in touch - we would love to think along with you.",
			categories: {
				all: "All",
				craftsmanship: "Craftsmanship",
				offshore: "Offshore",
				finishing: "Finishing",
				certification: "Certification",
				production: "Production",
				industry: "Industry"
			}
		},
		servicesPage: {
			breadcrumb: "Services",
			heroTitle: "OUR ",
			heroAccent: "SERVICES",
			heroText: "From design and engineering to production, coating and installation - FerroWorks supports your custom metal project from A to Z.",
			stats: [
				{
					label: "Years of experience",
					sub: "in custom metalwork"
				},
				{
					label: "In-house production",
					sub: "without subcontractors"
				},
				{
					label: "Complete support",
					sub: "from design to installation"
				}
			],
			moreInfo: "MORE INFORMATION"
		},
		sectorsPage: {
			breadcrumb: "Sectors",
			heroTitle: "STEEL, STAINLESS & ALU ",
			heroAccent: "FOR EVERY SECTOR",
			heroText: "FerroWorks delivers custom metal solutions for construction, industry, architecture and maritime applications. Always skilled, always tailored.",
			sectorLabel: "SECTOR",
			relatedEyebrow: "ALSO INTERESTING",
			relatedTitle: "OUR ",
			relatedAccent: "SERVICES",
			moreInfo: "→ More info"
		},
		aboutPage: {
			breadcrumb: "About",
			heroTitle: "METAL ",
			heroAccent: "MAKERS",
			heroText: "FerroWorks guides metal projects from design and engineering to production and installation. Specialists in custom Steel, Stainless Steel and Aluminium.",
			storyEyebrow: "OUR STORY",
			servicesEyebrow: "OUR SERVICES",
			servicesTitle: "WHAT FERROWORKS",
			servicesAccent: "DOES FOR YOU",
			whyEyebrow: "WHY FERROWORKS",
			whyTitle: "WHAT MAKES US ",
			whyAccent: "DIFFERENT",
			teamEyebrow: "OUR TEAM",
			sectorsEyebrow: "WHAT WE BUILD",
			sectorsTitle: "OUR ",
			sectorsAccent: "SECTORS",
			certEyebrow: "OUR CERTIFICATIONS",
			certTitle: "CERTIFIED ",
			certAccent: "VCA, EN-1090 & CE",
			certs: [
				{
					code: "VCA",
					label: "Safety, health and environment"
				},
				{
					code: "EN-1090",
					label: "Steel and aluminium structures"
				},
				{
					code: "CE",
					label: "Conformity and safety standard"
				}
			],
			sectors: [
				{
					naam: "Construction & Utilities",
					diensten: [
						"Steel structures",
						"Standard guardrails",
						"Prefab balconies"
					]
				},
				{
					naam: "Industry",
					diensten: [
						"Machine building",
						"Custom steel structures",
						"Industrial installations",
						"On-site welding"
					]
				},
				{
					naam: "Architecture & Design",
					diensten: ["Design stairs", "Interior and exterior custom work"]
				},
				{
					naam: "Maritime",
					diensten: ["Yacht building"]
				}
			]
		},
		managedPage: { noContent: "No content configured yet." }
	}
};
//#endregion
//#region src/i18n/LanguageContext.jsx
var LanguageContext = createContext(null);
function getValueByPath(obj, path) {
	return path.split(".").reduce((acc, key) => {
		if (acc && Object.prototype.hasOwnProperty.call(acc, key)) return acc[key];
	}, obj);
}
function LanguageProvider({ children }) {
	const location = useLocation();
	const navigate = useNavigate();
	const localeFromPath = getLocaleFromPathname(location.pathname);
	const [language, setLanguageState] = useState(localeFromPath);
	useEffect(() => {
		setLanguageState(localeFromPath);
	}, [localeFromPath]);
	useEffect(() => {
		if (typeof document !== "undefined") {
			document.documentElement.lang = language;
			window.localStorage.setItem("ferroworks_locale", language);
		}
	}, [language]);
	const value = useMemo(() => {
		const t = (key, fallback = "") => {
			const found = getValueByPath(translations[language] || {}, key);
			if (typeof found === "string") return found;
			return fallback || key;
		};
		const setLanguage = (nextLanguage) => {
			const targetLanguage = nextLanguage || "nl";
			setLanguageState(targetLanguage);
			if (location.pathname.startsWith("/admin")) return;
			navigate(localizePath(getCanonicalPathname(location.pathname), targetLanguage), { replace: false });
		};
		return {
			language,
			setLanguage,
			supportedLanguages: SUPPORTED_LANGUAGES,
			canonicalPath: getCanonicalPathname(location.pathname),
			localizePath: (pathname, locale = language) => localizePath(pathname, locale),
			t
		};
	}, [
		language,
		location.pathname,
		navigate
	]);
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
		linkedInInsightTagId: "",
		theme: {
			dashboardFont: "default",
			websiteFont: "default",
			dashboardPrimaryColor: "#c8d400",
			dashboardSecondaryColor: "#1c1c1c",
			websitePrimaryColor: "#c8d400",
			websiteSecondaryColor: "#1c1c1c"
		}
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
	const { language } = useLanguage();
	const isAdminRoute = useLocation().pathname.startsWith("/admin");
	const [rawCms, setRawCms] = useState(() => deepMerge(DEFAULT_CMS, initialCms || {}));
	const [loading, setLoading] = useState(!initialCms);
	const [error, setError] = useState("");
	const refreshCms = async () => {
		setLoading(true);
		try {
			setRawCms(deepMerge(DEFAULT_CMS, await api.getCms()));
			setError("");
		} catch (err) {
			setRawCms(DEFAULT_CMS);
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
			setRawCms((prev) => ({
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
	const cms = useMemo(() => {
		if (isAdminRoute) return rawCms;
		if (!isLocalizationEnabled(rawCms.websiteSettings || {})) return rawCms;
		return localizeCmsContent(rawCms, language);
	}, [
		isAdminRoute,
		language,
		rawCms
	]);
	const value = useMemo(() => ({
		cms,
		rawCms,
		updateCms,
		resetCms,
		refreshCms,
		loading,
		error
	}), [
		cms,
		rawCms,
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
									stroke: "var(--fw-website-primary)",
									strokeWidth: "7"
								}),
								/* @__PURE__ */ jsx("path", {
									d: "M89 102H46V87H74V28H89V102Z",
									stroke: "var(--fw-website-primary)",
									strokeWidth: "7"
								}),
								/* @__PURE__ */ jsx("path", {
									d: "M28 28H46V68H56V28H74",
									stroke: "var(--fw-website-primary)",
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
							color: "var(--fw-website-primary)",
							fontFamily: "var(--fw-website-heading-font)",
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
							fontFamily: "var(--fw-website-heading-font)",
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
									stroke: "var(--fw-website-primary)",
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
							backgroundColor: "var(--fw-website-primary)",
							color: "var(--fw-website-secondary)",
							borderRadius: "999px",
							padding: "15px 32px",
							fontSize: "13px",
							fontWeight: 900,
							textTransform: "uppercase",
							fontFamily: "var(--fw-website-heading-font)",
							letterSpacing: "1px",
							transition: "background-color 0.2s"
						},
						onMouseEnter: (e) => e.currentTarget.style.filter = "brightness(0.94)",
						onMouseLeave: (e) => e.currentTarget.style.filter = "none",
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
								style: { color: "var(--fw-website-primary)" },
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
								background: "var(--fw-website-primary)",
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
function CheckIcon() {
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
			stroke: "var(--fw-website-primary)",
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
							children: [/* @__PURE__ */ jsx(CheckIcon, {}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
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
							background: "var(--fw-website-primary)",
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
					borderTop: "2.5px solid var(--fw-website-primary)",
					borderLeft: "2.5px solid var(--fw-website-primary)"
				} }),
				/* @__PURE__ */ jsx("span", { style: {
					position: "absolute",
					bottom: 0,
					right: 0,
					width: "12px",
					height: "12px",
					borderBottom: "2.5px solid var(--fw-website-primary)",
					borderRight: "2.5px solid var(--fw-website-primary)"
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
		description: "Machinebouw, maatwerk staalconstructies, industriÃ«le installaties en laswerkzaamheden op locatie.",
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
				className: "home-sector-link mt-auto inline-block font-black uppercase tracking-[-0.2px]",
				style: {
					fontFamily: "var(--fw-website-heading-font)",
					color: "var(--fw-website-primary-strong)"
				},
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
      ` }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-[1200px] mx-auto px-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-[44px]",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "site-heading text-[#333333] uppercase font-black text-[34px] leading-none tracking-[-0.8px] mb-[16px]",
						style: { fontFamily: "var(--fw-website-heading-font)" },
						children: "ONZE SECTOREN"
					}), /* @__PURE__ */ jsx("p", {
						className: "site-heading text-[#6f6f6f] uppercase font-black text-[16px] tracking-[-0.2px]",
						style: { fontFamily: "var(--fw-website-heading-font)" },
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
						className: "site-heading inline-flex items-center justify-center min-w-[188px] h-[52px] rounded-full uppercase font-black text-[14px] px-8 hover:opacity-95 transition",
						style: {
							fontFamily: "var(--fw-website-heading-font)",
							background: "var(--fw-website-primary-strong)",
							color: "var(--fw-website-secondary)"
						},
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
							background: "var(--fw-website-primary)",
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
							style: { color: "var(--fw-website-primary)" },
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
						children: "FerroWorks is opgericht als familiebedrijf en werkt nog steeds zo. Korte lijnen, persoonlijke betrokkenheid, Ã©Ã©n partner voor het volledige traject."
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
							background: "var(--fw-website-primary-strong)",
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
						onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
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
var FALLBACK_IMAGES = [
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
	const slideImg = slide.image || FALLBACK_IMAGES[Math.min(current, FALLBACK_IMAGES.length - 1)] || FALLBACK_IMAGES[0];
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
							style: { color: "var(--fw-website-primary)" },
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
							style: { background: i === current ? "var(--fw-website-primary)" : "#bbb" }
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
								background: "var(--fw-website-primary-strong)",
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
							onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
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
				background: open ? "var(--fw-website-primary)" : "none",
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
//#region src/theme/themeConfig.js
var FONT_OPTIONS = [
	{
		value: "default",
		label: "Default",
		stack: "\"Arial Black\", Arial, sans-serif",
		bodyStack: "system-ui, -apple-system, sans-serif"
	},
	{
		value: "inter",
		label: "Inter",
		stack: "\"Inter\", \"Segoe UI\", Arial, sans-serif",
		bodyStack: "\"Inter\", \"Segoe UI\", Arial, sans-serif"
	},
	{
		value: "poppins",
		label: "Poppins",
		stack: "\"Poppins\", \"Segoe UI\", Arial, sans-serif",
		bodyStack: "\"Poppins\", \"Segoe UI\", Arial, sans-serif"
	},
	{
		value: "montserrat",
		label: "Montserrat",
		stack: "\"Montserrat\", \"Segoe UI\", Arial, sans-serif",
		bodyStack: "\"Montserrat\", \"Segoe UI\", Arial, sans-serif"
	},
	{
		value: "oswald",
		label: "Oswald",
		stack: "\"Oswald\", \"Arial Narrow\", sans-serif",
		bodyStack: "\"Inter\", \"Segoe UI\", Arial, sans-serif"
	},
	{
		value: "playfair",
		label: "Playfair Display",
		stack: "\"Playfair Display\", Georgia, serif",
		bodyStack: "\"Source Sans 3\", \"Segoe UI\", Arial, sans-serif"
	}
];
var DEFAULT_THEME_SETTINGS = {
	dashboardFont: "default",
	websiteFont: "default",
	dashboardPrimaryColor: "#c8d400",
	dashboardSecondaryColor: "#1c1c1c",
	websitePrimaryColor: "#c8d400",
	websiteSecondaryColor: "#1c1c1c"
};
function getFontOption(value) {
	return FONT_OPTIONS.find((item) => item.value === value) || FONT_OPTIONS[0];
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
var DEFAULT_LOCALIZATION_SETTINGS = {
	enabled: false,
	defaultLocale: "nl",
	locales: ["nl", "en"],
	localizedContent: { en: {} }
};
function getLocalizationSettings(websiteSettings = {}) {
	return {
		...DEFAULT_LOCALIZATION_SETTINGS,
		...websiteSettings.localization || {},
		localizedContent: {
			...DEFAULT_LOCALIZATION_SETTINGS.localizedContent,
			...websiteSettings.localization?.localizedContent || {}
		}
	};
}
function mergeWebsiteSettings(websiteSettings = {}) {
	return {
		...websiteSettings,
		theme: {
			...DEFAULT_THEME_SETTINGS,
			...websiteSettings.theme || {}
		},
		localization: getLocalizationSettings(websiteSettings)
	};
}
function getLocalizedSectionValue(cms, locale, sectionKey) {
	if (locale === "nl") return structuredClone(cms[sectionKey]);
	const localizedCms = localizeCmsContent({
		...cms,
		websiteSettings: mergeWebsiteSettings(cms.websiteSettings || {})
	}, locale);
	return structuredClone(localizedCms?.[sectionKey]);
}
function buildLocalizedWebsiteSettings(baseSettings, locale, sectionKey, value) {
	const nextWebsiteSettings = mergeWebsiteSettings(baseSettings || {});
	nextWebsiteSettings.localization = getLocalizationSettings(nextWebsiteSettings);
	nextWebsiteSettings.localization.localizedContent = {
		...nextWebsiteSettings.localization.localizedContent || {},
		[locale]: {
			...nextWebsiteSettings.localization.localizedContent?.[locale] || {},
			[sectionKey]: value
		}
	};
	return nextWebsiteSettings;
}
function PreviewCmsProvider({ cms, children }) {
	const previewValue = useMemo(() => ({
		cms,
		rawCms: cms,
		updateCms: async () => false,
		resetCms: async () => {},
		refreshCms: async () => {},
		loading: false,
		error: ""
	}), [cms]);
	return /* @__PURE__ */ jsx(CmsContext.Provider, {
		value: previewValue,
		children
	});
}
function LocaleToggle({ enabled, locale, onChange }) {
	return /* @__PURE__ */ jsx("div", {
		style: {
			display: "inline-flex",
			gap: "8px",
			alignItems: "center",
			flexWrap: "wrap"
		},
		children: ["nl", "en"].map((item) => /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: () => enabled && onChange(item),
			disabled: !enabled,
			style: {
				padding: "9px 14px",
				borderRadius: "999px",
				border: "none",
				background: locale === item ? "#1c1c1c" : "#f2f2f2",
				color: locale === item ? "#fff" : "#666",
				fontFamily: "var(--fw-dashboard-heading-font)",
				fontWeight: 900,
				fontSize: "11px",
				textTransform: "uppercase",
				cursor: enabled ? "pointer" : "not-allowed",
				opacity: enabled ? 1 : .55
			},
			children: item.toUpperCase()
		}, item))
	});
}
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
		transition: "border-color .15s",
		background: "#fff",
		fontFamily: "var(--fw-dashboard-body-font)"
	};
}
function FieldLabel({ children }) {
	return /* @__PURE__ */ jsx("label", {
		style: {
			display: "block",
			fontSize: "11px",
			fontFamily: "var(--fw-dashboard-heading-font)",
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
			e.target.style.borderColor = "var(--fw-dashboard-primary)";
		},
		onBlur: (e) => {
			e.target.style.borderColor = "#e0e0e0";
		}
	}) : /* @__PURE__ */ jsx("input", {
		type,
		value: value || "",
		onChange: (e) => onChange(e.target.value),
		placeholder,
		style: type === "color" ? {
			...shared,
			padding: "6px",
			height: "44px",
			cursor: "pointer",
			background: "#fff"
		} : shared,
		onFocus: (e) => {
			e.target.style.borderColor = "var(--fw-dashboard-primary)";
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
			e.target.style.borderColor = "var(--fw-dashboard-primary)";
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
				fontFamily: "var(--fw-dashboard-heading-font)",
				fontWeight: 900,
				fontSize: "16px",
				textTransform: "uppercase",
				color: "var(--fw-dashboard-secondary)",
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
			background: "var(--fw-dashboard-primary)",
			color: "var(--fw-dashboard-secondary)",
			border: "none",
			borderRadius: "6px",
			cursor: "pointer",
			fontFamily: "var(--fw-dashboard-heading-font)",
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
			fontFamily: "var(--fw-dashboard-heading-font)",
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
					stroke: "var(--fw-dashboard-primary)",
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
						background: "var(--fw-dashboard-primary)",
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
						fontFamily: "var(--fw-dashboard-heading-font)",
						fontWeight: 900,
						fontSize: "15px",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#fff" },
						children: "FERRO"
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-dashboard-primary)" },
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
							fontFamily: "var(--fw-dashboard-heading-font)",
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
								borderLeft: isActive ? "3px solid var(--fw-dashboard-primary)" : "3px solid transparent",
								color: isActive ? "var(--fw-dashboard-primary)" : "#666",
								fontFamily: "var(--fw-dashboard-heading-font)",
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
						fontFamily: "var(--fw-dashboard-heading-font)",
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
				fontFamily: "var(--fw-dashboard-heading-font)",
				fontWeight: 900,
				fontSize: "17px",
				textTransform: "uppercase",
				color: "var(--fw-dashboard-secondary)",
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
									fontFamily: "var(--fw-dashboard-heading-font)",
									fontSize: "11px",
									textTransform: "uppercase",
									color: "var(--fw-dashboard-secondary)",
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
								background: "var(--fw-dashboard-primary)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0
							},
							children: /* @__PURE__ */ jsx(SvgIcon, {
								d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
								size: 15,
								stroke: "var(--fw-dashboard-secondary)",
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
	const localizationSettings = getLocalizationSettings(cms.websiteSettings || {});
	const enabledLocales = localizationSettings.enabled ? localizationSettings.locales || ["nl", "en"] : ["nl"];
	const [locale, setLocale] = useState("nl");
	const blogItems = useMemo(() => getLocalizedSectionValue(cms, locale, "blog") || [], [cms, locale]);
	useEffect(() => {
		if (!enabledLocales.includes(locale)) setLocale("nl");
	}, [enabledLocales, locale]);
	const handleDelete = async (slug) => {
		if (locale !== "nl") {
			window.alert("Items aanmaken of verwijderen doe je in de Nederlandse basiscontent. Gebruik EN alleen voor vertalingen.");
			return;
		}
		if (!window.confirm("Weet je zeker dat je deze blogpost wilt verwijderen?")) return;
		await updateCms("blog", (cms.blog || []).filter((item) => (item.slug || item.id) !== slug));
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: "Blog",
		sub: locale === "nl" ? "Elke post heeft een eigen create- en editpagina" : "Je bewerkt nu alleen de Engelse vertalingen van bestaande blogposts",
		action: /* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				gap: "12px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsx(LocaleToggle, {
				enabled: localizationSettings.enabled,
				locale,
				onChange: setLocale
			}), locale === "nl" ? /* @__PURE__ */ jsx(Link, {
				to: "/admin/blog/new",
				style: { textDecoration: "none" },
				children: /* @__PURE__ */ jsx(PrimaryButton, {
					type: "button",
					children: "Nieuwe blogpost"
				})
			}) : null]
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
		blogItems.map((post) => /* @__PURE__ */ jsxs("div", {
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
		!blogItems.length ? /* @__PURE__ */ jsx("div", {
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
	const localizationSettings = getLocalizationSettings(cms.websiteSettings || {});
	const enabledLocales = localizationSettings.enabled ? localizationSettings.locales || ["nl", "en"] : ["nl"];
	const [locale, setLocale] = useState("nl");
	const serviceItems = useMemo(() => getLocalizedSectionValue(cms, locale, "diensten") || [], [cms, locale]);
	useEffect(() => {
		if (!enabledLocales.includes(locale)) setLocale("nl");
	}, [enabledLocales, locale]);
	const handleDelete = async (slug) => {
		if (locale !== "nl") {
			window.alert("Items aanmaken of verwijderen doe je in de Nederlandse basiscontent. Gebruik EN alleen voor vertalingen.");
			return;
		}
		if (!window.confirm("Weet je zeker dat je deze dienst wilt verwijderen?")) return;
		await updateCms("diensten", (cms.diensten || []).filter((item) => item.id !== slug));
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: "Diensten",
		sub: locale === "nl" ? "Elke dienst heeft een eigen create- en editpagina" : "Je bewerkt nu alleen de Engelse vertalingen van bestaande diensten",
		action: /* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				gap: "12px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsx(LocaleToggle, {
				enabled: localizationSettings.enabled,
				locale,
				onChange: setLocale
			}), locale === "nl" ? /* @__PURE__ */ jsx(Link, {
				to: "/admin/diensten/new",
				style: { textDecoration: "none" },
				children: /* @__PURE__ */ jsx(PrimaryButton, {
					type: "button",
					children: "Nieuwe dienst"
				})
			}) : null]
		})
	}), /* @__PURE__ */ jsxs(Card, { children: [serviceItems.map((item) => /* @__PURE__ */ jsxs("div", {
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
	}, item.id)), !serviceItems.length ? /* @__PURE__ */ jsx("div", {
		style: {
			padding: "24px",
			color: "#999"
		},
		children: "Nog geen diensten."
	}) : null] })] });
}
function SectorListPage() {
	const { cms, updateCms } = useCms();
	const localizationSettings = getLocalizationSettings(cms.websiteSettings || {});
	const enabledLocales = localizationSettings.enabled ? localizationSettings.locales || ["nl", "en"] : ["nl"];
	const [locale, setLocale] = useState("nl");
	const sectorItems = useMemo(() => getLocalizedSectionValue(cms, locale, "sectoren") || [], [cms, locale]);
	useEffect(() => {
		if (!enabledLocales.includes(locale)) setLocale("nl");
	}, [enabledLocales, locale]);
	const handleDelete = async (slug) => {
		if (locale !== "nl") {
			window.alert("Items aanmaken of verwijderen doe je in de Nederlandse basiscontent. Gebruik EN alleen voor vertalingen.");
			return;
		}
		if (!window.confirm("Weet je zeker dat je deze sector wilt verwijderen?")) return;
		await updateCms("sectoren", (cms.sectoren || []).filter((item) => item.id !== slug));
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: "Sectoren",
		sub: locale === "nl" ? "Elke sector heeft een eigen create- en editpagina" : "Je bewerkt nu alleen de Engelse vertalingen van bestaande sectoren",
		action: /* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				gap: "12px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsx(LocaleToggle, {
				enabled: localizationSettings.enabled,
				locale,
				onChange: setLocale
			}), locale === "nl" ? /* @__PURE__ */ jsx(Link, {
				to: "/admin/sectoren/new",
				style: { textDecoration: "none" },
				children: /* @__PURE__ */ jsx(PrimaryButton, {
					type: "button",
					children: "Nieuwe sector"
				})
			}) : null]
		})
	}), /* @__PURE__ */ jsxs(Card, { children: [sectorItems.map((item) => /* @__PURE__ */ jsxs("div", {
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
	}, item.id)), !sectorItems.length ? /* @__PURE__ */ jsx("div", {
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
	const localizationSettings = getLocalizationSettings(cms.websiteSettings || {});
	const enabledLocales = localizationSettings.enabled ? localizationSettings.locales || ["nl", "en"] : ["nl"];
	const [locale, setLocale] = useState("nl");
	const blogItems = useMemo(() => getLocalizedSectionValue(cms, locale, "blog") || [], [cms, locale]);
	const source = useMemo(() => blogItems.find((item) => (item.slug || item.id) === slug), [blogItems, slug]);
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
		if (!enabledLocales.includes(locale)) setLocale("nl");
	}, [enabledLocales, locale]);
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
		if (!editing && locale !== "nl") {
			window.alert("Nieuwe items maak je eerst in NL aan. Daarna kun je hier de EN-vertaling invullen.");
			return;
		}
		setSaving(true);
		const finalSlug = locale === "nl" ? makeSlug(form.slug || form.title, "blog-post") : source?.slug || source?.id || slug;
		const payload = {
			...form,
			slug: finalSlug
		};
		const items = editing ? blogItems.map((item) => (item.slug || item.id) === slug ? {
			...item,
			...payload,
			id: finalSlug
		} : item) : [...blogItems, {
			...payload,
			id: finalSlug
		}];
		const ok = locale === "nl" ? await updateCms("blog", items) : await updateCms("websiteSettings", buildLocalizedWebsiteSettings(cms.websiteSettings, locale, "blog", items));
		setSaving(false);
		if (ok) {
			setMessage("Blogpost opgeslagen.");
			navigate("/admin/blog");
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: editing ? "Blogpost Bewerken" : "Nieuwe Blogpost",
		sub: locale === "nl" ? "Titel, inhoud, rich text en SEO op een eigen pagina" : "Je bewerkt nu de Engelse vertaling van deze blogpost",
		action: /* @__PURE__ */ jsx(LocaleToggle, {
			enabled: localizationSettings.enabled,
			locale,
			onChange: setLocale
		})
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
	const localizationSettings = getLocalizationSettings(cms.websiteSettings || {});
	const enabledLocales = localizationSettings.enabled ? localizationSettings.locales || ["nl", "en"] : ["nl"];
	const [locale, setLocale] = useState("nl");
	const serviceItems = useMemo(() => getLocalizedSectionValue(cms, locale, "diensten") || [], [cms, locale]);
	const source = useMemo(() => serviceItems.find((item) => item.id === slug), [serviceItems, slug]);
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
		if (!enabledLocales.includes(locale)) setLocale("nl");
	}, [enabledLocales, locale]);
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
		if (!editing && locale !== "nl") {
			window.alert("Nieuwe items maak je eerst in NL aan. Daarna kun je hier de EN-vertaling invullen.");
			return;
		}
		setSaving(true);
		const finalSlug = locale === "nl" ? makeSlug(form.slug || form.title, "dienst") : source?.id || slug;
		const payload = {
			...form,
			id: finalSlug
		};
		const items = editing ? serviceItems.map((item) => item.id === slug ? payload : item) : [...serviceItems, payload];
		const ok = locale === "nl" ? await updateCms("diensten", items) : await updateCms("websiteSettings", buildLocalizedWebsiteSettings(cms.websiteSettings, locale, "diensten", items));
		setSaving(false);
		if (ok) {
			setMessage("Dienst opgeslagen.");
			navigate("/admin/diensten");
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: editing ? "Dienst Bewerken" : "Nieuwe Dienst",
		sub: locale === "nl" ? "Eigen pagina voor inhoud, checklist en SEO" : "Je bewerkt nu de Engelse vertaling van deze dienst",
		action: /* @__PURE__ */ jsx(LocaleToggle, {
			enabled: localizationSettings.enabled,
			locale,
			onChange: setLocale
		})
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
	const localizationSettings = getLocalizationSettings(cms.websiteSettings || {});
	const enabledLocales = localizationSettings.enabled ? localizationSettings.locales || ["nl", "en"] : ["nl"];
	const [locale, setLocale] = useState("nl");
	const sectorItems = useMemo(() => getLocalizedSectionValue(cms, locale, "sectoren") || [], [cms, locale]);
	const source = useMemo(() => sectorItems.find((item) => item.id === slug), [sectorItems, slug]);
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
		if (!enabledLocales.includes(locale)) setLocale("nl");
	}, [enabledLocales, locale]);
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
		if (!editing && locale !== "nl") {
			window.alert("Nieuwe items maak je eerst in NL aan. Daarna kun je hier de EN-vertaling invullen.");
			return;
		}
		setSaving(true);
		const finalSlug = locale === "nl" ? makeSlug(form.slug || form.naam, "sector") : source?.id || slug;
		const payload = {
			...form,
			id: finalSlug
		};
		const items = editing ? sectorItems.map((item) => item.id === slug ? payload : item) : [...sectorItems, payload];
		const ok = locale === "nl" ? await updateCms("sectoren", items) : await updateCms("websiteSettings", buildLocalizedWebsiteSettings(cms.websiteSettings, locale, "sectoren", items));
		setSaving(false);
		if (ok) {
			setMessage("Sector opgeslagen.");
			navigate("/admin/sectoren");
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
		title: editing ? "Sector Bewerken" : "Nieuwe Sector",
		sub: locale === "nl" ? "Eigen pagina voor sectorinformatie en SEO" : "Je bewerkt nu de Engelse vertaling van deze sector",
		action: /* @__PURE__ */ jsx(LocaleToggle, {
			enabled: localizationSettings.enabled,
			locale,
			onChange: setLocale
		})
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
function HomepageEditorPage() {
	const { cms, updateCms } = useCms();
	const localizationSettings = getLocalizationSettings(cms.websiteSettings || {});
	const enabledLocales = localizationSettings.enabled ? localizationSettings.locales || ["nl", "en"] : ["nl"];
	const [locale, setLocale] = useState("nl");
	const [hero, setHero] = useState(cms.hero || {});
	const [watFerna, setWatFerna] = useState(cms.watFerna || {});
	const [anders, setAnders] = useState(cms.anders || { items: [] });
	const [projecten, setProjecten] = useState(cms.projecten || []);
	const [faq, setFaq] = useState(cms.faq || []);
	const [statsText, setStatsText] = useState(() => (cms.stats || []).map((item) => `${item.number} | ${item.desc}`).join("\n"));
	const [saved, setSaved] = useState("");
	const [openSection, setOpenSection] = useState("hero");
	useEffect(() => {
		if (!enabledLocales.includes(locale)) setLocale("nl");
	}, [enabledLocales, locale]);
	useEffect(() => {
		setHero(getLocalizedSectionValue(cms, locale, "hero") || {});
		setWatFerna(getLocalizedSectionValue(cms, locale, "watFerna") || {});
		setAnders(getLocalizedSectionValue(cms, locale, "anders") || { items: [] });
		setProjecten(getLocalizedSectionValue(cms, locale, "projecten") || []);
		setFaq(getLocalizedSectionValue(cms, locale, "faq") || []);
		setStatsText((getLocalizedSectionValue(cms, locale, "stats") || []).map((item) => `${item.number} | ${item.desc}`).join("\n"));
	}, [cms, locale]);
	const parsedStats = useMemo(() => parseLines(statsText).map((line) => {
		const [number, ...descParts] = line.split("|");
		return {
			number: (number || "").trim(),
			desc: descParts.join("|").trim()
		};
	}), [statsText]);
	const previewCms = useMemo(() => ({
		...cms,
		hero,
		watFerna,
		anders,
		projecten,
		faq,
		stats: parsedStats
	}), [
		anders,
		cms,
		faq,
		hero,
		parsedStats,
		projecten,
		watFerna
	]);
	const saveSection = async (key, value) => {
		let ok = false;
		if (locale === "nl") ok = await updateCms(key, value);
		else ok = await updateCms("websiteSettings", buildLocalizedWebsiteSettings(cms.websiteSettings, locale, key, value));
		if (ok) {
			setSaved(key);
			window.setTimeout(() => setSaved(""), 1600);
		}
	};
	const sections = [
		{
			key: "hero",
			title: "Hero",
			preview: /* @__PURE__ */ jsx(HeroBanner, {}),
			note: "Bewerk headline, subtitel, CTA en hero-afbeelding. De preview hieronder gebruikt exact dezelfde hero-component als de live homepage.",
			fields: /* @__PURE__ */ jsxs("div", {
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
					}),
					/* @__PURE__ */ jsx(SaveBar, {
						saving: false,
						message: saved === "hero" ? "Hero opgeslagen." : "",
						onSave: () => saveSection("hero", hero)
					})
				]
			})
		},
		{
			key: "logos",
			title: "Client Logos",
			preview: /* @__PURE__ */ jsx(ClientLogosSection, {}),
			note: "Deze sectie gebruikt vaste logo-assets en heeft daarom alleen preview in deze editor."
		},
		{
			key: "watFerna",
			title: "Wat FerroWorks Voor Je Doet",
			preview: /* @__PURE__ */ jsx(WatFernaSection, {}),
			fields: /* @__PURE__ */ jsxs("div", {
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
					}),
					/* @__PURE__ */ jsx(SaveBar, {
						saving: false,
						message: saved === "watFerna" ? "Sectie opgeslagen." : "",
						onSave: () => saveSection("watFerna", watFerna)
					})
				]
			})
		},
		{
			key: "anders",
			title: "Wat Ons Anders Maakt",
			preview: /* @__PURE__ */ jsx(WatOnsAndersMaakt, {}),
			fields: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gap: "16px"
				},
				children: [
					(anders.items || []).map((item, index) => /* @__PURE__ */ jsx(Card, {
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
					}, index)),
					/* @__PURE__ */ jsx(ImageUpload, {
						label: "Sectie afbeelding",
						value: anders.image || "",
						onChange: (value) => setAnders((prev) => ({
							...prev,
							image: value
						}))
					}),
					/* @__PURE__ */ jsx(SaveBar, {
						saving: false,
						message: saved === "anders" ? "Sectie opgeslagen." : "",
						onSave: () => saveSection("anders", anders)
					})
				]
			})
		},
		{
			key: "stats",
			title: "Stats",
			preview: /* @__PURE__ */ jsx(StatsSection, {}),
			fields: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gap: "16px"
				},
				children: [/* @__PURE__ */ jsx(FormField, {
					label: "Één item per regel in formaat: getal | omschrijving",
					value: statsText,
					onChange: setStatsText,
					multiline: true,
					rows: 6
				}), /* @__PURE__ */ jsx(SaveBar, {
					saving: false,
					message: saved === "stats" ? "Stats opgeslagen." : "",
					onSave: () => saveSection("stats", parsedStats)
				})]
			})
		},
		{
			key: "sectoren",
			title: "Sectoren Highlight",
			preview: /* @__PURE__ */ jsx(OnzeSectoren, {}),
			note: "De inhoud van deze cards komt uit de sectorencollectie. Pas de teksten aan via Collections → Sectoren."
		},
		{
			key: "projecten",
			title: "Projecten Slider",
			preview: /* @__PURE__ */ jsx(ProjectenSlider, {}),
			fields: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gap: "16px"
				},
				children: [projecten.map((project, index) => /* @__PURE__ */ jsx(Card, {
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
				}, index)), /* @__PURE__ */ jsx(SaveBar, {
					saving: false,
					message: saved === "projecten" ? "Projecten opgeslagen." : "",
					onSave: () => saveSection("projecten", projecten)
				})]
			})
		},
		{
			key: "cta",
			title: "Uw Project In Goede Handen",
			preview: /* @__PURE__ */ jsx(UwProjectSection, {}),
			note: "Deze CTA-sectie is nog statisch opgebouwd. Ik kan die in een volgende stap ook CMS-beheerbaar maken als je wilt."
		},
		{
			key: "faq",
			title: "FAQ",
			preview: /* @__PURE__ */ jsx(FaqSection, {}),
			fields: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gap: "16px"
				},
				children: [faq.map((item, index) => /* @__PURE__ */ jsx(Card, {
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
				}, index)), /* @__PURE__ */ jsx(SaveBar, {
					saving: false,
					message: saved === "faq" ? "FAQ opgeslagen." : "",
					onSave: () => saveSection("faq", faq)
				})]
			})
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "grid",
			gap: "24px"
		},
		children: [
			/* @__PURE__ */ jsx(SectionHeader, {
				title: "Homepage",
				sub: "Bekijk eerst de echte sectie-preview. Klik daarna op edit om alleen dat blok te wijzigen.",
				action: /* @__PURE__ */ jsx(LocaleToggle, {
					enabled: localizationSettings.enabled,
					locale,
					onChange: setLocale
				})
			}),
			!localizationSettings.enabled ? /* @__PURE__ */ jsx(Card, {
				style: {
					padding: "18px",
					background: "#fffbe6",
					boxShadow: "none",
					border: "1px solid #f4e5a7"
				},
				children: /* @__PURE__ */ jsx("div", {
					style: {
						color: "#7c6200",
						fontSize: "13px",
						lineHeight: 1.6
					},
					children: "Meertaligheid staat uit. Je bewerkt nu alleen de Nederlandse basiscontent. Zet dit aan in Settings om ook aparte EN-content te beheren."
				})
			}) : null,
			sections.map((section) => /* @__PURE__ */ jsxs(Card, {
				style: { overflow: "hidden" },
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							padding: "18px 22px",
							borderBottom: "1px solid #f0f0f0",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: "16px",
							flexWrap: "wrap"
						},
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontFamily: "var(--fw-dashboard-heading-font)",
								fontWeight: 900,
								fontSize: "12px",
								textTransform: "uppercase",
								color: "#1c1c1c"
							},
							children: section.title
						}), section.note ? /* @__PURE__ */ jsx("div", {
							style: {
								color: "#888",
								fontSize: "12px",
								marginTop: "4px"
							},
							children: section.note
						}) : null] }), section.fields ? /* @__PURE__ */ jsx(SecondaryButton, {
							type: "button",
							onClick: () => setOpenSection((prev) => prev === section.key ? "" : section.key),
							children: openSection === section.key ? "Sluit editor" : "Edit section"
						}) : null]
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							background: "#f5f6f7",
							padding: "18px"
						},
						children: /* @__PURE__ */ jsx("div", {
							style: {
								background: "#fff",
								borderRadius: "10px",
								overflow: "hidden",
								border: "1px solid #ececec"
							},
							children: /* @__PURE__ */ jsx(PreviewCmsProvider, {
								cms: previewCms,
								children: section.preview
							})
						})
					}),
					section.fields && openSection === section.key ? /* @__PURE__ */ jsx("div", {
						style: { padding: "0 22px 22px" },
						children: section.fields
					}) : null
				]
			}, section.key))
		]
	});
}
function AboutPage() {
	const { cms, updateCms } = useCms();
	const localizationSettings = getLocalizationSettings(cms.websiteSettings || {});
	const enabledLocales = localizationSettings.enabled ? localizationSettings.locales || ["nl", "en"] : ["nl"];
	const [locale, setLocale] = useState("nl");
	const [overOns, setOverOns] = useState(cms.overOns || {});
	const [saved, setSaved] = useState("");
	useEffect(() => {
		if (!enabledLocales.includes(locale)) setLocale("nl");
	}, [enabledLocales, locale]);
	useEffect(() => {
		setOverOns(getLocalizedSectionValue(cms, locale, "overOns") || {});
	}, [cms, locale]);
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
		if (locale === "nl" ? await updateCms("overOns", overOns) : await updateCms("websiteSettings", buildLocalizedWebsiteSettings(cms.websiteSettings, locale, "overOns", overOns))) {
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
	const localizationSettings = getLocalizationSettings(cms.websiteSettings || {});
	const enabledLocales = localizationSettings.enabled ? localizationSettings.locales || ["nl", "en"] : ["nl"];
	const [locale, setLocale] = useState("nl");
	const [pages, setPages] = useState(cms.pages || []);
	const [activeKey, setActiveKey] = useState((cms.pages || [])[0]?.key || "");
	const [saved, setSaved] = useState("");
	useEffect(() => {
		if (!enabledLocales.includes(locale)) setLocale("nl");
	}, [enabledLocales, locale]);
	useEffect(() => {
		const localizedPages = getLocalizedSectionValue(cms, locale, "pages") || [];
		setPages(localizedPages);
		if (!localizedPages.some((item) => item.key === activeKey)) setActiveKey(localizedPages[0]?.key || "");
	}, [
		activeKey,
		cms,
		locale
	]);
	const activePage = pages.find((item) => item.key === activeKey) || pages[0];
	const updatePage = (field, value) => {
		setPages((prev) => prev.map((item) => item.key === activePage.key ? {
			...item,
			[field]: value
		} : item));
	};
	const save = async () => {
		if (locale === "nl" ? await updateCms("pages", pages) : await updateCms("websiteSettings", buildLocalizedWebsiteSettings(cms.websiteSettings, locale, "pages", pages))) {
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
		children: [/* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx(SectionHeader, {
				title: "Pages",
				sub: "SEO, indexatie en statische pagina-inhoud"
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					gap: "12px",
					alignItems: "center",
					marginBottom: "18px"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						color: "#888",
						fontSize: "12px",
						lineHeight: 1.6
					},
					children: localizationSettings.enabled ? "Kies of je Nederlandse of Engelse paginacontent wilt bewerken." : "Meertaligheid staat uit. Alleen Nederlandse paginacontent is actief."
				}), /* @__PURE__ */ jsx(LocaleToggle, {
					enabled: localizationSettings.enabled,
					locale,
					onChange: setLocale
				})]
			}),
			/* @__PURE__ */ jsx(Card, { children: pages.map((page) => /* @__PURE__ */ jsxs("button", {
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
			}, page.key)) })
		] }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Card, {
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
	const [websiteSettings, setWebsiteSettings] = useState(mergeWebsiteSettings(cms.websiteSettings || {}));
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
		setWebsiteSettings(mergeWebsiteSettings(cms.websiteSettings || {}));
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
	const setThemeField = (key) => (value) => setWebsiteSettings((prev) => ({
		...prev,
		theme: {
			...DEFAULT_THEME_SETTINGS,
			...prev.theme || {},
			[key]: value
		}
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
	const resetThemeDefaults = () => {
		setWebsiteSettings((prev) => ({
			...prev,
			theme: { ...DEFAULT_THEME_SETTINGS }
		}));
		setSaved("Thema hersteld naar standaard. Klik nog op opslaan om dit te bewaren.");
		window.setTimeout(() => setSaved(""), 2200);
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
					id: "theme",
					label: "Theme"
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
						/* @__PURE__ */ jsxs(Card, {
							style: {
								padding: "18px",
								background: "#fafafa",
								boxShadow: "none"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "var(--fw-dashboard-heading-font)",
									fontWeight: 900,
									fontSize: "12px",
									textTransform: "uppercase",
									color: "#1c1c1c",
									marginBottom: "12px"
								},
								children: "Localization & internationalization"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gap: "14px"
								},
								children: [
									/* @__PURE__ */ jsx(CheckboxField, {
										label: "Meertalige website inschakelen (NL + EN)",
										checked: websiteSettings.localization?.enabled,
										onChange: (value) => setWebsiteSettings((prev) => ({
											...prev,
											localization: {
												...getLocalizationSettings(prev),
												enabled: value
											}
										}))
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											color: "#666",
											fontSize: "13px",
											lineHeight: 1.6
										},
										children: "Handig als je deze website verkoopt: laat meertaligheid uit voor enkelvoudige sites, of zet het aan om aparte Nederlandse en Engelse content te beheren in de contentpagina's."
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "12px",
											color: "#888"
										},
										children: ["Beschikbare locales: ", (websiteSettings.localization?.locales || ["nl", "en"]).map((item) => item.toUpperCase()).join(", ")]
									})
								]
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
				tab === "theme" ? /* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gap: "18px"
					},
					children: [/* @__PURE__ */ jsxs(Card, {
						style: {
							padding: "18px",
							background: "#fafafa",
							boxShadow: "none"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									gap: "12px",
									flexWrap: "wrap",
									marginBottom: "16px"
								},
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontFamily: "var(--fw-dashboard-heading-font)",
										fontWeight: 900,
										fontSize: "12px",
										textTransform: "uppercase",
										color: "#1c1c1c"
									},
									children: "Theme settings"
								}), /* @__PURE__ */ jsx(SecondaryButton, {
									type: "button",
									onClick: resetThemeDefaults,
									style: { padding: "9px 14px" },
									children: "Reset to default"
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								style: {
									color: "#666",
									fontSize: "13px",
									lineHeight: 1.6,
									marginBottom: "16px"
								},
								children: "Kies aparte fonts en kleuren voor het dashboard en de website. Reset zet alleen deze themavelden terug naar het standaard FerroWorks-thema."
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gap: "18px"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: "16px"
									},
									children: [/* @__PURE__ */ jsx(SelectField, {
										label: "Dashboard font",
										value: websiteSettings.theme?.dashboardFont || DEFAULT_THEME_SETTINGS.dashboardFont,
										onChange: setThemeField("dashboardFont"),
										options: FONT_OPTIONS.map((font) => ({
											value: font.value,
											label: font.label
										}))
									}), /* @__PURE__ */ jsx(SelectField, {
										label: "Website font",
										value: websiteSettings.theme?.websiteFont || DEFAULT_THEME_SETTINGS.websiteFont,
										onChange: setThemeField("websiteFont"),
										options: FONT_OPTIONS.map((font) => ({
											value: font.value,
											label: font.label
										}))
									})]
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "1fr 1fr 1fr 1fr",
										gap: "16px"
									},
									children: [
										/* @__PURE__ */ jsx(FormField, {
											label: "Dashboard primary",
											value: websiteSettings.theme?.dashboardPrimaryColor || "",
											onChange: setThemeField("dashboardPrimaryColor"),
											type: "color"
										}),
										/* @__PURE__ */ jsx(FormField, {
											label: "Dashboard secondary",
											value: websiteSettings.theme?.dashboardSecondaryColor || "",
											onChange: setThemeField("dashboardSecondaryColor"),
											type: "color"
										}),
										/* @__PURE__ */ jsx(FormField, {
											label: "Website primary",
											value: websiteSettings.theme?.websitePrimaryColor || "",
											onChange: setThemeField("websitePrimaryColor"),
											type: "color"
										}),
										/* @__PURE__ */ jsx(FormField, {
											label: "Website secondary",
											value: websiteSettings.theme?.websiteSecondaryColor || "",
											onChange: setThemeField("websiteSecondaryColor"),
											type: "color"
										})
									]
								})]
							})
						]
					}), /* @__PURE__ */ jsx(SaveBar, {
						saving: false,
						message: saved,
						onSave: saveWebsite
					})]
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
					children: /* @__PURE__ */ jsx(HomepageEditorPage, {})
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
export { api as A, over_ons2_default as C, useCms as D, CmsProvider as E, localizePath as F, isLocalizationEnabled as M, getCanonicalPathname as N, LanguageProvider as O, getLocaleFromPathname as P, over_ons3_default as S, hero_background_default as T, StatsSection as _, RichTextContent as a, ClientLogosSection as b, Offshore_constructie_300x190_default as c, Afwerking_staalconstructie_met_natlak_300x225_default as d, UwProjectSection as f, OnzeSectoren as g, about_us1_default as h, getFontOption as i, getActiveLocales as j, useLanguage as k, lascertificaat_verplicht_featured_300x158_default as l, about_us2_default as m, AuthProvider as n, FaqSection as o, about_us3_default as p, DEFAULT_THEME_SETTINGS as r, ProjectenSlider as s, AdminPage_exports as t, kwaliteitscontrole_lassen_featured_300x225_default as u, WatOnsAndersMaakt as v, HeroBanner as w, WatFernaSection as x, over_ons1_default as y };
