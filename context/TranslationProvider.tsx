"use client";

import { useTranslations, useLocale } from "next-intl";

export function useT(namespace?: string) {
  const ns = namespace?.replace(/\//g, ".").replace(/\.json$/, "");
  return useTranslations(ns);
}

export function useLang() {
  return useLocale();
}
