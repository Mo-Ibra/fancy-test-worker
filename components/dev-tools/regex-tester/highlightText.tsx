import { MatchInfo } from "@/funcs/dev-tools/RegexTesterToolFuncs";

export default function highlightText(text: string, matches: MatchInfo[]): React.ReactNode[] {
  if (!matches.length) return [<span key="all">{text}</span>];
  const parts: React.ReactNode[] = [];
  let last = 0;
  matches.forEach((m, i) => {
    if (m.start > last) parts.push(<span key={`pre${i}`}>{text.slice(last, m.start)}</span>);
    parts.push(
      <mark key={`m${i}`}
        className="bg-yellow-200 dark:bg-yellow-600/50 text-foreground rounded-sm px-0.5 cursor-default"
        title={`Match ${i + 1}: "${m.value}" at ${m.start}–${m.end}`}
      >
        {m.value || <span className="opacity-50">∅</span>}
      </mark>
    );
    last = m.end;
  });
  if (last < text.length) parts.push(<span key="post">{text.slice(last)}</span>);
  return parts;
}