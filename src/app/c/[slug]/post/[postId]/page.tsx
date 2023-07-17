
import CommentSection from "@/components/CommentSection";
import CommentsSection from "@/components/CommentSection";
import EditorOutput from "@/components/EditorOutput";
import ToFeedButton from "@/components/ToFeedButton";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import RecommendedPosts from "@/components/RecommendedPosts";
import { buttonVariants } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import ShareButton from "@/components/ShareButton";
import { useRouter } from "next/router";
import DeleteButton from "@/components/DeleteButton";

interface CommunityPostPageProps {
  params: {
    postId: string;
  };
}

// export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const CommunityPostPage = async ({ params }: CommunityPostPageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
        community: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <ToFeedButton />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="md:col-span-2 space-y-6 w-full">
          <div className="flex flex-row">
            <Suspense fallback={<PostVoteShell />}>
              {/* @ts-expect-error server component */}
              <PostVoteServer
                postId={post?.id ?? cachedPost.id}
                getData={async () => {
                  return await db.post.findUnique({
                    where: {
                      id: params.postId,
                    },
                    include: {
                      votes: true,
                      community: true,
                    },
                  });
                }}
              />
            </Suspense>

            <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
              <div>
                <div className="max-h-40 mt-1 truncate text-xs text-gray-500 flex justify-between">
                  <span>
                    Posted by u/
                    {post?.author.username ?? cachedPost.authorUsername}{" "}
                    {formatTimeToNow(
                      new Date(post?.createdAt ?? cachedPost.createdAt)
                    )}
                  </span>
                  <div className="items-center flex">
                    {/* @ts-ignore IDK WHY THIS IS ERRORING  */}
                    <ShareButton
                      // @ts-ignore
                      community_name={post?.community.name ?? ""}
                      post_id={post?.id || ""}
                    />
                    {/*  // @ts-ignore */}
                    <DeleteButton
                      postId={post?.id || ""}
                      // @ts-ignore
                      postAuthor={post?.author.id}
                    />
                  </div>
                </div>
                <h1 className="text-lg font-semibold leading-6 py-2 text-gray-900 flex flex-grow gap-x-2">
                  <div
                    className={`shadow border border-gray-300 h-[30px] text-xs font-normal flex flex-shrink-0 justify-center items-center gap-2 rounded-xl px-2 text-white ${
                      post?.sitename === "Twitch"
                        ? "bg-purple-500"
                        : post?.sitename === "YouTube"
                        ? "bg-red-500"
                        : post?.sitename === "Kick"
                        ? "bg-green-400"
                        : ""
                    }`}
                  >
                    {post?.sitename === "Twitch" ? (
                      <Image
                        src="/twitch.png"
                        alt="twitch"
                        width={20}
                        height={20}
                      />
                    ) : post?.sitename === "YouTube" ? (
                      <Image
                        src="/youtube.png"
                        alt="youtube"
                        width={20}
                        height={20}
                      />
                    ) : post?.sitename === "Kick" ? (
                      <Image
                        src="/kick.png"
                        alt="kick"
                        width={15}
                        height={15}
                      />
                    ) : null}
                    {post?.channel}
                  </div>
                  <div className="">
                    {post?.title}
                  </div>
                </h1>
                {(post?.tag?.toUpperCase() ?? cachedPost.tag.toUpperCase()) && (
                  <div className="">
                    <Badge variant="default" className="mb-2">
                      {post?.tag?.toUpperCase() ?? cachedPost.tag.toUpperCase()}
                    </Badge>
                  </div>
                )}
                <EditorOutput
                  content={post?.embedurl ?? cachedPost.embedurl}
                  sitename={post?.sitename ?? cachedPost.sitename}
                />

                <Suspense
                  fallback={
                    <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                  }
                >
                  {/* @ts-expect-error Server Component */}
                  <CommentSection postId={post?.id ?? cachedPost.id} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
        <div className="order-first md:order-last">
          {/* @ts-ignore*/}
          <RecommendedPosts />
        </div>
      </div>
    </div>
  );
};

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      {/* upvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      {/* score */}
      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
}

export default CommunityPostPage;
