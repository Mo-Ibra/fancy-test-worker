import { useT } from "@/context/TranslationProvider";
import { Type, BarChart2, Clock, Hash, Monitor } from "lucide-react";

const icons = [Type, BarChart2, Clock, Hash, Monitor];

interface HowToUseProps {
  tKey: string;
  count?: number;
}

const colClasses: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

export default function HowToUse({ tKey, count = icons.length }: HowToUseProps) {
  const t = useT(tKey);
  const stepKeys = Array.from({ length: count }, (_, i) => `${i + 1}`);

  return (
    <div className="mt-10 p-6 rounded-2xl border border-border bg-card">
      <h2 className="text-base font-bold text-foreground mb-6">{t("howToUse.title")}</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${colClasses[count] || "lg:grid-cols-5"} gap-5`}>
        {stepKeys.map((key, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={key} className="group flex flex-col gap-3 p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-200">
                  <Icon className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors duration-200">{t(`howToUse.step${key}Title`)}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{t(`howToUse.step${key}Desc`)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
