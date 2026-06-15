import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { mathTools } from '@/constants/tools/mathTools';
import { Language } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';

interface MathToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: MathToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const meta = {
    title: t('categories.tools.math.meta.title'),
    description: t('categories.tools.math.meta.description'),
  };
  return buildPageMetadata(safeLang, '/math-tools', meta);
}

export default async function MathToolsPage({ params }: MathToolsPageProps) {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const cat = {
    title: t('categories.tools.math.title'),
    description: t('categories.tools.math.description'),
  };
  const jsonLd = buildCollectionPageJsonLd(safeLang, '/math-tools', cat.title, cat.description);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation language={safeLang} />
      <Tools tools={mathTools} title='categories.tools.math.title' />
      <CTA />
      <Footer />
    </>
  );
}
