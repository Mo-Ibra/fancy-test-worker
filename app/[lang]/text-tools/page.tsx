import type { Metadata } from 'next';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { textTools } from '@/constants/tools/textTools';
import { getTranslations } from 'next-intl/server';
import { Language } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';

interface TextToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: TextToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const meta = { title: t('categories.tools.text.meta.title'), description: t('categories.tools.text.meta.description') };
  return buildPageMetadata(safeLang, '/text-tools', meta);
}

export default async function TextToolsPage({ params }: TextToolsPageProps) {
  const { lang } = await params;

  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const cat = { title: t('categories.tools.text.title'), description: t('categories.tools.text.description') };
  const jsonLd = buildCollectionPageJsonLd(safeLang, '/text-tools', cat.title, cat.description);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation language={safeLang} />
      <Tools tools={textTools} title='categories.tools.text.title' />
      <CTA />
      <Footer />
    </>
  );
}
