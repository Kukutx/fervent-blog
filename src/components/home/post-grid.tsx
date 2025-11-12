import { useTranslations } from "next-intl";

import { Post } from "@/lib/posts";

import { PostCard } from "./post-card";

type PostGridProps = {
  readonly posts: Post[];
};

export const PostGrid = ({ posts }: PostGridProps) => {
  const t = useTranslations();

  return (
    <section className="mt-8 sm:mt-12 md:mt-16">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold uppercase tracking-[0.3em] text-muted sm:text-lg sm:tracking-[0.4em]">
          {t("posts.recent")}
        </h2>
      </div>
      {posts.length ? (
        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-4 max-w-2xl text-xs text-muted sm:mt-6 sm:text-sm">{t("posts.empty")}</p>
      )}
    </section>
  );
};
