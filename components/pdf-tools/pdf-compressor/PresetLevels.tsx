import { CompressionLevel } from "@/funcs/pdf-tools/PDFCompressorToolFuncs";
import { useT } from "@/context/TranslationProvider";

export default function PresetLevels({ opts, setOpt }: { opts: any, setOpt: any }) {
  const t = useT("pdf-tools/PDFCompressorTool.json");

  const LEVEL_CARDS: { key: CompressionLevel; label: string; desc: string; badge: string; badgeColor: string }[] = [
    { 
      key: "light", 
      label: t("compressionLevel.light.label"), 
      desc: t("compressionLevel.light.desc"), 
      badge: t("compressionLevel.light.badge"), 
      badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
    },
    { 
      key: "medium", 
      label: t("compressionLevel.medium.label"), 
      desc: t("compressionLevel.medium.desc"), 
      badge: t("compressionLevel.medium.badge"), 
      badgeColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" 
    },
    { 
      key: "aggressive", 
      label: t("compressionLevel.aggressive.label"), 
      desc: t("compressionLevel.aggressive.desc"), 
      badge: t("compressionLevel.aggressive.badge"), 
      badgeColor: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" 
    },
  ];

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("compressionLevel.title")}</p>
      <div className="flex flex-col gap-2">
        {LEVEL_CARDS.map(({ key, label, desc, badge, badgeColor }) => (
          <button key={key} onClick={() => setOpt("level", key)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-all ${opts.level === key
              ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20 shadow-sm"
              : "border-border bg-card hover:border-red-200 dark:hover:border-red-900/40"
              }`}>
            <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${opts.level === key ? "border-red-500 bg-red-500" : "border-muted-foreground"}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${opts.level === key ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>{label}</p>
              <p className="text-[10px] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">{desc}</p>
            </div>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeColor}`}>{badge}</span>
          </button>
        ))}
      </div>
    </div>
  )
}