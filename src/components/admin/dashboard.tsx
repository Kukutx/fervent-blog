"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { useAuth } from "@/components/providers/auth-provider";
import { locales } from "@/lib/i18n/config";
import { Post, PostInput, createPost, deletePost, subscribeToPosts, updatePost } from "@/lib/posts";

import { PostForm } from "./post-form";
import { PostList } from "./post-list";

const ownerEmails = (process.env.NEXT_PUBLIC_OWNER_EMAILS ?? "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

export const AdminDashboard = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { user, initializing, loginWithGithub } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const localeLabel = useMemo(
    () => locales.map((item) => item.toUpperCase()).join(" · "),
    [],
  );

  const isAllowed = useMemo(() => {
    if (!ownerEmails.length) {
      return Boolean(user);
    }

    return ownerEmails.includes(user?.email ?? "");
  }, [user]);

  useEffect(() => {
    if (!user || !isAllowed) {
      setPosts([]);
      return () => undefined;
    }

    const unsubscribe = subscribeToPosts(locale, setPosts);
    return () => unsubscribe();
  }, [locale, user, isAllowed]);

  const handleCreate = async (values: PostInput) => {
    await createPost(values);
  };

  const handleUpdate = async (id: string, values: PostInput) => {
    await updatePost(id, values);
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
  };

  if (initializing) {
    return (
      <section className="rounded-3xl border border-white/10 bg-background/60 p-10 text-center text-sm text-muted">
        {t("common.loading")}
      </section>
    );
  }

  if (!user) {
    return (
      <section className="space-y-6 rounded-3xl border border-white/10 bg-background/60 p-10 text-center">
        <h2 className="text-lg font-semibold uppercase tracking-[0.4em] text-muted">
          {t("admin.title")}
        </h2>
        <p className="text-sm text-muted">{t("admin.allowedOnly")}</p>
        <button
          type="button"
          onClick={loginWithGithub}
          className="rounded-full border border-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-accent transition hover:bg-accent hover:text-background"
        >
          {t("auth.login")}
        </button>
      </section>
    );
  }

  if (!isAllowed) {
    return (
      <section className="space-y-6 rounded-3xl border border-white/10 bg-background/60 p-10 text-center">
        <h2 className="text-lg font-semibold uppercase tracking-[0.4em] text-muted">
          {t("admin.title")}
        </h2>
        <p className="text-sm text-muted">{t("admin.allowedOnly")}</p>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold uppercase tracking-[0.4em] text-muted">
          {t("admin.title")}
        </h1>
        <p className="text-sm text-muted">{t("admin.subtitle")}</p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <PostList
          posts={posts}
          selectedPost={selectedPost}
          onSelect={setSelectedPost}
        />
        <PostForm
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          selectedPost={selectedPost}
          onReset={() => setSelectedPost(null)}
        />
      </div>
      <div className="rounded-3xl border border-white/10 bg-background/60 p-6 text-xs text-muted">
        <p>{t("admin.activeLocales", { locales: localeLabel })}</p>
      </div>
    </section>
  );
};
