"use client";

import { useEffect, useState } from "react";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { isFirebaseReady } from "@/lib/firebase";
import { getLocalizedHref } from "@/lib/i18n/routing";
import { Post, subscribeToPosts } from "@/lib/posts";

import { PostGrid } from "./post-grid";

export const PostsFeed = () => {
  const locale = useLocale();
  const t = useTranslations();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseReady()) {
      setError("firebase_not_configured");
      return;
    }

    try {
      const unsubscribe = subscribeToPosts(locale, setPosts);
      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown_error");
    }
  }, [locale]);

  if (error === "firebase_not_configured") {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-12 text-center">
        <div className="mb-4 text-5xl">⚙️</div>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Firebase 未配置
        </h2>
        <p className="mb-6 text-muted">
          请先配置 Firebase 以启用文章功能。按照配置指南完成设置后，文章将自动显示。
        </p>
        <Link
          href={getLocalizedHref("/firebase-setup", locale)}
          className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 px-6 py-3 font-semibold text-yellow-500 transition hover:bg-yellow-500/30"
        >
          <span>查看配置指南</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl border border-red-500/20 bg-red-500/5 p-12 text-center">
        <div className="mb-4 text-5xl">⚠️</div>
        <h2 className="mb-4 text-2xl font-bold text-foreground">加载文章时出错</h2>
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  return <PostGrid posts={posts} />;
};
