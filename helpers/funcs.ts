import { DEFAULT_LANGUAGE, Language } from "@/lib/i18n";

/**
 * Function for generate path
 */
export function getPath(path: string, lang: Language) {
  return lang === DEFAULT_LANGUAGE ? path : `/${lang}${path}`;
}