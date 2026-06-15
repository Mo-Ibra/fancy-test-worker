import { ClipboardPaste, Plus, Trash2 } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function InputArea({ nums, input, setInput, newNum, setNewNum, addNumber, errors }: { nums: number[], input: string, setInput: (value: string) => void, newNum: string, setNewNum: (value: string) => void, addNumber: () => void, errors: string[] }) {
  const t = useT("math-tools/AverageCalculatorTool.json");

  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.numbers")}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground/60">{t("input.numbersCount", { count: nums.length })}</span>
          <button onClick={() => navigator.clipboard.readText().then(setInput).catch(() => { })}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
            <ClipboardPaste className="w-3 h-3" /> {t("input.paste")}
          </button>
          <button onClick={() => { setInput(""); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={t("input.placeholder")}
        className="h-36 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all placeholder:text-muted-foreground/40"
      />

      {/* Add number inline */}
      <div className="flex gap-2">
        <input
          type="number"
          value={newNum}
          onChange={e => setNewNum(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addNumber()}
          placeholder={t("input.addNumber")}
          aria-label={t("input.addNumber")}
          className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40"
        />
        <button onClick={addNumber} disabled={!newNum}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 disabled:opacity-40 text-xs font-medium transition-all">
          <Plus className="w-3.5 h-3.5" /> {t("input.addNumber")}
        </button>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10">
          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-0.5">{t("input.ignored", { count: errors.length })}</p>
          <p className="text-[10px] text-amber-500">{errors.slice(0, 3).join(" · ")}</p>
        </div>
      )}
    </div>
  )
}