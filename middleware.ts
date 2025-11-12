import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./src/lib/i18n/config";

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix: "as-needed", // 默认语言不显示前缀
});

export const config = {
  // 匹配所有路径，除了静态文件和API路由
  matcher: [
    // 匹配所有路径
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // 可选：匹配根路径
    "/",
  ],
};
