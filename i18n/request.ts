import { getRequestConfig } from 'next-intl/server';
import enMessages from './compiled/en.json';
import arMessages from './compiled/ar.json';

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolved = locale ?? (await requestLocale) ?? 'en';
  return {
    locale: resolved,
    messages: resolved === 'ar' ? arMessages : enMessages,
    timeZone: 'UTC',
  };
});
