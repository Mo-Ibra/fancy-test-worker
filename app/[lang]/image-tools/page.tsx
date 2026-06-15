import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { imageTools } from '@/constants/tools/imageTools';
import { Language } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';

interface ImageToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ImageToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const meta = {
    title: t('categories.tools.image.meta.title'),
    description: t('categories.tools.image.meta.description'),
  };
  return buildPageMetadata(safeLang, '/image-tools', meta);
}

export default async function ImageToolsPage({ params }: ImageToolsPageProps) {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const cat = {
    title: t('categories.tools.image.title'),
    description: t('categories.tools.image.description'),
  };
  const jsonLd = buildCollectionPageJsonLd(safeLang, '/image-tools', cat.title, cat.description);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation language={safeLang} />
      <Tools tools={imageTools} title='categories.tools.image.title' />
      <CTA />
      <Footer />
    </>
  );
}
