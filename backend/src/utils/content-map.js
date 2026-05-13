import { DEFAULT_CMS } from "./../../data/defaultContent.js";

export const SECTION_KEYS = [
  "hero",
  "stats",
  "watFerna",
  "anders",
  "projecten",
  "faq",
  "clientLogos",
  "sectorenHighlight",
  "uwProject",
  "overOns",
  "contact",
  "pages",
  "websiteSettings",
];

export function getDefaultSectionValue(key) {
  return structuredClone(DEFAULT_CMS[key]);
}

export function getDefaultCms() {
  return structuredClone(DEFAULT_CMS);
}
