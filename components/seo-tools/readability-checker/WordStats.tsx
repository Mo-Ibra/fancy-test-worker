import StatCard from "./StatsCard";
import { useT } from "@/context/TranslationProvider";

export default function WordStats({ m }: { m: any }) {
  const t = useT("seo-tools/ReadabilityCheckerTool.json");
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("wordStats.title")}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {[
          { label: t("wordStats.totalWords"), value: m.wordCount.toLocaleString() },
          { label: t("wordStats.uniqueWords"), value: m.uniqueWordCount.toLocaleString() },
          { label: t("wordStats.lexicalDensity"), value: `${((m.uniqueWordCount / Math.max(1, m.wordCount)) * 100).toFixed(0)}%` },
          { label: t("wordStats.complex3syll"), value: `${m.complexWordCount} (${((m.complexWordCount / Math.max(1, m.wordCount)) * 100).toFixed(0)}%)` },
          { label: t("wordStats.long7chars"), value: `${m.longWordCount} (${((m.longWordCount / Math.max(1, m.wordCount)) * 100).toFixed(0)}%)` },
          { label: t("wordStats.avgSyllables"), value: m.avgSyllPerWord.toFixed(2) },
        ].map(({ label, value }) => <StatCard key={label} label={label} value={value} />)}
      </div>
    </div>
  )
}