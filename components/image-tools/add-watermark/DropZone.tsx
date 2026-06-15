import { useT } from "@/context/TranslationProvider";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function DropZone({ onFile, label = "Click or drag & drop an image", accept = "image/*" }: {
  onFile: (f: File) => void; label?: string; accept?: string;
}) {
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
      className={`group flex flex-col items-center justify-center gap-3 h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${drag ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
        : "border-border hover:border-blue-300 dark:hover:border-blue-700 bg-card hover:bg-blue-50/40 dark:hover:bg-blue-900/10"
        }`}
    >
      <input ref={ref} type="file" accept={accept} className="hidden" aria-label="Upload file" onChange={(e) => handle(e.target.files)} />
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${drag ? "bg-blue-100" : "bg-muted group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"}`}>
        <Upload className={`w-5 h-5 transition-colors duration-200 ${drag ? "text-blue-500" : "text-muted-foreground group-hover:text-blue-500"}`} />
      </div>
      <p className="text-xs font-semibold text-foreground group-hover:text-blue-500 transition-colors text-center px-4">{t("dropzone.clickOrDrag")}</p>
    </div>
  );
}