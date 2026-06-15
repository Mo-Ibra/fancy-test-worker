import type { Metadata } from 'next';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { developerTools } from '@/constants/tools/developerTools';
import { Language, getTranslations } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';

interface DeveloperToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: DeveloperToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'sections/Categories') as any;
  const meta = dict.categories.tools.developer.meta;
  return buildPageMetadata(safeLang, '/dev-tools', meta);
}

export default async function DeveloperToolsPage({ params }: DeveloperToolsPageProps) {
  const { lang } = await params;

  if (lang === 'en') {
    notFound();
  }

  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'sections/Categories') as any;
  const cat = dict.categories.tools.developer;
  const jsonLd = buildCollectionPageJsonLd(safeLang, '/dev-tools', cat.title, cat.description);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation language={safeLang} />
      <Tools tools={developerTools} title='categories.tools.developer.title' />
      <CTA />
      <Footer />
    </>
  );
}
