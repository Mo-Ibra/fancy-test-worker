import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function DropZone({ onFile, hasFile }: { onFile: (f: File) => void; hasFile: boolean }) {
  const t = useT("pdf-tools/PDFSplitterTool.json");
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handle = (files: FileList | null) => {
    const f = Array.from(files ?? []).find(f => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (f) onFile(f);
  };

  if (hasFile) return null;

  return (
    <div
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files); }}
      onClick={() => ref.current?.click()}
      className={`flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${over
        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
        : "border-border bg-muted/10 hover:border-blue-300 hover:bg-muted/20"
        }`}
    >
      <input ref={ref} type="file" accept=".pdf,application/pdf" className="hidden" aria-label="Upload file"
        onChange={e => { handle(e.target.files); e.target.value = ""; }} />
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${over ? "bg-blue-100 dark:bg-blue-900/40" : "bg-muted/30"}`}>
        <Upload className={`w-7 h-7 ${over ? "text-blue-500" : "text-muted-foreground/50"}`} />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-foreground">{t("dropzone.dropHere")}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{t("dropzone.orClick")}</p>
      </div>
      <span className="text-[10px] font-bold px-3 py-1 rounded-full border border-border bg-card text-muted-foreground">{t("dropzone.pdfOnly")}</span>
    </div>
  );
}