import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";

export default function LiveClock() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, []);
  const s = Math.floor(now / 1000);
  const ms = now;
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex-1 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Unix Seconds</p>
          <code className="text-lg font-mono font-bold text-foreground tabular-nums">{s.toLocaleString()}</code>
        </div>
        <CopyButton text={String(s)} />
      </div>
      <div className="w-px bg-border hidden sm:block" />
      <div className="flex-1 flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Milliseconds</p>
          <code className="text-lg font-mono font-bold text-foreground tabular-nums">{ms.toLocaleString()}</code>
        </div>
        <CopyButton text={String(ms)} />
      </div>
    </div>
  );
}