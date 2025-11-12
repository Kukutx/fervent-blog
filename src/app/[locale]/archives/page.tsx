"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Calendar } from "lucide-react";

import { getLocalizedHref } from "@/lib/i18n/routing";
import { Post, subscribeToPosts } from "@/lib/posts";

const ArchivesPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToPosts(locale, setPosts);
    return () => unsubscribe();
  }, [locale]);

  // 按年份分组
  const postsByYear = posts.reduce(
    (acc, post) => {
      const year = post.publishedAt.toDate().getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    },
    {} as Record<number, Post[]>,
  );

  const years = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">
          📚 {t("archives.title")}
        </h1>
        <p className="mt-4 text-lg text-muted">{t("archives.description")}</p>
        <div className="mt-6 text-sm text-muted">
          {t("archives.total")}: <span className="font-semibold text-accent">{posts.length}</span>{" "}
          {t("archives.articles")}
        </div>
      </div>

      {/* 时间线 */}
      <div className="relative">
        {/* 垂直线 */}
        <div className="absolute left-0 top-0 h-full w-0.5 bg-accent/20 md:left-1/2 md:-translate-x-1/2" />

        {years.map((year) => (
          <div key={year} className="mb-12">
            {/* 年份标题 */}
            <div className="relative mb-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-background shadow-lg">
                  <Calendar size={24} />
                </div>
                <h2 className="text-3xl font-bold text-foreground">{year}</h2>
              </div>
            </div>

            {/* 文章列表 */}
            <div className="space-y-6 pl-16 md:pl-0">
              {postsByYear[year].map((post, index) => (
                <div
                  key={post.id}
                  className="group relative rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur transition hover:border-accent hover:shadow-lg"
                >
                  {/* 时间线节点 */}
                  <div className="absolute -left-16 top-1/2 hidden h-4 w-4 -translate-y-1/2 rounded-full border-2 border-accent bg-background md:block md:left-1/2 md:-translate-x-1/2" />

                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <Link href={getLocalizedHref(`/posts/${post.slug}`, locale)}>
                        <h3 className="text-xl font-semibold text-foreground transition group-hover:text-accent">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="mt-2 text-sm text-muted line-clamp-2">{post.summary}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                        {post.category && (
                          <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">
                            📂 {post.category}
                          </span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-white/5 px-2 py-1 text-muted"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted md:flex-col md:items-end">
                      <span className="font-mono">
                        {post.publishedAt.toDate().toLocaleDateString(locale, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="py-20 text-center text-muted">
            <p className="text-lg">{t("archives.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivesPage;

