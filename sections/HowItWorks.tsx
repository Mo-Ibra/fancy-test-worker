"use client";

import { MousePointerClick, Sliders, Download, Search, UserX, Infinity, Gift, ShieldCheck } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";


export default function HowItWorks() {

  const t = useTranslations("sections.HowItWorks");
  const locale = useLocale();
  const isAr = locale === "ar";

  const steps = [
    {
      number: "01",
      icon: Search,
      title: t("howitworks.steps.first"),
      description: t("howitworks.steps.firstDescription"),
    },
    {
      number: "02",
      icon: MousePointerClick,
      title: t("howitworks.steps.second"),
      description: t("howitworks.steps.secondDescription"),
    },
    {
      number: "03",
      icon: Sliders,
      title: t("howitworks.steps.third"),
      description: t("howitworks.steps.thirdDescription"),
    },
    {
      number: "04",
      icon: Download,
      title: t("howitworks.steps.forth"),
      description: t("howitworks.steps.forthDescription"),
    },
  ];

  const perks = [
    {
      icon: UserX,
      title: t("howitworks.perks.first"),
      description: t("howitworks.perks.firstDescription"),
    },
    {
      icon: Infinity,
      title: t("howitworks.perks.second"),
      description: t("howitworks.perks.secondDescription"),
    },
    {
      icon: Gift,
      title: t("howitworks.perks.third"),
      description: t("howitworks.perks.thirdDescription"),
    },
    {
      icon: ShieldCheck,
      title: t("howitworks.perks.forth"),
      description: t("howitworks.perks.forthDescription"),
    },
  ];

  return (
    <section className="relative bg-muted/30 py-24 overflow-hidden border-y border-border/50">

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />

      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-blue-500/5 dark:bg-blue-500/4 blur-[120px] pointer-events-none dark:hidden" />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Header ── */}
        <div className="text-center mb-20 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
            <MousePointerClick className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-blue-500 tracking-wide uppercase">{t("howitworks.badge")}</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
            {t("howitworks.titleFirst")}{" "}
            <span className="text-blue-500">{t("howitworks.titleSecond")}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("howitworks.description")}
          </p>
        </div>

        {/* ── Steps ── */}
        <div className="relative max-w-5xl mx-auto mb-24">

          {/* Connecting line (desktop) */}
          <div className={`hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px ${isAr ? "-scale-x-100" : ""}`}>
            <div className="w-full h-full bg-linear-to-r from-blue-500/10 via-blue-500/40 to-blue-500/10" />
            {/* Animated travel dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              style={{ animation: "travelLine 3s ease-in-out infinite" }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group flex flex-col items-center text-center"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-card border border-border shadow-sm group-hover:border-blue-500 group-hover:shadow-md group-hover:shadow-blue-500/10 transition-all duration-300 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{i + 1}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-card-foreground mb-2 group-hover:text-blue-500 transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Perks Grid ── */}
        <div className="max-w-5xl mx-auto">
          {/* Divider label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest whitespace-nowrap">
              {t("howitworks.whyus")}
            </span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="group p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors duration-200">
                    <Icon className="w-5 h-5 text-blue-500" />
                  </div>

                  <h4 className="text-sm font-bold text-card-foreground mb-1.5 group-hover:text-blue-500 transition-colors duration-200">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />

      <style jsx>{`
        @keyframes travelLine {
          0%   { left: 0%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}