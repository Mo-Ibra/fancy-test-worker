import { useLang, useT } from "@/context/TranslationProvider";
import { getLocalizedPath } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

export default function RelatedTools() {
  const t = useT("pdf-tools/RelatedTools.json");
  const lang = useLang();
  const isAr = lang === "ar";

  return (
    <div className="mt-10 p-6 rounded-2xl border border-border bg-card">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("related.title")}</p>
      <div className="flex flex-wrap gap-3">
        {[
          { label: t("related.merger"), href: getLocalizedPath('/pdf-tools/merger', lang) },
          { label: t("related.splitter"), href: getLocalizedPath('/pdf-tools/splitter', lang) },
          { label: t("related.compressor"), href: getLocalizedPath('/pdf-tools/compressor', lang) },
          { label: t("related.pdfToImages"), href: getLocalizedPath('/pdf-tools/pdf-to-images', lang) },
          { label: t("related.imagesToPdf"), href: getLocalizedPath('/pdf-tools/images-to-pdf', lang) },
        ].map(({ label, href }) => (
          <Link key={label} href={href}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 text-sm font-medium text-foreground transition-all duration-200">
            <FileText className="w-3.5 h-3.5 text-muted-foreground group-hover:text-red-500 transition-colors" />
            {label}
            {isAr ? <ArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" /> : <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />}
          </Link>
        ))}
      </div>
    </div>
  )
}