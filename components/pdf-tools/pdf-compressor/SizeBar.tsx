import { fmtSize } from "@/funcs/pdf-tools/PDFCompressorToolFuncs";

export default function SizeBar({ origKb, compKb }: { origKb: number; compKb: number }) {
  const pct = Math.min(100, (compKb / origKb) * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>0</span><span>Original ({fmtSize(origKb)})</span>
      </div>
      <div className="relative w-full h-5 rounded-full bg-muted/40 overflow-hidden">
        {/* Original full bar */}
        <div className="absolute inset-0 bg-red-200 dark:bg-red-900/30 rounded-full" />
        {/* Compressed bar */}
        <div className="absolute left-0 top-0 bottom-0 bg-emerald-500 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
          style={{ width: `${pct}%` }}>
          <span className="text-[9px] text-white font-bold whitespace-nowrap">{fmtSize(compKb)}</span>
        </div>
      </div>
      <div className="flex justify-between text-[10px]">
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{fmtSize(compKb)} compressed</span>
        <span className="text-red-500 font-bold">{fmtSize(origKb)} original</span>
      </div>
    </div>
  );
}