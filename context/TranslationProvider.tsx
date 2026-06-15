"use client";

import { createTranslator, getTranslations, Language } from "@/lib/i18n";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

interface TranslationContextType {
  translations: Record<string, any>;
  lang: Language;
  loadNamespace: (ns: string) => Promise<void>;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

const COMMON_NAMESPACES = [
  "sections/Navigation",
  "sections/CTA",
  "sections/Footer",
  "sections/Categories",
  "sections/ToolsList",
];

export function TranslationProvider({ translations: initialTranslations, lang, children }: any) {
  const loadedRef = useRef<Set<string>>(new Set(["common", ...COMMON_NAMESPACES]));

  const [translationsMap, setTranslationsMap] = useState<Record<string, any>>(() => {
    const map: Record<string, any> = { common: initialTranslations };
    return map;
  });

  useEffect(() => {
    Promise.all(
      COMMON_NAMESPACES.map(async (ns) => {
        try {
          const data = await getTranslations(lang, ns);
          setTranslationsMap((prev) => (prev[ns] ? prev : { ...prev, [ns]: data }));
        } catch {
          loadedRef.current.delete(ns);
        }
      })
    );
  }, [lang]);

  const loadNamespace = useCallback(async (ns: string) => {
    if (loadedRef.current.has(ns)) return;
    loadedRef.current.add(ns);

    try {
      const data = await getTranslations(lang, ns);
      setTranslationsMap((prev) => (prev[ns] ? prev : { ...prev, [ns]: data }));
    } catch {
      loadedRef.current.delete(ns);
    }
  }, [lang]);

  return (
    <TranslationContext.Provider value={{ translations: translationsMap, lang, loadNamespace }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useT(namespace: string = "common") {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error("useT must be used within a TranslationProvider");
  }

  const { translations, loadNamespace } = context;

  const ns = namespace.endsWith(".json")
    ? namespace.substring(0, namespace.length - 5)
    : namespace;

  useEffect(() => {
    if (ns !== "common" && !translations[ns]) {
      loadNamespace(ns);
    }
  }, [ns, translations, loadNamespace]);

  const data = translations[ns] || (ns === "common" ? translations.common : {});
  return (key: string, params?: Record<string, any>, fallback?: any): any => createTranslator(data)(key, params, fallback);
}

export function useLang() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useLang must be used within a TranslationProvider");
  }
  return context.lang;
}
