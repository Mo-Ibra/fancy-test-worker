"use client";

import Link from "next/link";
import {
  Hash,
  CaseSensitive,
  AlignLeft,
  Scissors,
  Search,
  Replace,
  RemoveFormatting,
  WrapText,
  ArrowLeftRight,
  Sigma,
  LetterText,
  ClipboardList,
  ArrowRight,
  Sparkles,
  Type,
  Star,
  LucideIcon,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { useLang, useT } from "@/context/TranslationProvider";
import { getLocalizedPath } from "@/lib/i18n";

import { Tool } from "@/types/tools";

const ICON_MAP: Record<string, LucideIcon> = {
  Hash,
  CaseSensitive,
  AlignLeft,
  Scissors,
  Search,
  Replace,
  RemoveFormatting,
  WrapText,
  ArrowLeftRight,
  Sigma,
  LetterText,
  ClipboardList,
};

export default function Tools({ tools, title, customTitle, hideBreadcrumb }: { tools: Tool[], title: string; customTitle?: string; hideBreadcrumb?: boolean }) {
  const t = useT("sections/ToolsList.json");
  const categoriesT = useT("sections/Categories.json");
  const commonT = useT();

  const lang = useLang();
  const isAr = lang === "ar";

  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = tools.filter((tool) => {
    const label = t(tool.label).toLowerCase();
    const description = t(tool.description).toLowerCase();
    const s = search.toLowerCase();
    return label.includes(s) || description.includes(s);
  });

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1]"
        style={{
          backgroundImage: "radial-gradient(circle, #BFDBFE 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Soft glow top-left */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[400px] rounded-full bg-blue-100/50 dark:bg-blue-900/10 blur-[100px] pointer-events-none dark:hidden" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-50/60 dark:bg-blue-900/10 blur-[80px] pointer-events-none dark:hidden" />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Header ── */}
        <div className="mb-14">
          {/* Breadcrumb */}
          {!hideBreadcrumb && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link href={getLocalizedPath('/tools', lang)} className="hover:text-blue-500 transition-colors">{commonT('common.alltools')}</Link>
              <span>/</span>
              <span className="text-foreground font-medium">{categoriesT(title)}</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            {/* Left: title */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 mb-4">
                <Type className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wide">{customTitle || categoriesT(title)}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3">
                {customTitle ? customTitle : (
                  <>
                    {commonT('common.every')} {categoriesT(title)}
                    <br />
                    <span className="text-blue-500">{commonT('common.youllEverNeed')}</span>
                  </>
                )}
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                <span className="text-blue-500 font-bold">{tools.length} {commonT('common.freeTools')}</span> — {commonT('common.disclaimer')}
              </p>
            </div>

            {/* Right: stats */}
            <div className="flex items-center gap-6 lg:gap-8 shrink-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{tools.length}</div>
                <div className="text-xs text-muted-foreground font-medium mt-0.5">{commonT('common.freeTools')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">0</div>
                <div className="text-xs text-muted-foreground font-medium mt-0.5">{commonT('common.signupNeeded')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">100%</div>
                <div className="text-xs text-muted-foreground font-medium mt-0.5">{commonT('common.browserBased')}</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8 relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              aria-label="Search tools"
              placeholder={commonT('common.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all duration-200 shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className={`absolute ${isAr ? "left-10" : "right-3.5"} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium`}
              >
                {commonT('common.clear')}
              </button>
            )}
          </div>
        </div>

        {/* ── Featured Tool Spotlight ── */}
        {!search && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">{commonT('common.mostUsed')}</span>
            </div>

            <Link
              href={tools[0].href}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-linear-to-br from-blue-50/50 to-background dark:from-blue-900/20 dark:to-background hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 dark:shadow-blue-900/40 group-hover:scale-105 transition-transform duration-200">
                <Hash className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors duration-200">
                    {t(tools[0].label)}
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {commonT('common.popular')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {commonT('common.mostUsedDescription')}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-500 shrink-0">
                {commonT('common.useTool')}
                {isAr ? (
                  <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </div>
            </Link>
          </div>
        )}

        {/* ── Tools Grid ── */}
        {filtered.length > 0 ? (
          <>
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {search ? `${filtered.length} ${filtered.length !== 1 ? commonT('common.results') : commonT('common.result')} ${commonT('common.for')} "${search}"` : commonT('common.all')}
              </span>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((tool, i) => {
                const Icon = ICON_MAP[tool.icon] || Type;
                return (
                  <Link
                    key={tool.label}
                    href={getLocalizedPath(tool.href, lang)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="group relative flex flex-col p-5 rounded-xl border border-border bg-card hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-50 dark:hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all duration-250"
                  >
                    {/* Badge */}
                    {tool.badge && (
                      <span className={`absolute ${isAr ? "left-4" : "right-4"} top-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${tool.badgeColor}`}>
                        {commonT(tool.badge)}
                      </span>
                    )}

                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors duration-200">
                      <Icon className="w-5 h-5 text-blue-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-sm font-bold text-foreground mb-1.5 group-hover:text-blue-500 transition-colors duration-200">
                      {t(tool.label)}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                      {t(tool.description)}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {commonT('common.openTool')}
                      {isAr ? (
                        <ArrowLeft className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                      ) : (
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold mb-1">{commonT('common.noToolsFound')}</p>
            <p className="text-sm text-muted-foreground">{commonT('common.tryDifferentKeyword')}</p>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        {!search && (
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{commonT('common.needDifferentTool')}</p>
                <p className="text-xs text-muted-foreground">{commonT('common.exploreAllToolsDescription')}</p>
              </div>
            </div>
            <Link
              href={getLocalizedPath('/tools', lang)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors duration-200 shrink-0"
            >
              {commonT('common.browseAllTools')}
              {isAr ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}