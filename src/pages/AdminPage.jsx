import { useState } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsContext";

/* ── HELPERS ─────────────────────────────────────────────────────────── */
function SvgIcon({ d, size = 18, stroke = "currentColor", strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );
}

function FormField({ label, value, onChange, placeholder, multiline, rows = 3, type = "text" }) {
  const base = { width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontSize: "14px", color: "#333", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s" };
  return (
    <div>
      <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>{label}</label>
      {multiline
        ? <textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{ ...base, resize: "vertical" }} onFocus={e => e.target.style.borderColor = "#c8d400"} onBlur={e => e.target.style.borderColor = "#e0e0e0"} />
        : <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={e => e.target.style.borderColor = "#c8d400"} onBlur={e => e.target.style.borderColor = "#e0e0e0"} />
      }
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: "700px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.35)" }}>
        <div style={{ padding: "20px 28px", background: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "14px", textTransform: "uppercase", color: "#fff", margin: 0, letterSpacing: "0.2px" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "22px", lineHeight: 1, padding: "0 4px" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#888"}>×</button>
        </div>
        <div style={{ padding: "28px" }}>{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({ onCancel, onSave, saveLabel = "Opslaan" }) {
  return (
    <div style={{ display: "flex", gap: "12px", marginTop: "28px", justifyContent: "flex-end" }}>
      <button onClick={onCancel} style={{ padding: "12px 24px", background: "#f4f4f4", color: "#666", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase" }}>Annuleren</button>
      <button onClick={onSave} style={{ padding: "12px 24px", background: "#c8d400", color: "#1c1c1c", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase" }} onMouseEnter={e => e.currentTarget.style.background = "#b3be00"} onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}>{saveLabel}</button>
    </div>
  );
}

function Badge({ label, color = "#c8d400", textColor = "#1c1c1c", bg }) {
  const bgColor = bg || color + "22";
  return (
    <span style={{ background: bgColor, color: textColor, fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, padding: "3px 11px", borderRadius: "20px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
  );
}

function ActionBtn({ children, onClick, variant = "edit" }) {
  const styles = {
    edit: { bg: "#f0f4e0", hover: "#c8d400", color: "#6b7a00" },
    delete: { bg: "#fef2f2", hover: "#fee2e2", color: "#dc2626" },
    view: { bg: "#f0f0f0", hover: "#e0e0e0", color: "#555" },
  };
  const s = styles[variant];
  return (
    <button onClick={onClick} style={{ padding: "7px 16px", background: s.bg, color: s.color, border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", transition: "background .15s" }} onMouseEnter={e => e.currentTarget.style.background = s.hover} onMouseLeave={e => e.currentTarget.style.background = s.bg}>{children}</button>
  );
}

function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
      <div>
        <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "16px", textTransform: "uppercase", color: "#1c1c1c", margin: "0 0 4px 0", letterSpacing: "-0.2px" }}>{title}</h2>
        {sub && <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", ...style }}>{children}</div>;
}

function ImageUpload({ label = "Afbeelding", value, onChange }) {
  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>{label}</label>
      <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", border: "2px dashed #e0e0e0", borderRadius: "6px", padding: "20px", cursor: "pointer", background: value ? "transparent" : "#fafafa", overflow: "hidden", minHeight: "120px", position: "relative", transition: "border-color .15s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#c8d400"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
        {value
          ? <img src={value} alt="preview" style={{ maxHeight: "160px", maxWidth: "100%", objectFit: "contain", borderRadius: "4px" }} />
          : <>
              <SvgIcon d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12" size={28} stroke="#c8d400" strokeWidth={1.8} />
              <span style={{ fontSize: "13px", color: "#aaa" }}>Klik om afbeelding te uploaden</span>
              <span style={{ fontSize: "11px", color: "#ccc" }}>PNG, JPG, WEBP</span>
            </>
        }
        <input type="file" accept="image/*" onChange={handleFile} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
      </label>
      {value && (
        <button type="button" onClick={() => onChange("")} style={{ marginTop: "8px", fontSize: "11px", color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, padding: 0 }}>× Afbeelding verwijderen</button>
      )}
    </div>
  );
}

/* ── SIDEBAR ─────────────────────────────────────────────────────────── */
const NAV = [
  { id: "dashboard",   label: "Dashboard",   d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { id: "blog",        label: "Blog",        d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
  { id: "diensten",    label: "Diensten",    d: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" },
  { id: "sectoren",    label: "Sectoren",    d: "M1 6l11-5 11 5v6c0 5.5-4.67 10.74-11 12C5.67 22.74 1 17.5 1 12V6z" },
  { id: "homepage",    label: "Homepage",    d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { id: "overons",     label: "Over Ons",    d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "instellingen", label: "Instellingen", d: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" },
];

function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  return (
    <aside style={{ width: collapsed ? 72 : 240, background: "#141616", minHeight: "100vh", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, zIndex: 200, height: "100vh", overflowY: "auto", transition: "width .2s ease", flexShrink: 0 }}>
      {/* Logo / toggle */}
      <div onClick={() => setCollapsed(!collapsed)} style={{ padding: "18px 16px", borderBottom: "1px solid #252525", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", userSelect: "none" }}>
        <div style={{ width: "38px", height: "38px", background: "#c8d400", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 36 36" fill="none"><path d="M7 28 L11 14 L16 22 L21 14 L25 28" stroke="#1a1a1a" strokeWidth="2.8" fill="none" strokeLinejoin="round" /></svg>
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "15px", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
              <span style={{ color: "#fff" }}>FERRO</span><span style={{ color: "#c8d400" }}>WORKS</span>
            </div>
            <div style={{ fontSize: "10px", color: "#555", fontStyle: "italic", marginTop: "2px" }}>Admin Panel</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ padding: "12px 0", flex: 1 }}>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: collapsed ? "13px 0" : "13px 20px", justifyContent: collapsed ? "center" : "flex-start", background: isActive ? "rgba(200,212,0,0.1)" : "transparent", border: "none", borderLeft: isActive ? "3px solid #c8d400" : "3px solid transparent", cursor: "pointer", color: isActive ? "#c8d400" : "#666", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", letterSpacing: "0.4px", textTransform: "uppercase", transition: "all .15s ease" }} onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#ccc"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }} onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "#666"; e.currentTarget.style.background = "transparent"; } }}>
              <SvgIcon d={item.d} size={17} stroke="currentColor" />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer: view site */}
      <div style={{ padding: "14px 16px", borderTop: "1px solid #252525" }}>
        <Link to="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: "9px", justifyContent: collapsed ? "center" : "flex-start", color: "#555", fontSize: "11px", textDecoration: "none", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.4px" }} onMouseEnter={e => e.currentTarget.style.color = "#c8d400"} onMouseLeave={e => e.currentTarget.style.color = "#555"}>
          <SvgIcon d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3" size={16} />
          {!collapsed && "Bekijk site"}
        </Link>
      </div>
    </aside>
  );
}

/* ── TOP BAR ─────────────────────────────────────────────────────────── */
function TopBar({ section }) {
  const map = {
    dashboard:    { title: "Dashboard",    sub: "Welkom terug" },
    blog:         { title: "Blog",         sub: "Beheer alle blogposts" },
    diensten:     { title: "Diensten",     sub: "Beheer de dienstenpagina's" },
    sectoren:     { title: "Sectoren",     sub: "Beheer de sectorenpagina's" },
    homepage:     { title: "Homepage",     sub: "Beheer alle homepage content" },
    overons:      { title: "Over Ons",     sub: "Beheer de over ons pagina" },
    instellingen: { title: "Instellingen", sub: "Bedrijfsgegevens en configuratie" },
  };
  const p = map[section] || {};
  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 28px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div>
        <h1 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "17px", textTransform: "uppercase", color: "#1c1c1c", margin: 0, letterSpacing: "-0.2px" }}>{p.title}</h1>
        <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>{p.sub}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#c8d400", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SvgIcon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z" size={16} stroke="#1c1c1c" strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", color: "#333", textTransform: "uppercase" }}>Admin</span>
      </div>
    </header>
  );
}

/* ══ SECTION 1: DASHBOARD ════════════════════════════════════════════════ */
function DashboardSection({ setActive }) {
  const stats = [
    { label: "Blog Posts", value: "6", d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8", color: "#c8d400" },
    { label: "Diensten",   value: "5", d: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5", color: "#3b82f6" },
    { label: "Sectoren",   value: "4", d: "M1 6l11-5 11 5v6c0 5.5-4.67 10.74-11 12C5.67 22.74 1 17.5 1 12V6z", color: "#10b981" },
    { label: "Pagina's",   value: "8", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "#f59e0b" },
  ];

  const recent = [
    { title: "Staalconstructies voor de offshore: wat moet u weten?", cat: "Offshore",       date: "12 apr 2026" },
    { title: "Van schets tot staalconstructie: ons engineeringproces", cat: "Vakmanschap",   date: "08 apr 2026" },
    { title: "Poedercoating vs. natlak: welke kiest u?",               cat: "Afwerking",     date: "03 apr 2026" },
    { title: "EN-1090 certificering: wat betekent dit voor uw project?", cat: "Certificering", date: "28 mrt 2026" },
  ];

  const quick = [
    { label: "Nieuwe blogpost",  d: "M12 4v16m8-8H4",              section: "blog" },
    { label: "Dienst bewerken",  d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", section: "diensten" },
    { label: "Sector bewerken",  d: "M4 6h16M4 12h16M4 18h7",      section: "sectoren" },
    { label: "Instellingen",     d: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z", section: "instellingen" },
  ];

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "18px", marginBottom: "28px" }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: "22px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "8px", background: s.color + "1a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <SvgIcon d={s.d} size={22} stroke={s.color} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "30px", color: "#1c1c1c", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>
        {/* Recent posts table */}
        <Card>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #f2f2f2", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", color: "#1c1c1c", letterSpacing: "0.2px" }}>Recente blogposts</span>
            <button onClick={() => setActive("blog")} style={{ fontSize: "12px", color: "#c8d400", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", cursor: "pointer", background: "none", border: "none", padding: 0 }}>Alle posts →</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["Titel", "Categorie", "Datum"].map(h => (
                  <th key={h} style={{ padding: "10px 22px", textAlign: "left", fontSize: "10.5px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#ccc", letterSpacing: "0.5px", borderBottom: "1px solid #f2f2f2" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={i} style={{ borderTop: i > 0 ? "1px solid #f7f7f7" : "none" }} onMouseEnter={e => e.currentTarget.style.background = "#fffef5"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "13px 22px", fontSize: "13px", color: "#333", maxWidth: "240px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                  </td>
                  <td style={{ padding: "13px 22px" }}><Badge label={r.cat} color="#c8d400" textColor="#6b7a00" bg="#f0f4e0" /></td>
                  <td style={{ padding: "13px 22px", fontSize: "12px", color: "#bbb", whiteSpace: "nowrap" }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Quick actions */}
        <Card style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #f2f2f2" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", color: "#1c1c1c", letterSpacing: "0.2px" }}>Snelle acties</span>
          </div>
          <div style={{ padding: "12px" }}>
            {quick.map((q, i) => (
              <button key={i} onClick={() => setActive(q.section)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", background: "transparent", border: "none", cursor: "pointer", borderRadius: "6px", color: "#444", fontSize: "13.5px", textAlign: "left", transition: "background .15s" }} onMouseEnter={e => e.currentTarget.style.background = "#f9fbe0"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: "32px", height: "32px", background: "#f5f5f5", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <SvgIcon d={q.d} size={15} stroke="#c8d400" strokeWidth={2.2} />
                </div>
                {q.label}
              </button>
            ))}
          </div>
          {/* Status */}
          <div style={{ margin: "0 12px 12px 12px", background: "#f9f9f9", borderRadius: "6px", padding: "16px" }}>
            <div style={{ fontSize: "10.5px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#bbb", marginBottom: "10px" }}>Site status</div>
            {[{ l: "Website", s: "Online", c: "#10b981" }, { l: "Laatste update", s: "Vandaag", c: "#c8d400" }].map((x, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: i > 0 ? "8px" : 0 }}>
                <span style={{ fontSize: "12.5px", color: "#777" }}>{x.l}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: x.c }} />
                  <span style={{ fontSize: "12px", color: "#444", fontWeight: 600 }}>{x.s}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ══ SECTION 2: BLOG ════════════════════════════════════════════════════ */
const BLOG_CATEGORIES = ["Vakmanschap", "Offshore", "Afwerking", "Certificering", "Productie", "Industrie"];

const INIT_POSTS = [
  { id: 1, title: "Staalconstructies voor de offshore: wat moet u weten?",     slug: "staalconstructies-offshore",  category: "Offshore",       date: "12 apr 2026", status: "Gepubliceerd", excerpt: "Offshore staalconstructies vereisen strenge kwaliteitscontrole en de juiste coatingkeuze.", body: "" },
  { id: 2, title: "Van schets tot staalconstructie: ons engineeringproces",    slug: "engineering-proces",          category: "Vakmanschap",    date: "08 apr 2026", status: "Gepubliceerd", excerpt: "Elk project begint met een goed ontwerp. Onze engineers werken met moderne CAD-software.", body: "" },
  { id: 3, title: "Poedercoating vs. natlak: welke kiest u?",                 slug: "poedercoating-vs-natlak",     category: "Afwerking",      date: "03 apr 2026", status: "Gepubliceerd", excerpt: "Het kiezen van de juiste coating is essentieel voor duurzaamheid en uitstraling.", body: "" },
  { id: 4, title: "EN-1090 certificering: wat betekent dit voor uw project?", slug: "en-1090-certificering",       category: "Certificering",  date: "28 mrt 2026", status: "Gepubliceerd", excerpt: "De EN-1090 norm stelt eisen aan staal- en aluminiumconstructies voor bouwkundige toepassingen.", body: "" },
  { id: 5, title: "Aluminium in de industrie: lichtgewicht en duurzaam",      slug: "aluminium-industrie",         category: "Productie",      date: "20 mrt 2026", status: "Gepubliceerd", excerpt: "Aluminium wint terrein in de industrie dankzij zijn lage gewicht en hoge corrosieweerstand.", body: "" },
  { id: 6, title: "Maatwerk metaal voor de scheepsbouw",                      slug: "maatwerk-scheepsbouw",        category: "Industrie",      date: "14 mrt 2026", status: "Gepubliceerd", excerpt: "In de scheepsbouw telt elke millimeter. FerroWorks levert precisiewerk voor maritieme klanten.", body: "" },
];

function BlogSection() {
  const { cms, updateCms } = useCms();
  const [posts, setPosts] = useState(() => cms.blog?.length ? cms.blog : INIT_POSTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);

  const F = f => v => setForm(p => ({ ...p, [f]: v }));

  const openNew = () => {
    setForm({ id: Date.now(), title: "", slug: "", category: "Vakmanschap", date: new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" }), status: "Concept", excerpt: "", body: "", image: "" });
    setEditing(null); setShowForm(true);
  };
  const openEdit = post => { setForm({ ...post }); setEditing(post.id); setShowForm(true); };
  const save = () => {
    const newPosts = editing ? posts.map(x => x.id === editing ? { ...form } : x) : [form, ...posts];
    setPosts(newPosts);
    updateCms("blog", newPosts);
    setShowForm(false);
  };
  const del = id => {
    if (window.confirm("Post verwijderen?")) {
      const newPosts = posts.filter(x => x.id !== id);
      setPosts(newPosts);
      updateCms("blog", newPosts);
    }
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <SectionHeader title="Blogposts" sub={`${posts.length} posts`} action={
        <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "11px 20px", border: "none", cursor: "pointer", borderRadius: "4px" }} onMouseEnter={e => e.currentTarget.style.background = "#b3be00"} onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}>
          <SvgIcon d="M12 4v16m8-8H4" size={14} strokeWidth={3} /> Nieuwe post
        </button>
      } />

      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["#", "Titel", "Categorie", "Datum", "Status", "Acties"].map(h => (
                <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: "10.5px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#ccc", letterSpacing: "0.5px", borderBottom: "1px solid #f2f2f2" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((p, i) => (
              <tr key={p.id} style={{ borderTop: i > 0 ? "1px solid #f7f7f7" : "none" }} onMouseEnter={e => e.currentTarget.style.background = "#fffef5"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 20px", fontSize: "13px", color: "#ccc", width: "40px" }}>{i + 1}</td>
                <td style={{ padding: "13px 20px", maxWidth: "260px" }}>
                  <div style={{ fontSize: "13px", color: "#222", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                  <div style={{ fontSize: "11px", color: "#ccc", marginTop: "2px" }}>/{p.slug}</div>
                </td>
                <td style={{ padding: "13px 20px" }}><Badge label={p.category} color="#c8d400" textColor="#6b7a00" bg="#f0f4e0" /></td>
                <td style={{ padding: "13px 20px", fontSize: "12px", color: "#bbb", whiteSpace: "nowrap" }}>{p.date}</td>
                <td style={{ padding: "13px 20px" }}>
                  <Badge label={p.status} bg={p.status === "Gepubliceerd" ? "#e8faf0" : "#fff8e0"} textColor={p.status === "Gepubliceerd" ? "#159a52" : "#b45309"} />
                </td>
                <td style={{ padding: "13px 20px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <ActionBtn onClick={() => openEdit(p)}>Bewerken</ActionBtn>
                    <ActionBtn onClick={() => del(p.id)} variant="delete">Verwijder</ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showForm && (
        <Modal title={editing ? "Post bewerken" : "Nieuwe post"} onClose={() => setShowForm(false)}>
          <div style={{ display: "grid", gap: "18px" }}>
            <FormField label="Titel" value={form.title} onChange={F("title")} />
            <FormField label="URL Slug" value={form.slug} onChange={F("slug")} placeholder="bijv. staalconstructies-offshore" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>Categorie</label>
                <select value={form.category} onChange={e => F("category")(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontSize: "14px", color: "#333", background: "#fff", outline: "none", boxSizing: "border-box" }}>
                  {BLOG_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>Status</label>
                <select value={form.status} onChange={e => F("status")(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontSize: "14px", color: "#333", background: "#fff", outline: "none", boxSizing: "border-box" }}>
                  <option>Gepubliceerd</option>
                  <option>Concept</option>
                </select>
              </div>
            </div>
            <FormField label="Datum" value={form.date} onChange={F("date")} placeholder="12 apr 2026" />
            <FormField label="Samenvatting (excerpt)" value={form.excerpt} onChange={F("excerpt")} multiline rows={3} />
            <FormField label="Volledige inhoud (artikel tekst)" value={form.body} onChange={F("body")} multiline rows={10} placeholder="Schrijf hier de volledige inhoud van het artikel..." />
            <ImageUpload label="Uitgelichte afbeelding" value={form.image || ""} onChange={F("image")} />
          </div>
          <ModalFooter onCancel={() => setShowForm(false)} onSave={save} />
        </Modal>
      )}
    </div>
  );
}

/* ══ SECTION 3: DIENSTEN ════════════════════════════════════════════════ */
const INIT_DIENSTEN = [
  { id: "engineering", nr: "01", title: "Engineering & Ontwerp",        subtitle: "Van eerste schets tot goedgekeurde productietekening",  excerpt: "Elk project begint met een goed ontwerp. Onze engineers werken met moderne CAD-software en vertalen uw wensen naar haalbare, maakbare productietekeningen.", checklist: "2D- en 3D-tekeningen (CAD/CAM)\nConstructieve berekeningen\nMateriaalkeuze en kostenadvies\nToetsing op maakbaarheid\nGoedkeuringsproces met de opdrachtgever" },
  { id: "productie",   nr: "02", title: "Productie in eigen beheer",    subtitle: "Volledig machinepark, geen uitbesteding",               excerpt: "In onze moderne werkplaats in Roosendaal beschikken we over een volledig machinepark voor het verwerken van staal, RVS en aluminium.", checklist: "Zaag- en lasersnijwerk\nBoren, frezen en knippen\nGecertificeerd lassen (MIG/MAG, TIG, WIG)\nBuigen en walsen\nPrefab-productie en maatwerk in alle series" },
  { id: "coating",     nr: "03", title: "Coating & Afwerking",          subtitle: "Meerlaagse coatingsystemen conform ISO 12944",          excerpt: "Een goede afwerking beschermt uw constructie en bepaalt de uitstraling. FerroWorks adviseert de juiste coatingoplossing.", checklist: "Stralen tot Sa2,5\nZinkrijke of epoxy grondlaag\nNatlak voor grote constructies\nPoedercoating seriematig\nRVS-polijsten\nGalvaniseren" },
  { id: "montage",     nr: "04", title: "Montage op locatie",           subtitle: "Eigen gecertificeerde montageploeg",                   excerpt: "Onze montageploeg plaatst uw constructie op locatie, van eenvoudige hekwerken tot complexe staalconstructies op hoogte.", checklist: "Eigen montageploeg, gecertificeerd VCA\nMontage van staal, RVS en aluminium\nKraanbegeleiding en veiligheidsbeheer\nAansluitlassen en correcties op locatie\nEindinspectie en opleverdossier" },
  { id: "reparatie",   nr: "05", title: "Reparatie & Onderhoud",        subtitle: "Snel, vakkundig, zonder lange wachttijden",            excerpt: "Staalconstructies slijten, vervormen of beschadigen. FerroWorks voert reparaties en onderhoud uit.", checklist: "Lasreparaties in staal, RVS en aluminium\nHerstel van corrosieschade en coating\nStructurele versterking van bestaande constructies\nSpoedreparaties op locatie mogelijk\nOnderhoudscontracten op aanvraag" },
];

function DienstenSection() {
  const { cms, updateCms } = useCms();
  const [diensten, setDiensten] = useState(() => cms.diensten?.length ? cms.diensten : INIT_DIENSTEN);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);

  const F = f => v => setForm(p => ({ ...p, [f]: v }));
  const openNew = () => { setForm({ id: "dienst-" + Date.now(), nr: String(diensten.length + 1).padStart(2, "0"), title: "", subtitle: "", excerpt: "", checklist: "", image: "" }); setEditing(null); setShowForm(true); };
  const openEdit = d => { setForm({ ...d }); setEditing(d.id); setShowForm(true); };
  const save = () => {
    const newDiensten = editing ? diensten.map(d => d.id === editing ? { ...form } : d) : [...diensten, form];
    setDiensten(newDiensten);
    updateCms("diensten", newDiensten);
    setShowForm(false);
  };
  const del = id => {
    if (window.confirm("Dienst verwijderen?")) {
      const newDiensten = diensten.filter(d => d.id !== id);
      setDiensten(newDiensten);
      updateCms("diensten", newDiensten);
    }
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <SectionHeader title="Diensten" sub={`${diensten.length} diensten`} action={
        <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "11px 20px", border: "none", cursor: "pointer", borderRadius: "4px" }} onMouseEnter={e => e.currentTarget.style.background = "#b3be00"} onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}>
          <SvgIcon d="M12 4v16m8-8H4" size={14} strokeWidth={3} /> Nieuwe dienst
        </button>
      } />

      <div style={{ display: "grid", gap: "14px" }}>
        {diensten.map(d => (
          <Card key={d.id} style={{ padding: "22px", display: "flex", alignItems: "flex-start", gap: "18px" }}>
            <div style={{ width: "46px", height: "46px", minWidth: "46px", background: "#c8d400", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "14px", color: "#1c1c1c" }}>{d.nr}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "14px", color: "#1c1c1c", textTransform: "uppercase", letterSpacing: "-0.2px" }}>{d.title}</div>
              <div style={{ fontSize: "12.5px", color: "#999", marginTop: "2px" }}>{d.subtitle}</div>
              <div style={{ fontSize: "12px", color: "#ccc", marginTop: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.excerpt}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                {d.checklist.split("\n").map((item, i) => (
                  <span key={i} style={{ background: "#f4f4f4", color: "#666", fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>{item}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
              <Badge label="Actief" bg="#e8faf0" textColor="#159a52" />
              <ActionBtn onClick={() => openEdit(d)}>Bewerken</ActionBtn>
              <ActionBtn onClick={() => del(d.id)} variant="delete">Verwijder</ActionBtn>
              <Link to={`/diensten/${d.id}`} target="_blank" style={{ padding: "7px 16px", background: "#f0f0f0", color: "#555", borderRadius: "4px", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", textDecoration: "none", textAlign: "center", transition: "background .15s" }} onMouseEnter={e => e.currentTarget.style.background = "#e0e0e0"} onMouseLeave={e => e.currentTarget.style.background = "#f0f0f0"}>Bekijken</Link>
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <Modal title={editing ? `Bewerken: ${form.title}` : "Nieuwe dienst"} onClose={() => setShowForm(false)}>
          <div style={{ display: "grid", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "16px" }}>
              <FormField label="Nummer" value={form.nr} onChange={F("nr")} placeholder="01" />
              <FormField label="Paginatitel" value={form.title} onChange={F("title")} />
            </div>
            <FormField label="Ondertitel / tagline" value={form.subtitle} onChange={F("subtitle")} />
            <FormField label="Intro tekst (excerpt)" value={form.excerpt} onChange={F("excerpt")} multiline rows={4} />
            <div>
              <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>Checklist items <span style={{ color: "#ccc", fontWeight: 400, textTransform: "none" }}>(één per regel)</span></label>
              <textarea value={form.checklist} onChange={e => F("checklist")(e.target.value)} rows={7} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontSize: "14px", color: "#333", resize: "vertical", outline: "none", fontFamily: "monospace", boxSizing: "border-box", lineHeight: 1.7 }} />
            </div>
            <ImageUpload label="Afbeelding" value={form.image || ""} onChange={F("image")} />
          </div>
          <ModalFooter onCancel={() => setShowForm(false)} onSave={save} />
        </Modal>
      )}
    </div>
  );
}

/* ══ SECTION 4: SECTOREN ════════════════════════════════════════════════ */
const INIT_SECTOREN = [
  { id: "bouw",         nr: "01", naam: "Bouw & Utiliteit",      tagline: "Staalconstructies, hekwerken en prefab balkons voor de bouwsector",   items: "Staalconstructies en draagframes\nStandaard hekwerken\nPrefab balkons en bordessen\nTrappen, leuningen en vluchttrapstructuren\nGevelelementen en kozijnstaal\nCE-gecertificeerd conform EN-1090" },
  { id: "industrie",    nr: "02", naam: "Industrie",             tagline: "Machinebouw, procesinstallaties en maatwerk staalwerk",                items: "Machinebouw en machineframes\nMaatwerk staalconstructies\nIndustriële installaties en procesframes\nLaswerkzaamheden op locatie\nRVS voor food- en farmaceutische industrie\nDraagstructuren en mezzanine vloeren" },
  { id: "architectuur", nr: "03", naam: "Architectuur & Design", tagline: "Design trappen, sierwerk en exterieur maatwerk voor architecten",     items: "Design trappen in staal en RVS\nInterieur- en exterieur maatwerk\nBalustrades en leuningwerken\nSierwerk, poorten en toegangspartijen\nGevelpanelen en bekleding\nCoating en poedercoating in elke RAL-kleur" },
  { id: "maritiem",     nr: "04", naam: "Maritiem",              tagline: "Jachtbouw, offshore constructies en maritieme coating",                items: "Jachtbouw en scheepsinterieurs\nOffshore staal- en RVS-constructies\nDekuitrusting en handrelingen\nAluminium loopbruggen en vlonders\nMaritieme coating (C5-M, ISO 12944)\nReparaties in haven en aan boord" },
];

function SectorenSection() {
  const { cms, updateCms } = useCms();
  const [sectoren, setSectoren] = useState(() => cms.sectoren?.length ? cms.sectoren : INIT_SECTOREN);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);

  const F = f => v => setForm(p => ({ ...p, [f]: v }));
  const openNew = () => { setForm({ id: "sector-" + Date.now(), nr: String(sectoren.length + 1).padStart(2, "0"), naam: "", tagline: "", items: "", image: "" }); setEditing(null); setShowForm(true); };
  const openEdit = s => { setForm({ ...s }); setEditing(s.id); setShowForm(true); };
  const save = () => {
    const newSectoren = editing ? sectoren.map(s => s.id === editing ? { ...form } : s) : [...sectoren, form];
    setSectoren(newSectoren);
    updateCms("sectoren", newSectoren);
    setShowForm(false);
  };
  const del = id => {
    if (window.confirm("Sector verwijderen?")) {
      const newSectoren = sectoren.filter(s => s.id !== id);
      setSectoren(newSectoren);
      updateCms("sectoren", newSectoren);
    }
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <SectionHeader title="Sectoren" sub={`${sectoren.length} sectoren`} action={
        <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "#c8d400", padding: "11px 20px", border: "none", cursor: "pointer", borderRadius: "4px" }} onMouseEnter={e => e.currentTarget.style.background = "#b3be00"} onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}>
          <SvgIcon d="M12 4v16m8-8H4" size={14} strokeWidth={3} /> Nieuwe sector
        </button>
      } />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
        {sectoren.map(s => (
          <Card key={s.id} style={{ padding: "24px", borderTop: "4px solid #c8d400" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, color: "#c8d400", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.nr}</div>
                <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "15px", textTransform: "uppercase", color: "#1c1c1c", margin: "4px 0 6px 0", letterSpacing: "-0.2px" }}>{s.naam}</h3>
                <p style={{ fontSize: "12.5px", color: "#999", margin: "0 0 14px 0", lineHeight: 1.5 }}>{s.tagline}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <ActionBtn onClick={() => openEdit(s)}>Bewerken</ActionBtn>
                <ActionBtn onClick={() => del(s.id)} variant="delete">Verwijder</ActionBtn>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #f2f2f2", paddingTop: "12px" }}>
              {s.items.split("\n").map((item, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <div style={{ width: "5px", height: "5px", background: "#c8d400", flexShrink: 0 }} />
                  <span style={{ fontSize: "12.5px", color: "#888" }}>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <Modal title={editing ? `Bewerken: ${form.naam}` : "Nieuwe sector"} onClose={() => setShowForm(false)}>
          <div style={{ display: "grid", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "16px" }}>
              <FormField label="Nummer" value={form.nr} onChange={F("nr")} placeholder="01" />
              <FormField label="Naam" value={form.naam} onChange={F("naam")} />
            </div>
            <FormField label="Tagline / omschrijving" value={form.tagline} onChange={F("tagline")} />
            <div>
              <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>Diensten / items <span style={{ color: "#ccc", fontWeight: 400, textTransform: "none" }}>(één per regel)</span></label>
              <textarea value={form.items} onChange={e => F("items")(e.target.value)} rows={8} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontSize: "14px", color: "#333", resize: "vertical", outline: "none", fontFamily: "monospace", boxSizing: "border-box", lineHeight: 1.7 }} />
            </div>
            <ImageUpload label="Afbeelding" value={form.image || ""} onChange={F("image")} />
          </div>
          <ModalFooter onCancel={() => setShowForm(false)} onSave={save} />
        </Modal>
      )}
    </div>
  );
}

/* ══ SECTION 5: INSTELLINGEN ════════════════════════════════════════════ */
function SettingsCard({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "28px", marginBottom: "18px" }}>
      <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", color: "#1c1c1c", margin: "0 0 20px 0", letterSpacing: "0.2px", paddingBottom: "14px", borderBottom: "1px solid #f2f2f2" }}>{title}</h3>
      {children}
    </div>
  );
}

function InstellingenSection() {
  const { cms, updateCms } = useCms();
  const [site, setSite] = useState(() => ({ ...cms.site }));
  const [stats, setStats] = useState(() => [...(cms.stats || [])]);
  const [saved, setSaved] = useState(false);

  const Sf = f => v => setSite(p => ({ ...p, [f]: v }));
  const save = () => {
    updateCms("site", site);
    updateCms("stats", stats);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: "780px" }}>
      <SectionHeader title="Instellingen" sub="Bedrijfsgegevens, contactinformatie en SEO" />

      <SettingsCard title="Bedrijfsgegevens">
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <FormField label="Bedrijfsnaam" value={site.naam} onChange={Sf("naam")} />
            <FormField label="Tagline (onder logo)" value={site.tagline} onChange={Sf("tagline")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <FormField label="KVK-nummer" value={site.kvk} onChange={Sf("kvk")} />
            <FormField label="BTW-nummer" value={site.btw} onChange={Sf("btw")} />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Contactgegevens">
        <div style={{ display: "grid", gap: "16px" }}>
          <FormField label="Adres / locatie" value={site.adres} onChange={Sf("adres")} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <FormField label="Telefoonnummer" value={site.tel} onChange={Sf("tel")} />
            <FormField label="E-mailadres" value={site.email} onChange={Sf("email")} />
          </div>
          <FormField label="Websiteadres" value={site.website} onChange={Sf("website")} />
        </div>
      </SettingsCard>

      <SettingsCard title="Statistieken (homepage & over ons)">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ display: "grid", gap: "8px" }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", textTransform: "uppercase", color: "#c8d400", letterSpacing: "0.5px" }}>Stat {i + 1}</div>
              <FormField label="Getal / waarde" value={s.number} onChange={v => setStats(p => p.map((x, j) => j === i ? { ...x, number: v } : x))} placeholder="15+" />
              <FormField label="Omschrijving" value={s.desc} onChange={v => setStats(p => p.map((x, j) => j === i ? { ...x, desc: v } : x))} placeholder="Jaar ervaring" />
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Social media">
        <div style={{ display: "grid", gap: "16px" }}>
          <FormField label="LinkedIn URL" value={site.linkedin} onChange={Sf("linkedin")} placeholder="linkedin.com/company/ferroworks" />
          <FormField label="Instagram URL" value={site.instagram} onChange={Sf("instagram")} placeholder="instagram.com/ferroworks" />
          <FormField label="Facebook URL" value={site.facebook} onChange={Sf("facebook")} placeholder="facebook.com/ferroworks" />
        </div>
      </SettingsCard>

      <SettingsCard title="SEO & Metadata">
        <div style={{ display: "grid", gap: "16px" }}>
          <FormField label="Meta titel (homepage)" value={site.metaTitle} onChange={Sf("metaTitle")} />
          <FormField label="Meta beschrijving" value={site.metaDesc} onChange={Sf("metaDesc")} multiline rows={3} />
        </div>
      </SettingsCard>

      <button onClick={save} style={{ padding: "14px 36px", background: saved ? "#10b981" : "#c8d400", color: saved ? "#fff" : "#1c1c1c", border: "none", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", borderRadius: "6px", transition: "background .3s", display: "flex", alignItems: "center", gap: "8px" }}>
        {saved
          ? <><SvgIcon d="M20 6L9 17l-5-5" size={16} stroke="#fff" strokeWidth={3} /> Opgeslagen!</>
          : "Wijzigingen opslaan"
        }
      </button>
    </div>
  );
}

/* ══ SECTION 6: HOMEPAGE ════════════════════════════════════════════════ */
function HomepageSection() {
  const { cms, updateCms } = useCms();
  const [sub, setSub] = useState("hero");

  const [hero, setHero] = useState(() => ({ ...cms.hero }));
  const [stats, setStats] = useState(() => [...(cms.stats || [])]);
  const [watFerna, setWatFerna] = useState(() => ({ ...cms.watFerna }));
  const [anders, setAnders] = useState(() => ({ ...cms.anders }));
  const [projecten, setProjecten] = useState(() => [...(cms.projecten || [])]);
  const [faq, setFaq] = useState(() => [...(cms.faq || [])]);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [faqForm, setFaqForm] = useState({});
  const [editingFaq, setEditingFaq] = useState(null);
  const [saved, setSaved] = useState("");

  const saveSection = (key, data) => { updateCms(key, data); setSaved(key); setTimeout(() => setSaved(""), 2000); };
  const Hf = f => v => setHero(p => ({ ...p, [f]: v }));
  const Ff = f => v => setWatFerna(p => ({ ...p, [f]: v }));
  const Af = f => v => setAnders(p => ({ ...p, [f]: v }));

  const TABS = [
    { id: "hero", label: "Hero" },
    { id: "stats", label: "Stats" },
    { id: "watferna", label: "Wat Ferna" },
    { id: "anders", label: "Anders Maakt" },
    { id: "projecten", label: "Projecten" },
    { id: "faq", label: "FAQ" },
  ];
  const SaveBtn = ({ skey, data }) => (
    <button onClick={() => saveSection(skey, data)} style={{ padding: "12px 32px", background: saved === skey ? "#10b981" : "#c8d400", color: saved === skey ? "#fff" : "#1c1c1c", border: "none", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", borderRadius: "6px", marginTop: "24px", transition: "background .3s" }}>
      {saved === skey ? "✓ Opgeslagen!" : "Opslaan"}
    </button>
  );

  return (
    <div style={{ padding: "28px 32px" }}>
      <SectionHeader title="Homepage" sub="Beheer alle homepage secties" />
      <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "#f4f4f4", padding: "4px", borderRadius: "8px", width: "fit-content", flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{ padding: "8px 18px", background: sub === t.id ? "#fff" : "transparent", color: sub === t.id ? "#1c1c1c" : "#999", border: "none", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.4px", borderRadius: "6px", boxShadow: sub === t.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all .15s" }}>{t.label}</button>
        ))}
      </div>

      {sub === "hero" && (
        <Card style={{ padding: "28px", maxWidth: "700px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Regel 1 (groot)" value={hero.line1} onChange={Hf("line1")} placeholder="GEBOUWD" />
              <FormField label="Regel 2 (geel)" value={hero.line2} onChange={Hf("line2")} placeholder="OP MAAT" />
            </div>
            <FormField label="Subtitel" value={hero.subtitle} onChange={Hf("subtitle")} multiline rows={2} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="CTA knoptekst" value={hero.cta} onChange={Hf("cta")} placeholder="Neem contact op" />
              <FormField label="CTA link" value={hero.ctaLink} onChange={Hf("ctaLink")} placeholder="/contact" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>Check items <span style={{ color: "#ccc", fontWeight: 400, textTransform: "none" }}>(max 4, één per regel)</span></label>
              <textarea value={Array.isArray(hero.checkItems) ? hero.checkItems.join("\n") : (hero.checkItems || "")} onChange={e => Hf("checkItems")(e.target.value.split("\n"))} rows={4} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontSize: "14px", color: "#333", resize: "vertical", outline: "none", fontFamily: "monospace", boxSizing: "border-box", lineHeight: 1.7 }} />
            </div>
            <ImageUpload label="Hero achtergrondafbeelding" value={hero.image || ""} onChange={Hf("image")} />
          </div>
          <SaveBtn skey="hero" data={hero} />
        </Card>
      )}

      {sub === "stats" && (
        <div style={{ maxWidth: "700px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            {stats.map((s, i) => (
              <Card key={i} style={{ padding: "22px" }}>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", textTransform: "uppercase", color: "#c8d400", marginBottom: "14px" }}>Stat {i + 1}</div>
                <div style={{ display: "grid", gap: "12px" }}>
                  <FormField label="Getal / waarde" value={s.number} onChange={v => setStats(p => p.map((x, j) => j === i ? { ...x, number: v } : x))} placeholder="15+" />
                  <FormField label="Omschrijving" value={s.desc} onChange={v => setStats(p => p.map((x, j) => j === i ? { ...x, desc: v } : x))} placeholder="Jaar ervaring" />
                </div>
              </Card>
            ))}
          </div>
          <SaveBtn skey="stats" data={stats} />
        </div>
      )}

      {sub === "watferna" && (
        <Card style={{ padding: "28px", maxWidth: "700px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Titel regel 1" value={watFerna.title1} onChange={Ff("title1")} />
              <FormField label="Titel regel 2 (geel)" value={watFerna.title2} onChange={Ff("title2")} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>Bullet items <span style={{ color: "#ccc", fontWeight: 400, textTransform: "none" }}>(één per regel)</span></label>
              <textarea value={Array.isArray(watFerna.bulletItems) ? watFerna.bulletItems.join("\n") : (watFerna.bulletItems || "")} onChange={e => Ff("bulletItems")(e.target.value.split("\n"))} rows={8} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontSize: "14px", color: "#333", resize: "vertical", outline: "none", fontFamily: "monospace", boxSizing: "border-box", lineHeight: 1.7 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <ImageUpload label="Afbeelding 1" value={watFerna.image1 || ""} onChange={Ff("image1")} />
              <ImageUpload label="Afbeelding 2" value={watFerna.image2 || ""} onChange={Ff("image2")} />
            </div>
          </div>
          <SaveBtn skey="watFerna" data={watFerna} />
        </Card>
      )}

      {sub === "anders" && (
        <div style={{ maxWidth: "700px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            {(anders.items || []).map((item, i) => (
              <Card key={i} style={{ padding: "22px" }}>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", textTransform: "uppercase", color: "#c8d400", marginBottom: "14px" }}>Item {i + 1}</div>
                <div style={{ display: "grid", gap: "12px" }}>
                  <FormField label="Titel" value={item.title} onChange={v => setAnders(p => ({ ...p, items: p.items.map((x, j) => j === i ? { ...x, title: v } : x) }))} />
                  <FormField label="Omschrijving" value={item.desc} onChange={v => setAnders(p => ({ ...p, items: p.items.map((x, j) => j === i ? { ...x, desc: v } : x) }))} multiline rows={3} />
                </div>
              </Card>
            ))}
            <Card style={{ padding: "22px" }}>
              <ImageUpload label="Afbeelding (rechts)" value={anders.image || ""} onChange={Af("image")} />
            </Card>
          </div>
          <SaveBtn skey="anders" data={anders} />
        </div>
      )}

      {sub === "projecten" && (
        <div style={{ maxWidth: "700px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            {projecten.map((p, i) => (
              <Card key={i} style={{ padding: "22px" }}>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", textTransform: "uppercase", color: "#c8d400", marginBottom: "14px" }}>Project {i + 1}</div>
                <div style={{ display: "grid", gap: "12px" }}>
                  <FormField label="Titel" value={p.title} onChange={v => setProjecten(prev => prev.map((x, j) => j === i ? { ...x, title: v } : x))} />
                  <FormField label="Omschrijving" value={p.desc} onChange={v => setProjecten(prev => prev.map((x, j) => j === i ? { ...x, desc: v } : x))} multiline rows={3} />
                  <ImageUpload label="Afbeelding" value={p.image || ""} onChange={v => setProjecten(prev => prev.map((x, j) => j === i ? { ...x, image: v } : x))} />
                </div>
              </Card>
            ))}
          </div>
          <SaveBtn skey="projecten" data={projecten} />
        </div>
      )}

      {sub === "faq" && (
        <div style={{ maxWidth: "700px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            <button onClick={() => { setFaqForm({ q: "", a: "" }); setEditingFaq(null); setShowFaqForm(true); }} style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", color: "#1c1c1c", background: "#c8d400", padding: "11px 20px", border: "none", cursor: "pointer", borderRadius: "4px" }} onMouseEnter={e => e.currentTarget.style.background = "#b3be00"} onMouseLeave={e => e.currentTarget.style.background = "#c8d400"}>
              <SvgIcon d="M12 4v16m8-8H4" size={14} strokeWidth={3} /> Nieuwe vraag
            </button>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {faq.map((item, i) => (
              <Card key={i} style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", color: "#1c1c1c", marginBottom: "6px" }}>{item.q}</div>
                    <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.6 }}>{item.a}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <ActionBtn onClick={() => { setFaqForm({ ...item }); setEditingFaq(i); setShowFaqForm(true); }}>Bewerken</ActionBtn>
                    <ActionBtn onClick={() => { const nf = faq.filter((_, j) => j !== i); setFaq(nf); updateCms("faq", nf); }} variant="delete">Verwijder</ActionBtn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {faq.length === 0 && <div style={{ textAlign: "center", padding: "48px", color: "#ccc", fontSize: "14px" }}>Nog geen FAQ items. Klik op "Nieuwe vraag" om te beginnen.</div>}
          {showFaqForm && (
            <Modal title={editingFaq !== null ? "Vraag bewerken" : "Nieuwe vraag"} onClose={() => setShowFaqForm(false)}>
              <div style={{ display: "grid", gap: "18px" }}>
                <FormField label="Vraag" value={faqForm.q} onChange={v => setFaqForm(p => ({ ...p, q: v }))} />
                <FormField label="Antwoord" value={faqForm.a} onChange={v => setFaqForm(p => ({ ...p, a: v }))} multiline rows={6} />
              </div>
              <ModalFooter onCancel={() => setShowFaqForm(false)} onSave={() => {
                const nf = editingFaq !== null ? faq.map((x, j) => j === editingFaq ? { ...faqForm } : x) : [...faq, { ...faqForm }];
                setFaq(nf);
                updateCms("faq", nf);
                setShowFaqForm(false);
              }} />
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}

/* ══ SECTION 7: OVER ONS ════════════════════════════════════════════════ */
function OverOnsSection() {
  const { cms, updateCms } = useCms();
  const [sub, setSub] = useState("verhaal");

  const [verhaal, setVerhaal] = useState(() => ({ ...(cms.overOns?.verhaal || {}) }));
  const [watWeDoen, setWatWeDoen] = useState(() => ({ ...(cms.overOns?.watWeDoen || {}) }));
  const [andersItems, setAndersItems] = useState(() => [...(cms.overOns?.andersItems || [])]);
  const [team, setTeam] = useState(() => ({ ...(cms.overOns?.team || {}) }));
  const [saved, setSaved] = useState("");

  const saveOverOns = (key, data) => {
    updateCms("overOns", { ...cms.overOns, [key]: data });
    setSaved(key);
    setTimeout(() => setSaved(""), 2000);
  };

  const Vf = f => v => setVerhaal(p => ({ ...p, [f]: v }));
  const Wf = f => v => setWatWeDoen(p => ({ ...p, [f]: v }));
  const Tf = f => v => setTeam(p => ({ ...p, [f]: v }));

  const TABS = [
    { id: "verhaal", label: "Ons Verhaal" },
    { id: "watWeDoen", label: "Wat We Doen" },
    { id: "anders", label: "Anders Maakt" },
    { id: "team", label: "Team" },
  ];
  const SaveBtn = ({ skey, data }) => (
    <button onClick={() => saveOverOns(skey, data)} style={{ padding: "12px 32px", background: saved === skey ? "#10b981" : "#c8d400", color: saved === skey ? "#fff" : "#1c1c1c", border: "none", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", borderRadius: "6px", marginTop: "24px", transition: "background .3s" }}>
      {saved === skey ? "✓ Opgeslagen!" : "Opslaan"}
    </button>
  );

  return (
    <div style={{ padding: "28px 32px" }}>
      <SectionHeader title="Over Ons" sub="Beheer de over ons pagina" />
      <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "#f4f4f4", padding: "4px", borderRadius: "8px", width: "fit-content" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{ padding: "8px 18px", background: sub === t.id ? "#fff" : "transparent", color: sub === t.id ? "#1c1c1c" : "#999", border: "none", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.4px", borderRadius: "6px", boxShadow: sub === t.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all .15s" }}>{t.label}</button>
        ))}
      </div>

      {sub === "verhaal" && (
        <Card style={{ padding: "28px", maxWidth: "700px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Titel regel 1" value={verhaal.title1} onChange={Vf("title1")} placeholder="GEBOUWD OP" />
              <FormField label="Titel regel 2 (geel)" value={verhaal.title2} onChange={Vf("title2")} placeholder="EERLIJKHEID" />
            </div>
            <FormField label="Paragraaf 1" value={verhaal.tekst1} onChange={Vf("tekst1")} multiline rows={4} />
            <FormField label="Paragraaf 2" value={verhaal.tekst2} onChange={Vf("tekst2")} multiline rows={4} />
            <FormField label="Paragraaf 3" value={verhaal.tekst3} onChange={Vf("tekst3")} multiline rows={4} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <ImageUpload label="Afbeelding 1" value={verhaal.image1 || ""} onChange={Vf("image1")} />
              <ImageUpload label="Afbeelding 2" value={verhaal.image2 || ""} onChange={Vf("image2")} />
            </div>
          </div>
          <SaveBtn skey="verhaal" data={verhaal} />
        </Card>
      )}

      {sub === "watWeDoen" && (
        <Card style={{ padding: "28px", maxWidth: "700px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>Diensten / items <span style={{ color: "#ccc", fontWeight: 400, textTransform: "none" }}>(één per regel)</span></label>
              <textarea value={watWeDoen.items || ""} onChange={e => Wf("items")(e.target.value)} rows={10} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontSize: "14px", color: "#333", resize: "vertical", outline: "none", fontFamily: "monospace", boxSizing: "border-box", lineHeight: 1.7 }} />
            </div>
            <ImageUpload label="Afbeelding" value={watWeDoen.image || ""} onChange={Wf("image")} />
          </div>
          <SaveBtn skey="watWeDoen" data={watWeDoen} />
        </Card>
      )}

      {sub === "anders" && (
        <div style={{ maxWidth: "700px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            {(andersItems || []).map((item, i) => (
              <Card key={i} style={{ padding: "22px" }}>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", textTransform: "uppercase", color: "#c8d400", marginBottom: "14px" }}>Item {i + 1}</div>
                <div style={{ display: "grid", gap: "12px" }}>
                  <FormField label="Titel" value={item.title} onChange={v => setAndersItems(p => p.map((x, j) => j === i ? { ...x, title: v } : x))} />
                  <FormField label="Omschrijving" value={item.desc} onChange={v => setAndersItems(p => p.map((x, j) => j === i ? { ...x, desc: v } : x))} multiline rows={3} />
                </div>
              </Card>
            ))}
          </div>
          <SaveBtn skey="andersItems" data={andersItems} />
        </div>
      )}

      {sub === "team" && (
        <Card style={{ padding: "28px", maxWidth: "700px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Titel regel 1" value={team.title1} onChange={Tf("title1")} />
              <FormField label="Titel regel 2 (geel)" value={team.title2} onChange={Tf("title2")} />
            </div>
            <FormField label="Paragraaf 1" value={team.tekst1} onChange={Tf("tekst1")} multiline rows={4} />
            <FormField label="Paragraaf 2" value={team.tekst2} onChange={Tf("tekst2")} multiline rows={4} />
            <div>
              <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>Team items / USPs <span style={{ color: "#ccc", fontWeight: 400, textTransform: "none" }}>(één per regel)</span></label>
              <textarea value={team.items || ""} onChange={e => Tf("items")(e.target.value)} rows={8} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontSize: "14px", color: "#333", resize: "vertical", outline: "none", fontFamily: "monospace", boxSizing: "border-box", lineHeight: 1.7 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <ImageUpload label="Afbeelding 1" value={team.image1 || ""} onChange={Tf("image1")} />
              <ImageUpload label="Afbeelding 2" value={team.image2 || ""} onChange={Tf("image2")} />
              <ImageUpload label="Afbeelding 3" value={team.image3 || ""} onChange={Tf("image3")} />
            </div>
          </div>
          <SaveBtn skey="team" data={team} />
        </Card>
      )}
    </div>
  );
}

/* ══ ROOT: ADMIN PAGE ══════════════════════════════════════════════════ */
export default function AdminPage() {
  const [active, setActive]       = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const sidebarW = collapsed ? 72 : 240;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f2f3f5", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, marginLeft: sidebarW, transition: "margin-left .2s ease", display: "flex", flexDirection: "column", minWidth: 0, minHeight: "100vh" }}>
        <TopBar section={active} />
        <main style={{ flex: 1, overflowY: "auto" }}>
          {active === "dashboard"    && <DashboardSection setActive={setActive} />}
          {active === "blog"         && <BlogSection />}
          {active === "diensten"     && <DienstenSection />}
          {active === "sectoren"     && <SectorenSection />}
          {active === "homepage"     && <HomepageSection />}
          {active === "overons"      && <OverOnsSection />}
          {active === "instellingen" && <InstellingenSection />}
        </main>
      </div>
    </div>
  );
}
