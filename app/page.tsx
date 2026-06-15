import type { Metadata } from 'next';
import HomeView from '@/views/home/HomeView';
import { DEFAULT_LANGUAGE, getTranslations } from '@/lib/i18n';
import { buildPageMetadata, buildWebsiteJsonLd } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getTranslations(DEFAULT_LANGUAGE, 'sections/Hero') as any;
  return buildPageMetadata(DEFAULT_LANGUAGE, '/', dict.metadata);
}

export default function HomePage() {
  const jsonLd = buildWebsiteJsonLd(DEFAULT_LANGUAGE);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeView lang={DEFAULT_LANGUAGE} />
    </>
  );
}
