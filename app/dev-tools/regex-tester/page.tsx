import { DEFAULT_LANGUAGE, Language, getTranslations } from '@/lib/i18n';
import {
  buildFaqJsonLd,
  buildToolJsonLd,
  generateToolPageMetadata,
  getToolSeoContent,
  type ToolPageSeoConfig,
} from '@/lib/seo';
import RegexTesterView from '@/views/dev-tools/RegexTesterView';
import ToolJsonLd from '@/components/seo/ToolJsonLd';
import { Metadata } from 'next';

const SEO_CONFIG: ToolPageSeoConfig = {
  path: '/dev-tools/regex-tester',
  categoryPath: '/dev-tools',
  namespace: 'dev-tools/RegexTesterTool',
};

export async function generateMetadata(): Promise<Metadata> {
  return generateToolPageMetadata(DEFAULT_LANGUAGE, SEO_CONFIG);
}

export default async function RegexTesterToolPage() {
  const lang = DEFAULT_LANGUAGE;
  const content = await getToolSeoContent(lang, SEO_CONFIG.namespace);
  const dict = await getTranslations(lang, SEO_CONFIG.namespace) as Record<string, any>;
  const faqLd = buildFaqJsonLd(dict.faq.items as { question: string; answer: string }[]);

  const { toolLd, breadcrumbLd } = buildToolJsonLd(
    lang,
    SEO_CONFIG.path,
    SEO_CONFIG.categoryPath,
    content
  );

  return (
    <>
      <ToolJsonLd toolLd={toolLd} breadcrumbLd={breadcrumbLd} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <RegexTesterView lang={lang as Language} />
    </>
  );
}
