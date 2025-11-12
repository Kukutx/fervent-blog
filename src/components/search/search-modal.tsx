"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { getLocalizedHref } from "@/lib/i18n/routing";
import { searchPosts, Post } from "@/lib/posts";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 搜索功能
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      try {
        const posts = await searchPosts(searchTerm, locale);
        setResults(posts);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, locale]);

  // ESC键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mt-20 w-full max-w-2xl rounded-2xl border border-white/10 bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 搜索框 */}
        <div className="flex items-center gap-3 border-b border-white/10 p-6">
          <Search className="text-muted" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("search.placeholder") || "搜索文章..."}
            className="flex-1 bg-transparent text-lg text-foreground outline-none placeholder:text-muted"
            autoFocus
          />
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted transition hover:bg-white/10 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {isSearching && (
            <div className="py-12 text-center text-muted">
              <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <p>{t("common.loading")}</p>
            </div>
          )}

          {!isSearching && searchTerm && results.length === 0 && (
            <div className="py-12 text-center text-muted">
              <p>{t("search.noResults") || "未找到相关文章"}</p>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-2">
              <p className="mb-4 text-sm text-muted">
                {t("search.found") || "找到"} {results.length} {t("search.results") || "个结果"}
              </p>
              {results.map((post) => (
                <Link
                  key={post.id}
                  href={getLocalizedHref(`/posts/${post.slug}`, locale)}
                  onClick={onClose}
                  className="group block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-accent hover:bg-white/10"
                >
                  <h3 className="font-semibold text-foreground transition group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted line-clamp-2">{post.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                    {post.category && (
                      <span className="rounded-full bg-accent/10 px-2 py-1 text-accent">
                        {post.category}
                      </span>
                    )}
                    <span>
                      {post.publishedAt.toDate().toLocaleDateString(locale)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!searchTerm && (
            <div className="py-12 text-center text-muted">
              <Search className="mx-auto mb-3" size={32} />
              <p>{t("search.hint") || "输入关键词搜索文章"}</p>
            </div>
          )}
        </div>

        {/* 快捷键提示 */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>{t("search.tips") || "提示：支持搜索标题、内容、标签"}</span>
            <div className="flex items-center gap-2">
              <kbd className="rounded bg-white/10 px-2 py-1 font-mono">ESC</kbd>
              <span>{t("search.close") || "关闭"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

