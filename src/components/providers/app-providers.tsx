"use client";

import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import { ReactNode } from "react";

import { AuthProvider } from "./auth-provider";

type AppProvidersProps = {
  readonly children: ReactNode;
  readonly locale: string;
  readonly messages: AbstractIntlMessages;
};

export const AppProviders = ({
  children,
  locale,
  messages,
}: AppProvidersProps) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Shanghai">
      <AuthProvider>{children}</AuthProvider>
    </NextIntlClientProvider>
  );
};
