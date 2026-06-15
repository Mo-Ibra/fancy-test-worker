import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HomeView from '@/views/home/HomeView';
import { Language } from '@/lib/i18n';
import { buildPageMetadata, buildWebsiteJsonLd } from '@/lib/seo';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Hero' });
  const meta = {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
  return buildPageMetadata(safeLang, '/', meta);
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const safeLang = lang as Language;
  const jsonLd = buildWebsiteJsonLd(safeLang);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeView lang={safeLang} />
    </>
  );
}
