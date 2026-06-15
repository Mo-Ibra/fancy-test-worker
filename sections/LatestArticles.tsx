"use client";

import Link from "next/link";
import { ArrowRight, Clock, Tag, BookOpen, TrendingUp, ArrowLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const articles = [
  {
    slug: "how-to-compress-pdf-without-losing-quality",
    category: "PDF Tools",
    categoryColor: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
    title: "How to Compress a PDF Without Losing Quality",
    excerpt:
      "Large PDF files slowing you down? Learn the best techniques to shrink your PDFs while keeping text sharp and images crisp — no desktop software needed.",
    readTime: "4 min read",
    date: "Mar 5, 2026",
    featured: true,
    gradient: "from-rose-50 to-white dark:from-rose-500/5 dark:to-card",
    accentColor: "text-rose-500 dark:text-rose-400",
    borderHover: "hover:border-rose-200 dark:hover:border-rose-500/30",
  },
  {
    slug: "best-free-image-resizer-tools-online",
    category: "Image Tools",
    categoryColor: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
    title: "The Best Free Image Resizer Tools Online in 2026",
    excerpt:
      "Resizing images shouldn't be a chore. We compare the top free browser-based tools so you can find the one that fits your workflow.",
    readTime: "6 min read",
    date: "Feb 28, 2026",
    featured: false,
    gradient: "from-violet-50 to-white dark:from-violet-500/5 dark:to-card",
    accentColor: "text-violet-500 dark:text-violet-400",
    borderHover: "hover:border-violet-200 dark:hover:border-violet-500/30",
  },
  {
    slug: "json-formatter-guide-for-developers",
    category: "Developer Tools",
    categoryColor: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    title: "A Developer's Guide to JSON Formatting & Validation",
    excerpt:
      "Messy JSON is a debugging nightmare. This guide covers formatting, validation, and the most common pitfalls developers run into.",
    readTime: "5 min read",
    date: "Feb 20, 2026",
    featured: false,
    gradient: "from-emerald-50 to-white dark:from-emerald-500/5 dark:to-card",
    accentColor: "text-emerald-500 dark:text-emerald-400",
    borderHover: "hover:border-emerald-200 dark:hover:border-emerald-500/30",
  },
  {
    slug: "word-counter-tips-for-writers",
    category: "Text Tools",
    categoryColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    title: "5 Ways a Word Counter Can Improve Your Writing",
    excerpt:
      "Word counts are not just for assignments. Discover how tracking your words, sentences, and reading time can sharpen any piece of writing.",
    readTime: "3 min read",
    date: "Feb 14, 2026",
    featured: false,
    gradient: "from-blue-50 to-white dark:from-blue-500/5 dark:to-card",
    accentColor: "text-blue-500 dark:text-blue-400",
    borderHover: "hover:border-blue-200 dark:hover:border-blue-500/30",
  },
];

export default function LatestArticles() {
  const [featured, ...rest] = articles;

  const t = useTranslations("sections.LatestArticles");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="relative bg-background py-24 overflow-hidden border-b border-border/50">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />

      {/* BG blobs */}
      <div className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full bg-blue-500/5 dark:bg-blue-500/4 blur-[100px] pointer-events-none dark:hidden" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-500/4 dark:bg-blue-500/2 blur-[80px] pointer-events-none dark:hidden" />

      <div className="relative z-10 container mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-500 tracking-wide uppercase">{t("latestarticles.badge")}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {t("latestarticles.titleFirst")}{" "}
              <span className="text-blue-500">{t("latestarticles.titleSecond")}</span>
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-md">
              {t("latestarticles.description")}
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200 whitespace-nowrap mb-1"
          >
            {t("latestarticles.viewall")}
            {isAr ? (
              <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            )}
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Featured — spans 2 cols */}
          <Link
            href={`/blog/${featured.slug}`}
            className={`group lg:col-span-2 relative flex flex-col justify-between p-8 rounded-2xl border border-border bg-card/10 ${featured.borderHover} hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
          >
            <div className={`absolute ${isAr ? "left-5" : "right-5"} top-5`}>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border shadow-sm">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                <span className="text-[11px] font-semibold text-muted-foreground">Featured</span>
              </div>
            </div>

            <div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${featured.categoryColor} mb-5`}>
                <Tag className="w-3 h-3" />
                {featured.category}
              </span>

              <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-snug mb-4 group-hover:text-blue-500 transition-colors duration-200 max-w-lg">
                {featured.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed text-base max-w-lg">
                {featured.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center gap-4 text-sm text-muted-foreground/60">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime}
                </span>
                <span>{featured.date}</span>
              </div>
              <div className={`flex items-center gap-1.5 text-sm font-semibold ${featured.accentColor}`}>
                Read article
                {isAr ? (
                  <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </div>
            </div>
          </Link>

          {/* Side cards */}
          <div className="flex flex-col gap-5">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className={`group flex flex-col justify-between p-6 rounded-2xl border border-border bg-linear-to-br ${article.gradient} ${article.borderHover} hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-300 flex-1`}
              >
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${article.categoryColor} mb-3 w-fit`}>
                  <Tag className="w-3 h-3" />
                  {article.category}
                </span>

                <h3 className="text-sm font-bold text-foreground leading-snug mb-2 group-hover:text-blue-500 transition-colors duration-200 line-clamp-2">
                  {article.title}
                </h3>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                    <span>{article.date}</span>
                  </div>
                  {isAr ? (
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                  ) : (
                    <ArrowRight className={`w-3.5 h-3.5 ${article.accentColor} group-hover:translate-x-1 transition-transform duration-200`} />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />
    </section>
  );
}