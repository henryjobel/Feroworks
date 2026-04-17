import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpeg";
import imgPost1 from "../assets/past work/kwaliteitscontrole-lassen-featured-300x225.webp";
import imgPost2 from "../assets/past work/Offshore-constructie-300x190.webp";
import imgPost3 from "../assets/past work/Afwerking-staalconstructie-met-natlak-300x225.webp";
import imgPost4 from "../assets/past work/lascertificaat-verplicht-featured-300x158.webp";
import imgPost5 from "../assets/over-ons1.png";
import imgPost6 from "../assets/over-ons2.png";
import { useCms } from "../cms/CmsContext";
import { useLanguage } from "../i18n/LanguageContext";

const BLOG_FALLBACK_IMAGES = [imgPost1, imgPost2, imgPost3, imgPost4, imgPost5, imgPost6];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* â”€â”€ STATIC DATA (fallback) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const FALLBACK_POSTS = [
  {
    id: 1,
    category: "Vakmanschap",
    date: "8 april 2026",
    readTime: "4 min",
    title: "Waarom kwaliteitscontrole bij lassen het verschil maakt",
    excerpt:
      "In de metaalbewerking is lassen een van de meest kritische processen. Een kleine fout in de las kan grote gevolgen hebben voor de veiligheid en levensduur van een constructie. Ontdek hoe FerroWorks kwaliteitscontrole inzet als standaard â€” niet als uitzondering.",
  img: imgPost1, featured: true,
  },
  {
    id: 2,
    category: "Offshore",
    date: "1 april 2026",
    readTime: "5 min",
    title: "Staalconstructies voor offshore: eisen en uitdagingen",
    excerpt:
      "Offshore staalwerk staat bloot aan extreme omstandigheden: zout water, hoge druk en constante mechanische belasting. Wij leggen uit welke materialen en coatings wij inzetten voor duurzame offshore constructies.",
  img: imgPost2, featured: false,
  },
  {
    id: 3,
    category: "Afwerking",
    date: "24 maart 2026",
    readTime: "3 min",
    title: "Natlak vs. poedercoating: wat past bij uw project?",
    excerpt:
      "De keuze tussen natlak en poedercoating heeft invloed op zowel de uitstraling als de beschermingsgraad van een staalconstructie. We zetten de voor- en nadelen van beide methoden op een rij.",
  img: imgPost3, featured: false,
  },
  {
    id: 4,
    category: "Certificering",
    date: "17 maart 2026",
    readTime: "6 min",
    title: "Lascertificaat verplicht? Alles wat u moet weten over EN-1090",
    excerpt:
      "Sinds de invoering van de EN-1090 norm is een lascertificaat voor veel staalconstructies verplicht. Maar wat houdt dat precies in, en wanneer is het van toepassing? FerroWorks legt het u helder uit.",
  img: imgPost4, featured: false,
  },
  {
    id: 5,
    category: "Productie",
    date: "10 maart 2026",
    readTime: "4 min",
    title: "Van tekening tot product: zo werkt ons productieproces",
    excerpt:
      "Hoe gaat een metaalproject van CAD-tekening naar afgewerkt product? We nemen u stap voor stap mee door het productieproces van FerroWorks: van intake en engineering tot productie, afwerking en montage.",
  img: imgPost5, featured: false,
  },
  {
    id: 6,
    category: "Industrie",
    date: "3 maart 2026",
    readTime: "5 min",
    title: "Maatwerk staal voor de industrie: 5 veelgemaakte fouten vermeden",
    excerpt:
      "Bij industrieel staalmaatwerk gaat het soms mis â€” niet door slechte intenties, maar door gebrek aan kennis of slechte communicatie. We bespreken vijf veelgemaakte fouten en hoe u ze kunt voorkomen.",
  img: imgPost6, featured: false,
  },
];

/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function PageHero() {
  const { t, localizePath } = useLanguage();
  return (
    <section style={{ position: "relative", width: "100%", minHeight: "340px", display: "flex", alignItems: "center", overflow: "hidden", background: "#141616" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center right" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <Link to={localizePath("/")} style={{ color: "var(--fw-website-primary)", fontSize: "13px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{t("common.home", "Home")}</Link>
          <span style={{ color: "#666", fontSize: "13px" }}>{">"}</span>
          <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Blog</span>
        </div>

        <h1 style={{ margin: "0 0 16px 0", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.5px", textTransform: "uppercase" }}>
          <span style={{ color: "var(--fw-website-primary)" }}>{t("blogPage.heroTitle", "KNOWLEDGE & ")}</span><span style={{ color: "#fff" }}>{t("blogPage.heroAccent", "INSIGHTS")}</span>
        </h1>
        <p style={{ margin: 0, color: "#bbb", fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.6, maxWidth: "520px" }}>
          {t("blogPage.heroText", "Industry articles, project stories and technical insights from FerroWorks' day-to-day practice.")}
        </p>
        <div style={{ width: "56px", height: "4px", background: "var(--fw-website-primary)", marginTop: "28px", borderRadius: "2px" }} />
      </div>
    </section>
  );
}

/* â”€â”€ FEATURED POST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function FeaturedPost({ post, imgSrc }) {
  const [ref, vis] = useInView();
  const { t, localizePath } = useLanguage();
  return (
    <section style={{ background: "#f4f4f4", padding: "72px 0" }}>
      <style>{`
        .fp-left  { opacity:0; transform:translateX(-32px); transition: opacity .65s ease, transform .65s ease; }
        .fp-right { opacity:0; transform:translateX(32px);  transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .fp-on .fp-left, .fp-on .fp-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .fp-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 fp-grid " + (vis ? "fp-on" : "")}
        style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "64px", alignItems: "center" }}>

        {/* Image */}
        <div className="fp-left" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-12px", left: "-12px", width: "64px", height: "64px", background: "var(--fw-website-primary)", zIndex: 0 }} />
          <img
            className="fp-image"
            src={imgSrc}
            alt={post.title}
            style={{ position: "relative", zIndex: 1, width: "100%", height: "400px", objectFit: "cover", display: "block", boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}
          />
          <div style={{ position: "absolute", bottom: "20px", left: "20px", zIndex: 2, background: "var(--fw-website-primary)", padding: "6px 14px" }}>
            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#1c1c1c" }}>{t("blogPage.featured", "Featured")}</span>
          </div>
        </div>

        {/* Text */}
        <div className="fp-right">
          <div className="fp-meta" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ background: "#1c1c1c", color: "var(--fw-website-primary)", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", padding: "4px 10px" }}>{post.category}</span>
            <span style={{ color: "#aaa", fontSize: "13px" }}>{post.date}</span>
            <span style={{ color: "#aaa", fontSize: "13px" }}>· {post.readTime} {t("blogPage.readTime", "read time")}</span>
          </div>

          <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(20px, 2.4vw, 28px)", lineHeight: 1.15, letterSpacing: "-0.3px", color: "#1c1c1c", textTransform: "uppercase", margin: "0 0 20px 0" }}>
            {post.title}
          </h2>

          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.75, margin: "0 0 32px 0" }}>
            {post.excerpt}
          </p>

          <Link
            to={localizePath(`/blog/${post.slug || post.id}`)}
            style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "var(--fw-website-primary)", padding: "16px 32px", textDecoration: "none", display: "inline-block", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--fw-website-primary-strong)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--fw-website-primary)"}
          >
            {t("common.readArticle", "READ ARTICLE")}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* â”€â”€ BLOG CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function BlogCard({ post, imgSrc, delay = 0 }) {
  const { t, localizePath } = useLanguage();
  return (
    <div
      className="blog-card"
      style={{
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        transition: "transform .25s ease, box-shadow .25s ease",
        animationDelay: `${delay}s`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.11)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", height: "200px" }}>
        <img
          src={imgSrc}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .4s ease" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        <div style={{ position: "absolute", top: "14px", left: "14px", background: "var(--fw-website-primary)", padding: "4px 10px" }}>
          <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#1c1c1c" }}>{post.category}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div className="blog-meta" style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <span style={{ color: "#aaa", fontSize: "12px" }}>{post.date}</span>
          <span style={{ color: "#aaa", fontSize: "12px" }}>· {post.readTime} {t("blogPage.readTime", "read time")}</span>
        </div>

        <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "16px", lineHeight: 1.25, letterSpacing: "-0.2px", color: "#1c1c1c", textTransform: "uppercase", margin: "0 0 14px 0" }}>
          {post.title}
        </h3>

        <p style={{ color: "#777", fontSize: "13.5px", lineHeight: 1.7, margin: "0 0 24px 0", flex: 1 }}>
          {post.excerpt.substring(0, 120)}...
        </p>

        <Link
          to={localizePath(`/blog/${post.slug || post.id}`)}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--fw-website-primary)", textDecoration: "none", marginTop: "auto" }}
          onMouseEnter={e => e.currentTarget.style.gap = "10px"}
          onMouseLeave={e => e.currentTarget.style.gap = "6px"}
        >
          {t("common.readMore", "READ MORE")}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="var(--fw-website-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* â”€â”€ BLOG GRID â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function BlogGrid({ posts }) {
  const [ref, vis] = useInView(0.05);
  const { t } = useLanguage();
  const categories = [
    t("blogPage.categories.all", "All"),
    t("blogPage.categories.craftsmanship", "Craftsmanship"),
    t("blogPage.categories.offshore", "Offshore"),
    t("blogPage.categories.finishing", "Finishing"),
    t("blogPage.categories.certification", "Certification"),
    t("blogPage.categories.production", "Production"),
    t("blogPage.categories.industry", "Industry"),
  ];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filtered = activeCategory === categories[0]
    ? posts.filter(p => !p.featured)
    : posts.filter(p => !p.featured && p.category === activeCategory);

  return (
    <section style={{ background: "#f4f4f4", padding: "72px 0" }}>
      <style>{`
        .bg-grid { opacity:0; transform:translateY(24px); transition: opacity .6s ease, transform .6s ease; }
        .bg-on .bg-grid { opacity:1; transform:none; }
        .cat-btn { background: transparent; border: 1.5px solid #ddd; cursor: pointer; transition: all .2s; }
        .cat-btn:hover { border-color: var(--fw-website-primary); color: #1c1c1c !important; }
        .cat-btn.active { background: var(--fw-website-primary) !important; border-color: var(--fw-website-primary) !important; color: #1c1c1c !important; }
      `}</style>

      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "bg-on" : "")}>

        {/* Header + filter */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", marginBottom: "48px" }}>
          <div>
            <p style={{ margin: "0 0 10px 0", color: "var(--fw-website-primary)", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>{t("blogPage.allArticles", "ALL ARTICLES")}</p>
            <h2 style={{ margin: 0, fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.4vw, 30px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
              <span style={{ color: "#1c1c1c" }}>{t("blogPage.recentTitle", "RECENT ")}</span><span style={{ color: "var(--fw-website-primary)" }}>{t("blogPage.recentAccent", "PUBLICATIONS")}</span>
            </h2>
          </div>

          {/* Category filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={"cat-btn" + (activeCategory === cat ? " active" : "")}
                style={{
                  fontFamily: "Arial Black, Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: "11px",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  color: activeCategory === cat ? "#1c1c1c" : "#777",
                  padding: "8px 16px",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="bg-grid fw-three-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
          {filtered.length > 0 ? filtered.map((post, i) => (
            <BlogCard key={post.id} post={post} imgSrc={post.image || BLOG_FALLBACK_IMAGES[i % BLOG_FALLBACK_IMAGES.length]} delay={i * 0.1} />
          )) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: "#aaa", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
              {t("blogPage.noResults", "No articles found in this category.")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* â”€â”€ NIEUWSBRIEF CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function NewsletterCta() {
  const [ref, vis] = useInView(0.2);
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.subscribeNewsletter(email);
      setDone(true);
      setError("");
    } catch (err) {
      setError(err.message || t("blogPage.newsletterError", "Subscription failed."));
    }
  }

  return (
    <section style={{ background: "#1c1c1c", padding: "72px 0" }}>
      <style>{`
        .nl-inner { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .nl-on .nl-inner { opacity:1; transform:none; }
      `}</style>
      <div ref={ref} className={"max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "nl-on" : "")}>
        <div className="nl-inner" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ margin: "0 0 12px 0", color: "var(--fw-website-primary)", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>{t("blogPage.newsletterEyebrow", "STAY INFORMED")}</p>
          <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 2.4vw, 30px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.3px", color: "#fff", margin: "0 0 16px 0" }}>
            {t("blogPage.newsletterTitle", "RECEIVE OUR ")}<span style={{ color: "var(--fw-website-primary)" }}>{t("blogPage.newsletterAccent", "NEWSLETTER")}</span>
          </h2>
          <p style={{ color: "#888", fontSize: "15px", lineHeight: 1.6, margin: "0 0 32px 0" }}>
            {t("blogPage.newsletterText", "New articles, project updates and technical tips - straight to your inbox.")}
          </p>

          {done ? (
            <div style={{ background: "#252525", borderLeft: "4px solid var(--fw-website-primary)", padding: "20px 24px", textAlign: "left" }}>
              <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "14px", color: "#fff", textTransform: "uppercase" }}>{t("blogPage.newsletterSuccess", "Subscription successful! ✓")}</span>
            </div>
          ) : (
            <form className="nl-form" onSubmit={handleSubmit} style={{ display: "flex", gap: "0", maxWidth: "480px", margin: "0 auto" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="uw@email.nl"
                required
                style={{ flex: 1, background: "#2a2a2a", border: "1.5px solid #444", borderRight: "none", padding: "16px 18px", fontSize: "14px", color: "#fff", fontFamily: "Arial, sans-serif", outline: "none" }}
                onFocus={e => e.currentTarget.style.borderColor = "var(--fw-website-primary)"}
                onBlur={e => e.currentTarget.style.borderColor = "#444"}
              />
              <button
                type="submit"
                style={{ background: "var(--fw-website-primary)", border: "none", padding: "16px 28px", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#1c1c1c", cursor: "pointer", transition: "background .2s", flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--fw-website-primary-strong)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--fw-website-primary)"}
              >
                {t("blogPage.newsletterCta", "SUBSCRIBE")}
              </button>
            </form>
          )}
          {error && <p style={{ color: "#fca5a5", fontSize: "13px", marginTop: "14px" }}>{error}</p>}
        </div>
      </div>
    </section>
  );
}

/* â”€â”€ CTA STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function CtaStrip() {
  const { t, localizePath } = useLanguage();
  return (
    <section style={{ background: "#f4f4f4", padding: "72px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="fw-cta-box" style={{ background: "#1c1c1c", padding: "48px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "clamp(18px, 2.2vw, 26px)", textTransform: "uppercase", color: "#fff", margin: "0 0 8px 0", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
              {t("blogPage.ctaTitle", "HAVE A PROJECT ")}<span style={{ color: "var(--fw-website-primary)" }}>{t("blogPage.ctaAccent", "IN MIND?")}</span>
            </h2>
            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>{t("blogPage.ctaText", "Get in touch - we would love to think along with you.")}</p>
          </div>
          <Link
            to={localizePath("/contact")}
            className="fw-primary-action"
            style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#1c1c1c", background: "var(--fw-website-primary)", padding: "16px 32px", textDecoration: "none", display: "inline-block", transition: "background .2s", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--fw-website-primary-strong)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--fw-website-primary)"}
          >
            {t("common.contactUs", "CONTACT US")}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* â”€â”€ PAGE EXPORT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function BlogPage() {
  const { cms } = useCms();
  const posts = (cms.blog && cms.blog.length) ? cms.blog : FALLBACK_POSTS;
  const featIdx = posts.findIndex(p => p.featured);
  const featured = featIdx >= 0 ? posts[featIdx] : null;
  const featuredImgSrc = featured ? (featured.image || BLOG_FALLBACK_IMAGES[0]) : null;
  return (
    <>
      <PageHero />
      {featured && <FeaturedPost post={featured} imgSrc={featuredImgSrc} />}
      <BlogGrid posts={posts} />
      <NewsletterCta />
      <CtaStrip />
    </>
  );
}


