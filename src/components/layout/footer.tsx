import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations();

  return (
    <footer className="border-t border-white/5 bg-gradient-to-tr from-background via-background/90 to-background/50 py-10 text-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-muted md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl leading-relaxed text-balance">
          {t("site.subtitle")}
        </p>
        <p className="text-xs uppercase tracking-[0.4em] text-white/70">
          © {new Date().getFullYear()} Kuku Studio · Crafted with Firebase & Next.js
        </p>
      </div>
    </footer>
  );
};
