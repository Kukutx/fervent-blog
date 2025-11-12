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

import { firestore } from "./firebase";

export type PostInput = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  locale: string;
};

export type Post = PostInput & {
  id: string;
  publishedAt: Timestamp;
};

const postsCollection = () => collection(firestore(), "posts");

export const subscribeToPosts = (
  locale: string,
  callback: (posts: Post[]) => void,
) => {
  const postsQuery = query(
    postsCollection(),
    orderBy("publishedAt", "desc"),
  );

  return onSnapshot(postsQuery, (snapshot) => {
    const posts = snapshot.docs
      .map((docSnapshot) => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as PostInput & { publishedAt?: Timestamp }),
      }))
      .filter((post) => post.locale === locale)
      .map((post) => ({
        ...post,
        publishedAt: post.publishedAt ?? Timestamp.now(),
      }));

    callback(posts);
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

export const getPostBySlug = async (slug: string) => {
  const snapshot = await getDocs(
    query(postsCollection(), where("slug", "==", slug), limit(1)),
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
  slug: string,
  callback: (post: Post | null) => void,
) =>
  onSnapshot(
    query(postsCollection(), where("slug", "==", slug), limit(1)),
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
