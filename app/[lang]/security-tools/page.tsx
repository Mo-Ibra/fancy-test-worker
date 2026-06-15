import type { Metadata } from 'next';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { securityTools } from '@/constants/tools/securityTools';
import { getTranslations } from 'next-intl/server';
import { Language } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';

interface SecurityToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: SecurityToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const meta = { title: t('categories.tools.security.meta.title'), description: t('categories.tools.security.meta.description') };
  return buildPageMetadata(safeLang, '/security-tools', meta);
}

export default async function SecurityToolsPage({ params }: SecurityToolsPageProps) {
  const { lang } = await params;

  const safeLang = lang as Language;
  const t = await getTranslations({ locale: lang, namespace: 'sections.Categories' });
  const cat = { title: t('categories.tools.security.title'), description: t('categories.tools.security.description') };
  const jsonLd = buildCollectionPageJsonLd(safeLang, '/security-tools', cat.title, cat.description);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation language={safeLang} />
      <Tools tools={securityTools} title='categories.tools.security.title' />
      <CTA />
      <Footer />
    </>
  );
}
