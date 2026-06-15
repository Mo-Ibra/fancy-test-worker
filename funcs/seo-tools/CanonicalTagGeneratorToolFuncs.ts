
// ── Types ──────────────────────────────────────────────────────────

export type Mode = "single" | "bulk" | "cross-domain";

export interface UrlEntry {
  id: string;
  url: string;
  canonical: string;   // override — empty = self-referencing
  note: string;
}

export interface UrlAnalysis {
  isValid: boolean;
  isHttps: boolean;
  hasWww: boolean;
  hasTrailingSlash: boolean;
  hasParams: boolean;
  hasFragment: boolean;
  protocol: string;
  host: string;
  pathname: string;
  cleanUrl: string;
  issues: string[];
  warnings: string[];
}

// ── URL Analysis ───────────────────────────────────────────────────

export function analyzeUrl(raw: string): UrlAnalysis {
  const blank: UrlAnalysis = {
    isValid: false, isHttps: false, hasWww: false, hasTrailingSlash: false,
    hasParams: false, hasFragment: false, protocol: "", host: "", pathname: "",
    cleanUrl: "", issues: [], warnings: [],
  };

  if (!raw.trim()) return blank;

  let url = raw.trim();
  if (!url.startsWith("http")) url = "https://" + url;

  try {
    const u = new URL(url);
    const issues: string[] = [];
    const warnings: string[] = [];

    const isHttps = u.protocol === "https:";
    const hasWww = u.hostname.startsWith("www.");
    const hasTrailingSlash = u.pathname !== "/" && u.pathname.endsWith("/");
    const hasParams = u.search.length > 0;
    const hasFragment = u.hash.length > 0;

    if (!isHttps) issues.push("single.analysisMessages.notHttps");
    if (hasFragment) issues.push("single.analysisMessages.hasFragment");
    if (hasWww) warnings.push("single.analysisMessages.considerWww");
    if (hasTrailingSlash) warnings.push("single.analysisMessages.trailingSlashConsistency");
    if (hasParams) warnings.push("single.analysisMessages.queryParameters");

    // Clean URL (no fragment)
    const cleanUrl = `${u.protocol}//${u.host}${u.pathname}${u.search}`;

    return {
      isValid: true, isHttps, hasWww, hasTrailingSlash, hasParams, hasFragment,
      protocol: u.protocol, host: u.host, pathname: u.pathname,
      cleanUrl, issues, warnings,
    };
  } catch {
    return { ...blank, issues: ["Invalid URL format"] };
  }
}

// ── Generate canonical tag ─────────────────────────────────────────

export function makeCanonicalTag(canonicalUrl: string): string {
  return `<link rel="canonical" href="${canonicalUrl}" />`;
}

export function makeHreflangTag(href: string, lang: string): string {
  return `<link rel="alternate" hreflang="${lang}" href="${href}" />`;
}

export function makeXDefaultTag(href: string): string {
  return `<link rel="alternate" hreflang="x-default" href="${href}" />`;
}

// ── URL normalizer ─────────────────────────────────────────────────

export function normalizeUrl(url: string, opts: NormalizeOpts): string {
  if (!url.trim()) return "";
  let u = url.trim();
  if (!u.startsWith("http")) u = "https://" + u;
  try {
    const parsed = new URL(u);
    // Protocol
    if (opts.forceHttps) parsed.protocol = "https:";
    // www
    if (opts.preferWww && !parsed.hostname.startsWith("www.")) {
      parsed.hostname = "www." + parsed.hostname;
    } else if (opts.preferNonWww && parsed.hostname.startsWith("www.")) {
      parsed.hostname = parsed.hostname.replace(/^www\./, "");
    }
    // Trailing slash
    if (opts.removeTrailingSlash && parsed.pathname !== "/" && parsed.pathname.endsWith("/")) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    } else if (opts.addTrailingSlash && parsed.pathname !== "/" && !parsed.pathname.endsWith("/")) {
      parsed.pathname += "/";
    }
    // Strip params
    if (opts.stripParams) parsed.search = "";
    // Strip fragment
    parsed.hash = "";
    // Lowercase path
    if (opts.lowercasePath) parsed.pathname = parsed.pathname.toLowerCase();

    return parsed.toString();
  } catch {
    return url;
  }
}

export interface NormalizeOpts {
  forceHttps: boolean;
  preferWww: boolean;
  preferNonWww: boolean;
  removeTrailingSlash: boolean;
  addTrailingSlash: boolean;
  stripParams: boolean;
  lowercasePath: boolean;
}

export function uid() { return Math.random().toString(36).slice(2, 9); }