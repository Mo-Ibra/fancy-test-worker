export default function Sel({ value, onChange, options, className = "" }: {
  value: string; onChange: (v: string) => void;
  options: { v: string; l: string }[]; className?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className={`px-2 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all ${className}`}>
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}