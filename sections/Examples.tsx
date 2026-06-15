import { useTranslations } from "next-intl";
import { FileText, Eye } from "lucide-react";

interface ExamplesProps {
  tKey: string;
}

export default function Examples({ tKey }: ExamplesProps) {
  const t = useTranslations(tKey.replace('.json', '').replace(/\//g, '.'));

  return (
    <div className="mt-10 p-6 rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Eye className="w-4 h-4 text-blue-500" />
        </div>
        <h2 className="text-base font-bold text-foreground">{t("examples.title")}</h2>
      </div>
      <div className="mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {t("examples.sampleLabel")}
        </p>
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {t.raw("examples.sampleText")}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-4 rounded-xl bg-linear-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-card border border-blue-100 dark:border-blue-900/30">
        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-blue-500" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1.5">
            {t("examples.stats")}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.raw("examples.result")}
          </p>
        </div>
      </div>
    </div>
  );
}
