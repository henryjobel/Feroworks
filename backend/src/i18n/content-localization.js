import { DEFAULT_LOCALE } from "./i18n.js";

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function getItemIdentifier(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  return item.key ?? item.id ?? item.slug ?? item.path ?? item.title ?? item.name ?? null;
}

function mergeLocalizedValue(baseValue, overlayValue) {
  if (overlayValue === undefined) {
    return baseValue;
  }

  if (Array.isArray(baseValue) && Array.isArray(overlayValue)) {
    const keyed = new Map();
    baseValue.forEach((item, index) => {
      const identifier = getItemIdentifier(item);
      if (identifier) {
        keyed.set(identifier, { item, index });
      }
    });

    return baseValue.map((item, index) => {
      const overlayItem = (() => {
        const identifier = getItemIdentifier(item);
        if (identifier && keyed.has(identifier)) {
          return overlayValue.find((candidate) => getItemIdentifier(candidate) === identifier);
        }
        return overlayValue[index];
      })();

      return mergeLocalizedValue(item, overlayItem);
    });
  }

  if (isPlainObject(baseValue) && isPlainObject(overlayValue)) {
    const result = { ...baseValue };
    for (const [key, value] of Object.entries(overlayValue)) {
      result[key] = mergeLocalizedValue(baseValue?.[key], value);
    }
    return result;
  }

  return overlayValue;
}

const EN_CONTENT_OVERLAY = {
  site: {
    tagline: "Metalwork",
    metaTitle: "FerroWorks - Custom Metalwork in Steel, Stainless Steel & Aluminium",
    metaDesc: "FerroWorks delivers custom metal constructions for industry, construction and architecture. Engineering, production, coating and installation under one roof.",
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
      "Design, production & installation",
    ],
  },
  stats: [
    { desc: "years of experience in custom metalwork" },
    { desc: "materials: Steel, Stainless Steel & Aluminium" },
    { desc: "in-house production, no subcontractors" },
    { desc: "from design and engineering to installation" },
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
      "Transparent in costs and planning.",
    ],
  },
  anders: {
    items: [
      {
        title: "LARGE ENOUGH TO TAKE THE LEAD",
        desc: "We have the capacity and expertise to deliver technical metal projects from start to finish.",
      },
      {
        title: "SMALL ENOUGH TO SWITCH QUICKLY",
        desc: "Direct contact, fast communication and flexibility in your planning.",
      },
      {
        title: "PERSONAL ENOUGH TO THINK AHEAD",
        desc: "We advise, optimise and make sure your project works from day one.",
      },
    ],
  },
  projecten: [
    {
      title: "MEASURING TUBES FOR A LIQUID TANK",
      desc: "For this client we produced custom measuring tubes for a liquid storage tank.",
    },
    {
      title: "STEEL STRUCTURE FOR AN OFFSHORE PLATFORM",
      desc: "Complex steel structure manufactured for an offshore platform, fully Lloyd's certified.",
    },
    {
      title: "PIPEWORK FOR PETROCHEMICALS",
      desc: "Custom piping and fittings delivered for a refinery in the petrochemical sector.",
    },
    {
      title: "TANK CONSTRUCTION FOR AN INDUSTRIAL COMPLEX",
      desc: "Rolled sections, roof sections and manholes produced for a major industrial tank project.",
    },
  ],
  faq: [
    {
      q: "WE ALREADY HAVE A REGULAR STEEL PARTNER. WHY SHOULD WE TALK TO FERROWORKS?",
      a: "Because FerroWorks focuses on the complex custom jobs that often fall outside the scope of a standard steel supplier. We work fast, accurately and fully in house.",
    },
    {
      q: "ARE YOU LARGE ENOUGH FOR OUR PROJECTS?",
      a: "With 16 specialised professionals and our own machine park, including a 6 x 3 metre water cutter, we are equipped for demanding industrial work.",
    },
    {
      q: "WHICH CERTIFICATIONS DOES FERROWORKS HAVE?",
      a: "FerroWorks is VCA certified and complies with EN-1090 for steel and aluminium constructions. We deliver the required documentation and quality assurance with every project.",
    },
    {
      q: "HOW RELIABLE IS THE 2 TO 4 WEEK LEAD TIME?",
      a: "That lead time is a commitment, not an estimate. Because everything happens in our own workshop we stay in control of planning and quality.",
    },
  ],
  overOns: {
    verhaal: {
      title1: "BUILT ON",
      title2: "CRAFTSMANSHIP",
      tekst1: "FerroWorks is a family business with more than 15 years of experience in custom metalwork. We guide projects from A to Z, from design and engineering to production, coating and installation on site.",
      tekst2: "Specialists in custom steel, stainless steel and aluminium for industry, construction, architecture, design and maritime applications.",
      tekst3: "Clear agreements, transparent costs and one point of contact from start to finish. That is how we work.",
    },
    watWeDoen: {
      items: [
        "Clear agreements, no surprises.",
        "Complete support from design to installation.",
        "Repair and maintenance on site.",
        "Advice and support on design and feasibility.",
        "One partner for the full process.",
        "Practical, buildable and well considered.",
        "Transparent in costs and planning.",
      ],
    },
    andersItems: [
      {
        title: "LARGE ENOUGH TO TAKE THE LEAD",
        desc: "We have the capacity and expertise to deliver technical metal projects from start to finish.",
      },
      {
        title: "SMALL ENOUGH TO SWITCH QUICKLY",
        desc: "Direct contact, fast communication and flexibility in your planning.",
      },
      {
        title: "PERSONAL ENOUGH TO THINK AHEAD",
        desc: "We advise, optimise and make sure your project works from day one.",
      },
    ],
    team: {
      title1: "CRAFTSMEN WITH",
      title2: "ONE GOAL",
      tekst1: "Our team includes specialised metalworkers, welders, engineers and project leads, each with deep knowledge of steel, stainless steel and aluminium.",
      tekst2: "We work closely with our clients from the first drawing to the final bolt on site. Always one point of contact, always personal.",
      items: [
        "More than 15 years of experience in custom metalwork",
        "Practical, buildable and well considered",
        "Repair and maintenance on site",
      ],
    },
  },
  diensten: [
    {
      title: "Engineering & Design",
      subtitle: "From the first sketch to an approved production drawing",
      excerpt: "Every project starts with a strong design. Our engineers translate your requirements into practical production drawings using modern CAD software.",
      checklist: "2D and 3D drawings (CAD/CAM)\nStructural calculations\nMaterial selection and cost advice\nFeasibility review\nApproval process with the client",
      body: "A strong metal project does not start in the workshop. It starts at the drawing table. At FerroWorks our engineering department turns your idea or specification into a fully developed production drawing.\n\nWhether you arrive with a detailed structural drawing, a rough paper sketch or only an idea, we work it out with you. We ask the right questions to understand the application, load, environment and end use.\n\nIf you work with an external structural engineer or architect, we coordinate directly with them. That way what looks good on paper is also practical to manufacture.",
    },
    {
      title: "In-house Production",
      subtitle: "Complete machine park, no outsourcing",
      excerpt: "Our modern workshop in Roosendaal is equipped for steel, stainless steel and aluminium processing in-house.",
      checklist: "Sawing and laser cutting\nDrilling, milling and shearing\nCertified welding (MIG/MAG, TIG, WIG)\nBending and rolling\nPrefab production and custom work in every batch size",
      body: "Our workshop is equipped with a complete machine park. We outsource nothing. Everything is produced in-house, from the first cut to the final weld.\n\nWhether it is one-off custom work or larger series, FerroWorks has the capacity and expertise to manufacture your project efficiently and accurately.\n\nOur certified welders work with steel, stainless steel and aluminium and handle all common welding methods, including MIG/MAG, TIG and WIG.",
    },
    {
      title: "Coating & Finishing",
      subtitle: "Multi-layer coating systems in line with ISO 12944",
      excerpt: "The right finish protects your construction and defines its appearance. FerroWorks advises on the best coating solution for every project.",
      checklist: "Blasting to Sa2.5\nZinc-rich or epoxy primer\nWet paint for large structures\nPowder coating for series work\nStainless steel polishing\nGalvanising",
      body: "A coating is more than a layer of paint. It protects your investment. FerroWorks advises on the right system based on environment, load and expected service life.\n\nWe blast, prime and paint in-house. From zinc-rich primers for offshore applications to powder coating for architectural elements, we cover the full range.\n\nAll systems are applied in accordance with ISO 12944, the international standard for corrosion protection of steel structures.",
    },
    {
      title: "On-site Installation",
      subtitle: "Own certified installation team",
      excerpt: "Our installation team places your construction on site, from simple guardrails to complex steel structures at height.",
      checklist: "Own VCA-certified installation team\nInstallation of steel, stainless steel and aluminium\nCrane coordination and safety management\nConnection welding and on-site corrections\nFinal inspection and handover file",
      body: "Production is only complete once your construction is in the right place. Our own installation team assembles everything on site, from simple barriers to complex elevated steel structures.\n\nWe work VCA certified and follow all safety measures. Our team is trained for working at height, in confined spaces and on industrial sites.\n\nAfter installation we complete a final inspection and hand over the project documentation.",
    },
    {
      title: "Repair & Maintenance",
      subtitle: "Fast, skilled, without long waiting times",
      excerpt: "Steel structures wear, deform or get damaged. FerroWorks handles repairs and maintenance both in the workshop and on site.",
      checklist: "Weld repairs in steel, stainless steel and aluminium\nRepair of corrosion damage and coatings\nStructural reinforcement of existing constructions\nEmergency on-site repairs possible\nMaintenance contracts on request",
      body: "Steel structures wear out, deform or get damaged through use, corrosion or external forces. FerroWorks carries out repairs quickly and professionally, in the workshop or on site.\n\nWe assess the damage, advise on the best solution and solve it. From small weld repairs to structural reinforcement of existing constructions.\n\nHave an emergency? Call us directly. Urgent repairs on site are possible.",
    },
  ],
  sectoren: [
    {
      naam: "Construction & Utilities",
      tagline: "Steel structures, guardrails and prefab balconies for the construction sector",
      description: "Steel structures, standard guardrails and prefab balconies for construction and utility projects.",
      intro: "In construction and utilities FerroWorks delivers steel structures that meet the strictest standards. From support frames to prefab balconies, everything is CE certified in line with EN-1090.",
      items: "Steel structures and support frames\nStandard guardrails\nPrefab balconies and landings\nStairs, railings and escape stair structures\nFacade elements and steel window frames\nCE certified according to EN-1090",
    },
    {
      naam: "Industry",
      tagline: "Machine building, process installations and custom steelwork",
      description: "Machine building, custom steel structures, industrial installations and on-site welding work.",
      intro: "Industrial clients rely on FerroWorks for custom steel structures and process installations. We deliver quickly and accurately, including on site.",
      items: "Machine building and machine frames\nCustom steel constructions\nIndustrial installations and process frames\nOn-site welding work\nStainless steel for food and pharmaceutical industries\nSupport structures and mezzanine floors",
    },
    {
      naam: "Architecture & Design",
      tagline: "Design stairs, ornamental work and exterior custom work for architects",
      description: "Design stairs and interior and exterior custom work for architecture and design projects.",
      intro: "Architects and designers choose FerroWorks for custom metalwork that combines aesthetics and craftsmanship. From design stairs to unique facade panels.",
      items: "Design stairs in steel and stainless steel\nInterior and exterior custom work\nBalustrades and railings\nOrnamental work, gates and entrance structures\nFacade panels and cladding\nCoating and powder coating in every RAL colour",
    },
    {
      naam: "Maritime",
      tagline: "Yacht building, offshore structures and maritime coating",
      description: "Custom steel and aluminium constructions for yacht building and maritime applications.",
      intro: "Maritime conditions demand the best material and coating systems. FerroWorks delivers for yacht building, offshore and harbour infrastructure.",
      items: "Yacht building and ship interiors\nOffshore steel and stainless steel structures\nDeck equipment and handrails\nAluminium gangways and platforms\nMaritime coating (C5-M, ISO 12944)\nRepairs in harbour and on board",
    },
  ],
  blog: [
    {
      title: "Why weld quality control makes all the difference",
      category: "Craftsmanship",
      date: "8 April 2026",
      readTime: "4 min",
      excerpt: "In metalworking, welding is one of the most critical processes. A small welding defect can have major consequences for safety and service life. Discover how FerroWorks treats quality control as standard practice, not an exception.",
      body: "Weld quality control does not start at final inspection. It starts with every step in the process, from filler material selection to preparation of the base material.\n\nAt FerroWorks we work exclusively with certified welders who meet EN-1090 requirements. Every weld is visually inspected and, where required, tested with non-destructive methods.\n\nA small deviation in a weld can create major consequences under load. That is why we use strict procedures and documentation for every project.",
    },
    {
      title: "Offshore steel structures: requirements and challenges",
      category: "Offshore",
      date: "1 April 2026",
      readTime: "5 min",
      excerpt: "Offshore steelwork faces extreme conditions: salt water, high loads and constant mechanical stress. We explain which materials and coatings we use for durable offshore constructions.",
      body: "Offshore steel structures operate in one of the most aggressive environments imaginable: salt seawater, high wind loads and constant mechanical stress.\n\nFerroWorks delivers offshore structures in line with NORSOK and ISO 12944 class C5-M. We use certified materials and coating systems designed for the toughest maritime environments.\n\nFrom the engineering phase onward we account for corrosion protection, maintenance intervals and site accessibility.",
    },
    {
      title: "Wet paint vs powder coating: what suits your project?",
      category: "Finishing",
      date: "24 March 2026",
      readTime: "3 min",
      excerpt: "The choice between wet paint and powder coating affects both appearance and protection level. We compare the strengths and trade-offs of both methods.",
      body: "Wet paint and powder coating are both strong finishing methods for steel, but each has its own application range.\n\nWet paint is ideal for large structures that do not fit into an oven, for multi-layer coating systems and for aggressive environments. Powder coating is more durable, more environmentally friendly and gives a uniform finish.\n\nAt FerroWorks we always advise the most suitable method for your specific situation.",
    },
    {
      title: "Is a welding certificate mandatory? What to know about EN-1090",
      category: "Certification",
      date: "17 March 2026",
      readTime: "6 min",
      excerpt: "Since EN-1090 came into force, certification is mandatory for many steel structures. But what does that mean in practice, and when does it apply? FerroWorks explains it clearly.",
      body: "EN-1090 is the European standard for manufacturing steel and aluminium structures. Constructions that fall under CE marking requirements must be produced by a certified manufacturer.\n\nFerroWorks is certified in line with EN-1090-2 for execution class EXC2. This means our constructions meet strict European requirements for load-bearing steel structures.\n\nNot sure whether your project requires EN-1090 certification? Get in touch and we will advise you.",
    },
    {
      title: "From drawing to product: how our production process works",
      category: "Production",
      date: "10 March 2026",
      readTime: "4 min",
      excerpt: "How does a metal project move from CAD drawing to finished product? We walk through the FerroWorks process step by step, from intake and engineering to production, finishing and installation.",
      body: "Every FerroWorks project follows the same phases: intake, engineering, production, coating and installation. Because we manage everything in-house, we stay in control of quality and planning in every phase.\n\nAfter intake and drawing approval the product moves into the workshop. Our CNC machines handle precise cutting and machining, followed by welding, blasting and coating.\n\nThe final product is checked, stored and installed on site by our assembly team.",
    },
    {
      title: "Custom industrial steel: 5 common mistakes avoided",
      category: "Industry",
      date: "3 March 2026",
      readTime: "5 min",
      excerpt: "Industrial custom steelwork often goes wrong not because of bad intent, but because of missing knowledge or weak communication. We cover five common mistakes and how to avoid them.",
      body: "Mistake 1: involving the manufacturer too late. Do not wait until the drawing is finished. Bring FerroWorks in early for manufacturability advice.\n\nMistake 2: specifying unrealistic tolerances. Steel has tolerances. Make sure your drawing reflects what is achievable for the chosen production method.\n\nMistake 3: forgetting coating during design. Think about coating early, because accessibility, thickness and method affect the construction.\n\nMistake 4: ignoring installation. A structure that works in the workshop but is hard to place on site costs time and money.\n\nMistake 5: poor documentation. Clear drawings and specifications are the basis of a successful project.",
    },
  ],
  contact: {
    hero: {
      title1: "GET IN",
      title2: "TOUCH",
      subtitle: "Send your drawing or ask your question. We respond within 24 hours.",
    },
    openingstijden: "Monday - Friday: 07:30 - 17:00\nSaturday: By appointment\nSunday: Closed",
  },
  pages: [
    { key: "home", name: "Homepage", metaTitle: "FerroWorks - Custom Metalwork in Steel, Stainless Steel & Aluminium", metaDescription: "FerroWorks delivers custom metal constructions for industry, construction and architecture. Engineering, production, coating and installation under one roof." },
    { key: "about", name: "About", path: "/en/about", metaTitle: "About | FerroWorks", metaDescription: "Learn more about FerroWorks, our way of working and our craftsmanship in steel, stainless steel and aluminium." },
    { key: "services", name: "Services", path: "/en/services", metaTitle: "Services | FerroWorks", metaDescription: "Engineering, production, coating, installation and maintenance for custom metal projects." },
    { key: "sectors", name: "Sectors", path: "/en/sectors", metaTitle: "Sectors | FerroWorks", metaDescription: "Custom metalwork for construction, industry, architecture and maritime applications." },
    { key: "blog", name: "Blog", path: "/en/blog", metaTitle: "Blog | FerroWorks", metaDescription: "Knowledge articles, project stories and technical insights from FerroWorks." },
    { key: "contactPage", name: "Contact", path: "/en/contact", metaTitle: "Contact | FerroWorks", metaDescription: "Contact FerroWorks for advice, quotations or technical coordination.", heroTitle: "GET IN TOUCH", heroSubtitle: "Send your drawing or ask your question. We respond within 24 hours." },
    { key: "privacy", name: "Privacy Policy", path: "/en/privacy-policy", metaTitle: "Privacy Policy | FerroWorks", metaDescription: "Read how FerroWorks processes and protects personal data.", heroTitle: "PRIVACY POLICY", heroSubtitle: "Clear information about what data we process and why.", body: "<h2>1. Who we are</h2><p>FerroWorks processes personal data in the context of quotation requests, client communication and service delivery.</p><h2>2. What data we collect</h2><p>We process contact details, company details and information that you actively share with us through forms, email or phone contact.</p><h2>3. Why we use this data</h2><p>We use this data to answer requests, prepare quotations, carry out assignments and improve our services.</p><h2>4. Retention periods</h2><p>We do not store personal data longer than necessary for the purpose for which it was collected, unless a legal retention period applies.</p><h2>5. Your rights</h2><p>You can request access, correction or deletion of your personal data by contacting us using the details on this website.</p>" },
    { key: "terms", name: "Terms & Conditions", path: "/en/terms-and-conditions", metaTitle: "Terms & Conditions | FerroWorks", metaDescription: "The general terms and conditions of FerroWorks.", heroTitle: "TERMS & CONDITIONS", heroSubtitle: "The terms that apply to quotations, deliveries and assignments.", body: "<h2>1. Applicability</h2><p>These terms apply to all quotations, agreements and deliveries of FerroWorks.</p><h2>2. Quotations and assignments</h2><p>Quotations are non-binding unless explicitly stated otherwise. An assignment takes effect after written confirmation.</p><h2>3. Delivery and execution</h2><p>Delivery times are indicative. FerroWorks makes every effort to fulfil agreements carefully and professionally.</p><h2>4. Payment</h2><p>Invoices must be paid within the agreed payment term. Additional costs may be charged in case of delay.</p><h2>5. Liability</h2><p>Our liability is limited to direct damage and to the amount covered by our insurance or otherwise contractually agreed for the relevant case.</p>" },
  ],
};

export const CONTENT_OVERLAYS = {
  en: EN_CONTENT_OVERLAY,
};

export function getLocalizationConfig(websiteSettings = {}) {
  const config = websiteSettings?.localization || {};
  const locales = Array.isArray(config.locales) && config.locales.length > 0 ? config.locales : ["nl", "en"];
  return {
    enabled: Boolean(config.enabled),
    defaultLocale: config.defaultLocale || DEFAULT_LOCALE,
    locales,
    localizedContent: config.localizedContent || {},
  };
}

export function isLocalizationEnabled(websiteSettings = {}) {
  return getLocalizationConfig(websiteSettings).enabled;
}

export function getActiveLocales(websiteSettings = {}) {
  const config = getLocalizationConfig(websiteSettings);
  return config.enabled ? config.locales : [config.defaultLocale || DEFAULT_LOCALE];
}

export function localizeCmsContent(cms, locale = DEFAULT_LOCALE) {
  if (!cms) {
    return cms;
  }

  const localization = getLocalizationConfig(cms.websiteSettings || {});
  if (!localization.enabled || locale === localization.defaultLocale || locale === DEFAULT_LOCALE) {
    return cms;
  }

  const systemOverlay = CONTENT_OVERLAYS[locale] || {};
  const userOverlay = localization.localizedContent?.[locale] || {};
  return mergeLocalizedValue(mergeLocalizedValue(cms, systemOverlay), userOverlay);
}
