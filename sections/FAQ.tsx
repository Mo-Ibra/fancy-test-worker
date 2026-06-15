"use client";

import { useState } from "react";
import { useT } from "@/context/TranslationProvider";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FAQProps {
  tKey: string;
}

export default function FAQ({ tKey }: FAQProps) {
  const t = useT(tKey);
  const raw = t("faq.items");
  const items = (Array.isArray(raw) ? raw : []) as FaqItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="mt-10 p-6 rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-blue-500" />
        </div>
        <h2 className="text-base font-bold text-foreground">{t("faq.title")}</h2>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-xl border transition-all duration-200 ${
                isOpen
                  ? "border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10"
                  : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/50"
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <span className={`text-sm font-semibold transition-colors duration-200 ${
                  isOpen ? "text-blue-600 dark:text-blue-400" : "text-foreground"
                }`}>
                  {item.question}
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isOpen ? "bg-blue-100 dark:bg-blue-800/40" : "bg-muted"
                }`}>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-500" : ""
                    }`}
                  />
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? "max-h-80" : "max-h-0"
                }`}
              >
                <div className="px-4 pb-4">
                  <div className="h-px bg-blue-200/50 dark:bg-blue-800/30 mb-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
