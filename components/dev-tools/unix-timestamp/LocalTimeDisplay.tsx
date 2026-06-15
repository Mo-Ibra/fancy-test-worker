import { useEffect, useState } from "react";

export default function LocalTimeDisplay() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col gap-1.5">
      <code className="text-2xl font-mono font-bold text-foreground tabular-nums">
        {now.toLocaleTimeString()}
      </code>
      <p className="text-xs text-muted-foreground">{now.toLocaleDateString(undefined, { dateStyle: "full" })}</p>
      <p className="text-[10px] text-muted-foreground/60">
        UTC offset: {Intl.DateTimeFormat().resolvedOptions().timeZone} ·{" "}
        {now.toLocaleString("en", { timeZoneName: "short" }).split(" ").pop()}
      </p>
    </div>
  );
}