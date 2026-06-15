import { useMemo, useState } from "react";
import { toDecimal, fromDecimal } from "@/funcs/math-tools/NumberBaseConverterToolFuncs";
import CopyButton from "./CopyButton";

export default function BaseArithmetic({ base }: { base: number }) {
  const [x, setX] = useState("");
  const [y, setY] = useState("");

  const dx = toDecimal(x, base);
  const dy = toDecimal(y, base);

  const ops = useMemo(() => {
    if (dx === null || dy === null) return null;
    const add = dx + dy;
    const sub = dx - dy;
    const mul = dx * dy;
    const div = dy !== BigInt(0) ? dx / dy : null;
    return {
      add: fromDecimal(add < BigInt(0) ? -add : add, base) + (add < BigInt(0) ? " (neg)" : ""),
      sub: fromDecimal(sub < BigInt(0) ? -sub : sub, base) + (sub < BigInt(0) ? " (neg)" : ""),
      mul: fromDecimal(mul, base),
      div: div !== null ? fromDecimal(div, base) : "div/0",
    };
  }, [dx, dy, base]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] text-muted-foreground">Enter two values in base {base} to see arithmetic results</p>
      <div className="flex gap-2">
        <input value={x} onChange={e => setX(e.target.value.toUpperCase())} placeholder="A" aria-label="Value X"
          className="flex-1 px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
        <input value={y} onChange={e => setY(e.target.value.toUpperCase())} placeholder="B" aria-label="Value Y"
          className="flex-1 px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
      </div>
      {ops && (
        <div className="grid grid-cols-2 gap-2">
          {[
            { op: "A + B", val: ops.add },
            { op: "A − B", val: ops.sub },
            { op: "A × B", val: ops.mul },
            { op: "A ÷ B", val: ops.div },
          ].map(({ op, val }) => (
            <div key={op} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted/20">
              <span className="text-[10px] font-bold text-muted-foreground w-12 shrink-0">{op}</span>
              <code className="text-xs font-mono font-bold text-foreground flex-1 truncate">{val}</code>
              <CopyButton text={val ?? ""} small />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}