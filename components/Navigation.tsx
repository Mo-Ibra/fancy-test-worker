"use client";

import {
  DEFAULT_LANGUAGE,
  detectLanguage,
  getLocalizedPath,
  Language,
  LANGUAGE_NAMES,
  stripLanguageFromPath,
  SUPPORTED_LANGUAGES,
} from "@/lib/i18n";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
} from "./ui/dropdown-menu";
import NavLink from "../sections/NavLink";
import { getPath } from "@/helpers/funcs";
import { useT } from "@/context/TranslationProvider";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
  Zap,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { useTheme } from "next-themes";

interface NavigationProps {
  language?: Language;
}

import { toolCategories, featuredTool } from "@/constants/navigationLinks";

// ── Component ───────────────────────────────────────────────────
export default function Navigation({ language = DEFAULT_LANGUAGE }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentLanguage = detectLanguage(pathname);
  const t = useT("sections/Navigation.json");

  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const megaRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLanguageChange = (lang: Language) => {
    const cleanPath = stripLanguageFromPath(pathname);
    const newPath = getLocalizedPath(cleanPath, lang);
    router.push(newPath);
  };

  // Close mega menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on route change
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const openMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaOpen(true);
  };

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 150);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">

            {/* ── Logo ── */}
            <Link
              href={getLocalizedPath("/", currentLanguage)}
              className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-200">
                <Zap className="w-4 h-4 text-blue-500" />
              </div>
              <span>
                Fancy<span className="text-blue-500">Toolbox</span>
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink href={getLocalizedPath("/", currentLanguage)} label={t("nav.home")} />

              {/* Tools trigger */}
              <div ref={megaRef} onMouseEnter={openMenu} onMouseLeave={closeMenu}>
                <button
                  onClick={() => setMegaOpen((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${megaOpen
                    ? "text-blue-500 bg-blue-50"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                >
                  {t("nav.tools")}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${megaOpen ? "rotate-180 text-blue-500" : ""}`}
                  />
                </button>

                {/* ── Mega Menu ── */}
                {megaOpen && (
                  <div className="absolute top-full left-0 right-0 mt-0 z-50 border-b border-border bg-background shadow-xl shadow-muted/20 dark:shadow-blue-900/20">
                    <div className="container mx-auto px-4 py-8">
                      <div className="grid grid-cols-7 gap-8">

                        {/* Categories — 6 cols */}
                        <div className="col-span-6 grid grid-cols-3 lg:grid-cols-6 gap-6">
                          {toolCategories.map((cat) => {
                            const CatIcon = cat.icon;
                            return (
                              <div key={cat.title}>
                                {/* Category header */}
                                <Link
                                  href={getPath(cat.href, currentLanguage)}
                                  className="group/cat flex items-center gap-2 mb-3"
                                >
                                  <div className={`w-7 h-7 rounded-lg ${cat.bg} dark:bg-blue-500/10 flex items-center justify-center shrink-0`}>
                                    <CatIcon className={`w-4 h-4 ${cat.color} dark:text-blue-400`} />
                                  </div>
                                  <span className={`text-xs font-bold uppercase tracking-wider ${cat.color} dark:text-blue-400 group-hover/cat:underline`}>
                                    {t(cat.title)}
                                  </span>
                                </Link>

                                {/* Tools list */}
                                <ul className="space-y-1">
                                  {cat.tools.map((tool) => {
                                    const TIcon = tool.icon;
                                    return (
                                      <li key={tool.label}>
                                        <Link
                                          href={getPath(tool.href, currentLanguage)}
                                          className="group/tool flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
                                        >
                                          <TIcon className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-150 shrink-0" />
                                          {t(tool.label)}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                  <li>
                                    <Link
                                      href={getPath(cat.href, currentLanguage)}
                                      className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold ${cat.color} dark:text-blue-400 hover:underline transition-colors duration-150`}
                                    >
                                      {t(cat.allToolsText)}
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            );
                          })}
                        </div>

                        {/* Featured tool — 1 col */}
                        <div className="col-span-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-3">
                            {t("featured.title")}
                          </p>
                          <Link
                            href={getPath(featuredTool.href, currentLanguage)}
                            className="group/feat block p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-linear-to-br from-blue-50/50 to-background dark:from-blue-900/10 dark:to-background hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-muted-foreground">{t(featuredTool.label)}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">
                                {t(featuredTool.badge)}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-foreground group-hover/feat:text-blue-500 transition-colors duration-200 mb-1">
                              {t(featuredTool.title)}
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {t(featuredTool.description)}
                            </p>
                            <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-500">
                              {t("featured.pdfCompressor.tryItNow")}
                              <ArrowRight className="w-3 h-3 group-hover/feat:translate-x-0.5 transition-transform duration-200" />
                            </div>
                          </Link>

                          {/* All tools link */}
                          <Link
                            href={getPath("/tools", currentLanguage)}
                            className="group/all mt-4 flex items-center justify-between px-3 py-2.5 rounded-lg bg-foreground dark:bg-accent border border-border hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors duration-200"
                          >
                            <span className="text-xs font-semibold text-background">{t("browseAllTools")}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:all:text-white group-hover/all:translate-x-0.5 transition-all duration-200" />
                          </Link>
                        </div>

                      </div>

                      {/* Bottom strip */}
                      <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-500" />
                          <span className="text-xs text-muted-foreground">
                            {t("allToolsAreFree")}
                          </span>
                        </div>
                        <Link
                          href={getPath("/tools/new", currentLanguage)}
                          className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200 flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          {t("newThisMonth")}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* <NavLink href={getPath("/articles", currentLanguage)} label={t("nav.articles")} /> */}
              <NavLink href={getPath("/about", currentLanguage)} label={t("nav.about")} />
            </div>

            {/* ── Right side ── */}
            <div className="flex items-center gap-2">

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}

              {/* Language switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200 border border-border">
                    <Globe className="w-4 h-4" />
                    <span>{language.toUpperCase()}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[140px]">
                  {SUPPORTED_LANGUAGES.map((supportedLocale) => (
                    <DropdownMenuItem
                      key={supportedLocale}
                      onClick={() => handleLanguageChange(supportedLocale)}
                      className={`flex items-center gap-2 ${language === supportedLocale ? "bg-accent font-semibold" : ""}`}
                    >
                      {language === supportedLocale && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                      {LANGUAGE_NAMES[supportedLocale]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background overflow-y-auto md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-6 space-y-1">
            <Link href={getLocalizedPath("/", currentLanguage)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-blue-500 transition-colors">
              {t("nav.home")}
            </Link>

            {/* Mobile tools accordion */}
            <div>
              <button
                onClick={() => setMobileToolsOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                {t("nav.tools")}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileToolsOpen ? "rotate-180 text-blue-500" : ""}`} />
              </button>

              {mobileToolsOpen && (
                <div className="mt-1 ml-3 space-y-4 pb-2">
                  {toolCategories.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <div key={cat.title}>
                        <Link
                          href={getPath(cat.href, currentLanguage)}
                          className="flex items-center gap-2 px-3 py-1.5 mb-1"
                        >
                          <div className={`w-6 h-6 rounded-md ${cat.bg} dark:bg-blue-500/10 flex items-center justify-center`}>
                            <CatIcon className={`w-3.5 h-3.5 ${cat.color} dark:text-blue-400`} />
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-wider ${cat.color} dark:text-blue-400`}>
                            {cat.title}
                          </span>
                        </Link>
                        <div className="grid grid-cols-2 gap-1 ml-2">
                          {cat.tools.map((tool) => {
                            const TIcon = tool.icon;
                            return (
                              <Link
                                key={tool.label}
                                href={getPath(tool.href, currentLanguage)}
                                className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-blue-500 transition-colors"
                              >
                                <TIcon className="w-3 h-3 text-muted-foreground shrink-0" />
                                {tool.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  <Link
                    href={getPath("/tools", currentLanguage)}
                    className="flex items-center gap-2 mx-3 px-4 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold"
                  >
                    <Zap className="w-4 h-4" />
                    {t("browseAllTools")}
                  </Link>
                </div>
              )}
            </div>

            <Link href={getPath("/articles", currentLanguage)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-blue-500 transition-colors">
              {t("nav.articles")}
            </Link>
            <Link href={getPath("/about", currentLanguage)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-blue-500 transition-colors">
              {t("nav.about")}
            </Link>

            {/* Mobile language switcher */}
            <div className="pt-4 border-t border-border mt-4">
              <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("mobileLanguageSwitcher")}</p>
              <div className="flex flex-wrap gap-2 px-3">
                {SUPPORTED_LANGUAGES.map((supportedLocale) => (
                  <button
                    key={supportedLocale}
                    onClick={() => handleLanguageChange(supportedLocale)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${language === supportedLocale
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-border text-muted-foreground hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-500"
                      }`}
                  >
                    {LANGUAGE_NAMES[supportedLocale]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}