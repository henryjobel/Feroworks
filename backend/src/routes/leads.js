import express from "express";
import multer from "multer";
import { env } from "../config/env.js";
import { LeadSubmission, NewsletterSubscription } from "../lib/schemas.js";
import { leadRateLimiter } from "../middleware/rate-limiters.js";
import { saveUploadedFile } from "../services/media.js";
import { notifyLeadSubmission } from "../services/notifications.js";
import { asyncHandler } from "../utils/async-handler.js";
import { fail, ok } from "../utils/response.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
  },
});

export const leadsRouter = express.Router();

leadsRouter.post(
  "/contact-submissions",
  leadRateLimiter,
  upload.single("attachment"),
  asyncHandler(async (req, res) => {
    const { naam, bedrijf, email, telefoon, bericht } = req.body ?? {};
    if (!naam || !email || !bericht) {
      return fail(res, 400, "Name, email, and message are required.");
    }

    let attachment = null;
    if (req.file) {
      attachment = await saveUploadedFile(req.file, "lead-attachment");
    }

    const submission = await LeadSubmission.create({
      name: naam,
      company: bedrijf || null,
      email,
      phone: telefoon || null,
      message: bericht,
      attachmentId: attachment?.id ?? null,
    });

    return ok(res, {
      id: submission._id,
      status: submission.status,
    });
  }),
);

leadsRouter.post(
  "/newsletter-subscriptions",
  leadRateLimiter,
  asyncHandler(async (req, res) => {
    const { email } = req.body ?? {};
    if (!email) {
      return fail(res, 400, "Email is required.");
    }

    const record = await NewsletterSubscription.findOne({ email });
    
    if (record) {
      record.active = true;
      await record.save();
      return ok(res, { id: record._id, email: record.email, active: record.active });
    } else {
      const subscription = await NewsletterSubscription.create({ email, active: true });
      return ok(res, { id: subscription._id, email: subscription.email, active: subscription.active });
    }
  }),
);
