import { Link, useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsContext";
import heroBg from "../assets/hero-background.jpeg";
import RichTextContent from "../components/RichTextContent";
import { useLanguage } from "../i18n/LanguageContext";
import { resolveMediaUrl } from "../utils/media";

export default function ManagedContentPage() {
  const { cms } = useCms();
  const { t, localizePath } = useLanguage();
  const location = useLocation();
  const page = (cms.pages || []).find((item) => item.path === location.pathname);

  if (!page) {
    return null;
  }

  const pdfUrl = page.pdfUrl ? resolveMediaUrl(page.pdfUrl) : "";
  const pdfLabel = page.pdfLabel || t("managedPage.pdfLabel", "Bekijk document");
  const pdfDownloadOnly = Boolean(page.pdfDownloadOnly);
  const isLegalPage = ["privacy", "terms"].includes(page.key);
  const pdfFilename = pdfUrl ? pdfUrl.split("/").pop() : "";

  return (
    <>
      <section style={{ position: "relative", width: "100%", minHeight: "320px", display: "flex", alignItems: "center", overflow: "hidden", background: "#141616" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center right" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)" }} />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <Link to={localizePath("/")} style={{ color: "var(--fw-website-primary)", fontSize: "13px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{t("common.home", "Home")}</Link>
            <span style={{ color: "#666", fontSize: "13px" }}>{">"}</span>
            <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{page.name}</span>
          </div>
          <h1 style={{ margin: "0 0 16px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.5px", textTransform: "uppercase" }}>
            <span style={{ color: "var(--fw-website-primary)" }}>{page.heroTitle || page.name}</span>
          </h1>
          <p style={{ margin: 0, color: "#bbb", fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.6, maxWidth: "680px" }}>
            {page.heroSubtitle || page.metaDescription}
          </p>
        </div>
      </section>

      <section style={{ background: "#f4f4f4", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div style={{ background: "#fff", padding: "48px", boxShadow: "0 10px 35px rgba(0,0,0,0.05)" }}>
            <RichTextContent html={page.body || `<p>${t("managedPage.noContent", "No content configured yet.")}</p>`} className="managed-content-page" />
          </div>
          {pdfUrl ? (
            <div style={{ background: "#fff", padding: "28px 32px", boxShadow: "0 10px 35px rgba(0,0,0,0.05)", marginTop: "24px", display: "grid", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ display: "grid", gap: "8px" }}>
                  <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "2px" }}>
                    {isLegalPage ? "Officieel document" : "Document"}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666", lineHeight: 1.7 }}>
                    {pdfDownloadOnly
                      ? t("managedPage.pdfDownloadDescription", "Download the attached PDF document for this page.")
                      : t("managedPage.pdfDescription", "Open or download the attached PDF document for this page.")}
                  </div>
                  <div style={{ fontSize: "12px", color: "#999", wordBreak: "break-all" }}>
                    {pdfFilename}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "12px 22px", borderRadius: "999px", background: "var(--fw-website-primary)", color: "var(--fw-website-secondary)", textDecoration: "none", fontWeight: 800, fontSize: "13px", letterSpacing: "0.4px", textTransform: "uppercase", whiteSpace: "nowrap" }}
                  >
                    {pdfLabel}
                  </a>
                </div>
              </div>
              {!pdfDownloadOnly ? (
                <div style={{ border: "1px solid #ececec", borderRadius: "10px", overflow: "hidden", background: "#f9f9f9" }}>
                  <iframe
                    src={pdfUrl}
                    title={`${page.name} PDF`}
                    style={{ width: "100%", minHeight: "720px", border: "none", display: "block" }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <style>{`
        .managed-content-page h2 {
          font-family: Arial Black, Arial, sans-serif;
          font-size: 24px;
          line-height: 1.15;
          text-transform: uppercase;
          color: #1c1c1c;
          margin: 32px 0 16px;
        }
        .managed-content-page p {
          color: #555;
          font-size: 15px;
          line-height: 1.8;
          margin: 0 0 18px;
        }
        .managed-content-page ul {
          margin: 0 0 24px;
          padding-left: 20px;
          color: #555;
          line-height: 1.8;
        }
      `}</style>
    </>
  );
}
