import { DiffPart } from "@/funcs/text-tools/TextDiffToolFuncs";

export default function SplitDiff({ parts }: { parts: DiffPart[] }) {
  const leftParts: DiffPart[] = parts.filter((p) => p.op !== "insert");
  const rightParts: DiffPart[] = parts.filter((p) => p.op !== "delete");

  const render = (ps: DiffPart[], side: "left" | "right") =>
    ps.map((p, i) => {
      if (p.op === "equal") return <span key={i} className="text-foreground">{p.text}</span>;
      if (side === "left" && p.op === "delete") return <span key={i} className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 rounded px-0.5">{p.text}</span>;
      if (side === "right" && p.op === "insert") return <span key={i} className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded px-0.5">{p.text}</span>;
      return null;
    });

  return (
    <div className="grid grid-cols-2 divide-x divide-border min-h-[280px]">
      <div className="px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-3">Original</p>
        <p className="text-sm leading-relaxed font-mono whitespace-pre-wrap wrap-break-word">{render(leftParts, "left")}</p>
      </div>
      <div className="px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-3">Modified</p>
        <p className="text-sm leading-relaxed font-mono whitespace-pre-wrap wrap-break-word">{render(rightParts, "right")}</p>
      </div>
    </div>
  );
}