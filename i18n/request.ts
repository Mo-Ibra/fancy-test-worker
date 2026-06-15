import { getRequestConfig } from 'next-intl/server';
import enMessages from './compiled/en.json';
import arMessages from './compiled/ar.json';

export default getRequestConfig(async ({ locale }) => ({
  locale: locale ?? 'en',
  messages: locale === 'ar' ? arMessages : enMessages,
  timeZone: 'UTC',
}));
