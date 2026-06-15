export default function diffHighlight(original: string, encoded: string): React.ReactNode {
  // Show encoded segments in blue, unchanged chars in default
  const parts: React.ReactNode[] = [];
  let oi = 0, ei = 0;
  let key = 0;
  while (ei < encoded.length) {
    if (encoded[ei] === "%" && oi < original.length) {
      // percent-encoded sequence
      const seq = encoded.slice(ei, ei + 3);
      parts.push(
        <span key={key++} className="text-blue-500 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 rounded px-0.5" > {seq} </span>
      );
      ei += 3; oi++;
    } else if (encoded[ei] === "+" && oi < original.length && original[oi] === " ") {
      parts.push(
        <span key={key++} className="text-orange-500 font-semibold bg-orange-50 dark:bg-orange-900/30 rounded px-0.5" > +</span>
      );
      ei++; oi++;
    } else {
      parts.push(<span key={key++}> {encoded[ei]} </span>);
      ei++; oi++;
    }
  }
  return <>{parts} </>;
}