import type { Metadata } from 'next';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { seoTools } from '@/constants/tools/seoTools';
import { getTranslations } from 'next-intl/server';
import { Language } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';

interface SEOToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: SEOToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const meta = { title: t('categories.tools.seo.meta.title'), description: t('categories.tools.seo.meta.description') };
  return buildPageMetadata(safeLang, '/seo-tools', meta);
}

export default async function SEOToolsPage({ params }: SEOToolsPageProps) {
  const { lang } = await params;

  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const cat = { title: t('categories.tools.seo.title'), description: t('categories.tools.seo.description') };
  const jsonLd = buildCollectionPageJsonLd(safeLang, '/seo-tools', cat.title, cat.description);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation language={safeLang} />
      <Tools tools={seoTools} title='categories.tools.seo.title' />
      <CTA />
      <Footer />
    </>
  );
}
