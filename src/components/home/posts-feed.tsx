"use client";

import { useEffect, useState } from "react";

import { useLocale } from "next-intl";

import { Post, subscribeToPosts } from "@/lib/posts";

import { PostGrid } from "./post-grid";

export const PostsFeed = () => {
  const locale = useLocale();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToPosts(locale, setPosts);
    return () => unsubscribe();
  }, [locale]);

  return <PostGrid posts={posts} />;
};
