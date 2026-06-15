import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      disabled={!text}
      className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 disabled:opacity-30 transition-all">
      {copied ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}
