import { DiffPart } from "@/funcs/text-tools/TextDiffToolFuncs";

export default function InlineDiff({ parts }: { parts: DiffPart[] }) {
  return (
    <p className="text-sm leading-relaxed font-mono whitespace-pre-wrap wrap-break-word">
      {parts.map((p, i) => {
        if (p.op === "equal") return <span key={i} className="text-foreground">{p.text}</span>;
        if (p.op === "insert") return <span key={i} className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded px-0.5">{p.text}</span>;
        if (p.op === "delete") return <span key={i} className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 line-through rounded px-0.5">{p.text}</span>;
      })}
    </p>
  );
}