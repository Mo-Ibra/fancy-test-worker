export const SUPPORTED_LANGUAGES = ['en', /*'es', 'fr', 'de', 'it',*/ 'ar'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  ar: "العربية",
};

export function isValidLanguage(language: string): language is Language {
  return SUPPORTED_LANGUAGES.includes(language as Language);
}

export function stripLanguageFromPath(pathname: string): string {
  for (const lang of SUPPORTED_LANGUAGES) {
    if (pathname === `/${lang}`) {
      return "/";
    }
    if (pathname.startsWith(`/${lang}/`)) {
      return pathname.replace(`/${lang}`, "");
    }
  }
  return pathname;
}

export function getLocalizedPath(path: string, language: string): string {
  if (language === DEFAULT_LANGUAGE) {
    return path;
  }
  return `/${language}${path}`;
}

export function getAlternateLinks(
  currentPath: string,
  currentLanguage: Language
): Array<{ href: string; hreflang: string }> {
  return SUPPORTED_LANGUAGES.map((language) => {
    let href = getLocalizedPath(currentPath, language);
    if (!href.startsWith('/')) {
      href = '/' + href;
    }
    return { href, hreflang: language };
  });
}

export function getMetadata(path: string, lang: Language) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const localizedPath = getLocalizedPath(cleanPath, lang);
  return {
    alternates: {
      canonical: localizedPath,
      languages: Object.fromEntries(
        getAlternateLinks(cleanPath, lang).map(({ hreflang, href }) => [
          hreflang,
          href,
        ])
      ),
    },
  };
}
