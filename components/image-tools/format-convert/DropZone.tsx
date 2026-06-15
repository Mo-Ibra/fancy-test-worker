import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useT } from "@/context/TranslationProvider";

export default function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const t = useT("image-tools/AddWatermarkTool.json");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    const valid = Array.from(fileList ?? []).filter((f) => f.type.startsWith("image/"));
    if (valid.length) onFiles(valid);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      className={`group flex flex-col items-center justify-center gap-4 h-56 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${dragging
        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
        : "border-border hover:border-blue-300 dark:hover:border-blue-700 bg-card hover:bg-blue-50/40 dark:hover:bg-blue-900/10"
        }`}
    >
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" aria-label="Upload file" onChange={(e) => handleFiles(e.target.files)} />
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200 ${dragging ? "bg-blue-100 dark:bg-blue-900/40" : "bg-muted group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"}`}>
        <Upload className={`w-7 h-7 transition-colors duration-200 ${dragging ? "text-blue-500" : "text-muted-foreground group-hover:text-blue-500"}`} />
      </div>
      <div className="text-center px-6">
        <p className="text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors duration-200">
          {t("dropzone.clickOrDrag")}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t("dropzone.formatsSupported")}
        </p>
      </div>
    </div>
  );
}