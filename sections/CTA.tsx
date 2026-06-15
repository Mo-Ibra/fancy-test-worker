"use client";

import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Infinity, Star, ArrowLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedPath } from "@/lib/i18n";

export default function CTA() {

  const t = useTranslations("sections.CTA");
  const locale = useLocale();
  const isAr = locale === "ar";

  const features = [
    { icon: Zap, label: t("cta.features.1") },
    { icon: ShieldCheck, label: t("cta.features.2") },
    { icon: Infinity, label: t("cta.features.3") },
    { icon: Star, label: t("cta.features.4") },
  ];

  return (
    <section className="relative bg-muted/30 py-24 overflow-hidden border-t border-border/50">

      {/* ── Background decorations ── */}
      {/* Large soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-blue-500/5 dark:bg-blue-500/4 blur-[120px] pointer-events-none dark:hidden" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.01]"
        style={{
          backgroundImage:
            "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Corner accent lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-linear-to-b from-transparent to-blue-500/20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-linear-to-t from-transparent to-blue-500/20" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-blue-500 tracking-wide uppercase">
              {t("cta.badge")}
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
            {t("cta.titleFirst")}{" "}
            <br className="hidden sm:block" />
            <span className="text-blue-500">{t("cta.titleSecond")}</span>
          </h2>

          {/* Subtext */}
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
            {t("cta.description")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href={getLocalizedPath('/tools', locale)}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-base font-semibold shadow-lg shadow-blue-500/10 dark:shadow-none hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
              {t("cta.exploreall")}
              {isAr ? (
                <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              )}
            </Link>

            <Link
              href={getLocalizedPath('/popular-tools', locale)}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-card border border-border hover:border-blue-500/30 text-foreground hover:text-blue-500 text-base font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              {t("cta.mostpopular")}
              {isAr ? (
                <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              )}
            </Link>
          </div>

          {/* Trust features */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm"
              >
                <Icon className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />
    </section>
  );
}