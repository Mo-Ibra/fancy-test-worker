"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Image,
  Type,
  Code2,
  Calculator,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedPath } from "@/lib/i18n";

export default function Footer() {

  const t = useTranslations("sections.Footer");

  const locale = useLocale();
  const isAr = locale === "ar";

  const toolCategories = [
    { label: t("footer.tools.texttools"), href: getLocalizedPath('/text-tools', locale), icon: Type },
    { label: t("footer.tools.imagetools"), href: getLocalizedPath('/image-tools', locale), icon: Image },
    { label: t("footer.tools.pdftools"), href: getLocalizedPath('/pdf-tools', locale), icon: FileText },
    { label: t("footer.tools.devtools"), href: getLocalizedPath('/dev-tools', locale), icon: Code2 },
    { label: t("footer.tools.mathtools"), href: getLocalizedPath('/math-tools', locale), icon: Calculator },
    { label: t("footer.tools.securitytools"), href: getLocalizedPath('/security-tools', locale), icon: Lock },
  ];

  const company = [
    { label: t("footer.company.about"), href: getLocalizedPath('/about', locale) },
    // { label: t("footer.company.blog"), href: getLocalizedPath('/blog', locale) },
    { label: t("footer.company.changelog"), href: getLocalizedPath('/changelog', locale) },
    { label: t("footer.company.contact"), href: getLocalizedPath('/contact', locale) },
  ];

  const legal = [
    { label: t("footer.legal.privacy"), href: getLocalizedPath('/privacy', locale) },
    { label: t("footer.legal.termsofservices"), href: getLocalizedPath('/terms', locale) },
    { label: t("footer.legal.cookies"), href: getLocalizedPath('/cookies', locale) },
  ];

  return (
    <footer className="relative overflow-hidden bg-background">

      {/* Top glow — mirrors Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-blue-500/5 dark:bg-blue-500/3 blur-[120px] pointer-events-none dark:hidden" />

      {/* Grid pattern — matches Hero */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.01]"
        style={{
          backgroundImage:
            "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border/50 to-transparent" />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Main grid ── */}
        <div className="py-16 lg:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand col — spans 2 */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Logo */}
            <Link href={getLocalizedPath('/', locale)} className="group inline-flex items-center gap-2.5 w-fit">
              <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-blue-500 transition-colors">
                {t("footer.websitename")}
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3 text-foreground/70">
                {t("footer.subscribe")}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  aria-label="Email newsletter"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:border-blue-500/60 transition-all duration-200 text-foreground"
                />
                <button className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 shrink-0">
                  {isAr ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tools col */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-5 text-foreground/70">
              {t("footer.tools.heading")}
            </p>
            <ul className="space-y-3">
              {toolCategories.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2.5 text-sm text-muted-foreground hover:text-blue-500 transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-blue-400 transition-all duration-200 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="group flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-400 font-medium transition-all duration-200 mt-1"
                >
                  {t("footer.alltools")}
                  {isAr ? (
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  )}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company col */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-5 text-foreground/70">
              {t("footer.company.heading")}
            </p>
            <ul className="space-y-3">
              {company.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal col */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-5 text-foreground/70">
              {t("footer.legal.heading")}
            </p>
            <ul className="space-y-3">
              {legal.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Privacy badge */}
            <div className="mt-8 flex items-start gap-2.5 p-3 rounded-lg bg-muted/50 border border-border shadow-sm">
              <Lock className="w-4 h-4 text-blue-500/80 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                {t("footer.disclaimer")}
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60 text-center sm:text-left font-medium">
            © {new Date().getFullYear()} Fancy Toolbox. All rights reserved. Built with care for the open web.
          </p>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-tight">All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}