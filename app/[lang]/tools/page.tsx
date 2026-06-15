import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { allTools } from '@/constants/tools';
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
  const t = await getTranslations({ locale: lang, namespace: 'pages.allTools' });
  const dict = { metadata: { title: t('metadata.title'), description: t('metadata.description') } };
  return buildPageMetadata(safeLang, '/tools', dict.metadata);
}

export default async function AllToolsPage({ params }: PageProps) {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'pages.allTools' });
  return (
    <>
      <Navigation language={safeLang} />
      <Tools tools={allTools} title='categories.tools.all.title' customTitle={t('content.title')} hideBreadcrumb />
      <CTA />
      <Footer />
    </>
  );
}
