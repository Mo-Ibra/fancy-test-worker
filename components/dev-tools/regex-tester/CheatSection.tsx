import { ChevronDown, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

export default function CheatSection({ section, items, onInsert }: {
  section: string;
  items: { token: string; desc: string }[];
  onInsert: (t: string) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 dark:bg-muted/10 hover:bg-muted/50 transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-foreground">{section}</span>
        {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {open && (
        <div className="divide-y divide-border">
          {items.map(({ token, desc }) => (
            <div key={token}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 dark:hover:bg-muted/10 group cursor-pointer transition-colors"
              onClick={() => onInsert(token)}
              title="Click to insert into pattern"
            >
              <code className="text-xs font-mono font-bold text-blue-500 dark:text-blue-400 w-28 shrink-0">{token}</code>
              <span className="text-xs text-muted-foreground flex-1">{desc}</span>
              <span className="text-[10px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">insert ↑</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}