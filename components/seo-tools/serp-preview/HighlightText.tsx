export default function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text} </>;
  const terms = query.trim().split(/\s+/).filter(t => t.length > 2);
  if (!terms.length) return <>{text} </>;
  const re = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {
        parts.map((part, i) =>
          re.test(part)
            ? <strong key={i} className="font-semibold" > {part} </strong>
            : <span key={i} > {part} </span>
        )
      }
    </>
  );
}