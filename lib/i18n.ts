export const SUPPORTED_LANGUAGES = ['en', /*'es', 'fr', 'de', 'it',*/ 'ar'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  // es: 'Español',
  // fr: 'Français',
  // de: 'Deutsch',
  // it: 'Italian',
  ar: "العربية"
};

/**
 * Validates if a given language is supported
 * 
 * @param language 
 * @returns 
 */
export function isValidLanguage(language: string): language is Language {
  return SUPPORTED_LANGUAGES.includes(language as Language);
}

/**
 * Gets a safe language, defaulting to DEFAULT_LANGUAGE if invalid
 */
export function getSafeLanguage(language: string | undefined): Language {
  if (language && isValidLanguage(language)) {
    return language;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Function for detect the langauge in the pathname
 * 
 * Example:
 *  const pathname = usePathname();
 *  const currentLanguage = detectLanguage(pathname)
 *  Result: "en || es || ar || etc"
 */
export function detectLanguage(pathname: string): Language {
  for (const lang of SUPPORTED_LANGUAGES) {
    if (pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)) {
      return lang as Language;
    }
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Loads translation dictionary for a given language and namespace
 * 
 * Example: getTranslations('es', 'common');
 */
export async function getTranslations(language: Language, namespace: string = 'common'): Promise<Record<string, string>> {
  try {
    const translations = await import(
      `@/i18n/${language}/${namespace}.json`
    );
    return translations.default;
  } catch (error) {

    console.warn(`Missing translation: ${language}/${namespace}`);

    // Fallback to English
    if (language !== DEFAULT_LANGUAGE) {
      try {
        // Load english language
        const fallback = await import(`@/i18n/${DEFAULT_LANGUAGE}/${namespace}.json`);
        return fallback.default;
      } catch (fallbackError) {
        console.error(
          `Failed to load fallback translations for ${namespace}:`,
          fallbackError
        );
        return {};
      }
    }
    return {};
  }
}

/**
 * Gets a nested translation value using dot notation
 * Example: getTranslation(translations, 'nav.home')
 */
export function getTranslation(
  translations: Record<string, any>,
  key: string,
  fallback: any = key
): any {
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return fallback;
    }
  }

  return value !== undefined ? value : fallback;
}

/**
 * Creates a translation function for a given translations object.
 * 
 * This function returns a simpler function `t` that can be used
 * to get nested translations using dot notation keys.
 * 
 * Example usage:
 * const t = createTranslator(translations);
 * t('nav.home', 'Home'); // returns translation or fallback
 * 
 * @param translations - The translations object (usually loaded JSON for a specific language)
 * @returns A function that accepts a key, optional parameters for interpolation, and optional fallback and returns the translated string
 */
export function createTranslator(translations: Record<string, any>) {
  return (key: string, params?: Record<string, any>, fallback?: any): any => {
    const translation = getTranslation(translations, key, fallback);
    if (params && typeof translation === 'string') {
      return Object.keys(params).reduce((str, key) => {
        return str.replace(new RegExp(`\\{${key}\\}`, 'g'), params[key]);
      }, translation);
    }
    return translation;
  };
}


/**
 * Removes any language prefix from a pathname.
 * 
 * Useful when switching languages so that you don't end up
 * with multiple language codes in the URL (e.g., "/es/it/page").
 * 
 * Examples:
 * stripLanguageFromPath("/es/tools") => "/tools"
 * stripLanguageFromPath("/it") => "/"
 * stripLanguageFromPath("/about") => "/about" (no change)
 * 
 * @param pathname - The current URL path
 * @returns The pathname without any language prefix
 */
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

/**
 * Generates the href for a given path in a specific language
 * English (default language) has no prefix, other languages are prefixed with their language code
 */
export function getLocalizedPath(path: string, language: Language): string {
  // English doesn't need a language prefix
  if (language === DEFAULT_LANGUAGE) {
    return path;
  }
  return `/${language}${path}`;
}

/**
 * Generates alternate language hrefs for hreflang meta tags
 * English (default language) has no prefix, other languages are prefixed with their language code
 * 
 * Example: getAlternateLiks("tools/image-compressor", "en")
 */
export function getAlternateLinks(
  currentPath: string,
  currentLanguage: Language
): Array<{ href: string; hreflang: string }> {
  return SUPPORTED_LANGUAGES.map((language) => {
    let href = getLocalizedPath(currentPath, language);
    // Ensure the path starts with / for absolute URLs in hreflang
    if (!href.startsWith('/')) {
      href = '/' + href;
    }
    return {
      href,
      hreflang: language,
    };
  });
}

/**
 * Generates SEO metadata alternates for a given path
 */
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
