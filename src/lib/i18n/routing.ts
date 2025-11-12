import { defaultLocale } from "./config";

/**
 * 生成多语言路由URL
 * @param href - 路由路径（如 "/about"）
 * @param locale - 语言代码（如 "zh", "en"）
 * @returns 完整的多语言URL
 */
export const getLocalizedHref = (href: string, locale: string): string => {
  // 如果href已经是完整路径（包含语言前缀），直接返回
  if (href.startsWith(`/${locale}/`) || href.startsWith(`/${locale}`)) {
    return href;
  }

  // 移除开头的斜杠
  const cleanHref = href.startsWith("/") ? href.slice(1) : href;

  // 默认语言不显示前缀
  if (locale === defaultLocale) {
    return cleanHref ? `/${cleanHref}` : "/";
  }

  // 其他语言添加前缀
  return cleanHref ? `/${locale}/${cleanHref}` : `/${locale}`;
};

/**
 * 从路径中提取语言代码
 * @param pathname - 完整路径（如 "/zh/about"）
 * @returns 语言代码或null
 */
export const getLocaleFromPath = (pathname: string): string | null => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  
  const firstSegment = segments[0];
  const locales = ["en", "zh", "es", "fr"];
  
  return locales.includes(firstSegment) ? firstSegment : null;
};

