"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { useLocale } from "next-intl";

import { Post, subscribeToPost } from "@/lib/posts";

export const PostViewer = ({ slug }: { readonly slug: string }) => {
  const locale = useLocale();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPost(slug, (document) => {
      setPost(document && document.locale === locale ? document : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [slug, locale]);

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-background/60 p-10 text-center text-sm text-muted">
        Loading…
      </section>
    );
  }

  if (!post) {
    return (
      <section className="space-y-4 rounded-3xl border border-white/10 bg-background/60 p-10 text-center">
        <h1 className="text-2xl font-semibold uppercase tracking-[0.4em] text-muted">
          Article not found
        </h1>
        <p className="text-sm text-muted">
          This story is unavailable in the current language or has been unpublished.
        </p>
      </section>
    );
  }

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">
          {post.locale.toUpperCase()} · {post.publishedAt.toDate().toLocaleDateString()}
        </p>
        <h1 className="text-4xl font-bold text-white/90">{post.title}</h1>
        <p className="text-lg text-muted">{post.summary}</p>
      </header>
      {post.coverImage ? (
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-background/60">
          <div className="relative h-96 w-full">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
        </div>
      ) : null}
      <div className="prose prose-invert max-w-none">
        {post.content.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {post.tags?.length ? (
        <div className="flex flex-wrap gap-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
};
