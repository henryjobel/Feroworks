import { mailIsConfigured, sendMail } from "./mail.js";

export async function notifyLeadSubmission(submission) {
  console.log("Lead submission received", {
    id: submission.id,
    email: submission.email,
    createdAt: submission.createdAt,
  });

  if (!(await mailIsConfigured())) {
    return;
  }

  try {
    await sendMail({
      to: env.ADMIN_EMAIL,
      subject: `Nieuwe contactaanvraag van ${submission.name}`,
      replyTo: submission.email,
      text: [
        `Naam: ${submission.name}`,
        `Bedrijf: ${submission.company || "-"}`,
        `E-mail: ${submission.email}`,
        `Telefoon: ${submission.phone || "-"}`,
        "",
        submission.message,
      ].join("\n"),
      html: `
        <h2>Nieuwe contactaanvraag</h2>
        <p><strong>Naam:</strong> ${submission.name}</p>
        <p><strong>Bedrijf:</strong> ${submission.company || "-"}</p>
        <p><strong>E-mail:</strong> ${submission.email}</p>
        <p><strong>Telefoon:</strong> ${submission.phone || "-"}</p>
        <p><strong>Bericht:</strong></p>
        <p>${submission.message.replace(/\n/g, "<br />")}</p>
      `,
    });
  } catch (error) {
    console.error("Lead notification email failed", error);
  }
}
