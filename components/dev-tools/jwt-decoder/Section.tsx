import { ChevronDown, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

export default function Section({ title, icon: Icon, badge, defaultOpen = true, children }: {
  title: string; icon: React.ElementType; badge?: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 px-5 py-3.5 bg-muted/20 hover:bg-muted/40 transition-colors text-left">
        <Icon className="w-4 h-4 text-blue-500 shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{title}</span>
        {badge}
        {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}