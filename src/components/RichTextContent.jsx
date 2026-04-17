function sanitizeRichText(html) {
  return (html || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function stripHtml(value) {
  return (value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function RichTextContent({ html, className = "", style }) {
  return <div className={className} style={style} dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }} />;
}
