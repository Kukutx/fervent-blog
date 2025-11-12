"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { getLocalizedHref } from "@/lib/i18n/routing";

export const Footer = () => {
  const t = useTranslations();
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  const [runningTime, setRunningTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 计算运行时间
  useEffect(() => {
    const startDate = new Date(process.env.NEXT_PUBLIC_SITE_START_DATE || "2025-01-01");

    const updateRunningTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRunningTime({ days, hours, minutes, seconds });
    };

    updateRunningTime();
    const timer = setInterval(updateRunningTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const footerLinks = [
    {
      title: t("footer.navigation"),
      links: [
        { href: getLocalizedHref("/", locale), label: t("navigation.home") },
        { href: getLocalizedHref("/archives", locale), label: t("navigation.archives") },
        { href: getLocalizedHref("/categories", locale), label: t("navigation.categories") },
        { href: getLocalizedHref("/tags", locale), label: t("navigation.tags") },
      ],
    },
    {
      title: t("footer.about"),
      links: [
        { href: getLocalizedHref("/about", locale), label: t("navigation.about") },
        { href: getLocalizedHref("/links", locale), label: t("navigation.links") },
        { href: getLocalizedHref("/portfolio", locale), label: t("navigation.portfolio") },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { href: getLocalizedHref("/tools", locale), label: t("navigation.tools") },
        { href: getLocalizedHref("/admin", locale), label: t("navigation.admin") },
        { href: getLocalizedHref("/firebase-setup", locale), label: t("footer.firebaseSetup") },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-background/80 backdrop-blur">
      <div className="container mx-auto px-6 py-12">
        {/* 主要内容区 */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* 博客信息 */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-xl font-bold text-accent">
              {process.env.NEXT_PUBLIC_SITE_NAME || "kukutx99"}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted">
              {process.env.NEXT_PUBLIC_SITE_DESCRIPTION || t("footer.siteDescription")}
            </p>
            {/* 运行时间 */}
            <div className="rounded-lg bg-white/5 p-3 text-xs text-muted">
              <div className="mb-1 flex items-center gap-1">
                <Heart size={12} className="text-red-500" fill="currentColor" />
                <span>{t("footer.running")}</span>
              </div>
              <div className="font-mono">
                <span className="text-accent">{runningTime.days}</span> {t("footer.days")}{" "}
                <span className="text-accent">{runningTime.hours}</span>:{" "}
                <span className="text-accent">
                  {runningTime.minutes.toString().padStart(2, "0")}
                </span>
                :
                <span className="text-accent">
                  {runningTime.seconds.toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* 链接列 */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-lg font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, index) => (
                  <li key={`${link.href}-${index}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部版权信息 */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center text-sm text-muted md:text-left">
              © {currentYear}{" "}
              <span className="font-semibold text-accent">
                {process.env.NEXT_PUBLIC_SITE_NAME || "kukutx99"}
              </span>
              . {t("footer.allRightsReserved")}.
            </div>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>
                {t("footer.builtWith")}{" "}
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent hover:underline"
                >
                  Next.js
                </a>
              </span>
              <span>•</span>
              <a
                href="https://github.com/Kukutx"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
