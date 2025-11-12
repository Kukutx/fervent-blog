import { notFound } from "next/navigation";
import type { AbstractIntlMessages } from "next-intl";

import { Locale, locales } from "./config";

const messagesImports: Record<Locale, () => Promise<AbstractIntlMessages>> = {
  en: () => import("@/messages/en.json").then((mod) => mod.default as AbstractIntlMessages),
  zh: () => import("@/messages/zh.json").then((mod) => mod.default as AbstractIntlMessages),
  es: () => import("@/messages/es.json").then((mod) => mod.default as AbstractIntlMessages),
  fr: () => import("@/messages/fr.json").then((mod) => mod.default as AbstractIntlMessages),
};

export const getMessages = async (locale: string): Promise<AbstractIntlMessages> => {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const loadMessages = messagesImports[locale as Locale];

  if (!loadMessages) {
    notFound();
  }

  return loadMessages();
};
