import fs from "node:fs/promises";
import path from "node:path";
import { getCmsPayload, getPublicSeoForPath } from "./cms.js";
import { DEFAULT_LOCALE, getCanonicalPathname, getLocaleFromPathname, localizePath } from "../i18n/i18n.js";
import { getActiveLocales } from "../i18n/content-localization.js";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function injectSeo(template, seo, publicSiteUrl, locale, pathname, alternateLocales = [DEFAULT_LOCALE]) {
  const title = `<title>${escapeHtml(seo.title)}</title>`;
  const meta = [
    `<meta name="description" content="${escapeHtml(seo.description || "")}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description || "")}" />`,
    `<meta property="og:type" content="${escapeHtml(seo.ogType || "website")}" />`,
    `<meta property="og:url" content="${escapeHtml(`${publicSiteUrl}${seo.canonical}`)}" />`,
    `<link rel="canonical" href="${escapeHtml(`${publicSiteUrl}${seo.canonical}`)}" />`,
    ...alternateLocales.map((item) => `<link rel="alternate" hreflang="${item}" href="${escapeHtml(`${publicSiteUrl}${localizePath(getCanonicalPathname(pathname), item)}`)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(`${publicSiteUrl}${localizePath(getCanonicalPathname(pathname), DEFAULT_LOCALE)}`)}" />`,
  ];

  if (Array.isArray(seo.structuredData) && seo.structuredData.length > 0) {
    meta.push(
      ...seo.structuredData.map(
        (item) => `<script type="application/ld+json">${escapeJson(item)}</script>`,
      ),
    );
  }

  return template
    .replace(/<html([^>]*)lang="[^"]*"/, `<html$1lang="${escapeHtml(locale)}"`)
    .replace(/<title>.*?<\/title>/, title)
    .replace("</head>", `${meta.join("")}</head>`);
}

function buildAnalyticsHead(cms) {
  const website = cms.websiteSettings || {};
  const snippets = [];

  if (website.googleAnalyticsId) {
    snippets.push(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(website.googleAnalyticsId)}"></script>`,
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config','${escapeHtml(website.googleAnalyticsId)}');</script>`,
    );
  }

  if (website.googleTagManagerId) {
    snippets.push(
      `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${escapeHtml(website.googleTagManagerId)}');</script>`,
    );
  }

  if (website.metaPixelId) {
    snippets.push(
      `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${escapeHtml(website.metaPixelId)}');fbq('track','PageView');</script>`,
    );
  }

  if (website.linkedInInsightTagId) {
    snippets.push(
      `<script type="text/javascript">_linkedin_partner_id='${escapeHtml(website.linkedInInsightTagId)}';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);</script><script type="text/javascript">(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s);})(window.lintrk);</script>`,
    );
  }

  return snippets.join("");
}

function buildAnalyticsBody(cms) {
  const website = cms.websiteSettings || {};
  const snippets = [];

  if (website.googleTagManagerId) {
    snippets.push(
      `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${escapeHtml(website.googleTagManagerId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
    );
  }

  if (website.metaPixelId) {
    snippets.push(
      `<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${escapeHtml(website.metaPixelId)}&ev=PageView&noscript=1" /></noscript>`,
    );
  }

  return snippets.join("");
}

export async function renderPublicDocument({
  url,
  templatePath,
  serverEntryPath,
  publicSiteUrl,
}) {
  const [template, cms, seo, serverEntry] = await Promise.all([
    fs.readFile(templatePath, "utf8"),
    getCmsPayload(),
    getPublicSeoForPath(url),
    import(serverEntryPath),
  ]);

  const { html } = serverEntry.render(url, cms);
  const withMarkup = template.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div><script>window.__INITIAL_CMS__=${escapeJson(cms)};</script>`,
  );
  const locale = getLocaleFromPathname(url);
  const alternateLocales = seo.alternates?.length ? seo.alternates : getActiveLocales(cms.websiteSettings || {});
  const withSeo = injectSeo(withMarkup, seo, publicSiteUrl, seo.locale || locale, url, alternateLocales);
  const extraHeadHtml = cms.websiteSettings?.extraHeadHtml || "";
  const withHead = withSeo.replace("</head>", `${buildAnalyticsHead(cms)}${extraHeadHtml}</head>`);
  return withHead.replace("<body>", `<body>${buildAnalyticsBody(cms)}`);
}
