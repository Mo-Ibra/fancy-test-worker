
// ── Types ──────────────────────────────────────────────────────────

export type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface SitemapUrl {
  id: string;
  loc: string;
  lastmod: string;   // YYYY-MM-DD or ""
  changefreq: ChangeFreq;
  priority: string;   // "0.1" – "1.0"
  images: string[]; // image URLs for image sitemap extension
}

export interface SitemapIndex {
  id: string;
  loc: string;
  lastmod: string;
}

export type ViewMode = "url-list" | "sitemap-index";

// ── Helpers ────────────────────────────────────────────────────────

export function uid() { return Math.random().toString(36).slice(2, 10); }

export const TODAY = new Date().toISOString().split("T")[0];

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateUrlsetXml(urls: SitemapUrl[]): string {
  if (urls.length === 0) return "";

  const urlEls = urls
    .filter(u => u.loc.trim())
    .map(u => {
      const lines: string[] = [];
      lines.push(`  <url>`);
      lines.push(`    <loc>${escapeXml(u.loc.trim())}</loc>`);
      if (u.lastmod) lines.push(`    <lastmod>${u.lastmod}</lastmod>`);
      if (u.changefreq) lines.push(`    <changefreq>${u.changefreq}</changefreq>`);
      if (u.priority) lines.push(`    <priority>${u.priority}</priority>`);
      if (u.images.some(Boolean)) {
        u.images.filter(Boolean).forEach(img => {
          lines.push(`    <image:image>`);
          lines.push(`      <image:loc>${escapeXml(img)}</image:loc>`);
          lines.push(`    </image:image>`);
        });
      }
      lines.push(`  </url>`);
      return lines.join("\n");
    });

  const hasImages = urls.some(u => u.images.some(Boolean));

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    hasImages
      ? `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`
      : `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urlEls,
    `</urlset>`,
  ].join("\n");
}

export function generateIndexXml(indexes: SitemapIndex[]): string {
  if (indexes.length === 0) return "";

  const sitEls = indexes
    .filter(s => s.loc.trim())
    .map(s => {
      const lines = [`  <sitemap>`, `    <loc>${escapeXml(s.loc.trim())}</loc>`];
      if (s.lastmod) lines.push(`    <lastmod>${s.lastmod}</lastmod>`);
      lines.push(`  </sitemap>`);
      return lines.join("\n");
    });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...sitEls,
    `</sitemapindex>`,
  ].join("\n");
}

export function validateSitemap(urls: SitemapUrl[], t?: any): { type: "error" | "warning" | "info"; msg: string }[] {
  const issues: { type: "error" | "warning" | "info"; msg: string }[] = [];
  const locs = new Set<string>();

  if (urls.filter(u => u.loc.trim()).length === 0) {
    issues.push({ type: "error", msg: t ? t("validation.noUrls") : "No URLs added" });
    return issues;
  }

  if (urls.filter(u => u.loc.trim()).length > 50000) {
    issues.push({ type: "error", msg: t ? t("validation.exceedLimit") : "Sitemap exceeds 50,000 URL limit per file" });
  }

  urls.forEach((u, i) => {
    const loc = u.loc.trim();
    if (!loc) return;

    if (!loc.startsWith("http")) {
      issues.push({ type: "error", msg: t ? t("validation.urlMustStart", { row: i + 1, url: loc }) : `Row ${i + 1}: URL must start with http(s) — "${loc}"` });
    }

    if (locs.has(loc)) {
      issues.push({ type: "warning", msg: t ? t("validation.duplicateUrl", { url: loc }) : `Duplicate URL: "${loc}"` });
    }
    locs.add(loc);

    const prio = parseFloat(u.priority);
    if (u.priority && (isNaN(prio) || prio < 0 || prio > 1)) {
      issues.push({ type: "error", msg: t ? t("validation.priorityRange", { row: i + 1 }) : `Row ${i + 1}: Priority must be 0.0–1.0` });
    }
  });

  if (urls.filter(u => u.loc.trim()).length > 0) {
    const count = urls.filter(u => u.loc.trim()).length;
    issues.push({ type: "info", msg: t ? t("validation.urlCount", { count }) : `${count} URLs · Google recommends keeping files under 10 MB` });
  }

  return issues;
}