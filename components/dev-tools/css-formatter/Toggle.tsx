import { useLocale } from "next-intl";

export default function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <button onClick={() => onChange(!checked)}
      className={`relative shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-blue-500" : "bg-border"}`}
      style={{ width: 36, height: 20 }}>
      <span className={`absolute top-0.5 inset-s-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
        checked 
          ? (isAr ? "-translate-x-4" : "translate-x-4") 
          : "translate-x-0"
      }`} />
    </button>
  );
}