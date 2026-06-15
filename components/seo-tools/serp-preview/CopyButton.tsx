import { useState } from "react";
import { CheckCheck, Copy } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function CopyButton({ text }: { text: string }) {
  const t = useT("seo-tools/SERPPreviewTool.json");
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}
      disabled={!text}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 disabled:opacity-40 text-xs font-medium transition-all">
      {c ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {c ? t("copy.copied") : t("copy.button")}
    </button>
  );
}