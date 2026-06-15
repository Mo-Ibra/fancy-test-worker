import { getType } from "@/funcs/dev-tools/JSONFormatterToolFuncs";
import { ChevronDown, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

export default function TreeNode({
  keyName, value, depth = 0, defaultOpen = true,
}: {
  keyName?: string | number; value: unknown; depth?: number; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen && depth < 2);
  const type = getType(value);
  const isExpandable = type === "object" || type === "array";

  const typeColor: Record<string, string> = {
    string: "text-emerald-500 dark:text-emerald-400",
    number: "text-blue-500 dark:text-blue-400",
    boolean: "text-purple-500 dark:text-purple-400",
    null: "text-red-400 dark:text-red-400",
    object: "text-foreground",
    array: "text-foreground",
  };

  const renderValue = () => {
    if (type === "string") return <span className={typeColor.string}>"{value as string}"</span>;
    if (type === "number") return <span className={typeColor.number}>{String(value)}</span>;
    if (type === "boolean") return <span className={typeColor.boolean}>{String(value)}</span>;
    if (type === "null") return <span className={typeColor.null}>null</span>;
    if (type === "array") return <span className="text-muted-foreground text-xs">[{(value as unknown[]).length}]</span>;
    if (type === "object") return <span className="text-muted-foreground text-xs">{"{"}…{"}"}</span>;
  };

  const entries = isExpandable
    ? Array.isArray(value)
      ? (value as unknown[]).map((v, i) => [i, v] as [number, unknown])
      : Object.entries(value as Record<string, unknown>)
    : [];

  return (
    <div className="leading-relaxed" style={{ marginLeft: depth > 0 ? 16 : 0 }}>
      <div
        className={`flex items-center gap-1.5 py-0.5 px-2 rounded-md hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors cursor-default group ${isExpandable ? "cursor-pointer" : ""}`}
        onClick={() => isExpandable && setOpen((p) => !p)}
      >
        {/* Expand icon */}
        <span className="w-4 shrink-0">
          {isExpandable && (
            open
              ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              : <ChevronRightIcon className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </span>

        {/* Key */}
        {keyName !== undefined && (
          <span className="text-blue-500 dark:text-blue-400 font-mono text-xs">
            {typeof keyName === "string" ? `"${keyName}"` : keyName}
            <span className="text-muted-foreground mx-1">:</span>
          </span>
        )}

        {/* Value or summary */}
        <span className="font-mono text-xs">
          {isExpandable && !open ? renderValue() : isExpandable ? (
            <span className="text-muted-foreground">{Array.isArray(value) ? "[" : "{"}</span>
          ) : renderValue()}
        </span>

        {/* Type badge */}
        <span className={`ml-1.5 text-[9px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded-full ${type === "string" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
          type === "number" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
            type === "boolean" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-500" :
              type === "null" ? "bg-red-100 dark:bg-red-900/30 text-red-500" :
                "bg-muted text-muted-foreground"
          }`}>{type}</span>
      </div>

      {/* Children */}
      {isExpandable && open && (
        <div>
          {entries.map(([k, v]) => (
            <TreeNode key={String(k)} keyName={k} value={v} depth={depth + 1} defaultOpen={depth < 1} />
          ))}
          <div style={{ marginLeft: 16 }}>
            <span className="font-mono text-xs text-muted-foreground pl-6">{Array.isArray(value) ? "]" : "}"}</span>
          </div>
        </div>
      )}
    </div>
  );
}