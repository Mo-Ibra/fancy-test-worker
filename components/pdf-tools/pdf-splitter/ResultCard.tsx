import { FileText, Download } from "lucide-react";
import { SplitResult, fmtSize } from "@/funcs/pdf-tools/PDFSplitterToolFuncs";

export default function ResultCard({ result, index, onDownload }: {
  result: SplitResult; index: number; onDownload: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
      <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4 text-red-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground truncate">{result.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {result.pages} page{result.pages !== 1 ? "s" : ""} · {fmtSize(result.sizeKb)}
        </p>
      </div>
      <button onClick={onDownload}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all opacity-0 group-hover:opacity-100">
        <Download className="w-3.5 h-3.5" /> Save
      </button>
    </div>
  );
}