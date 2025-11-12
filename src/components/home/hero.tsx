import { ArrowRight } from "lucide-react";
import Link from "next-intl/link";
import { useLocale, useTranslations } from "next-intl";

import { defaultLocale } from "@/lib/i18n/config";

export const Hero = () => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-8 py-16 text-white shadow-2xl">
      <div className="absolute right-10 top-10 hidden h-40 w-40 rounded-full bg-accent/20 blur-3xl md:block" />
      <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl">
        {t("hero.headline")}
      </h1>
      <p className="mt-6 max-w-2xl text-pretty text-lg text-white/70">
        {t("hero.subheadline")}
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/"
          locale={locale === defaultLocale ? undefined : locale}
          className="group flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-900 shadow-lg transition hover:translate-x-1 hover:shadow-xl"
        >
          {t("hero.cta")} <ArrowRight className="transition group-hover:translate-x-1" size={16} />
        </Link>
        <div className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.4em] text-white/70">
          {t("hero.stack")}
        </div>
      </div>
    </section>
  );
};
