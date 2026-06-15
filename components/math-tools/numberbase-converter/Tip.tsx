import { Info } from "lucide-react";

export default function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
      <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
      <p className="text-xs text-blue-700 dark:text-blue-300 leading-snug">{text}</p>
    </div>
  );
}