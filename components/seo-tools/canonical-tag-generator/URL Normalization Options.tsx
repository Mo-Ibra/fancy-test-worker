import { RefreshCw } from "lucide-react";
import Toggle from "./Toggle";
import { NormalizeOpts } from "@/funcs/seo-tools/CanonicalTagGeneratorToolFuncs";

export default function URLNormalizationOptions({ normOpts, setNorm, t }: { normOpts: NormalizeOpts, setNorm: (k: keyof NormalizeOpts, v: NormalizeOpts[keyof NormalizeOpts]) => void, t: (key: string) => string }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <RefreshCw className="w-3.5 h-3.5" /> {t("normalization.title")}
      </p>
      <Toggle checked={normOpts.forceHttps} onChange={() => setNorm("forceHttps", !normOpts.forceHttps)} label={t("normalization.forceHttps")} sub={t("normalization.forceHttpsSub")} />
      <Toggle checked={normOpts.lowercasePath} onChange={() => setNorm("lowercasePath", !normOpts.lowercasePath)} label={t("normalization.lowercasePath")} sub={t("normalization.lowercasePathSub")} />
      <Toggle checked={normOpts.stripParams} onChange={() => setNorm("stripParams", !normOpts.stripParams)} label={t("normalization.stripParams")} sub={t("normalization.stripParamsSub")} />
      <Toggle checked={normOpts.removeTrailingSlash} onChange={() => setNorm("removeTrailingSlash", !normOpts.removeTrailingSlash)} label={t("normalization.removeTrailingSlash")} sub={t("normalization.removeTrailingSlashSub")} />
      <div className="border-t border-border pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("www.title")}</p>
        <div className="flex gap-2">
          {[
            { label: t("www.keep"), key: "keep" },
            { label: t("www.www"), key: "www" },
            { label: t("www.nonWww"), key: "nonwww" },
          ].map(({ label, key }) => {
            const active = key === "www" ? normOpts.preferWww : key === "nonwww" ? normOpts.preferNonWww : (!normOpts.preferWww && !normOpts.preferNonWww);
            return (
              <button key={key} onClick={() => {
                setNorm("preferWww", key === "www");
                setNorm("preferNonWww", key === "nonwww");
              }}
                className={`flex-1 py-2 rounded-xl border text-[10px] font-bold transition-all ${active ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-200"
                  }`}>{label}</button>
            );
          })}
        </div>
      </div>
    </div>
  )
}