import type { Metadata } from 'next';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Navigation from '@/components/Navigation';
import Tools from '@/sections/Tools';
import { developerTools } from '@/constants/tools/developerTools';
import { DEFAULT_LANGUAGE, getTranslations } from '@/lib/i18n';
import { buildPageMetadata, buildCollectionPageJsonLd } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getTranslations(DEFAULT_LANGUAGE, 'sections/Categories') as any;
  const meta = dict.categories.tools.developer.meta;
  return buildPageMetadata(DEFAULT_LANGUAGE, '/dev-tools', meta);
}

export default function DeveloperToolsPage() {
  const jsonLd = buildCollectionPageJsonLd(DEFAULT_LANGUAGE, '/dev-tools', 'Developer Tools', 'JSON formatter, Base64 encoder, regex tester, and other dev essentials.');
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation />
      <Tools tools={developerTools} title='categories.tools.developer.title' />
      <CTA />
      <Footer />
    </>
  );
}
