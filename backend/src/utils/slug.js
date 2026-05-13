import slugify from "slugify";

export function toSlug(value, fallback = "item") {
  return slugify(value || fallback, {
    lower: true,
    strict: true,
    trim: true,
  });
}
