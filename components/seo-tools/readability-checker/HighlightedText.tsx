export default function HighlightedText({ text, longSentences }: { text: string; longSentences: string[] }) {
  if (!text) return null;
  const longSet = new Set(longSentences.map(s => s.trim()));

  // Split by sentence boundaries
  const parts = text.split(/(?<=[.!?])\s+/);

  return (
    <div className="text-sm leading-relaxed text-foreground">
      {parts.map((part, i) => {
        const isLong = longSet.has(part.trim()) ||
          part.trim().split(/\s+/).filter(Boolean).length > 25;
        return (
          <span key={i}>
            <span className={isLong ? "bg-amber-100 dark:bg-amber-900/30 rounded px-0.5" : ""}>
              {part}
            </span>
            {i < parts.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
}