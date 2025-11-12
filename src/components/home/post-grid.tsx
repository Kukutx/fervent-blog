import { useTranslations } from "next-intl";

import { Post } from "@/lib/posts";

import { PostCard } from "./post-card";

type PostGridProps = {
  readonly posts: Post[];
};

export const PostGrid = ({ posts }: PostGridProps) => {
  const t = useTranslations();

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold uppercase tracking-[0.4em] text-muted">
          {t("posts.recent")}
        </h2>
      </div>
      {posts.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-6 max-w-2xl text-sm text-muted">{t("posts.empty")}</p>
      )}
    </section>
  );
};
