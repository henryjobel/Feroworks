import path from "node:path";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import { MediaAsset } from "../lib/schemas.js";

export function getUploadDir() {
  return path.isAbsolute(env.UPLOAD_DIR)
    ? env.UPLOAD_DIR
    : path.resolve(process.cwd(), env.UPLOAD_DIR);
}

function getPublicUrl(filename) {
  const relativeUrl = `/uploads/${filename}`;
  if (!env.PUBLIC_UPLOAD_BASE_URL) {
    return relativeUrl;
  }

  return `${env.PUBLIC_UPLOAD_BASE_URL.replace(/\/$/, "")}${relativeUrl}`;
}

function createSafeFilename(originalName) {
  const extension = path.extname(originalName).toLowerCase();
  const basename = path
    .basename(originalName, extension)
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${Date.now()}-${crypto.randomUUID()}-${basename || "upload"}${extension}`;
}

export async function saveUploadedFile(file, kind = "generic") {
  const safeName = createSafeFilename(file.originalname);

  return MediaAsset.create({
    kind,
    filename: safeName,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    storagePath: `mongodb://media-assets/${safeName}`,
    publicUrl: getPublicUrl(safeName),
    data: file.buffer,
  });
}

export async function findUploadedFile(filename) {
  return MediaAsset.findOne({ filename });
}

export function normalizeImageValue(value) {
  return typeof value === "string" ? value : null;
}
