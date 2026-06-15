import { getRequestConfig } from 'next-intl/server';
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.join(process.cwd(), 'i18n');

function loadLocaleMessages(locale: string): Record<string, any> {
  const messages: Record<string, any> = {};
  const dir = path.join(LOCALES_DIR, locale);

  if (!fs.existsSync(dir)) return messages;

  function walk(currentDir: string, target: Record<string, any>) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const child: Record<string, any> = {};
        target[entry.name] = child;
        walk(path.join(currentDir, entry.name), child);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        const key = entry.name.slice(0, -5);
        const content = JSON.parse(
          fs.readFileSync(path.join(currentDir, entry.name), 'utf-8')
        );
        target[key] = content;
      }
    }
  }

  walk(dir, messages);
  return messages;
}

function deepMerge(target: Record<string, any>, source: Record<string, any>) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else if (!(key in target)) {
      target[key] = source[key];
    }
  }
}

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = locale ?? (await requestLocale) ?? 'en';
  const messages = loadLocaleMessages(resolvedLocale);

  if (resolvedLocale !== 'en') {
    const enMessages = loadLocaleMessages('en');
    deepMerge(messages, enMessages);
  }

  return {
    locale: resolvedLocale,
    messages,
    timeZone: 'UTC',
  };
});
