export default function renderVal(v: unknown): React.ReactNode {
  if (v === undefined) return <span className="text-muted-foreground/40 italic text-[10px]" >—</span>;
  if (v === null) return <span className="text-muted-foreground/60 font-mono text-xs" > null </span>;
  if (typeof v === "boolean")
    return <span className={`font-mono text-xs font-bold ${v ? "text-emerald-500" : "text-red-400"}`}> {String(v)} </span>;
  if (typeof v === "number")
    return <span className="font-mono text-xs text-amber-500" > {String(v)} </span>;
  if (typeof v === "string")
    return <span className="font-mono text-xs text-blue-500 dark:text-blue-400" > "{v}" </span>;
  if (Array.isArray(v))
    return <span className="font-mono text-xs text-muted-foreground" > […]({v.length}) </span>;
  if (typeof v === "object")
    return (
      <span className="font-mono text-xs text-muted-foreground" >
        {'{…}'}({Object.keys(v as object).length})
      </span>
    );
  return <span className="font-mono text-xs" > {String(v)} </span>;
}