
// ── Types ──────────────────────────────────────────────────────────

export type Device = "desktop" | "mobile";
export type ResultType = "organic" | "rich-review" | "rich-faq" | "rich-recipe" | "rich-video" | "rich-event" | "rich-product";

export interface SerpData {
  // Core
  title: string;
  description: string;
  url: string;
  // Display URL
  breadcrumb: string;   // "example.com › blog › post"
  // Rich results
  resultType: ResultType;
  // Review / Rating
  ratingValue: string;
  ratingCount: string;
  // Recipe
  cookTime: string;
  calories: string;
  recipeYield: string;
  // FAQ
  faqItems: { q: string; a: string }[];
  // Video
  videoDuration: string;
  videoDate: string;
  // Event
  eventDate: string;
  eventLocation: string;
  // Product
  productPrice: string;
  productCurrency: string;
  productAvail: string;
  // Sitelinks
  showSitelinks: boolean;
  sitelinks: { label: string; url: string }[];
  // Date
  showDate: boolean;
  publishDate: string;
  // Favicon
  faviconUrl: string;
  // Search term to highlight
  searchQuery: string;
}

export const DEFAULTS: SerpData = {
  title: "",
  description: "",
  url: "",
  breadcrumb: "",
  resultType: "organic",
  ratingValue: "4.5",
  ratingCount: "128",
  cookTime: "30 min",
  calories: "320 cal",
  recipeYield: "4 servings",
  faqItems: [{ q: "", a: "" }, { q: "", a: "" }],
  videoDuration: "5:30",
  videoDate: "",
  eventDate: "",
  eventLocation: "",
  productPrice: "",
  productCurrency: "USD",
  productAvail: "InStock",
  showSitelinks: false,
  sitelinks: [
    { label: "About", url: "/about" },
    { label: "Products", url: "/products" },
    { label: "Blog", url: "/blog" },
    { label: "Contact", url: "/contact" },
  ],
  showDate: false,
  publishDate: "",
  faviconUrl: "",
  searchQuery: "",
};

// ── Helpers ────────────────────────────────────────────────────────

export const TITLE_MAX = 60;
export const TITLE_WARN = 55;
export const DESC_MAX = 160;
export const DESC_WARN = 150;

export function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function getCharColor(len: number, warn: number, max: number) {
  if (len === 0) return "text-muted-foreground/40";
  if (len < warn) return "text-emerald-500";
  if (len <= max) return "text-amber-500";
  return "text-red-500";
}

export function getBarColor(len: number, warn: number, max: number) {
  if (len === 0) return "bg-border";
  if (len < warn) return "bg-emerald-500";
  if (len <= max) return "bg-amber-400";
  return "bg-red-500";
}

// Parse display URL
export function parseDisplayUrl(url: string, breadcrumb: string): { host: string; path: string } {
  if (breadcrumb) return { host: breadcrumb.split(" › ")[0] ?? "", path: breadcrumb };
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = u.hostname.replace("www.", "");
    const path = u.pathname === "/" ? host : `${host} › ${u.pathname.split("/").filter(Boolean).join(" › ")}`;
    return { host, path };
  } catch {
    return { host: url, path: url };
  }
}