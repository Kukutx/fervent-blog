"use client";

import { Languages } from "lucide-react";
import Link from "next-intl/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { defaultLocale, locales } from "@/lib/i18n/config";

export const LocaleSwitcher = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((current) => !current);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted transition hover:border-accent hover:text-accent"
      >
        <Languages size={16} />
        {t("language.label")}
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-white/10 bg-background/95 p-2 shadow-lg">
          {locales.map((item) => {
            const href = `/${item}${pathname.replace(`/${locale}`, "") || ""}`;

            return (
              <Link
                key={item}
                href={href === `/${item}` ? "/" : href.replace(/^\/+/, "/")}
                locale={item === defaultLocale ? undefined : item}
                className={`block rounded-xl px-3 py-2 text-sm transition hover:bg-accent/10 ${item === locale ? "text-accent" : "text-muted"}`}
                onClick={() => setOpen(false)}
              >
                {item.toUpperCase()}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
