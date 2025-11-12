import { notFound } from "next/navigation";

import { Locale, locales } from "./config";

const messagesImports: Record<Locale, () => Promise<Record<string, string>>> = {
  en: () => import("@/messages/en.json").then((mod) => mod.default),
  zh: () => import("@/messages/zh.json").then((mod) => mod.default),
  es: () => import("@/messages/es.json").then((mod) => mod.default),
  fr: () => import("@/messages/fr.json").then((mod) => mod.default),
};

export const getMessages = async (locale: string) => {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const loadMessages = messagesImports[locale as Locale];

  if (!loadMessages) {
    notFound();
  }

  return loadMessages();
};
