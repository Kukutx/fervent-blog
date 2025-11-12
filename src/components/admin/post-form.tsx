"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";

import { locales } from "@/lib/i18n/config";
import { Post, PostInput } from "@/lib/posts";

type PostFormProps = {
  readonly onCreate: (values: PostInput) => Promise<void>;
  readonly onUpdate: (id: string, values: PostInput) => Promise<void>;
  readonly onDelete: (id: string) => Promise<void>;
  readonly selectedPost: Post | null;
  readonly onReset: () => void;
};

type FormState = PostInput;

const defaultState = (locale: string): FormState => ({
  title: "",
  slug: "",
  summary: "",
  content: "",
  coverImage: "",
  tags: [],
  locale,
});

export const PostForm = ({
  onCreate,
  onUpdate,
  onDelete,
  selectedPost,
  onReset,
}: PostFormProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const [state, setState] = useState<FormState>(() => defaultState(locale));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPost) {
      setState({
        title: selectedPost.title,
        slug: selectedPost.slug,
        summary: selectedPost.summary,
        content: selectedPost.content,
        coverImage: selectedPost.coverImage,
        tags: selectedPost.tags ?? [],
        locale: selectedPost.locale,
      });
    } else {
      setState(defaultState(locale));
    }
  }, [selectedPost, locale]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: PostInput = {
        ...state,
        tags: state.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
      };

      if (selectedPost) {
        await onUpdate(selectedPost.id, payload);
      } else {
        await onCreate(payload);
      }

      setState(defaultState(locale));
      onReset();
    } catch (cause) {
      console.error(cause);
      setError((cause as Error).message ?? t("admin.error.unknown"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    setLoading(true);

    try {
      await onDelete(selectedPost.id);
      setState(defaultState(locale));
      onReset();
    } catch (cause) {
      console.error(cause);
      setError((cause as Error).message ?? t("admin.error.unknown"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col gap-4 rounded-3xl border border-white/10 bg-background/80 p-8 backdrop-blur"
    >
      <h2 className="text-lg font-semibold uppercase tracking-[0.4em] text-muted">
        {selectedPost ? t("admin.update") : t("admin.create")}
      </h2>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-semibold text-muted">{t("admin.form.title")}</span>
        <input
          className="rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
          value={state.title}
          onChange={(event) => setState((prev) => ({ ...prev, title: event.target.value }))}
          required
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-semibold text-muted">{t("admin.form.slug")}</span>
        <input
          className="rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
          value={state.slug}
          onChange={(event) => setState((prev) => ({ ...prev, slug: event.target.value }))}
          required
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-semibold text-muted">{t("admin.form.summary")}</span>
        <textarea
          className="min-h-[100px] rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
          value={state.summary}
          onChange={(event) => setState((prev) => ({ ...prev, summary: event.target.value }))}
          required
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-semibold text-muted">{t("admin.form.content")}</span>
        <textarea
          className="min-h-[160px] rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
          value={state.content}
          onChange={(event) => setState((prev) => ({ ...prev, content: event.target.value }))}
          required
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-semibold text-muted">{t("admin.form.coverImage")}</span>
        <input
          className="rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
          value={state.coverImage}
          onChange={(event) => setState((prev) => ({ ...prev, coverImage: event.target.value }))}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-semibold text-muted">{t("admin.form.tags")}</span>
        <input
          className="rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
          value={state.tags?.join(", ") ?? ""}
          onChange={(event) =>
            setState((prev) => ({
              ...prev,
              tags: event.target.value.split(",").map((tag) => tag.trim()),
            }))
          }
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-semibold text-muted">{t("admin.form.locale")}</span>
        <select
          className="rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
          value={state.locale}
          onChange={(event) => setState((prev) => ({ ...prev, locale: event.target.value }))}
        >
          {locales.map((item) => (
            <option key={item} value={item} className="bg-background text-white">
              {item.toUpperCase()}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-background transition disabled:opacity-60"
        >
          {t("admin.save")}
        </button>
        <button
          type="button"
          onClick={() => {
            setState(defaultState(locale));
            onReset();
          }}
          className="rounded-full border border-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-muted transition hover:border-accent hover:text-accent"
        >
          {t("admin.reset")}
        </button>
        {selectedPost ? (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-red-400 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-red-400 transition hover:bg-red-400 hover:text-background"
            disabled={loading}
          >
            {t("admin.delete")}
          </button>
        ) : null}
      </div>
    </form>
  );
};
