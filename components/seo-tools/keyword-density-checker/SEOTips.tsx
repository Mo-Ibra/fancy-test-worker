import { TrendingUp, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

interface SEOTipsProps {
  keywords: any[];
  stats: any;
  targetKeyword: string;
  targetInfo: any;
}

export default function SEOTips({ keywords, stats, targetKeyword, targetInfo }: SEOTipsProps) {
  const t = useT("seo-tools/KeywordDensityCheckerTool.json");
  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> {t("seoInsights.title")}
      </p>
      <div className="flex flex-col gap-2 text-[10px] text-muted-foreground">
        {stats.wordCount < 300 && (
          <p className="flex items-start gap-1.5 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" /> {t("seoInsights.under300Words")}
          </p>
        )}
        {stats.wordCount >= 600 && (
          <p className="flex items-start gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" /> {t("seoInsights.goodContentLength", { count: stats.wordCount })}
          </p>
        )}
        {keywords.filter(k => !k.isStopWord && k.density > 4).map(k => (
          <p key={k.word} className="flex items-start gap-1.5 text-red-500">
            <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" /> {t("seoInsights.keywordStuffing", { word: k.word, density: k.density.toFixed(1) })}
          </p>
        ))}
        {targetKeyword && targetInfo && targetInfo.density >= 0.5 && targetInfo.density <= 2.5 && (
          <p className="flex items-start gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" /> {t("seoInsights.idealTargetDensity", { word: targetKeyword, density: targetInfo.density.toFixed(1) })}
          </p>
        )}
        <p className="flex items-start gap-1.5">
          <Info className="w-3 h-3 shrink-0 mt-0.5" /> {t("seoInsights.aimForDensity")}
        </p>
        <p className="flex items-start gap-1.5">
          <Info className="w-3 h-3 shrink-0 mt-0.5" /> {t("seoInsights.useLsiKeywords")}
        </p>
      </div>
    </div>
  )
}