import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useT } from "@/context/TranslationProvider";

export default function DropZone({ onFiles }: { onFiles: (f: File[]) => void }) {
  const t = useT("image-tools/ImageMergerTool.json");
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const handle = (list: FileList | null) => {
    const valid = Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));
    if (valid.length) onFiles(valid);
  };
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      onClick={() => ref.current?.click()}
      className={`group flex flex-col items-center justify-center gap-4 h-52 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${drag ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
        : "border-border hover:border-blue-300 dark:hover:border-blue-700 bg-card hover:bg-blue-50/40 dark:hover:bg-blue-900/10"
        }`}
    >
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" aria-label="Upload file" onChange={(e) => handle(e.target.files)} />
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200 ${drag ? "bg-blue-100 dark:bg-blue-900/40" : "bg-muted group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"}`}>
        <Upload className={`w-7 h-7 transition-colors duration-200 ${drag ? "text-blue-500" : "text-muted-foreground group-hover:text-blue-500"}`} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors">
          {t("dropzone.dropHere")}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{t("dropzone.hint")}</p>
      </div>
    </div>
  );
}