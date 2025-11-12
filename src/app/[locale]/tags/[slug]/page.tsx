"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { use } from "react";

import { Post, subscribeToPostsByTag } from "@/lib/posts";
import { PostGrid } from "@/components/home/post-grid";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

const TagPage = ({ params }: TagPageProps) => {
  const resolvedParams = use(params);
  const tag = decodeURIComponent(resolvedParams.slug);
  const t = useTranslations();
  const locale = useLocale();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToPostsByTag(tag, locale, setPosts);
    return () => unsubscribe();
  }, [tag, locale]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-12 text-center">
        <div className="mb-4 text-5xl">🏷️</div>
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">#{tag}</h1>
        <p className="mt-4 text-lg text-muted">
          {posts.length} {t("tags.articles")}
        </p>
      </div>

      {/* 文章网格 */}
      <PostGrid posts={posts} />

      {posts.length === 0 && (
        <div className="py-20 text-center text-muted">
          <p className="text-lg">{t("tags.noArticles")}</p>
        </div>
      )}
    </div>
  );
};

export default TagPage;

