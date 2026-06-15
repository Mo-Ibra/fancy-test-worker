"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Type,
  Image,
  FileText,
  Code2,
  Calculator,
  Lock,
  Music,
  Globe,
  ArrowRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useLang, useT } from "@/context/TranslationProvider";
import { getLocalizedPath } from "@/lib/i18n";

const colorMap: Record<string, { bg: string; iconBg: string; iconColor: string; tag: string; border: string; hoverBorder: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    iconBg: "bg-blue-100 dark:bg-blue-500/20",
    iconColor: "text-blue-500 dark:text-blue-400",
    tag: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-500/20",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-500/40"
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    iconBg: "bg-violet-100 dark:bg-violet-500/20",
    iconColor: "text-violet-500 dark:text-violet-400",
    tag: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-500/20",
    hoverBorder: "hover:border-violet-300 dark:hover:border-violet-500/40"
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-500/10",
    iconBg: "bg-rose-100 dark:bg-rose-500/20",
    iconColor: "text-rose-500 dark:text-rose-400",
    tag: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-500/20",
    hoverBorder: "hover:border-rose-300 dark:hover:border-rose-500/40"
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    tag: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-500/20",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-500/40"
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    iconBg: "bg-amber-100 dark:bg-amber-500/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    tag: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-500/20",
    hoverBorder: "hover:border-amber-300 dark:hover:border-amber-500/40"
  },
  slate: {
    bg: "bg-slate-50 dark:bg-slate-500/10",
    iconBg: "bg-slate-200 dark:bg-slate-500/20",
    iconColor: "text-slate-500 dark:text-slate-400",
    tag: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-500/20",
    hoverBorder: "hover:border-slate-400 dark:hover:border-slate-500/40"
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-500/10",
    iconBg: "bg-pink-100 dark:bg-pink-500/20",
    iconColor: "text-pink-500 dark:text-pink-400",
    tag: "bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400",
    border: "border-pink-100 dark:border-pink-500/20",
    hoverBorder: "hover:border-pink-300 dark:hover:border-pink-500/40"
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-500/10",
    iconBg: "bg-sky-100 dark:bg-sky-500/20",
    iconColor: "text-sky-500 dark:text-sky-400",
    tag: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
    border: "border-sky-100 dark:border-sky-500/20",
    hoverBorder: "hover:border-sky-300 dark:hover:border-sky-500/40"
  },
};

export default function Categories() {

  const [hovered, setHovered] = useState<number | null>(null);

  const t = useT("sections/Categories.json");
  const lang = useLang();
  const isAr = lang === "ar";

  const categories = [
    {
      icon: Type,
      title: t("categories.tools.text.title"),
      description: t("categories.tools.text.description"),
      count: 9,
      color: "blue",
      href: "/text-tools",
      tools: t("categories.tools.text.tools")
    },
    {
      icon: Image,
      title: t("categories.tools.image.title"),
      description: t("categories.tools.image.description"),
      count: 10,
      color: "violet",
      href: "/image-tools",
      tools: t("categories.tools.image.tools"),
    },
    {
      icon: FileText,
      title: t("categories.tools.pdf.title"),
      description: t("categories.tools.pdf.description"),
      count: 9,
      color: "rose",
      href: "/pdf-tools",
      tools: t("categories.tools.pdf.tools"),
    },
    {
      icon: Code2,
      title: t("categories.tools.developer.title"),
      description: t("categories.tools.developer.description"),
      count: 12,
      color: "emerald",
      href: "/dev-tools",
      tools: t("categories.tools.developer.tools"),
    },
    {
      icon: Calculator,
      title: t("categories.tools.math.title"),
      description: t("categories.tools.math.description"),
      count: 9,
      color: "amber",
      href: "/math-tools",
      tools: t("categories.tools.math.tools"),
    },
    {
      icon: Lock,
      title: t("categories.tools.security.title"),
      description: t("categories.tools.security.description"),
      count: 7,
      color: "slate",
      href: "/security-tools",
      tools: t("categories.tools.security.tools"),
    },
    {
      icon: Globe,
      title: t("categories.tools.seo.title"),
      description: t("categories.tools.seo.description"),
      count: 14,
      color: "sky",
      href: "/seo-tools",
      tools: t("categories.tools.seo.tools"),
    },
  ];

  return (
    <section className="relative bg-background py-24 overflow-hidden">

      {/* Subtle top divider accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />

      {/* Very faint dot grid */}
      <div
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, #3B82F6 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Soft blue tint blobs */}
      <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/4 blur-[100px] pointer-events-none dark:hidden" />
      <div className="absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/4 blur-[80px] pointer-events-none dark:hidden" />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Section Header ── */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-blue-500 tracking-wide uppercase">{t("categories.badge")}</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
            {t("categories.titleFirst")}{" "}
            <span className="text-blue-500 relative inline-block">
              {t("categories.titleSecond")}
              {/* Underline decoration */}
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
                <path d="M0 5 Q50 1 100 4 Q150 7 200 3" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("categories.description")}
          </p>
        </div>

        {/* ── Categories Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => {
            const c = colorMap[cat.color];
            const Icon = cat.icon;
            const isHovered = hovered === i;

            return (
              <Link
                key={cat.title}
                href={getLocalizedPath(cat.href, lang)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`
                  group relative flex flex-col p-6 rounded-2xl border bg-card/50 backdrop-blur-sm
                  transition-all duration-300 cursor-pointer text-card-foreground
                  ${c.border} ${c.hoverBorder}
                  hover:shadow-lg hover:-translate-y-1
                `}
                style={{
                  animationDelay: `${i * 60}ms`,
                }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${c.iconColor}`} />
                </div>

                {/* Title + count */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-bold text-card-foreground group-hover:text-blue-500 transition-colors duration-200">
                    {cat.title}
                  </h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.tag} ml-2 mt-0.5 shrink-0`}>
                    {cat.count}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {cat.description}
                </p>

                {/* Tool pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cat.tools.split(",").map((tool: string) => (
                    <span
                      key={tool}
                      className="text-[11px] font-medium px-2 py-1 rounded-md bg-muted text-muted-foreground"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className={`flex items-center gap-1 text-sm font-semibold ${c.iconColor} transition-all duration-200`}>
                  <span>{t("categories.exploreTools")}</span>
                  {isAr ? (
                    <ArrowLeft className="w-4 h-4 me-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 me-2" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-14 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            {t("categories.ctaButton.description")}
          </p>
          <Link
            href={getLocalizedPath("/", lang)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            {t("categories.ctaButton.text")}
            {isAr ? (
              <ArrowLeft className="w-4 h-4 me-2" />
            ) : (
              <ArrowRight className="w-4 h-4 me-2" />
            )}
          </Link>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />
    </section>
  );
}