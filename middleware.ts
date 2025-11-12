import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./src/lib/i18n/config";

export default createMiddleware({
  defaultLocale,
  locales,
});

export const config = {
  matcher: ["/", "/(en|zh|es|fr)/:path*"],
};
