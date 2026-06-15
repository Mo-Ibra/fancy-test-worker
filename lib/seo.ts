import { Metadata } from 'next';
import { getTranslations, getMessages } from 'next-intl/server';
import {
  Language,
  getMetadata,
} from '@/lib/i18n';

export const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fancytoolbox.com';

export interface ToolSeoContent {
  header: {
    title: string;
    description: string;
    keywords: string;
  };
  breadcrumb: {
    allTools: string;
    toolTitle: string;
    current: string;
  };
}

export interface ToolPageSeoConfig {
  path: string;
  categoryPath: string;
  namespace: string;
}

export function getLangPath(lang: Language): string {
  return `/${lang}`;
}

export async function getToolSeoContent(
  locale: string,
  namespace: string
): Promise<ToolSeoContent> {
  const t = await getTranslations({ locale, namespace });
  return {
    header: {
      title: t('header.title'),
      description: t('header.description'),
      keywords: t('header.keywords'),
    },
    breadcrumb: {
      allTools: t('breadcrumb.allTools'),
      toolTitle: t('breadcrumb.toolTitle'),
      current: t('breadcrumb.current'),
    },
  };
}

export function buildToolMetadata(
  lang: Language,
  path: string,
  content: ToolSeoContent
): Metadata {
  const seo = getMetadata(path, lang);
  const langPath = getLangPath(lang);
  const { title, description, keywords } = content.header;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE_BASE_URL),
    alternates: seo.alternates,
    openGraph: {
      title,
      description,
      url: `${SITE_BASE_URL}${langPath}${path}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export async function generateToolPageMetadata(
  lang: Language,
  config: ToolPageSeoConfig
): Promise<Metadata> {
  const content = await getToolSeoContent(lang, config.namespace);
  return buildToolMetadata(lang, config.path, content);
}

export function buildToolJsonLd(
  lang: Language,
  path: string,
  categoryPath: string,
  content: ToolSeoContent
) {
  const langPath = getLangPath(lang);
  const fullPath = `${langPath}${path}`;

  const toolLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: content.header.title,
    description: content.header.description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: content.breadcrumb.allTools,
        item: `${SITE_BASE_URL}${langPath}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: content.breadcrumb.toolTitle,
        item: `${SITE_BASE_URL}${langPath}${categoryPath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: content.breadcrumb.current,
        item: `${SITE_BASE_URL}${fullPath}`,
      },
    ],
  };

  return { toolLd, breadcrumbLd };
}

export async function getPageMeta(
  lang: Language,
  namespace: string,
  metaKey: string
): Promise<{ title: string; description: string; keywords?: string }> {
  const messages = await getMessages({ locale: lang });
  const parts = namespace.split('.');
  let dict: any = messages;
  for (const part of parts) {
    dict = dict?.[part];
  }
  const meta = getNestedValue(dict, metaKey) as { title: string; description: string; keywords?: string } | undefined;
  return meta ?? { title: '', description: '' };
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function buildPageMetadata(
  lang: Language,
  canonicalPath: string,
  meta: { title: string; description: string; keywords?: string },
): Metadata {
  const seo = getMetadata(canonicalPath, lang);
  const langPath = getLangPath(lang);
  const { title, description, keywords } = meta;

  return {
    title,
    description,
    keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
    metadataBase: new URL(SITE_BASE_URL),
    alternates: seo.alternates,
    openGraph: {
      title,
      description,
      url: `${SITE_BASE_URL}${langPath}${canonicalPath}`,
      type: 'website',
      siteName: 'Fancy Toolbox',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function buildWebsiteJsonLd(lang: Language) {
  const langPath = getLangPath(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Fancy Toolbox',
    url: `${SITE_BASE_URL}${langPath}/`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_BASE_URL}${langPath}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildCollectionPageJsonLd(
  lang: Language,
  path: string,
  name: string,
  description: string,
) {
  const langPath = getLangPath(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${SITE_BASE_URL}${langPath}${path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Fancy Toolbox',
      url: `${SITE_BASE_URL}${langPath}/`,
    },
  };
}
