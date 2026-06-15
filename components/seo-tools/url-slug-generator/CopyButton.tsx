import { useT } from "@/context/TranslationProvider";
import { useState } from "react";
import { CheckCheck, Copy } from "lucide-react";

export default function CopyButton({ text, small = false }: { text: string; small?: boolean }) {
  const t = useT("seo-tools/URLSlugGeneratorTool.json");
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      disabled={!text}
      className={`flex items-center gap-1 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 disabled:opacity-40 transition-all font-medium ${small ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"}`}>
      {copied ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      {!small && (copied ? t("copy.copied") : t("copy.button"))}
    </button>
  );
}