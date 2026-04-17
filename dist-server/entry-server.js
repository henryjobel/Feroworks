import { a as RichTextContent, c as api, i as getFontOption, n as AuthProvider, o as CmsProvider, r as DEFAULT_THEME_SETTINGS, s as useCms } from "./assets/admin-B18FhdYm.js";
import { Suspense, createContext, lazy, useContext, useEffect, useMemo, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { BrowserRouter, Link, Outlet, Route, Routes, StaticRouter, useLocation, useNavigate, useParams } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/i18n/translations.js
var SUPPORTED_LANGUAGES = [{
	code: "nl",
	label: "Nederlands"
}];
var translations = { nl: { nav: {
	overOns: "Over ons",
	diensten: "Diensten",
	sectoren: "Sectoren",
	blog: "Blog",
	contact: "Contact",
	cta: "NEEM CONTACT OP",
	brandTagline: "metaalwerk",
	menuToggle: "Menu openen"
} } };
//#endregion
//#region src/i18n/LanguageContext.jsx
var LanguageContext = createContext(null);
var DEFAULT_LANGUAGE = "nl";
function getValueByPath(obj, path) {
	return path.split(".").reduce((acc, key) => {
		if (acc && Object.prototype.hasOwnProperty.call(acc, key)) return acc[key];
	}, obj);
}
function LanguageProvider({ children }) {
	const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
	useEffect(() => {
		if (typeof document !== "undefined") document.documentElement.lang = language;
	}, [language]);
	const value = useMemo(() => {
		const t = (key, fallback = "") => {
			const found = getValueByPath(translations[language] || {}, key);
			if (typeof found === "string") return found;
			return fallback || key;
		};
		return {
			language,
			setLanguage,
			supportedLanguages: SUPPORTED_LANGUAGES,
			t
		};
	}, [language]);
	return /* @__PURE__ */ jsx(LanguageContext.Provider, {
		value,
		children
	});
}
function useLanguage() {
	const ctx = useContext(LanguageContext);
	if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
	return ctx;
}
//#endregion
//#region src/components/Navbar.jsx
var navLinks = [
	{
		key: "overOns",
		to: "/over-ons"
	},
	{
		key: "diensten",
		to: "/diensten"
	},
	{
		key: "sectoren",
		to: "/sectoren"
	},
	{
		key: "blog",
		to: "/blog"
	},
	{
		key: "contact",
		to: "/contact"
	}
];
function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const { t } = useLanguage();
	const { cms } = useCms();
	const phone = cms.site?.tel || "+31 (0)165 205 617";
	return /* @__PURE__ */ jsxs("nav", {
		className: "w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between",
			style: { height: "78px" },
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "flex items-center gap-2 shrink-0 no-underline",
					style: { maxWidth: "calc(100% - 56px)" },
					children: [/* @__PURE__ */ jsxs("svg", {
						width: "36",
						height: "36",
						viewBox: "0 0 36 36",
						fill: "none",
						xmlns: "http://www.w3.org/2000/svg",
						children: [/* @__PURE__ */ jsx("rect", {
							width: "36",
							height: "36",
							rx: "4",
							fill: "var(--fw-website-primary)"
						}), /* @__PURE__ */ jsx("path", {
							d: "M7 28 L11 14 L16 22 L21 14 L25 28",
							stroke: "#1a1a1a",
							strokeWidth: "2.5",
							fill: "none",
							strokeLinejoin: "round"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col leading-none",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline",
							children: [/* @__PURE__ */ jsx("span", {
								className: "site-title text-[24px] font-black text-gray-900 tracking-tight",
								children: "FERRO"
							}), /* @__PURE__ */ jsx("span", {
								className: "site-title text-[24px] font-black tracking-tight theme-primary-text",
								children: "WORKS"
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[13px] italic text-gray-500 font-normal",
							children: t("nav.brandTagline", "metalwork")
						})]
					})]
				}),
				/* @__PURE__ */ jsx("ul", {
					className: "hidden lg:flex items-center gap-7 xl:gap-9 list-none flex-1 justify-center m-0 p-0",
					children: navLinks.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
						to: item.to,
						className: "site-heading text-gray-800 text-[17px] font-semibold tracking-[0.01em] no-underline transition-colors duration-200 whitespace-nowrap",
						onMouseEnter: (e) => e.currentTarget.style.color = "var(--fw-website-primary)",
						onMouseLeave: (e) => e.currentTarget.style.color = "",
						children: t(`nav.${item.key}`, item.key)
					}) }, item.key))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "hidden lg:flex items-center gap-5 xl:gap-6 shrink-0",
					children: [/* @__PURE__ */ jsx("a", {
						href: `tel:${phone.replace(/[\s()]/g, "")}`,
						className: "text-gray-800 text-[16px] font-medium no-underline hover:text-[var(--fw-website-primary-strong)] transition-colors duration-200 whitespace-nowrap",
						children: phone
					}), /* @__PURE__ */ jsx(Link, {
						to: "/contact",
						className: "site-heading no-underline text-white text-[14px] font-bold tracking-wide px-6 py-3 rounded-full whitespace-nowrap transition-colors duration-200 theme-primary-bg",
						style: { color: "var(--fw-website-secondary)" },
						onMouseEnter: (e) => e.currentTarget.style.filter = "brightness(0.94)",
						onMouseLeave: (e) => e.currentTarget.style.filter = "none",
						children: t("nav.cta", "CONTACT US")
					})]
				}),
				/* @__PURE__ */ jsxs("button", {
					className: "site-menu-button lg:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 bg-transparent border-none cursor-pointer p-0",
					onClick: () => setMenuOpen(!menuOpen),
					"aria-label": t("nav.menuToggle", "Toggle menu"),
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "block w-6 h-0.5 bg-gray-800 transition-all duration-300",
							style: { transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none" }
						}),
						/* @__PURE__ */ jsx("span", {
							className: "block w-6 h-0.5 bg-gray-800 transition-all duration-300",
							style: { opacity: menuOpen ? 0 : 1 }
						}),
						/* @__PURE__ */ jsx("span", {
							className: "block w-6 h-0.5 bg-gray-800 transition-all duration-300",
							style: { transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }
						})
					]
				})
			]
		}), menuOpen && /* @__PURE__ */ jsxs("div", {
			className: "lg:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4",
			children: [
				navLinks.map((item) => /* @__PURE__ */ jsx(Link, {
					to: item.to,
					className: "text-gray-800 text-[18px] font-semibold no-underline py-3 border-b border-gray-100",
					onClick: () => setMenuOpen(false),
					children: t(`nav.${item.key}`, item.key)
				}, item.key)),
				/* @__PURE__ */ jsx("a", {
					href: `tel:${phone.replace(/[\s()]/g, "")}`,
					className: "text-gray-800 text-[16px] font-medium no-underline py-3",
					children: phone
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/contact",
					className: "site-heading no-underline text-[14px] font-bold tracking-wide px-6 py-3 rounded-full text-center theme-primary-bg",
					style: { color: "var(--fw-website-secondary)" },
					onClick: () => setMenuOpen(false),
					children: t("nav.cta", "CONTACT US")
				})
			]
		})]
	});
}
//#endregion
//#region src/assets/hero-background.jpeg
var hero_background_default = "/assets/hero-background-a4nmQpHQ.jpeg";
//#endregion
//#region src/components/HeroBanner.jsx
function HeroBanner() {
	const { cms } = useCms();
	const hero = cms.hero || {};
	return /* @__PURE__ */ jsxs("section", {
		className: "home-hero",
		style: {
			position: "relative",
			width: "100%",
			minHeight: "calc(100vh - 72px)",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			backgroundColor: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "hero-bg",
				style: {
					position: "absolute",
					inset: 0,
					backgroundImage: `url(${hero.image || "/assets/hero-background-a4nmQpHQ.jpeg"})`,
					backgroundSize: "cover",
					backgroundPosition: "center right",
					backgroundRepeat: "no-repeat"
				}
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 md:hidden",
				style: { background: "rgba(20,22,22,0.82)" }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 hidden md:block",
				style: { background: "linear-gradient(90deg, rgba(20,22,22,0.88) 0%, rgba(20,22,22,0.80) 30%, rgba(20,22,22,0.55) 55%, rgba(20,22,22,0.15) 80%, rgba(20,22,22,0.0) 100%)" }
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "60px",
					paddingBottom: "60px"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "hidden md:block",
						style: {
							position: "absolute",
							top: "0px",
							right: "32px"
						},
						children: /* @__PURE__ */ jsxs("svg", {
							width: "96",
							height: "108",
							viewBox: "0 0 102 115",
							fill: "none",
							xmlns: "http://www.w3.org/2000/svg",
							children: [
								/* @__PURE__ */ jsx("path", {
									d: "M13 13H56V28H28V87H13V13Z",
									stroke: "var(--fw-website-primary)",
									strokeWidth: "7"
								}),
								/* @__PURE__ */ jsx("path", {
									d: "M89 102H46V87H74V28H89V102Z",
									stroke: "var(--fw-website-primary)",
									strokeWidth: "7"
								}),
								/* @__PURE__ */ jsx("path", {
									d: "M28 28H46V68H56V28H74",
									stroke: "var(--fw-website-primary)",
									strokeWidth: "7",
									fill: "none"
								})
							]
						})
					}),
					/* @__PURE__ */ jsx("h1", {
						style: {
							margin: 0,
							padding: 0,
							color: "var(--fw-website-primary)",
							fontFamily: "var(--fw-website-heading-font)",
							fontSize: "clamp(30px, 3.2vw, 52px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase",
							fontWeight: 900
						},
						children: hero.line1
					}),
					/* @__PURE__ */ jsx("h2", {
						style: {
							margin: 0,
							padding: 0,
							color: "#F3F3F3",
							fontFamily: "var(--fw-website-heading-font)",
							fontSize: "clamp(30px, 3.2vw, 52px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase",
							fontWeight: 900
						},
						children: hero.line2
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							marginTop: "32px",
							marginBottom: "32px",
							color: "#E0E0E0",
							fontSize: "15px",
							lineHeight: 1.65,
							fontWeight: 400,
							maxWidth: "480px"
						},
						children: hero.subtitle.split("\n").map((line, i) => /* @__PURE__ */ jsxs("span", { children: [line, i < hero.subtitle.split("\n").length - 1 && /* @__PURE__ */ jsx("br", {})] }, i))
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "100%",
						height: "1px",
						backgroundColor: "rgba(255,255,255,0.18)",
						marginBottom: "22px"
					} }),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 md:grid-cols-4 hero-checks",
						style: {
							gap: "12px",
							marginBottom: "42px"
						},
						children: (hero.checkItems || []).map((text, i) => /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "flex-start",
								gap: "10px"
							},
							children: [/* @__PURE__ */ jsx("svg", {
								width: "13",
								height: "13",
								viewBox: "0 0 16 16",
								fill: "none",
								style: {
									flexShrink: 0,
									marginTop: "2px"
								},
								children: /* @__PURE__ */ jsx("path", {
									d: "M2 8.5L6 12.5L14 4.5",
									stroke: "var(--fw-website-primary)",
									strokeWidth: "2.6",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							}), /* @__PURE__ */ jsx("span", {
								style: {
									color: "#D8D8D8",
									fontSize: "13px",
									lineHeight: 1.45,
									fontWeight: 400
								},
								children: text
							})]
						}, i))
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							display: "inline-block",
							textDecoration: "none",
							backgroundColor: "var(--fw-website-primary)",
							color: "var(--fw-website-secondary)",
							borderRadius: "999px",
							padding: "15px 32px",
							fontSize: "13px",
							fontWeight: 900,
							textTransform: "uppercase",
							fontFamily: "var(--fw-website-heading-font)",
							letterSpacing: "1px",
							transition: "background-color 0.2s"
						},
						onMouseEnter: (e) => e.currentTarget.style.filter = "brightness(0.94)",
						onMouseLeave: (e) => e.currentTarget.style.filter = "none",
						children: hero.cta
					})
				]
			})
		]
	});
}
//#endregion
//#region src/assets/over-ons2.png
var over_ons2_default = "/assets/over-ons2-Cfi8JRv3.png";
//#endregion
//#region src/assets/over-ons3.png
var over_ons3_default = "/assets/over-ons3-B7TQ4OxP.png";
//#endregion
//#region src/components/WatFernaSection.jsx
var bulletItems = [
	"Heldere afspraken, zonder verrassingen.",
	"Totaal ontzorgen van ontwerp tot montage.",
	"Reparatie en onderhoud op locatie.",
	"Advies en ondersteuning bij ontwerp en uitvoerbaarheid.",
	"Eén partner voor het volledige traject.",
	"Maakbaar, praktisch en doordacht.",
	"Transparant in kosten en planning."
];
function WatFernaSection() {
	const { cms } = useCms();
	const wf = cms.watFerna || {};
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .1 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		ref,
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: [
			/* @__PURE__ */ jsx("style", { children: `
        .wf-left  { opacity:0; transform:translateX(-36px); transition: opacity .65s ease, transform .65s ease; }
        .wf-img1  { opacity:0; transform:translateY(-24px); transition: opacity .65s .2s ease, transform .65s .2s ease; }
        .wf-img2  { opacity:0; transform:translateY(24px);  transition: opacity .65s .4s ease, transform .65s .4s ease; }
        .wf-sq    { opacity:0; transform:scale(0.4);        transition: opacity .5s .55s ease, transform .5s .55s ease; }
        .wf-on .wf-left,
        .wf-on .wf-img1,
        .wf-on .wf-img2,
        .wf-on .wf-sq { opacity:1; transform:none; }
      ` }),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-6 md:px-8 wf-grid " + (vis ? "wf-on" : ""),
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1.4fr",
					gap: "72px",
					alignItems: "start"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					className: "wf-left",
					children: [/* @__PURE__ */ jsxs("h2", {
						style: {
							margin: "0 0 24px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(20px,2.2vw,28px)",
							lineHeight: 1.1,
							textTransform: "uppercase",
							letterSpacing: "-0.2px"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								style: { color: "var(--fw-website-primary)" },
								children: wf.title1
							}),
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", {
								style: { color: "#1c1c1c" },
								children: wf.title2
							})
						]
					}), /* @__PURE__ */ jsx("ul", {
						style: {
							listStyle: "none",
							margin: 0,
							padding: 0,
							display: "flex",
							flexDirection: "column",
							gap: "13px"
						},
						children: (wf.bulletItems || bulletItems).map((item, i) => /* @__PURE__ */ jsxs("li", {
							style: {
								display: "flex",
								alignItems: "flex-start",
								gap: "9px"
							},
							children: [/* @__PURE__ */ jsx("span", { style: {
								width: "5px",
								height: "5px",
								borderRadius: "50%",
								background: "#555",
								marginTop: "7px",
								flexShrink: 0
							} }), /* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "15px",
									lineHeight: 1.6
								},
								children: item
							})]
						}, i))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "wf-visual",
					style: {
						position: "relative",
						height: "360px"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "wf-sq",
							style: {
								position: "absolute",
								bottom: 0,
								right: 0,
								width: "90px",
								height: "90px",
								background: "var(--fw-website-primary)",
								zIndex: 1
							}
						}),
						/* @__PURE__ */ jsx("div", {
							className: "wf-img1",
							style: {
								position: "absolute",
								top: 0,
								left: 0,
								width: "67%",
								height: "72%",
								overflow: "hidden",
								zIndex: 2,
								boxShadow: "0 2px 16px rgba(0,0,0,0.13)"
							},
							children: /* @__PURE__ */ jsx("img", {
								src: wf.image1 || "/assets/over-ons2-Cfi8JRv3.png",
								alt: "Ferna werkplaats",
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover",
									display: "block"
								}
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "wf-img2",
							style: {
								position: "absolute",
								bottom: 0,
								right: "36px",
								width: "42%",
								height: "68%",
								overflow: "hidden",
								zIndex: 3,
								boxShadow: "0 2px 16px rgba(0,0,0,0.16)"
							},
							children: /* @__PURE__ */ jsx("img", {
								src: wf.image2 || "/assets/over-ons3-B7TQ4OxP.png",
								alt: "Ferna medewerker",
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover",
									objectPosition: "top",
									display: "block"
								}
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .wf-grid { grid-template-columns: 1fr !important; gap: 42px !important; }
        }
      ` })
		]
	});
}
//#endregion
//#region src/components/ClientLogosSection.jsx
var logos = [
	{
		src: "/assets/volkerwessels-logo-DyhTrYGo.svg",
		alt: "VolkerWessels"
	},
	{
		src: "/assets/polytec-logo-gNLn9cuF.png",
		alt: "Polytec"
	},
	{
		src: "/assets/logo_verwater_jubileum-CF5Foz1h.svg",
		alt: "Verwater"
	},
	{
		src: "/assets/logo-de-kok-staalbouw-BTTth3jB.svg",
		alt: "De Kok Staalbouw"
	},
	{
		src: "/assets/ivens-logo-B1kdlLqy.png",
		alt: "Ivens"
	},
	{
		src: "/assets/actemium-vector-logo-qqk0EJat.svg",
		alt: "Actemium"
	}
];
function ClientLogosSection() {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			borderTop: "1px solid #e8e8e8",
			borderBottom: "1px solid #e8e8e8",
			padding: "36px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        @keyframes logo-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .logo-track {
          display: flex;
          width: max-content;
          animation: logo-scroll 22s linear infinite;
        }
        .logo-track:hover {
          animation-play-state: paused;
        }
        .logo-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 52px;
          flex-shrink: 0;
        }
        .logo-item img {
          height: 52px;
          width: auto;
          max-width: 160px;
          object-fit: contain;
          filter: grayscale(100%) opacity(0.55);
          transition: filter 0.3s ease;
          display: block;
        }
        .logo-item:hover img {
          filter: grayscale(0%) opacity(1);
        }
      ` }), /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			style: { overflow: "hidden" },
			children: /* @__PURE__ */ jsxs("div", {
				className: "logo-track",
				children: [logos.map((logo, i) => /* @__PURE__ */ jsx("div", {
					className: "logo-item",
					children: /* @__PURE__ */ jsx("img", {
						src: logo.src,
						alt: logo.alt
					})
				}, `a-${i}`)), logos.map((logo, i) => /* @__PURE__ */ jsx("div", {
					className: "logo-item",
					children: /* @__PURE__ */ jsx("img", {
						src: logo.src,
						alt: logo.alt
					})
				}, `b-${i}`))]
			})
		})]
	});
}
//#endregion
//#region src/assets/over-ons1.png
var over_ons1_default = "/assets/over-ons1-DD0I2h8C.png";
//#endregion
//#region src/components/WatOnsAndersMaakt.jsx
var defaultItems = [
	{
		title: "GROOT GENOEG OM REGIE TE VOEREN",
		desc: "Wij hebben de slagkracht en expertise om technische metaalprojecten volledig te realiseren."
	},
	{
		title: "KLEIN GENOEG OM DIRECT TE SCHAKELEN",
		desc: "Direct contact, snel schakelen en meebewegen met jouw planning."
	},
	{
		title: "PERSOONLIJK GENOEG OM VOORUIT TE DENKEN",
		desc: "We adviseren, optimaliseren en zorgen dat jouw project van begin tot eind klopt."
	}
];
function CheckIcon$3() {
	return /* @__PURE__ */ jsx("svg", {
		width: "22",
		height: "22",
		viewBox: "0 0 22 22",
		fill: "none",
		style: {
			flexShrink: 0,
			marginTop: "3px"
		},
		children: /* @__PURE__ */ jsx("polyline", {
			points: "3,11 9,17 20,5",
			stroke: "var(--fw-website-primary)",
			strokeWidth: "2.8",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function WatOnsAndersMaakt() {
	const { cms } = useCms();
	const items = cms.anders && cms.anders.items || defaultItems;
	const andersImage = cms.anders && cms.anders.image || null;
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .1 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			padding: "80px 0"
		},
		children: [
			/* @__PURE__ */ jsx("style", { children: `
        .woa-left  { opacity:0; transform:translateX(-32px); transition: opacity .6s ease, transform .6s ease; }
        .woa-right { opacity:0; transform:translateX(32px);  transition: opacity .6s .2s ease, transform .6s .2s ease; }
        .woa-sq    { opacity:0; transform:scale(0.4);        transition: opacity .5s .45s ease, transform .5s .45s ease; }
        .woa-on .woa-left,
        .woa-on .woa-right,
        .woa-on .woa-sq { opacity:1; transform:none; }
      ` }),
			/* @__PURE__ */ jsxs("div", {
				ref,
				className: "max-w-7xl mx-auto px-6 md:px-8 woa-grid " + (vis ? "woa-on" : ""),
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "80px",
					alignItems: "center"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					className: "woa-left",
					children: [/* @__PURE__ */ jsx("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.4vw, 32px)",
							textTransform: "uppercase",
							color: "#1c1c1c",
							margin: "0 0 40px 0",
							lineHeight: 1.1,
							letterSpacing: "-0.3px"
						},
						children: "WAT ONS ANDERS MAAKT"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "36px"
						},
						children: items.map((item, i) => /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "14px",
								alignItems: "flex-start"
							},
							children: [/* @__PURE__ */ jsx(CheckIcon$3, {}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "13.5px",
									textTransform: "uppercase",
									color: "#1c1c1c",
									margin: "0 0 10px 0",
									lineHeight: 1.3,
									letterSpacing: "0.2px"
								},
								children: item.title
							}), /* @__PURE__ */ jsx("p", {
								style: {
									fontSize: "14.5px",
									color: "#555",
									margin: 0,
									lineHeight: 1.65
								},
								children: item.desc
							})] })]
						}, i))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "woa-right",
					style: { position: "relative" },
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							position: "relative",
							zIndex: 2,
							lineHeight: 0
						},
						children: /* @__PURE__ */ jsx("img", {
							src: andersImage || "/assets/over-ons1-DD0I2h8C.png",
							alt: "Ferna machinepark",
							style: {
								width: "100%",
								height: "440px",
								objectFit: "cover",
								objectPosition: "center",
								display: "block"
							},
							className: "woa-image"
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "woa-sq",
						style: {
							position: "absolute",
							bottom: "-24px",
							right: "-24px",
							width: "80px",
							height: "80px",
							background: "var(--fw-website-primary)",
							zIndex: 1
						}
					})]
				})]
			}),
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .woa-grid { grid-template-columns: 1fr !important; gap: 42px !important; }
        }
      ` })
		]
	});
}
//#endregion
//#region src/components/StatsSection.jsx
function StatItem({ number, desc, delay }) {
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			gap: "10px",
			flex: 1
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				position: "relative",
				padding: "8px 12px"
			},
			children: [
				/* @__PURE__ */ jsx("span", { style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "12px",
					height: "12px",
					borderTop: "2.5px solid var(--fw-website-primary)",
					borderLeft: "2.5px solid var(--fw-website-primary)"
				} }),
				/* @__PURE__ */ jsx("span", { style: {
					position: "absolute",
					bottom: 0,
					right: 0,
					width: "12px",
					height: "12px",
					borderBottom: "2.5px solid var(--fw-website-primary)",
					borderRight: "2.5px solid var(--fw-website-primary)"
				} }),
				/* @__PURE__ */ jsx("span", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(26px, 3vw, 38px)",
						color: "#1c1c1c",
						lineHeight: 1,
						letterSpacing: "-0.5px"
					},
					children: number
				})
			]
		}), /* @__PURE__ */ jsx("p", {
			style: {
				fontSize: "13px",
				color: "#555",
				margin: 0,
				lineHeight: 1.5,
				maxWidth: "140px"
			},
			children: desc
		})]
	});
}
function StatsSection() {
	const { cms } = useCms();
	const stats = cms.stats || [];
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .15 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "52px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .ss-item {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity .5s ease, transform .5s ease;
        }
        .ss-item:nth-child(1) { transition-delay: 0s; }
        .ss-item:nth-child(2) { transition-delay: 0.12s; }
        .ss-item:nth-child(3) { transition-delay: 0.24s; }
        .ss-item:nth-child(4) { transition-delay: 0.36s; }
        .ss-on .ss-item { opacity: 1; transform: none; }

        @media (max-width: 640px) {
          .ss-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
        }
      ` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 ss-grid " + (vis ? "ss-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(4, 1fr)",
				gap: "48px",
				alignItems: "start"
			},
			children: stats.map((s, i) => /* @__PURE__ */ jsx("div", {
				className: "ss-item",
				children: /* @__PURE__ */ jsx(StatItem, {
					number: s.number,
					desc: s.desc
				})
			}, i))
		})]
	});
}
//#endregion
//#region src/components/OnzeSectorenSection.jsx
var sectorItems = [
	{
		title: "BOUW &\nUTILITEIT",
		description: "Staalconstructies, standaard hekwerken en prefab balkons voor bouw- en utiliteitsprojecten.",
		icon: /* @__PURE__ */ jsxs("svg", {
			width: "54",
			height: "54",
			viewBox: "0 0 54 54",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: "text-[#2f2f2f]",
			children: [
				/* @__PURE__ */ jsx("rect", {
					x: "10",
					y: "24",
					width: "14",
					height: "20",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ jsx("rect", {
					x: "30",
					y: "16",
					width: "14",
					height: "28",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M8 44H46",
					stroke: "currentColor",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M14 37H20M14 32H20",
					stroke: "currentColor",
					strokeWidth: "1.8",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M34 37H40M34 32H40M34 27H40M34 22H40",
					stroke: "currentColor",
					strokeWidth: "1.8",
					strokeLinecap: "round"
				})
			]
		})
	},
	{
		title: "INDUSTRIE",
		description: "Machinebouw, maatwerk staalconstructies, industriÃ«le installaties en laswerkzaamheden op locatie.",
		icon: /* @__PURE__ */ jsxs("svg", {
			width: "54",
			height: "54",
			viewBox: "0 0 54 54",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: "text-[#2f2f2f]",
			children: [
				/* @__PURE__ */ jsx("circle", {
					cx: "27",
					cy: "27",
					r: "7",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M27 11V16M27 38V43M11 27H16M38 27H43",
					stroke: "currentColor",
					strokeWidth: "2.5",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M15.9 15.9L19.4 19.4M34.6 34.6L38.1 38.1M38.1 15.9L34.6 19.4M19.4 34.6L15.9 38.1",
					stroke: "currentColor",
					strokeWidth: "2.5",
					strokeLinecap: "round"
				})
			]
		})
	},
	{
		title: "ARCHITECTUUR\n& DESIGN",
		description: "Design trappen en interieur- en exterieur maatwerk voor architectuur- en designprojecten.",
		icon: /* @__PURE__ */ jsxs("svg", {
			width: "54",
			height: "54",
			viewBox: "0 0 54 54",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: "text-[#2f2f2f]",
			children: [/* @__PURE__ */ jsx("path", {
				d: "M10 44H44",
				stroke: "currentColor",
				strokeWidth: "2.2",
				strokeLinecap: "round"
			}), /* @__PURE__ */ jsx("path", {
				d: "M10 44V38H20V32H30V26H40V14",
				stroke: "currentColor",
				strokeWidth: "2.2",
				strokeLinejoin: "miter",
				strokeLinecap: "round"
			})]
		})
	},
	{
		title: "MARITIEM",
		description: "Maatwerk staal- en aluminium constructies voor jachtbouw en maritieme toepassingen.",
		icon: /* @__PURE__ */ jsxs("svg", {
			width: "54",
			height: "54",
			viewBox: "0 0 54 54",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: "text-[#2f2f2f]",
			children: [
				/* @__PURE__ */ jsx("circle", {
					cx: "27",
					cy: "14",
					r: "3.5",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M27 17.5V43",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M20 25H34",
					stroke: "currentColor",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M16 43C16 37 21 32.5 27 32.5C33 32.5 38 37 38 43",
					stroke: "currentColor",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				})
			]
		})
	}
];
function SectorCard({ item }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "home-sector-card bg-[#f6f6f6] shadow-[0_18px_34px_rgba(0,0,0,0.06)] flex flex-col",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "home-sector-icon",
				children: item.icon
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "home-sector-title text-[#333333] font-black uppercase whitespace-pre-line leading-[1.08] tracking-[-0.6px]",
				style: { fontFamily: "Arial Black, Arial, sans-serif" },
				children: item.title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "home-sector-desc text-[#7b7b7b] font-medium",
				children: item.description
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/contact",
				className: "home-sector-link mt-auto inline-block text-[#9ca600] font-black uppercase tracking-[-0.2px]",
				style: { fontFamily: "Arial Black, Arial, sans-serif" },
				children: "LEES MEER"
			})
		]
	});
}
function OnzeSectoren() {
	const { cms } = useCms();
	const mergedItems = sectorItems.map((item, i) => ({
		...item,
		title: cms.sectoren && cms.sectoren[i] ? cms.sectoren[i].naam.replace(" & ", " &\n") : item.title,
		description: cms.sectoren && cms.sectoren[i] ? cms.sectoren[i].description : item.description
	}));
	return /* @__PURE__ */ jsxs("section", {
		className: "w-full bg-[#f3f3f3] pt-[48px] pb-[100px]",
		children: [/* @__PURE__ */ jsx("style", { children: `
        .home-sector-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 26px;
          margin-bottom: 42px;
        }

        .home-sector-card {
          min-height: 382px;
          padding: 42px 30px 34px;
          position: relative;
          overflow: hidden;
          border-top: 4px solid transparent;
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }

        .home-sector-card::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 46px;
          height: 46px;
          background: var(--fw-website-primary);
          opacity: .14;
          transform: translate(16px, -16px);
        }

        .home-sector-card:hover {
          transform: translateY(-4px);
          border-color: var(--fw-website-primary);
          box-shadow: 0 18px 38px rgba(0,0,0,.1);
        }

        .home-sector-icon {
          margin-bottom: 34px;
          color: #2f2f2f;
        }

        .home-sector-title {
          font-size: 27px;
          margin-bottom: 18px;
        }

        .home-sector-desc {
          font-size: 17px;
          line-height: 1.42;
          margin-bottom: 26px;
        }

        .home-sector-link {
          font-size: 15px;
        }

        @media (max-width: 1024px) {
          .home-sector-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
        }

        @media (max-width: 640px) {
          .home-sector-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 32px;
          }

          .home-sector-card {
            min-height: 258px;
            padding: 18px 14px 16px;
            border-top-color: var(--fw-website-primary);
          }

          .home-sector-card::after {
            width: 34px;
            height: 34px;
            transform: translate(12px, -12px);
          }

          .home-sector-icon {
            margin-bottom: 16px;
          }

          .home-sector-icon svg {
            width: 38px;
            height: 38px;
          }

          .home-sector-title {
            font-size: 15px;
            line-height: 1.16;
            letter-spacing: 0;
            margin-bottom: 10px;
          }

          .home-sector-desc {
            font-size: 12px;
            line-height: 1.45;
            margin-bottom: 16px;
          }

          .home-sector-link {
            font-size: 11px;
            color: #7f8900;
          }
        }

        @media (max-width: 360px) {
          .home-sector-grid {
            gap: 10px;
          }

          .home-sector-card {
            min-height: 244px;
            padding: 16px 12px 14px;
          }

          .home-sector-title {
            font-size: 13.5px;
          }

          .home-sector-desc {
            font-size: 11.5px;
          }
        }
      ` }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-[1200px] mx-auto px-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-[44px]",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-[#333333] uppercase font-black text-[34px] leading-none tracking-[-0.8px] mb-[16px]",
						style: { fontFamily: "Arial Black, Arial, sans-serif" },
						children: "ONZE SECTOREN"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[#6f6f6f] uppercase font-black text-[16px] tracking-[-0.2px]",
						style: { fontFamily: "Arial Black, Arial, sans-serif" },
						children: "MAATWERK VOOR ELKE SECTOR"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "home-sector-grid",
					children: mergedItems.map((item, index) => /* @__PURE__ */ jsx(SectorCard, { item }, index))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/contact",
						className: "inline-flex items-center justify-center min-w-[188px] h-[52px] rounded-full bg-[#b4bf00] text-white uppercase font-black text-[14px] px-8 hover:opacity-95 transition",
						style: { fontFamily: "Arial Black, Arial, sans-serif" },
						children: "NEEM CONTACT OP"
					})
				})
			]
		})]
	});
}
//#endregion
//#region src/assets/about/about-us1.jpeg
var about_us1_default = "/assets/about-us1-Fdlmxb8O.jpeg";
//#endregion
//#region src/assets/about/about-us2.jpeg
var about_us2_default = "/assets/about-us2-Dd2z2xke.jpeg";
//#endregion
//#region src/assets/about/about-us3.jpeg
var about_us3_default = "/assets/about-us3-De6QPg3_.jpeg";
//#endregion
//#region src/components/UwProjectSection.jsx
function UwProjectSection() {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .1 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f7f7f7",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .up-img1 { opacity:0; transform:translateX(-28px); transition: opacity .6s ease, transform .6s ease; }
        .up-img2 { opacity:0; transform:translateY(-20px); transition: opacity .6s .15s ease, transform .6s .15s ease; }
        .up-img3 { opacity:0; transform:translateY(28px);  transition: opacity .6s .3s ease, transform .6s .3s ease; }
        .up-sq   { opacity:0; transform:scale(0.4);        transition: opacity .5s .45s ease, transform .5s .45s ease; }
        .up-right { opacity:0; transform:translateX(32px); transition: opacity .65s .1s ease, transform .65s .1s ease; }
        .up-on .up-img1,
        .up-on .up-img2,
        .up-on .up-img3,
        .up-on .up-sq,
        .up-on .up-right { opacity:1; transform:none; }

        @media (max-width: 768px) {
          .up-grid { grid-template-columns: 1fr !important; }
          .up-photos { height: 380px !important; }
        }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 up-grid " + (vis ? "up-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "80px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "up-photos",
				style: {
					position: "relative",
					height: "500px"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "up-sq",
						style: {
							position: "absolute",
							bottom: "0",
							left: "8%",
							width: "88px",
							height: "88px",
							background: "var(--fw-website-primary)",
							zIndex: 1
						}
					}),
					/* @__PURE__ */ jsx("div", {
						className: "up-img1",
						style: {
							position: "absolute",
							top: "60px",
							left: "0",
							width: "44%",
							height: "68%",
							overflow: "hidden",
							zIndex: 2,
							boxShadow: "0 4px 18px rgba(0,0,0,0.13)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: about_us2_default,
							alt: "Ferna medewerker",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "top",
								display: "block"
							}
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "up-img2",
						style: {
							position: "absolute",
							top: "0",
							left: "36%",
							width: "30%",
							height: "30%",
							overflow: "hidden",
							zIndex: 3,
							boxShadow: "0 4px 18px rgba(0,0,0,0.13)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: about_us1_default,
							alt: "Ferna werkplaats",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "center",
								display: "block"
							}
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "up-img3",
						style: {
							position: "absolute",
							bottom: "0",
							right: "0",
							width: "56%",
							height: "62%",
							overflow: "hidden",
							zIndex: 4,
							boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: about_us3_default,
							alt: "Ferna directie",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "top",
								display: "block"
							}
						})
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "up-right",
				children: [
					/* @__PURE__ */ jsxs("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(24px, 2.8vw, 38px)",
							lineHeight: 1.1,
							margin: "0 0 28px 0",
							letterSpacing: "-0.3px"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "var(--fw-website-primary)" },
							children: "UW PROJECT IN "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#1c1c1c" },
							children: "GOEDE HANDEN"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							fontSize: "15px",
							color: "#555",
							lineHeight: 1.7,
							margin: "0 0 20px 0"
						},
						children: "FerroWorks is opgericht als familiebedrijf en werkt nog steeds zo. Korte lijnen, persoonlijke betrokkenheid, Ã©Ã©n partner voor het volledige traject."
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							fontSize: "15px",
							color: "#555",
							lineHeight: 1.7,
							margin: "0 0 36px 0"
						},
						children: "Van ontwerp en engineering tot productie, coating en montage op locatie. Specialist in maatwerk staal, RVS en aluminium projecten voor industrie, bouw, architectuur en maritiem."
					}),
					/* @__PURE__ */ jsx("a", {
						href: "/contact",
						style: {
							display: "inline-block",
							background: "var(--fw-website-primary-strong)",
							color: "#fff",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.8px",
							padding: "16px 36px",
							borderRadius: "50px",
							textDecoration: "none",
							transition: "background 0.2s"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "#7aa318",
						onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
						children: "NEEM CONTACT OP"
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/assets/past work/Afwerking-staalconstructie-met-natlak-300x225.webp
var Afwerking_staalconstructie_met_natlak_300x225_default = "/assets/Afwerking-staalconstructie-met-natlak-300x225-6cndE0Eo.webp";
//#endregion
//#region src/assets/past work/kwaliteitscontrole-lassen-featured-300x225.webp
var kwaliteitscontrole_lassen_featured_300x225_default = "/assets/kwaliteitscontrole-lassen-featured-300x225-Cwe_r9KD.webp";
//#endregion
//#region src/assets/past work/lascertificaat-verplicht-featured-300x158.webp
var lascertificaat_verplicht_featured_300x158_default = "/assets/lascertificaat-verplicht-featured-300x158-CWiBZQqV.webp";
//#endregion
//#region src/assets/past work/Offshore-constructie-300x190.webp
var Offshore_constructie_300x190_default = "/assets/Offshore-constructie-300x190-DmuHP4xB.webp";
//#endregion
//#region src/components/ProjectenSlider.jsx
var FALLBACK_IMAGES$3 = [
	Afwerking_staalconstructie_met_natlak_300x225_default,
	kwaliteitscontrole_lassen_featured_300x225_default,
	lascertificaat_verplicht_featured_300x158_default,
	Offshore_constructie_300x190_default
];
var defaultSlides = [
	{
		title: "MEETBUIZEN T.B.V. VLOEISTOFTANK",
		desc: "Voor deze klant hebben we maatwerk meetbuizen ten behoeve van een vloeistoftank geproduceerd.",
		image: null
	},
	{
		title: "STAALCONSTRUCTIE OFFSHORE PLATFORM",
		desc: "Complexe staalconstructie vervaardigd voor een offshore platform, volledig Lloyd's-gecertificeerd.",
		image: null
	},
	{
		title: "PIJPLEIDINGWERK PETROCHEMIE",
		desc: "Maatwerkpiping en koppelstukken geleverd voor een raffinaderij in de petrochemische sector.",
		image: null
	},
	{
		title: "TANKBOUW INDUSTRIEEL COMPLEX",
		desc: "Walsdelen, daksecties en mangaten geproduceerd voor een groot industrieel tankbouwproject.",
		image: null
	}
];
function ProjectenSlider() {
	const { cms } = useCms();
	const slides = cms.projecten && cms.projecten.length ? cms.projecten : defaultSlides;
	const [current, setCurrent] = useState(0);
	const [animating, setAnimating] = useState(false);
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .1 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	const goTo = (idx) => {
		if (animating || idx === current) return;
		setAnimating(true);
		setTimeout(() => {
			setCurrent(idx);
			setAnimating(false);
		}, 250);
	};
	const prev = () => goTo((current - 1 + slides.length) % slides.length);
	const next = () => goTo((current + 1) % slides.length);
	const slide = slides[Math.min(current, slides.length - 1)] || defaultSlides[0];
	const slideImg = slide.image || FALLBACK_IMAGES$3[Math.min(current, FALLBACK_IMAGES$3.length - 1)] || FALLBACK_IMAGES$3[0];
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#efefef",
			padding: "72px 0 64px"
		},
		children: [
			/* @__PURE__ */ jsx("style", { children: `
        .ps-wrap { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .ps-vis  { opacity:1; transform:none; }
        .ps-slide { opacity:1; transition: opacity .25s ease; }
        .ps-slide.fade { opacity:0; }
        .ps-arrow {
          width:40px; height:40px; border-radius:50%; border:none;
          background:rgba(255,255,255,0.7); cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; transition: background 0.2s;
        }
        .ps-arrow:hover { background:#fff; }
        .ps-dot {
          width:10px; height:10px; border-radius:50%;
          border:none; cursor:pointer; transition: background 0.2s;
          padding:0;
        }
      ` }),
			/* @__PURE__ */ jsxs("div", {
				ref,
				className: "max-w-7xl mx-auto px-6 md:px-8 ps-wrap " + (vis ? "ps-vis" : ""),
				children: [
					/* @__PURE__ */ jsxs("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(20px, 2.4vw, 30px)",
							textTransform: "uppercase",
							margin: "0 0 40px 0",
							letterSpacing: "-0.3px",
							textAlign: "center"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "var(--fw-website-primary)" },
							children: "PROJECTEN "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#1c1c1c" },
							children: "UIT HET VERLEDEN"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ps-row",
						style: {
							display: "flex",
							alignItems: "center",
							gap: "16px"
						},
						children: [
							/* @__PURE__ */ jsx("button", {
								className: "ps-arrow",
								onClick: prev,
								"aria-label": "Vorige",
								children: /* @__PURE__ */ jsx("svg", {
									width: "16",
									height: "16",
									viewBox: "0 0 16 16",
									fill: "none",
									children: /* @__PURE__ */ jsx("polyline", {
										points: "10,2 4,8 10,14",
										stroke: "#555",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "ps-slide" + (animating ? " fade" : ""),
								style: {
									flex: 1,
									background: "#fff",
									display: "grid",
									gridTemplateColumns: "1.1fr 1fr",
									minHeight: "260px",
									overflow: "hidden"
								},
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										overflow: "hidden",
										lineHeight: 0
									},
									children: /* @__PURE__ */ jsx("img", {
										src: slideImg,
										alt: slide.title,
										style: {
											width: "100%",
											height: "100%",
											objectFit: "cover",
											display: "block",
											minHeight: "240px"
										}
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "ps-copy",
									style: {
										padding: "36px 36px",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center"
									},
									children: [/* @__PURE__ */ jsx("h3", {
										style: {
											fontFamily: "Arial Black, Arial, sans-serif",
											fontWeight: 900,
											fontSize: "clamp(15px, 1.5vw, 18px)",
											textTransform: "uppercase",
											color: "#1c1c1c",
											margin: "0 0 16px 0",
											lineHeight: 1.2,
											letterSpacing: "0.1px"
										},
										children: slide.title
									}), /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "14px",
											color: "#666",
											lineHeight: 1.7,
											margin: 0
										},
										children: slide.desc
									})]
								})]
							}),
							/* @__PURE__ */ jsx("button", {
								className: "ps-arrow",
								onClick: next,
								"aria-label": "Volgende",
								children: /* @__PURE__ */ jsx("svg", {
									width: "16",
									height: "16",
									viewBox: "0 0 16 16",
									fill: "none",
									children: /* @__PURE__ */ jsx("polyline", {
										points: "6,2 12,8 6,14",
										stroke: "#555",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})
								})
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							justifyContent: "center",
							gap: "8px",
							marginTop: "24px"
						},
						children: slides.map((_, i) => /* @__PURE__ */ jsx("button", {
							className: "ps-dot",
							onClick: () => goTo(i),
							"aria-label": `Slide ${i + 1}`,
							style: { background: i === current ? "var(--fw-website-primary)" : "#bbb" }
						}, i))
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							textAlign: "center",
							marginTop: "36px"
						},
						children: /* @__PURE__ */ jsx("a", {
							href: "/contact",
							style: {
								display: "inline-block",
								background: "var(--fw-website-primary-strong)",
								color: "#fff",
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "13px",
								textTransform: "uppercase",
								letterSpacing: "0.8px",
								padding: "16px 36px",
								borderRadius: "50px",
								textDecoration: "none",
								transition: "background 0.2s"
							},
							onMouseEnter: (e) => e.currentTarget.style.background = "#7aa318",
							onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
							children: "NEEM CONTACT OP"
						})
					})
				]
			}),
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 640px) {
          .ps-slide { grid-template-columns: 1fr !important; }
        }
      ` })
		]
	});
}
//#endregion
//#region src/components/FaqSection.jsx
function FaqItem({ q, a }) {
	const [open, setOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		style: {
			background: "#fff",
			marginBottom: "12px",
			borderRadius: "2px",
			overflow: "hidden",
			boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
		},
		children: [/* @__PURE__ */ jsxs("button", {
			onClick: () => setOpen((v) => !v),
			style: {
				width: "100%",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "22px 28px",
				background: open ? "var(--fw-website-primary)" : "none",
				border: "none",
				cursor: "pointer",
				textAlign: "left",
				gap: "24px",
				transition: "background 0.25s ease"
			},
			children: [/* @__PURE__ */ jsx("span", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontWeight: 900,
					fontSize: "13.5px",
					textTransform: "uppercase",
					color: "#1c1c1c",
					letterSpacing: "0.1px",
					lineHeight: 1.3
				},
				children: q
			}), /* @__PURE__ */ jsx("span", {
				style: {
					flexShrink: 0,
					width: "22px",
					height: "22px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					transition: "transform 0.3s ease",
					transform: open ? "rotate(45deg)" : "rotate(0deg)"
				},
				children: /* @__PURE__ */ jsxs("svg", {
					width: "18",
					height: "18",
					viewBox: "0 0 18 18",
					fill: "none",
					children: [/* @__PURE__ */ jsx("line", {
						x1: "9",
						y1: "2",
						x2: "9",
						y2: "16",
						stroke: open ? "#1c1c1c" : "#aaa",
						strokeWidth: "1.8",
						strokeLinecap: "round"
					}), /* @__PURE__ */ jsx("line", {
						x1: "2",
						y1: "9",
						x2: "16",
						y2: "9",
						stroke: open ? "#1c1c1c" : "#aaa",
						strokeWidth: "1.8",
						strokeLinecap: "round"
					})]
				})
			})]
		}), /* @__PURE__ */ jsx("div", {
			style: {
				maxHeight: open ? "300px" : "0",
				overflow: "hidden",
				transition: "max-height 0.35s ease"
			},
			children: /* @__PURE__ */ jsx("p", {
				style: {
					margin: "0",
					padding: "0 28px 22px",
					fontSize: "14.5px",
					color: "#666",
					lineHeight: 1.7
				},
				children: a
			})
		})]
	});
}
function FaqSection() {
	const { cms } = useCms();
	const faqs = cms.faq || [];
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold: .1 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#ebebeb",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .faq-wrap { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .faq-vis  { opacity:1; transform:none; }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 faq-wrap " + (vis ? "faq-vis" : ""),
			children: [/* @__PURE__ */ jsx("h2", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontWeight: 900,
					fontSize: "clamp(22px, 2.6vw, 32px)",
					textTransform: "uppercase",
					color: "#1c1c1c",
					textAlign: "center",
					margin: "0 0 48px 0",
					letterSpacing: "-0.3px"
				},
				children: "VRAGEN DIE INKOPERS ONS STELLEN"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					maxWidth: "720px",
					margin: "0 auto"
				},
				children: faqs.map((item, i) => /* @__PURE__ */ jsx(FaqItem, {
					q: item.q,
					a: item.a
				}, item.q + i))
			})]
		})]
	});
}
//#endregion
//#region src/components/Footer.jsx
function Footer() {
	const { cms } = useCms();
	const site = cms.site || {};
	const phone = site.tel || "+31 (0)165 205 601";
	const email = site.email || "info@ferroworks.nl";
	const addressLines = (site.adres || "WESTELIJKE HAVENDIJK 31\n4703 RL ROOSENDAAL").split("\n");
	const linkedin = site.linkedin ? `https://${site.linkedin.replace(/^https?:\/\//, "")}` : "#";
	const instagram = site.instagram ? `https://${site.instagram.replace(/^https?:\/\//, "")}` : "#";
	return /* @__PURE__ */ jsxs("footer", {
		style: { background: "var(--fw-website-secondary)" },
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-6 md:px-8",
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "40px 0",
					flexWrap: "wrap",
					gap: "28px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "10px",
							flexShrink: 0
						},
						children: [/* @__PURE__ */ jsxs("svg", {
							width: "36",
							height: "36",
							viewBox: "0 0 36 36",
							fill: "none",
							children: [
								/* @__PURE__ */ jsx("rect", {
									width: "36",
									height: "36",
									fill: "var(--fw-website-primary)"
								}),
								/* @__PURE__ */ jsx("rect", {
									x: "7",
									y: "7",
									width: "10",
									height: "22",
									fill: "#1c1c1c"
								}),
								/* @__PURE__ */ jsx("rect", {
									x: "19",
									y: "7",
									width: "10",
									height: "10",
									fill: "#1c1c1c"
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							style: { lineHeight: 1 },
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "baseline",
									gap: "1px"
								},
								children: [/* @__PURE__ */ jsx("span", {
									className: "site-title",
									style: {
										fontWeight: 900,
										fontSize: "22px",
										color: "#fff",
										letterSpacing: "-0.5px"
									},
									children: "FERRO"
								}), /* @__PURE__ */ jsx("span", {
									className: "site-title theme-primary-text",
									style: {
										fontWeight: 900,
										fontSize: "22px",
										letterSpacing: "-0.5px"
									},
									children: "WORKS"
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "theme-primary-text",
								style: {
									fontStyle: "italic",
									fontSize: "11px",
									marginTop: "1px",
									letterSpacing: "0.5px"
								},
								children: site.tagline || "metaalwerk"
							})]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							color: "#ccc",
							fontSize: "13px",
							lineHeight: 1.7,
							fontWeight: 700,
							textTransform: "uppercase",
							letterSpacing: "0.2px"
						},
						children: addressLines.map((line) => /* @__PURE__ */ jsx("div", { children: line }, line))
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							width: "1px",
							height: "40px",
							background: "#555",
							flexShrink: 0
						},
						className: "hidden md:block"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: "13px",
							lineHeight: 1.8
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								color: "#ccc",
								fontWeight: 700,
								letterSpacing: "0.2px"
							},
							children: phone
						}), /* @__PURE__ */ jsx("a", {
							href: `mailto:${email}`,
							className: "theme-primary-text no-theme-link",
							style: {
								fontWeight: 700,
								letterSpacing: "0.2px",
								textDecoration: "none"
							},
							children: email.toUpperCase()
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "10px",
							flexShrink: 0
						},
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "#",
								"aria-label": "Facebook",
								style: socialStyle,
								children: /* @__PURE__ */ jsx("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "white",
									children: /* @__PURE__ */ jsx("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })
								})
							}),
							/* @__PURE__ */ jsx("a", {
								href: linkedin,
								"aria-label": "LinkedIn",
								style: socialStyle,
								children: /* @__PURE__ */ jsxs("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "white",
									children: [/* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" }), /* @__PURE__ */ jsx("circle", {
										cx: "4",
										cy: "4",
										r: "2",
										fill: "white"
									})]
								})
							}),
							/* @__PURE__ */ jsx("a", {
								href: instagram,
								"aria-label": "Instagram",
								style: socialStyle,
								children: /* @__PURE__ */ jsxs("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "none",
									children: [
										/* @__PURE__ */ jsx("rect", {
											x: "3",
											y: "3",
											width: "18",
											height: "18",
											rx: "5",
											stroke: "white",
											strokeWidth: "2"
										}),
										/* @__PURE__ */ jsx("circle", {
											cx: "12",
											cy: "12",
											r: "4",
											stroke: "white",
											strokeWidth: "2"
										}),
										/* @__PURE__ */ jsx("circle", {
											cx: "17.5",
											cy: "6.5",
											r: "1.2",
											fill: "white"
										})
									]
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", { style: { borderTop: "1px solid #4e4e4e" } }),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-6 md:px-8",
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "20px 0",
					flexWrap: "wrap",
					gap: "16px"
				},
				children: [/* @__PURE__ */ jsxs("p", {
					style: {
						color: "#888",
						fontSize: "12.5px",
						margin: 0
					},
					children: [
						"© FerroWorks. All Rights Reserved | Marketing door",
						" ",
						/* @__PURE__ */ jsx("a", {
							href: "https://leadi.nl",
							target: "_blank",
							rel: "noopener noreferrer",
							style: {
								color: "#888",
								textDecoration: "underline"
							},
							children: "Leadi"
						})
					]
				}), /* @__PURE__ */ jsx("nav", {
					style: {
						display: "flex",
						gap: "32px",
						flexWrap: "wrap"
					},
					children: [
						{
							label: "VACATURES",
							href: "#"
						},
						{
							label: "MACHINEPARK",
							href: "#"
						},
						{
							label: "PRIVACY POLICY",
							href: "/privacy-policy"
						},
						{
							label: "ALGEMENE VOORWAARDEN",
							href: "/algemene-voorwaarden"
						}
					].map((link) => /* @__PURE__ */ jsx("a", {
						href: link.href,
						style: {
							color: "#ccc",
							fontSize: "12px",
							fontWeight: 700,
							letterSpacing: "0.5px",
							textDecoration: "none",
							fontFamily: "var(--fw-website-heading-font)"
						},
						onMouseEnter: (e) => e.currentTarget.style.color = "var(--fw-website-primary)",
						onMouseLeave: (e) => e.currentTarget.style.color = "#ccc",
						children: link.label
					}, link.label))
				})]
			})
		]
	});
}
var socialStyle = {
	width: "36px",
	height: "36px",
	borderRadius: "50%",
	background: "#555",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	transition: "background 0.2s",
	textDecoration: "none"
};
//#endregion
//#region src/pages/OverOnsPage.jsx
function useInView$6(threshold = .12) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
function CheckIcon$2() {
	return /* @__PURE__ */ jsx("svg", {
		width: "22",
		height: "22",
		viewBox: "0 0 22 22",
		fill: "none",
		style: {
			flexShrink: 0,
			marginTop: "3px"
		},
		children: /* @__PURE__ */ jsx("polyline", {
			points: "3,11 9,17 20,5",
			stroke: "var(--fw-website-primary)",
			strokeWidth: "2.8",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function PageHero$4() {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "380px",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${hero_background_default})`,
				backgroundSize: "cover",
				backgroundPosition: "center right"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "64px",
					paddingBottom: "64px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "24px"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "var(--fw-website-primary)",
									fontSize: "13px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#666",
									fontSize: "13px"
								},
								children: "â€º"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Over Ons"
							})
						]
					}),
					/* @__PURE__ */ jsxs("h1", {
						style: {
							margin: "0 0 16px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px, 4vw, 56px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "var(--fw-website-primary)" },
							children: "VORMGEVERS "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#fff" },
							children: "IN METAAL"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: 0,
							color: "#bbb",
							fontSize: "clamp(14px, 1.6vw, 17px)",
							lineHeight: 1.6,
							maxWidth: "520px"
						},
						children: "FerroWorks begeleidt metaalprojecten van ontwerp en engineering tot productie en montage. Specialist in maatwerk Staal, RVS en Aluminium."
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "var(--fw-website-primary)",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function OnsVerhaal() {
	const [ref, vis] = useInView$6();
	const { cms } = useCms();
	const v = cms.overOns && cms.overOns.verhaal || {};
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .ov-left { opacity:0; transform:translateX(-36px); transition: opacity .65s ease, transform .65s ease; }
        .ov-img1 { opacity:0; transform:translateY(-24px); transition: opacity .65s .2s ease, transform .65s .2s ease; }
        .ov-img2 { opacity:0; transform:translateY(24px);  transition: opacity .65s .4s ease, transform .65s .4s ease; }
        .ov-sq   { opacity:0; transform:scale(0.4);        transition: opacity .5s .55s ease, transform .5s .55s ease; }
        .ov-on .ov-left, .ov-on .ov-img1, .ov-on .ov-img2, .ov-on .ov-sq { opacity:1; transform:none; }
        @media (max-width: 768px) { .ov-grid { grid-template-columns: 1fr !important; } .ov-photos { height: 300px !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 ov-grid " + (vis ? "ov-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1.3fr",
				gap: "72px",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ov-left",
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "var(--fw-website-primary)",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "ONS VERHAAL"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							margin: "0 0 24px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(20px, 2.4vw, 30px)",
							lineHeight: 1.1,
							textTransform: "uppercase",
							letterSpacing: "-0.3px"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								style: { color: "var(--fw-website-primary)" },
								children: v.title1 || "GEBOUWD OP"
							}),
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", {
								style: { color: "#1c1c1c" },
								children: v.title2 || "VAKMANSCHAP"
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: "0 0 18px 0"
						},
						children: v.tekst1 || "FerroWorks is een familiebedrijf met meer dan 15 jaar ervaring in metaalmaatwerk. We begeleiden projecten van A tot Z â€” van ontwerp en engineering tot productie, coating en montage op locatie."
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: "0 0 18px 0"
						},
						children: v.tekst2 || "Specialist in maatwerk staal, RVS en aluminium voor industrie, bouw & utiliteit, architectuur & design en maritieme toepassingen."
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: 0
						},
						children: v.tekst3 || "Heldere afspraken, transparante kosten en Ã©Ã©n aanspreekpunt van begin tot eind. Dat is hoe wij werken."
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "ov-photos",
				style: {
					position: "relative",
					height: "380px"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "ov-sq",
						style: {
							position: "absolute",
							top: 0,
							right: 0,
							width: "80px",
							height: "80px",
							background: "var(--fw-website-primary)",
							zIndex: 1
						}
					}),
					/* @__PURE__ */ jsx("div", {
						className: "ov-img1",
						style: {
							position: "absolute",
							top: "40px",
							left: 0,
							width: "56%",
							height: "65%",
							overflow: "hidden",
							zIndex: 2,
							boxShadow: "0 4px 18px rgba(0,0,0,0.13)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: v.image1 || "/assets/over-ons2-Cfi8JRv3.png",
							alt: "FerroWorks productie",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "center",
								display: "block"
							}
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "ov-img2",
						style: {
							position: "absolute",
							bottom: 0,
							right: 0,
							width: "52%",
							height: "60%",
							overflow: "hidden",
							zIndex: 3,
							boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: v.image2 || "/assets/over-ons3-B7TQ4OxP.png",
							alt: "FerroWorks medewerker",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "top",
								display: "block"
							}
						})
					})
				]
			})]
		})]
	});
}
function StatsRow() {
	const [ref, vis] = useInView$6(.15);
	const { cms } = useCms();
	const stats = cms.stats || [];
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "60px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .st2-item { opacity:0; transform:translateY(20px); transition: opacity .5s ease, transform .5s ease; }
        .st2-on .st2-item:nth-child(1) { opacity:1; transform:none; transition-delay:.0s; }
        .st2-on .st2-item:nth-child(2) { opacity:1; transform:none; transition-delay:.12s; }
        .st2-on .st2-item:nth-child(3) { opacity:1; transform:none; transition-delay:.24s; }
        .st2-on .st2-item:nth-child(4) { opacity:1; transform:none; transition-delay:.36s; }
      ` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 st2-grid " + (vis ? "st2-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: `repeat(${stats.length || 4}, 1fr)`,
				gap: "32px"
			},
			children: stats.map((s, i) => /* @__PURE__ */ jsxs("div", {
				className: "st2-item",
				style: {
					borderLeft: "3px solid var(--fw-website-primary)",
					paddingLeft: "20px"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(28px, 3vw, 40px)",
						color: "var(--fw-website-primary)",
						lineHeight: 1,
						letterSpacing: "-0.5px"
					},
					children: s.number
				}), /* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "13px",
						color: "#fff",
						textTransform: "uppercase",
						letterSpacing: "0.3px",
						marginTop: "6px"
					},
					children: s.desc
				})]
			}, i))
		})]
	});
}
var FALLBACK_SERVICES = [
	"Heldere afspraken, zonder verrassingen.",
	"Totaal ontzorgen van ontwerp tot montage.",
	"Reparatie en onderhoud op locatie.",
	"Advies en ondersteuning bij ontwerp en uitvoerbaarheid.",
	"Ã‰Ã©n partner voor het volledige traject.",
	"Maakbaar, praktisch en doordacht.",
	"Transparant in kosten en planning."
];
function WatWeDoen() {
	const [ref, vis] = useInView$6();
	const { cms } = useCms();
	const wwd = cms.overOns && cms.overOns.watWeDoen || {};
	const services = wwd.items ? typeof wwd.items === "string" ? wwd.items.split("\n").filter(Boolean) : wwd.items : FALLBACK_SERVICES;
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .wwd-left  { opacity:0; transform:translateX(-32px); transition: opacity .6s ease, transform .6s ease; }
        .wwd-right { opacity:0; transform:translateX(32px);  transition: opacity .6s .2s ease, transform .6s .2s ease; }
        .wwd-on .wwd-left, .wwd-on .wwd-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .wwd-grid { grid-template-columns: 1fr !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 wwd-grid " + (vis ? "wwd-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "80px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "wwd-left",
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "var(--fw-website-primary)",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "ONZE DIENSTEN"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							margin: "0 0 32px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.6vw, 34px)",
							textTransform: "uppercase",
							lineHeight: 1.1,
							letterSpacing: "-0.3px"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								style: { color: "var(--fw-website-primary)" },
								children: "WAT FERROWORKS"
							}),
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", {
								style: { color: "#1c1c1c" },
								children: "VOOR JE DOET"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "14px"
						},
						children: services.map((s, i) => /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "flex-start",
								gap: "10px"
							},
							children: [/* @__PURE__ */ jsx(CheckIcon$2, {}), /* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "15px",
									lineHeight: 1.6
								},
								children: s
							})]
						}, i))
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "wwd-right",
				style: { position: "relative" },
				children: [/* @__PURE__ */ jsx("div", {
					className: "wwd-accent",
					style: {
						position: "absolute",
						bottom: "-16px",
						right: "-16px",
						width: "64px",
						height: "64px",
						background: "var(--fw-website-primary)",
						zIndex: 0
					}
				}), /* @__PURE__ */ jsx("div", {
					style: {
						position: "relative",
						zIndex: 1,
						overflow: "hidden",
						boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
					},
					children: /* @__PURE__ */ jsx("img", {
						className: "wwd-image",
						src: wwd.image || "/assets/over-ons1-DD0I2h8C.png",
						alt: "FerroWorks productie",
						style: {
							width: "100%",
							height: "340px",
							objectFit: "cover",
							objectPosition: "center",
							display: "block"
						}
					})
				})]
			})]
		})]
	});
}
var FALLBACK_DIFFERENTIATORS = [
	{
		title: "GROOT GENOEG OM REGIE TE VOEREN",
		desc: "Wij hebben de slagkracht en expertise om technische metaalprojecten volledig te realiseren."
	},
	{
		title: "KLEIN GENOEG OM DIRECT TE SCHAKELEN",
		desc: "Direct contact, snel schakelen en meebewegen met jouw planning."
	},
	{
		title: "PERSOONLIJK GENOEG OM VOORUIT TE DENKEN",
		desc: "We adviseren, optimaliseren en zorgen dat jouw project van begin tot eind klopt."
	}
];
function WatOnsAnders() {
	const [ref, vis] = useInView$6();
	const { cms } = useCms();
	const differentiators = cms.overOns && cms.overOns.andersItems && cms.overOns.andersItems.length ? cms.overOns.andersItems : FALLBACK_DIFFERENTIATORS;
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .woa2-head { opacity:0; transform:translateY(-20px); transition: opacity .55s ease, transform .55s ease; }
        .woa2-card { opacity:0; transform:translateY(28px); transition: opacity .55s ease, transform .55s ease; }
        .woa2-on .woa2-head { opacity:1; transform:none; }
        .woa2-on .woa2-card:nth-child(1) { opacity:1; transform:none; transition-delay:.1s; }
        .woa2-on .woa2-card:nth-child(2) { opacity:1; transform:none; transition-delay:.22s; }
        .woa2-on .woa2-card:nth-child(3) { opacity:1; transform:none; transition-delay:.34s; }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "woa2-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "woa2-head",
				style: { marginBottom: "48px" },
				children: [/* @__PURE__ */ jsx("p", {
					style: {
						margin: "0 0 10px 0",
						color: "var(--fw-website-primary)",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						letterSpacing: "2px",
						textTransform: "uppercase"
					},
					children: "WAAROM FERROWORKS"
				}), /* @__PURE__ */ jsxs("h2", {
					style: {
						margin: 0,
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(22px, 2.6vw, 34px)",
						textTransform: "uppercase",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#1c1c1c" },
						children: "WAT ONS "
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "ANDERS MAAKT"
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "fw-three-col-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "32px"
				},
				children: differentiators.map((d, i) => /* @__PURE__ */ jsxs("div", {
					className: "woa2-card",
					style: {
						background: "#fff",
						padding: "36px 28px",
						borderBottom: "4px solid var(--fw-website-primary)"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							style: {
								width: "40px",
								height: "40px",
								background: "var(--fw-website-primary)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: "20px"
							},
							children: /* @__PURE__ */ jsx(CheckIcon$2, {})
						}),
						/* @__PURE__ */ jsx("h3", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "14px",
								textTransform: "uppercase",
								letterSpacing: "0.2px",
								color: "#1c1c1c",
								margin: "0 0 12px 0",
								lineHeight: 1.25
							},
							children: d.title
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								fontSize: "14px",
								color: "#666",
								lineHeight: 1.7,
								margin: 0
							},
							children: d.desc
						})
					]
				}, i))
			})]
		})]
	});
}
function TeamSection() {
	const [ref, vis] = useInView$6();
	const { cms } = useCms();
	const team = cms.overOns && cms.overOns.team || {};
	const teamItems = team.items ? typeof team.items === "string" ? team.items.split("\n").filter(Boolean) : team.items : [
		"Ruim 15 jaar ervaring in metaalmaatwerk",
		"Maakbaar, praktisch en doordacht",
		"Reparatie en onderhoud op locatie"
	];
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .tm2-right { opacity:0; transform:translateX(36px); transition: opacity .65s ease, transform .65s ease; }
        .tm2-img1  { opacity:0; transform:translateX(-28px); transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .tm2-img2  { opacity:0; transform:translateY(-20px); transition: opacity .65s .3s ease, transform .65s .3s ease; }
        .tm2-img3  { opacity:0; transform:translateY(28px);  transition: opacity .65s .45s ease, transform .65s .45s ease; }
        .tm2-sq    { opacity:0; transform:scale(0.4);        transition: opacity .5s .6s ease, transform .5s .6s ease; }
        .tm2-on .tm2-right, .tm2-on .tm2-img1, .tm2-on .tm2-img2, .tm2-on .tm2-img3, .tm2-on .tm2-sq { opacity:1; transform:none; }
        @media (max-width: 768px) { .tm2-grid { grid-template-columns: 1fr !important; } .tm2-photos { height: 340px !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 tm2-grid " + (vis ? "tm2-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "80px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "tm2-photos",
				style: {
					position: "relative",
					height: "480px"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "tm2-sq",
						style: {
							position: "absolute",
							bottom: 0,
							left: "6%",
							width: "84px",
							height: "84px",
							background: "var(--fw-website-primary)",
							zIndex: 1
						}
					}),
					/* @__PURE__ */ jsx("div", {
						className: "tm2-img1",
						style: {
							position: "absolute",
							top: "60px",
							left: 0,
							width: "44%",
							height: "66%",
							overflow: "hidden",
							zIndex: 2,
							boxShadow: "0 4px 18px rgba(0,0,0,0.13)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: team.image1 || "/assets/about-us2-Dd2z2xke.jpeg",
							alt: "FerroWorks medewerker",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "top",
								display: "block"
							}
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "tm2-img2",
						style: {
							position: "absolute",
							top: 0,
							left: "36%",
							width: "30%",
							height: "30%",
							overflow: "hidden",
							zIndex: 3,
							boxShadow: "0 4px 18px rgba(0,0,0,0.13)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: team.image2 || "/assets/about-us1-Fdlmxb8O.jpeg",
							alt: "FerroWorks werkplaats",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "center",
								display: "block"
							}
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "tm2-img3",
						style: {
							position: "absolute",
							bottom: 0,
							right: 0,
							width: "54%",
							height: "60%",
							overflow: "hidden",
							zIndex: 4,
							boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: team.image3 || "/assets/about-us3-De6QPg3_.jpeg",
							alt: "FerroWorks team",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "top",
								display: "block"
							}
						})
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "tm2-right",
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "var(--fw-website-primary)",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "ONS TEAM"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.6vw, 34px)",
							textTransform: "uppercase",
							lineHeight: 1.1,
							letterSpacing: "-0.3px",
							margin: "0 0 24px 0"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#1c1c1c" },
							children: team.title1 || "VAKMANNEN MET "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "var(--fw-website-primary)" },
							children: team.title2 || "EÃ‰N DOEL"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: "0 0 18px 0"
						},
						children: team.tekst1 || "Ons team bestaat uit gespecialiseerde metaalbewerkers, lassers, engineers en projectleiders. Elk met diepgaande kennis van staal, RVS en aluminium."
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: "0 0 32px 0"
						},
						children: team.tekst2 || "Wij werken nauw samen met onze klanten: van de eerste tekening tot de laatste bout op locatie. Altijd Ã©Ã©n aanspreekpunt, altijd persoonlijk."
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "14px"
						},
						children: teamItems.map((item, i) => /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "flex-start",
								gap: "10px"
							},
							children: [/* @__PURE__ */ jsx(CheckIcon$2, {}), /* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "15px",
									lineHeight: 1.6
								},
								children: item
							})]
						}, i))
					})
				]
			})]
		})]
	});
}
var sectoren = [
	{
		naam: "Bouw & Utiliteit",
		diensten: [
			"Staalconstructies",
			"Standaard hekwerken",
			"Prefab balkons"
		]
	},
	{
		naam: "Industrie",
		diensten: [
			"Machinebouw",
			"Maatwerk staalconstructies",
			"IndustriÃ«le installaties",
			"Laswerkzaamheden op locatie"
		]
	},
	{
		naam: "Architectuur & Design",
		diensten: ["Design trappen", "Interieur- en exterieur maatwerk"]
	},
	{
		naam: "Maritiem",
		diensten: ["Jachtbouw"]
	}
];
function SectorenOverzicht() {
	const [ref, vis] = useInView$6();
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .so-head { opacity:0; transform:translateY(-20px); transition: opacity .5s ease, transform .5s ease; }
        .so-card { opacity:0; transform:translateY(24px); transition: opacity .5s ease, transform .5s ease; }
        .so-on .so-head { opacity:1; transform:none; }
        .so-on .so-card:nth-child(1) { opacity:1; transform:none; transition-delay:.08s; }
        .so-on .so-card:nth-child(2) { opacity:1; transform:none; transition-delay:.18s; }
        .so-on .so-card:nth-child(3) { opacity:1; transform:none; transition-delay:.28s; }
        .so-on .so-card:nth-child(4) { opacity:1; transform:none; transition-delay:.38s; }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "so-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "so-head",
				style: { marginBottom: "48px" },
				children: [/* @__PURE__ */ jsx("p", {
					style: {
						margin: "0 0 10px 0",
						color: "var(--fw-website-primary)",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						letterSpacing: "2px",
						textTransform: "uppercase"
					},
					children: "WAT WE BOUWEN"
				}), /* @__PURE__ */ jsxs("h2", {
					style: {
						margin: 0,
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(22px, 2.6vw, 34px)",
						textTransform: "uppercase",
						lineHeight: 1.1,
						letterSpacing: "-0.3px",
						color: "#fff"
					},
					children: ["ONZE ", /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "SECTOREN"
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "fw-four-col-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: "24px"
				},
				children: sectoren.map((s, i) => /* @__PURE__ */ jsxs("div", {
					className: "so-card",
					style: {
						background: "#2a2a2a",
						padding: "32px 24px",
						borderTop: "4px solid var(--fw-website-primary)"
					},
					children: [/* @__PURE__ */ jsx("h3", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "16px",
							textTransform: "uppercase",
							color: "#fff",
							margin: "0 0 20px 0",
							letterSpacing: "-0.2px",
							lineHeight: 1.2
						},
						children: s.naam
					}), /* @__PURE__ */ jsx("ul", {
						style: {
							listStyle: "none",
							margin: 0,
							padding: 0,
							display: "flex",
							flexDirection: "column",
							gap: "8px"
						},
						children: s.diensten.map((d, j) => /* @__PURE__ */ jsxs("li", {
							style: {
								display: "flex",
								alignItems: "flex-start",
								gap: "8px"
							},
							children: [/* @__PURE__ */ jsx("div", { style: {
								width: "6px",
								height: "6px",
								background: "var(--fw-website-primary)",
								flexShrink: 0,
								marginTop: "6px"
							} }), /* @__PURE__ */ jsx("span", {
								style: {
									color: "#bbb",
									fontSize: "13px",
									lineHeight: 1.5
								},
								children: d
							})]
						}, j))
					})]
				}, i))
			})]
		})]
	});
}
var certs = [
	{
		code: "VCA",
		label: "Veiligheid, gezondheid & milieu"
	},
	{
		code: "EN-1090",
		label: "Staal- en aluminiumconstructies"
	},
	{
		code: "CE",
		label: "Conformiteit & veiligheidsstandaard"
	}
];
function Certificeringen() {
	const [ref, vis] = useInView$6();
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .ce2-head { opacity:0; transform:translateY(-18px); transition: opacity .5s ease, transform .5s ease; }
        .ce2-card { opacity:0; transform:translateY(24px); transition: opacity .5s ease, transform .5s ease; }
        .ce2-on .ce2-head { opacity:1; transform:none; }
        .ce2-on .ce2-card:nth-child(1) { opacity:1; transform:none; transition-delay:.08s; }
        .ce2-on .ce2-card:nth-child(2) { opacity:1; transform:none; transition-delay:.2s; }
        .ce2-on .ce2-card:nth-child(3) { opacity:1; transform:none; transition-delay:.32s; }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "ce2-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "ce2-head",
				style: { marginBottom: "48px" },
				children: [/* @__PURE__ */ jsx("p", {
					style: {
						margin: "0 0 10px 0",
						color: "var(--fw-website-primary)",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						letterSpacing: "2px",
						textTransform: "uppercase"
					},
					children: "ONZE CERTIFICERINGEN"
				}), /* @__PURE__ */ jsxs("h2", {
					style: {
						margin: 0,
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(22px, 2.6vw, 34px)",
						textTransform: "uppercase",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#1c1c1c" },
						children: "GECERTIFICEERD "
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "VCA, EN-1090 & CE"
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "fw-three-col-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "24px"
				},
				children: certs.map((c, i) => /* @__PURE__ */ jsxs("div", {
					className: "ce2-card",
					style: {
						border: "1.5px solid #e0e0e0",
						padding: "36px 28px",
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						gap: "10px",
						position: "relative",
						overflow: "hidden"
					},
					children: [
						/* @__PURE__ */ jsx("div", { style: {
							position: "absolute",
							top: 0,
							left: 0,
							width: "4px",
							height: "100%",
							background: "var(--fw-website-primary)"
						} }),
						/* @__PURE__ */ jsx("span", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "26px",
								color: "#1c1c1c",
								letterSpacing: "-0.3px"
							},
							children: c.code
						}),
						/* @__PURE__ */ jsx("span", {
							style: {
								fontSize: "13px",
								color: "#777",
								lineHeight: 1.4
							},
							children: c.label
						}),
						/* @__PURE__ */ jsx("div", { style: {
							width: "32px",
							height: "3px",
							background: "var(--fw-website-primary)",
							marginTop: "4px"
						} })
					]
				}, i))
			})]
		})]
	});
}
function CtaSection$2() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "80px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "56px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "28px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(20px, 2.4vw, 30px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 10px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["KLAAR OM ", /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "TE STARTEN?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#999",
						fontSize: "15px",
						margin: 0,
						lineHeight: 1.5
					},
					children: "Stuur uw tekening op of neem contact op â€” wij reageren binnen 24 uur."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "fw-cta-actions",
					style: {
						display: "flex",
						gap: "16px",
						flexWrap: "wrap"
					},
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "var(--fw-website-primary)",
							padding: "16px 32px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
						onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
						children: "NEEM CONTACT OP"
					}), /* @__PURE__ */ jsx("a", {
						href: "tel:+31165205617",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#fff",
							background: "transparent",
							border: "2px solid #555",
							padding: "14px 28px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.borderColor = "var(--fw-website-primary)",
						onMouseLeave: (e) => e.currentTarget.style.borderColor = "#555",
						children: "BEL ONS"
					})]
				})]
			})
		})
	});
}
function OverOnsPage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHero$4, {}),
		/* @__PURE__ */ jsx(OnsVerhaal, {}),
		/* @__PURE__ */ jsx(StatsRow, {}),
		/* @__PURE__ */ jsx(WatWeDoen, {}),
		/* @__PURE__ */ jsx(WatOnsAnders, {}),
		/* @__PURE__ */ jsx(TeamSection, {}),
		/* @__PURE__ */ jsx(SectorenOverzicht, {}),
		/* @__PURE__ */ jsx(Certificeringen, {}),
		/* @__PURE__ */ jsx(CtaSection$2, {})
	] });
}
//#endregion
//#region src/pages/ContactPage.jsx
function useInView$5(threshold = .12) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
function PageHero$3() {
	const { cms } = useCms();
	const hero = (cms.contact || {}).hero || {};
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "340px",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${hero_background_default})`,
				backgroundSize: "cover",
				backgroundPosition: "center right"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "64px",
					paddingBottom: "64px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "24px"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "var(--fw-website-primary)",
									fontSize: "13px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#666",
									fontSize: "13px"
								},
								children: "â€º"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Contact"
							})
						]
					}),
					/* @__PURE__ */ jsxs("h1", {
						style: {
							margin: "0 0 16px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px, 4vw, 56px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase"
						},
						children: [/* @__PURE__ */ jsxs("span", {
							style: { color: "var(--fw-website-primary)" },
							children: [hero.title1 || "NEEM", " "]
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#fff" },
							children: hero.title2 || "CONTACT OP"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: 0,
							color: "#bbb",
							fontSize: "clamp(14px, 1.6vw, 17px)",
							lineHeight: 1.6,
							maxWidth: "520px"
						},
						children: hero.subtitle || "Stuur uw tekening op of stel uw vraag. Wij reageren binnen 24 uur."
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "var(--fw-website-primary)",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function ContactMain() {
	const [ref, vis] = useInView$5(.08);
	const { cms } = useCms();
	const c = cms.contact || {};
	const site = cms.site || {};
	const [formData, setFormData] = useState({
		naam: "",
		bedrijf: "",
		email: "",
		telefoon: "",
		bericht: ""
	});
	const [attachment, setAttachment] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState("");
	const tel = site.tel || c.tel || "+31 (0)165 205 601";
	const email = site.email || c.email || "info@ferroworks.nl";
	const adres = site.adres || c.adres || "Westelijke Havendijk 31\n4703 RL Roosendaal";
	const openingstijden = c.openingstijden ? c.openingstijden.split("\n").map((line) => {
		const parts = line.split(":");
		const time = parts.slice(1).join(":").trim();
		return [parts[0].trim(), time];
	}).filter((p) => p[0]) : [
		["Maandag – Vrijdag", "07:30 – 17:00"],
		["Zaterdag", "Op afspraak"],
		["Zondag", "Gesloten"]
	];
	function handleChange(e) {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	}
	async function handleSubmit(e) {
		e.preventDefault();
		setSending(true);
		setError("");
		try {
			const payload = new FormData();
			payload.append("naam", formData.naam);
			payload.append("bedrijf", formData.bedrijf);
			payload.append("email", formData.email);
			payload.append("telefoon", formData.telefoon);
			payload.append("bericht", formData.bericht);
			if (attachment) payload.append("attachment", attachment);
			await api.submitContact(payload);
			setSending(false);
			setSubmitted(true);
		} catch (err) {
			setSending(false);
			setError(err.message || "Versturen mislukt.");
		}
	}
	const inputStyle = {
		width: "100%",
		background: "#f4f4f4",
		border: "1.5px solid #e0e0e0",
		padding: "14px 16px",
		fontSize: "14px",
		color: "#1c1c1c",
		outline: "none",
		fontFamily: "Arial, sans-serif",
		boxSizing: "border-box",
		transition: "border-color .2s"
	};
	const labelStyle = {
		fontFamily: "Arial Black, Arial, sans-serif",
		fontWeight: 900,
		fontSize: "11px",
		letterSpacing: "1.2px",
		textTransform: "uppercase",
		color: "#444",
		display: "block",
		marginBottom: "6px"
	};
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#fff",
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .cm-form  { opacity:0; transform:translateX(-32px); transition: opacity .65s ease, transform .65s ease; }
        .cm-info  { opacity:0; transform:translateX(32px);  transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .cm-on .cm-form, .cm-on .cm-info { opacity:1; transform:none; }
        .fw-input:focus { border-color: var(--fw-website-primary) !important; }
        @media (max-width: 768px) { .cm-grid { grid-template-columns: 1fr !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 cm-grid " + (vis ? "cm-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1.1fr 0.9fr",
				gap: "72px",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "cm-form",
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "var(--fw-website-primary)",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "STUUR EEN BERICHT"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							margin: "0 0 36px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.4vw, 30px)",
							lineHeight: 1.1,
							textTransform: "uppercase",
							letterSpacing: "-0.3px"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#1c1c1c" },
							children: "WIJ REAGEREN "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "var(--fw-website-primary)" },
							children: "BINNEN 24 UUR"
						})]
					}),
					submitted ? /* @__PURE__ */ jsxs("div", {
						style: {
							background: "#f4f4f4",
							borderLeft: "4px solid var(--fw-website-primary)",
							padding: "32px 28px"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "18px",
								color: "#1c1c1c",
								textTransform: "uppercase",
								marginBottom: "10px"
							},
							children: "Bericht ontvangen!"
						}), /* @__PURE__ */ jsx("p", {
							style: {
								color: "#555",
								fontSize: "15px",
								lineHeight: 1.7,
								margin: 0
							},
							children: "Bedankt voor uw bericht. Wij nemen zo snel mogelijk contact met u op."
						})]
					}) : /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "20px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "form-row",
								style: {
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "16px"
								},
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: labelStyle,
									children: "Naam *"
								}), /* @__PURE__ */ jsx("input", {
									className: "fw-input",
									style: inputStyle,
									type: "text",
									name: "naam",
									value: formData.naam,
									onChange: handleChange,
									placeholder: "Uw naam",
									required: true
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: labelStyle,
									children: "Bedrijf"
								}), /* @__PURE__ */ jsx("input", {
									className: "fw-input",
									style: inputStyle,
									type: "text",
									name: "bedrijf",
									value: formData.bedrijf,
									onChange: handleChange,
									placeholder: "Uw bedrijfsnaam"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "form-row",
								style: {
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "16px"
								},
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: labelStyle,
									children: "E-mailadres *"
								}), /* @__PURE__ */ jsx("input", {
									className: "fw-input",
									style: inputStyle,
									type: "email",
									name: "email",
									value: formData.email,
									onChange: handleChange,
									placeholder: "uw@email.nl",
									required: true
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: labelStyle,
									children: "Telefoon"
								}), /* @__PURE__ */ jsx("input", {
									className: "fw-input",
									style: inputStyle,
									type: "tel",
									name: "telefoon",
									value: formData.telefoon,
									onChange: handleChange,
									placeholder: "+31 ..."
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: labelStyle,
								children: "Bericht *"
							}), /* @__PURE__ */ jsx("textarea", {
								className: "fw-input",
								style: {
									...inputStyle,
									resize: "vertical",
									minHeight: "140px"
								},
								name: "bericht",
								value: formData.bericht,
								onChange: handleChange,
								placeholder: "Beschrijf uw project of vraag...",
								required: true
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: labelStyle,
								children: "Tekening / bijlage"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									border: "1.5px dashed #ccc",
									background: "#f9f9f9",
									padding: "20px 16px",
									textAlign: "center",
									cursor: "pointer",
									position: "relative"
								},
								children: [
									/* @__PURE__ */ jsx("input", {
										type: "file",
										accept: ".pdf,.dwg,.dxf,.jpg,.jpeg,.png",
										onChange: (e) => setAttachment(e.target.files?.[0] || null),
										style: {
											position: "absolute",
											inset: 0,
											opacity: 0,
											cursor: "pointer",
											width: "100%",
											height: "100%"
										}
									}),
									/* @__PURE__ */ jsxs("svg", {
										width: "28",
										height: "28",
										viewBox: "0 0 24 24",
										fill: "none",
										style: { margin: "0 auto 8px" },
										children: [
											/* @__PURE__ */ jsx("path", {
												d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
												stroke: "var(--fw-website-primary)",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round"
											}),
											/* @__PURE__ */ jsx("polyline", {
												points: "17 8 12 3 7 8",
												stroke: "var(--fw-website-primary)",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round"
											}),
											/* @__PURE__ */ jsx("line", {
												x1: "12",
												y1: "3",
												x2: "12",
												y2: "15",
												stroke: "var(--fw-website-primary)",
												strokeWidth: "2",
												strokeLinecap: "round"
											})
										]
									}),
									/* @__PURE__ */ jsxs("p", {
										style: {
											fontSize: "13px",
											color: "#888",
											margin: 0
										},
										children: ["Sleep een bestand of ", /* @__PURE__ */ jsx("span", {
											style: {
												color: "var(--fw-website-primary)",
												fontWeight: 700
											},
											children: "klik om te uploaden"
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "11px",
											color: "#bbb",
											margin: "4px 0 0"
										},
										children: attachment ? attachment.name : "PDF, DWG, DXF, JPG, PNG"
									})
								]
							})] }),
							error && /* @__PURE__ */ jsx("div", {
								style: {
									color: "#dc2626",
									fontSize: "13px"
								},
								children: error
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: sending,
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "13px",
									textTransform: "uppercase",
									letterSpacing: "0.8px",
									color: "#1c1c1c",
									background: sending ? "var(--fw-website-primary-strong)" : "var(--fw-website-primary)",
									border: "none",
									padding: "18px 40px",
									cursor: sending ? "default" : "pointer",
									transition: "background .2s",
									alignSelf: "flex-start"
								},
								onMouseEnter: (e) => {
									if (!sending) e.currentTarget.style.background = "var(--fw-website-primary-strong)";
								},
								onMouseLeave: (e) => {
									if (!sending) e.currentTarget.style.background = "var(--fw-website-primary)";
								},
								children: sending ? "VERZENDEN..." : "VERSTUUR BERICHT"
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "cm-info",
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "0"
				},
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "var(--fw-website-primary)",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "CONTACTGEGEVENS"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							margin: "0 0 36px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.4vw, 30px)",
							lineHeight: 1.1,
							textTransform: "uppercase",
							letterSpacing: "-0.3px"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "#1c1c1c" },
							children: "DIRECT "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "var(--fw-website-primary)" },
							children: "BEREIKBAAR"
						})]
					}),
					[
						{
							icon: /* @__PURE__ */ jsx("svg", {
								width: "22",
								height: "22",
								viewBox: "0 0 24 24",
								fill: "none",
								children: /* @__PURE__ */ jsx("path", {
									d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
									stroke: "var(--fw-website-primary)",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							}),
							label: "Telefoon",
							value: tel,
							href: `tel:${tel.replace(/[\s()]/g, "")}`
						},
						{
							icon: /* @__PURE__ */ jsxs("svg", {
								width: "22",
								height: "22",
								viewBox: "0 0 24 24",
								fill: "none",
								children: [/* @__PURE__ */ jsx("path", {
									d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
									stroke: "var(--fw-website-primary)",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								}), /* @__PURE__ */ jsx("polyline", {
									points: "22,6 12,13 2,6",
									stroke: "var(--fw-website-primary)",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})]
							}),
							label: "E-mail",
							value: email,
							href: `mailto:${email}`
						},
						{
							icon: /* @__PURE__ */ jsxs("svg", {
								width: "22",
								height: "22",
								viewBox: "0 0 24 24",
								fill: "none",
								children: [/* @__PURE__ */ jsx("path", {
									d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
									stroke: "var(--fw-website-primary)",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								}), /* @__PURE__ */ jsx("circle", {
									cx: "12",
									cy: "10",
									r: "3",
									stroke: "var(--fw-website-primary)",
									strokeWidth: "2"
								})]
							}),
							label: "Adres",
							value: adres,
							href: `https://maps.google.com/?q=${encodeURIComponent(adres.replace(/\n/g, " "))}`
						}
					].map((item, i) => /* @__PURE__ */ jsxs("a", {
						href: item.href,
						target: item.label === "Adres" ? "_blank" : void 0,
						rel: item.label === "Adres" ? "noopener noreferrer" : void 0,
						style: {
							display: "flex",
							alignItems: "flex-start",
							gap: "16px",
							padding: "24px 0",
							borderBottom: "1px solid #eee",
							textDecoration: "none"
						},
						onMouseEnter: (e) => e.currentTarget.style.opacity = "0.75",
						onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								width: "44px",
								height: "44px",
								background: "#f4f4f4",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0
							},
							children: item.icon
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "11px",
								letterSpacing: "1.5px",
								textTransform: "uppercase",
								color: "#999",
								marginBottom: "4px"
							},
							children: item.label
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "15px",
								color: "#1c1c1c",
								whiteSpace: "pre-line",
								lineHeight: 1.5
							},
							children: item.value
						})] })]
					}, i)),
					/* @__PURE__ */ jsxs("div", {
						style: {
							marginTop: "32px",
							background: "#f4f4f4",
							padding: "24px 24px"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "11px",
								letterSpacing: "2px",
								textTransform: "uppercase",
								color: "var(--fw-website-primary)",
								marginBottom: "16px"
							},
							children: "OPENINGSTIJDEN"
						}), openingstijden.map(([dag, tijd], i) => /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								padding: "8px 0",
								borderBottom: i < openingstijden.length - 1 ? "1px solid #e4e4e4" : "none"
							},
							children: [/* @__PURE__ */ jsx("span", {
								style: {
									fontSize: "13px",
									color: "#555"
								},
								children: dag
							}), /* @__PURE__ */ jsx("span", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "13px",
									color: "#1c1c1c"
								},
								children: tijd
							})]
						}, i))]
					})
				]
			})]
		})]
	});
}
function MapSection() {
	const { cms } = useCms();
	const c = cms.contact || {};
	const adres = (cms.site || {}).adres || c.adres || "Westelijke Havendijk 31\n4703 RL Roosendaal";
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "0"
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				width: "100%",
				height: "420px",
				position: "relative",
				overflow: "hidden"
			},
			children: [/* @__PURE__ */ jsx("iframe", {
				title: "FerroWorks locatie",
				src: c.mapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.8!2d4.4630!3d51.5300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c417d4d3e40000%3A0x0!2sWestelijke+Havendijk+31%2C+4703+RL+Roosendaal!5e0!3m2!1snl!2snl!4v1",
				width: "100%",
				height: "420",
				style: {
					border: 0,
					display: "block",
					filter: "grayscale(0.3)"
				},
				allowFullScreen: "",
				loading: "lazy",
				referrerPolicy: "no-referrer-when-downgrade"
			}), /* @__PURE__ */ jsxs("div", {
				className: "map-badge",
				style: {
					position: "absolute",
					top: "24px",
					left: "24px",
					background: "#1c1c1c",
					padding: "14px 20px",
					display: "flex",
					alignItems: "center",
					gap: "10px"
				},
				children: [/* @__PURE__ */ jsx("div", { style: {
					width: "8px",
					height: "8px",
					background: "var(--fw-website-primary)",
					flexShrink: 0
				} }), /* @__PURE__ */ jsx("span", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						color: "#fff",
						letterSpacing: "0.5px"
					},
					children: adres.replace("\n", " · ")
				})]
			})]
		})
	});
}
function ContactStrip() {
	const [ref, vis] = useInView$5(.2);
	const { cms } = useCms();
	const c = cms.contact || {};
	const site = cms.site || {};
	const tel = site.tel || c.tel || "+31 (0)165 205 601";
	const email = site.email || c.email || "info@ferroworks.nl";
	const adres = site.adres || c.adres || "Westelijke Havendijk 31\nRoosendaal";
	const items = [
		{
			icon: /* @__PURE__ */ jsx("svg", {
				width: "28",
				height: "28",
				viewBox: "0 0 24 24",
				fill: "none",
				children: /* @__PURE__ */ jsx("path", {
					d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
					stroke: "var(--fw-website-primary)",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			}),
			title: "BELLEN",
			value: tel,
			href: `tel:${tel.replace(/[\s()]/g, "")}`
		},
		{
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "28",
				height: "28",
				viewBox: "0 0 24 24",
				fill: "none",
				children: [/* @__PURE__ */ jsx("path", {
					d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
					stroke: "var(--fw-website-primary)",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}), /* @__PURE__ */ jsx("polyline", {
					points: "22,6 12,13 2,6",
					stroke: "var(--fw-website-primary)",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})]
			}),
			title: "MAILEN",
			value: email,
			href: `mailto:${email}`
		},
		{
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "28",
				height: "28",
				viewBox: "0 0 24 24",
				fill: "none",
				children: [/* @__PURE__ */ jsx("path", {
					d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
					stroke: "var(--fw-website-primary)",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}), /* @__PURE__ */ jsx("circle", {
					cx: "12",
					cy: "10",
					r: "3",
					stroke: "var(--fw-website-primary)",
					strokeWidth: "2"
				})]
			}),
			title: "BEZOEKEN",
			value: adres,
			href: `https://maps.google.com/?q=${encodeURIComponent(adres.replace(/\n/g, " "))}`
		}
	];
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "52px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .cs-item { opacity:0; transform:translateY(16px); transition: opacity .5s ease, transform .5s ease; }
        .cs-on .cs-item:nth-child(1) { opacity:1; transform:none; transition-delay:.0s; }
        .cs-on .cs-item:nth-child(2) { opacity:1; transform:none; transition-delay:.12s; }
        .cs-on .cs-item:nth-child(3) { opacity:1; transform:none; transition-delay:.24s; }
      ` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 contact-strip-grid " + (vis ? "cs-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(3, 1fr)",
				gap: "0",
				alignItems: "stretch"
			},
			children: items.map((item, i) => /* @__PURE__ */ jsxs("a", {
				href: item.href,
				target: item.title === "BEZOEKEN" ? "_blank" : void 0,
				rel: item.title === "BEZOEKEN" ? "noopener noreferrer" : void 0,
				className: "cs-item",
				style: {
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "12px",
					padding: "36px 24px",
					textDecoration: "none",
					borderRight: i < 2 ? "1px solid #333" : "none",
					transition: "background .2s"
				},
				onMouseEnter: (e) => e.currentTarget.style.background = "#252525",
				onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
				children: [
					item.icon,
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							letterSpacing: "1.5px",
							textTransform: "uppercase",
							color: "#888"
						},
						children: item.title
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "15px",
							color: "#fff",
							textAlign: "center",
							whiteSpace: "pre-line",
							lineHeight: 1.5
						},
						children: item.value
					})
				]
			}, i))
		})]
	});
}
function ContactPage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHero$3, {}),
		/* @__PURE__ */ jsx(ContactMain, {}),
		/* @__PURE__ */ jsx(MapSection, {}),
		/* @__PURE__ */ jsx(ContactStrip, {})
	] });
}
//#endregion
//#region src/pages/BlogPage.jsx
var BLOG_FALLBACK_IMAGES$1 = [
	kwaliteitscontrole_lassen_featured_300x225_default,
	Offshore_constructie_300x190_default,
	Afwerking_staalconstructie_met_natlak_300x225_default,
	lascertificaat_verplicht_featured_300x158_default,
	over_ons1_default,
	over_ons2_default
];
function useInView$4(threshold = .1) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
var FALLBACK_POSTS$1 = [
	{
		id: 1,
		category: "Vakmanschap",
		date: "8 april 2026",
		readTime: "4 min",
		title: "Waarom kwaliteitscontrole bij lassen het verschil maakt",
		excerpt: "In de metaalbewerking is lassen een van de meest kritische processen. Een kleine fout in de las kan grote gevolgen hebben voor de veiligheid en levensduur van een constructie. Ontdek hoe FerroWorks kwaliteitscontrole inzet als standaard â€” niet als uitzondering.",
		img: kwaliteitscontrole_lassen_featured_300x225_default,
		featured: true
	},
	{
		id: 2,
		category: "Offshore",
		date: "1 april 2026",
		readTime: "5 min",
		title: "Staalconstructies voor offshore: eisen en uitdagingen",
		excerpt: "Offshore staalwerk staat bloot aan extreme omstandigheden: zout water, hoge druk en constante mechanische belasting. Wij leggen uit welke materialen en coatings wij inzetten voor duurzame offshore constructies.",
		img: Offshore_constructie_300x190_default,
		featured: false
	},
	{
		id: 3,
		category: "Afwerking",
		date: "24 maart 2026",
		readTime: "3 min",
		title: "Natlak vs. poedercoating: wat past bij uw project?",
		excerpt: "De keuze tussen natlak en poedercoating heeft invloed op zowel de uitstraling als de beschermingsgraad van een staalconstructie. We zetten de voor- en nadelen van beide methoden op een rij.",
		img: Afwerking_staalconstructie_met_natlak_300x225_default,
		featured: false
	},
	{
		id: 4,
		category: "Certificering",
		date: "17 maart 2026",
		readTime: "6 min",
		title: "Lascertificaat verplicht? Alles wat u moet weten over EN-1090",
		excerpt: "Sinds de invoering van de EN-1090 norm is een lascertificaat voor veel staalconstructies verplicht. Maar wat houdt dat precies in, en wanneer is het van toepassing? FerroWorks legt het u helder uit.",
		img: lascertificaat_verplicht_featured_300x158_default,
		featured: false
	},
	{
		id: 5,
		category: "Productie",
		date: "10 maart 2026",
		readTime: "4 min",
		title: "Van tekening tot product: zo werkt ons productieproces",
		excerpt: "Hoe gaat een metaalproject van CAD-tekening naar afgewerkt product? We nemen u stap voor stap mee door het productieproces van FerroWorks: van intake en engineering tot productie, afwerking en montage.",
		img: over_ons1_default,
		featured: false
	},
	{
		id: 6,
		category: "Industrie",
		date: "3 maart 2026",
		readTime: "5 min",
		title: "Maatwerk staal voor de industrie: 5 veelgemaakte fouten vermeden",
		excerpt: "Bij industrieel staalmaatwerk gaat het soms mis â€” niet door slechte intenties, maar door gebrek aan kennis of slechte communicatie. We bespreken vijf veelgemaakte fouten en hoe u ze kunt voorkomen.",
		img: over_ons2_default,
		featured: false
	}
];
var categories = [
	"Alle",
	"Vakmanschap",
	"Offshore",
	"Afwerking",
	"Certificering",
	"Productie",
	"Industrie"
];
function PageHero$2() {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "340px",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${hero_background_default})`,
				backgroundSize: "cover",
				backgroundPosition: "center right"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "64px",
					paddingBottom: "64px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "24px"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "var(--fw-website-primary)",
									fontSize: "13px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#666",
									fontSize: "13px"
								},
								children: "â€º"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Blog"
							})
						]
					}),
					/* @__PURE__ */ jsxs("h1", {
						style: {
							margin: "0 0 16px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px, 4vw, 56px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "var(--fw-website-primary)" },
							children: "KENNIS & "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#fff" },
							children: "INZICHTEN"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: 0,
							color: "#bbb",
							fontSize: "clamp(14px, 1.6vw, 17px)",
							lineHeight: 1.6,
							maxWidth: "520px"
						},
						children: "Vakartikelen, projectverhalen en technische inzichten vanuit de dagelijkse praktijk van FerroWorks."
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "var(--fw-website-primary)",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function FeaturedPost({ post, imgSrc }) {
	const [ref, vis] = useInView$4();
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .fp-left  { opacity:0; transform:translateX(-32px); transition: opacity .65s ease, transform .65s ease; }
        .fp-right { opacity:0; transform:translateX(32px);  transition: opacity .65s .15s ease, transform .65s .15s ease; }
        .fp-on .fp-left, .fp-on .fp-right { opacity:1; transform:none; }
        @media (max-width: 768px) { .fp-grid { grid-template-columns: 1fr !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 fp-grid " + (vis ? "fp-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1.2fr 1fr",
				gap: "64px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "fp-left",
				style: {
					position: "relative",
					overflow: "hidden"
				},
				children: [
					/* @__PURE__ */ jsx("div", { style: {
						position: "absolute",
						top: "-12px",
						left: "-12px",
						width: "64px",
						height: "64px",
						background: "var(--fw-website-primary)",
						zIndex: 0
					} }),
					/* @__PURE__ */ jsx("img", {
						className: "fp-image",
						src: imgSrc,
						alt: post.title,
						style: {
							position: "relative",
							zIndex: 1,
							width: "100%",
							height: "400px",
							objectFit: "cover",
							display: "block",
							boxShadow: "0 8px 32px rgba(0,0,0,0.14)"
						}
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							position: "absolute",
							bottom: "20px",
							left: "20px",
							zIndex: 2,
							background: "var(--fw-website-primary)",
							padding: "6px 14px"
						},
						children: /* @__PURE__ */ jsx("span", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "11px",
								textTransform: "uppercase",
								letterSpacing: "1px",
								color: "#1c1c1c"
							},
							children: "Uitgelicht"
						})
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "fp-right",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "fp-meta",
						style: {
							display: "flex",
							alignItems: "center",
							gap: "12px",
							marginBottom: "16px"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								style: {
									background: "#1c1c1c",
									color: "var(--fw-website-primary)",
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "10px",
									letterSpacing: "1.5px",
									textTransform: "uppercase",
									padding: "4px 10px"
								},
								children: post.category
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px"
								},
								children: post.date
							}),
							/* @__PURE__ */ jsxs("span", {
								style: {
									color: "#aaa",
									fontSize: "13px"
								},
								children: [
									"Â· ",
									post.readTime,
									" leestijd"
								]
							})
						]
					}),
					/* @__PURE__ */ jsx("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(20px, 2.4vw, 28px)",
							lineHeight: 1.15,
							letterSpacing: "-0.3px",
							color: "#1c1c1c",
							textTransform: "uppercase",
							margin: "0 0 20px 0"
						},
						children: post.title
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#555",
							fontSize: "15px",
							lineHeight: 1.75,
							margin: "0 0 32px 0"
						},
						children: post.excerpt
					}),
					/* @__PURE__ */ jsx(Link, {
						to: `/blog/${post.slug || post.id}`,
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "var(--fw-website-primary)",
							padding: "16px 32px",
							textDecoration: "none",
							display: "inline-block",
							transition: "background .2s"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
						onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
						children: "LEES ARTIKEL"
					})
				]
			})]
		})]
	});
}
function BlogCard({ post, imgSrc, delay = 0 }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "blog-card",
		style: {
			background: "#fff",
			display: "flex",
			flexDirection: "column",
			boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
			transition: "transform .25s ease, box-shadow .25s ease",
			animationDelay: `${delay}s`
		},
		onMouseEnter: (e) => {
			e.currentTarget.style.transform = "translateY(-4px)";
			e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.11)";
		},
		onMouseLeave: (e) => {
			e.currentTarget.style.transform = "translateY(0)";
			e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				position: "relative",
				overflow: "hidden",
				height: "200px"
			},
			children: [/* @__PURE__ */ jsx("img", {
				src: imgSrc,
				alt: post.title,
				style: {
					width: "100%",
					height: "100%",
					objectFit: "cover",
					display: "block",
					transition: "transform .4s ease"
				},
				onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.04)",
				onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					position: "absolute",
					top: "14px",
					left: "14px",
					background: "var(--fw-website-primary)",
					padding: "4px 10px"
				},
				children: /* @__PURE__ */ jsx("span", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "10px",
						textTransform: "uppercase",
						letterSpacing: "1px",
						color: "#1c1c1c"
					},
					children: post.category
				})
			})]
		}), /* @__PURE__ */ jsxs("div", {
			style: {
				padding: "28px 24px",
				display: "flex",
				flexDirection: "column",
				flex: 1
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "blog-meta",
					style: {
						display: "flex",
						gap: "12px",
						marginBottom: "12px"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: {
							color: "#aaa",
							fontSize: "12px"
						},
						children: post.date
					}), /* @__PURE__ */ jsxs("span", {
						style: {
							color: "#aaa",
							fontSize: "12px"
						},
						children: [
							"Â· ",
							post.readTime,
							" leestijd"
						]
					})]
				}),
				/* @__PURE__ */ jsx("h3", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "16px",
						lineHeight: 1.25,
						letterSpacing: "-0.2px",
						color: "#1c1c1c",
						textTransform: "uppercase",
						margin: "0 0 14px 0"
					},
					children: post.title
				}),
				/* @__PURE__ */ jsxs("p", {
					style: {
						color: "#777",
						fontSize: "13.5px",
						lineHeight: 1.7,
						margin: "0 0 24px 0",
						flex: 1
					},
					children: [post.excerpt.substring(0, 120), "..."]
				}),
				/* @__PURE__ */ jsxs(Link, {
					to: `/blog/${post.slug || post.id}`,
					style: {
						display: "inline-flex",
						alignItems: "center",
						gap: "6px",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						color: "var(--fw-website-primary)",
						textDecoration: "none",
						marginTop: "auto"
					},
					onMouseEnter: (e) => e.currentTarget.style.gap = "10px",
					onMouseLeave: (e) => e.currentTarget.style.gap = "6px",
					children: ["LEES MEER", /* @__PURE__ */ jsx("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						children: /* @__PURE__ */ jsx("path", {
							d: "M5 12h14M12 5l7 7-7 7",
							stroke: "var(--fw-website-primary)",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})]
				})
			]
		})]
	});
}
function BlogGrid({ posts }) {
	const [ref, vis] = useInView$4(.05);
	const [activeCategory, setActiveCategory] = useState("Alle");
	const filtered = activeCategory === "Alle" ? posts.filter((p) => !p.featured) : posts.filter((p) => !p.featured && p.category === activeCategory);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .bg-grid { opacity:0; transform:translateY(24px); transition: opacity .6s ease, transform .6s ease; }
        .bg-on .bg-grid { opacity:1; transform:none; }
        .cat-btn { background: transparent; border: 1.5px solid #ddd; cursor: pointer; transition: all .2s; }
        .cat-btn:hover { border-color: var(--fw-website-primary); color: #1c1c1c !important; }
        .cat-btn.active { background: var(--fw-website-primary) !important; border-color: var(--fw-website-primary) !important; color: #1c1c1c !important; }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "bg-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "flex-end",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "20px",
					marginBottom: "48px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					style: {
						margin: "0 0 10px 0",
						color: "var(--fw-website-primary)",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						letterSpacing: "2px",
						textTransform: "uppercase"
					},
					children: "ALLE ARTIKELEN"
				}), /* @__PURE__ */ jsxs("h2", {
					style: {
						margin: 0,
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(22px, 2.4vw, 30px)",
						textTransform: "uppercase",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#1c1c1c" },
						children: "RECENTE "
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "PUBLICATIES"
					})]
				})] }), /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexWrap: "wrap",
						gap: "8px"
					},
					children: categories.map((cat) => /* @__PURE__ */ jsx("button", {
						onClick: () => setActiveCategory(cat),
						className: "cat-btn" + (activeCategory === cat ? " active" : ""),
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "0.8px",
							textTransform: "uppercase",
							color: activeCategory === cat ? "#1c1c1c" : "#777",
							padding: "8px 16px"
						},
						children: cat
					}, cat))
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "bg-grid fw-three-col-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "28px"
				},
				children: filtered.length > 0 ? filtered.map((post, i) => /* @__PURE__ */ jsx(BlogCard, {
					post,
					imgSrc: post.image || BLOG_FALLBACK_IMAGES$1[i % BLOG_FALLBACK_IMAGES$1.length],
					delay: i * .1
				}, post.id)) : /* @__PURE__ */ jsx("div", {
					style: {
						gridColumn: "1 / -1",
						textAlign: "center",
						padding: "60px 0",
						color: "#aaa",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontSize: "14px",
						textTransform: "uppercase",
						letterSpacing: "1px"
					},
					children: "Geen artikelen gevonden in deze categorie."
				})
			})]
		})]
	});
}
function NewsletterCta() {
	const [ref, vis] = useInView$4(.2);
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
			setError(err.message || "Inschrijven mislukt.");
		}
	}
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .nl-inner { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .nl-on .nl-inner { opacity:1; transform:none; }
      ` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "nl-on" : ""),
			children: /* @__PURE__ */ jsxs("div", {
				className: "nl-inner",
				style: {
					maxWidth: "600px",
					margin: "0 auto",
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 12px 0",
							color: "var(--fw-website-primary)",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "2px",
							textTransform: "uppercase"
						},
						children: "BLIJF OP DE HOOGTE"
					}),
					/* @__PURE__ */ jsxs("h2", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(22px, 2.4vw, 30px)",
							textTransform: "uppercase",
							lineHeight: 1.1,
							letterSpacing: "-0.3px",
							color: "#fff",
							margin: "0 0 16px 0"
						},
						children: ["ONTVANG ONZE ", /* @__PURE__ */ jsx("span", {
							style: { color: "var(--fw-website-primary)" },
							children: "NIEUWSBRIEF"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#888",
							fontSize: "15px",
							lineHeight: 1.6,
							margin: "0 0 32px 0"
						},
						children: "Nieuwe artikelen, projectupdates en technische tips â€” direct in uw inbox."
					}),
					done ? /* @__PURE__ */ jsx("div", {
						style: {
							background: "#252525",
							borderLeft: "4px solid var(--fw-website-primary)",
							padding: "20px 24px",
							textAlign: "left"
						},
						children: /* @__PURE__ */ jsx("span", {
							style: {
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "14px",
								color: "#fff",
								textTransform: "uppercase"
							},
							children: "Inschrijving gelukt! âœ“"
						})
					}) : /* @__PURE__ */ jsxs("form", {
						className: "nl-form",
						onSubmit: handleSubmit,
						style: {
							display: "flex",
							gap: "0",
							maxWidth: "480px",
							margin: "0 auto"
						},
						children: [/* @__PURE__ */ jsx("input", {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "uw@email.nl",
							required: true,
							style: {
								flex: 1,
								background: "#2a2a2a",
								border: "1.5px solid #444",
								borderRight: "none",
								padding: "16px 18px",
								fontSize: "14px",
								color: "#fff",
								fontFamily: "Arial, sans-serif",
								outline: "none"
							},
							onFocus: (e) => e.currentTarget.style.borderColor = "var(--fw-website-primary)",
							onBlur: (e) => e.currentTarget.style.borderColor = "#444"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							style: {
								background: "var(--fw-website-primary)",
								border: "none",
								padding: "16px 28px",
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "12px",
								textTransform: "uppercase",
								letterSpacing: "0.8px",
								color: "#1c1c1c",
								cursor: "pointer",
								transition: "background .2s",
								flexShrink: 0
							},
							onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
							onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
							children: "INSCHRIJVEN"
						})]
					}),
					error && /* @__PURE__ */ jsx("p", {
						style: {
							color: "#fca5a5",
							fontSize: "13px",
							marginTop: "14px"
						},
						children: error
					})
				]
			})
		})]
	});
}
function CtaStrip$2() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "48px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "24px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(18px, 2.2vw, 26px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 8px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["EEN PROJECT IN ", /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "GEDACHTEN?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#888",
						fontSize: "14px",
						margin: 0
					},
					children: "Neem contact op â€” wij denken graag met u mee."
				})] }), /* @__PURE__ */ jsx(Link, {
					to: "/contact",
					className: "fw-primary-action",
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "13px",
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						color: "#1c1c1c",
						background: "var(--fw-website-primary)",
						padding: "16px 32px",
						textDecoration: "none",
						display: "inline-block",
						transition: "background .2s",
						flexShrink: 0
					},
					onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
					onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
					children: "NEEM CONTACT OP"
				})]
			})
		})
	});
}
function BlogPage() {
	const { cms } = useCms();
	const posts = cms.blog && cms.blog.length ? cms.blog : FALLBACK_POSTS$1;
	const featIdx = posts.findIndex((p) => p.featured);
	const featured = featIdx >= 0 ? posts[featIdx] : null;
	const featuredImgSrc = featured ? featured.image || BLOG_FALLBACK_IMAGES$1[0] : null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHero$2, {}),
		featured && /* @__PURE__ */ jsx(FeaturedPost, {
			post: featured,
			imgSrc: featuredImgSrc
		}),
		/* @__PURE__ */ jsx(BlogGrid, { posts }),
		/* @__PURE__ */ jsx(NewsletterCta, {}),
		/* @__PURE__ */ jsx(CtaStrip$2, {})
	] });
}
//#endregion
//#region src/pages/BlogDetailPage.jsx
var BLOG_FALLBACK_IMAGES = [
	kwaliteitscontrole_lassen_featured_300x225_default,
	Offshore_constructie_300x190_default,
	Afwerking_staalconstructie_met_natlak_300x225_default,
	lascertificaat_verplicht_featured_300x158_default,
	over_ons1_default,
	over_ons2_default
];
function useInView$3(threshold = .1) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
var FALLBACK_POSTS = [
	{
		id: 1,
		category: "Vakmanschap",
		date: "8 april 2026",
		readTime: "4 min",
		title: "Waarom kwaliteitscontrole bij lassen het verschil maakt",
		excerpt: "In de metaalbewerking is lassen een van de meest kritische processen. Een kleine fout in de las kan grote gevolgen hebben voor de veiligheid en levensduur van een constructie. Ontdek hoe FerroWorks kwaliteitscontrole inzet als standaard â€” niet als uitzondering.",
		img: kwaliteitscontrole_lassen_featured_300x225_default,
		featured: true,
		body: [
			{
				type: "intro",
				text: "Lassen is het hart van elke staalconstructie. Of het nu gaat om een industriÃ«le installatie, een offshore platform of een architectonische trap â€” de kwaliteit van de las bepaalt in grote mate hoe lang een constructie meegaat en hoe veilig die is. Bij FerroWorks behandelen we kwaliteitscontrole niet als een afsluiting van het productieproces, maar als een rode draad die door het hele traject loopt."
			},
			{
				type: "h2",
				text: "Wat kan er misgaan bij lassen?"
			},
			{ text: "Een onvolledige doorlassing, poreusheid in het lasmateriaal of een verkeerde electrodekeuze â€” het zijn fouten die met het blote oog niet altijd zichtbaar zijn, maar die onder belasting tot breuk kunnen leiden. Met name bij constructies die dynamische krachten opvangen, zoals kabelgoten, hefconstructies of dragende balken, is een tekortkoming in de las een veiligheidsrisico." },
			{
				type: "h2",
				text: "Hoe werkt kwaliteitscontrole bij FerroWorks?"
			},
			{ text: "Ons kwaliteitsproces bestaat uit meerdere lagen. Elke lasser die bij FerroWorks werkt, is gecertificeerd en werkt volgens vastgestelde lasprocedures (WPS). Tijdens productie worden lasnaden visueel beoordeeld en indien vereist getest via niet-destructief onderzoek (NDO) â€” zoals magnetisch poederonderzoek, penetrantonderzoek of ultrageluidsinspectie." },
			{
				type: "bullets",
				items: [
					"Gecertificeerde lassers conform EN-1090 en VCA",
					"Vastgestelde lasprocedures (WPS) per project",
					"Visuele inspectie na elke lasstap",
					"NDO-testen waar van toepassing",
					"Digitale laslogboeken per constructie"
				]
			},
			{
				type: "h2",
				text: "Waarom EN-1090 zo belangrijk is"
			},
			{ text: "De EN-1090 norm stelt minimumeisen aan de uitvoering van staal- en aluminiumconstructies die op de Europese markt worden gebracht. Voor FerroWorks is dit no-nonsense vakwerk: we werken standaard volgens deze norm, ongeacht of een klant er expliciet om vraagt. Dat zorgt voor een consistent, controleerbaar niveau van uitvoering bij elk project." },
			{
				type: "quote",
				text: "Kwaliteit zit niet in de afronding â€” het zit in elke stap van het proces."
			},
			{
				type: "h2",
				text: "Wat betekent dit voor uw project?"
			},
			{ text: "Als u een project uitbesteedt aan FerroWorks, weet u dat elke las gedocumenteerd is, dat onze lassers gecertificeerd zijn en dat er een duidelijk kwaliteitsprotocol achter uw product zit. Geen verrassingen achteraf, geen discussies over aansprakelijkheid. Gewoon degelijk vakwerk dat u kunt vertrouwen." }
		],
		tags: [
			"Kwaliteit",
			"Lassen",
			"EN-1090",
			"Vakmanschap"
		]
	},
	{
		id: 2,
		category: "Offshore",
		date: "1 april 2026",
		readTime: "5 min",
		title: "Staalconstructies voor offshore: eisen en uitdagingen",
		excerpt: "Offshore staalwerk staat bloot aan extreme omstandigheden: zout water, hoge druk en constante mechanische belasting. Wij leggen uit welke materialen en coatings wij inzetten voor duurzame offshore constructies.",
		img: Offshore_constructie_300x190_default,
		featured: false,
		body: [
			{
				type: "intro",
				text: "De offshore-industrie stelt extreem hoge eisen aan staalconstructies. Waar landgebonden constructies doorgaans beschermd zijn tegen de ergste weersinvloeden, worden offshore constructies continu blootgesteld aan zeewatercorrosie, hoge windkrachten, dynamische belastingen en temperatuurwisselingen. FerroWorks heeft jarenlange ervaring met maatwerk staalwerk voor maritieme en offshore toepassingen."
			},
			{
				type: "h2",
				text: "De vijf grootste uitdagingen bij offshore staalwerk"
			},
			{
				type: "bullets",
				items: [
					"Corrosie door zout zeewatermilieu",
					"Dynamische belastingen door golven en trillingen",
					"Extreme temperatuurwisselingen tussen dag en nacht",
					"Zware montageomstandigheden op locatie",
					"Strenge certificeringseisen (DNVGL, Lloyd's, etc.)"
				]
			},
			{
				type: "h2",
				text: "Materiaalkeuze: staal, RVS of duplex?"
			},
			{ text: "Voor offshore toepassingen is de materiaalkeuze cruciaal. Gewoon constructiestaal (S235 of S355) is prima voor constructies die goed beschermd worden met coatings en regelmatig onderhoud krijgen. RVS (AISI 316L) biedt betere corrosiebestendigheid maar is zwaarder en duurder. Duplex roestvast staal combineert de sterkte van constructiestaal met de corrosiebestendigheid van RVS â€” ideaal voor kritische offshore componenten." },
			{
				type: "h2",
				text: "Coating en corrosiebescherming"
			},
			{ text: "Een goede coating is onmisbaar bij offshore staalwerk. Wij werken met meerlaagse sytemen: een zinkrijke grondlaag, een epoxy-midcoat en een polyurethaan-topcoat. Dit systeem voldoet aan de corrosiviteitscategorie C5 (mariene omgeving) zoals beschreven in ISO 12944. De voorbereiding van het staaloppervlak â€” staalstralen tot Sa2,5 â€” is minstens zo belangrijk als de coating zelf." },
			{
				type: "quote",
				text: "Een offshore constructie is zo sterk als zijn zwakste las â€” en zo duurzaam als zijn coating."
			},
			{
				type: "h2",
				text: "FerroWorks en offshore: wat wij bieden"
			},
			{ text: "Van het ontwerp en engineering op basis van uw specificaties, tot de productie, coatingbehandeling en levering kant-en-klaar op uw locatie. Wij werken nauw samen met onze opdrachtgevers en hun inspectie-engineers om te zorgen dat elk onderdeel aan de gestelde eisen voldoet. Documentatie, materiaalcertificaten en inspectierapporten worden standaard meegeleverd." }
		],
		tags: [
			"Offshore",
			"Corrosie",
			"Coating",
			"Maritiem"
		]
	},
	{
		id: 3,
		category: "Afwerking",
		date: "24 maart 2026",
		readTime: "3 min",
		title: "Natlak vs. poedercoating: wat past bij uw project?",
		excerpt: "De keuze tussen natlak en poedercoating heeft invloed op zowel de uitstraling als de beschermingsgraad van een staalconstructie. We zetten de voor- en nadelen van beide methoden op een rij.",
		img: Afwerking_staalconstructie_met_natlak_300x225_default,
		featured: false,
		body: [
			{
				type: "intro",
				text: "Wanneer uw staalconstructie klaar is voor de afwerking, staat u voor een belangrijke keuze: natlak of poedercoating? Beide methoden bieden uitstekende bescherming, maar ze verschillen in toepassing, uitstraling en geschiktheid voor specifieke situaties. In dit artikel zetten we de voornaamste verschillen op een rij, zodat u samen met FerroWorks de juiste keuze kunt maken."
			},
			{
				type: "h2",
				text: "Wat is poedercoating?"
			},
			{ text: "Poedercoating is een droog verfproces waarbij kleurpoeder elektrostatisch op het metaal wordt aangebracht en vervolgens wordt uitgehard in een oven (180â€“200 Â°C). Het resultaat is een egale, harde laag die krasbestendig en milieuvriendelijk is (geen oplosmiddelen). Poedercoating is bij uitstek geschikt voor geveltoepassingen, hekwerken, sporttoestellen en binnendeuren." },
			{
				type: "h2",
				text: "Wat is natlak?"
			},
			{ text: "Natlak (vloeibare verf) wordt aangebracht via spuiten, kwast of roller. Het droogt door verdamping van oplosmiddelen of door chemische uitharding (2K-systemen). Natlak is flexibeler qua toepasbaarheid: het werkt ook op grote constructies die niet in een oven passen, complexe geometrieÃ«n en herstellingen in het veld." },
			{
				type: "bullets",
				items: [
					"Poedercoating: ideaal voor seriematige productie in standaardmaten",
					"Natlak: noodzakelijk voor grote of complexe constructies",
					"Poedercoating: egaler en krasbestendiger oppervlak",
					"Natlak: geschikt voor C4/C5 corrosiviteitscategorieÃ«n (industrieel, offshore)",
					"Natlak: makkelijker te herstellen ter plaatse"
				]
			},
			{
				type: "h2",
				text: "Wanneer kiest u voor welke methode?"
			},
			{ text: "De vuistregel is simpel: past het in de oven? Dan is poedercoating doorgaans de beste keuze voor binnenwerk, lichte construties en gevelelementen. Voor zware staaldelen, buitentoepassingen in agressieve omgevingen of grote constructies die niet verplaatst kunnen worden, is natlak de aangewezen route." },
			{
				type: "quote",
				text: "De beste coating is degene die aansluit op de omgeving, het gebruik en het budget van uw project."
			}
		],
		tags: [
			"Afwerking",
			"Coating",
			"Poedercoating",
			"Natlak"
		]
	},
	{
		id: 4,
		category: "Certificering",
		date: "17 maart 2026",
		readTime: "6 min",
		title: "Lascertificaat verplicht? Alles wat u moet weten over EN-1090",
		excerpt: "Sinds de invoering van de EN-1090 norm is een lascertificaat voor veel staalconstructies verplicht. Maar wat houdt dat precies in, en wanneer is het van toepassing? FerroWorks legt het u helder uit.",
		img: lascertificaat_verplicht_featured_300x158_default,
		featured: false,
		body: [
			{
				type: "intro",
				text: "Steeds vaker krijgen wij de vraag: 'Is een lascertificaat verplicht voor mijn project?' Het antwoord hangt af van het type constructie en de toepassing â€” maar in veel gevallen is het antwoord simpelweg: ja. De Europese norm EN-1090 regelt de uitvoering van staal- en aluminiumconstructies en stelt eisen aan zowel het bedrijf als de individuele lassers. In dit artikel leggen we het u stap voor stap uit."
			},
			{
				type: "h2",
				text: "Wat is EN-1090?"
			},
			{ text: "EN-1090 is de Europese norm voor de fabricage van staal- en aluminiumconstructies. De norm bestaat uit twee delen: EN-1090-1 (CE-markering en conformiteitsbeoordeling) en EN-1090-2 (technische eisen voor staalconstructies). Een bedrijf dat CE-gemarkeerde staalconstructies op de Europese markt wil brengen, moet gecertificeerd zijn conform EN-1090-1." },
			{
				type: "h2",
				text: "Voor welke constructies is het verplicht?"
			},
			{ text: "De CE-markering op basis van EN-1090 is verplicht voor constructieve staalproducten die vallen onder de Europese Bouwproductenverordening (CPR). Concreet gaat het om dragende elementen zoals kolommen, liggers, vakwerkspanten, trappen en balustrades die deel uitmaken van gebouwen of civieltechnische werken." },
			{
				type: "bullets",
				items: [
					"Dragende staalconstructies in gebouwen (EXC2 of hoger)",
					"Bruggen en civieltechnische constructies",
					"IndustriÃ«le platforms en loopbruggen",
					"Trappen en balustrades als constructief element",
					"Offshore- en industriÃ«le constructies met hoge veiligheidseisen"
				]
			},
			{
				type: "h2",
				text: "Uitvoeringsklassen: EXC1 t/m EXC4"
			},
			{ text: "De norm kent vier uitvoeringsklassen (EXC1 t/m EXC4), waarbij EXC1 de laagste eisen stelt en EXC4 de hoogste. De keuze van de uitvoeringsklasse hangt af van de gevolgklasse (consequence class) van de constructie: hoe groter de gevolgen bij falen, hoe hoger de klasse. Voor de meeste industriÃ«le en utiliteitsbouwprojecten geldt EXC2 als standaard." },
			{
				type: "quote",
				text: "FerroWorks is gecertificeerd voor uitvoeringsklassen EXC1 en EXC2 â€” de meest voorkomende klassen in bouw, industrie en architectuur."
			},
			{
				type: "h2",
				text: "Wat betekent dit voor u als opdrachtgever?"
			},
			{ text: "Als u een gecertificeerd bedrijf inschakelt zoals FerroWorks, ontvangt u bij oplevering een volledige CE-verklaring van prestatie (DoP) met bijbehorende documentatie. Dit beschermt u als opdrachtgever juridisch en garandeert dat de constructie voldoet aan de Europese veiligheidseisen." }
		],
		tags: [
			"EN-1090",
			"Certificering",
			"CE-markering",
			"Uitvoeringsklassen"
		]
	},
	{
		id: 5,
		category: "Productie",
		date: "10 maart 2026",
		readTime: "4 min",
		title: "Van tekening tot product: zo werkt ons productieproces",
		excerpt: "Hoe gaat een metaalproject van CAD-tekening naar afgewerkt product? We nemen u stap voor stap mee door het productieproces van FerroWorks: van intake en engineering tot productie, afwerking en montage.",
		img: over_ons1_default,
		featured: false,
		body: [
			{
				type: "intro",
				text: "Een metaalproject bouwen is meer dan knippen, lassen en lakken. Achter elk FerroWorks-product zit een gestructureerd proces dat begint op het moment dat u contact met ons opneemt â€” en eindigt pas als uw constructie gemonteerd, geÃ¯nspecteerd en opgeleverd is. In dit artikel nemen we u mee door onze werkwijze."
			},
			{
				type: "h2",
				text: "Stap 1: Intake en offerte"
			},
			{ text: "Elk project begint met een gesprek. We willen begrijpen wat u nodig heeft: de toepassing, de omgeving, de belastingen en uw budget. Op basis hiervan stellen wij een heldere offerte op met vaste prijs, duidelijke scope en realistische planning. Geen verrassingen achteraf." },
			{
				type: "h2",
				text: "Stap 2: Engineering en tekeningen"
			},
			{ text: "Na akkoord op de offerte start onze engineeringsafdeling met het uitwerken van de productietekeningen. We werken met moderne CAD-software en stemmen de tekeningen af met uw ontwerper of constructeur. Pas als u de tekeningen goedkeurt, gaan we de productie in." },
			{
				type: "h2",
				text: "Stap 3: Productie"
			},
			{ text: "In onze eigen werkplaats in Roosendaal beschikken we over moderne zaagmachines, lasersnijders, knipmachines, lasmachines en buigapparatuur. We werken met staal, RVS en aluminium en produceren alles in eigen beheer â€” geen uitbesteding, volledige controle." },
			{
				type: "bullets",
				items: [
					"Zaag- en laserwerkzaamheden in eigen beheer",
					"Gecertificeerd laswerk conform EN-1090",
					"Bewerkingen voor RVS, staal en aluminium",
					"Kwaliteitscontrole tijdens en na productie"
				]
			},
			{
				type: "h2",
				text: "Stap 4: Afwerking en coating"
			},
			{ text: "Na productie volgt de oppervlaktebehandeling: stralen, gronden, natlakken of poedercoaten. We adviseren u over de meest geschikte methode op basis van de toepassing en omgevingscondities. Alle coatings worden aangebracht conform de geldende normen." },
			{
				type: "h2",
				text: "Stap 5: Montage en oplevering"
			},
			{ text: "Onze montageploeg plaatst de constructie op uw locatie. Na montage volgt een eindinspectie en ontvangen u een volledig opleverdossier: tekeningen, materiaalcertificaten, laskwaliteitsrapporten en â€” indien van toepassing â€” een CE-verklaring." },
			{
				type: "quote",
				text: "EÃ©n aanspreekpunt, van eerste schets tot laatste bout. Dat is de FerroWorks-werkwijze."
			}
		],
		tags: [
			"Productie",
			"Werkwijze",
			"Engineering",
			"Montage"
		]
	},
	{
		id: 6,
		category: "Industrie",
		date: "3 maart 2026",
		readTime: "5 min",
		title: "Maatwerk staal voor de industrie: 5 veelgemaakte fouten vermeden",
		excerpt: "Bij industrieel staalmaatwerk gaat het soms mis â€” niet door slechte intenties, maar door gebrek aan kennis of slechte communicatie. We bespreken vijf veelgemaakte fouten en hoe u ze kunt voorkomen.",
		img: over_ons2_default,
		featured: false,
		body: [
			{
				type: "intro",
				text: "Industrieel staalmaatwerk is complex. Er zijn veel partijen bij betrokken â€” opdrachtgevers, constructeurs, uitvoerders, toeleveranciers â€” en elke schakel kan een foutbron zijn. In onze jarenlange praktijk bij FerroWorks hebben we bepaalde patronen zien terugkomen. In dit artikel bespreken we vijf veelgemaakte fouten en hoe u ze kunt voorkomen."
			},
			{
				type: "h2",
				text: "Fout 1: Onvolledige of vage specificaties"
			},
			{ text: "De meest voorkomende oorzaak van meerkosten en vertraging is een onvolledige opdracht. 'Zo sterk als nodig' of 'standaard kwaliteit' zijn geen bruikbare specificaties voor een staalconstructie. Definieer vooraf: het materiaaltype (staal/RVS/alu), de belastingen, de omgeving, de uitvoeringsklasse (EXC) en de coatingeis." },
			{
				type: "h2",
				text: "Fout 2: Certificering vergeten"
			},
			{ text: "Pas als de constructie al gebouwd is, blijkt dat er een EN-1090-certificaat vereist is. Dit leidt in het beste geval tot extra documentatiewerk â€” in het slechtste geval tot herbouw. Check vooraf of uw constructie CE-markering vereist en of uw leverancier gecertificeerd is." },
			{
				type: "h2",
				text: "Fout 3: Geen rekening houden met montageomstandigheden"
			},
			{ text: "Een constructie die in de werkplaats perfect past, past niet door de toegangsdeur van de fabriek. Of de liftcapaciteit op locatie is onvoldoende. Denk al in de engineeringsfase na over transport, kraaninzet, toegankelijkheid en montagevolgorde." },
			{
				type: "h2",
				text: "Fout 4: Coating kiezen op basis van prijs alleen"
			},
			{ text: "Een goedkope coating die na twee jaar loslaat, is duurder dan een degelijk systeem dat tien jaar meegaat. De coatingkeuze hangt af van de omgeving (C1â€“C5), de gewenste levensduur en het onderhoudsprofiel. Vraag advies â€” het betaalt zichzelf terug." },
			{
				type: "h2",
				text: "Fout 5: Ã‰Ã©n leverancier met alles uitbesteden zonder controle"
			},
			{ text: "Vertrouwen is goed, controle is beter. Een goede leverancier verwelkomt tussentijdse inspecties, levert materiaalcertificaten en rapporteert transparant over afwijkingen. Als een partij dit niet doet, is dat een waarschuwingssignaal." },
			{
				type: "bullets",
				items: [
					"Vraag altijd om materiaalcertificaten (EN 10204 3.1 of 3.2)",
					"Laat lasrapporten overleggen bij certificeringsplichtige constructies",
					"Plan een tussentijdse inspectie in de productie",
					"Controleer coatingdikte na oplevering met een meetapparaat"
				]
			},
			{
				type: "quote",
				text: "Goede communicatie en heldere afspraken zijn de beste bescherming tegen kostbare fouten."
			}
		],
		tags: [
			"Industrie",
			"Maatwerk",
			"Kwaliteit",
			"Tips"
		]
	}
];
function PostHero({ post, imgSrc }) {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "400px",
			display: "flex",
			alignItems: "flex-end",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${imgSrc})`,
				backgroundSize: "cover",
				backgroundPosition: "center"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(0deg, rgba(20,22,22,0.97) 0%, rgba(20,22,22,0.7) 50%, rgba(20,22,22,0.35) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingBottom: "56px",
					paddingTop: "96px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "20px",
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "var(--fw-website-primary)",
									fontSize: "12px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "12px"
								},
								children: "â€º"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/blog",
								style: {
									color: "var(--fw-website-primary)",
									fontSize: "12px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Blog"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "12px"
								},
								children: "â€º"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#888",
									fontSize: "12px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: post.category
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: { marginBottom: "16px" },
						children: /* @__PURE__ */ jsx("span", {
							style: {
								background: "var(--fw-website-primary)",
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "10px",
								letterSpacing: "1.5px",
								textTransform: "uppercase",
								color: "#1c1c1c",
								padding: "5px 12px"
							},
							children: post.category
						})
					}),
					/* @__PURE__ */ jsx("h1", {
						style: {
							margin: "0 0 20px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(24px, 3.5vw, 48px)",
							lineHeight: 1.08,
							letterSpacing: "-0.5px",
							textTransform: "uppercase",
							color: "#fff",
							maxWidth: "820px"
						},
						children: post.title
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "20px",
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#888",
									fontSize: "13px"
								},
								children: post.date
							}),
							/* @__PURE__ */ jsx("span", { style: {
								width: "4px",
								height: "4px",
								background: "var(--fw-website-primary)",
								borderRadius: "50%",
								flexShrink: 0
							} }),
							/* @__PURE__ */ jsxs("span", {
								style: {
									color: "#888",
									fontSize: "13px"
								},
								children: [post.readTime, " leestijd"]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "var(--fw-website-primary)",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function ArticleBody({ post, allPosts }) {
	const [ref, vis] = useInView$3(.05);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .ab-wrap { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .ab-on .ab-wrap { opacity:1; transform:none; }
        .ab-body h2 {
          font-family: "Arial Black", Arial, sans-serif;
          font-weight: 900;
          font-size: clamp(18px, 2vw, 22px);
          text-transform: uppercase;
          letter-spacing: -0.2px;
          color: #1c1c1c;
          margin: 40px 0 16px 0;
          line-height: 1.2;
        }
        .ab-body p {
          color: #555;
          font-size: 15.5px;
          line-height: 1.8;
          margin: 0 0 18px 0;
        }
        .ab-body .intro-p {
          font-size: 17px;
          color: #444;
          border-left: 4px solid var(--fw-website-primary);
          padding-left: 20px;
          margin-bottom: 32px;
          line-height: 1.8;
        }
        .ab-body blockquote {
          background: #1c1c1c;
          border-left: 5px solid var(--fw-website-primary);
          margin: 36px 0;
          padding: 28px 32px;
          font-family: "Arial Black", Arial, sans-serif;
          font-weight: 900;
          font-size: clamp(15px, 1.6vw, 18px);
          color: #fff;
          line-height: 1.4;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -0.2px;
        }
        .ab-body ul {
          margin: 8px 0 24px 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ab-body ul li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #555;
          font-size: 15px;
          line-height: 1.6;
        }
        .ab-body ul li::before {
          content: "";
          display: block;
          width: 8px;
          height: 8px;
          background: var(--fw-website-primary);
          flex-shrink: 0;
          margin-top: 6px;
        }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 ab-layout " + (vis ? "ab-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 340px",
				gap: "64px",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsxs("article", {
				className: "ab-wrap ab-body",
				children: [typeof post.body === "string" ? /<[^>]+>/.test(post.body) ? /* @__PURE__ */ jsx(RichTextContent, { html: post.body }) : post.body.split("\n\n").map((paragraph, i) => i === 0 ? /* @__PURE__ */ jsx("p", {
					className: "intro-p",
					children: paragraph
				}, i) : /* @__PURE__ */ jsx("p", { children: paragraph }, i)) : post.body.map((block, i) => {
					if (block.type === "intro") return /* @__PURE__ */ jsx("p", {
						className: "intro-p",
						children: block.text
					}, i);
					if (block.type === "h2") return /* @__PURE__ */ jsx("h2", { children: block.text }, i);
					if (block.type === "quote") return /* @__PURE__ */ jsxs("blockquote", { children: [
						"\"",
						block.text,
						"\""
					] }, i);
					if (block.type === "bullets") return /* @__PURE__ */ jsx("ul", { children: block.items.map((item, j) => /* @__PURE__ */ jsx("li", { children: item }, j)) }, i);
					return /* @__PURE__ */ jsx("p", { children: block.text }, i);
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						marginTop: "48px",
						paddingTop: "32px",
						borderTop: "1.5px solid #e0e0e0"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "1.5px",
							textTransform: "uppercase",
							color: "#aaa",
							marginRight: "12px"
						},
						children: "Tags:"
					}), (post.tags || []).map((tag, i) => /* @__PURE__ */ jsx("span", {
						style: {
							display: "inline-block",
							background: "#e8e8e8",
							color: "#555",
							fontSize: "12px",
							fontWeight: 700,
							padding: "4px 12px",
							marginRight: "8px",
							marginBottom: "8px",
							letterSpacing: "0.3px"
						},
						children: tag
					}, i))]
				})]
			}), /* @__PURE__ */ jsx(Sidebar$1, {
				post,
				allPosts
			})]
		})]
	});
}
function Sidebar$1({ post, allPosts }) {
	const others = allPosts.filter((p) => p.id !== post.id).slice(0, 3);
	return /* @__PURE__ */ jsxs("aside", {
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "32px"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "#1c1c1c",
					padding: "28px 24px"
				},
				children: [
					/* @__PURE__ */ jsxs("h3", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "14px",
							textTransform: "uppercase",
							letterSpacing: "-0.1px",
							color: "#fff",
							margin: "0 0 12px 0",
							lineHeight: 1.2
						},
						children: ["EEN PROJECT ", /* @__PURE__ */ jsx("span", {
							style: { color: "var(--fw-website-primary)" },
							children: "IN GEDACHTEN?"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#888",
							fontSize: "13px",
							lineHeight: 1.6,
							margin: "0 0 20px 0"
						},
						children: "Neem contact op met ons team. We reageren binnen 24 uur."
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							display: "block",
							textAlign: "center",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "var(--fw-website-primary)",
							padding: "14px 20px",
							textDecoration: "none",
							transition: "background .2s"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
						onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
						children: "NEEM CONTACT OP"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fff",
					padding: "24px",
					borderTop: "4px solid var(--fw-website-primary)"
				},
				children: [/* @__PURE__ */ jsx("h4", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						letterSpacing: "1px",
						color: "#1c1c1c",
						margin: "0 0 16px 0"
					},
					children: "DIRECT CONTACT"
				}), /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "10px"
					},
					children: [{
						label: "Telefoon",
						val: "+31 (0)165 205 601",
						href: "tel:+31165205601"
					}, {
						label: "E-mail",
						val: "info@ferroworks.nl",
						href: "mailto:info@ferroworks.nl"
					}].map((item, i) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "10px",
							fontWeight: 700,
							letterSpacing: "1px",
							textTransform: "uppercase",
							color: "#aaa",
							marginBottom: "2px"
						},
						children: item.label
					}), /* @__PURE__ */ jsx("a", {
						href: item.href,
						style: {
							color: "#1c1c1c",
							fontSize: "13px",
							fontWeight: 700,
							textDecoration: "none"
						},
						onMouseEnter: (e) => e.currentTarget.style.color = "var(--fw-website-primary)",
						onMouseLeave: (e) => e.currentTarget.style.color = "#1c1c1c",
						children: item.val
					})] }, i))
				})]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontWeight: 900,
					fontSize: "12px",
					textTransform: "uppercase",
					letterSpacing: "1.5px",
					color: "#1c1c1c",
					margin: "0 0 20px 0",
					paddingBottom: "12px",
					borderBottom: "2px solid var(--fw-website-primary)"
				},
				children: "MEER ARTIKELEN"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "16px"
				},
				children: others.map((p) => /* @__PURE__ */ jsxs(Link, {
					to: `/blog/${p.slug || p.id}`,
					style: {
						display: "flex",
						gap: "12px",
						textDecoration: "none",
						alignItems: "flex-start"
					},
					onMouseEnter: (e) => e.currentTarget.querySelector(".rel-title").style.color = "var(--fw-website-primary)",
					onMouseLeave: (e) => e.currentTarget.querySelector(".rel-title").style.color = "#1c1c1c",
					children: [/* @__PURE__ */ jsx("img", {
						src: p.image || BLOG_FALLBACK_IMAGES[allPosts.indexOf(p) % BLOG_FALLBACK_IMAGES.length],
						alt: p.title,
						style: {
							width: "64px",
							height: "48px",
							objectFit: "cover",
							flexShrink: 0
						}
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "10px",
							fontWeight: 700,
							letterSpacing: "1px",
							color: "var(--fw-website-primary)",
							textTransform: "uppercase",
							marginBottom: "4px"
						},
						children: p.category
					}), /* @__PURE__ */ jsx("div", {
						className: "rel-title",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							color: "#1c1c1c",
							lineHeight: 1.3,
							transition: "color .2s"
						},
						children: p.title
					})] })]
				}, p.id))
			})] })
		]
	});
}
function MorePosts({ currentId, allPosts }) {
	const [ref, vis] = useInView$3(.1);
	const related = allPosts.filter((p) => p.id !== currentId).slice(0, 3);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .mp-card { opacity:0; transform:translateY(24px); transition: opacity .55s ease, transform .55s ease; }
        .mp-on .mp-card:nth-child(1) { opacity:1; transform:none; transition-delay:.05s; }
        .mp-on .mp-card:nth-child(2) { opacity:1; transform:none; transition-delay:.18s; }
        .mp-on .mp-card:nth-child(3) { opacity:1; transform:none; transition-delay:.31s; }
        @media (max-width: 768px) { .mp-grid { grid-template-columns: 1fr !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "mp-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "40px",
					flexWrap: "wrap",
					gap: "16px"
				},
				children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(18px, 2vw, 24px)",
						textTransform: "uppercase",
						letterSpacing: "-0.3px",
						margin: 0
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#fff" },
						children: "MEER "
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "ARTIKELEN"
					})]
				}), /* @__PURE__ */ jsxs(Link, {
					to: "/blog",
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						color: "var(--fw-website-primary)",
						textDecoration: "none",
						display: "flex",
						alignItems: "center",
						gap: "6px"
					},
					onMouseEnter: (e) => e.currentTarget.style.gap = "10px",
					onMouseLeave: (e) => e.currentTarget.style.gap = "6px",
					children: ["ALLE ARTIKELEN", /* @__PURE__ */ jsx("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						children: /* @__PURE__ */ jsx("path", {
							d: "M5 12h14M12 5l7 7-7 7",
							stroke: "var(--fw-website-primary)",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "mp-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "24px"
				},
				children: related.map((p) => /* @__PURE__ */ jsxs(Link, {
					to: `/blog/${p.slug || p.id}`,
					className: "mp-card",
					style: {
						textDecoration: "none",
						background: "#252525",
						display: "block",
						transition: "transform .25s ease, box-shadow .25s ease"
					},
					onMouseEnter: (e) => {
						e.currentTarget.style.transform = "translateY(-4px)";
						e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.3)";
					},
					onMouseLeave: (e) => {
						e.currentTarget.style.transform = "none";
						e.currentTarget.style.boxShadow = "none";
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							overflow: "hidden",
							height: "180px"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: p.image || BLOG_FALLBACK_IMAGES[allPosts.indexOf(p) % BLOG_FALLBACK_IMAGES.length],
							alt: p.title,
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								display: "block",
								transition: "transform .4s ease"
							},
							onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.05)",
							onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)"
						})
					}), /* @__PURE__ */ jsxs("div", {
						style: { padding: "22px 20px" },
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px",
									marginBottom: "10px"
								},
								children: [/* @__PURE__ */ jsx("span", {
									style: {
										background: "var(--fw-website-primary)",
										fontFamily: "Arial Black, Arial, sans-serif",
										fontWeight: 900,
										fontSize: "9px",
										letterSpacing: "1px",
										textTransform: "uppercase",
										color: "#1c1c1c",
										padding: "3px 8px"
									},
									children: p.category
								}), /* @__PURE__ */ jsx("span", {
									style: {
										color: "#666",
										fontSize: "12px"
									},
									children: p.date
								})]
							}),
							/* @__PURE__ */ jsx("h3", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "13px",
									textTransform: "uppercase",
									color: "#fff",
									margin: "0 0 10px 0",
									lineHeight: 1.3,
									letterSpacing: "-0.1px"
								},
								children: p.title
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "var(--fw-website-primary)",
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "11px",
									textTransform: "uppercase",
									letterSpacing: "0.5px"
								},
								children: "LEES MEER â†’"
							})
						]
					})]
				}, p.id))
			})]
		})]
	});
}
function CtaStrip$1() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "48px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "24px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(18px, 2.2vw, 26px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 8px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["KLAAR VOOR UW ", /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "METAALPROJECT?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#888",
						fontSize: "14px",
						margin: 0
					},
					children: "Stuur uw tekening op of bel ons direct â€” wij reageren binnen 24 uur."
				})] }), /* @__PURE__ */ jsx(Link, {
					to: "/contact",
					className: "fw-primary-action",
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "13px",
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						color: "#1c1c1c",
						background: "var(--fw-website-primary)",
						padding: "16px 32px",
						textDecoration: "none",
						display: "inline-block",
						transition: "background .2s",
						flexShrink: 0
					},
					onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
					onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
					children: "NEEM CONTACT OP"
				})]
			})
		})
	});
}
function BlogDetailPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { cms } = useCms();
	const allPosts = cms.blog && cms.blog.length ? cms.blog : FALLBACK_POSTS;
	const post = allPosts.find((p) => p.slug === slug) || allPosts.find((p) => String(p.id) === String(slug));
	const postIdx = allPosts.indexOf(post);
	const imgSrc = post ? post.image || BLOG_FALLBACK_IMAGES[postIdx % BLOG_FALLBACK_IMAGES.length] : null;
	useEffect(() => {
		if (!post) navigate("/blog", { replace: true });
		else window.scrollTo({
			top: 0,
			behavior: "instant"
		});
	}, [
		id,
		post,
		navigate
	]);
	if (!post) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PostHero, {
			post,
			imgSrc
		}),
		/* @__PURE__ */ jsx(ArticleBody, {
			post,
			allPosts
		}),
		/* @__PURE__ */ jsx(MorePosts, {
			currentId: post.id,
			allPosts
		}),
		/* @__PURE__ */ jsx(CtaStrip$1, {})
	] });
}
//#endregion
//#region src/pages/DienstenPage.jsx
var FALLBACK_IMAGES$2 = [
	about_us1_default,
	over_ons1_default,
	over_ons2_default,
	over_ons3_default,
	about_us2_default
];
function useInView$2(threshold = .1) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
function CheckIcon$1() {
	return /* @__PURE__ */ jsx("svg", {
		width: "20",
		height: "20",
		viewBox: "0 0 22 22",
		fill: "none",
		style: {
			flexShrink: 0,
			marginTop: "2px"
		},
		children: /* @__PURE__ */ jsx("polyline", {
			points: "3,11 9,17 20,5",
			stroke: "var(--fw-website-primary)",
			strokeWidth: "2.8",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function PageHero$1() {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "380px",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${hero_background_default})`,
				backgroundSize: "cover",
				backgroundPosition: "center right"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(90deg,rgba(20,22,22,0.94) 0%,rgba(20,22,22,0.76) 55%,rgba(20,22,22,0.4) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "64px",
					paddingBottom: "64px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "24px"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "var(--fw-website-primary)",
									fontSize: "13px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#666",
									fontSize: "13px"
								},
								children: "â€º"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Diensten"
							})
						]
					}),
					/* @__PURE__ */ jsxs("h1", {
						style: {
							margin: "0 0 16px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px,4vw,56px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "var(--fw-website-primary)" },
							children: "ONZE "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#fff" },
							children: "DIENSTEN"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: 0,
							color: "#bbb",
							fontSize: "clamp(14px,1.6vw,17px)",
							lineHeight: 1.6,
							maxWidth: "560px"
						},
						children: "Van ontwerp en engineering tot productie, coating en montage â€” FerroWorks ontzorgt u volledig in metaalmaatwerk van A tot Z."
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "var(--fw-website-primary)",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function IntroStrip$1() {
	const [ref, vis] = useInView$2(.2);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "48px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `.is-d{opacity:0;transform:translateY(16px);transition:opacity .55s ease,transform .55s ease}.is-d-on .is-d{opacity:1;transform:none}` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 is-d-grid " + (vis ? "is-d-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(3,1fr)",
				borderLeft: "3px solid var(--fw-website-primary)"
			},
			children: [
				{
					num: "15+",
					label: "Jaar ervaring",
					sub: "in metaalmaatwerk"
				},
				{
					num: "100%",
					label: "Eigen productie",
					sub: "zonder onderaannemers"
				},
				{
					num: "A-Z",
					label: "Volledig ontzorgd",
					sub: "van ontwerp tot montage"
				}
			].map((item, i) => /* @__PURE__ */ jsxs("div", {
				className: "is-d",
				style: {
					padding: "8px 32px",
					borderRight: i < 2 ? "1px solid #333" : "none"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(26px,3vw,38px)",
							color: "var(--fw-website-primary)",
							lineHeight: 1,
							letterSpacing: "-0.5px"
						},
						children: item.num
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							color: "#fff",
							textTransform: "uppercase",
							letterSpacing: "0.3px",
							marginTop: "4px"
						},
						children: item.label
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "12px",
							color: "#777",
							marginTop: "2px"
						},
						children: item.sub
					})
				]
			}, i))
		})]
	});
}
function DienstBlock({ dienst, index }) {
	const [ref, vis] = useInView$2();
	const isEven = index % 2 === 0;
	const bg = isEven ? "#f4f4f4" : "#fff";
	const img = dienst.image || FALLBACK_IMAGES$2[index % FALLBACK_IMAGES$2.length];
	const checkItems = dienst.checklist ? dienst.checklist.split("\n").filter(Boolean) : [];
	const textBlock = /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("div", {
			style: {
				display: "inline-block",
				background: isEven ? "var(--fw-website-primary)" : "#1c1c1c",
				padding: "6px 14px",
				marginBottom: "20px"
			},
			children: /* @__PURE__ */ jsxs("span", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontWeight: 900,
					fontSize: "10px",
					letterSpacing: "1.5px",
					textTransform: "uppercase",
					color: isEven ? "#1c1c1c" : "var(--fw-website-primary)"
				},
				children: [
					dienst.nr,
					" â€” ",
					dienst.title
				]
			})
		}),
		/* @__PURE__ */ jsx("h2", {
			style: {
				margin: "0 0 12px 0",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "clamp(22px,2.6vw,34px)",
				textTransform: "uppercase",
				lineHeight: 1.1,
				letterSpacing: "-0.3px",
				color: "#1c1c1c"
			},
			children: dienst.title
		}),
		/* @__PURE__ */ jsx("p", {
			style: {
				color: "#777",
				fontSize: "13.5px",
				fontStyle: "italic",
				margin: "0 0 20px 0"
			},
			children: dienst.subtitle
		}),
		/* @__PURE__ */ jsx("p", {
			style: {
				color: "#555",
				fontSize: "15px",
				lineHeight: 1.8,
				margin: "0 0 24px 0"
			},
			children: dienst.excerpt
		}),
		/* @__PURE__ */ jsx("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: "12px",
				marginBottom: "28px"
			},
			children: checkItems.map((item, i) => /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "flex-start",
					gap: "10px"
				},
				children: [/* @__PURE__ */ jsx(CheckIcon$1, {}), /* @__PURE__ */ jsx("span", {
					style: {
						color: "#555",
						fontSize: "14.5px",
						lineHeight: 1.6
					},
					children: item
				})]
			}, i))
		}),
		/* @__PURE__ */ jsxs(Link, {
			to: `/diensten/${dienst.id}`,
			style: {
				display: "inline-flex",
				alignItems: "center",
				gap: "8px",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "13px",
				textTransform: "uppercase",
				letterSpacing: "0.5px",
				color: "#1c1c1c",
				background: "var(--fw-website-primary)",
				padding: "14px 28px",
				textDecoration: "none"
			},
			onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
			onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
			children: ["MEER INFORMATIE", /* @__PURE__ */ jsx("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 24 24",
				fill: "none",
				children: /* @__PURE__ */ jsx("path", {
					d: "M5 12h14M12 5l7 7-7 7",
					stroke: "#1c1c1c",
					strokeWidth: "2.5",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			})]
		})
	] });
	const imageBlock = /* @__PURE__ */ jsxs("div", {
		style: { position: "relative" },
		children: [/* @__PURE__ */ jsx("div", {
			className: "service-accent",
			style: {
				position: "absolute",
				...isEven ? {
					top: "-16px",
					right: "-16px"
				} : {
					bottom: "-16px",
					left: "-16px"
				},
				width: "72px",
				height: "72px",
				background: "var(--fw-website-primary)",
				zIndex: 0
			}
		}), /* @__PURE__ */ jsx("div", {
			style: {
				position: "relative",
				zIndex: 1,
				overflow: "hidden",
				boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
			},
			children: /* @__PURE__ */ jsx("img", {
				className: "service-image",
				src: img,
				alt: dienst.title,
				style: {
					width: "100%",
					height: "380px",
					objectFit: "cover",
					objectPosition: "center",
					display: "block"
				}
			})
		})]
	});
	return /* @__PURE__ */ jsxs("section", {
		id: dienst.id,
		style: {
			background: bg,
			padding: "80px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .db${index}-l{opacity:0;transform:translateX(-36px);transition:opacity .65s ease,transform .65s ease}
        .db${index}-r{opacity:0;transform:translateX(36px);transition:opacity .65s .15s ease,transform .65s .15s ease}
        .db${index}-on .db${index}-l,.db${index}-on .db${index}-r{opacity:1;transform:none}
        @media(max-width:768px){.db${index}-g{grid-template-columns:1fr!important}}
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: `max-w-7xl mx-auto px-6 md:px-8 fw-service-grid db${index}-g` + (vis ? ` db${index}-on` : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "80px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: `db${index}-l`,
				children: isEven ? textBlock : imageBlock
			}), /* @__PURE__ */ jsx("div", {
				className: `db${index}-r`,
				children: isEven ? imageBlock : textBlock
			})]
		})]
	});
}
function CtaSection$1() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "80px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "56px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "28px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(20px,2.4vw,30px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 10px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["KLAAR OM ", /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "TE STARTEN?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#999",
						fontSize: "15px",
						margin: 0,
						lineHeight: 1.5
					},
					children: "Stuur uw tekening op of neem contact op â€” wij reageren binnen 24 uur."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "fw-cta-actions",
					style: {
						display: "flex",
						gap: "16px",
						flexWrap: "wrap"
					},
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "var(--fw-website-primary)",
							padding: "16px 32px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
						onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
						children: "OFFERTE AANVRAGEN"
					}), /* @__PURE__ */ jsx("a", {
						href: "tel:+31165205617",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#fff",
							background: "transparent",
							border: "2px solid #555",
							padding: "14px 28px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.borderColor = "var(--fw-website-primary)",
						onMouseLeave: (e) => e.currentTarget.style.borderColor = "#555",
						children: "BEL ONS"
					})]
				})]
			})
		})
	});
}
function DienstenPage() {
	const { cms } = useCms();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHero$1, {}),
		/* @__PURE__ */ jsx(IntroStrip$1, {}),
		(cms.diensten || []).map((dienst, i) => /* @__PURE__ */ jsx(DienstBlock, {
			dienst,
			index: i
		}, dienst.id)),
		/* @__PURE__ */ jsx(CtaSection$1, {})
	] });
}
//#endregion
//#region src/pages/DienstDetailPage.jsx
var FALLBACK_IMAGES$1 = {
	engineering: about_us1_default,
	productie: over_ons1_default,
	coating: over_ons2_default,
	montage: about_us2_default,
	reparatie: about_us3_default
};
function useInView$1(threshold = .1) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
var diensten_fallback = [
	{
		id: "engineering",
		nr: "01",
		title: "Engineering & Ontwerp",
		subtitle: "Van eerste schets tot goedgekeurde productietekening",
		img: about_us1_default,
		excerpt: "Elk project begint met een goed ontwerp. Onze engineers werken met moderne CAD-software en vertalen uw wensen naar haalbare, maakbare productietekeningen.",
		body: [
			{
				type: "intro",
				text: "Een goed metaalproject begint niet in de werkplaats â€” het begint op de tekentafel. Bij FerroWorks beschikken we over een eigen engineeringsafdeling die uw idee of specificatie omzet naar een volledig uitgewerkte, maakbare productietekening. We denken actief mee over de beste constructieve oplossing, de juiste materiaalkeuze en eventuele kostenbesparingen."
			},
			{
				type: "h2",
				text: "Van schets tot goedgekeurde tekening"
			},
			{ text: "Of u nu aankomt met een gedetailleerde constructietekening, een ruwe schets op papier of enkel een idee â€” wij werken het uit. We stellen gerichte vragen om uw toepassing, belasting, omgeving en eindgebruik goed te begrijpen. Vervolgens werken onze engineers de productietekeningen uit in 2D of 3D, afhankelijk van de complexiteit." },
			{
				type: "h2",
				text: "Wat wij bieden"
			},
			{
				type: "bullets",
				items: [
					"2D- en 3D-tekeningen via CAD/CAM software",
					"Constructieve berekeningen en toetsing",
					"Materiaalkeuze: staal, RVS of aluminium",
					"Kostenadvies en optimalisatie in het ontwerp",
					"Toetsing op maakbaarheid vÃ³Ã³r productie",
					"Goedkeuringsproces met de opdrachtgever",
					"Revisietekeningen na wijzigingen"
				]
			},
			{
				type: "h2",
				text: "Heeft u al een tekening?"
			},
			{ text: "Geen probleem â€” we reviewen uw bestaande tekeningen op maakbaarheid, normconformiteit (EN-1090) en eventuele verbeterpunten. We passen tekeningen aan waar nodig en zorgen dat de uiteindelijke productietekening overeenkomt met wat u wilt en wat wij kunnen maken." },
			{
				type: "quote",
				text: "Een uur extra aandacht in het ontwerp bespaart een dag in de productie."
			},
			{
				type: "h2",
				text: "Samenwerking met uw constructeur"
			},
			{ text: "Werkt u met een extern constructiebedrijf of architect? Dan stemmen wij direct met hen af. We brengen de uitvoerbaarheid in vanuit de fabrikant â€” zodat wat op papier staat ook echt te maken is." }
		],
		checkitems: [
			"2D- en 3D-tekeningen (CAD/CAM)",
			"Constructieve berekeningen",
			"Materiaalkeuze en kostenadvies",
			"Toetsing op maakbaarheid",
			"Goedkeuringsproces met de opdrachtgever"
		],
		tags: [
			"Engineering",
			"CAD",
			"Ontwerp",
			"Tekeningen"
		]
	},
	{
		id: "productie",
		nr: "02",
		title: "Productie in eigen beheer",
		subtitle: "Volledig machinepark, gecertificeerde lassers, volledige controle",
		img: over_ons1_default,
		excerpt: "In onze moderne werkplaats in Roosendaal produceren we alles in eigen beheer â€” staal, RVS en aluminium â€” zonder uitbesteding, met volledige kwaliteitscontrole.",
		body: [
			{
				type: "intro",
				text: "In de werkplaats van FerroWorks in Roosendaal ziet u vakmanschap in actie. Onze eigen machinisten, lassers en metaalbewerkers verwerken staal, RVS en aluminium tot producten die nauwkeurig aansluiten op uw specificaties. Geen uitbesteding, geen kwaliteitsverlies â€” volledige controle van begin tot eind."
			},
			{
				type: "h2",
				text: "Ons machinepark"
			},
			{ text: "We beschikken over moderne machines voor het gehele bewerkingstraject: van zaag en lasersnijder tot knipmachine, buigpers en lasapparatuur. Dit stelt ons in staat om zowel enkelstuks als series efficiÃ«nt en nauwkeurig te produceren." },
			{
				type: "bullets",
				items: [
					"Bandzaag en cirkelzaag voor staal en aluminium",
					"Lasersnijwerk met hoge nauwkeurigheid",
					"Knipmachine en afkantpers voor plaatwerk",
					"Buigen en walsen van buizen en profielen",
					"Boren en frezen"
				]
			},
			{
				type: "h2",
				text: "Gecertificeerd laswerk"
			},
			{ text: "Al onze lassers zijn gecertificeerd en werken conform de Europese norm EN-1090. We gebruiken MIG/MAG-, TIG- en WIG-lassen, afhankelijk van het materiaal en de toepassing. Elk laswerk wordt tijdens en na productie visueel geÃ¯nspecteerd. Waar vereist passen we niet-destructief onderzoek (NDO) toe." },
			{
				type: "h2",
				text: "Kwaliteitscontrole"
			},
			{ text: "Kwaliteit zit ingebakken in ons proces. We werken met vastgestelde lasprocedures (WPS), houden een digitaal laslogboek bij en leveren bij gecertificeerde projecten volledige documentatie: materiaalcertificaten (EN 10204), inspectierapporten en de CE-verklaring van prestatie." },
			{
				type: "quote",
				text: "Eigen productie betekent geen verrassingen â€” wij zijn verantwoordelijk van eerste zaagsnede tot laatste las."
			},
			{
				type: "h2",
				text: "Materialen"
			},
			{ text: "We verwerken constructiestaal (S235/S355/S420), roestvast staal (AISI 304, AISI 316L, duplex) en aluminium (6060, 6082, 5083). Ons team kent de specifieke eigenschappen van elk materiaal en past de bewerkings- en lasparameters dienovereenkomstig aan." }
		],
		checkitems: [
			"Zaag- en lasersnijwerk",
			"Boren, frezen en knippen",
			"Gecertificeerd lassen (MIG/MAG, TIG, WIG)",
			"Buigen en walsen",
			"Prefab-productie en maatwerk in alle series"
		],
		tags: [
			"Productie",
			"Lassen",
			"Machinepark",
			"EN-1090"
		]
	},
	{
		id: "coating",
		nr: "03",
		title: "Coating & Afwerking",
		subtitle: "De juiste bescherming en uitstraling voor uw constructie",
		img: over_ons2_default,
		excerpt: "Een goede afwerking beschermt uw constructie en bepaalt de uitstraling. FerroWorks adviseert en verzorgt de juiste coatingoplossing op basis van omgeving, gebruik en levensduur.",
		body: [
			{
				type: "intro",
				text: "De coating is het laatste â€” en een van de belangrijkste â€” onderdelen van het productieproces. Het beschermt de constructie tegen corrosie, slijtage en weersinvloeden, en bepaalt mede de uitstraling. FerroWorks adviseert u over de meest geschikte coatingmethode en -systeem, en verzorgt de uitvoering conform de geldende normen."
			},
			{
				type: "h2",
				text: "Welke coatingmethode past bij uw project?"
			},
			{ text: "De keuze voor een coating hangt af van meerdere factoren: de omgevingscategorie (C1 t/m C5), de gewenste levensduur, het materiaal (staal, RVS, aluminium) en het gebruik. We adviseren u proactief en transparant over de voor- en nadelen van elke optie." },
			{
				type: "h2",
				text: "Onze coatingmethoden"
			},
			{
				type: "bullets",
				items: [
					"Stralen tot Sa2,5 voor optimale hechting van de coating",
					"Zinkrijke of epoxy grondlaag (corrosiewerende basislaag)",
					"Natlak â€” geschikt voor grote constructies, complexe geometrieÃ«n en C4/C5",
					"Poedercoating â€” egaal, krasbestendig, ideaal voor seriematige productie",
					"RVS-polijsten â€” decoratief of hygiÃ«nisch finish (spiegel, geborsteld)",
					"Galvaniseren â€” langdurige zinkbescherming voor buitenapplicaties"
				]
			},
			{
				type: "h2",
				text: "Conform ISO 12944"
			},
			{ text: "Onze coatingsystemen worden toegepast conform ISO 12944 voor de corrosiviteitscategorie die aansluit op uw project. Dit varieert van C1 (droog binnenmilieu) tot C5 (industrieel of mariene omgeving). We documenteren de coatingdikte, laagopbouw en gebruikte producten in een coatingrapport." },
			{
				type: "quote",
				text: "Een goede coating kost geld eenmalig. Een slechte coating kost u elke paar jaar opnieuw."
			},
			{
				type: "h2",
				text: "Natlak vs. Poedercoating"
			},
			{ text: "Poedercoating is snel, egaal en milieuvriendelijk â€” ideaal voor seriematige, kleinere constructies die in een oven passen. Natlak is flexibeler en noodzakelijk voor grote of complexe constructies die niet verplaatst of verhit kunnen worden. We adviseren altijd de beste oplossing voor uw situatie." }
		],
		checkitems: [
			"Stralen tot Sa2,5",
			"Grondlagen (zinkrijk/epoxy)",
			"Natlak voor complexe constructies",
			"Poedercoating seriematig",
			"RVS-polijsten en galvaniseren"
		],
		tags: [
			"Coating",
			"Afwerking",
			"ISO 12944",
			"Corrosiebescherming"
		]
	},
	{
		id: "montage",
		nr: "04",
		title: "Montage op locatie",
		subtitle: "Eigen montageploeg â€” van prefab tot oplevering",
		img: about_us2_default,
		excerpt: "Onze montageploeg plaatst uw constructie op locatie, coÃ¶rdineert het kraanwerk en levert op met volledig documentatiepakket inclusief CE-verklaring.",
		body: [
			{
				type: "intro",
				text: "Een ijzersterke constructie verdient ook een professionele montage. FerroWorks beschikt over een eigen montageploeg die uw project op locatie plaatst â€” veilig, nauwkeurig en conform de geldende bouwnormen. Van eenvoudige hekplaatsing tot complexe staalconstructies op hoogte: wij coÃ¶rdineren het gehele montageproces."
			},
			{
				type: "h2",
				text: "Wat doet onze montageploeg?"
			},
			{ text: "Onze monteurs zijn VCA-gecertificeerd en hebben jarenlange ervaring met montage op industriÃ«le locaties, bouwplaatsen en offshore-toepassingen. Ze brengen de benodigde gereedschappen, hef- en hijsmiddelen mee en werken nauw samen met de hoofdaannemer of projectleider ter plaatse." },
			{
				type: "bullets",
				items: [
					"Montage van staal-, RVS- en aluminiumconstructies",
					"Kraanbegeleiding en coÃ¶rdinatie hef- en hijswerk",
					"Aansluitlassen en correcties op locatie",
					"Werken op hoogte (gecertificeerd)",
					"Afstemming met bouwplaatsleiding en hoofdaannemer",
					"Eindinspectie na montage"
				]
			},
			{
				type: "h2",
				text: "Veiligheid staat voorop"
			},
			{ text: "Al onze monteurs werken VCA-gecertificeerd. Voor elke montage stellen we een werkplan op met de montagevolgorde, de benodigde hef- en veiligheidsmiddelen en de risicobeoordeling. We werken altijd met een actueel VCA-veiligheidsplan en registreren incidenten conform de norm." },
			{
				type: "quote",
				text: "Wij leveren niet aan de poort â€” wij leveren op locatie, gemonteerd en goedgekeurd."
			},
			{
				type: "h2",
				text: "Opleverdossier"
			},
			{ text: "Bij oplevering ontvangt u een volledig documentatiepakket: as-built tekeningen, materiaalcertificaten (EN 10204 3.1 of 3.2), lasrapporten en â€” indien van toepassing â€” een CE-verklaring van prestatie (DoP) conform EN-1090-1. Zo heeft u alles wat u nodig heeft voor uw eigen dossier en eventuele keuring door derden." }
		],
		checkitems: [
			"Eigen montageploeg, VCA gecertificeerd",
			"Montage van staal, RVS en aluminium",
			"Kraanbegeleiding en veiligheidsbeheer",
			"Aansluitlassen en correcties op locatie",
			"Eindinspectie en opleverdossier"
		],
		tags: [
			"Montage",
			"VCA",
			"Oplevering",
			"CE-markering"
		]
	},
	{
		id: "reparatie",
		nr: "05",
		title: "Reparatie & Onderhoud",
		subtitle: "Snel ter plaatse â€” ook voor spoedreparaties",
		img: about_us3_default,
		excerpt: "FerroWorks voert reparaties en onderhoud uit op staalconstructies, zowel in de werkplaats als direct op uw locatie. Snel, vakkundig, conform de normen.",
		body: [
			{
				type: "intro",
				text: "Staalconstructies zijn duurzaam â€” maar niet onverwoestbaar. Door mechanische schade, corrosie, vermoeiing of onvoorziene belastingen kunnen reparaties noodzakelijk zijn. FerroWorks voert deze reparaties snel en vakkundig uit, zowel in onze eigen werkplaats als bij u op locatie."
			},
			{
				type: "h2",
				text: "Welke reparaties voeren wij uit?"
			},
			{ text: "We behandelen zowel structurele reparaties (gebroken lassen, vervormd staalwerk, scheurvorming) als oppervlaktereparaties (corrosie, beschadigde coating). Onze lassers beoordelen de schade, bepalen de oorzaak en voeren de reparatie uit conform de geldende normen." },
			{
				type: "bullets",
				items: [
					"Lasreparaties in staal, RVS en aluminium",
					"Herstel van corrosieschade en beschadigde coating",
					"Structurele versterking van bestaande constructies",
					"Vervanging van slijtdelen en beschadigde onderdelen",
					"Spoedreparaties op locatie (korte responstijd)",
					"Onderhoudscontracten op aanvraag"
				]
			},
			{
				type: "h2",
				text: "Reparatie op locatie"
			},
			{ text: "Niet alles kan naar onze werkplaats worden gebracht. Daarom beschikken we over een mobiele reparatieploeg die bij u op locatie aan de slag gaat â€” of het nu gaat om een industrieel platform, een hekwerk op een bouwplaats of een maritieme constructie. We brengen alles mee wat nodig is." },
			{
				type: "quote",
				text: "Stilstand kost geld. Wij zorgen dat uw constructie snel en veilig weer in bedrijf is."
			},
			{
				type: "h2",
				text: "Preventief onderhoud"
			},
			{ text: "Voorkomen is beter dan genezen. We bieden ook preventieve inspecties en onderhoudsprogramma's aan voor bedrijven die regelmatig staalwerk in gebruik hebben. Tijdige inspectie en coatingherstel verlengen de levensduur van uw constructies aanzienlijk en voorkomt dure onverwachte uitval." },
			{
				type: "h2",
				text: "Documentatie na reparatie"
			},
			{ text: "Na elke reparatie leveren we een kortrapport met de aard van de schade, de uitgevoerde werkzaamheden en de gebruikte materialen. Zo heeft u een volledig dossier voor uw eigen administratie en eventuele keuringsinstanties." }
		],
		checkitems: [
			"Lasreparaties in staal, RVS en aluminium",
			"Herstel van corrosieschade en coating",
			"Structurele versterking",
			"Spoedreparaties op locatie",
			"Onderhoudscontracten op aanvraag"
		],
		tags: [
			"Reparatie",
			"Onderhoud",
			"Spoed",
			"Locatie"
		]
	}
];
function DienstHero({ dienst }) {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "400px",
			display: "flex",
			alignItems: "flex-end",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${dienst.image || FALLBACK_IMAGES$1[dienst.id] || "/assets/about-us1-Fdlmxb8O.jpeg"})`,
				backgroundSize: "cover",
				backgroundPosition: "center"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(0deg, rgba(20,22,22,0.97) 0%, rgba(20,22,22,0.72) 50%, rgba(20,22,22,0.35) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingBottom: "56px",
					paddingTop: "96px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "20px",
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "var(--fw-website-primary)",
									fontSize: "12px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "12px"
								},
								children: "â€º"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/diensten",
								style: {
									color: "var(--fw-website-primary)",
									fontSize: "12px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Diensten"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#555",
									fontSize: "12px"
								},
								children: "â€º"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#888",
									fontSize: "12px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: dienst.title
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: { marginBottom: "16px" },
						children: /* @__PURE__ */ jsxs("span", {
							style: {
								background: "var(--fw-website-primary)",
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "10px",
								letterSpacing: "1.5px",
								textTransform: "uppercase",
								color: "#1c1c1c",
								padding: "5px 12px"
							},
							children: [dienst.nr, " â€” DIENST"]
						})
					}),
					/* @__PURE__ */ jsx("h1", {
						style: {
							margin: "0 0 14px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(24px, 3.5vw, 52px)",
							lineHeight: 1.08,
							letterSpacing: "-0.5px",
							textTransform: "uppercase",
							color: "#fff",
							maxWidth: "780px"
						},
						children: dienst.title.toUpperCase()
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 28px 0",
							color: "#aaa",
							fontSize: "clamp(13px, 1.4vw, 16px)",
							lineHeight: 1.6,
							maxWidth: "520px"
						},
						children: dienst.subtitle
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "var(--fw-website-primary)",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function DienstBody({ dienst, allDiensten = [] }) {
	const [ref, vis] = useInView$1(.05);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .db-wrap { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .db-on .db-wrap { opacity:1; transform:none; }
        .db-article h2 {
          font-family: "Arial Black", Arial, sans-serif;
          font-weight: 900;
          font-size: clamp(18px, 2vw, 22px);
          text-transform: uppercase;
          letter-spacing: -0.2px;
          color: #1c1c1c;
          margin: 40px 0 16px 0;
          line-height: 1.2;
        }
        .db-article p {
          color: #555;
          font-size: 15.5px;
          line-height: 1.8;
          margin: 0 0 18px 0;
        }
        .db-article .intro-p {
          font-size: 17px;
          color: #444;
          border-left: 4px solid var(--fw-website-primary);
          padding-left: 20px;
          margin-bottom: 32px;
          line-height: 1.8;
        }
        .db-article blockquote {
          background: #1c1c1c;
          border-left: 5px solid var(--fw-website-primary);
          margin: 36px 0;
          padding: 28px 32px;
          font-family: "Arial Black", Arial, sans-serif;
          font-weight: 900;
          font-size: clamp(15px, 1.6vw, 18px);
          color: #fff;
          line-height: 1.4;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -0.2px;
        }
        .db-article ul {
          margin: 8px 0 24px 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .db-article ul li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #555;
          font-size: 15px;
          line-height: 1.6;
        }
        .db-article ul li::before {
          content: "";
          display: block;
          width: 8px;
          height: 8px;
          background: var(--fw-website-primary);
          flex-shrink: 0;
          margin-top: 6px;
        }
        @media (max-width: 900px) { .db-layout { grid-template-columns: 1fr !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 db-layout " + (vis ? "db-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 320px",
				gap: "64px",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsxs("article", {
				className: "db-wrap db-article",
				children: [typeof dienst.body === "string" ? /<[^>]+>/.test(dienst.body) ? /* @__PURE__ */ jsx(RichTextContent, { html: dienst.body }) : dienst.body.split("\n\n").map((para, i) => i === 0 ? /* @__PURE__ */ jsx("p", {
					className: "intro-p",
					children: para
				}, i) : /* @__PURE__ */ jsx("p", { children: para }, i)) : (dienst.body || []).map((block, i) => {
					if (block.type === "intro") return /* @__PURE__ */ jsx("p", {
						className: "intro-p",
						children: block.text
					}, i);
					if (block.type === "h2") return /* @__PURE__ */ jsx("h2", { children: block.text }, i);
					if (block.type === "quote") return /* @__PURE__ */ jsxs("blockquote", { children: [
						"\"",
						block.text,
						"\""
					] }, i);
					if (block.type === "bullets") return /* @__PURE__ */ jsx("ul", { children: block.items.map((item, j) => /* @__PURE__ */ jsx("li", { children: item }, j)) }, i);
					return /* @__PURE__ */ jsx("p", { children: block.text }, i);
				}), dienst.tags && dienst.tags.length > 0 && /* @__PURE__ */ jsxs("div", {
					style: {
						marginTop: "48px",
						paddingTop: "32px",
						borderTop: "1.5px solid #e0e0e0"
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "11px",
							letterSpacing: "1.5px",
							textTransform: "uppercase",
							color: "#aaa",
							marginRight: "12px"
						},
						children: "Tags:"
					}), dienst.tags.map((tag, i) => /* @__PURE__ */ jsx("span", {
						style: {
							display: "inline-block",
							background: "#e8e8e8",
							color: "#555",
							fontSize: "12px",
							fontWeight: 700,
							padding: "4px 12px",
							marginRight: "8px",
							marginBottom: "8px",
							letterSpacing: "0.3px"
						},
						children: tag
					}, i))]
				})]
			}), /* @__PURE__ */ jsx(Sidebar, {
				dienst,
				allDiensten
			})]
		})]
	});
}
function Sidebar({ dienst, allDiensten = [] }) {
	const others = allDiensten.filter((d) => d.id !== dienst.id);
	return /* @__PURE__ */ jsxs("aside", {
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "32px"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "#1c1c1c",
					padding: "28px 24px"
				},
				children: [/* @__PURE__ */ jsxs("h3", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						letterSpacing: "1px",
						color: "#fff",
						margin: "0 0 20px 0"
					},
					children: ["WAT WIJ ", /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "LEVEREN"
					})]
				}), /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "10px"
					},
					children: (typeof dienst.checklist === "string" ? dienst.checklist.split("\n").filter(Boolean) : dienst.checkitems || []).map((item, i) => /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "flex-start",
							gap: "8px"
						},
						children: [/* @__PURE__ */ jsx("svg", {
							width: "16",
							height: "16",
							viewBox: "0 0 22 22",
							fill: "none",
							style: {
								flexShrink: 0,
								marginTop: "2px"
							},
							children: /* @__PURE__ */ jsx("polyline", {
								points: "3,11 9,17 20,5",
								stroke: "var(--fw-website-primary)",
								strokeWidth: "2.8",
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})
						}), /* @__PURE__ */ jsx("span", {
							style: {
								color: "#ccc",
								fontSize: "13px",
								lineHeight: 1.55
							},
							children: item
						})]
					}, i))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fff",
					padding: "24px",
					borderTop: "4px solid var(--fw-website-primary)"
				},
				children: [
					/* @__PURE__ */ jsx("h4", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							letterSpacing: "1px",
							color: "#1c1c1c",
							margin: "0 0 10px 0"
						},
						children: "OFFERTE AANVRAGEN"
					}),
					/* @__PURE__ */ jsxs("p", {
						style: {
							color: "#888",
							fontSize: "13px",
							lineHeight: 1.6,
							margin: "0 0 16px 0"
						},
						children: [
							"Interesse in ",
							dienst.title.toLowerCase(),
							"? Neem contact op â€” we reageren binnen 24 uur."
						]
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							display: "block",
							textAlign: "center",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "var(--fw-website-primary)",
							padding: "14px 20px",
							textDecoration: "none",
							transition: "background .2s",
							marginBottom: "10px"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
						onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
						children: "NEEM CONTACT OP"
					}),
					/* @__PURE__ */ jsx("a", {
						href: "tel:+31165205601",
						style: {
							display: "block",
							textAlign: "center",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#888",
							textDecoration: "none",
							fontSize: "12px",
							marginTop: "8px"
						},
						children: "+31 (0)165 205 601"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
				style: {
					fontFamily: "Arial Black, Arial, sans-serif",
					fontWeight: 900,
					fontSize: "12px",
					textTransform: "uppercase",
					letterSpacing: "1.5px",
					color: "#1c1c1c",
					margin: "0 0 20px 0",
					paddingBottom: "12px",
					borderBottom: "2px solid var(--fw-website-primary)"
				},
				children: "ANDERE DIENSTEN"
			}), /* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "4px"
				},
				children: others.map((d) => /* @__PURE__ */ jsxs(Link, {
					to: `/diensten/${d.id}`,
					style: {
						display: "flex",
						alignItems: "center",
						gap: "10px",
						padding: "10px 0",
						borderBottom: "1px solid #eee",
						textDecoration: "none"
					},
					onMouseEnter: (e) => {
						e.currentTarget.querySelector(".od-nr").style.background = "var(--fw-website-primary)";
						e.currentTarget.querySelector(".od-title").style.color = "var(--fw-website-primary)";
					},
					onMouseLeave: (e) => {
						e.currentTarget.querySelector(".od-nr").style.background = "#1c1c1c";
						e.currentTarget.querySelector(".od-title").style.color = "#1c1c1c";
					},
					children: [/* @__PURE__ */ jsx("span", {
						className: "od-nr",
						style: {
							background: "#1c1c1c",
							color: "var(--fw-website-primary)",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "10px",
							padding: "3px 7px",
							flexShrink: 0,
							transition: "background .2s"
						},
						children: d.nr
					}), /* @__PURE__ */ jsx("span", {
						className: "od-title",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12px",
							textTransform: "uppercase",
							color: "#1c1c1c",
							lineHeight: 1.3,
							transition: "color .2s"
						},
						children: d.title
					})]
				}, d.id))
			})] })
		]
	});
}
function MeerDiensten({ currentId, allDiensten }) {
	const [ref, vis] = useInView$1(.1);
	const related = allDiensten.filter((d) => d.id !== currentId).slice(0, 3);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .md-card { opacity:0; transform:translateY(24px); transition: opacity .55s ease, transform .55s ease; }
        .md-on .md-card:nth-child(1) { opacity:1; transform:none; transition-delay:.05s; }
        .md-on .md-card:nth-child(2) { opacity:1; transform:none; transition-delay:.18s; }
        .md-on .md-card:nth-child(3) { opacity:1; transform:none; transition-delay:.31s; }
        @media (max-width: 768px) { .md-grid { grid-template-columns: 1fr !important; } }
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "md-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "40px",
					flexWrap: "wrap",
					gap: "16px"
				},
				children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(18px, 2vw, 24px)",
						textTransform: "uppercase",
						letterSpacing: "-0.3px",
						margin: 0
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: { color: "#fff" },
						children: "ANDERE "
					}), /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "DIENSTEN"
					})]
				}), /* @__PURE__ */ jsxs(Link, {
					to: "/diensten",
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "12px",
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						color: "var(--fw-website-primary)",
						textDecoration: "none",
						display: "flex",
						alignItems: "center",
						gap: "6px",
						transition: "gap .2s"
					},
					onMouseEnter: (e) => e.currentTarget.style.gap = "10px",
					onMouseLeave: (e) => e.currentTarget.style.gap = "6px",
					children: ["ALLE DIENSTEN", /* @__PURE__ */ jsx("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "none",
						children: /* @__PURE__ */ jsx("path", {
							d: "M5 12h14M12 5l7 7-7 7",
							stroke: "var(--fw-website-primary)",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "md-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "24px"
				},
				children: related.map((d) => /* @__PURE__ */ jsxs(Link, {
					to: `/diensten/${d.id}`,
					className: "md-card",
					style: {
						textDecoration: "none",
						background: "#252525",
						display: "block",
						transition: "transform .25s ease, box-shadow .25s ease"
					},
					onMouseEnter: (e) => {
						e.currentTarget.style.transform = "translateY(-4px)";
						e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.3)";
					},
					onMouseLeave: (e) => {
						e.currentTarget.style.transform = "none";
						e.currentTarget.style.boxShadow = "none";
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							overflow: "hidden",
							height: "180px"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: d.image || FALLBACK_IMAGES$1[d.id] || "/assets/about-us1-Fdlmxb8O.jpeg",
							alt: d.title,
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								display: "block",
								transition: "transform .4s ease"
							},
							onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.05)",
							onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)"
						})
					}), /* @__PURE__ */ jsxs("div", {
						style: { padding: "22px 20px" },
						children: [
							/* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "10px",
									marginBottom: "10px"
								},
								children: /* @__PURE__ */ jsx("span", {
									style: {
										background: "var(--fw-website-primary)",
										fontFamily: "Arial Black, Arial, sans-serif",
										fontWeight: 900,
										fontSize: "9px",
										letterSpacing: "1px",
										textTransform: "uppercase",
										color: "#1c1c1c",
										padding: "3px 8px"
									},
									children: d.nr
								})
							}),
							/* @__PURE__ */ jsx("h3", {
								style: {
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "14px",
									textTransform: "uppercase",
									color: "#fff",
									margin: "0 0 10px 0",
									lineHeight: 1.3,
									letterSpacing: "-0.1px"
								},
								children: d.title
							}),
							/* @__PURE__ */ jsxs("p", {
								style: {
									color: "#777",
									fontSize: "12.5px",
									lineHeight: 1.6,
									margin: "0 0 14px 0"
								},
								children: [d.excerpt.substring(0, 90), "..."]
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "var(--fw-website-primary)",
									fontFamily: "Arial Black, Arial, sans-serif",
									fontWeight: 900,
									fontSize: "11px",
									textTransform: "uppercase",
									letterSpacing: "0.5px"
								},
								children: "MEER INFORMATIE â†’"
							})
						]
					})]
				}, d.id))
			})]
		})]
	});
}
function CtaStrip() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "72px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "48px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "24px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(18px, 2.2vw, 26px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 8px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["KLAAR VOOR UW ", /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "PROJECT?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#888",
						fontSize: "14px",
						margin: 0
					},
					children: "Stuur uw tekening op of bel ons direct â€” wij reageren binnen 24 uur."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "fw-cta-actions",
					style: {
						display: "flex",
						gap: "14px",
						flexWrap: "wrap"
					},
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "var(--fw-website-primary)",
							padding: "16px 32px",
							textDecoration: "none",
							display: "inline-block",
							transition: "background .2s",
							flexShrink: 0
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
						onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
						children: "NEEM CONTACT OP"
					}), /* @__PURE__ */ jsx("a", {
						href: "tel:+31165205601",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#fff",
							background: "transparent",
							border: "2px solid #555",
							padding: "14px 28px",
							textDecoration: "none",
							display: "inline-block",
							transition: "border-color .2s",
							flexShrink: 0
						},
						onMouseEnter: (e) => e.currentTarget.style.borderColor = "var(--fw-website-primary)",
						onMouseLeave: (e) => e.currentTarget.style.borderColor = "#555",
						children: "BEL ONS"
					})]
				})]
			})
		})
	});
}
function DienstDetailPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { cms } = useCms();
	const allDiensten = cms.diensten && cms.diensten.length ? cms.diensten : diensten_fallback;
	const dienst = allDiensten.find((d) => d.id === slug);
	useEffect(() => {
		if (!dienst) navigate("/diensten", { replace: true });
		else window.scrollTo({
			top: 0,
			behavior: "instant"
		});
	}, [
		id,
		dienst,
		navigate
	]);
	if (!dienst) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(DienstHero, { dienst }),
		/* @__PURE__ */ jsx(DienstBody, {
			dienst,
			allDiensten
		}),
		/* @__PURE__ */ jsx(MeerDiensten, {
			currentId: dienst.id,
			allDiensten
		}),
		/* @__PURE__ */ jsx(CtaStrip, {})
	] });
}
//#endregion
//#region src/pages/SectorenPage.jsx
var FALLBACK_IMAGES = [
	about_us1_default,
	over_ons1_default,
	over_ons2_default,
	about_us2_default,
	about_us3_default
];
function useInView(threshold = .1) {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setVis(true);
		}, { threshold });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, vis];
}
function CheckIcon() {
	return /* @__PURE__ */ jsx("svg", {
		width: "20",
		height: "20",
		viewBox: "0 0 22 22",
		fill: "none",
		style: {
			flexShrink: 0,
			marginTop: "3px"
		},
		children: /* @__PURE__ */ jsx("polyline", {
			points: "3,11 9,17 20,5",
			stroke: "var(--fw-website-primary)",
			strokeWidth: "2.8",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function PageHero() {
	return /* @__PURE__ */ jsxs("section", {
		style: {
			position: "relative",
			width: "100%",
			minHeight: "380px",
			display: "flex",
			alignItems: "center",
			overflow: "hidden",
			background: "#141616"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				backgroundImage: `url(${hero_background_default})`,
				backgroundSize: "cover",
				backgroundPosition: "center right"
			} }),
			/* @__PURE__ */ jsx("div", { style: {
				position: "absolute",
				inset: 0,
				background: "linear-gradient(90deg,rgba(20,22,22,0.94) 0%,rgba(20,22,22,0.76) 55%,rgba(20,22,22,0.4) 100%)"
			} }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
				style: {
					paddingTop: "64px",
					paddingBottom: "64px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "24px"
						},
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									color: "var(--fw-website-primary)",
									fontSize: "13px",
									textDecoration: "none",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#666",
									fontSize: "13px"
								},
								children: "â€º"
							}),
							/* @__PURE__ */ jsx("span", {
								style: {
									color: "#aaa",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Sectoren"
							})
						]
					}),
					/* @__PURE__ */ jsxs("h1", {
						style: {
							margin: "0 0 16px 0",
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px,4vw,56px)",
							lineHeight: 1.05,
							letterSpacing: "-0.5px",
							textTransform: "uppercase"
						},
						children: [/* @__PURE__ */ jsx("span", {
							style: { color: "var(--fw-website-primary)" },
							children: "STAAL, RVS & ALU "
						}), /* @__PURE__ */ jsx("span", {
							style: { color: "#fff" },
							children: "IN ELKE SECTOR"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: 0,
							color: "#bbb",
							fontSize: "clamp(14px,1.6vw,17px)",
							lineHeight: 1.6,
							maxWidth: "540px"
						},
						children: "FerroWorks levert maatwerk metaaloplossingen voor bouw, industrie, architectuur en maritieme toepassingen. Altijd vakkundig, altijd op maat."
					}),
					/* @__PURE__ */ jsx("div", { style: {
						width: "56px",
						height: "4px",
						background: "var(--fw-website-primary)",
						marginTop: "28px",
						borderRadius: "2px"
					} })
				]
			})
		]
	});
}
function IntroStrip() {
	const [ref, vis] = useInView(.15);
	const { cms } = useCms();
	const stats = cms.stats || [];
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "56px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `.is-sp{opacity:0;transform:translateY(18px);transition:opacity .5s ease,transform .5s ease}.is-sp-on .is-sp{opacity:1;transform:none}` }), /* @__PURE__ */ jsx("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 is-sp-grid " + (vis ? "is-sp-on" : ""),
			style: {
				display: "grid",
				gridTemplateColumns: `repeat(${stats.length},1fr)`,
				gap: "24px"
			},
			children: stats.map((item, i) => /* @__PURE__ */ jsxs("div", {
				className: "is-sp",
				style: {
					borderLeft: "3px solid var(--fw-website-primary)",
					paddingLeft: "20px",
					transitionDelay: `${i * .1}s`
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "clamp(28px,3vw,40px)",
							color: "var(--fw-website-primary)",
							lineHeight: 1,
							letterSpacing: "-0.5px"
						},
						children: item.number
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							color: "#fff",
							textTransform: "uppercase",
							letterSpacing: "0.3px",
							marginTop: "6px"
						},
						children: item.desc.split(" ").slice(0, 2).join(" ")
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "12px",
							color: "#888",
							marginTop: "4px",
							lineHeight: 1.4
						},
						children: item.desc
					})
				]
			}, i))
		})]
	});
}
function SectorBlock({ sector, index }) {
	const [ref, vis] = useInView();
	const isEven = index % 2 === 0;
	const bg = isEven ? "#f4f4f4" : "#fff";
	const img = sector.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
	const checkItems = sector.items ? sector.items.split("\n").filter(Boolean) : [];
	const textBlock = /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("span", {
			style: {
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "11px",
				color: "var(--fw-website-primary)",
				textTransform: "uppercase",
				letterSpacing: "1.5px"
			},
			children: [sector.nr, " â€” SECTOR"]
		}),
		/* @__PURE__ */ jsx("h2", {
			style: {
				margin: "12px 0 16px 0",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "clamp(22px,2.6vw,36px)",
				textTransform: "uppercase",
				lineHeight: 1.1,
				letterSpacing: "-0.3px",
				color: "#1c1c1c"
			},
			children: sector.naam
		}),
		sector.intro && /<[^>]+>/.test(sector.intro) ? /* @__PURE__ */ jsx(RichTextContent, {
			html: sector.intro,
			style: {
				color: "#666",
				fontSize: "15px",
				lineHeight: 1.7,
				margin: "0 0 28px 0"
			}
		}) : /* @__PURE__ */ jsx("p", {
			style: {
				color: "#666",
				fontSize: "15px",
				lineHeight: 1.7,
				margin: "0 0 28px 0"
			},
			children: sector.intro || sector.tagline
		}),
		/* @__PURE__ */ jsx("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: "11px",
				marginBottom: "32px"
			},
			children: checkItems.map((item, i) => /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "flex-start",
					gap: "10px"
				},
				children: [/* @__PURE__ */ jsx(CheckIcon, {}), /* @__PURE__ */ jsx("span", {
					style: {
						color: "#555",
						fontSize: "14.5px",
						lineHeight: 1.6
					},
					children: item
				})]
			}, i))
		}),
		/* @__PURE__ */ jsxs(Link, {
			to: "/contact",
			style: {
				display: "inline-flex",
				alignItems: "center",
				gap: "8px",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontWeight: 900,
				fontSize: "13px",
				textTransform: "uppercase",
				letterSpacing: "0.5px",
				color: "#1c1c1c",
				background: "var(--fw-website-primary)",
				padding: "14px 28px",
				textDecoration: "none"
			},
			onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
			onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
			children: ["OFFERTE AANVRAGEN", /* @__PURE__ */ jsx("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 24 24",
				fill: "none",
				children: /* @__PURE__ */ jsx("path", {
					d: "M5 12h14M12 5l7 7-7 7",
					stroke: "#1c1c1c",
					strokeWidth: "2.5",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			})]
		})
	] });
	const imageBlock = /* @__PURE__ */ jsxs("div", {
		style: { position: "relative" },
		children: [/* @__PURE__ */ jsx("div", {
			className: "sector-accent",
			style: {
				position: "absolute",
				...isEven ? {
					top: "-16px",
					right: "-16px"
				} : {
					bottom: "-16px",
					left: "-16px"
				},
				width: "72px",
				height: "72px",
				background: "var(--fw-website-primary)",
				zIndex: 0
			}
		}), /* @__PURE__ */ jsx("div", {
			style: {
				position: "relative",
				zIndex: 1,
				overflow: "hidden",
				boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
			},
			children: /* @__PURE__ */ jsx("img", {
				className: "sector-image",
				src: img,
				alt: sector.naam,
				style: {
					width: "100%",
					height: "400px",
					objectFit: "cover",
					objectPosition: "center",
					display: "block"
				}
			})
		})]
	});
	return /* @__PURE__ */ jsxs("section", {
		id: sector.id,
		style: {
			background: bg,
			padding: "88px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `
        .sb${index}-l{opacity:0;transform:translateX(-36px);transition:opacity .65s ease,transform .65s ease}
        .sb${index}-r{opacity:0;transform:translateX(36px);transition:opacity .65s .15s ease,transform .65s .15s ease}
        .sb${index}-on .sb${index}-l,.sb${index}-on .sb${index}-r{opacity:1;transform:none}
        @media(max-width:768px){.sb${index}-g{grid-template-columns:1fr!important}}
      ` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: `max-w-7xl mx-auto px-6 md:px-8 fw-sector-grid sb${index}-g` + (vis ? ` sb${index}-on` : ""),
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "80px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: `sb${index}-l`,
				children: isEven ? textBlock : imageBlock
			}), /* @__PURE__ */ jsx("div", {
				className: `sb${index}-r`,
				children: isEven ? imageBlock : textBlock
			})]
		})]
	});
}
function DienstenBanner() {
	const [ref, vis] = useInView(.15);
	return /* @__PURE__ */ jsxs("section", {
		style: {
			background: "#1c1c1c",
			padding: "72px 0"
		},
		children: [/* @__PURE__ */ jsx("style", { children: `.db-card{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}.db-on .db-card{opacity:1;transform:none}` }), /* @__PURE__ */ jsxs("div", {
			ref,
			className: "max-w-7xl mx-auto px-6 md:px-8 " + (vis ? "db-on" : ""),
			children: [/* @__PURE__ */ jsxs("div", {
				style: { marginBottom: "40px" },
				children: [/* @__PURE__ */ jsx("p", {
					style: {
						margin: "0 0 10px 0",
						color: "var(--fw-website-primary)",
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "11px",
						letterSpacing: "2px",
						textTransform: "uppercase"
					},
					children: "OOK INTERESSANT"
				}), /* @__PURE__ */ jsxs("h2", {
					style: {
						margin: 0,
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(22px,2.6vw,34px)",
						textTransform: "uppercase",
						color: "#fff",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["ONZE ", /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "DIENSTEN"
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "fw-five-col-grid",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(5,1fr)",
					gap: "16px"
				},
				children: [
					{
						title: "Engineering & Ontwerp",
						to: "/diensten/engineering"
					},
					{
						title: "Productie in eigen beheer",
						to: "/diensten/productie"
					},
					{
						title: "Coating & Afwerking",
						to: "/diensten/coating"
					},
					{
						title: "Montage op locatie",
						to: "/diensten/montage"
					},
					{
						title: "Reparatie & Onderhoud",
						to: "/diensten/reparatie"
					}
				].map((item, i) => /* @__PURE__ */ jsxs(Link, {
					to: item.to,
					className: "db-card",
					style: {
						background: "#252525",
						padding: "24px 20px",
						display: "block",
						textDecoration: "none",
						borderTop: "3px solid var(--fw-website-primary)",
						transitionDelay: `${i * .08}s`
					},
					onMouseEnter: (e) => e.currentTarget.style.background = "#2e2e2e",
					onMouseLeave: (e) => e.currentTarget.style.background = "#252525",
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "12.5px",
							textTransform: "uppercase",
							color: "#fff",
							lineHeight: 1.3
						},
						children: item.title
					}), /* @__PURE__ */ jsx("div", {
						style: {
							marginTop: "10px",
							color: "var(--fw-website-primary)",
							fontSize: "12px"
						},
						children: "â†’ Meer info"
					})]
				}, i))
			})]
		})]
	});
}
function CtaSection() {
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "#f4f4f4",
			padding: "80px 0"
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-6 md:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "fw-cta-box",
				style: {
					background: "#1c1c1c",
					padding: "56px 48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "28px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					style: {
						fontFamily: "Arial Black, Arial, sans-serif",
						fontWeight: 900,
						fontSize: "clamp(20px,2.4vw,30px)",
						textTransform: "uppercase",
						color: "#fff",
						margin: "0 0 10px 0",
						lineHeight: 1.1,
						letterSpacing: "-0.3px"
					},
					children: ["KLAAR OM ", /* @__PURE__ */ jsx("span", {
						style: { color: "var(--fw-website-primary)" },
						children: "TE STARTEN?"
					})]
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#999",
						fontSize: "15px",
						margin: 0,
						lineHeight: 1.5
					},
					children: "Stuur uw tekening op of neem contact op â€” wij reageren binnen 24 uur."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "fw-cta-actions",
					style: {
						display: "flex",
						gap: "16px",
						flexWrap: "wrap"
					},
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/contact",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#1c1c1c",
							background: "var(--fw-website-primary)",
							padding: "16px 32px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "var(--fw-website-primary-strong)",
						onMouseLeave: (e) => e.currentTarget.style.background = "var(--fw-website-primary)",
						children: "OFFERTE AANVRAGEN"
					}), /* @__PURE__ */ jsx("a", {
						href: "tel:+31165205617",
						style: {
							fontFamily: "Arial Black, Arial, sans-serif",
							fontWeight: 900,
							fontSize: "13px",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							color: "#fff",
							background: "transparent",
							border: "2px solid #555",
							padding: "14px 28px",
							textDecoration: "none",
							display: "inline-block"
						},
						onMouseEnter: (e) => e.currentTarget.style.borderColor = "var(--fw-website-primary)",
						onMouseLeave: (e) => e.currentTarget.style.borderColor = "#555",
						children: "BEL ONS"
					})]
				})]
			})
		})
	});
}
function SectorenPage() {
	const { cms } = useCms();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHero, {}),
		/* @__PURE__ */ jsx(IntroStrip, {}),
		(cms.sectoren || []).map((sector, i) => /* @__PURE__ */ jsx(SectorBlock, {
			sector,
			index: i
		}, sector.id)),
		/* @__PURE__ */ jsx(DienstenBanner, {}),
		/* @__PURE__ */ jsx(CtaSection, {})
	] });
}
//#endregion
//#region src/pages/ManagedContentPage.jsx
function ManagedContentPage() {
	const { cms } = useCms();
	const location = useLocation();
	const page = (cms.pages || []).find((item) => item.path === location.pathname);
	if (!page) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("section", {
			style: {
				position: "relative",
				width: "100%",
				minHeight: "320px",
				display: "flex",
				alignItems: "center",
				overflow: "hidden",
				background: "#141616"
			},
			children: [
				/* @__PURE__ */ jsx("div", { style: {
					position: "absolute",
					inset: 0,
					backgroundImage: `url(${hero_background_default})`,
					backgroundSize: "cover",
					backgroundPosition: "center right"
				} }),
				/* @__PURE__ */ jsx("div", { style: {
					position: "absolute",
					inset: 0,
					background: "linear-gradient(90deg, rgba(20,22,22,0.93) 0%, rgba(20,22,22,0.75) 55%, rgba(20,22,22,0.4) 100%)"
				} }),
				/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8",
					style: {
						paddingTop: "64px",
						paddingBottom: "64px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "8px",
								marginBottom: "24px"
							},
							children: [
								/* @__PURE__ */ jsx(Link, {
									to: "/",
									style: {
										color: "var(--fw-website-primary)",
										fontSize: "13px",
										textDecoration: "none",
										fontWeight: 700,
										letterSpacing: "0.5px",
										textTransform: "uppercase"
									},
									children: "Home"
								}),
								/* @__PURE__ */ jsx("span", {
									style: {
										color: "#666",
										fontSize: "13px"
									},
									children: "â€º"
								}),
								/* @__PURE__ */ jsx("span", {
									style: {
										color: "#aaa",
										fontSize: "13px",
										fontWeight: 700,
										letterSpacing: "0.5px",
										textTransform: "uppercase"
									},
									children: page.name
								})
							]
						}),
						/* @__PURE__ */ jsx("h1", {
							style: {
								margin: "0 0 16px 0",
								fontFamily: "Arial Black, Arial, sans-serif",
								fontWeight: 900,
								fontSize: "clamp(28px, 4vw, 56px)",
								lineHeight: 1.05,
								letterSpacing: "-0.5px",
								textTransform: "uppercase"
							},
							children: /* @__PURE__ */ jsx("span", {
								style: { color: "var(--fw-website-primary)" },
								children: page.heroTitle || page.name
							})
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								margin: 0,
								color: "#bbb",
								fontSize: "clamp(14px, 1.6vw, 17px)",
								lineHeight: 1.6,
								maxWidth: "680px"
							},
							children: page.heroSubtitle || page.metaDescription
						})
					]
				})
			]
		}),
		/* @__PURE__ */ jsx("section", {
			style: {
				background: "#f4f4f4",
				padding: "80px 0"
			},
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-5xl mx-auto px-6 md:px-8",
				children: /* @__PURE__ */ jsx("div", {
					style: {
						background: "#fff",
						padding: "48px",
						boxShadow: "0 10px 35px rgba(0,0,0,0.05)"
					},
					children: /* @__PURE__ */ jsx(RichTextContent, {
						html: page.body || "<p>Geen inhoud ingesteld.</p>",
						className: "managed-content-page"
					})
				})
			})
		}),
		/* @__PURE__ */ jsx("style", { children: `
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
      ` })
	] });
}
//#endregion
//#region src/seo/RouteSeo.jsx
function upsertMeta(name, value, property = false) {
	if (!value) return;
	const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
	let element = document.head.querySelector(selector);
	if (!element) {
		element = document.createElement("meta");
		if (property) element.setAttribute("property", name);
		else element.setAttribute("name", name);
		document.head.appendChild(element);
	}
	element.setAttribute("content", value);
}
function upsertCanonical(href) {
	let link = document.head.querySelector("link[rel=\"canonical\"]");
	if (!link) {
		link = document.createElement("link");
		link.setAttribute("rel", "canonical");
		document.head.appendChild(link);
	}
	link.setAttribute("href", href);
}
function RouteSeo() {
	const { cms } = useCms();
	const location = useLocation();
	const site = cms.site || {};
	const path = location.pathname;
	useEffect(() => {
		const origin = window.location.origin;
		const pageConfig = (cms.pages || []).find((item) => item.path === path);
		let title = site.metaTitle || site.naam || "FerroWorks";
		let description = site.metaDesc || "";
		if (pageConfig?.metaTitle) {
			title = pageConfig.metaTitle;
			description = pageConfig.metaDescription || description;
		} else if (path === "/over-ons") {
			title = `Over Ons | ${site.naam || "FerroWorks"}`;
			description = cms.overOns?.verhaal?.tekst1 || description;
		} else if (path === "/diensten") {
			title = `Diensten | ${site.naam || "FerroWorks"}`;
			description = "Engineering, productie, coating, montage en onderhoud voor maatwerk metaalprojecten.";
		} else if (path.startsWith("/diensten/")) {
			const slug = path.split("/").pop();
			const service = (cms.diensten || []).find((item) => item.id === slug);
			title = service?.seoTitle || `${service?.title || "Dienst"} | ${site.naam || "FerroWorks"}`;
			description = service?.seoDescription || service?.excerpt || description;
		} else if (path === "/sectoren") {
			title = `Sectoren | ${site.naam || "FerroWorks"}`;
			description = "Metaalmaatwerk voor bouw, industrie, architectuur en maritieme toepassingen.";
		} else if (path === "/blog") {
			title = `Blog | ${site.naam || "FerroWorks"}`;
			description = "Kennisartikelen, projectverhalen en technische inzichten van FerroWorks.";
		} else if (path.startsWith("/blog/")) {
			const slug = path.split("/").pop();
			const post = (cms.blog || []).find((item) => item.slug === slug || String(item.id) === slug);
			title = post?.seoTitle || `${post?.title || "Artikel"} | ${site.naam || "FerroWorks"}`;
			description = post?.seoDescription || post?.excerpt || description;
		}
		document.title = title;
		upsertMeta("description", description);
		upsertMeta("og:title", title, true);
		upsertMeta("og:description", description, true);
		upsertMeta("og:url", `${origin}${path}`, true);
		upsertCanonical(`${origin}${path}`);
		const website = cms.websiteSettings || {};
		if (website.googleAnalyticsId && typeof window.gtag === "function") window.gtag("config", website.googleAnalyticsId, {
			page_path: path,
			page_location: `${origin}${path}`
		});
		if (website.metaPixelId && typeof window.fbq === "function") window.fbq("track", "PageView");
	}, [
		cms,
		path,
		site.metaDesc,
		site.metaTitle,
		site.naam
	]);
	return null;
}
//#endregion
//#region src/theme/ThemeStyles.jsx
function normalizeHex(hex, fallback) {
	const value = String(hex || "").trim();
	if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return fallback;
	if (value.length === 4) return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toLowerCase();
	return value.toLowerCase();
}
function hexToRgb(hex) {
	const safe = normalizeHex(hex, "#000000").slice(1);
	return {
		r: Number.parseInt(safe.slice(0, 2), 16),
		g: Number.parseInt(safe.slice(2, 4), 16),
		b: Number.parseInt(safe.slice(4, 6), 16)
	};
}
function rgbToHex({ r, g, b }) {
	const toHex = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function mix(hexA, hexB, weight = .5) {
	const a = hexToRgb(hexA);
	const b = hexToRgb(hexB);
	return rgbToHex({
		r: a.r + (b.r - a.r) * weight,
		g: a.g + (b.g - a.g) * weight,
		b: a.b + (b.b - a.b) * weight
	});
}
function withAlpha(hex, alpha) {
	const { r, g, b } = hexToRgb(hex);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function ThemeStyles() {
	const location = useLocation();
	const { cms } = useCms();
	const theme = {
		...DEFAULT_THEME_SETTINGS,
		...cms.websiteSettings?.theme || {}
	};
	const dashboardFont = getFontOption(theme.dashboardFont);
	const websiteFont = getFontOption(theme.websiteFont);
	const isAdmin = location.pathname.startsWith("/admin");
	const dashboardPrimary = normalizeHex(theme.dashboardPrimaryColor, DEFAULT_THEME_SETTINGS.dashboardPrimaryColor);
	const dashboardSecondary = normalizeHex(theme.dashboardSecondaryColor, DEFAULT_THEME_SETTINGS.dashboardSecondaryColor);
	const websitePrimary = normalizeHex(theme.websitePrimaryColor, DEFAULT_THEME_SETTINGS.websitePrimaryColor);
	const websiteSecondary = normalizeHex(theme.websiteSecondaryColor, DEFAULT_THEME_SETTINGS.websiteSecondaryColor);
	const palette = {
		dashboardPrimaryStrong: mix(dashboardPrimary, "#000000", .18),
		dashboardPrimarySoft: mix(dashboardPrimary, "#ffffff", .82),
		dashboardPrimaryMuted: mix(dashboardPrimary, "#ffffff", .65),
		websitePrimaryStrong: mix(websitePrimary, "#000000", .18),
		websitePrimarySoft: mix(websitePrimary, "#ffffff", .84),
		websitePrimaryMuted: mix(websitePrimary, "#ffffff", .68),
		websitePrimaryDeep: mix(websitePrimary, websiteSecondary, .28)
	};
	useEffect(() => {
		if (typeof document === "undefined") return;
		document.body.dataset.adminRoute = isAdmin ? "true" : "false";
	}, [isAdmin]);
	return /* @__PURE__ */ jsx("style", { children: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Montserrat:wght@400;600;700;800;900&family=Oswald:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800;900&family=Poppins:wght@400;600;700;800;900&family=Source+Sans+3:wght@400;600;700;800&display=swap');

      :root {
        --fw-dashboard-heading-font: ${dashboardFont.stack};
        --fw-dashboard-body-font: ${dashboardFont.bodyStack};
        --fw-dashboard-primary: ${dashboardPrimary};
        --fw-dashboard-primary-strong: ${palette.dashboardPrimaryStrong};
        --fw-dashboard-primary-soft: ${palette.dashboardPrimarySoft};
        --fw-dashboard-primary-muted: ${palette.dashboardPrimaryMuted};
        --fw-dashboard-primary-rgb-soft: ${withAlpha(dashboardPrimary, .12)};
        --fw-dashboard-secondary: ${dashboardSecondary};
        --fw-website-heading-font: ${websiteFont.stack};
        --fw-website-body-font: ${websiteFont.bodyStack};
        --fw-website-primary: ${websitePrimary};
        --fw-website-primary-strong: ${palette.websitePrimaryStrong};
        --fw-website-primary-soft: ${palette.websitePrimarySoft};
        --fw-website-primary-muted: ${palette.websitePrimaryMuted};
        --fw-website-primary-deep: ${palette.websitePrimaryDeep};
        --fw-website-primary-rgb-soft: ${withAlpha(websitePrimary, .12)};
        --fw-website-secondary: ${websiteSecondary};
      }

      body[data-admin-route="true"] {
        font-family: var(--fw-dashboard-body-font);
      }

      body[data-admin-route="true"] h1,
      body[data-admin-route="true"] h2,
      body[data-admin-route="true"] h3,
      body[data-admin-route="true"] h4,
      body[data-admin-route="true"] button,
      body[data-admin-route="true"] label {
        font-family: var(--fw-dashboard-heading-font) !important;
      }

      body[data-admin-route="false"] {
        font-family: var(--fw-website-body-font);
      }

      body[data-admin-route="false"] h1,
      body[data-admin-route="false"] h2,
      body[data-admin-route="false"] h3,
      body[data-admin-route="false"] h4,
      body[data-admin-route="false"] h5,
      body[data-admin-route="false"] h6,
      body[data-admin-route="false"] .site-title,
      body[data-admin-route="false"] .site-heading {
        font-family: var(--fw-website-heading-font) !important;
      }

      body[data-admin-route="false"] a:not(.no-theme-link) {
        transition: color .2s ease, border-color .2s ease, background-color .2s ease;
      }

      body[data-admin-route="false"] .theme-primary-text {
        color: var(--fw-website-primary) !important;
      }

      body[data-admin-route="false"] .theme-primary-bg {
        background: var(--fw-website-primary) !important;
        background-color: var(--fw-website-primary) !important;
      }

      body[data-admin-route="false"] .theme-primary-bg-strong {
        background: var(--fw-website-primary-strong) !important;
        background-color: var(--fw-website-primary-strong) !important;
      }

      body[data-admin-route="false"] .theme-primary-bg-soft {
        background: var(--fw-website-primary-soft) !important;
        background-color: var(--fw-website-primary-soft) !important;
      }

      body[data-admin-route="false"] .theme-primary-border {
        border-color: var(--fw-website-primary) !important;
      }

      body[data-admin-route="false"] .theme-primary-border-strong {
        border-color: var(--fw-website-primary-strong) !important;
      }

      body[data-admin-route="false"] .theme-secondary-bg {
        background: var(--fw-website-secondary) !important;
        background-color: var(--fw-website-secondary) !important;
      }

      body[data-admin-route="false"] .theme-secondary-text {
        color: var(--fw-website-secondary) !important;
      }
    ` });
}
//#endregion
//#region src/App.jsx
var AdminPage = lazy(() => import("./assets/admin-B18FhdYm.js").then((n) => n.t));
function AdminRoute() {
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: /* @__PURE__ */ jsx("div", {
			style: {
				minHeight: "100vh",
				display: "grid",
				placeItems: "center",
				background: "#141616",
				color: "#fff",
				fontFamily: "Arial Black, Arial, sans-serif",
				fontSize: "14px",
				textTransform: "uppercase",
				letterSpacing: "0.5px"
			},
			children: "Admin laden..."
		}),
		children: /* @__PURE__ */ jsx(AdminPage, {})
	});
}
function HomePage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(HeroBanner, {}),
		/* @__PURE__ */ jsx(WatFernaSection, {}),
		/* @__PURE__ */ jsx(ClientLogosSection, {}),
		/* @__PURE__ */ jsx(WatOnsAndersMaakt, {}),
		/* @__PURE__ */ jsx(StatsSection, {}),
		/* @__PURE__ */ jsx(OnzeSectoren, {}),
		/* @__PURE__ */ jsx(ProjectenSlider, {}),
		/* @__PURE__ */ jsx(UwProjectSection, {}),
		/* @__PURE__ */ jsx(FaqSection, {})
	] });
}
function PublicLayout() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(RouteSeo, {}),
		/* @__PURE__ */ jsx(Navbar, {}),
		/* @__PURE__ */ jsx(Outlet, {}),
		/* @__PURE__ */ jsx(Footer, {})
	] });
}
function AppSkeleton() {
	const isAdmin = useLocation().pathname.startsWith("/admin");
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("style", { children: `
        @keyframes fw-skeleton-pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      ` }), /* @__PURE__ */ jsx("div", {
		style: {
			minHeight: "100vh",
			background: isAdmin ? "#f2f3f5" : "#ffffff",
			animation: "fw-skeleton-pulse 1.6s ease-in-out infinite"
		},
		children: isAdmin ? /* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				minHeight: "100vh"
			},
			children: [/* @__PURE__ */ jsx("div", { style: {
				width: "240px",
				background: "#141616"
			} }), /* @__PURE__ */ jsxs("div", {
				style: { flex: 1 },
				children: [/* @__PURE__ */ jsx("div", { style: {
					height: "72px",
					background: "#ffffff",
					borderBottom: "1px solid #ebebeb"
				} }), /* @__PURE__ */ jsxs("div", {
					style: { padding: "28px 32px" },
					children: [
						/* @__PURE__ */ jsx("div", { style: {
							height: "22px",
							width: "220px",
							background: "#e5e7eb",
							borderRadius: "8px",
							marginBottom: "12px"
						} }),
						/* @__PURE__ */ jsx("div", { style: {
							height: "12px",
							width: "380px",
							background: "#eceef1",
							borderRadius: "999px",
							marginBottom: "28px"
						} }),
						/* @__PURE__ */ jsx("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
								gap: "18px",
								marginBottom: "24px"
							},
							children: Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ jsx("div", { style: {
								height: "108px",
								background: "#ffffff",
								borderRadius: "10px",
								boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
							} }, index))
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "minmax(0, 1fr) 320px",
								gap: "20px"
							},
							children: [/* @__PURE__ */ jsx("div", { style: {
								height: "320px",
								background: "#ffffff",
								borderRadius: "10px",
								boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
							} }), /* @__PURE__ */ jsx("div", { style: {
								height: "320px",
								background: "#ffffff",
								borderRadius: "10px",
								boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
							} })]
						})
					]
				})]
			})]
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx("div", { style: {
				height: "78px",
				borderBottom: "1px solid #f1f1f1",
				background: "#ffffff"
			} }),
			/* @__PURE__ */ jsx("div", {
				style: {
					background: "#141616",
					padding: "80px 24px"
				},
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						maxWidth: "1200px",
						margin: "0 auto"
					},
					children: [
						/* @__PURE__ */ jsx("div", { style: {
							height: "56px",
							width: "48%",
							background: "rgba(255,255,255,0.10)",
							borderRadius: "10px",
							marginBottom: "14px"
						} }),
						/* @__PURE__ */ jsx("div", { style: {
							height: "56px",
							width: "42%",
							background: "rgba(255,255,255,0.08)",
							borderRadius: "10px",
							marginBottom: "28px"
						} }),
						/* @__PURE__ */ jsx("div", { style: {
							height: "16px",
							width: "54%",
							background: "rgba(255,255,255,0.10)",
							borderRadius: "999px",
							marginBottom: "12px"
						} }),
						/* @__PURE__ */ jsx("div", { style: {
							height: "16px",
							width: "46%",
							background: "rgba(255,255,255,0.08)",
							borderRadius: "999px",
							marginBottom: "36px"
						} }),
						/* @__PURE__ */ jsx("div", { style: {
							height: "48px",
							width: "220px",
							background: "rgba(255,255,255,0.10)",
							borderRadius: "999px"
						} })
					]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					maxWidth: "1200px",
					margin: "0 auto",
					padding: "48px 24px"
				},
				children: /* @__PURE__ */ jsx("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
						gap: "24px"
					},
					children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ jsx("div", { style: {
						height: "220px",
						background: "#f5f5f5",
						borderRadius: "12px"
					} }, index))
				})
			})
		] })
	})] });
}
function AppContent() {
	const { loading } = useCms();
	if (loading) return /* @__PURE__ */ jsx(AppSkeleton, {});
	return /* @__PURE__ */ jsx(AppRoutes, {});
}
function AppRoutes() {
	return /* @__PURE__ */ jsxs(Routes, { children: [/* @__PURE__ */ jsxs(Route, {
		element: /* @__PURE__ */ jsx(PublicLayout, {}),
		children: [
			/* @__PURE__ */ jsx(Route, {
				path: "/",
				element: /* @__PURE__ */ jsx(HomePage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/over-ons",
				element: /* @__PURE__ */ jsx(OverOnsPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/diensten",
				element: /* @__PURE__ */ jsx(DienstenPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/diensten/:slug",
				element: /* @__PURE__ */ jsx(DienstDetailPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/sectoren",
				element: /* @__PURE__ */ jsx(SectorenPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/blog",
				element: /* @__PURE__ */ jsx(BlogPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/blog/:slug",
				element: /* @__PURE__ */ jsx(BlogDetailPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/contact",
				element: /* @__PURE__ */ jsx(ContactPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/privacy-policy",
				element: /* @__PURE__ */ jsx(ManagedContentPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/algemene-voorwaarden",
				element: /* @__PURE__ */ jsx(ManagedContentPage, {})
			})
		]
	}), /* @__PURE__ */ jsx(Route, {
		path: "/admin/*",
		element: /* @__PURE__ */ jsx(AdminRoute, {})
	})] });
}
function App({ RouterComponent = BrowserRouter, routerProps = {}, initialCms = null }) {
	return /* @__PURE__ */ jsx(CmsProvider, {
		initialCms,
		children: /* @__PURE__ */ jsxs(RouterComponent, {
			...routerProps,
			children: [/* @__PURE__ */ jsx(ThemeStyles, {}), /* @__PURE__ */ jsx(AppContent, {})]
		})
	});
}
//#endregion
//#region src/entry-server.jsx
function render(url, cms) {
	return { html: renderToString(/* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(App, {
		RouterComponent: StaticRouter,
		routerProps: { location: url },
		initialCms: cms
	}) }) })) };
}
//#endregion
export { render };
