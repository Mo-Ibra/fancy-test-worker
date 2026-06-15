"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Copy,
  CheckCheck,
  ChevronRight,
  ArrowRight,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Info,
  Globe,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  ImageIcon,
  Code2,
  X,
  Eye,
  Smartphone,
  Monitor,
  MessageCircle,
} from "lucide-react";
import NextLink from "next/link";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Types ──────────────────────────────────────────────────────────

interface OGData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  type: string;
  // Twitter-specific
  twitterCard: string;
  twitterTitle: string;
  twitterDesc: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
}

type Platform = "facebook" | "twitter" | "linkedin" | "whatsapp" | "discord" | "slack";
type InputMode = "url" | "tags";
type Device = "desktop" | "mobile";

const EMPTY_OG: OGData = {
  title: "", description: "", image: "", url: "", siteName: "", type: "website",
  twitterCard: "summary_large_image", twitterTitle: "", twitterDesc: "",
  twitterImage: "", twitterSite: "", twitterCreator: "",
};

// ── Parse OG from raw HTML/meta tags ──────────────────────────────

function parseMetaTags(html: string): OGData {
  const og = { ...EMPTY_OG };

  const getMeta = (nameOrProp: string): string => {
    const re1 = new RegExp(`<meta[^>]*(?:property|name)=["']${nameOrProp}["'][^>]*content=["']([^"']*)["'][^>]*>`, "gi");
    const re2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${nameOrProp}["'][^>]*>`, "gi");
    return (re1.exec(html)?.[1] ?? re2.exec(html)?.[1] ?? "").trim();
  };

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const pageTitle = (titleMatch?.[1] ?? "").trim();

  og.title = getMeta("og:title") || pageTitle;
  og.description = getMeta("og:description") || getMeta("description");
  og.image = getMeta("og:image");
  og.url = getMeta("og:url");
  og.siteName = getMeta("og:site_name");
  og.type = getMeta("og:type") || "website";

  og.twitterCard = getMeta("twitter:card") || "summary_large_image";
  og.twitterTitle = getMeta("twitter:title") || og.title;
  og.twitterDesc = getMeta("twitter:description") || og.description;
  og.twitterImage = getMeta("twitter:image") || og.image;
  og.twitterSite = getMeta("twitter:site");
  og.twitterCreator = getMeta("twitter:creator");

  return og;
}

// ── Fetch OG data via a CORS proxy ────────────────────────────────
// Since CORS blocks direct fetching, we use allorigins.win as a proxy

async function fetchOgData(url: string): Promise<{ og: OGData; error?: string }> {
  // Validate URL
  if (!url.startsWith("http")) url = "https://" + url;

  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const html = data.contents ?? "";
    if (!html) throw new Error("Empty response");
    return { og: parseMetaTags(html) };
  } catch (e: any) {
    // Return partial data from URL itself
    const host = (() => { try { return new URL(url).hostname; } catch { return url; } })();
    return {
      og: { ...EMPTY_OG, url, siteName: host },
      error: `Could not fetch URL: ${e.message}. Enter meta tags manually below.`,
    };
  }
}

// ── CopyButton ─────────────────────────────────────────────────────

function CopyButton({ text, copiedLabel, copyLabel }: { text: string; copiedLabel?: string; copyLabel?: string }) {
  const t = useT("seo-tools/OGPreviewerTool.json");
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      disabled={!text}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 disabled:opacity-40 text-xs font-medium transition-all">
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? t("copy.copied") : t("copy.button")}
    </button>
  );
}

// ── Image fallback ─────────────────────────────────────────────────

function OGImage({ src, alt, className, noImageLabel = "No image" }: { src: string; alt: string; className?: string; noImageLabel?: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted/30 text-muted-foreground/30 gap-2 ${className}`}>
        <ImageIcon className="w-8 h-8" />
        <span className="text-[10px] font-medium">{noImageLabel}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setErr(true)} className={`object-cover w-full h-full ${className}`} />;
}

// ── Platform preview cards ─────────────────────────────────────────

function FacebookCard({ og, device }: { og: OGData; device: Device }) {
  const title = og.title || "Page Title";
  const desc = og.description || "Page description will appear here…";
  const site = og.siteName || (og.url ? (() => { try { return new URL(og.url).hostname.replace("www.", ""); } catch { return og.url; } })() : "example.com");

  return (
    <div className={`rounded-xl overflow-hidden border border-[#dadde1] dark:border-[#3a3b3c] bg-white dark:bg-[#242526] shadow-sm ${device === "mobile" ? "max-w-[328px]" : "max-w-[500px]"}`}>
      {/* Image */}
      <div className={`w-full overflow-hidden ${device === "mobile" ? "h-44" : "h-52"}`}>
        <OGImage src={og.image} alt={title} />
      </div>
      {/* Content */}
      <div className="px-3 py-2.5 border-t border-[#dadde1] dark:border-[#3a3b3c]">
        <p className="text-[11px] uppercase text-[#606770] dark:text-[#b0b3b8] font-medium mb-0.5 truncate">{site}</p>
        <p className="text-sm font-semibold text-[#1c1e21] dark:text-[#e4e6eb] leading-snug line-clamp-2">{title}</p>
        <p className="text-xs text-[#606770] dark:text-[#b0b3b8] mt-0.5 line-clamp-1">{desc}</p>
      </div>
    </div>
  );
}

function TwitterCard({ og, device }: { og: OGData; device: Device }) {
  const title = og.twitterTitle || og.title || "Page Title";
  const desc = og.twitterDesc || og.description || "Page description…";
  const image = og.twitterImage || og.image;
  const site = og.twitterSite || (og.url ? (() => { try { return new URL(og.url).hostname.replace("www.", ""); } catch { return ""; } })() : "");
  const isLarge = og.twitterCard === "summary_large_image";

  return (
    <div className={`rounded-2xl overflow-hidden border border-[#cfd9de] dark:border-[#2f3336] bg-white dark:bg-[#15202b] shadow-sm ${device === "mobile" ? "max-w-[340px]" : "max-w-[500px]"}`}>
      {isLarge ? (
        <>
          <div className="w-full h-48 overflow-hidden">
            <OGImage src={image} alt={title} />
          </div>
          <div className="p-3">
            <p className="text-sm font-bold text-[#0f1419] dark:text-[#e7e9ea] leading-snug line-clamp-1">{title}</p>
            <p className="text-xs text-[#536471] dark:text-[#71767b] mt-0.5 line-clamp-2">{desc}</p>
            {site && <p className="text-xs text-[#536471] dark:text-[#71767b] mt-1 flex items-center gap-1"><Globe className="w-3 h-3" />{site}</p>}
          </div>
        </>
      ) : (
        <div className="flex">
          <div className="w-24 h-24 shrink-0 overflow-hidden">
            <OGImage src={image} alt={title} />
          </div>
          <div className="flex-1 min-w-0 p-3">
            <p className="text-sm font-bold text-[#0f1419] dark:text-[#e7e9ea] leading-snug line-clamp-1">{title}</p>
            <p className="text-xs text-[#536471] dark:text-[#71767b] mt-0.5 line-clamp-2">{desc}</p>
            {site && <p className="text-xs text-[#536471] dark:text-[#71767b] mt-1 flex items-center gap-1"><Globe className="w-3 h-3" />{site}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function LinkedInCard({ og, device }: { og: OGData; device: Device }) {
  const title = og.title || "Page Title";
  const site = og.siteName || (og.url ? (() => { try { return new URL(og.url).hostname.replace("www.", ""); } catch { return ""; } })() : "");

  return (
    <div className={`rounded-lg overflow-hidden border border-[#e0e0e0] dark:border-[#383838] bg-white dark:bg-[#1b1f23] shadow-sm ${device === "mobile" ? "max-w-[340px]" : "max-w-[520px]"}`}>
      <div className="w-full h-52 overflow-hidden">
        <OGImage src={og.image} alt={title} />
      </div>
      <div className="p-3 border-t border-[#e0e0e0] dark:border-[#383838]">
        <p className="text-sm font-semibold text-[#000000e6] dark:text-[#ffffffe6] leading-snug line-clamp-2">{title}</p>
        {site && <p className="text-[11px] text-[#00000099] dark:text-[#ffffff99] mt-0.5">{site}</p>}
      </div>
    </div>
  );
}

function WhatsAppCard({ og }: { og: OGData }) {
  const title = og.title || "Page Title";
  const desc = og.description || "";
  const site = og.url ? (() => { try { return new URL(og.url).hostname; } catch { return og.url; } })() : "example.com";

  return (
    <div className="rounded-lg overflow-hidden border-l-4 border-l-[#25d366] bg-[#f0f0f0] dark:bg-[#1f2c34] shadow-sm max-w-[340px]">
      <div className="flex">
        {og.image && (
          <div className="w-20 h-20 shrink-0 overflow-hidden">
            <OGImage src={og.image} alt={title} />
          </div>
        )}
        <div className="flex-1 min-w-0 p-2.5">
          <p className="text-xs font-bold text-[#075e54] dark:text-[#25d366] truncate">{site}</p>
          <p className="text-xs font-semibold text-[#111b21] dark:text-[#e9edef] leading-snug line-clamp-2 mt-0.5">{title}</p>
          {desc && <p className="text-[10px] text-[#667781] dark:text-[#8696a0] mt-0.5 line-clamp-2">{desc}</p>}
        </div>
      </div>
    </div>
  );
}

function DiscordCard({ og }: { og: OGData }) {
  const title = og.title || "Page Title";
  const desc = og.description || "";
  const site = og.siteName || (og.url ? (() => { try { return new URL(og.url).hostname; } catch { return ""; } })() : "");
  const isLarge = og.twitterCard === "summary_large_image" || og.image;

  return (
    <div className="rounded-lg overflow-hidden border-l-4 border-l-[#5865f2] bg-[#2b2d31] shadow-sm max-w-[432px]">
      <div className="p-3">
        {site && <p className="text-xs font-semibold text-[#5865f2] mb-1 truncate">{site}</p>}
        <p className="text-sm font-bold text-[#00aff4] leading-snug line-clamp-2">{title}</p>
        {desc && <p className="text-xs text-[#dbdee1] mt-1 line-clamp-3 leading-relaxed">{desc}</p>}
        {og.image && (
          <div className={`mt-3 rounded-lg overflow-hidden ${isLarge ? "w-full h-40" : "w-20 h-20"}`}>
            <OGImage src={og.image} alt={title} />
          </div>
        )}
      </div>
    </div>
  );
}

function SlackCard({ og }: { og: OGData }) {
  const title = og.title || "Page Title";
  const desc = og.description || "";
  const site = og.siteName || (og.url ? (() => { try { return new URL(og.url).hostname; } catch { return ""; } })() : "");

  return (
    <div className="rounded-lg overflow-hidden border border-[#dddddd] dark:border-[#383838] bg-white dark:bg-[#1a1d21] shadow-sm max-w-[432px]">
      <div className="flex border-l-4 border-l-[#36c5f0]">
        <div className="flex-1 min-w-0 p-3">
          {site && <p className="text-xs font-bold text-[#1264a3] dark:text-[#36c5f0] mb-0.5 truncate">{site}</p>}
          <p className="text-sm font-bold text-[#1d1c1d] dark:text-[#d1d2d3] leading-snug line-clamp-2">{title}</p>
          {desc && <p className="text-xs text-[#616061] dark:text-[#ababad] mt-0.5 line-clamp-3 leading-relaxed">{desc}</p>}
        </div>
        {og.image && (
          <div className="w-20 h-20 shrink-0 overflow-hidden m-2 rounded-lg">
            <OGImage src={og.image} alt={title} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── OG Score ───────────────────────────────────────────────────────

function scoreOG(og: OGData) {
  const checks = [
    { label: "og:title", ok: og.title.length > 0, note: og.title.length > 0 ? `${og.title.length} chars` : undefined },
    { label: "og:title ≤ 95c", ok: og.title.length > 0 && og.title.length <= 95 },
    { label: "og:description", ok: og.description.length > 0, note: og.description.length > 0 ? `${og.description.length} chars` : undefined },
    { label: "og:image", ok: og.image.length > 0 },
    { label: "og:url", ok: og.url.length > 0 },
    { label: "og:type", ok: og.type.length > 0 },
    { label: "og:site_name", ok: og.siteName.length > 0 },
    { label: "twitter:card", ok: og.twitterCard.length > 0 },
    { label: "twitter:image", ok: (og.twitterImage || og.image).length > 0 },
  ];
  const passed = checks.filter(c => c.ok).length;
  const score = Math.round((passed / checks.length) * 100);
  return { score, checks };
}

// ── Main ───────────────────────────────────────────────────────────

export default function OGPreviewerTool() {
  const t = useT("seo-tools/OGPreviewerTool.json");

  const PLATFORM_LIST: { key: Platform; icon: React.ElementType; label: string; color: string }[] = [
    { key: "facebook", icon: Facebook, label: t('preview.tabs.facebook'), color: "text-[#1877f2]" },
    { key: "twitter", icon: Twitter, label: t('preview.tabs.twitter'), color: "text-[#000000] dark:text-white" },
    { key: "linkedin", icon: Linkedin, label: t('preview.tabs.linkedin'), color: "text-[#0077b5]" },
    { key: "whatsapp", icon: MessageCircle, label: t('preview.tabs.whatsapp'), color: "text-[#25d366]" },
    { key: "discord", icon: MessageCircle, label: t('preview.tabs.discord'), color: "text-[#5865f2]" },
    { key: "slack", icon: MessageCircle, label: t('preview.tabs.slack'), color: "text-[#36c5f0]" },
  ];

  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [og, setOg] = useState<OGData>(EMPTY_OG);
  const [loading, setLoading] = useState(false);
  const [fetchErr, setFetchErr] = useState("");
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [device, setDevice] = useState<Device>("desktop");
  const [fetched, setFetched] = useState(false);

  // Manual OG editor
  const setField = <K extends keyof OGData>(k: K, v: OGData[K]) =>
    setOg(prev => ({ ...prev, [k]: v }));

  // Fetch from URL
  const fetchUrl = useCallback(async () => {
    const url = urlInput.trim();
    if (!url) return;
    setLoading(true); setFetchErr(""); setFetched(false);
    const { og: data, error } = await fetchOgData(url);
    setOg(data);
    if (error) setFetchErr(error);
    setLoading(false);
    setFetched(true);
  }, [urlInput]);

  // Parse pasted tags
  const parseTags = useCallback(() => {
    if (!tagsInput.trim()) return;
    const parsed = parseMetaTags(tagsInput);
    setOg(parsed);
    setFetched(true);
    setFetchErr("");
  }, [tagsInput]);

  const { score, checks } = useMemo(() => scoreOG(og), [og]);

  const scoreColor =
    score >= 80 ? "text-emerald-500" :
      score >= 60 ? "text-amber-500" : "text-red-500";
  const scoreBg =
    score >= 80 ? "bg-emerald-500" :
      score >= 60 ? "bg-amber-500" : "bg-red-500";

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <NextLink href="/tools" className="hover:text-blue-500 transition-colors">{t('breadcrumb.allTools')}</NextLink>
          <ChevronRight className="w-3 h-3" />
          <NextLink href="/tools/seo" className="hover:text-blue-500 transition-colors">{t('breadcrumb.seoTools')}</NextLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{t('breadcrumb.current')}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 mb-4">
            <Share2 className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">{t('header.badge')}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-2">{t('header.title')}</h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            {t('header.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Input ── */}
          <div className="flex flex-col gap-5">

            {/* Input mode */}
            <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
              {([
                { k: "url" as InputMode, icon: Globe, label: t('input.fetchUrl') },
                { k: "tags" as InputMode, icon: Code2, label: t('input.pasteTags') },
              ]).map(({ k, icon: Icon, label }) => (
                <button key={k} onClick={() => setInputMode(k)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${inputMode === k ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* URL input */}
            {inputMode === "url" && (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('input.websiteUrl')}</p>
                <div className="flex gap-2">
                  <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && fetchUrl()}
                    placeholder={t('input.urlPlaceholder')}
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t('input.websiteUrl')} />
                  <button onClick={fetchUrl} disabled={loading || !urlInput.trim()}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white text-sm font-bold transition-all">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                    {loading ? t('input.loading') : t('input.fetch')}
                  </button>
                </div>
                {fetchErr && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700 dark:text-amber-400">{fetchErr}</p>
                  </div>
                )}
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-border bg-muted/20">
                  <Info className="w-3 h-3 text-muted-foreground/50 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground/70">
                    {t('tips.corsProxy')}
                  </p>
                </div>
              </div>
            )}

            {/* Tags input */}
            {inputMode === "tags" && (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('input.pasteHtml')}</p>
                <textarea value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                  placeholder={t('input.htmlPlaceholder')}
                  rows={7}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-xs font-mono resize-none focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
                <button onClick={parseTags} disabled={!tagsInput.trim()}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white text-sm font-bold transition-all">
                  <Eye className="w-4 h-4" /> {t('input.parsePreview')}
                </button>
              </div>
            )}

            {/* Manual editor */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('input.editTags')}</p>

              {([
                { k: "title", label: t('input.ogTitle'), ph: t('input.titlePlaceholder') },
                { k: "description", label: t('input.ogDescription'), ph: t('input.descriptionPlaceholder') },
                { k: "image", label: t('input.ogImage'), ph: t('input.imagePlaceholder') },
                { k: "url", label: t('input.ogUrl'), ph: t('input.urlFieldPlaceholder') },
                { k: "siteName", label: t('input.ogSiteName'), ph: t('input.siteNamePlaceholder') },
              ] as { k: keyof OGData; label: string; ph: string }[]).map(({ k, label, ph }) => (
                <div key={k}>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{label}</label>
                  <input value={og[k] as string} onChange={e => setField(k, e.target.value)}
                    placeholder={ph}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={label} />
                </div>
              ))}

              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{t('input.twitterCard')}</label>
                <select value={og.twitterCard} onChange={e => setField("twitterCard", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all">
                  {["summary", "summary_large_image", "app", "player"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {([
                { k: "twitterTitle", label: t('input.twitterTitle'), ph: t('input.twitterTitlePlaceholder') },
                { k: "twitterDesc", label: t('input.twitterDesc'), ph: t('input.twitterDescPlaceholder') },
                { k: "twitterImage", label: t('input.twitterImage'), ph: t('input.twitterImagePlaceholder') },
                { k: "twitterSite", label: t('input.twitterSite'), ph: t('input.twitterSitePlaceholder') },
              ] as { k: keyof OGData; label: string; ph: string }[]).map(({ k, label, ph }) => (
                <div key={k}>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{label}</label>
                  <input value={og[k] as string} onChange={e => setField(k, e.target.value)}
                    placeholder={ph}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={label} />
                </div>
              ))}
            </div>

            {/* OG Score */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`text-2xl font-black tabular-nums ${scoreColor}`}>{score}</div>
                <div>
                  <p className="text-xs font-bold text-foreground">{t('score.title')}</p>
                  <p className="text-[10px] text-muted-foreground">{checks.filter(c => c.ok).length}/{checks.length} {t('score.tagsSet')}</p>
                </div>
                <div className="flex-1">
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <div className={`h-full rounded-full ${scoreBg} transition-all`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {checks.map(({ label, ok, note }) => (
                  <div key={label} className="flex items-center gap-2">
                    {ok ? <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      : <X className="w-3 h-3 text-muted-foreground/30 shrink-0" />}
                    <code className={`text-[10px] font-mono flex-1 ${ok ? "text-foreground" : "text-muted-foreground/40"}`}>{label}</code>
                    {note && <span className="text-[9px] text-muted-foreground/60">{note}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Previews ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Platform + device selector */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {PLATFORM_LIST.map(({ key, icon: Icon, label, color }) => (
                  <button key={key} onClick={() => setPlatform(key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${platform === key
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-blue-200"
                      }`}>
                    <Icon className={`w-3.5 h-3.5 ${platform === key ? "text-blue-500" : color}`} />
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {([
                  { k: "desktop" as Device, icon: Monitor, label: t('preview.device.desktop') },
                  { k: "mobile" as Device, icon: Smartphone, label: t('preview.device.mobile') },
                ]).map(({ k, icon: Icon, label }) => (
                  <button key={k} onClick={() => setDevice(k)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${device === k ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:border-blue-200"
                      }`}>
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview area */}
            <div className={`flex flex-col items-start gap-6 p-6 rounded-2xl border border-border bg-muted/10 min-h-[300px] ${platform === "discord" ? "bg-[#313338]" : ""
              }`}>

              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t('preview.previewOn')} {PLATFORM_LIST.find(p => p.key === platform)?.label}
                </p>

                {platform === "facebook" && <FacebookCard og={og} device={device} />}
                {platform === "twitter" && <TwitterCard og={og} device={device} />}
                {platform === "linkedin" && <LinkedInCard og={og} device={device} />}
                {platform === "whatsapp" && <WhatsAppCard og={og} />}
                {platform === "discord" && <DiscordCard og={og} />}
                {platform === "slack" && <SlackCard og={og} />}
              </div>

              {!og.title && !og.image && (
                <div className="flex flex-col items-center justify-center w-full py-10 text-muted-foreground/30 gap-2">
                  <Share2 className="w-10 h-10" />
                  <p className="text-sm">{t('preview.enterUrlOrTags')}</p>
                </div>
              )}
            </div>

            {/* All platforms at once */}
            {(og.title || og.image) && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('preview.allPlatforms')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-[#1877f2]">Facebook</p>
                    <FacebookCard og={og} device="desktop" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-foreground dark:text-white">Twitter/X</p>
                    <TwitterCard og={og} device="desktop" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-[#0077b5]">LinkedIn</p>
                    <LinkedInCard og={og} device="desktop" />
                  </div>
                  <div className="flex flex-col gap-2 bg-[#111b21] p-3 rounded-xl">
                    <p className="text-[10px] font-bold text-[#25d366]">WhatsApp</p>
                    <WhatsAppCard og={og} />
                  </div>
                  <div className="flex flex-col gap-2 bg-[#313338] p-3 rounded-xl">
                    <p className="text-[10px] font-bold text-[#5865f2]">Discord</p>
                    <DiscordCard og={og} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-[#36c5f0]">Slack</p>
                    <SlackCard og={og} />
                  </div>
                </div>
              </div>
            )}

            {/* Image info */}
            {og.image && (
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <ImageIcon className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground mb-0.5">{t("score.ogImage")}</p>
                  <code className="text-[10px] font-mono text-muted-foreground truncate block">{og.image}</code>
                  <p className="text-[9px] text-muted-foreground/60 mt-0.5">{t('score.recommendedSize')}</p>
                </div>
                <CopyButton text={og.image} />
              </div>
            )}
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/OGPreviewerTool.json" count={4} />
        <FAQ tKey="seo-tools/OGPreviewerTool.json" />
        <Examples tKey="seo-tools/OGPreviewerTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}