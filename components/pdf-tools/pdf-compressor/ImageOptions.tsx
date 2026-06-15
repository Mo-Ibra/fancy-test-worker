import { ImageIcon } from "lucide-react";
import Toggle from "./Toggle";
import { useT } from "@/context/TranslationProvider";

export default function ImageOptions({ opts, setOpt }: { opts: any, setOpt: any }) {
  const t = useT("pdf-tools/PDFCompressorTool.json");

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> {t("imageOptions.title")}
      </p>

      {/* Quality slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-foreground">{t("imageOptions.quality")}</span>
          <span className="text-sm font-bold font-mono text-red-500">{Math.round(opts.imageQuality * 100)}%</span>
        </div>
        <input type="range" min={10} max={100} value={Math.round(opts.imageQuality * 100)} aria-label={t("imageOptions.quality")}
          onChange={e => setOpt("imageQuality", Number(e.target.value) / 100)}
          className="w-full h-2 rounded-full appearance-none bg-border accent-red-500 cursor-pointer" />
        <div className="flex justify-between text-[9px] text-muted-foreground/60 mt-1">
          <span>10% ({t("imageOptions.tiny")})</span><span>50%</span><span>85% ({t("imageOptions.rec")})</span><span>100%</span>
        </div>
      </div>

      <Toggle checked={opts.downsampleImages} onChange={v => setOpt("downsampleImages", v)}
        label={t("imageOptions.downsample")} sub={t("imageOptions.downsampleSub")} />

      {opts.downsampleImages && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-foreground">{t("imageOptions.maxDpi")}</span>
            <span className="text-sm font-bold font-mono text-red-500">{opts.maxImageDpi}</span>
          </div>
          <input type="range" min={72} max={300} step={12} value={opts.maxImageDpi} aria-label={t("imageOptions.maxDpi")}
            onChange={e => setOpt("maxImageDpi", Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-border accent-red-500 cursor-pointer" />
          <div className="flex justify-between text-[9px] text-muted-foreground/60 mt-1">
            <span>72 ({t("imageOptions.web")})</span><span>96</span><span>150 ({t("imageOptions.print")})</span><span>300</span>
          </div>
        </div>
      )}
    </div>
  )
}