import { SlidersHorizontal } from "lucide-react";
import Toggle from "./Toggle";
import { useT } from "@/context/TranslationProvider";

export default function AdvancedOptions({ opts, setOpt }: { opts: any, setOpt: any }) {
  const t = useT("pdf-tools/PDFCompressorTool.json");

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <SlidersHorizontal className="w-3.5 h-3.5" /> {t("advanced.title")}
      </p>
      <Toggle checked={opts.removeMetadata} onChange={v => setOpt("removeMetadata", v)}
        label={t("advanced.removeMetadata")} sub={t("advanced.removeMetadataSub")} />
      <Toggle checked={opts.removeAnnotations} onChange={v => setOpt("removeAnnotations", v)}
        label={t("advanced.removeAnnotations")} sub={t("advanced.removeAnnotationsSub")} />
      <Toggle checked={opts.removeForms} onChange={v => setOpt("removeForms", v)}
        label={t("advanced.removeForms")} sub={t("advanced.removeFormsSub")} />
    </div>
  )
}