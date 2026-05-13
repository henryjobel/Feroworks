import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import fs from "node:fs";
import path from "node:path";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { leadsRouter } from "./routes/leads.js";
import { publicRouter } from "./routes/public.js";
import { findUploadedFile, getUploadDir } from "./services/media.js";
import { getCmsPayload } from "./services/cms.js";
import { buildSitemap } from "./services/sitemap.js";
import { renderPublicDocument } from "./services/ssr.js";

export function createApp() {
  const app = express();
  const uploadsDir = getUploadDir();
  const frontendDistDir = path.resolve(process.cwd(), "../frontend/dist");
  const frontendIndexFile = path.join(frontendDistDir, "index.html");
  const frontendServerBundle = path.resolve(process.cwd(), "../frontend/dist-server/entry-server.js");
  
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use("/uploads", express.static(uploadsDir));

  async function serveUploadedAsset(req, res, next) {
    try {
      const asset = await findUploadedFile(req.params.filename);
      if (!asset?.data) {
        return next();
      }

      res.setHeader("Content-Type", asset.mimeType);
      res.setHeader("Content-Length", asset.size);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.send(asset.data);
    } catch (error) {
      return next(error);
    }
  }

  app.get("/uploads/:filename", serveUploadedAsset);
  app.get("/api/uploads/:filename", serveUploadedAsset);
  if (fs.existsSync(frontendDistDir)) {
    app.use(express.static(frontendDistDir));
  }

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.get("/robots.txt", async (req, res, next) => {
    try {
      const cms = await getCmsPayload();
      const template = cms.websiteSettings?.robotsText || "User-agent: *\nAllow: /\nSitemap: {{siteUrl}}/sitemap.xml";
      const robotsText = template.replace(/\{\{siteUrl\}\}/g, env.PUBLIC_SITE_URL);
      res.type("text/plain").send(robotsText);
    } catch (error) {
      const fallback = `User-agent: *\nAllow: /\nSitemap: ${env.PUBLIC_SITE_URL}/sitemap.xml`;
      res.type("text/plain").send(fallback);
    }
  });

  app.get("/sitemap.xml", async (req, res, next) => {
    try {
      res.type("application/xml").send(await buildSitemap(env.PUBLIC_SITE_URL));
    } catch (error) {
      const urls = ["/", "/over-ons", "/diensten", "/sectoren", "/blog", "/contact"];
      const body = urls.map((url) => `<url><loc>${env.PUBLIC_SITE_URL}${url}</loc><changefreq>weekly</changefreq></url>`).join("");
      res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`);
    }
  });

  app.use("/api/auth", authRouter);
  app.use("/api/public", publicRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api", leadsRouter);

  if (fs.existsSync(frontendIndexFile)) {
    app.use(async (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }

      if (req.path.startsWith("/admin")) {
        return res.sendFile(frontendIndexFile);
      }

      if (fs.existsSync(frontendServerBundle)) {
        try {
          const html = await renderPublicDocument({
            url: req.path,
            templatePath: frontendIndexFile,
            serverEntryPath: `file://${frontendServerBundle.replace(/\\/g, "/")}`,
            publicSiteUrl: env.PUBLIC_SITE_URL,
          });
          return res.status(200).send(html);
        } catch (error) {
          return next(error);
        }
      }

      return res.sendFile(frontendIndexFile);
    });
  }

  app.use(errorHandler);

  return app;
}
