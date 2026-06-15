import type { Metadata } from 'next';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { seoTools } from '@/constants/tools/seoTools';
import { Language, getTranslations } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';

interface SEOToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: SEOToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'sections/Categories') as any;
  const meta = dict.categories.tools.seo.meta;
  return buildPageMetadata(safeLang, '/seo-tools', meta);
}

export default async function SEOToolsPage({ params }: SEOToolsPageProps) {
  const { lang } = await params;

  if (lang === 'en') {
    notFound();
  }

  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'sections/Categories') as any;
  const cat = dict.categories.tools.seo;
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
