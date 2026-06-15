import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ text, small = false }: { text: string; small?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      disabled={!text}
      className={`flex items-center gap-1 border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-lg ${small ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs font-medium"}`}
    >
      {copied ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      {!small && (copied ? "Copied!" : "Copy")}
    </button>
  );
}