import Image from "next/image";
import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { getLocalizedHref } from "@/lib/i18n/routing";
import { Post } from "@/lib/posts";

export const PostCard = ({ post }: { readonly post: Post }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <article className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-background/70 backdrop-blur transition sm:rounded-3xl lg:flex-row">
      {/* 左侧图片 - 移动端全宽，桌面端占据 1/3 宽度 */}
      <Link
        href={getLocalizedHref(`/posts/${post.slug}`, locale)}
        className="relative w-full overflow-hidden lg:w-1/3"
      >
        <div className="relative h-48 w-full sm:h-56 lg:h-full lg:min-h-[280px]">
          <Image
            src={post.coverImage || "/images/default-post.png"}
            alt={post.title}
            fill
            className="image-hover-scale object-cover"
          />
        </div>
      </Link>

      {/* 右侧内容 - 移动端全宽，桌面端占据 2/3 宽度 */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-6 lg:w-2/3 lg:p-8">
        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] sm:gap-3 sm:tracking-[0.3em]">
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent sm:px-3 sm:py-1">
            {post.locale.toUpperCase()}
          </span>
          <span className="text-muted">•</span>
          <time dateTime={post.publishedAt.toDate().toISOString()} className="text-muted">
            <span className="mr-1">📅</span>
            {post.publishedAt.toDate().toLocaleDateString(locale, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </time>
        </div>

        {/* 标题 */}
        <Link href={getLocalizedHref(`/posts/${post.slug}`, locale)}>
          <h3 className="text-lg font-bold text-white/90 transition group-hover:text-accent sm:text-xl lg:text-2xl">
            {post.title}
          </h3>
        </Link>

        {/* 摘要 */}
        <p className="flex-1 text-sm leading-relaxed text-muted line-clamp-2 sm:text-base sm:line-clamp-3">
          {post.summary}
        </p>

        {/* 底部元数据 */}
        <div className="flex flex-col gap-3 border-t border-white/5 pt-3 sm:flex-row sm:items-center sm:gap-4 sm:pt-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* 分类 */}
            {post.category && (
              <div className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                <span className="text-accent">📂</span>
                <span className="text-muted">{post.category}</span>
              </div>
            )}

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-accent">🏷️</span>
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-1.5 py-0.5 text-xs text-muted hover:bg-accent/10 hover:text-accent sm:px-2 sm:py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 阅读更多按钮 */}
          <Link
            href={getLocalizedHref(`/posts/${post.slug}`, locale)}
            className="flex items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-[0.2em] text-accent transition group-hover:translate-x-1 sm:ml-auto sm:gap-2 sm:text-sm sm:tracking-[0.3em]"
          >
            {t("posts.readMore")}
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};
