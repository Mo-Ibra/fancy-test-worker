import { ClipboardPaste, Trash2 } from "lucide-react";

export default function TextInput({ text, setText, setHighlighted, totalWords, hasText, t }: { text: string; setText: (text: string) => void; setHighlighted: (highlighted: string) => void; totalWords: number; hasText: boolean; t: any }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.yourText")}</p>
        <div className="flex gap-2">
          {hasText && <span className="text-xs text-muted-foreground/60">{t("common.wordCount", { count: totalWords.toLocaleString() })}</span>}
          <button onClick={() => navigator.clipboard.readText().then(setText).catch(() => { })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
            <ClipboardPaste className="w-3.5 h-3.5" /> {t("common.paste")}
          </button>
          <button onClick={() => { setText(""); setHighlighted(""); }} disabled={!text}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setHighlighted(""); }}
        placeholder={t("input.placeholder")}
        rows={8}
        className="w-full px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all placeholder:text-muted-foreground/40 shadow-sm leading-relaxed"
      />
    </div>
  )
}