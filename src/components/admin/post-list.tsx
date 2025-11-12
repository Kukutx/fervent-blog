"use client";

import { useLocale } from "next-intl";
import { useMemo } from "react";

import { Post } from "@/lib/posts";

type PostListProps = {
  readonly posts: Post[];
  readonly selectedPost: Post | null;
  readonly onSelect: (post: Post) => void;
};

export const PostList = ({ posts, selectedPost, onSelect }: PostListProps) => {
  const locale = useLocale();
  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (first, second) =>
          second.publishedAt.toMillis() - first.publishedAt.toMillis(),
      ),
    [posts],
  );

  return (
    <aside className="w-full max-w-md space-y-3">
      {sortedPosts.map((post) => {
        const isSelected = selectedPost?.id === post.id;

        return (
          <button
            key={post.id}
            type="button"
            onClick={() => onSelect(post)}
            className={`w-full rounded-3xl border px-6 py-4 text-left transition ${
              isSelected
                ? "border-accent bg-accent/10 text-white"
                : "border-white/10 bg-background/60 text-muted hover:border-accent/40 hover:bg-background/80"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-accent">
              {post.locale.toUpperCase()} ·
              {" "}
              {post.publishedAt
                .toDate()
                .toLocaleDateString(locale)}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white/90">{post.title}</h3>
            <p className="mt-2 text-sm text-muted">{post.summary}</p>
          </button>
        );
      })}
    </aside>
  );
};
