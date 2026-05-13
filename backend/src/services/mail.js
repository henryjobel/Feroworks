import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { PageSectionContent } from "../lib/schemas.js";

const DEFAULT_EMAIL_SETTINGS = {
  host: "",
  port: 587,
  secure: false,
  user: "",
  pass: "",
  from: "",
  replyTo: "",
  templates: [
    { id: "lead-follow-up", name: "Lead Follow-up", subject: "Bedankt voor uw aanvraag bij FerroWorks", body: "Beste {{name}},\n\nBedankt voor uw aanvraag. Wij hebben uw bericht goed ontvangen en komen hier zo snel mogelijk bij u op terug.\n\nMet vriendelijke groet,\nFerroWorks", htmlBody: buildDefaultTemplateHtml("Bedankt voor uw aanvraag", "<p>Beste {{name}},</p><p>Bedankt voor uw aanvraag. Wij hebben uw bericht goed ontvangen en komen hier zo snel mogelijk bij u op terug.</p><p>Met vriendelijke groet,<br />FerroWorks</p>") },
    { id: "quote-request", name: "Offerte in behandeling", subject: "Uw offerteaanvraag is in behandeling", body: "Beste {{name}},\n\nDank voor uw offerteaanvraag. Ons team beoordeelt uw informatie en neemt contact met u op zodra wij de aanvraag inhoudelijk hebben afgestemd.\n\nMet vriendelijke groet,\nFerroWorks", htmlBody: buildDefaultTemplateHtml("Offerteaanvraag ontvangen", "<p>Beste {{name}},</p><p>Dank voor uw offerteaanvraag. Ons team beoordeelt uw informatie en neemt contact met u op zodra wij de aanvraag inhoudelijk hebben afgestemd.</p><p>Met vriendelijke groet,<br />FerroWorks</p>") },
    { id: "needs-info", name: "Aanvullende informatie nodig", subject: "Aanvullende informatie voor uw aanvraag", body: "Beste {{name}},\n\nDank voor uw bericht. Om uw aanvraag goed te beoordelen ontvangen wij graag nog aanvullende informatie of tekeningen.\n\nMet vriendelijke groet,\nFerroWorks", htmlBody: buildDefaultTemplateHtml("Aanvullende informatie nodig", "<p>Beste {{name}},</p><p>Dank voor uw bericht. Om uw aanvraag goed te beoordelen ontvangen wij graag nog aanvullende informatie of tekeningen.</p><p>Met vriendelijke groet,<br />FerroWorks</p>") },
    { id: "meeting-invite", name: "Afspraak plannen", subject: "Voorstel om uw aanvraag te bespreken", body: "Beste {{name}},\n\nWij bespreken uw aanvraag graag kort telefonisch of via een afspraak. Laat gerust weten welk moment u het beste uitkomt.\n\nMet vriendelijke groet,\nFerroWorks", htmlBody: buildDefaultTemplateHtml("Afspraak inplannen", "<p>Beste {{name}},</p><p>Wij bespreken uw aanvraag graag kort telefonisch of via een afspraak. Laat gerust weten welk moment u het beste uitkomt.</p><p>Met vriendelijke groet,<br />FerroWorks</p>") },
    { id: "project-update", name: "Project update", subject: "Update vanuit FerroWorks", body: "Beste {{name}},\n\nHierbij ontvangt u een update vanuit FerroWorks over uw aanvraag/project. Mocht u vragen hebben, neem dan gerust contact met ons op.\n\nMet vriendelijke groet,\nFerroWorks", htmlBody: buildDefaultTemplateHtml("Project update", "<p>Beste {{name}},</p><p>Hierbij ontvangt u een update vanuit FerroWorks over uw aanvraag/project. Mocht u vragen hebben, neem dan gerust contact met ons op.</p><p>Met vriendelijke groet,<br />FerroWorks</p>") },
  ],
};

function buildDefaultTemplateHtml(title, contentHtml) {
  return `
    <div style="margin:0;padding:0;background:#f3f4f6;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;">
              <tr>
                <td style="padding:22px 28px;background:#171717;">
                  <div style="font-family:Arial Black,Arial,sans-serif;font-size:24px;letter-spacing:-0.5px;">
                    <span style="color:#ffffff;">FERRO</span><span style="color:#c8d400;">WORKS</span>
                  </div>
                  <div style="margin-top:8px;color:#d1d5db;font:14px Arial,sans-serif;">Constructiewerk, staal en maatwerkoplossingen</div>
                </td>
              </tr>
              <tr>
                <td style="padding:34px 28px 14px;">
                  <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#eef3ce;color:#5e6900;font:700 11px Arial,sans-serif;letter-spacing:0.8px;text-transform:uppercase;">FerroWorks update</div>
                  <h1 style="margin:18px 0 0;color:#111827;font:900 28px/1.2 Arial Black,Arial,sans-serif;">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 20px;color:#374151;font:16px/1.7 Arial,sans-serif;">
                  ${contentHtml}
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 28px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8faf3;border:1px solid #e5e7eb;border-radius:14px;">
                    <tr>
                      <td style="padding:18px 20px;color:#4b5563;font:14px/1.7 Arial,sans-serif;">
                        Heeft u vragen? Reageer gerust op deze e-mail of neem direct contact met ons op.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font:12px/1.7 Arial,sans-serif;">
                  FerroWorks • Industriële metaal- en staaloplossingen
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `.trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderTemplateString(template, variables = {}) {
  return String(template || "").replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? "");
}

export function buildDesignedEmailFromMessage(message, title = "Bericht van FerroWorks") {
  const htmlMessage = escapeHtml(message).replace(/\n/g, "<br />");
  return buildDefaultTemplateHtml(title, `<p style="margin:0;">${htmlMessage}</p>`);
}

function sanitizeEmailSettings(settings) {
  const cleanString = (value) => typeof value === "string" ? value.trim() : "";
  const templates = Array.isArray(settings?.templates) && settings.templates.length ? settings.templates : DEFAULT_EMAIL_SETTINGS.templates;

  return {
    host: cleanString(settings?.host),
    port: Number(settings?.port || 587),
    secure: Boolean(settings?.secure),
    user: cleanString(settings?.user),
    pass: typeof settings?.pass === "string" ? settings.pass : "",
    from: cleanString(settings?.from),
    replyTo: cleanString(settings?.replyTo),
    templates: templates.map((template, index) => ({
      id: template?.id || DEFAULT_EMAIL_SETTINGS.templates[index]?.id || `template-${index + 1}`,
      name: cleanString(template?.name) || DEFAULT_EMAIL_SETTINGS.templates[index]?.name || `Template ${index + 1}`,
      subject: cleanString(template?.subject) || DEFAULT_EMAIL_SETTINGS.templates[index]?.subject || "",
      body: typeof template?.body === "string" ? template.body : (DEFAULT_EMAIL_SETTINGS.templates[index]?.body || ""),
      htmlBody: typeof template?.htmlBody === "string" && template.htmlBody.trim()
        ? template.htmlBody
        : (DEFAULT_EMAIL_SETTINGS.templates[index]?.htmlBody || buildDesignedEmailFromMessage(template?.body || "", cleanString(template?.subject) || "Bericht van FerroWorks")),
    })),
  };
}

async function getStoredEmailSettings() {
  const stored = await PageSectionContent.findOne({ key: "emailSettings" });
  return sanitizeEmailSettings(stored?.value || DEFAULT_EMAIL_SETTINGS);
}

export async function getEmailSettings() {
  const settings = await getStoredEmailSettings();
  return {
    ...settings,
    pass: "",
    hasPassword: Boolean(settings.pass),
  };
}

export async function updateEmailSettings(value) {
  const existing = await getStoredEmailSettings();
  const sanitized = sanitizeEmailSettings({
    ...existing,
    ...value,
    pass: value?.pass ? value.pass : existing.pass,
  });
  const existing_record = await PageSectionContent.findOne({ key: "emailSettings" });
  if (existing_record) {
    await PageSectionContent.findByIdAndUpdate(existing_record._id, { value: sanitized }, { new: true });
  } else {
    await PageSectionContent.create({ key: "emailSettings", value: sanitized });
  }
  return {
    ...sanitized,
    pass: "",
    hasPassword: Boolean(sanitized.pass),
  };
}

async function resolveMailConfig() {
  const stored = await getStoredEmailSettings();
  const config = {
    host: stored.host || env.SMTP_HOST,
    port: stored.port || env.SMTP_PORT,
    secure: typeof stored.secure === "boolean" ? stored.secure : env.SMTP_SECURE,
    user: stored.user || env.SMTP_USER,
    pass: stored.pass || env.SMTP_PASS,
    from: stored.from || env.SMTP_FROM,
    replyTo: stored.replyTo || "",
  };

  if (!config.host || !config.port || !config.from) {
    const error = new Error("SMTP is not configured. Add the email configuration in admin settings.");
    error.statusCode = 400;
    throw error;
  }

  return { config, templates: stored.templates };
}

export async function verifyMailConfig() {
  const { config } = await resolveMailConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.user ? { user: config.user, pass: config.pass } : undefined,
  });
  await transporter.verify();
  return true;
}

export async function sendMail({ to, subject, text, html, replyTo }) {
  const { config } = await resolveMailConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.user ? { user: config.user, pass: config.pass } : undefined,
  });

  return transporter.sendMail({
    from: config.from,
    to,
    subject,
    text,
    html,
    replyTo: replyTo || config.replyTo || undefined,
  });
}

export async function mailIsConfigured() {
  try {
    await resolveMailConfig();
    return true;
  } catch {
    return false;
  }
}
