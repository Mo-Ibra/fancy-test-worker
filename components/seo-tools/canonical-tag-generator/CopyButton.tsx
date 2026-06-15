import { useT } from "@/context/TranslationProvider";
import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ text, label, full = false }: { text: string; label?: string; full?: boolean }) {
  const t = useT("seo-tools/CanonicalTagGeneratorTool.json");
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      disabled={!text}
      className={`flex items-center gap-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 disabled:opacity-40 text-xs font-medium transition-all ${full ? "w-full justify-center py-3 px-4" : "px-3 py-1.5"
        }`}>
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? t("copy.copied") : label}
    </button>
  );
}