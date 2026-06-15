// ── Types ──────────────────────────────────────────────────────────

export interface RobotRule {
  id: string;
  userAgent: string;
  allows: string[];
  disallows: string[];
  crawlDelay: string;
}

export interface SitemapEntry {
  id: string;
  url: string;
}

// ── Known bots ─────────────────────────────────────────────────────

export const KNOWN_BOTS = [
  { name: "*", label: "All robots", icon: "🤖" },
  { name: "Googlebot", label: "Google Search", icon: "🔍" },
  { name: "Googlebot-Image", label: "Google Images", icon: "🖼️" },
  { name: "Googlebot-Video", label: "Google Video", icon: "🎬" },
  { name: "Googlebot-News", label: "Google News", icon: "📰" },
  { name: "Bingbot", label: "Bing", icon: "🔵" },
  { name: "Slurp", label: "Yahoo", icon: "🟣" },
  { name: "DuckDuckBot", label: "DuckDuckGo", icon: "🦆" },
  { name: "Baiduspider", label: "Baidu", icon: "🇨🇳" },
  { name: "YandexBot", label: "Yandex", icon: "🇷🇺" },
  { name: "facebot", label: "Facebook", icon: "👤" },
  { name: "Twitterbot", label: "Twitter/X", icon: "🐦" },
  { name: "LinkedInBot", label: "LinkedIn", icon: "💼" },
  { name: "AhrefsBot", label: "Ahrefs", icon: "📊" },
  { name: "SemrushBot", label: "SEMrush", icon: "📈" },
  { name: "MJ12bot", label: "Majestic", icon: "🔷" },
  { name: "DotBot", label: "OpenSiteExplorer", icon: "🔶" },
  { name: "ia_archiver", label: "Wayback Machine", icon: "📁" },
  { name: "GPTBot", label: "OpenAI GPTBot", icon: "🧠" },
  { name: "Claude-Web", label: "Anthropic Claude", icon: "🤖" },
];

export const COMMON_PATHS = [
  "/admin", "/wp-admin", "/login", "/dashboard", "/api/", "/private/",
  "/tmp/", "/cache/", "/cgi-bin/", "/search", "/cart", "/checkout",
  "/account/", "/user/", "/profile/", "/config", "/env",
  "/*.json$", "/*.xml$", "/*.pdf$", "/?*", "/*?",
  "/wp-content/plugins/", "/wp-content/themes/",
];

// ── Helpers ────────────────────────────────────────────────────────

export function uid() { return Math.random().toString(36).slice(2, 10); }

export function generateRobotsTxt(rules: RobotRule[], sitemaps: SitemapEntry[], host: string): string {
  const lines: string[] = [];

  // Header comment
  lines.push("# robots.txt");
  lines.push(`# Generated: ${new Date().toISOString().split("T")[0]}`);
  if (host) lines.push(`# Host: ${host}`);
  lines.push("");

  for (const rule of rules) {
    lines.push(`User-agent: ${rule.userAgent}`);
    for (const d of rule.disallows) {
      if (d.trim()) lines.push(`Disallow: ${d.trim()}`);
    }
    for (const a of rule.allows) {
      if (a.trim()) lines.push(`Allow: ${a.trim()}`);
    }
    if (rule.crawlDelay.trim()) lines.push(`Crawl-delay: ${rule.crawlDelay.trim()}`);
    lines.push("");
  }

  for (const sm of sitemaps) {
    if (sm.url.trim()) lines.push(`Sitemap: ${sm.url.trim()}`);
  }

  if (host) lines.push(`Host: ${host}`);

  return lines.join("\n").trim() + "\n";
}

export function validateRobotsTxt(content: string, t?: any): { type: "info" | "warning" | "error"; message: string }[] {
  const issues: { type: "info" | "warning" | "error"; message: string }[] = [];
  const lines = content.split("\n").filter(l => l.trim() && !l.startsWith("#"));

  let hasUserAgent = false;
  let lastWasUA = false;

  for (const line of lines) {
    if (line.startsWith("User-agent:")) {
      hasUserAgent = true;
      lastWasUA = true;
    } else if (line.startsWith("Disallow:") || line.startsWith("Allow:")) {
      if (!lastWasUA && !hasUserAgent) {
        issues.push({ type: "error", message: t ? t("validation.orphanDirective") : "Disallow/Allow directive found without a preceding User-agent" });
      }
      lastWasUA = false;
    } else if (line.startsWith("Sitemap:")) {
      const url = line.replace("Sitemap:", "").trim();
      if (!url.startsWith("http")) {
        issues.push({ type: "warning", message: t ? t("validation.relativeSitemap", { url }) : `Sitemap URL should be absolute: "${url}"` });
      }
    } else if (line.startsWith("Crawl-delay:")) {
      const val = parseFloat(line.replace("Crawl-delay:", "").trim());
      if (isNaN(val) || val < 0) {
        issues.push({ type: "error", message: t ? t("validation.invalidDelay") : "Crawl-delay must be a positive number" });
      } else if (val > 30) {
        issues.push({ type: "warning", message: t ? t("validation.highDelay", { val }) : `Crawl-delay of ${val}s is very high — may hurt indexing` });
      }
    }
  }

  if (!hasUserAgent) {
    issues.push({ type: "error", message: t ? t("validation.noUserAgent") : "No User-agent directive found" });
  }

  // Check for common issues
  const hasAllowAll = content.includes("Disallow: \n") || content.includes("Disallow:\n");
  if (hasAllowAll) {
    issues.push({ type: "info", message: t ? t("validation.emptyDisallow") : "Empty Disallow means allow all crawling (this is correct)" });
  }

  if (content.includes("Disallow: /") && !content.includes("Allow:")) {
    issues.push({ type: "warning", message: t ? t("validation.blockAllWarning") : "Disallow: / blocks all crawling — make sure this is intentional" });
  }

  return issues;
}

export const PRESETS: { key: string; icon: string; rules: Partial<RobotRule>[]; sitemaps: string[] }[] = [
  {
    key: "allowAll",
    icon: "✅",
    rules: [{ userAgent: "*", disallows: [""], allows: [], crawlDelay: "" }],
    sitemaps: [],
  },
  {
    key: "blockAll",
    icon: "🚫",
    rules: [{ userAgent: "*", disallows: ["/"], allows: [], crawlDelay: "" }],
    sitemaps: [],
  },
  {
    key: "blockAi",
    icon: "🧠",
    rules: [
      { userAgent: "*", disallows: [""], allows: [], crawlDelay: "" },
      { userAgent: "GPTBot", disallows: ["/"], allows: [], crawlDelay: "" },
      { userAgent: "Claude-Web", disallows: ["/"], allows: [], crawlDelay: "" },
      { userAgent: "CCBot", disallows: ["/"], allows: [], crawlDelay: "" },
      { userAgent: "ChatGPT-User", disallows: ["/"], allows: [], crawlDelay: "" },
    ],
    sitemaps: [],
  },
  {
    key: "wordpress",
    icon: "📝",
    rules: [{
      userAgent: "*",
      disallows: ["/wp-admin/", "/wp-includes/", "/wp-content/plugins/", "/wp-content/themes/", "/?s=", "/trackback/"],
      allows: ["/wp-admin/admin-ajax.php"],
      crawlDelay: "",
    }],
    sitemaps: ["https://example.com/sitemap.xml"],
  },
  {
    key: "ecommerce",
    icon: "🛒",
    rules: [{
      userAgent: "*",
      disallows: ["/cart", "/checkout", "/order-confirmation", "/account/", "/wishlist", "/compare", "/?*"],
      allows: [],
      crawlDelay: "",
    }],
    sitemaps: ["https://example.com/sitemap.xml", "https://example.com/products-sitemap.xml"],
  },
  {
    key: "blockSeo",
    icon: "📊",
    rules: [
      { userAgent: "*", disallows: [""], allows: [], crawlDelay: "" },
      { userAgent: "AhrefsBot", disallows: ["/"], allows: [], crawlDelay: "" },
      { userAgent: "SemrushBot", disallows: ["/"], allows: [], crawlDelay: "" },
      { userAgent: "MJ12bot", disallows: ["/"], allows: [], crawlDelay: "" },
    ],
    sitemaps: [],
  },
];