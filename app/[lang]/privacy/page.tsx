import type { Metadata } from 'next';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import StaticPage from '@/sections/StaticPage';
import { Language, getTranslations } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'pages/privacy') as any;
  return buildPageMetadata(safeLang, '/privacy', dict.metadata);
}

export default async function PrivacyPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang === 'en') notFound();
  const safeLang = lang as Language;
  const dict = await getTranslations(safeLang, 'pages/privacy') as any;
  return (
    <>
      <Navigation language={safeLang} />
      <StaticPage
        title={dict.content.title}
        subtitle={dict.content.subtitle}
        sections={dict.content.sections}
        lastUpdated={dict.content.lastUpdated}
      />
      <CTA />
      <Footer />
    </>
  );
}
