"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { getLocalizedHref } from "@/lib/i18n/routing";
import { getTags, subscribeToPosts, Post } from "@/lib/posts";

const TagsPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [tags, setTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getTags(locale).then(setTags).catch(console.error);
    const unsubscribe = subscribeToPosts(locale, setPosts);
    return () => unsubscribe();
  }, [locale]);

  // 统计每个标签的文章数量
  const tagCount = posts.reduce(
    (acc, post) => {
      if (post.tags) {
        post.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // 根据文章数量排序标签
  const sortedTags = [...tags].sort((a, b) => (tagCount[b] || 0) - (tagCount[a] || 0));

  // 计算标签大小（基于文章数量）
  const getTagSize = (count: number) => {
    if (count >= 10) return "text-3xl";
    if (count >= 5) return "text-2xl";
    if (count >= 3) return "text-xl";
    return "text-lg";
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">
          🏷️ {t("tags.title")}
        </h1>
        <p className="mt-4 text-lg text-muted">{t("tags.description")}</p>
        <div className="mt-6 text-sm text-muted">
          {t("tags.total")}: <span className="font-semibold text-accent">{tags.length}</span>{" "}
          {t("tags.items")}
        </div>
      </div>

      {/* 标签云 */}
      <div className="rounded-3xl border border-white/10 bg-background/70 p-8 backdrop-blur md:p-12">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {sortedTags.map((tag) => {
            const count = tagCount[tag] || 0;
            return (
              <Link
                key={tag}
                href={getLocalizedHref(`/tags/${encodeURIComponent(tag)}`, locale)}
                className={`group inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 font-medium text-muted transition hover:scale-110 hover:bg-accent/10 hover:text-accent ${getTagSize(count)}`}
                style={{
                  opacity: 0.6 + (count / Math.max(...Object.values(tagCount), 1)) * 0.4,
                }}
              >
                <span className="text-accent">#</span>
                {tag}
                <span className="text-xs text-muted/70">({count})</span>
              </Link>
            );
          })}
        </div>
      </div>

      {tags.length === 0 && (
        <div className="py-20 text-center text-muted">
          <p className="text-lg">{t("tags.empty")}</p>
        </div>
      )}

      {/* 标签列表视图（移动端友好） */}
      <div className="mt-12 block md:hidden">
        <h2 className="mb-6 text-2xl font-semibold text-foreground">{t("tags.list")}</h2>
        <div className="space-y-3">
          {sortedTags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-background/70 p-4 backdrop-blur transition hover:border-accent"
            >
              <span className="font-medium text-foreground">#{tag}</span>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
                {tagCount[tag] || 0}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsPage;

