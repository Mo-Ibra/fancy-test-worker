import { useT } from "@/context/TranslationProvider";
import { useState } from "react";
import { CheckCheck, Copy } from "lucide-react";

export default function CopyButton({ text, label, full = false, small = false }: {
  text: string; label?: string; full?: boolean; small?: boolean;
}) {
  const t = useT("security-tools/MD5HashGeneratorTool.json");
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      disabled={!text}
      className={`flex items-center gap-1.5 rounded-lg font-medium border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 ${full ? "w-full justify-center py-3 text-sm px-4"
        : small ? "px-2 py-1 text-[10px]"
          : "px-3 py-1.5 text-xs"
        }`}
    >
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {!small && (copied ? t("copy.copied") : label)}
    </button>
  );
}