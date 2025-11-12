"use client";

import { ChevronDown, Menu, MoonStar, Search, Sun, UserRound } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { SearchModal } from "@/components/search/search-modal";
import { getLocalizedHref } from "@/lib/i18n/routing";
import { getCategories } from "@/lib/posts";

const useIsActive = () => {
  const pathname = usePathname();
  const locale = useLocale();

  return (href: string) => {
    const normalizedHref = `/${locale}${href === "/" ? "" : href}`;
    return pathname === normalizedHref || pathname.startsWith(normalizedHref + "/");
  };
};

export const Header = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isActive = useIsActive();
  const { user, loginWithGithub, logout, isConfigured } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    // 加载分类列表
    getCategories(locale).then(setCategories).catch(console.error);
  }, [locale]);

  const handleToggleTheme = () => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    root.classList.toggle("dark", nextIsDark);
  };

  const navigation = useMemo(
    () => [
      { href: "/", label: t("navigation.home"), icon: "🏠" },
      { href: "/archives", label: t("navigation.archives"), icon: "📚" },
      { href: "/tags", label: t("navigation.tags"), icon: "🏷️" },
      { href: "/about", label: t("navigation.about"), icon: "👤" },
      { href: "/links", label: t("navigation.links"), icon: "🔗" },
      { href: "/portfolio", label: t("navigation.portfolio"), icon: "💼" },
      { href: "/tools", label: t("navigation.tools"), icon: "🛠️" },
    ],
    [t],
  );

  const renderLinks = (mobile = false) => (
    <nav className={`flex ${mobile ? "flex-col gap-4" : "items-center gap-6"}`}>
      {navigation.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={getLocalizedHref(href, locale)}
          className={`flex items-center gap-2 text-sm tracking-wide transition-colors hover:text-accent ${isActive(href) ? "font-semibold text-accent" : "text-muted"}`}
          onClick={() => setMenuOpen(false)}
        >
          <span>{icon}</span>
          {label}
        </Link>
      ))}

      {/* 分类下拉菜单 */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className={`flex items-center gap-2 text-sm tracking-wide transition-colors hover:text-accent ${isActive("/categories") ? "font-semibold text-accent" : "text-muted"}`}
        >
          <span>📂</span>
          {t("navigation.categories")}
          <ChevronDown
            size={14}
            className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
          />
        </button>

        {categoriesOpen && categories.length > 0 && (
          <div
            className="absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-white/10 bg-background/95 p-2 shadow-lg backdrop-blur"
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <Link
              href={getLocalizedHref("/categories", locale)}
              className="block rounded-lg px-4 py-2 text-sm text-muted transition hover:bg-accent/10 hover:text-accent"
              onClick={() => {
                setCategoriesOpen(false);
                setMenuOpen(false);
              }}
            >
              {t("navigation.allCategories")}
            </Link>
            <div className="my-1 border-t border-white/10" />
            {categories.map((category) => (
              <Link
                key={category}
                href={getLocalizedHref(`/categories/${encodeURIComponent(category)}`, locale)}
                className="block rounded-lg px-4 py-2 text-sm text-muted transition hover:bg-accent/10 hover:text-accent"
                onClick={() => {
                  setCategoriesOpen(false);
                  setMenuOpen(false);
                }}
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href={getLocalizedHref("/", locale)}
          className="flex items-center gap-1 text-base font-bold uppercase tracking-[0.4em] text-accent sm:gap-2 sm:text-lg"
        >
          <span className="text-xl sm:text-2xl">K</span>
          <span className="hidden sm:inline">{process.env.NEXT_PUBLIC_SITE_NAME || "Blog"}</span>
        </Link>

        {/* 桌面端导航 */}
        <div className="hidden items-center gap-3 xl:flex xl:gap-4">
          {renderLinks()}
        </div>

        {/* 右侧工具栏 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 搜索按钮 */}
          <button
            type="button"
            aria-label={t("common.search")}
            className="rounded-full border border-white/20 p-1.5 text-sm text-muted transition hover:border-accent hover:text-accent sm:p-2"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={16} />
          </button>

          {/* 语言切换 */}
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>

          {/* 主题切换 */}
          <button
            type="button"
            aria-label={t("common.toggleTheme")}
            className="hidden rounded-full border border-white/20 p-1.5 text-sm text-muted transition hover:border-accent hover:text-accent sm:block sm:p-2"
            onClick={handleToggleTheme}
          >
            {mounted && isDark ? <Sun size={16} /> : <MoonStar size={16} />}
          </button>

          {/* 用户登录 - 桌面端 */}
          {isConfigured ? (
            <button
              type="button"
              onClick={user ? logout : loginWithGithub}
              className="hidden items-center gap-2 rounded-full border border-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition hover:bg-accent hover:text-background sm:flex sm:px-4 sm:py-2"
            >
              <UserRound size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden md:inline">{user ? t("auth.logout") : t("auth.login")}</span>
            </button>
          ) : (
            <Link
              href={getLocalizedHref("/firebase-setup", locale)}
              className="hidden items-center gap-1 rounded-full border border-yellow-500/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500 transition hover:bg-yellow-500/10 sm:flex sm:gap-2 sm:px-4 sm:py-2"
            >
              <span>⚙️</span>
              <span className="hidden md:inline">{t("footer.firebaseSetup")}</span>
            </Link>
          )}

          {/* 移动端菜单按钮 */}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase text-muted transition hover:border-accent hover:text-accent xl:hidden"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <Menu size={16} />
            <span className="hidden sm:inline">{t("common.menu")}</span>
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-background/95 px-4 py-4 backdrop-blur sm:px-6 sm:py-6 xl:hidden">
          {renderLinks(true)}
          <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:gap-4">
            <div className="flex items-center justify-between">
              <LocaleSwitcher />
              <button
                type="button"
                aria-label={t("common.toggleTheme")}
                className="rounded-full border border-white/20 p-2 text-sm text-muted transition hover:border-accent hover:text-accent"
                onClick={handleToggleTheme}
              >
                {mounted && isDark ? <Sun size={16} /> : <MoonStar size={16} />}
              </button>
            </div>
            {isConfigured ? (
              <button
                type="button"
                onClick={user ? logout : loginWithGithub}
                className="flex items-center justify-center gap-2 rounded-full border border-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition hover:bg-accent hover:text-background"
              >
                <UserRound size={16} />
                {user ? t("auth.logout") : t("auth.login")}
              </button>
            ) : (
              <Link
                href={getLocalizedHref("/firebase-setup", locale)}
                className="flex items-center justify-center gap-2 rounded-full border border-yellow-500/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500 transition hover:bg-yellow-500/10"
              >
                <span>⚙️</span>
                {t("footer.firebaseSetup")}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 搜索模态框 */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};
