import { Hash } from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { SlugOptions } from "@/funcs/seo-tools/URLSlugGeneratorToolFuncs";

export default function Separator({ opts, setOpt }: { opts: any; setOpt: any }) {
  const t = useT("seo-tools/URLSlugGeneratorTool.json");
  const SEPS: { v: SlugOptions["separator"]; label: string; ex: string }[] = [
    { v: "-", label: "Hyphen", ex: "my-page" },
    { v: "_", label: "Underscore", ex: "my_page" },
    { v: ".", label: "Dot", ex: "my.page" },
    { v: "/", label: "Slash", ex: "my/page" },
  ];
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-2">
        <Hash className="w-3.5 h-3.5" /> {t("options.separator")}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {SEPS.map(({ v, label, ex }) => (
          <button key={v} onClick={() => setOpt("separator", v)}
            className={`flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all ${opts.separator === v
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
              : "border-border bg-card hover:border-blue-200"
              }`}>
            <p className={`text-xs font-bold ${opts.separator === v ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</p>
            <code className="text-[9px] font-mono text-muted-foreground mt-0.5">{ex}</code>
          </button>
        ))}
      </div>
    </div>
  )
}