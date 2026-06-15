// ── Types ──────────────────────────────────────────────────────────

export type OutputFormatType = "html" | "xml-sitemap" | "http-header";

export interface HreflangEntry {
  id: string;
  lang: string;   // e.g. "en", "en-US", "fr"
  region: string;   // e.g. "" or "US", "GB"
  url: string;
  isDefault: boolean;  // x-default
}

export interface PageSet {
  id: string;
  name: string;
  entries: HreflangEntry[];
}

// ── Language / Region data ─────────────────────────────────────────

export const LANGUAGES = [
  { code: "af", name: "Afrikaans" },
  { code: "ar", name: "Arabic" },
  { code: "az", name: "Azerbaijani" },
  { code: "be", name: "Belarusian" },
  { code: "bg", name: "Bulgarian" },
  { code: "bn", name: "Bengali" },
  { code: "bs", name: "Bosnian" },
  { code: "ca", name: "Catalan" },
  { code: "cs", name: "Czech" },
  { code: "cy", name: "Welsh" },
  { code: "da", name: "Danish" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "en", name: "English" },
  { code: "eo", name: "Esperanto" },
  { code: "es", name: "Spanish" },
  { code: "et", name: "Estonian" },
  { code: "eu", name: "Basque" },
  { code: "fa", name: "Persian" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "ga", name: "Irish" },
  { code: "gl", name: "Galician" },
  { code: "gu", name: "Gujarati" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hr", name: "Croatian" },
  { code: "hu", name: "Hungarian" },
  { code: "hy", name: "Armenian" },
  { code: "id", name: "Indonesian" },
  { code: "is", name: "Icelandic" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ka", name: "Georgian" },
  { code: "kk", name: "Kazakh" },
  { code: "km", name: "Khmer" },
  { code: "kn", name: "Kannada" },
  { code: "ko", name: "Korean" },
  { code: "lt", name: "Lithuanian" },
  { code: "lv", name: "Latvian" },
  { code: "mk", name: "Macedonian" },
  { code: "ml", name: "Malayalam" },
  { code: "mn", name: "Mongolian" },
  { code: "mr", name: "Marathi" },
  { code: "ms", name: "Malay" },
  { code: "mt", name: "Maltese" },
  { code: "my", name: "Burmese" },
  { code: "ne", name: "Nepali" },
  { code: "nl", name: "Dutch" },
  { code: "no", name: "Norwegian" },
  { code: "pa", name: "Punjabi" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "sq", name: "Albanian" },
  { code: "sr", name: "Serbian" },
  { code: "sv", name: "Swedish" },
  { code: "sw", name: "Swahili" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "th", name: "Thai" },
  { code: "tl", name: "Filipino" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu" },
  { code: "uz", name: "Uzbek" },
  { code: "vi", name: "Vietnamese" },
  { code: "zh", name: "Chinese" },
  { code: "zu", name: "Zulu" },
];

export const REGIONS = [
  { code: "", name: "— No region —" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "AF", name: "Afghanistan" },
  { code: "AR", name: "Argentina" },
  { code: "AT", name: "Austria" },
  { code: "AU", name: "Australia" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CH", name: "Switzerland" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DE", name: "Germany" },
  { code: "DK", name: "Denmark" },
  { code: "EG", name: "Egypt" },
  { code: "ES", name: "Spain" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "GR", name: "Greece" },
  { code: "HK", name: "Hong Kong" },
  { code: "HR", name: "Croatia" },
  { code: "HU", name: "Hungary" },
  { code: "ID", name: "Indonesia" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IN", name: "India" },
  { code: "IQ", name: "Iraq" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "KW", name: "Kuwait" },
  { code: "MX", name: "Mexico" },
  { code: "MY", name: "Malaysia" },
  { code: "NG", name: "Nigeria" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "NZ", name: "New Zealand" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PK", name: "Pakistan" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RS", name: "Serbia" },
  { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SE", name: "Sweden" },
  { code: "SG", name: "Singapore" },
  { code: "SI", name: "Slovenia" },
  { code: "SK", name: "Slovakia" },
  { code: "TH", name: "Thailand" },
  { code: "TR", name: "Turkey" },
  { code: "TW", name: "Taiwan" },
  { code: "UA", name: "Ukraine" },
  { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" },
  { code: "ZA", name: "South Africa" },
];

// Frequently used combos
export const QUICK_COMBOS = [
  { label: "🇺🇸 en-US", lang: "en", region: "US" },
  { label: "🇬🇧 en-GB", lang: "en", region: "GB" },
  { label: "🇦🇺 en-AU", lang: "en", region: "AU" },
  { label: "🇨🇦 en-CA", lang: "en", region: "CA" },
  { label: "🇩🇪 de-DE", lang: "de", region: "DE" },
  { label: "🇦🇹 de-AT", lang: "de", region: "AT" },
  { label: "🇨🇭 de-CH", lang: "de", region: "CH" },
  { label: "🇫🇷 fr-FR", lang: "fr", region: "FR" },
  { label: "🇧🇪 fr-BE", lang: "fr", region: "BE" },
  { label: "🇨🇦 fr-CA", lang: "fr", region: "CA" },
  { label: "🇪🇸 es-ES", lang: "es", region: "ES" },
  { label: "🇲🇽 es-MX", lang: "es", region: "MX" },
  { label: "🇦🇷 es-AR", lang: "es", region: "AR" },
  { label: "🇧🇷 pt-BR", lang: "pt", region: "BR" },
  { label: "🇵🇹 pt-PT", lang: "pt", region: "PT" },
  { label: "🇯🇵 ja", lang: "ja", region: "" },
  { label: "🇰🇷 ko", lang: "ko", region: "" },
  { label: "🇨🇳 zh-CN", lang: "zh", region: "CN" },
  { label: "🇹🇼 zh-TW", lang: "zh", region: "TW" },
  { label: "🇸🇦 ar-SA", lang: "ar", region: "SA" },
  { label: "🇮🇳 hi-IN", lang: "hi", region: "IN" },
  { label: "🇷🇺 ru-RU", lang: "ru", region: "RU" },
];

// ── Helpers ────────────────────────────────────────────────────────

export function uid() { return Math.random().toString(36).slice(2, 9); }

export function buildHreflang(lang: string, region: string): string {
  return region ? `${lang}-${region}` : lang;
}

export function makeHreflangTag(href: string, hreflang: string): string {
  return `  <link rel="alternate" hreflang="${hreflang}" href="${href}" />`;
}

export function makeXDefaultTag(href: string): string {
  return `  <link rel="alternate" hreflang="x-default" href="${href}" />`;
}

export function generateHtml(entries: HreflangEntry[]): string {
  const valid = entries.filter(e => e.url.trim());
  const xDef = valid.find(e => e.isDefault);
  const lines = valid.filter(e => !e.isDefault).map(e =>
    makeHreflangTag(e.url.trim(), buildHreflang(e.lang, e.region))
  );
  if (xDef) lines.push(makeXDefaultTag(xDef.url.trim()));
  return lines.join("\n");
}

export function generateXmlSitemap(pageSets: PageSet[]): string {
  const urlBlocks = pageSets.map(ps => {
    const valid = ps.entries.filter(e => e.url.trim());
    const xlinks = valid.map(e => {
      const hl = e.isDefault ? "x-default" : buildHreflang(e.lang, e.region);
      return `      <xhtml:link\n        rel="alternate"\n        hreflang="${hl}"\n        href="${e.url.trim()}"/>`;
    }).join("\n");

    return valid.map(e => `  <url>\n    <loc>${e.url.trim()}</loc>\n${xlinks}\n  </url>`).join("\n");
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks}
</urlset>`;
}

export function generateHttpHeader(entries: HreflangEntry[]): string {
  const valid = entries.filter(e => e.url.trim());
  const lines = valid.map(e => {
    const hl = e.isDefault ? "x-default" : buildHreflang(e.lang, e.region);
    return `Link: <${e.url.trim()}>; rel="alternate"; hreflang="${hl}"`;
  });
  return lines.join("\n");
}

export function validateEntries(entries: HreflangEntry[]): { type: "error" | "warning" | "info"; msg: string }[] {
  const issues: { type: "error" | "warning" | "info"; msg: string }[] = [];
  const valid = entries.filter(e => e.url.trim());

  if (valid.length === 0) return [];
  if (valid.length === 1) {
    issues.push({ type: "warning", msg: "Only one language version. Hreflang needs at least 2." });
  }

  const hreflangs = valid.filter(e => !e.isDefault).map(e => buildHreflang(e.lang, e.region));
  const dups = hreflangs.filter((h, i) => hreflangs.indexOf(h) !== i);
  if (dups.length > 0) {
    issues.push({ type: "error", msg: `Duplicate hreflang values: ${[...new Set(dups)].join(", ")}` });
  }

  const hasXDefault = valid.some(e => e.isDefault);
  if (!hasXDefault) {
    issues.push({ type: "info", msg: 'Consider adding an x-default for users whose language doesn\'t match any alternate.' });
  }

  const httpUrls = valid.filter(e => e.url.startsWith("http://"));
  if (httpUrls.length > 0) {
    issues.push({ type: "warning", msg: "Some URLs use HTTP — hreflang should use HTTPS." });
  }

  const missingUrls = entries.filter(e => !e.url.trim());
  if (missingUrls.length > 0) {
    issues.push({ type: "warning", msg: `${missingUrls.length} entry/entries missing a URL.` });
  }

  if (issues.length === 0 && valid.length >= 2) {
    issues.push({ type: "info", msg: "✓ Hreflang set looks good!" });
  }

  return issues;
}

export const DEFAULT_ENTRIES: HreflangEntry[] = [
  { id: uid(), lang: "en", region: "US", url: "", isDefault: false },
  { id: uid(), lang: "en", region: "GB", url: "", isDefault: false },
  { id: uid(), lang: "fr", region: "FR", url: "", isDefault: false },
  { id: uid(), lang: "de", region: "DE", url: "", isDefault: false },
  { id: uid(), lang: "en", region: "", url: "", isDefault: true },
];