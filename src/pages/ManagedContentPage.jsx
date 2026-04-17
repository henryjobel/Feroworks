import { Link, useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsContext";
import heroBg from "../assets/hero-background.jpeg";
import RichTextContent from "../components/RichTextContent";

export default function ManagedContentPage() {
  const { cms } = useCms();
  const location = useLocation();
  const page = (cms.pages || []).find((item) => item.path === location.pathname);

  if (!page) {
    return null;
  }

  return (
    <>
      <section style={{ position: "relative", width: "100%", minHeight: "320px", display: "flex", alignItems: "center", overflow: "hidden", background: "#141616" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center right" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)" }} />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <Link to="/" style={{ color: "var(--fw-website-primary)", fontSize: "13px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Home</Link>
            <span style={{ color: "#666", fontSize: "13px" }}>â€º</span>
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
            <RichTextContent html={page.body || "<p>Geen inhoud ingesteld.</p>"} className="managed-content-page" />
          </div>
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


