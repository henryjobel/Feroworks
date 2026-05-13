import express from "express";
import { Service, BlogPost } from "../lib/schemas.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ok } from "../utils/response.js";
import { getCmsPayload, getPublicSeoForPath } from "../services/cms.js";

export const publicRouter = express.Router();

publicRouter.get(
  "/cms",
  asyncHandler(async (req, res) => {
    return ok(res, await getCmsPayload());
  }),
);

publicRouter.get(
  "/bootstrap",
  asyncHandler(async (req, res) => {
    const path = typeof req.query.path === "string" ? req.query.path : "/";
    const [cms, seo] = await Promise.all([getCmsPayload(), getPublicSeoForPath(path)]);
    return ok(res, { cms, seo });
  }),
);

publicRouter.get(
  "/diensten/:slug",
  asyncHandler(async (req, res) => {
    const item = await Service.findOne({ slug: req.params.slug });
    return ok(res, item);
  }),
);

publicRouter.get(
  "/blog/:slug",
  asyncHandler(async (req, res) => {
    const item = await BlogPost.findOne({ slug: req.params.slug });
    return ok(res, item);
  }),
);
