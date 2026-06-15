import { DiffNode, DiffType, typeOf } from "@/funcs/dev-tools/JSONDiffToolFuncs";
import { ArrowRight, ChevronDown, ChevronRightIcon, Minus, Plus } from "lucide-react";
import renderVal from "./renderVal";

export default function DiffRow({
  node, depth, onToggle, showUnchanged,
}: {
  node: DiffNode; depth: number; onToggle: (path: string) => void; showUnchanged: boolean;
}) {
  const hasChildren = node.children.length > 0;
  const key = node.path.split(".").pop() ?? node.path;

  const BG: Record<DiffType, string> = {
    added: "bg-emerald-50 dark:bg-emerald-900/15 border-l-2 border-emerald-400",
    removed: "bg-red-50 dark:bg-red-900/15 border-l-2 border-red-400",
    changed: "bg-amber-50 dark:bg-amber-900/15 border-l-2 border-amber-400",
    "type-changed": "bg-purple-50 dark:bg-purple-900/15 border-l-2 border-purple-400",
    unchanged: "",
  };

  const BADGE: Record<DiffType, React.ReactNode> = {
    added: <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">+added</span>,
    removed: <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">−removed</span>,
    changed: <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">~changed</span>,
    "type-changed": <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">type!</span>,
    unchanged: null,
  };

  return (
    <div className={`flex items-start gap-2 px-3 py-2 text-xs rounded-lg mb-0.5 ${BG[node.type]} hover:bg-opacity-80 transition-colors`}
      style={{ paddingLeft: `${12 + depth * 20}px` }}>
      {/* Toggle */}
      <button
        onClick={() => hasChildren && onToggle(node.path)}
        className={`shrink-0 w-4 h-4 flex items-center justify-center rounded mt-0.5 ${hasChildren ? "cursor-pointer hover:bg-black/10 dark:hover:bg-white/10" : "cursor-default"}`}
      >
        {hasChildren
          ? node.expanded
            ? <ChevronDown className="w-3 h-3 text-muted-foreground" />
            : <ChevronRightIcon className="w-3 h-3 text-muted-foreground" />
          : <span className="w-1 h-1 rounded-full bg-muted-foreground/30 block" />}
      </button>

      {/* Key */}
      <span className="font-mono font-bold text-foreground shrink-0 min-w-[80px]">{key}</span>

      {/* Values */}
      <div className="flex-1 min-w-0 flex items-start gap-3 flex-wrap">
        {node.type === "changed" && node.children.length === 0 && (
          <>
            <span className="flex items-center gap-1">
              <Minus className="w-3 h-3 text-red-400 shrink-0" />
              <span className="line-through opacity-60">{renderVal(node.leftVal)}</span>
            </span>
            <ArrowRight className="w-3 h-3 text-muted-foreground/40 shrink-0 mt-0.5" />
            <span className="flex items-center gap-1">
              <Plus className="w-3 h-3 text-emerald-500 shrink-0" />
              {renderVal(node.rightVal)}
            </span>
          </>
        )}
        {node.type === "type-changed" && (
          <>
            <span className="flex items-center gap-1 text-red-400">
              <Minus className="w-3 h-3 shrink-0" />
              <span className="text-[10px] opacity-70">{typeOf(node.leftVal)}</span>
              <span className="line-through opacity-60">{renderVal(node.leftVal)}</span>
            </span>
            <ArrowRight className="w-3 h-3 text-muted-foreground/40 shrink-0 mt-0.5" />
            <span className="flex items-center gap-1 text-purple-500">
              <Plus className="w-3 h-3 shrink-0" />
              <span className="text-[10px] opacity-70">{typeOf(node.rightVal)}</span>
              {renderVal(node.rightVal)}
            </span>
          </>
        )}
        {node.type === "added" && (
          <span className="flex items-center gap-1">
            <Plus className="w-3 h-3 text-emerald-500 shrink-0" />
            {renderVal(node.rightVal)}
          </span>
        )}
        {node.type === "removed" && (
          <span className="flex items-center gap-1 line-through opacity-60">
            <Minus className="w-3 h-3 text-red-400 shrink-0" />
            {renderVal(node.leftVal)}
          </span>
        )}
        {node.type === "unchanged" && node.children.length === 0 && renderVal(node.leftVal)}
        {(node.type === "changed" || node.type === "unchanged") && node.children.length > 0 && (
          <span className="text-muted-foreground/50 text-[10px]">
            {Array.isArray(node.leftVal) ? `[…] (${(node.leftVal as unknown[]).length})` : `{…} (${Object.keys(node.leftVal as object).length})`}
          </span>
        )}
      </div>

      {/* Path */}
      <code className="shrink-0 text-[9px] font-mono text-muted-foreground/40 hidden md:block max-w-[160px] truncate">{node.path}</code>

      {/* Badge */}
      {BADGE[node.type]}
    </div>
  );
}