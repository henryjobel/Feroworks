import { useCms } from "../cms/CmsContext";

function Footer() {
  const { cms } = useCms();
  const site = cms.site || {};
  const phone = site.tel || "+31 (0)165 205 601";
  const email = site.email || "info@ferroworks.nl";
  const addressLines = (site.adres || "WESTELIJKE HAVENDIJK 31\n4703 RL ROOSENDAAL").split("\n");
  const linkedin = site.linkedin ? `https://${site.linkedin.replace(/^https?:\/\//, "")}` : "#";
  const instagram = site.instagram ? `https://${site.instagram.replace(/^https?:\/\//, "")}` : "#";

  return (
    <footer style={{ background: "var(--fw-website-secondary)" }}>
      <div
        className="max-w-7xl mx-auto px-6 md:px-8"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "40px 0",
          flexWrap: "wrap",
          gap: "28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" fill="var(--fw-website-primary)" />
            <rect x="7" y="7" width="10" height="22" fill="#1c1c1c" />
            <rect x="19" y="7" width="10" height="10" fill="#1c1c1c" />
          </svg>
          <div style={{ lineHeight: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1px" }}>
              <span className="site-title" style={{ fontWeight: 900, fontSize: "22px", color: "#fff", letterSpacing: "-0.5px" }}>FERRO</span>
              <span className="site-title theme-primary-text" style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.5px" }}>WORKS</span>
            </div>
            <div className="theme-primary-text" style={{ fontStyle: "italic", fontSize: "11px", marginTop: "1px", letterSpacing: "0.5px" }}>
              {site.tagline || "metaalwerk"}
            </div>
          </div>
        </div>

        <div style={{ color: "#ccc", fontSize: "13px", lineHeight: 1.7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2px" }}>
          {addressLines.map((line) => <div key={line}>{line}</div>)}
        </div>

        <div style={{ width: "1px", height: "40px", background: "#555", flexShrink: 0 }} className="hidden md:block" />

        <div style={{ fontSize: "13px", lineHeight: 1.8 }}>
          <div style={{ color: "#ccc", fontWeight: 700, letterSpacing: "0.2px" }}>{phone}</div>
          <a href={`mailto:${email}`} className="theme-primary-text no-theme-link" style={{ fontWeight: 700, letterSpacing: "0.2px", textDecoration: "none" }}>
            {email.toUpperCase()}
          </a>
        </div>

        <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          <a href="#" aria-label="Facebook" style={socialStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a href={linkedin} aria-label="LinkedIn" style={socialStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" fill="white" />
            </svg>
          </a>
          <a href={instagram} aria-label="Instagram" style={socialStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="white" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
            </svg>
          </a>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #4e4e4e" }} />

      <div
        className="max-w-7xl mx-auto px-6 md:px-8"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 0",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <p style={{ color: "#888", fontSize: "12.5px", margin: 0 }}>
          © FerroWorks. All Rights Reserved | Marketing door{" "}
          <a href="https://leadi.nl" target="_blank" rel="noopener noreferrer" style={{ color: "#888", textDecoration: "underline" }}>
            Leadi
          </a>
        </p>

        <nav style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          {[
            { label: "VACATURES", href: "#" },
            { label: "MACHINEPARK", href: "#" },
            { label: "PRIVACY POLICY", href: "/privacy-policy" },
            { label: "ALGEMENE VOORWAARDEN", href: "/algemene-voorwaarden" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: "#ccc",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textDecoration: "none",
                fontFamily: "var(--fw-website-heading-font)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--fw-website-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#ccc"}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

const socialStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "#555",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s",
  textDecoration: "none",
};

export default Footer;
