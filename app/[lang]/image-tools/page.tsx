import type { Metadata } from 'next';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { imageTools } from '@/constants/tools/imageTools';
import { Language, getTranslations } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';

interface ImageToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ImageToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'sections/Categories') as any;
  const meta = dict.categories.tools.image.meta;
  return buildPageMetadata(safeLang, '/image-tools', meta);
}

export default async function ImageToolsPage({ params }: ImageToolsPageProps) {
  const { lang } = await params;

  if (lang === 'en') {
    notFound();
  }

  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'sections/Categories') as any;
  const cat = dict.categories.tools.image;
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
