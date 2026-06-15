import { useT } from "@/context/TranslationProvider";

export default function Instructions() {
  const t = useT("pdf-tools/PDFMergerTool.json");

  const steps = [
    { step: "1", text: t("instructions.step1") },
    { step: "2", text: t("instructions.step2") },
    { step: "3", text: t("instructions.step3") },
    { step: "4", text: t("instructions.step4") },
  ];

  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("instructions.title")}</p>
      <div className="flex flex-col gap-2.5">
        {steps.map(({ step, text }) => (
          <div key={step} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{step}</span>
            <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}