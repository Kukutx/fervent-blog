"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { getLocalizedHref } from "@/lib/i18n/routing";

export const Hero = () => {
  const t = useTranslations();
  const locale = useLocale();
  const bannerRef = useRef<HTMLElement>(null);
  const [typedText, setTypedText] = useState("");
  const fullText = t("hero.headline");

  // 打字机效果
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 70);

    return () => clearInterval(timer);
  }, [fullText]);

  // 视差滚动效果
  useEffect(() => {
    const handleScroll = () => {
      if (!bannerRef.current) return;
      const scrolled = window.scrollY;
      const rate = scrolled * 0.5;
      bannerRef.current.style.transform = `translate3d(0, ${rate}px, 0)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={bannerRef}
      className="parallax relative flex h-screen min-h-[600px] w-full items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url("/images/hero-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 装饰光晕 */}
      <div className="absolute right-20 top-20 hidden h-64 w-64 rounded-full bg-accent/20 blur-3xl md:block" />
      <div className="absolute bottom-40 left-20 hidden h-48 w-48 rounded-full bg-purple-500/10 blur-3xl md:block" />

      {/* 内容区域 */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
          {typedText}
          <span className="typing-cursor inline-block w-1 bg-accent">|</span>
        </h1>
        <p className="mt-8 max-w-2xl text-pretty text-xl text-white/80 md:text-2xl">
          {t("hero.subheadline")}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={getLocalizedHref("/", locale)}
            className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-gray-900 shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            {t("hero.cta")}
            <ArrowRight className="transition group-hover:translate-x-1" size={18} />
          </Link>
          <div className="rounded-full border-2 border-white/30 px-8 py-4 text-xs uppercase tracking-[0.4em] text-white backdrop-blur-sm">
            {t("hero.stack")}
          </div>
        </div>
      </div>

      {/* 向下滚动提示 */}
      <button
        type="button"
        onClick={scrollToContent}
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 transform animate-bounce text-white transition hover:text-accent"
        aria-label="Scroll down"
      >
        <ArrowDown size={32} />
      </button>
    </section>
  );
};
