import { Info } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function WhatCanonical() {
  const t = useT("seo-tools/CanonicalTagGeneratorTool.json");
  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-blue-400" /> {t("about.title")}
      </p>
      <div className="flex flex-col gap-2 text-[10px] text-muted-foreground leading-relaxed">
        <p>{t("about.desc")}</p>
        <p>{t("about.useCases")}</p>
        <div className="flex flex-col gap-1 pl-2">
          {[
            t("about.wwwVsNonWww"),
            t("about.httpVsHttps"),
            t("about.trailingSlash"),
            t("about.utmParams"),
            t("about.paginated"),
            t("about.syndicated"),
            t("about.printerFriendly"),
          ].map((item, i) => (
            <p key={i} className="flex items-start gap-1.5">
              <span className="text-blue-400 shrink-0">›</span> {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}