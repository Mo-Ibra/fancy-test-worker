import type { MetadataRoute } from 'next';
import { SITE_BASE_URL } from '@/lib/seo';
import { SUPPORTED_LANGUAGES, getLocalizedPath } from '@/lib/i18n';
import { textTools } from '@/constants/tools/textTools';
import { imageTools } from '@/constants/tools/imageTools';
import { pdfTools } from '@/constants/tools/pdfTools';
import { developerTools } from '@/constants/tools/developerTools';
import { mathTools } from '@/constants/tools/mathTools';
import { securityTools } from '@/constants/tools/securityTools';
import { seoTools } from '@/constants/tools/seoTools';

const CATEGORY_PATHS = [
  '/text-tools',
  '/image-tools',
  '/pdf-tools',
  '/dev-tools',
  '/math-tools',
  '/security-tools',
  '/seo-tools',
];

const ALL_TOOLS = [
  ...textTools,
  ...imageTools,
  ...pdfTools,
  ...developerTools,
  ...mathTools,
  ...securityTools,
  ...seoTools,
];

const STATIC_PATHS = [
  '/',
  '/popular-tools',
  '/tools',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies',
  '/changelog',
];

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = [...SUPPORTED_LANGUAGES];
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of languages) {
    const localizedPath = (path: string) => getLocalizedPath(path, lang);

    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_BASE_URL}${localizedPath(path)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: path === '/' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            languages.map((l) => [l, `${SITE_BASE_URL}${getLocalizedPath(path, l)}`])
          ),
        },
      });
    }

    for (const path of CATEGORY_PATHS) {
      entries.push({
        url: `${SITE_BASE_URL}${localizedPath(path)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            languages.map((l) => [l, `${SITE_BASE_URL}${getLocalizedPath(path, l)}`])
          ),
        },
      });
    }

    for (const tool of ALL_TOOLS) {
      entries.push({
        url: `${SITE_BASE_URL}${localizedPath(tool.href)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            languages.map((l) => [l, `${SITE_BASE_URL}${getLocalizedPath(tool.href, l)}`])
          ),
        },
      });
    }
  }

  return entries;
}
