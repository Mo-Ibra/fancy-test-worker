import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SUPPORTED_LANGUAGES, Language, getMetadata } from '@/lib/i18n';

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

  if (!SUPPORTED_LANGUAGES.includes(lang as Language)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={lang}>
      <main dir={lang === 'ar' ? "rtl" : "ltr"}>
        {children}
      </main>
    </NextIntlClientProvider>
  );
}
