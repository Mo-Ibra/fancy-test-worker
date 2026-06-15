import { useT } from "@/context/TranslationProvider";
import { useState } from "react";
import { CheckCheck, Copy } from "lucide-react";

export default function CopyButton({ text, label = "Copy", full = false }: { text: string; label?: string; full?: boolean }) {
  const t = useT("seo-tools/MetaTagGeneratorTool.json");
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      disabled={!text}
      className={`flex items-center gap-1.5 rounded-lg border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium ${full ? "w-full justify-center py-3 text-sm px-4" : "px-3 py-1.5 text-xs"
        }`}
    >
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? t("copy.copied") : label}
    </button>
  );
}