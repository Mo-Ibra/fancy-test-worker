import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TranslationProvider } from "@/context/TranslationProvider";
import { DEFAULT_LANGUAGE, getMetadata, getTranslations, Language } from "@/lib/i18n";

import { ThemeProvider } from "@/context/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fancytoolbox.com';
  return {
    metadataBase: new URL(SITE_URL),
    ...getMetadata('/', DEFAULT_LANGUAGE),
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: { url: "/favicon.svg", type: "image/svg+xml" },
    },
    manifest: "/manifest.json",
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}>) {

  const resolvedParams = await params;
  const lang = resolvedParams?.lang || DEFAULT_LANGUAGE;
  const translations = await getTranslations(lang as Language);

  return (
    <html lang={lang} suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationProvider translations={translations} lang={lang}>
            {children}
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
