import { getActiveLocales, localizeCmsContent } from "../i18n/content-localization.js";
import { localizePath } from "../i18n/i18n.js";
import { getCmsPayload } from "./cms.js";

export async function buildSitemap(siteUrl) {
  const rawCms = await getCmsPayload();
  const locales = getActiveLocales(rawCms.websiteSettings || {});
  const urls = locales.flatMap((locale) => {
    const cms = localizeCmsContent(rawCms, locale);
    const staticPaths = [
      localizePath("/", locale),
      localizePath("/over-ons", locale),
      localizePath("/diensten", locale),
      localizePath("/sectoren", locale),
      localizePath("/blog", locale),
      localizePath("/contact", locale),
      ...(cms.pages || [])
        .filter((item) => item.isIndexed && !["/", localizePath("/over-ons", locale), localizePath("/diensten", locale), localizePath("/sectoren", locale), localizePath("/blog", locale), localizePath("/contact", locale)].includes(item.path))
        .map((item) => item.path),
      ...cms.diensten.map((item) => localizePath(`/diensten/${item.id}`, locale)),
      ...cms.blog.map((item) => localizePath(`/blog/${item.slug}`, locale)),
    ];

    return staticPaths;
  });

  const body = urls
    .map(
      (url) => `<url><loc>${siteUrl}${url}</loc><changefreq>weekly</changefreq></url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}
