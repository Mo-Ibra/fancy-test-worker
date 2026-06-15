import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import StaticPage from '@/sections/StaticPage';
import { Language } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'pages.about' });
  const dict = { metadata: { title: t('metadata.title'), description: t('metadata.description') } };
  return buildPageMetadata(safeLang, '/about', dict.metadata);
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'pages.about' });
  return (
    <>
      <Navigation language={safeLang} />
      <StaticPage
        title={t('content.title')}
        subtitle={t('content.subtitle')}
        sections={t.raw('content.sections')}
      />
      <CTA />
      <Footer />
    </>
  );
}
