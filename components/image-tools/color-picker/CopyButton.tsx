import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyBtn({ text, small = false }: { text: string; small?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className={`flex items-center gap-1 transition-all duration-200 ${small ? "text-[10px] px-1.5 py-0.5 rounded" : "text-xs px-2 py-1 rounded-lg"} border border-transparent hover:border-white/20 hover:bg-white/10`}
    >
      {copied ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
      <span className={copied ? "text-emerald-400" : "opacity-70"}>{copied ? "Copied" : text}</span>
    </button>
  );
}