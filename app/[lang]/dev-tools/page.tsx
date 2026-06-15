import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { developerTools } from '@/constants/tools/developerTools';
import { Language } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';

interface DeveloperToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: DeveloperToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const meta = {
    title: t('categories.tools.developer.meta.title'),
    description: t('categories.tools.developer.meta.description'),
  };
  return buildPageMetadata(safeLang, '/dev-tools', meta);
}

export default async function DeveloperToolsPage({ params }: DeveloperToolsPageProps) {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const cat = {
    title: t('categories.tools.developer.title'),
    description: t('categories.tools.developer.description'),
  };
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
