import { Language } from "@/lib/i18n";

export function getPath(path: string, lang: Language) {
  return `/${lang}${path}`;
}
