import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import { PERMISSIONS, ROLE_PRESETS, normalizePermissions, serializeAdminUser } from "../auth/permissions.js";
import { env } from "../config/env.js";
import { requireAuth, requirePermission } from "../middleware/auth.js";
import { AdminUser, LeadSubmission } from "../lib/schemas.js";
import { asyncHandler } from "../utils/async-handler.js";
import { fail, ok } from "../utils/response.js";
import { getCmsPayload, updateCmsSection } from "../services/cms.js";
import { saveUploadedFile } from "../services/media.js";
import { buildDesignedEmailFromMessage, getEmailSettings, mailIsConfigured, renderTemplateString, sendMail, updateEmailSettings, verifyMailConfig } from "../services/mail.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
  },
});

const ALLOWED_CMS_UPLOAD_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);
 
export const adminRouter = express.Router();

adminRouter.use(requireAuth);

function serializeLeadSubmission(lead) {
  const plain = typeof lead.toObject === "function" ? lead.toObject() : lead;
  return {
    ...plain,
    id: plain._id,
  };
}

function getSectionPermission(key) {
  const mapping = {
    hero: "content.homepage",
    stats: "content.homepage",
    watFerna: "content.homepage",
    anders: "content.homepage",
    projecten: "content.homepage",
    faq: "content.homepage",
    clientLogos: "content.homepage",
    sectorenHighlight: "content.homepage",
    uwProject: "content.homepage",
    overOns: "content.about",
    contact: "content.pages",
    pages: "content.pages",
    websiteSettings: "settings.manage",
    site: "settings.manage",
  };

  return mapping[key] || "settings.manage";
}

async function ensureNotLastOwner(userId, nextRole, nextIsActive) {
  const current = await AdminUser.findById(userId);
  if (!current) {
    return;
  }

  const ownerWillRemainOwner = nextRole === "owner" && nextIsActive !== false;
  if (current.role !== "owner" || ownerWillRemainOwner) {
    return;
  }

  const ownerCount = await AdminUser.countDocuments({
    role: "owner",
    isActive: true,
    _id: { $ne: userId },
  });

  if (ownerCount < 1) {
    const error = new Error("At least one active owner account must remain.");
    error.statusCode = 400;
    throw error;
  }
}

adminRouter.get(
  "/cms",
  asyncHandler(async (req, res) => {
    return ok(res, await getCmsPayload());
  }),
);

adminRouter.put(
  "/section/:key",
  asyncHandler(async (req, res) => {
    const permission = getSectionPermission(req.params.key);
    if (!req.auth.permissions?.includes("*") && !req.auth.permissions?.includes(permission)) {
      return fail(res, 403, "You do not have permission for this section.");
    }
    await updateCmsSection(req.params.key, req.body?.value);
    return ok(res, { key: req.params.key });
  }),
);

adminRouter.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return fail(res, 400, "A file is required.");
    }

    if (!ALLOWED_CMS_UPLOAD_MIME_TYPES.has(req.file.mimetype)) {
      return fail(res, 400, "Only images and PDF files are allowed.");
    }

    const asset = await saveUploadedFile(req.file, req.file.mimetype === "application/pdf" ? "document" : "cms");
    return ok(res, asset);
  }),
);

adminRouter.get(
  "/leads",
  requirePermission("leads.view"),
  asyncHandler(async (req, res) => {
    const leads = await LeadSubmission.find()
      .sort({ createdAt: -1 })
      .limit(50);

    return ok(res, {
      items: leads.map(serializeLeadSubmission),
      mailConfigured: await mailIsConfigured(),
    });
  }),
);

adminRouter.get(
  "/settings/email",
  requirePermission("settings.manage"),
  asyncHandler(async (req, res) => {
    const settings = await getEmailSettings();
    return ok(res, {
      ...settings,
      pass: "",
      mailConfigured: await mailIsConfigured(),
    });
  }),
);

adminRouter.put(
  "/settings/email",
  requirePermission("settings.manage"),
  asyncHandler(async (req, res) => {
    const settings = await updateEmailSettings(req.body || {});
    return ok(res, {
      ...settings,
      pass: "",
      mailConfigured: await mailIsConfigured(),
    });
  }),
);

adminRouter.post(
  "/settings/email/test",
  requirePermission("settings.manage"),
  asyncHandler(async (req, res) => {
    const { to } = req.body ?? {};
    if (!to) {
      return fail(res, 400, "Recipient email is required.");
    }

    await verifyMailConfig();
    await sendMail({
      to,
      subject: "FerroWorks SMTP test",
      text: "This is a test email sent from the FerroWorks admin panel.",
      html: buildDesignedEmailFromMessage("This is a test email sent from the FerroWorks admin panel.", "SMTP test"),
    });

    return ok(res, { sent: true });
  }),
);

adminRouter.post(
  "/leads/:id/reply",
  requirePermission("leads.reply"),
  asyncHandler(async (req, res) => {
    const { subject, message, htmlMessage, templateId } = req.body ?? {};
    if (!subject || !message) {
      return fail(res, 400, "Subject and message are required.");
    }

    const lead = await LeadSubmission.findById(req.params.id);

    if (!lead) {
      return fail(res, 404, "Lead not found.");
    }

    const settings = await getEmailSettings();
    const selectedTemplate = (settings.templates || []).find((item) => item.id === templateId);
    const variables = {
      name: lead.name,
      email: lead.email,
      company: lead.company || "",
      phone: lead.phone || "",
      subject,
      message,
    };
    const resolvedHtml = htmlMessage
      || (selectedTemplate?.htmlBody ? renderTemplateString(selectedTemplate.htmlBody, variables) : buildDesignedEmailFromMessage(message, subject));

    await sendMail({
      to: lead.email,
      subject,
      text: message,
      html: resolvedHtml,
      replyTo: req.auth.email,
    });

    const updatedLead = await LeadSubmission.findByIdAndUpdate(
      lead._id,
      { status: "replied" },
      { new: true }
    );

    return ok(res, serializeLeadSubmission(updatedLead));
  }),
);

adminRouter.get(
  "/staff",
  requirePermission("staff.manage"),
  asyncHandler(async (req, res) => {
    const staff = await AdminUser.find()
      .sort({ role: 1, createdAt: 1 });

    return ok(res, {
      items: staff.map(serializeAdminUser),
      roles: ROLE_PRESETS,
      permissions: PERMISSIONS,
    });
  }),
);

adminRouter.post(
  "/staff",
  requirePermission("staff.manage"),
  asyncHandler(async (req, res) => {
    const { name, email, password, role = "editor", customPermissions = [], isActive = true } = req.body ?? {};
    if (!name || !email || !password) {
      return fail(res, 400, "Name, email and password are required.");
    }

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      return fail(res, 400, "A staff account with this email already exists.");
    }

    const user = await AdminUser.create({
      name,
      email: String(email).trim().toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
      role,
      permissions: normalizePermissions(role, customPermissions),
      isActive: Boolean(isActive),
    });

    return ok(res, serializeAdminUser(user));
  }),
);

adminRouter.put(
  "/staff/:id",
  requirePermission("staff.manage"),
  asyncHandler(async (req, res) => {
    const current = await AdminUser.findById(req.params.id);
    if (!current) {
      return fail(res, 404, "Staff member not found.");
    }

    const { name, email, password, role = current.role, customPermissions = current.permissions || [], isActive = current.isActive } = req.body ?? {};
    if (!name || !email) {
      return fail(res, 400, "Name and email are required.");
    }

    await ensureNotLastOwner(current._id, role, isActive);

    const user = await AdminUser.findByIdAndUpdate(
      current._id,
      {
        name,
        email: String(email).trim().toLowerCase(),
        role,
        permissions: normalizePermissions(role, customPermissions),
        isActive: Boolean(isActive),
        ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
      },
      { new: true }
    );

    return ok(res, serializeAdminUser(user));
  }),
);
