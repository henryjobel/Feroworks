import { 
  AdminUser, 
  SiteSettings, 
  PageSectionContent, 
  Service, 
  Sector, 
  BlogPost,
  MediaAsset,
  LeadSubmission,
  NewsletterSubscription
} from "../lib/schemas.js";
import { getDefaultCms, getDefaultSectionValue, SECTION_KEYS } from "../utils/content-map.js";
import { toSlug } from "../utils/slug.js";
import { getActiveLocales, isLocalizationEnabled, localizeCmsContent } from "../i18n/content-localization.js";
import { getCanonicalPathname, getLocaleFromPathname, localizePath } from "../i18n/i18n.js";

function normalizeSectionValue(key, value) {
  if (value === undefined) {
    return getDefaultSectionValue(key);
  }
  return value;
}

function mapSiteSettings(siteSettings) {
  const defaults = getDefaultCms().site;
  if (!siteSettings) {
    return defaults;
  }

  return {
    naam: siteSettings.siteName ?? defaults.naam,
    tagline: siteSettings.tagline ?? defaults.tagline,
    tel: siteSettings.phone ?? defaults.tel,
    email: siteSettings.email ?? defaults.email,
    adres: siteSettings.address ?? defaults.adres,
    kvk: siteSettings.kvk ?? defaults.kvk,
    btw: siteSettings.btw ?? defaults.btw,
    website: siteSettings.website ?? defaults.website,
    linkedin: siteSettings.linkedin ?? defaults.linkedin,
    instagram: siteSettings.instagram ?? defaults.instagram,
    facebook: siteSettings.facebook ?? defaults.facebook,
    metaTitle: siteSettings.metaTitle ?? defaults.metaTitle,
    metaDesc: siteSettings.metaDescription ?? defaults.metaDesc,
  };
}

function mapService(service) {
  return {
    id: service.slug,
    nr: service.nr,
    title: service.title,
    subtitle: service.subtitle,
    excerpt: service.excerpt,
    checklist: service.checklist ?? "",
    body: service.body ?? "",
    image: service.imageUrl ?? null,
    seoTitle: service.seoTitle ?? "",
    seoDescription: service.seoDescription ?? "",
  };
}

function mapSector(sector) {
  return {
    id: sector.slug,
    nr: sector.nr,
    naam: sector.name,
    tagline: sector.tagline,
    description: sector.description,
    intro: sector.intro,
    items: sector.items ?? "",
    image: sector.imageUrl ?? null,
    seoTitle: sector.seoTitle ?? "",
    seoDescription: sector.seoDescription ?? "",
  };
}

function mapBlogPost(post) {
  return {
    id: post.slug,
    slug: post.slug,
    title: post.title,
    category: post.category,
    date: post.displayDate,
    readTime: post.readTime,
    status: post.status,
    featured: post.featured,
    excerpt: post.excerpt,
    body: post.body ?? "",
    image: post.imageUrl ?? null,
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
  };
}

export async function getCmsPayload() {
  const [siteSettings, sections, services, sectors, blogPosts] = await Promise.all([
    SiteSettings.findOne(),
    PageSectionContent.find(),
    Service.find({ isPublished: true }).sort({ sortOrder: 1 }),
    Sector.find({ isPublished: true }).sort({ sortOrder: 1 }),
    BlogPost.find({ isPublished: true }).sort({ featured: -1, sortOrder: 1, publishedAt: -1 }),
  ]);

  const defaults = getDefaultCms();
  const sectionMap = new Map(sections.map((section) => [section.key, section.value]));

  return {
    site: mapSiteSettings(siteSettings),
    hero: normalizeSectionValue("hero", sectionMap.get("hero")) ?? defaults.hero,
    stats: normalizeSectionValue("stats", sectionMap.get("stats")) ?? defaults.stats,
    watFerna: normalizeSectionValue("watFerna", sectionMap.get("watFerna")) ?? defaults.watFerna,
    anders: normalizeSectionValue("anders", sectionMap.get("anders")) ?? defaults.anders,
    projecten: normalizeSectionValue("projecten", sectionMap.get("projecten")) ?? defaults.projecten,
    faq: normalizeSectionValue("faq", sectionMap.get("faq")) ?? defaults.faq,
    clientLogos: normalizeSectionValue("clientLogos", sectionMap.get("clientLogos")) ?? defaults.clientLogos,
    sectorenHighlight: normalizeSectionValue("sectorenHighlight", sectionMap.get("sectorenHighlight")) ?? defaults.sectorenHighlight,
    uwProject: normalizeSectionValue("uwProject", sectionMap.get("uwProject")) ?? defaults.uwProject,
    overOns: normalizeSectionValue("overOns", sectionMap.get("overOns")) ?? defaults.overOns,
    contact: normalizeSectionValue("contact", sectionMap.get("contact")) ?? defaults.contact,
    pages: normalizeSectionValue("pages", sectionMap.get("pages")) ?? defaults.pages,
    websiteSettings: normalizeSectionValue("websiteSettings", sectionMap.get("websiteSettings")) ?? defaults.websiteSettings,
    diensten: services.map(mapService),
    sectoren: sectors.map(mapSector),
    blog: blogPosts.map(mapBlogPost),
  };
}

function getPageConfig(cms, pathname) {
  return (cms.pages || []).find((item) => item.path === pathname);
}

export async function getPublicSeoForPath(pathname) {
  const rawCms = await getCmsPayload();
  const localizationEnabled = isLocalizationEnabled(rawCms.websiteSettings || {});
  const locale = localizationEnabled ? getLocaleFromPathname(pathname) : "nl";
  const canonicalPath = getCanonicalPathname(pathname);
  const cms = localizationEnabled ? localizeCmsContent(rawCms, locale) : rawCms;
  const site = cms.site;
  const base = {
    title: site.metaTitle || `${site.naam} | Metaalmaatwerk`,
    description: site.metaDesc || "",
    canonical: localizePath(canonicalPath, locale),
    ogType: "website",
    structuredData: [],
    locale,
    alternates: getActiveLocales(rawCms.websiteSettings || {}),
  };

  if (canonicalPath === "/") {
    const page = getPageConfig(cms, localizePath("/", locale));
    return {
      ...base,
      title: page?.metaTitle || base.title,
      description: page?.metaDescription || base.description,
      structuredData: [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.naam,
          url: site.website?.startsWith("http") ? site.website : undefined,
          email: site.email,
          telephone: site.tel,
          address: site.adres,
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.naam,
          url: site.website?.startsWith("http") ? site.website : undefined,
        },
      ],
    };
  }

  if (canonicalPath === "/over-ons") {
    const page = getPageConfig(cms, localizePath("/over-ons", locale));
    return {
      ...base,
      title: page?.metaTitle || `Over Ons | ${site.naam}`,
      description: page?.metaDescription || cms.overOns?.verhaal?.tekst1 || base.description,
    };
  }

  if (canonicalPath === "/diensten") {
    const page = getPageConfig(cms, localizePath("/diensten", locale));
    return {
      ...base,
      title: page?.metaTitle || `Diensten | ${site.naam}`,
      description: page?.metaDescription || "Engineering, productie, coating, montage en onderhoud voor maatwerk metaalprojecten.",
    };
  }

  if (canonicalPath === "/sectoren") {
    const page = getPageConfig(cms, localizePath("/sectoren", locale));
    return {
      ...base,
      title: page?.metaTitle || `Sectoren | ${site.naam}`,
      description: page?.metaDescription || "Metaalmaatwerk voor bouw, industrie, architectuur en maritieme toepassingen.",
    };
  }

  if (canonicalPath === "/blog") {
    const page = getPageConfig(cms, localizePath("/blog", locale));
    return {
      ...base,
      title: page?.metaTitle || `Blog | ${site.naam}`,
      description: page?.metaDescription || "Kennisartikelen, projectverhalen en technische inzichten van FerroWorks.",
    };
  }

  if (canonicalPath === "/contact") {
    const page = getPageConfig(cms, localizePath("/contact", locale));
    return {
      ...base,
      title: page?.metaTitle || `Contact | ${site.naam}`,
      description: page?.metaDescription || cms.contact?.hero?.subtitle || "Neem contact op met FerroWorks.",
    };
  }

  const staticPage = getPageConfig(cms, localizePath(canonicalPath, locale));
  if (staticPage) {
    return {
      ...base,
      title: staticPage.metaTitle || base.title,
      description: staticPage.metaDescription || base.description,
    };
  }

  const serviceMatch = canonicalPath.match(/^\/diensten\/([^/]+)$/);
  if (serviceMatch) {
    const service = cms.diensten.find((item) => item.id === serviceMatch[1]);
    if (service) {
      return {
        ...base,
        title: service.seoTitle || `${service.title} | ${site.naam}`,
        description: service.seoDescription || service.excerpt || base.description,
        ogType: "article",
      };
    }
  }

  const blogMatch = canonicalPath.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const post = cms.blog.find((item) => item.slug === blogMatch[1]);
    if (post) {
      return {
        ...base,
        title: post.seoTitle || `${post.title} | ${site.naam}`,
        description: post.seoDescription || post.excerpt || base.description,
        ogType: "article",
        structuredData: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: {
              "@type": "Organization",
              name: site.naam,
            },
          },
        ],
      };
    }
  }

  return base;
}

export async function updateSiteSettings(site) {
  const existing = await SiteSettings.findOne();
  
  if (existing) {
    return SiteSettings.findByIdAndUpdate(
      existing._id,
      {
        siteName: site.naam,
        tagline: site.tagline,
        phone: site.tel,
        email: site.email,
        address: site.adres,
        kvk: site.kvk,
        btw: site.btw,
        website: site.website,
        linkedin: site.linkedin,
        instagram: site.instagram,
        facebook: site.facebook,
        metaTitle: site.metaTitle,
        metaDescription: site.metaDesc,
      },
      { new: true }
    );
  } else {
    return SiteSettings.create({
      siteName: site.naam,
      tagline: site.tagline,
      phone: site.tel,
      email: site.email,
      address: site.adres,
      kvk: site.kvk,
      btw: site.btw,
      website: site.website,
      linkedin: site.linkedin,
      instagram: site.instagram,
      facebook: site.facebook,
      metaTitle: site.metaTitle,
      metaDescription: site.metaDesc,
    });
  }
}

async function replaceSection(key, value) {
  const existing = await PageSectionContent.findOne({ key });
  
  if (existing) {
    return PageSectionContent.findByIdAndUpdate(existing._id, { value }, { new: true });
  } else {
    return PageSectionContent.create({ key, value });
  }
}

async function replaceServices(items) {
  await Service.deleteMany({});
  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  await Service.insertMany(
    items.map((item, index) => ({
      slug: toSlug(item.slug || item.id || item.title, `service-${index + 1}`),
      sortOrder: index,
      nr: item.nr,
      title: item.title,
      subtitle: item.subtitle,
      excerpt: item.excerpt,
      checklist: item.checklist ?? "",
      body: item.body ?? "",
      imageUrl: item.image || null,
      seoTitle: item.seoTitle || null,
      seoDescription: item.seoDescription || null,
      isPublished: item.status ? item.status !== "Concept" : true,
    }))
  );
}

async function replaceSectors(items) {
  await Sector.deleteMany({});
  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  await Sector.insertMany(
    items.map((item, index) => ({
      slug: toSlug(item.slug || item.id || item.naam, `sector-${index + 1}`),
      sortOrder: index,
      nr: item.nr,
      name: item.naam,
      tagline: item.tagline,
      description: item.description,
      intro: item.intro,
      items: item.items ?? "",
      imageUrl: item.image || null,
      seoTitle: item.seoTitle || null,
      seoDescription: item.seoDescription || null,
      isPublished: item.status ? item.status !== "Concept" : true,
    }))
  );
}

async function replaceBlogPosts(items) {
  await BlogPost.deleteMany({});
  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  await BlogPost.insertMany(
    items.map((item, index) => ({
      slug: toSlug(item.slug || item.id || item.title, `blog-${index + 1}`),
      sortOrder: index,
      title: item.title,
      category: item.category,
      displayDate: item.date,
      readTime: item.readTime ?? null,
      status: item.status ?? "Concept",
      featured: Boolean(item.featured),
      excerpt: item.excerpt,
      body: item.body ?? "",
      imageUrl: item.image || null,
      seoTitle: item.seoTitle || null,
      seoDescription: item.seoDescription || null,
      isPublished: (item.status ?? "Concept") === "Gepubliceerd",
    }))
  );
}

export async function updateCmsSection(key, value) {
  if (key === "site") {
    await updateSiteSettings(value);
    return;
  }

  if (key === "diensten") {
    await replaceServices(value);
    return;
  }

  if (key === "sectoren") {
    await replaceSectors(value);
    return;
  }

  if (key === "blog") {
    await replaceBlogPosts(value);
    return;
  }

  if (!SECTION_KEYS.includes(key)) {
    const error = new Error(`Unsupported CMS section: ${key}`);
    error.statusCode = 400;
    throw error;
  }

  await replaceSection(key, value);
}
