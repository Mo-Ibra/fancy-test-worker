export default function BinaryDisplay({ bin }: { bin: string }) {
  const padded = bin.padStart(Math.ceil(bin.length / 8) * 8, "0");
  const groups: string[] = [];
  for (let i = 0; i < padded.length; i += 4) groups.push(padded.slice(i, i + 4));
  return (
    <span className="font-mono text-sm break-all" >
      {
        groups.map((g, i) => (
          <span key={i} >
            {
              [...g].map((bit, j) => (
                <span key={j} className={bit === "1" ? "text-blue-500 dark:text-blue-400 font-bold" : "text-muted-foreground/40"} >
                  {bit}
                </span>
              ))
            }
            {i < groups.length - 1 && <span className="text-muted-foreground/20 mx-0.5" >·</span>}
          </span>
        ))
      }
    </span>
  );
}