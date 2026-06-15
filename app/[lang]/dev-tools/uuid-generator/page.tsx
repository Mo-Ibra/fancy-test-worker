import { Language, getTranslations } from '@/lib/i18n';
import {
  buildFaqJsonLd,
  buildToolJsonLd,
  generateToolPageMetadata,
  getToolSeoContent,
  type ToolPageSeoConfig,
} from '@/lib/seo';
import UUIDGeneratorView from '@/views/dev-tools/UUIDGeneratorView';
import ToolJsonLd from '@/components/seo/ToolJsonLd';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const SEO_CONFIG: ToolPageSeoConfig = {
  path: '/dev-tools/uuid-generator',
  categoryPath: '/dev-tools',
  namespace: 'dev-tools/UUIDGeneratorTool',
};

interface UUIDGeneratorToolPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: UUIDGeneratorToolPageProps): Promise<Metadata> {
  const { lang } = await params;
  return generateToolPageMetadata(lang as Language, SEO_CONFIG);
}

export default async function UUIDGeneratorToolPage({
  params,
}: UUIDGeneratorToolPageProps) {
  const { lang } = await params;

  if (lang === 'en') {
    notFound();
  }

  const content = await getToolSeoContent(
    lang as Language,
    SEO_CONFIG.namespace
  );
  const dict = await getTranslations(lang as Language, SEO_CONFIG.namespace) as Record<string, any>;
  const faqLd = buildFaqJsonLd(dict.faq.items as { question: string; answer: string }[]);
  
  const { toolLd, breadcrumbLd } = buildToolJsonLd(
    lang as Language,
    SEO_CONFIG.path,
    SEO_CONFIG.categoryPath,
    content
  );

  return (
    <>
      <ToolJsonLd toolLd={toolLd} breadcrumbLd={breadcrumbLd} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <UUIDGeneratorView lang={lang as Language} />
    </>
  );
}
