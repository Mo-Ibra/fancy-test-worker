import { getTranslations, getMessages } from 'next-intl/server';
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
import { Language } from '@/lib/i18n';

const SEO_CONFIG: ToolPageSeoConfig = {
  path: '/dev-tools/uuid-generator',
  categoryPath: '/dev-tools',
  namespace: 'dev-tools.UUIDGeneratorTool',
};

interface ToolPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { lang } = await params;
  return generateToolPageMetadata(lang as Language, SEO_CONFIG);
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { lang } = await params;

  const content = await getToolSeoContent(lang, SEO_CONFIG.namespace);
  const messages = await getMessages({ locale: lang });
  const parts = SEO_CONFIG.namespace.split('.');
  let dict: any = messages;
  for (const part of parts) {
    dict = dict?.[part];
  }
  const faqLd = buildFaqJsonLd(dict?.faq?.items ?? []);

  const { toolLd, breadcrumbLd } = buildToolJsonLd(lang as Language, SEO_CONFIG.path, SEO_CONFIG.categoryPath, content);

  return (
    <>
      <ToolJsonLd toolLd={toolLd} breadcrumbLd={breadcrumbLd} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <UUIDGeneratorView lang={lang as Language} />
    </>
  );
}
