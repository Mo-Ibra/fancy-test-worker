import { useT } from "@/context/TranslationProvider";

export default function URLPreview({ slug }: { slug: string }) {
  const t = useT("text-tools/SlugGeneratorTool.json");
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("urlPreview.title")}</span>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 min-w-0 mx-3">
          <p className="text-xs font-mono text-muted-foreground truncate">
            <span className="text-muted-foreground/60">https://yoursite.com/blog/</span>
            <span className="text-blue-500 font-semibold">{slug || t("urlPreview.placeholder")}</span>
          </p>
        </div>
      </div>
    </div>
  )
}