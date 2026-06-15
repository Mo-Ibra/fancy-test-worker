import { useT } from "@/context/TranslationProvider";
import { Sparkles } from "lucide-react";
import { WrapOptions } from "@/funcs/text-tools/TextWrapperToolFuncs";

export default function Separator({ opts }: { opts: WrapOptions }) {
  const t = useT("text-tools/TextWrapperTool.json");
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-border" />
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20">
        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
          {t("separator.wrapAt")} {opts.lineWidth} · {t("separator.by")} {opts.breakOn}
          {opts.prefix ? ` · ${t("separator.prefix")} "${opts.prefix.trim()}"` : ""}
          {opts.addLineNumbers ? ` · ${t("separator.numbered")}` : ""}
        </span>
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}