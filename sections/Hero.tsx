"use client";

import { Button } from "@/components/ui/button";
import {
  FileText,
  Image,
  FileIcon,
  Type,
  Code2,
  Scissors,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Hero() {

  const t = useTranslations("sections.Hero");
  const locale = useLocale();
  const isAr = locale === "ar";

  const floatingTools = [
    { icon: FileText, label: t("hero.floatingTools.pdfMerger"), category: "PDF", delay: "0s", x: "-left-4", y: "top-16" },
    { icon: Image, label: t("hero.floatingTools.imageResizer"), category: "Image", delay: "0.3s", x: "right-0", y: "top-8" },
    { icon: Type, label: t("hero.floatingTools.wordCounter"), category: "Text", delay: "0.6s", x: "-left-8", y: "bottom-20" },
    { icon: Code2, label: t("hero.floatingTools.jsonFormatter"), category: "Code", delay: "0.9s", x: "right-4", y: "bottom-12" },
    { icon: Scissors, label: t("hero.floatingTools.pdfSplitter"), category: "PDF", delay: "1.2s", x: "left-1/4", y: "-top-4" },
    { icon: FileIcon, label: t("hero.floatingTools.fileConverter"), category: "Files", delay: "1.5s", x: "right-1/3", y: "-top-6" },
  ];

  const categoryBadges = [
    { label: t("hero.categoryBadges.textTools"), color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { label: t("hero.categoryBadges.imageTools"), color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
    { label: t("hero.categoryBadges.pdfTools"), color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    { label: t("hero.categoryBadges.codeTools"), color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  ];

  return (
    <section className="relative min-h-[94vh] overflow-hidden flex items-center">

      <div className="relative z-10 container mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ══ Left Column: Content ══ */}
          <div className="space-y-8 transition-all duration-1000 opacity-100 translate-y-0">

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/25 bg-blue-500/8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-500 tracking-wide">
                {t("hero.badge")}
              </span>
            </div>

            {/* Main headline */}
            <div className="space-y-3">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
                <span>{t("hero.titleFirst")}</span>
                <br />
                <span
                  className="text-blue-500"
                >
                  {t("hero.titleSecond")}
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg font-light">
                {t("hero.description")}
              </p>
            </div>

            {/* Category badges */}
            <div className="flex flex-wrap gap-2">
              {categoryBadges.map((badge) => (
                <span
                  key={badge.label}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${badge.color} backdrop-blur-sm transition-transform hover:scale-105 cursor-default`}
                >
                  {badge.label}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/tools">
                <Button
                  size="lg"
                  className="group relative px-8 py-6 text-base cursor-pointer font-semibold bg-blue-600 hover:bg-blue-500 text-white border-0 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.2)] dark:shadow-none hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300"
                >
                  <Zap className="w-5 h-5 me-2 group-hover:rotate-12 transition-transform duration-200" />
                  {t("hero.ctaButtons.getStartedFree")}
                </Button>
              </Link>
              <Link href="#tools">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base font-semibold cursor-pointer rounded-xl bg-background/50 backdrop-blur-sm border-border hover:bg-accent transition-all duration-300"
                >
                  {t("hero.ctaButtons.browseAllTools")}
                  {isAr ? (
                    <ArrowLeft className="w-4 h-4 ms-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 ms-2" />
                  )}
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>{t("hero.trustIndicators.dataStaysOnDevice")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>{t("hero.trustIndicators.fastAndNoInstallation")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>{t("hero.trustIndicators.constantlyUpdated")}</span>
              </div>
            </div>
          </div>

          {/* ══ Right Column: Visual ══ */}
          <div
            className="relative h-[500px] transition-all duration-1000 delay-300"
          >
            {/* Central hub */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Orbit rings */}
              <div className="absolute w-72 h-72 rounded-full border border-blue-500/10 animate-[spin_30s_linear_infinite]" />
              <div className="absolute w-96 h-96 rounded-full border border-blue-500/8 animate-[spin_45s_linear_infinite_reverse]" />
              <div className="absolute w-md h-112 rounded-full border border-indigo-500/6 animate-[spin_60s_linear_infinite]" />

              {/* Center card */}
              <div className="relative z-10 w-36 h-36 rounded-2xl border border-border bg-card/50 backdrop-blur-md cursor-pointer flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Floating tool cards */}
            {floatingTools.map((tool, i) => {
              const Icon = tool.icon;
              const positions = [
                { top: "10%", right: "5%" },
                { top: "25%", left: "2%" },
                { top: "55%", right: "0%" },
                { bottom: "20%", left: "5%" },
                { top: "5%", left: "30%" },
                { bottom: "10%", right: "15%" },
              ];
              return (
                <div
                  key={tool.label}
                  className="absolute group cursor-pointer"
                  style={{
                    ...positions[i],
                    animationDelay: tool.delay,
                    animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
                  }}
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-sm hover:border-blue-500/20 hover:bg-blue-500/5 duration-300">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs whitespace-nowrap text-foreground">{tool.label}</p>
                      <p className="text-[10px] text-muted-foreground">{tool.category}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}