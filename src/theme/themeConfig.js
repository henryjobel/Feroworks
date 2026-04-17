export const FONT_OPTIONS = [
  { value: "default", label: "Default", stack: '"Arial Black", Arial, sans-serif', bodyStack: 'system-ui, -apple-system, sans-serif' },
  { value: "inter", label: "Inter", stack: '"Inter", "Segoe UI", Arial, sans-serif', bodyStack: '"Inter", "Segoe UI", Arial, sans-serif' },
  { value: "poppins", label: "Poppins", stack: '"Poppins", "Segoe UI", Arial, sans-serif', bodyStack: '"Poppins", "Segoe UI", Arial, sans-serif' },
  { value: "montserrat", label: "Montserrat", stack: '"Montserrat", "Segoe UI", Arial, sans-serif', bodyStack: '"Montserrat", "Segoe UI", Arial, sans-serif' },
  { value: "oswald", label: "Oswald", stack: '"Oswald", "Arial Narrow", sans-serif', bodyStack: '"Inter", "Segoe UI", Arial, sans-serif' },
  { value: "playfair", label: "Playfair Display", stack: '"Playfair Display", Georgia, serif', bodyStack: '"Source Sans 3", "Segoe UI", Arial, sans-serif' },
];

export const DEFAULT_THEME_SETTINGS = {
  dashboardFont: "default",
  websiteFont: "default",
  dashboardPrimaryColor: "#c8d400",
  dashboardSecondaryColor: "#1c1c1c",
  websitePrimaryColor: "#c8d400",
  websiteSecondaryColor: "#1c1c1c",
};

export function getFontOption(value) {
  return FONT_OPTIONS.find((item) => item.value === value) || FONT_OPTIONS[0];
}

