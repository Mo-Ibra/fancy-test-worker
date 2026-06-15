// ── Types ──────────────────────────────────────────────────────────

export type ActiveTab = "basic" | "og" | "twitter" | "advanced";

export interface MetaConfig {
  // Basic
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonical: string;
  robots: string;
  viewport: string;
  charset: string;
  language: string;
  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  ogLocale: string;
  // Twitter Card
  twitterCard: string;
  twitterTitle: string;
  twitterDesc: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
  // Advanced
  themeColor: string;
  noindex: boolean;
  nofollow: boolean;
  noarchive: boolean;
  nosnippet: boolean;
}

export const DEFAULTS: MetaConfig = {
  title: "", description: "", keywords: "", author: "",
  canonical: "", robots: "index, follow", viewport: "width=device-width, initial-scale=1",
  charset: "UTF-8", language: "en",
  ogTitle: "", ogDescription: "", ogImage: "", ogUrl: "", ogType: "website",
  ogSiteName: "", ogLocale: "en_US",
  twitterCard: "summary_large_image", twitterTitle: "", twitterDesc: "",
  twitterImage: "", twitterSite: "", twitterCreator: "",
  themeColor: "#ffffff", noindex: false, nofollow: false, noarchive: false, nosnippet: false,
};

// ── Helpers ────────────────────────────────────────────────────────

export function getCharColor(len: number, min: number, max: number, warn: number): string {
  if (len === 0) return "text-muted-foreground/40";
  if (len < min) return "text-amber-500";
  if (len <= max) return "text-emerald-500";
  if (len <= warn) return "text-amber-500";
  return "text-red-500";
}

export function getCharBg(len: number, min: number, max: number): string {
  if (len === 0) return "bg-border";
  if (len < min) return "bg-amber-400";
  if (len <= max) return "bg-emerald-500";
  return "bg-red-500";
}

// ── Generate meta tags ─────────────────────────────────────────────

export function generateMetaTags(c: MetaConfig): string {
  const lines: string[] = [];
  const tag = (attrs: string) => `  <meta ${attrs}>`;
  const link = (attrs: string) => `  <link ${attrs}>`;

  // Charset + viewport always first
  lines.push(`  <meta charset="${c.charset}">`);
  if (c.viewport) lines.push(tag(`name="viewport" content="${c.viewport}"`));

  // Title
  if (c.title) lines.push(`  <title>${c.title}</title>`);

  // Basic meta
  if (c.description) lines.push(tag(`name="description" content="${c.description}"`));
  if (c.keywords) lines.push(tag(`name="keywords" content="${c.keywords}"`));
  if (c.author) lines.push(tag(`name="author" content="${c.author}"`));
  if (c.language) lines.push(tag(`http-equiv="content-language" content="${c.language}"`));

  // Robots
  const robotsParts: string[] = [];
  if (c.noindex) robotsParts.push("noindex");
  else robotsParts.push("index");
  if (c.nofollow) robotsParts.push("nofollow");
  else robotsParts.push("follow");
  if (c.noarchive) robotsParts.push("noarchive");
  if (c.nosnippet) robotsParts.push("nosnippet");
  lines.push(tag(`name="robots" content="${robotsParts.join(", ")}"`));

  // Canonical
  if (c.canonical) lines.push(link(`rel="canonical" href="${c.canonical}"`));

  // Theme color
  if (c.themeColor && c.themeColor !== "#ffffff")
    lines.push(tag(`name="theme-color" content="${c.themeColor}"`));

  // Open Graph
  lines.push("");
  lines.push("  <!-- Open Graph / Facebook -->");
  if (c.ogType) lines.push(tag(`property="og:type" content="${c.ogType}"`));
  if (c.ogUrl || c.canonical)
    lines.push(tag(`property="og:url" content="${c.ogUrl || c.canonical}"`));
  if (c.ogTitle || c.title)
    lines.push(tag(`property="og:title" content="${c.ogTitle || c.title}"`));
  if (c.ogDescription || c.description)
    lines.push(tag(`property="og:description" content="${c.ogDescription || c.description}"`));
  if (c.ogImage) lines.push(tag(`property="og:image" content="${c.ogImage}"`));
  if (c.ogSiteName) lines.push(tag(`property="og:site_name" content="${c.ogSiteName}"`));
  if (c.ogLocale) lines.push(tag(`property="og:locale" content="${c.ogLocale}"`));

  // Twitter Card
  lines.push("");
  lines.push("  <!-- Twitter Card -->");
  if (c.twitterCard)
    lines.push(tag(`name="twitter:card" content="${c.twitterCard}"`));
  if (c.twitterSite)
    lines.push(tag(`name="twitter:site" content="${c.twitterSite}"`));
  if (c.twitterCreator)
    lines.push(tag(`name="twitter:creator" content="${c.twitterCreator}"`));
  if (c.twitterTitle || c.ogTitle || c.title)
    lines.push(tag(`name="twitter:title" content="${c.twitterTitle || c.ogTitle || c.title}"`));
  if (c.twitterDesc || c.ogDescription || c.description)
    lines.push(tag(`name="twitter:description" content="${c.twitterDesc || c.ogDescription || c.description}"`));
  if (c.twitterImage || c.ogImage)
    lines.push(tag(`name="twitter:image" content="${c.twitterImage || c.ogImage}"`));

  return lines.join("\n");
}

// ── SEO Score ─────────────────────────────────────────────────────

export function calcSeoScore(c: MetaConfig, t: (key: string, params?: Record<string, any>) => string): { score: number; checks: { label: string; ok: boolean; note?: string }[] } {
  const titleLen = c.title.length;
  const descLen = c.description.length;

  const checks = [
    { label: t("checks.titlePresent"), ok: titleLen > 0 },
    { label: t("checks.titleLength"), ok: titleLen >= 50 && titleLen <= 60, note: t("checks.chars", { count: titleLen }) },
    { label: t("checks.descPresent"), ok: descLen > 0 },
    { label: t("checks.descLength"), ok: descLen >= 150 && descLen <= 160, note: t("checks.chars", { count: descLen }) },
    { label: t("checks.keywords"), ok: c.keywords.length > 0 },
    { label: t("checks.canonical"), ok: c.canonical.length > 0 },
    { label: t("checks.ogTitle"), ok: (c.ogTitle || c.title).length > 0 },
    { label: t("checks.ogDesc"), ok: (c.ogDescription || c.description).length > 0 },
    { label: t("checks.ogImage"), ok: c.ogImage.length > 0 },
    { label: t("checks.twitterCard"), ok: c.twitterCard.length > 0 },
    { label: t("checks.indexing"), ok: !c.noindex },
  ];

  const score = Math.round((checks.filter(c => c.ok).length / checks.length) * 100);
  return { score, checks };
}