import { Metadata } from "next";

import { PostViewer } from "@/components/posts/post-viewer";

export const metadata: Metadata = {
  title: "Post",
};

type PostPageProps = {
  readonly params: { slug: string };
};

const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = params;

  return <PostViewer slug={slug} />;
};

export default PostPage;
