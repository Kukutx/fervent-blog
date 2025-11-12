"use client";

import { Menu, MoonStar, Sun, UserRound } from "lucide-react";
import Link from "next-intl/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { defaultLocale } from "@/lib/i18n/config";

const useIsActive = () => {
  const pathname = usePathname();
  const locale = useLocale();

  return (href: string) => {
    const normalizedHref = `/${locale}${href === "/" ? "" : href}`;
    return pathname === normalizedHref;
  };
};

export const Header = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isActive = useIsActive();
  const { user, loginWithGithub, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  const handleToggleTheme = () => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    root.classList.toggle("dark", nextIsDark);
  };

  const navigation = useMemo(
    () => [
      { href: "/", label: t("navigation.blog") },
      { href: "/portfolio", label: t("navigation.portfolio") },
      { href: "/resume", label: t("navigation.resume") },
      { href: "/tools", label: t("navigation.tools") },
      { href: "/admin", label: t("navigation.admin") },
    ],
    [t],
  );

  const renderLinks = (mobile = false) => (
    <nav
      className={`flex ${mobile ? "flex-col gap-4" : "items-center gap-6"}`}
    >
      {navigation.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          locale={locale === defaultLocale ? undefined : locale}
          className={`text-sm tracking-wide transition-colors hover:text-accent ${isActive(href) ? "text-accent" : "text-muted"}`}
          onClick={() => setMenuOpen(false)}
        >
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          locale={locale === defaultLocale ? undefined : locale}
          className="flex items-center gap-2 text-lg font-semibold uppercase tracking-[0.4em] text-accent"
        >
          <span>K</span>
          <span>Studio</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {renderLinks()}
          <LocaleSwitcher />
          <button
            type="button"
            aria-label="toggle theme"
            className="rounded-full border border-white/20 p-2 text-sm text-muted transition hover:border-accent hover:text-accent"
            onClick={handleToggleTheme}
          >
            {mounted && isDark ? <Sun size={16} /> : <MoonStar size={16} />}
          </button>
          <button
            type="button"
            onClick={user ? logout : loginWithGithub}
            className="flex items-center gap-2 rounded-full border border-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition hover:bg-accent hover:text-background"
          >
            <UserRound size={16} />
            {user ? t("auth.logout") : t("auth.login")}
          </button>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase text-muted transition hover:border-accent hover:text-accent md:hidden"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <Menu size={18} />
          Menu
        </button>
      </div>
      {menuOpen ? (
        <div className="border-t border-white/10 bg-background/95 px-6 py-6 md:hidden">
          {renderLinks(true)}
          <div className="mt-6 flex items-center justify-between">
            <LocaleSwitcher />
            <button
              type="button"
              onClick={user ? logout : loginWithGithub}
              className="flex items-center gap-2 rounded-full border border-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition hover:bg-accent hover:text-background"
            >
              <UserRound size={16} />
              {user ? t("auth.logout") : t("auth.login")}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
};
