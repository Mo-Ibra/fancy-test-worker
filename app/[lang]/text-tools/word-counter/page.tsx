import { Language, getTranslations } from '@/lib/i18n';
import {
  buildFaqJsonLd,
  buildToolJsonLd,
  generateToolPageMetadata,
  getToolSeoContent,
  type ToolPageSeoConfig,
} from '@/lib/seo';
import WordCounterView from '@/views/text-tools/WordCounterView';
import ToolJsonLd from '@/components/seo/ToolJsonLd';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const SEO_CONFIG: ToolPageSeoConfig = {
  path: '/text-tools/word-counter',
  categoryPath: '/text-tools',
  namespace: 'text-tools/WordCounterTool',
};

interface WordCounterToolPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: WordCounterToolPageProps): Promise<Metadata> {
  const { lang } = await params;
  return generateToolPageMetadata(lang as Language, SEO_CONFIG);
}

export default async function WordCounterToolPage({
  params,
}: WordCounterToolPageProps) {
  const { lang } = await params;

  if (lang === 'en') {
    notFound();
  }

  const safeLang = lang as Language;
  const content = await getToolSeoContent(
    safeLang,
    SEO_CONFIG.namespace
  );
  
  const { toolLd, breadcrumbLd } = buildToolJsonLd(
    safeLang,
    SEO_CONFIG.path,
    SEO_CONFIG.categoryPath,
    content
  );

  const dict = await getTranslations(safeLang, SEO_CONFIG.namespace) as Record<string, any>;
  const faqLd = buildFaqJsonLd(dict.faq.items as { question: string; answer: string }[]);

  return (
    <>
      <ToolJsonLd toolLd={toolLd} breadcrumbLd={breadcrumbLd} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <WordCounterView lang={safeLang} />
    </>
  );
}
