import { useEffect, useRef } from "react";

const TOOLBAR = [
  { label: "B", action: "bold" },
  { label: "I", action: "italic" },
  { label: "H2", action: "formatBlock", value: "h2" },
  { label: "P", action: "formatBlock", value: "p" },
  { label: "UL", action: "insertUnorderedList" },
  { label: "OL", action: "insertOrderedList" },
  { label: '"', action: "formatBlock", value: "blockquote" },
];

function exec(action, value) {
  if (typeof document === "undefined") {
    return;
  }
  document.execCommand(action, false, value);
}

export default function RichTextEditor({ label, value, onChange, placeholder = "Voeg tekst toe..." }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleLink = () => {
    const url = window.prompt("Voer de URL in");
    if (!url) {
      return;
    }
    exec("createLink", url);
    handleInput();
  };

  return (
    <div>
      {label ? (
        <label style={{ display: "block", fontSize: "11px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "#999", letterSpacing: "0.5px", marginBottom: "8px" }}>
          {label}
        </label>
      ) : null}
      <div style={{ border: "1.5px solid #e0e0e0", borderRadius: "8px", overflow: "hidden", background: "#fff" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "10px", borderBottom: "1px solid #efefef", background: "#fafafa" }}>
          {TOOLBAR.map((item) => (
            <button
              key={`${item.label}-${item.action}`}
              type="button"
              onClick={() => {
                exec(item.action, item.value);
                handleInput();
              }}
              style={{ padding: "7px 10px", minWidth: "38px", border: "none", borderRadius: "6px", background: "#f0f0f0", color: "#333", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", textTransform: "uppercase" }}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleLink}
            style={{ padding: "7px 10px", border: "none", borderRadius: "6px", background: "#f0f0f0", color: "#333", cursor: "pointer", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", textTransform: "uppercase" }}
          >
            Link
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder={placeholder}
          style={{ minHeight: "220px", padding: "16px", outline: "none", fontSize: "15px", lineHeight: 1.7, color: "#333" }}
        />
      </div>
      <style>{`
        [contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #b6b6b6;
        }
      `}</style>
    </div>
  );
}
