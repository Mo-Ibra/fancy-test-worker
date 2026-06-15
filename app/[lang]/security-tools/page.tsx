import type { Metadata } from 'next';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { securityTools } from '@/constants/tools/securityTools';
import { Language, getTranslations } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';

interface SecurityToolsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: SecurityToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'sections/Categories') as any;
  const meta = dict.categories.tools.security.meta;
  return buildPageMetadata(safeLang, '/security-tools', meta);
}

export default async function SecurityToolsPage({ params }: SecurityToolsPageProps) {
  const { lang } = await params;

  if (lang === 'en') {
    notFound();
  }

  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'sections/Categories') as any;
  const cat = dict.categories.tools.security;
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
