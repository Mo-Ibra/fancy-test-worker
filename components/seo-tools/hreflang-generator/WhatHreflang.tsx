import { Info } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function WhatHreflang() {
  const t = useT("seo-tools/HreflangGeneratorTool.json");
  const uses = t("whatIsHreflang.uses") as unknown as string[];

  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-blue-400" /> {t("whatIsHreflang.title")}
      </p>
      <div className="flex flex-col gap-2 text-[10px] text-muted-foreground leading-relaxed">
        <p>{t("whatIsHreflang.description")}</p>
        <p><strong className="text-foreground">{t("whatIsHreflang.whenToUse")}</strong></p>
        {Array.isArray(uses) && uses.map((item, i) => (
          <p key={i} className="flex items-start gap-1.5">
            <span className="text-blue-400 shrink-0">›</span>{item}
          </p>
        ))}
        <p><strong className="text-foreground">x-default</strong> = {t("whatIsHreflang.xDefault").replace("x-default = ", "")}</p>
      </div>
    </div>
  )
}