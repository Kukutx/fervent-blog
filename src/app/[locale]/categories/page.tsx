"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Folder } from "lucide-react";

import { getLocalizedHref } from "@/lib/i18n/routing";
import { getCategories, subscribeToPosts, Post } from "@/lib/posts";

const CategoriesPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getCategories(locale).then(setCategories).catch(console.error);
    const unsubscribe = subscribeToPosts(locale, setPosts);
    return () => unsubscribe();
  }, [locale]);

  // 统计每个分类的文章数量
  const categoryCount = posts.reduce(
    (acc, post) => {
      if (post.category) {
        acc[post.category] = (acc[post.category] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">
          📂 {t("categories.title")}
        </h1>
        <p className="mt-4 text-lg text-muted">{t("categories.description")}</p>
        <div className="mt-6 text-sm text-muted">
          {t("categories.total")}:{" "}
          <span className="font-semibold text-accent">{categories.length}</span>{" "}
          {t("categories.items")}
        </div>
      </div>

      {/* 分类网格 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category}
            href={getLocalizedHref(`/categories/${encodeURIComponent(category)}`, locale)}
            className="card-hover group rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur transition hover:border-accent"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-start gap-3">
                <div className="rounded-xl bg-accent/10 p-3">
                  <Folder className="text-accent" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground transition group-hover:text-accent">
                    {category}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {categoryCount[category] || 0} {t("categories.articles")}
                  </p>
                </div>
              </div>
              <div className="text-2xl text-accent opacity-0 transition group-hover:opacity-100">
                →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="py-20 text-center text-muted">
          <p className="text-lg">{t("categories.empty")}</p>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

