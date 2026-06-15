import { useLang } from "@/context/TranslationProvider";

export default function Toggle({ checked, onChange, label, description }: {
  checked: boolean; onChange: () => void; label: string; description?: string;
}) {
  const lang = useLang();
  const isAr = lang === "ar";
  return (
    <button
      onClick={onChange}
      className={`flex items-start gap-3 p-3 rounded-xl border text-start w-full transition-all duration-200 ${checked
        ? "border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-900/20"
        : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/40"
        }`}
    >
      <div
        className={`relative mt-0.5 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-blue-500" : "bg-border"}`}
        style={{ width: 32, height: 18 }}
      >
        <span className={`absolute top-0.5 inset-s-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all duration-200 ${
          checked 
            ? (isAr ? "-translate-x-3.5" : "translate-x-3.5") 
            : "translate-x-0"
        }`} />
      </div>
      <div>
        <p className={`text-xs font-bold ${checked ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</p>
        {description && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{description}</p>}
      </div>
    </button>
  );
}