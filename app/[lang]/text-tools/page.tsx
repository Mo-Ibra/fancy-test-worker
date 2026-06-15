import type { Metadata } from 'next';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { textTools } from '@/constants/tools/textTools';
import { Language, getTranslations } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';

interface TextToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: TextToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'sections/Categories') as any;
  const meta = dict.categories.tools.text.meta;
  return buildPageMetadata(safeLang, '/text-tools', meta);
}

export default async function TextToolsPage({ params }: TextToolsPageProps) {
  const { lang } = await params;

  if (lang === 'en') {
    notFound();
  }

  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'sections/Categories') as any;
  const cat = dict.categories.tools.text;
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
