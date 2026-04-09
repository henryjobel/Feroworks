function Footer() {
  return (
    <footer style={{ background: "#3a3a3a" }}>

      {/* Top row */}
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
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {/* Lime square icon */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" fill="#c8d400" />
            <rect x="7" y="7" width="10" height="22" fill="#1c1c1c" />
            <rect x="19" y="7" width="10" height="10" fill="#1c1c1c" />
          </svg>
          <div style={{ lineHeight: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1px" }}>
              <span style={{
                fontFamily: "Arial Black, Arial, sans-serif",
                fontWeight: 900,
                fontSize: "22px",
                color: "#fff",
                letterSpacing: "-0.5px",
              }}>FER</span>
              <span style={{
                fontFamily: "Arial Black, Arial, sans-serif",
                fontWeight: 900,
                fontSize: "22px",
                color: "#c8d400",
                letterSpacing: "-0.5px",
              }}>NA</span>
            </div>
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: "11px",
              color: "#c8d400",
              marginTop: "1px",
              letterSpacing: "0.5px",
            }}>services</div>
          </div>
        </div>

        {/* Address */}
        <div style={{ color: "#ccc", fontSize: "13px", lineHeight: 1.7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2px" }}>
          <div>WESTELIJKE HAVENDIJK 31</div>
          <div>4703 RL ROOSENDAAL</div>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "40px", background: "#555", flexShrink: 0 }} className="hidden md:block" />

        {/* Phone + Email */}
        <div style={{ fontSize: "13px", lineHeight: 1.8 }}>
          <div style={{ color: "#ccc", fontWeight: 700, letterSpacing: "0.2px" }}>+31 (0)165 205 601</div>
          <a href="mailto:info@ferna.nl" style={{ color: "#c8d400", fontWeight: 700, letterSpacing: "0.2px", textDecoration: "none" }}>
            INFO@FERNA.NL
          </a>
        </div>

        {/* Social icons */}
        <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          {/* Facebook */}
          <a href="#" aria-label="Facebook" style={socialStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" aria-label="LinkedIn" style={socialStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" fill="white" />
            </svg>
          </a>
          {/* YouTube */}
          <a href="#" aria-label="YouTube" style={socialStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#3a3a3a" />
            </svg>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #4e4e4e" }} />

      {/* Bottom row */}
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
          © Ferna. All Rights Reserved | Marketing door{" "}
          <a href="https://leadi.nl" target="_blank" rel="noopener noreferrer"
            style={{ color: "#888", textDecoration: "underline" }}>
            Leadi
          </a>
        </p>

        <nav style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          {["VACATURES", "MACHINEPARK", "PRIVACY POLICY", "ALGEMENE VOORWAARDEN"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                color: "#ccc",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textDecoration: "none",
                fontFamily: "Arial Black, Arial, sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#c8d400"}
              onMouseLeave={e => e.currentTarget.style.color = "#ccc"}
            >
              {link}
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
