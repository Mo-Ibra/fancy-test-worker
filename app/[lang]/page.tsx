import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomeView from '@/views/home/HomeView';
import { Language, getTranslations, SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { buildPageMetadata, buildWebsiteJsonLd } from '@/lib/seo';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'sections/Hero') as any;
  return buildPageMetadata(safeLang, '/', dict.metadata);
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  if (lang === 'en') {
    notFound();
  }

  const jsonLd = buildWebsiteJsonLd(lang as Language);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeView lang={lang as Language} />
    </>
  );
}
