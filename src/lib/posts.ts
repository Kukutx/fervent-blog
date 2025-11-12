import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { firestore, isFirebaseReady } from "./firebase";

export type PostInput = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  locale: string;
};

export type Post = PostInput & {
  id: string;
  publishedAt: Timestamp;
};

const postsCollection = () => {
  if (!isFirebaseReady()) {
    throw new Error(
      "Firebase未配置。请访问 /firebase-setup 查看配置指南。",
    );
  }
  return collection(firestore(), "posts");
};

export const subscribeToPosts = (
  locale: string,
  callback: (posts: Post[]) => void,
) => {
  const postsQuery = query(
    postsCollection(),
    where("locale", "==", locale),
    orderBy("publishedAt", "desc"),
  );

  return onSnapshot(postsQuery, (snapshot) => {
    const posts = snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as PostInput & { publishedAt?: Timestamp }),
    }));

    callback(
      posts.map((post) => ({
        ...post,
        publishedAt: post.publishedAt ?? Timestamp.now(),
      })),
    );
  });
};

export const createPost = async (payload: PostInput) => {
  await addDoc(postsCollection(), {
    ...payload,
    publishedAt: Timestamp.now(),
  });
};

export const updatePost = async (id: string, payload: Partial<PostInput>) => {
  const document = doc(postsCollection(), id);
  await setDoc(
    document,
    {
      ...payload,
      updatedAt: Timestamp.now(),
    },
    { merge: true },
  );
};

export const deletePost = async (id: string) => {
  const document = doc(postsCollection(), id);
  await deleteDoc(document);
};

export const getPostBySlug = async (slug: string, locale?: string) => {
  const constraints = [where("slug", "==", slug)];

  if (locale) {
    constraints.push(where("locale", "==", locale));
  }

  const snapshot = await getDocs(
    query(postsCollection(), ...constraints, limit(1)),
  );

  if (snapshot.empty) {
    return null;
  }

  const document = snapshot.docs[0];
  const data = document.data() as PostInput & { publishedAt?: Timestamp };

  return {
    id: document.id,
    ...data,
    publishedAt: data.publishedAt ?? Timestamp.now(),
  } satisfies Post;
};

export const subscribeToPost = (
  locale: string,
  slug: string,
  callback: (post: Post | null) => void,
) =>
  onSnapshot(
    query(
      postsCollection(),
      where("locale", "==", locale),
      where("slug", "==", slug),
      limit(1),
    ),
    (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }

      const document = snapshot.docs[0];
      const data = document.data() as PostInput & { publishedAt?: Timestamp };

      callback({
        id: document.id,
        ...data,
        publishedAt: data.publishedAt ?? Timestamp.now(),
      });
    },
  );

// 获取所有分类
export const getCategories = async (locale?: string): Promise<string[]> => {
  const constraints = locale ? [where("locale", "==", locale)] : [];
  const snapshot = await getDocs(query(postsCollection(), ...constraints));

  const categoriesSet = new Set<string>();
  snapshot.docs.forEach((doc) => {
    const data = doc.data() as PostInput;
    if (data.category) {
      categoriesSet.add(data.category);
    }
  });

  return Array.from(categoriesSet).sort();
};

// 获取所有标签
export const getTags = async (locale?: string): Promise<string[]> => {
  const constraints = locale ? [where("locale", "==", locale)] : [];
  const snapshot = await getDocs(query(postsCollection(), ...constraints));

  const tagsSet = new Set<string>();
  snapshot.docs.forEach((doc) => {
    const data = doc.data() as PostInput;
    if (data.tags) {
      data.tags.forEach((tag) => tagsSet.add(tag));
    }
  });

  return Array.from(tagsSet).sort();
};

// 按分类订阅文章
export const subscribeToPostsByCategory = (
  category: string,
  locale: string,
  callback: (posts: Post[]) => void,
) => {
  const postsQuery = query(
    postsCollection(),
    where("category", "==", category),
    where("locale", "==", locale),
    orderBy("publishedAt", "desc"),
  );

  return onSnapshot(postsQuery, (snapshot) => {
    const posts = snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as PostInput & { publishedAt?: Timestamp }),
    }));

    callback(
      posts.map((post) => ({
        ...post,
        publishedAt: post.publishedAt ?? Timestamp.now(),
      })),
    );
  });
};

// 按标签订阅文章
export const subscribeToPostsByTag = (
  tag: string,
  locale: string,
  callback: (posts: Post[]) => void,
) => {
  const postsQuery = query(
    postsCollection(),
    where("tags", "array-contains", tag),
    where("locale", "==", locale),
    orderBy("publishedAt", "desc"),
  );

  return onSnapshot(postsQuery, (snapshot) => {
    const posts = snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as PostInput & { publishedAt?: Timestamp }),
    }));

    callback(
      posts.map((post) => ({
        ...post,
        publishedAt: post.publishedAt ?? Timestamp.now(),
      })),
    );
  });
};

// 搜索文章
export const searchPosts = async (
  searchTerm: string,
  locale: string,
): Promise<Post[]> => {
  const snapshot = await getDocs(
    query(postsCollection(), where("locale", "==", locale), orderBy("publishedAt", "desc")),
  );

  const posts = snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...(docSnapshot.data() as PostInput & { publishedAt?: Timestamp }),
    publishedAt: (docSnapshot.data() as PostInput & { publishedAt?: Timestamp }).publishedAt ?? Timestamp.now(),
  })) as Post[];

  // 客户端搜索（标题、摘要、内容）
  const searchTermLower = searchTerm.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTermLower) ||
      post.summary.toLowerCase().includes(searchTermLower) ||
      post.content.toLowerCase().includes(searchTermLower) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchTermLower)) ||
      post.category?.toLowerCase().includes(searchTermLower),
  );
};
