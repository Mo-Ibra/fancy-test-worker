import { HreflangEntry, PageSet, uid } from "@/funcs/seo-tools/HreflangGeneratorToolFuncs";
import { Plus, Trash2 } from "lucide-react";
import EntryRow from "./EntryRow";

export default function PageSetCard({
  ps, onUpdate, onRemove, showRemove, t,
}: {
  ps: PageSet;
  onUpdate: (ps: PageSet) => void;
  onRemove: () => void;
  showRemove: boolean; t: any;
}) {
  const addEntry = () => onUpdate({
    ...ps,
    entries: [...ps.entries, { id: uid(), lang: "en", region: "", url: "", isDefault: false }],
  });
  const removeEntry = (id: string) => onUpdate({ ...ps, entries: ps.entries.filter(e => e.id !== id) });
  const updateEntry = (e: HreflangEntry) => onUpdate({ ...ps, entries: ps.entries.map(x => x.id === e.id ? e : x) });

  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <input value={ps.name} onChange={e => onUpdate({ ...ps, name: e.target.value })}
          placeholder="Page name / URL path" aria-label="Page name"
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
        {showRemove && (
          <button onClick={onRemove}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:border-red-300 hover:text-red-500 text-xs font-medium transition-all">
            <Trash2 className="w-3.5 h-3.5" /> Remove page
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {ps.entries.map(e => (
          <EntryRow key={e.id} entry={e}
            onUpdate={updateEntry}
            onRemove={() => removeEntry(e.id)}
            showRemove={ps.entries.length > 1} />
        ))}
      </div>
      <button onClick={addEntry}
        className="flex items-center gap-2 justify-center py-2.5 rounded-2xl border-2 border-dashed border-border hover:border-blue-300 hover:text-blue-500 text-xs font-medium text-muted-foreground transition-all">
        <Plus className="w-4 h-4" /> {t("pageSets.addLanguage")}
      </button>
    </div>
  );
}