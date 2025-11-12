import { ReactNode } from "react";

import { AppProviders } from "@/components/providers/app-providers";
import { SiteShell } from "@/components/layout/site-shell";
import { locales } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/get-messages";

type LocaleLayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
};

export const generateStaticParams = () =>
  locales.map((locale) => ({ locale }));

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <AppProviders locale={locale} messages={messages}>
      <SiteShell>{children}</SiteShell>
    </AppProviders>
  );
};

export default LocaleLayout;
