import Image from "next/image";
import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { getLocalizedHref } from "@/lib/i18n/routing";
import { Post } from "@/lib/posts";

export const PostCard = ({ post }: { readonly post: Post }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <article className="card-hover group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-background/70 backdrop-blur transition md:flex-row">
      {/* 左侧图片 - 占据 1/3 宽度 */}
      <Link href={getLocalizedHref(`/posts/${post.slug}`, locale)} className="relative w-full overflow-hidden md:w-1/3">
        <div className="relative h-64 w-full md:h-full md:min-h-[280px]">
          <Image
            src={post.coverImage || "/images/default-post.png"}
            alt={post.title}
            fill
            className="image-hover-scale object-cover"
          />
        </div>
      </Link>

      {/* 右侧内容 - 占据 2/3 宽度 */}
      <div className="flex flex-1 flex-col gap-4 p-6 md:w-2/3 md:p-8">
        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em]">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">
            {post.locale.toUpperCase()}
          </span>
          <span className="text-muted">•</span>
          <time dateTime={post.publishedAt.toDate().toISOString()} className="text-muted">
            <i className="mr-1">📅</i>
            {post.publishedAt.toDate().toLocaleDateString(locale, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </time>
        </div>

        {/* 标题 */}
        <Link href={getLocalizedHref(`/posts/${post.slug}`, locale)}>
          <h3 className="text-2xl font-bold text-white/90 transition group-hover:text-accent">
            {post.title}
          </h3>
        </Link>

        {/* 摘要 */}
        <p className="flex-1 text-base leading-relaxed text-muted line-clamp-3">
          {post.summary}
        </p>

        {/* 底部元数据 */}
        <div className="flex flex-wrap items-center gap-4 border-t border-white/5 pt-4">
          {/* 分类 */}
          {post.category && (
            <div className="flex items-center gap-2 text-sm">
              <i className="text-accent">📂</i>
              <span className="text-muted">{post.category}</span>
            </div>
          )}

          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <i className="text-accent">🏷️</i>
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-2 py-1 text-xs text-muted hover:bg-accent/10 hover:text-accent"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 阅读更多按钮 */}
          <Link
            href={getLocalizedHref(`/posts/${post.slug}`, locale)}
            className="ml-auto flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-accent transition group-hover:translate-x-1"
          >
            {t("posts.readMore")}
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};
