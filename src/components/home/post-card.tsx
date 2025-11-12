import Image from "next/image";
import Link from "next-intl/link";

import { Post } from "@/lib/posts";

export const PostCard = ({ post }: { readonly post: Post }) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-background/70 backdrop-blur transition hover:-translate-y-1 hover:border-accent hover:shadow-lg">
      {post.coverImage ? (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent">
          <span>{post.locale.toUpperCase()}</span>
          <span>•</span>
          <time dateTime={post.publishedAt.toDate().toISOString()}>
            {post.publishedAt.toDate().toLocaleDateString()}
          </time>
        </div>
        <h3 className="text-xl font-semibold text-white/90 transition group-hover:text-white">
          {post.title}
        </h3>
        <p className="flex-1 text-sm text-muted">{post.summary}</p>
        <Link
          href={`/posts/${post.slug}`}
          className="text-sm font-semibold uppercase tracking-[0.3em] text-accent transition group-hover:translate-x-1 group-hover:text-accent/80"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
};
