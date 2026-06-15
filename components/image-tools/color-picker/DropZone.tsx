import { useT } from "@/context/TranslationProvider";
import { Palette } from "lucide-react";
import { useRef, useState } from "react";

export default function DropZone({ onFile }: { onFile: (f: File) => void }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const handle = (list: FileList | null) => {
    const f = Array.from(list ?? []).find((f) => f.type.startsWith("image/"));
    if (f) onFile(f);
  };

  const t = useT("image-tools/AddWatermarkTool.json");

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      onClick={() => ref.current?.click()}
      className={`group flex flex-col items-center justify-center gap-4 h-64 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${drag ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-border hover:border-blue-300 dark:hover:border-blue-700 bg-card hover:bg-blue-50/40 dark:hover:bg-blue-900/10"}`}
    >
      <input ref={ref} type="file" accept="image/*" className="hidden" aria-label="Upload file" onChange={(e) => handle(e.target.files)} />
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200 ${drag ? "bg-blue-100 dark:bg-blue-900/40" : "bg-muted group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"}`}>
        <Palette className={`w-8 h-8 transition-colors duration-200 ${drag ? "text-blue-500" : "text-muted-foreground group-hover:text-blue-500"}`} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors duration-200">
          {drag ? t("dropzone.dropHere") : t("dropzone.clickOrDrag")}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{t("dropzone.processedLocally")}</p>
      </div>
      <div className="flex gap-2">
        {["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#8B5CF6", "#EC4899"].map((c) => (
          <div key={c} className="w-4 h-4 rounded-full shadow-sm" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}