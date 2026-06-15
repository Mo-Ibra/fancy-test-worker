import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { popularTools } from '@/constants/tools';
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
  const t = await getTranslations({ locale: lang, namespace: 'pages.popularTools' });
  const dict = { metadata: { title: t('metadata.title'), description: t('metadata.description') } };
  return buildPageMetadata(safeLang, '/popular-tools', dict.metadata);
}

export default async function PopularToolsPage({ params }: PageProps) {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'pages.popularTools' });
  return (
    <>
      <Navigation language={safeLang} />
      <Tools tools={popularTools} title='categories.tools.popular.title' customTitle={t('content.title')} hideBreadcrumb />
      <CTA />
      <Footer />
    </>
  );
}
