import { examples, generateSlug, SlugOptions } from "@/funcs/text-tools/SlugGeneratorToolFuncs";
import { useT } from "@/context/TranslationProvider";

export default function BulkGenerator({ setInput, opts }: { setInput: (input: string) => void, opts: SlugOptions }) {
  const t = useT("text-tools/SlugGeneratorTool.json");
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("examples.title")}</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => setInput(ex)}
            className="group text-left px-4 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
          >
            <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">{ex}</p>
            <p className="text-[10px] font-mono text-blue-500/70 group-hover:text-blue-500 transition-colors mt-0.5 truncate">
              → {generateSlug(ex, opts)}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}