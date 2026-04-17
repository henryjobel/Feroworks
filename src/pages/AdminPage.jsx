import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useCms } from "../cms/CmsContext";
import RichTextEditor from "../components/RichTextEditor";
import { stripHtml } from "../components/RichTextContent";

function SvgIcon({ d, size = 18, stroke = "currentColor", strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );
}

function ChevronIcon({ open, size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={open ? "M6 15l6-6 6 6" : "M9 6l6 6-6 6"}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function makeSlug(value, fallback = "item") {
  return (value || fallback)
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseLines(value) {
  return (value || "").split("\n").map((item) => item.trim()).filter(Boolean);
}

function toMultiline(value) {
  return Array.isArray(value) ? value.join("\n") : value || "";
}

function baseInputStyle() {
  return {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#333",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color .15s",
    background: "#fff",
  };
}

function FieldLabel({ children }) {
  return (
    <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>
      {children}
    </label>
  );
}

function FormField({ label, value, onChange, placeholder, multiline, rows = 3, type = "text" }) {
  const shared = baseInputStyle();

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          style={{ ...shared, resize: "vertical" }}
          onFocus={(e) => { e.target.style.borderColor = "#c8d400"; }}
          onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; }}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={shared}
          onFocus={(e) => { e.target.style.borderColor = "#c8d400"; }}
          onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; }}
        />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={baseInputStyle()}
        onFocus={(e) => { e.target.style.borderColor = "#c8d400"; }}
        onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#444", cursor: "pointer" }}>
      <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", ...style }}>{children}</div>;
}

function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
      <div>
        <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "16px", textTransform: "uppercase", color: "#1c1c1c", margin: "0 0 4px 0", letterSpacing: "-0.2px" }}>{title}</h2>
        {sub ? <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "12px 24px",
        background: "#c8d400",
        color: "#1c1c1c",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontFamily: "Arial Black, Arial, sans-serif",
        fontWeight: 900,
        fontSize: "12px",
        textTransform: "uppercase",
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "12px 20px",
        background: "#f4f4f4",
        color: "#666",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontFamily: "Arial Black, Arial, sans-serif",
        fontWeight: 900,
        fontSize: "12px",
        textTransform: "uppercase",
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

function ImageUpload({ label = "Afbeelding", value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const asset = await api.uploadCmsMedia(file);
      onChange(asset.publicUrl);
    } catch (error) {
      window.alert(error.message || "Upload mislukt.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", border: "2px dashed #e0e0e0", borderRadius: "6px", padding: "20px", cursor: "pointer", background: value ? "transparent" : "#fafafa", overflow: "hidden", minHeight: "120px", position: "relative", transition: "border-color .15s" }}>
        {value ? (
          <img src={value} alt="preview" style={{ maxHeight: "160px", maxWidth: "100%", objectFit: "contain", borderRadius: "4px" }} />
        ) : (
          <>
            <SvgIcon d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12" size={28} stroke="#c8d400" strokeWidth={1.8} />
            <span style={{ fontSize: "13px", color: "#aaa" }}>{uploading ? "Uploaden..." : "Klik om afbeelding te uploaden"}</span>
            <span style={{ fontSize: "11px", color: "#ccc" }}>PNG, JPG, WEBP</span>
          </>
        )}
        <input type="file" accept="image/*" onChange={handleFile} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
      </label>
      {value ? (
        <button type="button" onClick={() => onChange("")} style={{ marginTop: "8px", fontSize: "11px", color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, padding: 0 }}>
          Afbeelding verwijderen
        </button>
      ) : null}
    </div>
  );
}

function SaveBar({ saving, message, onSave, saveLabel = "Opslaan" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", marginTop: "28px", flexWrap: "wrap" }}>
      <div style={{ color: message ? "#10b981" : "#999", fontSize: "13px" }}>{message || "Wijzigingen worden direct naar de database opgeslagen."}</div>
      <PrimaryButton type="button" onClick={onSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
        {saving ? "Opslaan..." : saveLabel}
      </PrimaryButton>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: "720px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.35)" }}>
        <div style={{ padding: "20px 28px", background: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "14px", textTransform: "uppercase", color: "#fff", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "22px", lineHeight: 1, padding: "0 4px" }}>
            x
          </button>
        </div>
        <div style={{ padding: "28px" }}>{children}</div>
      </div>
    </div>
  );
}

const NAV_GROUPS = [
  {
    label: "Overzicht",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", permission: "dashboard.view", d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/homepage", label: "Homepage Blocks", permission: "content.homepage", d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
      { to: "/admin/over-ons", label: "Over Ons", permission: "content.about", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
      { to: "/admin/pages", label: "Pages", permission: "content.pages", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    ],
  },
  {
    label: "Collections",
    items: [
      { to: "/admin/blog", label: "Blog", permission: "collections.blog", d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
      { to: "/admin/diensten", label: "Diensten", permission: "collections.services", d: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" },
      { to: "/admin/sectoren", label: "Sectoren", permission: "collections.sectors", d: "M1 6l11-5 11 5v6c0 5.5-4.67 10.74-11 12C5.67 22.74 1 17.5 1 12V6z" },
      { to: "/admin/leads", label: "Contacts", permission: "leads.view", d: "M21 8a2 2 0 01-2 2H5l-4 4V6a2 2 0 012-2h16a2 2 0 012 2z M8 14h8 M8 18h5" },
    ],
  },
  {
    label: "Platform",
    items: [
      { to: "/admin/staff", label: "Staff", permission: "staff.manage", d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75" },
      { to: "/admin/instellingen", label: "Settings", permission: "settings.manage", d: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" },
    ],
  },
];

function pageMeta(pathname) {
  const list = [
    { match: "/admin/dashboard", title: "Dashboard", sub: "Overzicht van content en snelle acties" },
    { match: "/admin/blog", title: "Blog", sub: "Beheer alle blogposts via aparte overzichts- en editpagina's" },
    { match: "/admin/diensten", title: "Diensten", sub: "Beheer diensten en hun SEO apart" },
    { match: "/admin/sectoren", title: "Sectoren", sub: "Beheer sectoren en hun SEO apart" },
    { match: "/admin/leads", title: "Contacts", sub: "Bekijk contactaanvragen en stuur replies vanuit het panel" },
    { match: "/admin/homepage", title: "Homepage Blocks", sub: "Bewerk homepage-secties zonder het design te wijzigen" },
    { match: "/admin/over-ons", title: "Over Ons", sub: "Bewerk de content van de Over Ons-pagina" },
    { match: "/admin/pages", title: "Pages", sub: "Beheer pagina-meta, indexatie en statische pagina-inhoud" },
    { match: "/admin/staff", title: "Staff", sub: "Beheer accounts, rollen en toegangsrechten" },
    { match: "/admin/instellingen", title: "Settings", sub: "Website, robots en e-mailconfiguratie" },
  ];

  return list.find((item) => pathname.startsWith(item.match)) || list[0];
}

function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { can } = useAuth();
  const [openGroups, setOpenGroups] = useState(() => ({ Content: true, Collections: true, Platform: true, Overzicht: true }));
  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || can(item.permission)),
  })).filter((group) => group.items.length);

  return (
    <aside style={{ width: collapsed ? 72 : 240, background: "#141616", minHeight: "100vh", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, zIndex: 200, height: "100vh", overflowY: "auto", transition: "width .2s ease", flexShrink: 0 }}>
      <div onClick={() => setCollapsed(!collapsed)} style={{ padding: "18px 16px", borderBottom: "1px solid #252525", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", userSelect: "none" }}>
        <div style={{ width: "38px", height: "38px", background: "#c8d400", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 36 36" fill="none"><path d="M7 28 L11 14 L16 22 L21 14 L25 28" stroke="#1a1a1a" strokeWidth="2.8" fill="none" strokeLinejoin="round" /></svg>
        </div>
        {!collapsed ? (
          <div>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "15px", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
              <span style={{ color: "#fff" }}>FERRO</span><span style={{ color: "#c8d400" }}>WORKS</span>
            </div>
            <div style={{ fontSize: "10px", color: "#555", fontStyle: "italic", marginTop: "2px" }}>Admin Panel</div>
          </div>
        ) : null}
      </div>

      <nav style={{ padding: "12px 0", flex: 1 }}>
        {groups.map((group) => (
          <div key={group.label} style={{ marginBottom: "10px" }}>
            {!collapsed ? (
              <button
                type="button"
                onClick={() => setOpenGroups((prev) => ({ ...prev, [group.label]: !prev[group.label] }))}
                style={{ width: "100%", padding: "10px 20px", background: "transparent", border: "none", color: "#8a8a8a", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer" }}
              >
                <span>{group.label}</span>
                <ChevronIcon open={openGroups[group.label]} size={14} color="#8a8a8a" />
              </button>
            ) : null}
            {(collapsed || openGroups[group.label]) ? group.items.map((item) => {
              const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: collapsed ? "13px 0" : "13px 20px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: isActive ? "rgba(200,212,0,0.1)" : "transparent",
                    borderLeft: isActive ? "3px solid #c8d400" : "3px solid transparent",
                    color: isActive ? "#c8d400" : "#666",
                    fontFamily: "Arial Black, Arial, sans-serif",
                    fontWeight: 900,
                    fontSize: "12px",
                    letterSpacing: "0.4px",
                    textTransform: "uppercase",
                    transition: "all .15s ease",
                    textDecoration: "none",
                  }}
                >
                  <SvgIcon d={item.d} size={17} stroke="currentColor" />
                  {!collapsed ? item.label : null}
                </NavLink>
              );
            }) : null}
          </div>
        ))}
      </nav>

      <div style={{ padding: "14px 16px", borderTop: "1px solid #252525" }}>
        <Link to="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: "9px", justifyContent: collapsed ? "center" : "flex-start", color: "#555", fontSize: "11px", textDecoration: "none", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.4px" }}>
          <SvgIcon d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3" size={16} />
          {!collapsed ? "Bekijk site" : null}
        </Link>
      </div>
    </aside>
  );
}

function TopBar({ onLogout }) {
  const location = useLocation();
  const { user } = useAuth();
  const meta = pageMeta(location.pathname);
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Staff";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 28px", minHeight: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexShrink: 0 }}>
      <div>
        <h1 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "17px", textTransform: "uppercase", color: "#1c1c1c", margin: 0, letterSpacing: "-0.2px" }}>{meta.title}</h1>
        <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>{meta.sub}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "flex-end" }}>
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", border: "1px solid #ececec", borderRadius: "999px", background: "#fafafa", cursor: "pointer" }}
          >
            <div style={{ textAlign: "right", minWidth: "74px" }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "11px", textTransform: "uppercase", color: "#1c1c1c", whiteSpace: "nowrap" }}>{user?.name || "Admin"}</div>
              <div style={{ fontSize: "11px", color: "#888" }}>{roleLabel}</div>
            </div>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#c8d400", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <SvgIcon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z" size={15} stroke="#1c1c1c" strokeWidth={2.4} />
            </div>
            <ChevronIcon open={menuOpen} size={14} color="#666" />
          </button>

          {menuOpen ? (
            <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, minWidth: "180px", background: "#fff", border: "1px solid #ececec", borderRadius: "12px", boxShadow: "0 16px 40px rgba(0,0,0,0.12)", padding: "8px", zIndex: 30 }}>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #f1f1f1", marginBottom: "6px" }}>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "11px", textTransform: "uppercase", color: "#1c1c1c" }}>{user?.name || "Admin"}</div>
                <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>{user?.email || ""}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                style={{ width: "100%", textAlign: "left", border: "none", background: "#fff7f7", color: "#b42318", borderRadius: "8px", padding: "12px 14px", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "11px", textTransform: "uppercase" }}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function LoginScreen() {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(credentials.email, credentials.password);
    } catch (err) {
      setError(err.message || "Inloggen mislukt.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#141616", display: "grid", placeItems: "center", padding: "24px" }}>
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "420px", background: "#fff", padding: "32px", borderRadius: "10px", boxShadow: "0 24px 64px rgba(0,0,0,0.28)" }}>
        <h1 style={{ margin: "0 0 8px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "24px", textTransform: "uppercase", color: "#1c1c1c" }}>Admin Login</h1>
        <p style={{ margin: "0 0 24px 0", color: "#777", lineHeight: 1.6 }}>Log in om CMS-content en SEO te beheren.</p>
        <div style={{ display: "grid", gap: "16px" }}>
          <FormField label="E-mail" value={credentials.email} onChange={(value) => setCredentials((prev) => ({ ...prev, email: value }))} type="email" />
          <FormField label="Wachtwoord" value={credentials.password} onChange={(value) => setCredentials((prev) => ({ ...prev, password: value }))} type="password" />
        </div>
        {error ? <div style={{ marginTop: "16px", color: "#dc2626", fontSize: "13px" }}>{error}</div> : null}
        <PrimaryButton type="submit" disabled={submitting} style={{ marginTop: "24px", width: "100%" }}>
          {submitting ? "Bezig..." : "Inloggen"}
        </PrimaryButton>
      </form>
    </div>
  );
}

function AdminShell() {
  const { user, loading, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 72 : 240;

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Arial Black, Arial, sans-serif", color: "#555" }}>Admin laden...</div>;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f2f3f5", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, marginLeft: sidebarWidth, transition: "margin-left .2s ease", display: "flex", flexDirection: "column", minWidth: 0, minHeight: "100vh" }}>
        <TopBar onLogout={logout} />
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ForbiddenPage({ title = "Geen toegang", text = "Je account heeft geen toegang tot dit onderdeel." }) {
  return (
    <Card style={{ padding: "28px", maxWidth: "720px" }}>
      <h2 style={{ margin: "0 0 8px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "18px", textTransform: "uppercase", color: "#1c1c1c" }}>{title}</h2>
      <p style={{ margin: 0, color: "#666", lineHeight: 1.7 }}>{text}</p>
    </Card>
  );
}

function PermissionRoute({ permission, children }) {
  const { can } = useAuth();

  if (!can(permission)) {
    return <ForbiddenPage />;
  }

  return children;
}

function getDefaultAdminPath(can) {
  const routeOrder = [
    ["/admin/dashboard", "dashboard.view"],
    ["/admin/homepage", "content.homepage"],
    ["/admin/over-ons", "content.about"],
    ["/admin/pages", "content.pages"],
    ["/admin/blog", "collections.blog"],
    ["/admin/diensten", "collections.services"],
    ["/admin/sectoren", "collections.sectors"],
    ["/admin/leads", "leads.view"],
    ["/admin/staff", "staff.manage"],
    ["/admin/instellingen", "settings.manage"],
  ];

  return routeOrder.find((item) => can(item[1]))?.[0] || "/admin/dashboard";
}

function DefaultAdminRedirect() {
  const { can } = useAuth();
  return <Navigate to={getDefaultAdminPath(can)} replace />;
}

function DashboardPage() {
  const { can } = useAuth();
  const { cms } = useCms();
  const stats = [
    { label: "Blog Posts", value: String((cms.blog || []).length), color: "#c8d400", d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
    { label: "Diensten", value: String((cms.diensten || []).length), color: "#3b82f6", d: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" },
    { label: "Sectoren", value: String((cms.sectoren || []).length), color: "#10b981", d: "M1 6l11-5 11 5v6c0 5.5-4.67 10.74-11 12C5.67 22.74 1 17.5 1 12V6z" },
    { label: "FAQ", value: String((cms.faq || []).length), color: "#f59e0b", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  ];

  const recentBlog = [...(cms.blog || [])].slice(0, 4);
  const quickLinks = [
    { label: "Nieuwe blogpost", to: "/admin/blog/new", permission: "collections.blog" },
    { label: "Nieuwe dienst", to: "/admin/diensten/new", permission: "collections.services" },
    { label: "Nieuwe sector", to: "/admin/sectoren/new", permission: "collections.sectors" },
    { label: "Bekijk leads", to: "/admin/leads", permission: "leads.view" },
    { label: "SEO instellingen", to: "/admin/instellingen", permission: "settings.manage" },
    { label: "Staff beheren", to: "/admin/staff", permission: "staff.manage" },
  ].filter((item) => can(item.permission));

  return (
    <div>
      <SectionHeader title="Dashboard" sub="Snel overzicht van de belangrijkste contentblokken" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "18px", marginBottom: "24px" }}>
        {stats.map((item) => (
          <Card key={item.label} style={{ padding: "22px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "8px", background: `${item.color}1a`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <SvgIcon d={item.d} size={22} stroke={item.color} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "30px", color: "#1c1c1c", lineHeight: 1 }}>{item.value}</div>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: "20px" }}>
        <Card>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #f2f2f2", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", color: "#1c1c1c" }}>Recente blogposts</span>
            <Link to="/admin/blog" style={{ fontSize: "12px", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", textDecoration: "none" }}>Alles bekijken</Link>
          </div>
          <div style={{ padding: "10px 22px 22px" }}>
            {recentBlog.length ? recentBlog.map((post) => (
              <div key={post.slug || post.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "16px", padding: "16px 0", borderBottom: "1px solid #f3f3f3", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "5px" }}>{post.title}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{post.category} • {post.date}</div>
                </div>
                <div style={{ fontSize: "11px", color: post.status === "Gepubliceerd" ? "#10b981" : "#999", fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase" }}>{post.status}</div>
                <Link to={`/admin/blog/${post.slug || post.id}/edit`} style={{ fontSize: "12px", color: "#1c1c1c", textDecoration: "none" }}>Bewerken</Link>
              </div>
            )) : <div style={{ padding: "18px 0", color: "#999" }}>Nog geen posts.</div>}
          </div>
        </Card>

        <Card style={{ padding: "22px" }}>
          <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "16px" }}>Snelle acties</div>
          <div style={{ display: "grid", gap: "12px" }}>
            {quickLinks.map((item) => (
              <Link key={item.to} to={item.to} style={{ padding: "14px 16px", background: "#f8f8f8", borderRadius: "8px", textDecoration: "none", color: "#222", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase" }}>
                {item.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function LeadsPage() {
  const { can } = useAuth();
  const [leads, setLeads] = useState([]);
  const [mailConfigured, setMailConfigured] = useState(false);
  const [emailSettings, setEmailSettings] = useState({ templates: [] });
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [leadError, setLeadError] = useState("");
  const [viewLead, setViewLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [replyForm, setReplyForm] = useState({ subject: "", message: "", htmlMessage: "", templateId: "" });
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([api.getAdminLeads(), api.getEmailSettings()])
      .then(([leadData, emailData]) => {
        if (cancelled) return;
        setLeads(leadData.items || []);
        setMailConfigured(Boolean(leadData.mailConfigured));
        setEmailSettings(emailData || { templates: [] });
        setLeadError("");
      })
      .catch((error) => {
        if (cancelled) return;
        setLeadError(error.message || "Kon contactaanvragen niet laden.");
      })
      .finally(() => {
        if (!cancelled) setLoadingLeads(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openReply = (lead) => {
    if (!can("leads.reply")) {
      return;
    }
    const firstTemplate = emailSettings.templates?.[0];
    const htmlMessage = firstTemplate?.htmlBody?.replace(/\{\{name\}\}/g, lead.name) || "";
    setSelectedLead(lead);
    setReplyForm({
      subject: firstTemplate?.subject?.replace(/\{\{name\}\}/g, lead.name) || "Re: uw aanvraag bij FerroWorks",
      message: firstTemplate?.body?.replace(/\{\{name\}\}/g, lead.name) || `Beste ${lead.name},\n\nBedankt voor uw bericht.\n\nMet vriendelijke groet,\nFerroWorks`,
      htmlMessage,
      templateId: firstTemplate?.id || "",
    });
  };

  const applyTemplate = (templateId) => {
    if (!selectedLead) return;
    const template = (emailSettings.templates || []).find((item) => item.id === templateId);
    if (!template) return;
    setReplyForm({
      templateId,
      subject: template.subject.replace(/\{\{name\}\}/g, selectedLead.name),
      message: template.body.replace(/\{\{name\}\}/g, selectedLead.name),
      htmlMessage: (template.htmlBody || "").replace(/\{\{name\}\}/g, selectedLead.name),
    });
  };

  const sendReply = async () => {
    if (!selectedLead) return;
    setReplying(true);
    try {
      const updated = await api.replyToLead(selectedLead.id, replyForm);
      setLeads((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedLead(null);
    } catch (error) {
      window.alert(error.message || "E-mail verzenden mislukt.");
    } finally {
      setReplying(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Contacts / Leads"
        sub={mailConfigured ? "Nieuwe inzendingen uit het contactformulier" : "Nieuwe inzendingen uit het contactformulier. SMTP is nog niet geconfigureerd."}
      />
      <Card>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #f2f2f2", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 120px 1.2fr", gap: "16px", fontSize: "11px", color: "#bbb", fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase" }}>
          <div>Naam</div>
          <div>E-mail</div>
          <div>Datum</div>
          <div>Status</div>
          <div style={{ textAlign: "right" }}>Acties</div>
        </div>
        {loadingLeads ? <div style={{ padding: "24px", color: "#999" }}>Contactaanvragen laden...</div> : null}
        {!loadingLeads && leadError ? <div style={{ padding: "24px", color: "#dc2626" }}>{leadError}</div> : null}
        {!loadingLeads && !leadError && !leads.length ? <div style={{ padding: "24px", color: "#999" }}>Nog geen contactaanvragen ontvangen.</div> : null}
        {!loadingLeads && !leadError ? leads.map((lead) => (
          <div key={lead.id} style={{ padding: "18px 22px", borderBottom: "1px solid #f5f5f5", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 120px 1.2fr", gap: "16px", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "13px", color: "#1c1c1c", marginBottom: "5px" }}>{lead.name}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>{lead.company || stripHtml(lead.message).slice(0, 90)}</div>
            </div>
            <div style={{ color: "#666", fontSize: "13px" }}>{lead.email}</div>
            <div style={{ color: "#666", fontSize: "13px" }}>{new Date(lead.createdAt).toLocaleDateString()}</div>
            <div style={{ color: lead.status === "replied" ? "#10b981" : "#f59e0b", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase" }}>{lead.status}</div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={() => setViewLead(lead)} style={{ padding: "7px 14px", background: "#f0f0f0", color: "#555", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase" }}>Bekijk</button>
              {lead.attachment?.publicUrl ? <Link to={lead.attachment.publicUrl} target="_blank" style={{ padding: "7px 14px", background: "#f0f0f0", color: "#555", borderRadius: "4px", textDecoration: "none", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase" }}>Bijlage</Link> : null}
              {can("leads.reply") ? <button onClick={() => openReply(lead)} style={{ padding: "7px 14px", background: "#f0f4e0", color: "#6b7a00", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase" }}>Mail</button> : null}
            </div>
          </div>
        )) : null}
      </Card>

      {viewLead ? (
        <Modal title={`Lead van ${viewLead.name}`} onClose={() => setViewLead(null)}>
          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "12px", fontSize: "14px", color: "#444" }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase", color: "#999", fontSize: "11px" }}>Naam</div>
              <div>{viewLead.name}</div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase", color: "#999", fontSize: "11px" }}>Bedrijf</div>
              <div>{viewLead.company || "-"}</div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase", color: "#999", fontSize: "11px" }}>E-mail</div>
              <div>{viewLead.email}</div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase", color: "#999", fontSize: "11px" }}>Telefoon</div>
              <div>{viewLead.phone || "-"}</div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase", color: "#999", fontSize: "11px" }}>Datum</div>
              <div>{new Date(viewLead.createdAt).toLocaleString()}</div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase", color: "#999", fontSize: "11px" }}>Status</div>
              <div>{viewLead.status}</div>
            </div>
            <div style={{ padding: "16px", background: "#fafafa", borderRadius: "8px", color: "#555", fontSize: "14px", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {viewLead.message}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              {viewLead.attachment?.publicUrl ? <Link to={viewLead.attachment.publicUrl} target="_blank" style={{ textDecoration: "none" }}><SecondaryButton type="button">Bijlage openen</SecondaryButton></Link> : null}
              {can("leads.reply") ? <PrimaryButton type="button" onClick={() => { setViewLead(null); openReply(viewLead); }}>Mail sturen</PrimaryButton> : null}
            </div>
          </div>
        </Modal>
      ) : null}

      {selectedLead ? (
        <Modal title={`Mail naar ${selectedLead.name}`} onClose={() => setSelectedLead(null)}>
          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ padding: "16px", background: "#fafafa", borderRadius: "8px", color: "#555", fontSize: "14px", lineHeight: 1.7 }}>
              <div><strong>E-mail:</strong> {selectedLead.email}</div>
              <div><strong>Telefoon:</strong> {selectedLead.phone || "-"}</div>
              <div><strong>Bericht:</strong></div>
              <div>{selectedLead.message}</div>
            </div>
            {!mailConfigured ? (
              <div style={{ padding: "14px 16px", background: "#fff7e6", color: "#8a5a00", borderRadius: "8px", fontSize: "13px", lineHeight: 1.6 }}>
                SMTP is nog niet geconfigureerd in <strong>server/.env</strong>. Je kunt het bericht hier wel voorbereiden, maar verzenden werkt pas nadat `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` en `SMTP_FROM` zijn ingesteld.
              </div>
            ) : null}
            <SelectField
              label="Template"
              value={replyForm.templateId || ""}
              onChange={applyTemplate}
              options={[
                { value: "", label: "Kies template" },
                ...((emailSettings.templates || []).map((item) => ({ value: item.id, label: item.name }))),
              ]}
            />
            <FormField label="Onderwerp" value={replyForm.subject} onChange={(value) => setReplyForm((prev) => ({ ...prev, subject: value }))} />
            <FormField label="Bericht" value={replyForm.message} onChange={(value) => setReplyForm((prev) => ({ ...prev, message: value }))} multiline rows={10} />
            <RichTextEditor label="HTML template" value={replyForm.htmlMessage} onChange={(value) => setReplyForm((prev) => ({ ...prev, htmlMessage: value }))} placeholder="Ontwerp hier je HTML e-mailtemplate..." />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <SecondaryButton type="button" onClick={() => setSelectedLead(null)}>Annuleren</SecondaryButton>
              <PrimaryButton type="button" onClick={sendReply} disabled={replying || !mailConfigured} style={{ opacity: replying || !mailConfigured ? 0.65 : 1 }}>{replying ? "Verzenden..." : "Verzend mail"}</PrimaryButton>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function CollectionRowActions({ editTo, publicTo, onDelete }) {
  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
      {publicTo ? (
        <Link to={publicTo} target="_blank" style={{ padding: "7px 14px", background: "#f0f0f0", color: "#555", borderRadius: "4px", textDecoration: "none", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase" }}>
          Bekijk
        </Link>
      ) : null}
      <Link to={editTo} style={{ padding: "7px 14px", background: "#f0f4e0", color: "#6b7a00", borderRadius: "4px", textDecoration: "none", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase" }}>
        Bewerk
      </Link>
      <button onClick={onDelete} style={{ padding: "7px 14px", background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase" }}>
        Verwijder
      </button>
    </div>
  );
}

function BlogListPage() {
  const { cms, updateCms } = useCms();

  const handleDelete = async (slug) => {
    if (!window.confirm("Weet je zeker dat je deze blogpost wilt verwijderen?")) {
      return;
    }
    await updateCms("blog", (cms.blog || []).filter((item) => (item.slug || item.id) !== slug));
  };

  return (
    <div>
      <SectionHeader title="Blog" sub="Elke post heeft een eigen create- en editpagina" action={<Link to="/admin/blog/new" style={{ textDecoration: "none" }}><PrimaryButton type="button">Nieuwe blogpost</PrimaryButton></Link>} />
      <Card>
        <div style={{ padding: "20px 22px", borderBottom: "1px solid #f2f2f2", display: "grid", gridTemplateColumns: "2fr 1fr 120px 1fr", gap: "16px", fontSize: "11px", color: "#bbb", fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase" }}>
          <div>Titel</div>
          <div>Categorie</div>
          <div>Status</div>
          <div style={{ textAlign: "right" }}>Acties</div>
        </div>
        {(cms.blog || []).map((post) => (
          <div key={post.slug || post.id} style={{ padding: "18px 22px", borderBottom: "1px solid #f5f5f5", display: "grid", gridTemplateColumns: "2fr 1fr 120px 1fr", gap: "16px", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "13px", color: "#1c1c1c", marginBottom: "5px" }}>{post.title}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>{stripHtml(post.excerpt).slice(0, 120)}</div>
            </div>
            <div style={{ color: "#666", fontSize: "13px" }}>{post.category}</div>
            <div style={{ color: post.status === "Gepubliceerd" ? "#10b981" : "#999", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", textTransform: "uppercase" }}>{post.status}</div>
            <CollectionRowActions editTo={`/admin/blog/${post.slug || post.id}/edit`} publicTo={`/blog/${post.slug || post.id}`} onDelete={() => handleDelete(post.slug || post.id)} />
          </div>
        ))}
        {!(cms.blog || []).length ? <div style={{ padding: "24px", color: "#999" }}>Nog geen blogposts.</div> : null}
      </Card>
    </div>
  );
}

function ServiceListPage() {
  const { cms, updateCms } = useCms();

  const handleDelete = async (slug) => {
    if (!window.confirm("Weet je zeker dat je deze dienst wilt verwijderen?")) {
      return;
    }
    await updateCms("diensten", (cms.diensten || []).filter((item) => item.id !== slug));
  };

  return (
    <div>
      <SectionHeader title="Diensten" sub="Elke dienst heeft een eigen create- en editpagina" action={<Link to="/admin/diensten/new" style={{ textDecoration: "none" }}><PrimaryButton type="button">Nieuwe dienst</PrimaryButton></Link>} />
      <Card>
        {(cms.diensten || []).map((item) => (
          <div key={item.id} style={{ padding: "18px 22px", borderBottom: "1px solid #f5f5f5", display: "grid", gridTemplateColumns: "90px 1.5fr 1fr 1fr", gap: "16px", alignItems: "center" }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", color: "#c8d400" }}>{item.nr}</div>
            <div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "13px", color: "#1c1c1c", marginBottom: "5px" }}>{item.title}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>{item.subtitle}</div>
            </div>
            <div style={{ color: "#666", fontSize: "13px" }}>{stripHtml(item.excerpt).slice(0, 90)}</div>
            <CollectionRowActions editTo={`/admin/diensten/${item.id}/edit`} publicTo={`/diensten/${item.id}`} onDelete={() => handleDelete(item.id)} />
          </div>
        ))}
        {!(cms.diensten || []).length ? <div style={{ padding: "24px", color: "#999" }}>Nog geen diensten.</div> : null}
      </Card>
    </div>
  );
}

function SectorListPage() {
  const { cms, updateCms } = useCms();

  const handleDelete = async (slug) => {
    if (!window.confirm("Weet je zeker dat je deze sector wilt verwijderen?")) {
      return;
    }
    await updateCms("sectoren", (cms.sectoren || []).filter((item) => item.id !== slug));
  };

  return (
    <div>
      <SectionHeader title="Sectoren" sub="Elke sector heeft een eigen create- en editpagina" action={<Link to="/admin/sectoren/new" style={{ textDecoration: "none" }}><PrimaryButton type="button">Nieuwe sector</PrimaryButton></Link>} />
      <Card>
        {(cms.sectoren || []).map((item) => (
          <div key={item.id} style={{ padding: "18px 22px", borderBottom: "1px solid #f5f5f5", display: "grid", gridTemplateColumns: "90px 1.5fr 1fr", gap: "16px", alignItems: "center" }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", color: "#c8d400" }}>{item.nr}</div>
            <div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "13px", color: "#1c1c1c", marginBottom: "5px" }}>{item.naam}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>{item.tagline}</div>
            </div>
            <CollectionRowActions editTo={`/admin/sectoren/${item.id}/edit`} onDelete={() => handleDelete(item.id)} />
          </div>
        ))}
        {!(cms.sectoren || []).length ? <div style={{ padding: "24px", color: "#999" }}>Nog geen sectoren.</div> : null}
      </Card>
    </div>
  );
}

function BlogFormPage() {
  const { slug } = useParams();
  const { cms, updateCms } = useCms();
  const navigate = useNavigate();
  const editing = Boolean(slug);
  const source = useMemo(() => (cms.blog || []).find((item) => (item.slug || item.id) === slug), [cms.blog, slug]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    date: "",
    readTime: "",
    status: "Concept",
    featured: false,
    excerpt: "",
    body: "",
    image: "",
    seoTitle: "",
    seoDescription: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (source) {
      setForm({
        title: source.title || "",
        slug: source.slug || source.id || "",
        category: source.category || "",
        date: source.date || "",
        readTime: source.readTime || "",
        status: source.status || "Concept",
        featured: Boolean(source.featured),
        excerpt: source.excerpt || "",
        body: source.body || "",
        image: source.image || "",
        seoTitle: source.seoTitle || "",
        seoDescription: source.seoDescription || "",
      });
    }
  }, [source]);

  if (editing && !source) {
    return <Navigate to="/admin/blog" replace />;
  }

  const setField = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    const finalSlug = makeSlug(form.slug || form.title, "blog-post");
    const payload = { ...form, slug: finalSlug };
    const items = editing
      ? (cms.blog || []).map((item) => ((item.slug || item.id) === slug ? { ...item, ...payload, id: finalSlug } : item))
      : [...(cms.blog || []), { ...payload, id: finalSlug }];

    const ok = await updateCms("blog", items);
    setSaving(false);
    if (ok) {
      setMessage("Blogpost opgeslagen.");
      navigate("/admin/blog");
    }
  };

  return (
    <div>
      <SectionHeader title={editing ? "Blogpost Bewerken" : "Nieuwe Blogpost"} sub="Titel, inhoud, rich text en SEO op een eigen pagina" />
      <Card style={{ padding: "28px", maxWidth: "980px" }}>
        <div style={{ display: "grid", gap: "18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "16px" }}>
            <FormField label="Titel" value={form.title} onChange={setField("title")} />
            <FormField label="Slug" value={form.slug} onChange={setField("slug")} placeholder="automatisch uit titel" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 160px 160px", gap: "16px" }}>
            <FormField label="Categorie" value={form.category} onChange={setField("category")} />
            <FormField label="Datum" value={form.date} onChange={setField("date")} placeholder="17 april 2026" />
            <FormField label="Leestijd" value={form.readTime} onChange={setField("readTime")} placeholder="4 min" />
            <SelectField label="Status" value={form.status} onChange={setField("status")} options={[{ value: "Concept", label: "Concept" }, { value: "Gepubliceerd", label: "Gepubliceerd" }]} />
          </div>
          <CheckboxField label="Uitgelichte blogpost" checked={form.featured} onChange={setField("featured")} />
          <FormField label="Excerpt" value={form.excerpt} onChange={setField("excerpt")} multiline rows={4} />
          <RichTextEditor label="Beschrijving / artikelinhoud" value={form.body} onChange={setField("body")} />
          <ImageUpload label="Uitgelichte afbeelding" value={form.image} onChange={setField("image")} />
          <Card style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "16px" }}>SEO Meta Info</div>
            <div style={{ display: "grid", gap: "16px" }}>
              <FormField label="Meta title" value={form.seoTitle} onChange={setField("seoTitle")} />
              <FormField label="Meta description" value={form.seoDescription} onChange={setField("seoDescription")} multiline rows={3} />
            </div>
          </Card>
        </div>
        <SaveBar saving={saving} message={message} onSave={save} saveLabel={editing ? "Wijzigingen opslaan" : "Blogpost aanmaken"} />
      </Card>
    </div>
  );
}

function ServiceFormPage() {
  const { slug } = useParams();
  const { cms, updateCms } = useCms();
  const navigate = useNavigate();
  const editing = Boolean(slug);
  const source = useMemo(() => (cms.diensten || []).find((item) => item.id === slug), [cms.diensten, slug]);
  const [form, setForm] = useState({
    nr: "",
    title: "",
    subtitle: "",
    slug: "",
    excerpt: "",
    checklist: "",
    body: "",
    image: "",
    seoTitle: "",
    seoDescription: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (source) {
      setForm({
        nr: source.nr || "",
        title: source.title || "",
        subtitle: source.subtitle || "",
        slug: source.id || "",
        excerpt: source.excerpt || "",
        checklist: source.checklist || "",
        body: source.body || "",
        image: source.image || "",
        seoTitle: source.seoTitle || "",
        seoDescription: source.seoDescription || "",
      });
    }
  }, [source]);

  if (editing && !source) {
    return <Navigate to="/admin/diensten" replace />;
  }

  const setField = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    const finalSlug = makeSlug(form.slug || form.title, "dienst");
    const payload = { ...form, id: finalSlug };
    const items = editing
      ? (cms.diensten || []).map((item) => (item.id === slug ? payload : item))
      : [...(cms.diensten || []), payload];

    const ok = await updateCms("diensten", items);
    setSaving(false);
    if (ok) {
      setMessage("Dienst opgeslagen.");
      navigate("/admin/diensten");
    }
  };

  return (
    <div>
      <SectionHeader title={editing ? "Dienst Bewerken" : "Nieuwe Dienst"} sub="Eigen pagina voor inhoud, checklist en SEO" />
      <Card style={{ padding: "28px", maxWidth: "980px" }}>
        <div style={{ display: "grid", gap: "18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1.4fr 1fr", gap: "16px" }}>
            <FormField label="Nummer" value={form.nr} onChange={setField("nr")} />
            <FormField label="Titel" value={form.title} onChange={setField("title")} />
            <FormField label="Slug" value={form.slug} onChange={setField("slug")} />
          </div>
          <FormField label="Subtitel" value={form.subtitle} onChange={setField("subtitle")} />
          <FormField label="Korte beschrijving" value={form.excerpt} onChange={setField("excerpt")} multiline rows={3} />
          <FormField label="Checklist (één per regel)" value={form.checklist} onChange={setField("checklist")} multiline rows={6} />
          <RichTextEditor label="Beschrijving" value={form.body} onChange={setField("body")} />
          <ImageUpload label="Afbeelding" value={form.image} onChange={setField("image")} />
          <Card style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "16px" }}>SEO Meta Info</div>
            <div style={{ display: "grid", gap: "16px" }}>
              <FormField label="Meta title" value={form.seoTitle} onChange={setField("seoTitle")} />
              <FormField label="Meta description" value={form.seoDescription} onChange={setField("seoDescription")} multiline rows={3} />
            </div>
          </Card>
        </div>
        <SaveBar saving={saving} message={message} onSave={save} saveLabel={editing ? "Wijzigingen opslaan" : "Dienst aanmaken"} />
      </Card>
    </div>
  );
}

function SectorFormPage() {
  const { slug } = useParams();
  const { cms, updateCms } = useCms();
  const navigate = useNavigate();
  const editing = Boolean(slug);
  const source = useMemo(() => (cms.sectoren || []).find((item) => item.id === slug), [cms.sectoren, slug]);
  const [form, setForm] = useState({
    nr: "",
    naam: "",
    tagline: "",
    slug: "",
    description: "",
    intro: "",
    items: "",
    image: "",
    seoTitle: "",
    seoDescription: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (source) {
      setForm({
        nr: source.nr || "",
        naam: source.naam || "",
        tagline: source.tagline || "",
        slug: source.id || "",
        description: source.description || "",
        intro: source.intro || "",
        items: source.items || "",
        image: source.image || "",
        seoTitle: source.seoTitle || "",
        seoDescription: source.seoDescription || "",
      });
    }
  }, [source]);

  if (editing && !source) {
    return <Navigate to="/admin/sectoren" replace />;
  }

  const setField = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    const finalSlug = makeSlug(form.slug || form.naam, "sector");
    const payload = { ...form, id: finalSlug };
    const items = editing
      ? (cms.sectoren || []).map((item) => (item.id === slug ? payload : item))
      : [...(cms.sectoren || []), payload];

    const ok = await updateCms("sectoren", items);
    setSaving(false);
    if (ok) {
      setMessage("Sector opgeslagen.");
      navigate("/admin/sectoren");
    }
  };

  return (
    <div>
      <SectionHeader title={editing ? "Sector Bewerken" : "Nieuwe Sector"} sub="Eigen pagina voor sectorinformatie en SEO" />
      <Card style={{ padding: "28px", maxWidth: "980px" }}>
        <div style={{ display: "grid", gap: "18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1.4fr 1fr", gap: "16px" }}>
            <FormField label="Nummer" value={form.nr} onChange={setField("nr")} />
            <FormField label="Naam" value={form.naam} onChange={setField("naam")} />
            <FormField label="Slug" value={form.slug} onChange={setField("slug")} />
          </div>
          <FormField label="Tagline" value={form.tagline} onChange={setField("tagline")} />
          <RichTextEditor label="Korte beschrijving" value={form.description} onChange={setField("description")} />
          <RichTextEditor label="Intro" value={form.intro} onChange={setField("intro")} />
          <FormField label="USP / items (één per regel)" value={form.items} onChange={setField("items")} multiline rows={6} />
          <ImageUpload label="Afbeelding" value={form.image} onChange={setField("image")} />
          <Card style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "16px" }}>SEO Meta Info</div>
            <div style={{ display: "grid", gap: "16px" }}>
              <FormField label="Meta title" value={form.seoTitle} onChange={setField("seoTitle")} />
              <FormField label="Meta description" value={form.seoDescription} onChange={setField("seoDescription")} multiline rows={3} />
            </div>
          </Card>
        </div>
        <SaveBar saving={saving} message={message} onSave={save} saveLabel={editing ? "Wijzigingen opslaan" : "Sector aanmaken"} />
      </Card>
    </div>
  );
}

function HomepagePage() {
  const { cms, updateCms } = useCms();
  const [hero, setHero] = useState(cms.hero || {});
  const [watFerna, setWatFerna] = useState(cms.watFerna || {});
  const [anders, setAnders] = useState(cms.anders || { items: [] });
  const [projecten, setProjecten] = useState(cms.projecten || []);
  const [faq, setFaq] = useState(cms.faq || []);
  const [statsText, setStatsText] = useState(() => (cms.stats || []).map((item) => `${item.number} | ${item.desc}`).join("\n"));
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setHero(cms.hero || {});
    setWatFerna(cms.watFerna || {});
    setAnders(cms.anders || { items: [] });
    setProjecten(cms.projecten || []);
    setFaq(cms.faq || []);
    setStatsText((cms.stats || []).map((item) => `${item.number} | ${item.desc}`).join("\n"));
  }, [cms]);

  const saveSection = async (key, value) => {
    const ok = await updateCms(key, value);
    if (ok) {
      setSaved(key);
      window.setTimeout(() => setSaved(""), 1600);
    }
  };

  return (
    <div style={{ display: "grid", gap: "24px", maxWidth: "1040px" }}>
      <SectionHeader title="Homepage" sub="Elke homepage-sectie heeft hier zijn eigen blok" />

      <Card style={{ padding: "24px" }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>Hero</div>
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <FormField label="Titel regel 1" value={hero.line1} onChange={(value) => setHero((prev) => ({ ...prev, line1: value }))} />
            <FormField label="Titel regel 2" value={hero.line2} onChange={(value) => setHero((prev) => ({ ...prev, line2: value }))} />
          </div>
          <FormField label="Subtitel" value={hero.subtitle} onChange={(value) => setHero((prev) => ({ ...prev, subtitle: value }))} multiline rows={4} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <FormField label="CTA tekst" value={hero.cta} onChange={(value) => setHero((prev) => ({ ...prev, cta: value }))} />
            <FormField label="CTA link" value={hero.ctaLink} onChange={(value) => setHero((prev) => ({ ...prev, ctaLink: value }))} />
          </div>
          <FormField label="USP's (één per regel)" value={toMultiline(hero.checkItems)} onChange={(value) => setHero((prev) => ({ ...prev, checkItems: parseLines(value) }))} multiline rows={5} />
          <ImageUpload label="Hero afbeelding" value={hero.image || ""} onChange={(value) => setHero((prev) => ({ ...prev, image: value }))} />
        </div>
        <SaveBar saving={false} message={saved === "hero" ? "Hero opgeslagen." : ""} onSave={() => saveSection("hero", hero)} />
      </Card>

      <Card style={{ padding: "24px" }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>Stats</div>
        <FormField label="Één item per regel in formaat: getal | omschrijving" value={statsText} onChange={setStatsText} multiline rows={6} />
        <SaveBar saving={false} message={saved === "stats" ? "Stats opgeslagen." : ""} onSave={() => saveSection("stats", parseLines(statsText).map((line) => {
          const [number, ...descParts] = line.split("|");
          return { number: (number || "").trim(), desc: descParts.join("|").trim() };
        }))} />
      </Card>

      <Card style={{ padding: "24px" }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>Wat FerroWorks Voor Je Doet</div>
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <FormField label="Titel regel 1" value={watFerna.title1} onChange={(value) => setWatFerna((prev) => ({ ...prev, title1: value }))} />
            <FormField label="Titel regel 2" value={watFerna.title2} onChange={(value) => setWatFerna((prev) => ({ ...prev, title2: value }))} />
          </div>
          <FormField label="Bullet items (één per regel)" value={toMultiline(watFerna.bulletItems)} onChange={(value) => setWatFerna((prev) => ({ ...prev, bulletItems: parseLines(value) }))} multiline rows={8} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <ImageUpload label="Afbeelding 1" value={watFerna.image1 || ""} onChange={(value) => setWatFerna((prev) => ({ ...prev, image1: value }))} />
            <ImageUpload label="Afbeelding 2" value={watFerna.image2 || ""} onChange={(value) => setWatFerna((prev) => ({ ...prev, image2: value }))} />
          </div>
        </div>
        <SaveBar saving={false} message={saved === "watFerna" ? "Sectie opgeslagen." : ""} onSave={() => saveSection("watFerna", watFerna)} />
      </Card>

      <Card style={{ padding: "24px" }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>Wat Ons Anders Maakt</div>
        <div style={{ display: "grid", gap: "16px" }}>
          {(anders.items || []).map((item, index) => (
            <Card key={index} style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
              <div style={{ display: "grid", gap: "14px" }}>
                <FormField label={`Titel ${index + 1}`} value={item.title} onChange={(value) => setAnders((prev) => ({ ...prev, items: prev.items.map((row, rowIndex) => rowIndex === index ? { ...row, title: value } : row) }))} />
                <FormField label="Omschrijving" value={item.desc} onChange={(value) => setAnders((prev) => ({ ...prev, items: prev.items.map((row, rowIndex) => rowIndex === index ? { ...row, desc: value } : row) }))} multiline rows={3} />
              </div>
            </Card>
          ))}
          <ImageUpload label="Sectie afbeelding" value={anders.image || ""} onChange={(value) => setAnders((prev) => ({ ...prev, image: value }))} />
        </div>
        <SaveBar saving={false} message={saved === "anders" ? "Sectie opgeslagen." : ""} onSave={() => saveSection("anders", anders)} />
      </Card>

      <Card style={{ padding: "24px" }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>Projecten</div>
        <div style={{ display: "grid", gap: "16px" }}>
          {projecten.map((project, index) => (
            <Card key={index} style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
              <div style={{ display: "grid", gap: "14px" }}>
                <FormField label="Titel" value={project.title} onChange={(value) => setProjecten((prev) => prev.map((row, rowIndex) => rowIndex === index ? { ...row, title: value } : row))} />
                <FormField label="Beschrijving" value={project.desc} onChange={(value) => setProjecten((prev) => prev.map((row, rowIndex) => rowIndex === index ? { ...row, desc: value } : row))} multiline rows={3} />
                <ImageUpload label="Afbeelding" value={project.image || ""} onChange={(value) => setProjecten((prev) => prev.map((row, rowIndex) => rowIndex === index ? { ...row, image: value } : row))} />
              </div>
            </Card>
          ))}
        </div>
        <SaveBar saving={false} message={saved === "projecten" ? "Projecten opgeslagen." : ""} onSave={() => saveSection("projecten", projecten)} />
      </Card>

      <Card style={{ padding: "24px" }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>FAQ</div>
        <div style={{ display: "grid", gap: "16px" }}>
          {faq.map((item, index) => (
            <Card key={index} style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
              <div style={{ display: "grid", gap: "14px" }}>
                <FormField label="Vraag" value={item.q} onChange={(value) => setFaq((prev) => prev.map((row, rowIndex) => rowIndex === index ? { ...row, q: value } : row))} />
                <FormField label="Antwoord" value={item.a} onChange={(value) => setFaq((prev) => prev.map((row, rowIndex) => rowIndex === index ? { ...row, a: value } : row))} multiline rows={4} />
              </div>
            </Card>
          ))}
        </div>
        <SaveBar saving={false} message={saved === "faq" ? "FAQ opgeslagen." : ""} onSave={() => saveSection("faq", faq)} />
      </Card>
    </div>
  );
}

function AboutPage() {
  const { cms, updateCms } = useCms();
  const [overOns, setOverOns] = useState(cms.overOns || {});
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setOverOns(cms.overOns || {});
  }, [cms]);

  const updateNested = (section, field, value) => {
    setOverOns((prev) => ({ ...prev, [section]: { ...(prev[section] || {}), [field]: value } }));
  };

  const save = async () => {
    const ok = await updateCms("overOns", overOns);
    if (ok) {
      setSaved("Over Ons opgeslagen.");
      window.setTimeout(() => setSaved(""), 1600);
    }
  };

  return (
    <div style={{ display: "grid", gap: "24px", maxWidth: "1040px" }}>
      <SectionHeader title="Over Ons" sub="Alle content van de Over Ons-pagina op één dedicated beheerpagina" />

      <Card style={{ padding: "24px" }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>Ons Verhaal</div>
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <FormField label="Titel regel 1" value={overOns.verhaal?.title1} onChange={(value) => updateNested("verhaal", "title1", value)} />
            <FormField label="Titel regel 2" value={overOns.verhaal?.title2} onChange={(value) => updateNested("verhaal", "title2", value)} />
          </div>
          <FormField label="Tekst 1" value={overOns.verhaal?.tekst1} onChange={(value) => updateNested("verhaal", "tekst1", value)} multiline rows={4} />
          <FormField label="Tekst 2" value={overOns.verhaal?.tekst2} onChange={(value) => updateNested("verhaal", "tekst2", value)} multiline rows={4} />
          <FormField label="Tekst 3" value={overOns.verhaal?.tekst3} onChange={(value) => updateNested("verhaal", "tekst3", value)} multiline rows={4} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <ImageUpload label="Afbeelding 1" value={overOns.verhaal?.image1 || ""} onChange={(value) => updateNested("verhaal", "image1", value)} />
            <ImageUpload label="Afbeelding 2" value={overOns.verhaal?.image2 || ""} onChange={(value) => updateNested("verhaal", "image2", value)} />
          </div>
        </div>
      </Card>

      <Card style={{ padding: "24px" }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>Wat We Doen</div>
        <div style={{ display: "grid", gap: "16px" }}>
          <FormField label="Items (één per regel)" value={toMultiline(overOns.watWeDoen?.items)} onChange={(value) => updateNested("watWeDoen", "items", parseLines(value))} multiline rows={8} />
          <ImageUpload label="Afbeelding" value={overOns.watWeDoen?.image || ""} onChange={(value) => updateNested("watWeDoen", "image", value)} />
        </div>
      </Card>

      <Card style={{ padding: "24px" }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>Anders Maakt</div>
        <div style={{ display: "grid", gap: "16px" }}>
          {(overOns.andersItems || []).map((item, index) => (
            <Card key={index} style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
              <div style={{ display: "grid", gap: "14px" }}>
                <FormField label="Titel" value={item.title} onChange={(value) => setOverOns((prev) => ({ ...prev, andersItems: prev.andersItems.map((row, rowIndex) => rowIndex === index ? { ...row, title: value } : row) }))} />
                <FormField label="Omschrijving" value={item.desc} onChange={(value) => setOverOns((prev) => ({ ...prev, andersItems: prev.andersItems.map((row, rowIndex) => rowIndex === index ? { ...row, desc: value } : row) }))} multiline rows={3} />
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card style={{ padding: "24px" }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>Team</div>
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <FormField label="Titel regel 1" value={overOns.team?.title1} onChange={(value) => updateNested("team", "title1", value)} />
            <FormField label="Titel regel 2" value={overOns.team?.title2} onChange={(value) => updateNested("team", "title2", value)} />
          </div>
          <FormField label="Tekst 1" value={overOns.team?.tekst1} onChange={(value) => updateNested("team", "tekst1", value)} multiline rows={4} />
          <FormField label="Tekst 2" value={overOns.team?.tekst2} onChange={(value) => updateNested("team", "tekst2", value)} multiline rows={4} />
          <FormField label="Team items (één per regel)" value={toMultiline(overOns.team?.items)} onChange={(value) => updateNested("team", "items", parseLines(value))} multiline rows={6} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <ImageUpload label="Afbeelding 1" value={overOns.team?.image1 || ""} onChange={(value) => updateNested("team", "image1", value)} />
            <ImageUpload label="Afbeelding 2" value={overOns.team?.image2 || ""} onChange={(value) => updateNested("team", "image2", value)} />
            <ImageUpload label="Afbeelding 3" value={overOns.team?.image3 || ""} onChange={(value) => updateNested("team", "image3", value)} />
          </div>
        </div>
      </Card>

      <SaveBar saving={false} message={saved} onSave={save} />
    </div>
  );
}

function PagesPage() {
  const { cms, updateCms } = useCms();
  const [pages, setPages] = useState(cms.pages || []);
  const [activeKey, setActiveKey] = useState((cms.pages || [])[0]?.key || "");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setPages(cms.pages || []);
    if (!activeKey && cms.pages?.length) {
      setActiveKey(cms.pages[0].key);
    }
  }, [cms.pages, activeKey]);

  const activePage = pages.find((item) => item.key === activeKey) || pages[0];

  const updatePage = (field, value) => {
    setPages((prev) => prev.map((item) => item.key === activePage.key ? { ...item, [field]: value } : item));
  };

  const save = async () => {
    const ok = await updateCms("pages", pages);
    if (ok) {
      setSaved("Pagina-instellingen opgeslagen.");
      window.setTimeout(() => setSaved(""), 1600);
    }
  };

  if (!activePage) {
    return null;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px minmax(0, 1fr)", gap: "24px" }}>
      <div>
        <SectionHeader title="Pages" sub="SEO, indexatie en statische pagina-inhoud" />
        <Card>
          {pages.map((page) => (
            <button
              key={page.key}
              type="button"
              onClick={() => setActiveKey(page.key)}
              style={{ width: "100%", textAlign: "left", padding: "18px 20px", border: "none", borderBottom: "1px solid #f2f2f2", background: page.key === activeKey ? "#f8fbeb" : "#fff", cursor: "pointer" }}
            >
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "4px" }}>{page.name}</div>
              <div style={{ color: "#888", fontSize: "12px" }}>{page.path}</div>
            </button>
          ))}
        </Card>
      </div>
      <div>
        <Card style={{ padding: "28px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "16px" }}>
              <FormField label="Naam" value={activePage.name} onChange={(value) => updatePage("name", value)} />
              <div>
                <FieldLabel>Path</FieldLabel>
                <div style={{ ...baseInputStyle(), background: "#f7f7f7", color: "#666" }}>{activePage.path}</div>
              </div>
            </div>
            <CheckboxField label="Opnemen in index / sitemap" checked={activePage.isIndexed} onChange={(value) => updatePage("isIndexed", value)} />
            <FormField label="Meta title" value={activePage.metaTitle} onChange={(value) => updatePage("metaTitle", value)} />
            <FormField label="Meta description" value={activePage.metaDescription} onChange={(value) => updatePage("metaDescription", value)} multiline rows={3} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Hero title" value={activePage.heroTitle} onChange={(value) => updatePage("heroTitle", value)} />
              <FormField label="Hero subtitle" value={activePage.heroSubtitle} onChange={(value) => updatePage("heroSubtitle", value)} />
            </div>
            {["privacy", "terms"].includes(activePage.key) ? <RichTextEditor label="Pagina-inhoud" value={activePage.body || ""} onChange={(value) => updatePage("body", value)} /> : null}
          </div>
          <SaveBar saving={false} message={saved} onSave={save} />
        </Card>
      </div>
    </div>
  );
}

function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [selectedId, setSelectedId] = useState("new");
  const blankForm = {
    id: "new",
    name: "",
    email: "",
    password: "",
    role: "editor",
    isActive: true,
    customPermissions: [],
  };
  const [form, setForm] = useState(blankForm);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const data = await api.getStaff();
      setStaff(data.items || []);
      setRoles(data.roles || []);
      setPermissions(data.permissions || []);
      if (selectedId !== "new" && !(data.items || []).some((item) => item.id === selectedId)) {
        setSelectedId("new");
        setForm(blankForm);
      }
    } catch (error) {
      window.alert(error.message || "Kon staff niet laden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const selectedRole = useMemo(
    () => roles.find((item) => item.key === form.role) || roles[0] || { key: "editor", permissions: [] },
    [roles, form.role],
  );

  const effectivePermissions = useMemo(() => {
    if ((selectedRole.permissions || []).includes("*")) {
      return ["*"];
    }
    return Array.from(new Set([...(selectedRole.permissions || []), ...(form.customPermissions || [])]));
  }, [selectedRole, form.customPermissions]);

  const selectStaff = (item) => {
    if (!item) {
      setSelectedId("new");
      setForm(blankForm);
      return;
    }

    const basePermissions = (item.role === "owner" ? [] : (roles.find((role) => role.key === item.role)?.permissions || []).filter((permission) => permission !== "*"));
    const customPermissions = (item.permissions || []).filter((permission) => permission !== "*" && !basePermissions.includes(permission));
    setSelectedId(item.id);
    setForm({
      id: item.id,
      name: item.name || "",
      email: item.email || "",
      password: "",
      role: item.role || "editor",
      isActive: item.isActive !== false,
      customPermissions,
    });
  };

  const togglePermission = (permissionKey) => {
    setForm((prev) => ({
      ...prev,
      customPermissions: prev.customPermissions.includes(permissionKey)
        ? prev.customPermissions.filter((item) => item !== permissionKey)
        : [...prev.customPermissions, permissionKey],
    }));
  };

  const save = async () => {
    try {
      setSaving(true);
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        isActive: form.isActive,
        customPermissions: form.role === "owner" ? [] : form.customPermissions,
      };
      if (selectedId === "new") {
        await api.createStaff(payload);
      } else {
        await api.updateStaff(selectedId, payload);
      }
      await loadStaff();
      setSaved(selectedId === "new" ? "Staff account aangemaakt." : "Staff account bijgewerkt.");
      window.setTimeout(() => setSaved(""), 1600);
      setForm((prev) => ({ ...prev, password: "" }));
      if (selectedId === "new") {
        setSelectedId("new");
      }
    } catch (error) {
      window.alert(error.message || "Opslaan mislukt.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: "#666" }}>Staff laden...</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px minmax(0, 1fr)", gap: "24px" }}>
      <div>
        <SectionHeader
          title="Staff"
          sub="Beheer teamaccounts, rollen en extra rechten"
          action={<PrimaryButton type="button" onClick={() => selectStaff(null)}>Nieuw account</PrimaryButton>}
        />
        <Card>
          {staff.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectStaff(item)}
              style={{ width: "100%", textAlign: "left", padding: "18px 20px", border: "none", borderBottom: "1px solid #f2f2f2", background: item.id === selectedId ? "#f8fbeb" : "#fff", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c" }}>{item.name}</div>
                <div style={{ fontSize: "10px", color: item.isActive ? "#10b981" : "#999", textTransform: "uppercase", fontFamily: "Arial Black, Arial, sans-serif" }}>
                  {item.isActive ? "Actief" : "Inactief"}
                </div>
              </div>
              <div style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>{item.email}</div>
              <div style={{ color: "#666", fontSize: "11px", marginTop: "8px", textTransform: "capitalize" }}>{item.role}</div>
            </button>
          ))}
        </Card>
      </div>
      <div>
        <Card style={{ padding: "28px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Naam" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
              <FormField label="E-mail" value={form.email} onChange={(value) => setForm((prev) => ({ ...prev, email: value }))} type="email" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "16px" }}>
              <FormField label={selectedId === "new" ? "Wachtwoord" : "Nieuw wachtwoord (optioneel)"} value={form.password} onChange={(value) => setForm((prev) => ({ ...prev, password: value }))} type="password" />
              <SelectField
                label="Rol"
                value={form.role}
                onChange={(value) => setForm((prev) => ({ ...prev, role: value, customPermissions: [] }))}
                options={roles.map((role) => ({ value: role.key, label: role.label }))}
              />
            </div>
            <CheckboxField label="Account actief" checked={form.isActive} onChange={(value) => setForm((prev) => ({ ...prev, isActive: value }))} />

            <Card style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "8px" }}>Rolbeschrijving</div>
              <div style={{ color: "#666", fontSize: "13px", lineHeight: 1.7 }}>{selectedRole.description || "Geen beschrijving beschikbaar."}</div>
            </Card>

            <Card style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "16px" }}>Extra permissies</div>
              {form.role === "owner" ? (
                <div style={{ color: "#666", fontSize: "13px" }}>Owner heeft altijd volledige toegang.</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  {permissions.map((permission) => {
                    const inherited = (selectedRole.permissions || []).includes(permission.key);
                    return (
                      <label key={permission.key} style={{ border: "1px solid #e8e8e8", borderRadius: "8px", padding: "12px 14px", background: inherited ? "#f2f7df" : "#fff", cursor: inherited ? "default" : "pointer", opacity: inherited ? 0.9 : 1 }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <input type="checkbox" checked={inherited || form.customPermissions.includes(permission.key)} disabled={inherited} onChange={() => togglePermission(permission.key)} />
                          <div>
                            <div style={{ fontSize: "13px", color: "#1c1c1c", fontWeight: 600 }}>{permission.label}</div>
                            <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>{permission.key}{inherited ? " • via rol" : ""}</div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "10px" }}>Effectieve toegang</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {effectivePermissions.includes("*") ? (
                  <span style={{ padding: "6px 10px", borderRadius: "999px", background: "#1c1c1c", color: "#fff", fontSize: "11px", textTransform: "uppercase", fontFamily: "Arial Black, Arial, sans-serif" }}>Volledige toegang</span>
                ) : effectivePermissions.map((item) => (
                  <span key={item} style={{ padding: "6px 10px", borderRadius: "999px", background: "#fff", color: "#555", fontSize: "11px", border: "1px solid #e6e6e6" }}>{item}</span>
                ))}
              </div>
            </Card>
          </div>
          <SaveBar saving={saving} message={saved} onSave={save} saveLabel={selectedId === "new" ? "Staff aanmaken" : "Wijzigingen opslaan"} />
        </Card>
      </div>
    </div>
  );
}

function SettingsPage() {
  const { cms, updateCms } = useCms();
  const [tab, setTab] = useState("general");
  const [site, setSite] = useState(cms.site || {});
  const [websiteSettings, setWebsiteSettings] = useState(cms.websiteSettings || {});
  const [emailSettings, setEmailSettings] = useState({ host: "", port: 587, secure: false, user: "", pass: "", hasPassword: false, from: "", replyTo: "", templates: [], mailConfigured: false });
  const [testEmail, setTestEmail] = useState("");
  const [saved, setSaved] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);

  useEffect(() => {
    setSite(cms.site || {});
    setWebsiteSettings(cms.websiteSettings || {});
  }, [cms]);

  useEffect(() => {
    api.getEmailSettings()
      .then((data) => setEmailSettings(data))
      .catch(() => {});
  }, []);

  const setField = (key) => (value) => setSite((prev) => ({ ...prev, [key]: value }));
  const setEmailField = (key) => (value) => setEmailSettings((prev) => ({ ...prev, [key]: value }));

  const saveGeneral = async () => {
    const ok = await updateCms("site", site);
    if (ok) {
      setSaved("Algemene instellingen opgeslagen.");
      window.setTimeout(() => setSaved(""), 1600);
    }
  };

  const saveWebsite = async () => {
    const ok = await updateCms("websiteSettings", websiteSettings);
    if (ok) {
      setSaved("Website-instellingen opgeslagen.");
      window.setTimeout(() => setSaved(""), 1600);
    }
  };

  const saveEmail = async () => {
    try {
      setEmailBusy(true);
      const updated = await api.updateEmailSettings(emailSettings);
      setEmailSettings((prev) => ({ ...prev, ...updated, pass: "" }));
      setSaved("E-mailconfiguratie opgeslagen.");
      window.setTimeout(() => setSaved(""), 1600);
    } catch (error) {
      window.alert(error.message || "Opslaan mislukt.");
    } finally {
      setEmailBusy(false);
    }
  };

  const sendTest = async () => {
    try {
      setEmailBusy(true);
      await api.sendTestEmail(testEmail);
      setSaved("Test e-mail verzonden.");
      window.setTimeout(() => setSaved(""), 1600);
    } catch (error) {
      window.alert(error.message || "Test e-mail mislukt.");
    } finally {
      setEmailBusy(false);
    }
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "website", label: "Website" },
    { id: "email", label: "Email" },
  ];

  return (
    <div>
      <SectionHeader title="Settings" sub="Website, robots.txt, SMTP en e-mailtemplates" />
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} style={{ padding: "10px 18px", border: "none", borderRadius: "999px", cursor: "pointer", background: tab === item.id ? "#1c1c1c" : "#fff", color: tab === item.id ? "#fff" : "#666", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "11px", textTransform: "uppercase" }}>
            {item.label}
          </button>
        ))}
      </div>

      <Card style={{ padding: "28px", width: "100%" }}>
        {tab === "general" ? (
          <div style={{ display: "grid", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Bedrijfsnaam" value={site.naam} onChange={setField("naam")} />
              <FormField label="Tagline" value={site.tagline} onChange={setField("tagline")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Telefoon" value={site.tel} onChange={setField("tel")} />
              <FormField label="E-mail" value={site.email} onChange={setField("email")} />
            </div>
            <FormField label="Adres" value={site.adres} onChange={setField("adres")} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px" }}>
              <FormField label="KVK" value={site.kvk} onChange={setField("kvk")} />
              <FormField label="BTW" value={site.btw} onChange={setField("btw")} />
              <FormField label="Website" value={site.website} onChange={setField("website")} />
              <FormField label="LinkedIn" value={site.linkedin} onChange={setField("linkedin")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Instagram" value={site.instagram} onChange={setField("instagram")} />
              <FormField label="Facebook" value={site.facebook} onChange={setField("facebook")} />
            </div>
            <Card style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
              <div style={{ display: "grid", gap: "16px" }}>
                <FormField label="Globale meta title" value={site.metaTitle} onChange={setField("metaTitle")} />
                <FormField label="Globale meta description" value={site.metaDesc} onChange={setField("metaDesc")} multiline rows={4} />
              </div>
            </Card>
            <SaveBar saving={false} message={saved} onSave={saveGeneral} />
          </div>
        ) : null}

        {tab === "website" ? (
          <div style={{ display: "grid", gap: "18px" }}>
            <FormField label="Default OG image URL" value={websiteSettings.defaultOgImage || ""} onChange={(value) => setWebsiteSettings((prev) => ({ ...prev, defaultOgImage: value }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Google Analytics ID" value={websiteSettings.googleAnalyticsId || ""} onChange={(value) => setWebsiteSettings((prev) => ({ ...prev, googleAnalyticsId: value }))} placeholder="G-XXXXXXXXXX" />
              <FormField label="Google Tag Manager ID" value={websiteSettings.googleTagManagerId || ""} onChange={(value) => setWebsiteSettings((prev) => ({ ...prev, googleTagManagerId: value }))} placeholder="GTM-XXXXXXX" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Meta Pixel ID" value={websiteSettings.metaPixelId || ""} onChange={(value) => setWebsiteSettings((prev) => ({ ...prev, metaPixelId: value }))} placeholder="123456789012345" />
              <FormField label="LinkedIn Insight Tag ID" value={websiteSettings.linkedInInsightTagId || ""} onChange={(value) => setWebsiteSettings((prev) => ({ ...prev, linkedInInsightTagId: value }))} placeholder="1234567" />
            </div>
            <Card style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "16px" }}>Tracking status</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px" }}>
                {[
                  { label: "GA4", active: Boolean(websiteSettings.googleAnalyticsId), value: websiteSettings.googleAnalyticsId || "Niet ingesteld" },
                  { label: "GTM", active: Boolean(websiteSettings.googleTagManagerId), value: websiteSettings.googleTagManagerId || "Niet ingesteld" },
                  { label: "Meta Pixel", active: Boolean(websiteSettings.metaPixelId), value: websiteSettings.metaPixelId || "Niet ingesteld" },
                  { label: "LinkedIn", active: Boolean(websiteSettings.linkedInInsightTagId), value: websiteSettings.linkedInInsightTagId || "Niet ingesteld" },
                ].map((item) => (
                  <div key={item.label} style={{ padding: "14px", background: "#fff", border: "1px solid #eee", borderRadius: "8px" }}>
                    <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "11px", textTransform: "uppercase", color: item.active ? "#10b981" : "#999", marginBottom: "8px" }}>{item.label}</div>
                    <div style={{ fontSize: "12px", color: "#555", wordBreak: "break-word" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </Card>
            <FormField label="robots.txt configuratie" value={websiteSettings.robotsText || ""} onChange={(value) => setWebsiteSettings((prev) => ({ ...prev, robotsText: value }))} multiline rows={8} />
            <FormField label="Extra head HTML" value={websiteSettings.extraHeadHtml || ""} onChange={(value) => setWebsiteSettings((prev) => ({ ...prev, extraHeadHtml: value }))} multiline rows={8} />
            <SaveBar saving={false} message={saved} onSave={saveWebsite} />
          </div>
        ) : null}

        {tab === "email" ? (
          <div style={{ display: "grid", gap: "18px" }}>
            <Card style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "12px", textTransform: "uppercase", color: emailSettings.mailConfigured ? "#10b981" : "#999" }}>
                    {emailSettings.mailConfigured ? "SMTP actief" : "SMTP nog niet actief"}
                  </div>
                  <div style={{ color: "#666", fontSize: "13px", marginTop: "6px" }}>
                    {emailSettings.mailConfigured ? "Configuratie lijkt compleet." : "Sla eerst host, poort, afzender en credentials op."}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px", minWidth: "360px", flex: "1 1 360px" }}>
                  <FormField label="Test e-mail naar" value={testEmail} onChange={setTestEmail} type="email" placeholder="naam@bedrijf.nl" />
                  <PrimaryButton type="button" onClick={sendTest} disabled={emailBusy || !testEmail} style={{ alignSelf: "end", opacity: emailBusy || !testEmail ? 0.65 : 1 }}>
                    {emailBusy ? "Bezig..." : "Test mail"}
                  </PrimaryButton>
                </div>
              </div>
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 120px 120px", gap: "16px" }}>
              <FormField label="SMTP host" value={emailSettings.host || ""} onChange={setEmailField("host")} />
              <FormField label="Port" value={String(emailSettings.port || 587)} onChange={(value) => setEmailField("port")(Number(value))} />
              <CheckboxField label="Secure" checked={emailSettings.secure} onChange={setEmailField("secure")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="SMTP user" value={emailSettings.user || ""} onChange={setEmailField("user")} />
              <FormField label={emailSettings.hasPassword ? "SMTP password (laat leeg om te behouden)" : "SMTP password"} value={emailSettings.pass || ""} onChange={setEmailField("pass")} type="password" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="From e-mail" value={emailSettings.from || ""} onChange={setEmailField("from")} />
              <FormField label="Default reply-to" value={emailSettings.replyTo || ""} onChange={setEmailField("replyTo")} />
            </div>
            <Card style={{ padding: "18px", background: "#fafafa", boxShadow: "none" }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", marginBottom: "16px" }}>Templates</div>
              <div style={{ display: "grid", gap: "18px" }}>
                {(emailSettings.templates || []).map((template, index) => (
                  <Card key={template.id || index} style={{ padding: "18px", background: "#fff", boxShadow: "none", border: "1px solid #eee" }}>
                    <div style={{ display: "grid", gap: "14px" }}>
                      <FormField label="Template naam" value={template.name} onChange={(value) => setEmailSettings((prev) => ({ ...prev, templates: prev.templates.map((item, i) => i === index ? { ...item, name: value } : item) }))} />
                      <FormField label="Onderwerp" value={template.subject} onChange={(value) => setEmailSettings((prev) => ({ ...prev, templates: prev.templates.map((item, i) => i === index ? { ...item, subject: value } : item) }))} />
                      <FormField label="Bericht" value={template.body} onChange={(value) => setEmailSettings((prev) => ({ ...prev, templates: prev.templates.map((item, i) => i === index ? { ...item, body: value } : item) }))} multiline rows={6} />
                      <RichTextEditor label="HTML design template" value={template.htmlBody || ""} onChange={(value) => setEmailSettings((prev) => ({ ...prev, templates: prev.templates.map((item, i) => i === index ? { ...item, htmlBody: value } : item) }))} placeholder="Ontwerp hier de HTML-versie van deze e-mail..." />
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
            <SaveBar saving={emailBusy} message={saved} onSave={saveEmail} />
          </div>
        ) : null}
      </Card>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Routes>
      <Route element={<AdminShell />}>
        <Route index element={<DefaultAdminRedirect />} />
        <Route path="dashboard" element={<PermissionRoute permission="dashboard.view"><DashboardPage /></PermissionRoute>} />
        <Route path="blog" element={<PermissionRoute permission="collections.blog"><BlogListPage /></PermissionRoute>} />
        <Route path="blog/new" element={<PermissionRoute permission="collections.blog"><BlogFormPage /></PermissionRoute>} />
        <Route path="blog/:slug/edit" element={<PermissionRoute permission="collections.blog"><BlogFormPage /></PermissionRoute>} />
        <Route path="diensten" element={<PermissionRoute permission="collections.services"><ServiceListPage /></PermissionRoute>} />
        <Route path="diensten/new" element={<PermissionRoute permission="collections.services"><ServiceFormPage /></PermissionRoute>} />
        <Route path="diensten/:slug/edit" element={<PermissionRoute permission="collections.services"><ServiceFormPage /></PermissionRoute>} />
        <Route path="sectoren" element={<PermissionRoute permission="collections.sectors"><SectorListPage /></PermissionRoute>} />
        <Route path="sectoren/new" element={<PermissionRoute permission="collections.sectors"><SectorFormPage /></PermissionRoute>} />
        <Route path="sectoren/:slug/edit" element={<PermissionRoute permission="collections.sectors"><SectorFormPage /></PermissionRoute>} />
        <Route path="leads" element={<PermissionRoute permission="leads.view"><LeadsPage /></PermissionRoute>} />
        <Route path="homepage" element={<PermissionRoute permission="content.homepage"><HomepagePage /></PermissionRoute>} />
        <Route path="over-ons" element={<PermissionRoute permission="content.about"><AboutPage /></PermissionRoute>} />
        <Route path="pages" element={<PermissionRoute permission="content.pages"><PagesPage /></PermissionRoute>} />
        <Route path="staff" element={<PermissionRoute permission="staff.manage"><StaffPage /></PermissionRoute>} />
        <Route path="instellingen" element={<PermissionRoute permission="settings.manage"><SettingsPage /></PermissionRoute>} />
        <Route path="*" element={<DefaultAdminRedirect />} />
      </Route>
    </Routes>
  );
}
