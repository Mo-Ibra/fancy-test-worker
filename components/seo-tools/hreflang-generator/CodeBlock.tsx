import { Code2 } from "lucide-react";
import CopyButton from "./CopyButton";

export default function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {label && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/20 border-b border-border">
          <Code2 className="w-4 h-4 text-blue-500" />
          <p className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{label}</p>
          <CopyButton text={code} />
        </div>
      )}
      <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950 dark:bg-black/40 max-h-96 overflow-y-auto">
        <code className="text-slate-300">{code}</code>
      </pre>
    </div>
  );
}
