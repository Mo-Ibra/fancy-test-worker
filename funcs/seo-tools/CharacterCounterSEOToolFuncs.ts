// ── Types ──────────────────────────────────────────────────────────

import { Facebook, FileText, Globe, Hash, Instagram, Linkedin, Mail, Search, Twitter } from "lucide-react";

export type Mode =
  | "seo-title"
  | "seo-description"
  | "tweet"
  | "facebook"
  | "linkedin-post"
  | "linkedin-headline"
  | "instagram"
  | "email-subject"
  | "og-title"
  | "og-description"
  | "custom";

// ── Platform configs ───────────────────────────────────────────────

export interface PlatformConfig {
  key: Mode;
  label: string;
  icon: React.ElementType;
  iconColor: string;
  min: number;
  soft: number;   // ideal max
  hard: number;   // absolute limit (for hard-limit platforms)
  hardLimit: boolean;  // true = truncates, false = just a warning
  unit: "chars" | "words";
  hint: string;
  category: "seo" | "social" | "email" | "custom";
  badge?: string;
}

export const PLATFORMS: PlatformConfig[] = [
  // SEO
  {
    key: "seo-title", label: "SEO Title Tag", icon: Search, iconColor: "text-blue-500",
    min: 30, soft: 60, hard: 70, hardLimit: false, unit: "chars",
    hint: "Google truncates titles over ~60 chars. Keep primary keyword near the start.",
    category: "seo", badge: "Google",
  },
  {
    key: "seo-description", label: "Meta Description", icon: FileText, iconColor: "text-blue-500",
    min: 70, soft: 160, hard: 180, hardLimit: false, unit: "chars",
    hint: "Google truncates around 155–160 chars on desktop. Use the full limit.",
    category: "seo",
  },
  {
    key: "og-title", label: "OG Title", icon: Globe, iconColor: "text-blue-500",
    min: 30, soft: 95, hard: 110, hardLimit: false, unit: "chars",
    hint: "Open Graph title used by Facebook & LinkedIn. ~95 chars before truncation.",
    category: "seo",
  },
  {
    key: "og-description", label: "OG Description", icon: Globe, iconColor: "text-blue-500",
    min: 60, soft: 200, hard: 250, hardLimit: false, unit: "chars",
    hint: "Open Graph description. Facebook shows ~200 chars.",
    category: "seo",
  },
  // Social
  {
    key: "tweet", label: "Tweet / X Post", icon: Twitter, iconColor: "text-[#000000] dark:text-white",
    min: 0, soft: 280, hard: 280, hardLimit: true, unit: "chars",
    hint: "Twitter/X limits posts to 280 characters. URLs count as 23 chars.",
    category: "social", badge: "X",
  },
  {
    key: "facebook", label: "Facebook Post", icon: Facebook, iconColor: "text-[#1877f2]",
    min: 0, soft: 80, hard: 63206, hardLimit: false, unit: "chars",
    hint: "Optimal length is under 80 chars for max engagement. Facebook shows 'See more' after ~280 chars on mobile.",
    category: "social",
  },
  {
    key: "linkedin-post", label: "LinkedIn Post", icon: Linkedin, iconColor: "text-[#0077b5]",
    min: 0, soft: 300, hard: 3000, hardLimit: false, unit: "chars",
    hint: "LinkedIn shows 'See more' after ~210 chars on mobile, ~700 on desktop. Ideal: 150–300 chars.",
    category: "social",
  },
  {
    key: "linkedin-headline", label: "LinkedIn Headline", icon: Linkedin, iconColor: "text-[#0077b5]",
    min: 0, soft: 120, hard: 220, hardLimit: true, unit: "chars",
    hint: "LinkedIn profile headline has a 220 char limit. Around 120 chars shows without truncation in search.",
    category: "social",
  },
  {
    key: "instagram", label: "Instagram Caption", icon: Instagram, iconColor: "text-[#e1306c]",
    min: 0, soft: 150, hard: 2200, hardLimit: false, unit: "chars",
    hint: "Instagram caps at 2200 chars but 'More' appears after ~125 chars. Keep captions punchy.",
    category: "social",
  },
  // Email
  {
    key: "email-subject", label: "Email Subject Line", icon: Mail, iconColor: "text-amber-500",
    min: 0, soft: 50, hard: 78, hardLimit: false, unit: "chars",
    hint: "Most email clients show 40–60 chars. Mobile shows even fewer (~30). Keep it under 50.",
    category: "email",
  },
  // Custom
  {
    key: "custom", label: "Custom Limit", icon: Hash, iconColor: "text-muted-foreground",
    min: 0, soft: 0, hard: 0, hardLimit: false, unit: "chars",
    hint: "Set your own character limit.",
    category: "custom",
  },
];

// ── Helpers ────────────────────────────────────────────────────────

export function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function fmtNum(n: number): string {
  return n.toLocaleString();
}

type StatusLevel = "empty" | "too-short" | "ideal" | "warning" | "over";

export function getStatus(len: number, cfg: PlatformConfig, customSoft: number): StatusLevel {
  const soft = cfg.key === "custom" ? customSoft : cfg.soft;
  if (len === 0) return "empty";
  if (cfg.min > 0 && len < cfg.min) return "too-short";
  if (len <= soft) return "ideal";
  if (len <= cfg.hard) return "warning";
  return "over";
}

export const STATUS_COLOR: Record<StatusLevel, string> = {
  empty: "text-muted-foreground/40",
  "too-short": "text-amber-500",
  ideal: "text-emerald-500",
  warning: "text-amber-500",
  over: "text-red-500",
};

export const STATUS_BAR: Record<StatusLevel, string> = {
  empty: "bg-border",
  "too-short": "bg-amber-400",
  ideal: "bg-emerald-500",
  warning: "bg-amber-400",
  over: "bg-red-500",
};

export const STATUS_BG: Record<StatusLevel, string> = {
  empty: "border-border bg-card",
  "too-short": "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10",
  ideal: "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10",
  warning: "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10",
  over: "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10",
};