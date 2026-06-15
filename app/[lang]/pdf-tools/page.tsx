import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { pdfTools } from '@/constants/tools/pdfTools';
import { Language } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';

interface PDFToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PDFToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const meta = {
    title: t('categories.tools.pdf.meta.title'),
    description: t('categories.tools.pdf.meta.description'),
  };
  return buildPageMetadata(safeLang, '/pdf-tools', meta);
}

export default async function PDFToolsPage({ params }: PDFToolsPageProps) {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const cat = {
    title: t('categories.tools.pdf.title'),
    description: t('categories.tools.pdf.description'),
  };
  const jsonLd = buildCollectionPageJsonLd(safeLang, '/pdf-tools', cat.title, cat.description);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation language={safeLang} />
      <Tools tools={pdfTools} title='categories.tools.pdf.title' />
      <CTA />
      <Footer />
    </>
  );
}
