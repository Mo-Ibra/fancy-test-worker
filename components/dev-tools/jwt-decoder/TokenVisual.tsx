export default function TokenVisual({ parts }: { parts: [string, string, string] }) {
  const COLORS = [
    { text: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", label: "Header" },
    { text: "text-purple-500 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20", label: "Payload" },
    { text: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", label: "Signature" },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* Color legend */}
      <div className="flex items-center gap-3">
        {COLORS.map(({ text, label }) => (
          <span key={label} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
            <span className={`w-2 h-2 rounded-full ${text.replace("text-", "bg-").split(" ")[0]}`} />
            {label}
          </span>
        ))}
      </div>
      {/* Token with color segments */}
      <div className="px-4 py-3 rounded-xl border border-border bg-muted/20 overflow-x-auto">
        <pre className="text-xs font-mono break-all whitespace-pre-wrap leading-relaxed">
          {parts.map((part, i) => (
            <span key={i} className={COLORS[i].text}>
              {part}{i < 2 ? <span className="text-muted-foreground">.</span> : ""}
            </span>
          ))}
        </pre>
      </div>
      {/* Part lengths */}
      <div className="grid grid-cols-3 gap-1.5">
        {parts.map((part, i) => (
          <div key={i} className={`flex flex-col items-center py-2 rounded-lg border ${COLORS[i].bg} border-border`}>
            <span className={`text-xs font-bold font-mono ${COLORS[i].text}`}>{part.length}</span>
            <span className="text-[9px] text-muted-foreground">{COLORS[i].label} chars</span>
          </div>
        ))}
      </div>
    </div>
  );
}