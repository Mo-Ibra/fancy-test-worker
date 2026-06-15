import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES, Language, getMetadata, getTranslations } from '@/lib/i18n';
import { TranslationProvider } from '@/context/TranslationProvider';

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata(
  { params }: LanguageLayoutProps
): Promise<Metadata> {
  const { lang } = await params;
  return getMetadata(`/${lang}`, lang as Language);
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({
    lang,
  }));
}

export default async function Layout({
  children,
  params,
}: LanguageLayoutProps) {

  const { lang } = await params;

  const translations = await getTranslations(lang as Language);

  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang as Language)) {
    notFound();
  }

  return (
    <TranslationProvider translations={translations} lang={lang}>
      <main dir={lang === 'ar' ? "rtl" : "ltr"}>
        {children}
      </main>
    </TranslationProvider>
  );
}
