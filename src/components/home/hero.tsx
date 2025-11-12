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
      className="parallax relative flex h-screen min-h-[500px] w-full items-center justify-center overflow-hidden sm:min-h-[600px]"
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
      <div className="absolute right-10 top-10 hidden h-32 w-32 rounded-full bg-accent/20 blur-3xl sm:right-20 sm:top-20 sm:h-48 sm:w-48 md:h-64 md:w-64" />
      <div className="absolute bottom-20 left-10 hidden h-24 w-24 rounded-full bg-purple-500/10 blur-3xl sm:bottom-40 sm:left-20 sm:h-36 sm:w-36 md:h-48 md:w-48" />

      {/* 内容区域 */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          {typedText}
          <span className="typing-cursor inline-block w-1 bg-accent">|</span>
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base text-white/80 sm:mt-6 sm:text-lg md:mt-8 md:text-xl lg:text-2xl">
          {t("hero.subheadline")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <Link
            href={getLocalizedHref("/", locale)}
            className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-900 shadow-lg transition hover:scale-105 hover:shadow-xl sm:gap-3 sm:px-8 sm:py-4 sm:text-sm"
          >
            {t("hero.cta")}
            <ArrowRight className="transition group-hover:translate-x-1" size={16} />
          </Link>
          <div className="rounded-full border-2 border-white/30 px-6 py-3 text-xs uppercase tracking-[0.4em] text-white backdrop-blur-sm sm:px-8 sm:py-4">
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
