import { useCms } from "../cms/CmsContext";
import { resolveMediaUrl } from "../utils/media";

function BrandLogo({ variant = "header" }) {
  const { cms } = useCms();
  const site = cms.site || {};
  const websiteSettings = cms.websiteSettings || {};
  const logoImage = resolveMediaUrl(websiteSettings.logoImage || "");
  const brandName = site.naam || "FerroWorks";
  const tagline = site.tagline || "Metaalmaatwerk";

  if (logoImage) {
    return (
      <img
        src={logoImage}
        alt={brandName}
        style={{
          height: variant === "footer" ? "42px" : "38px",
          width: "auto",
          maxWidth: variant === "footer" ? "240px" : "220px",
          objectFit: "contain",
          display: "block",
        }}
      />
    );
  }

  if (variant === "footer") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
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
            {tagline}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0" style={{ maxWidth: "calc(100% - 56px)" }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="36" height="36" rx="4" fill="var(--fw-website-primary)" />
        <path d="M7 28 L11 14 L16 22 L21 14 L25 28" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      </svg>
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span className="site-title text-[24px] font-black text-gray-900 tracking-tight">FERRO</span>
          <span className="site-title text-[24px] font-black tracking-tight theme-primary-text">WORKS</span>
        </div>
        <span className="text-[13px] italic text-gray-500 font-normal">
          {tagline}
        </span>
      </div>
    </div>
  );
}

export default BrandLogo;
