import { useT } from "@/context/TranslationProvider";
import { useState } from "react";
import { CheckCheck, Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const t = useT("text-tools/FindReplaceTool.json");
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      disabled={!text}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
    >
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? t("copy.copied") : t("copy.button")}
    </button>
  );
}