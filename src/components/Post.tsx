import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { Link as LinkIcon, Link2, MessageSquare, Trash, ExternalLink } from "lucide-react";
import React, { FC, useRef, useState } from "react";
import Link from "next/link";
import PostVoteClient from "./post-vote/PostVoteClient";
import { Badge } from "./ui/Badge";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
type PartialVote = Pick<Vote, "type">;

interface PostProps {
  communityName: string;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
  url: string;
}

const IFRAME_PARENT = "&parent=localhost&parent=www.clippe.rs";
// const IFRAME_PARENT = "&parent=www.clippe.rs";

const Post: FC<PostProps> = ({
  communityName,
  post,
  commentAmt,
  votesAmt: votesAmt,
  currentVote,
  url,
}) => {
  const pRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState("");
  const { data: session } = useSession();
  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess("Copied!");
      // Revert back to initial state after 3 seconds
      setTimeout(() => {
        setCopySuccess("");
      }, 3000);
    } catch (err) {
      
    }
  };
  const queryClient = useQueryClient();
  const { mutate: deletePost } = useMutation({
    mutationFn: async () => {
      

      const res = await axios.delete(`/api/posts/delete/${post.id}`);
    },
    onError: (err) => {
      toast({
        title: "There was an error.",
        description: "Could not delete post.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: "POST DELETED",
        description: "This post was deleted.",
        variant: "default",
      });
    },
  });

  return (
    <div className="rounded-2xl bg-white shadow-md">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          initialVotesAmt={votesAmt}
          postId={post.id}
          initialVote={currentVote?.type}
        />
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500 flex justify-between items-center">
            <div>
              {communityName ? (
                <>
                  <a
                    className="underline text-zinc-900 text-sm underline-offset-2"
                    href={`/c/${communityName}`}
                  >
                    c/{communityName}
                  </a>
                  <span className="px-1">•</span>
                </>
              ) : null}
              <span>
                Posted by{" "}
                <Link legacyBehavior href={`/u/${post.author.username}`}>
                  <a className=" hover:underline">u/{post.author.username}</a>
                </Link>
              </span>{" "}
              {formatTimeToNow(new Date(post.createdAt))}
            </div>
            {session?.user.id === post.author.id && ( // Check if the current user is the author of the post
              <button onClick={() => deletePost()} className="ml-2">
                <Trash className="w-4 h-4 text-red-500" />{" "}
                {/* Display a delete button */}
              </button>
            )}
          </div>

          <a href={`/c/${communityName}/post/${post.id}`}>
            <h1 className=" h-[40px] text-lg font-semibold leading-6 py-2 text-gray-900 flex flex-grow gap-x-2">
              <div
                className={`shadow border border-gray-300 text-xs font-normal flex flex-shrink-0 justify-center items-center gap-2 rounded-xl px-2 text-white ${
                  post.sitename === "Twitch"
                    ? "bg-purple-500"
                    : post.sitename === "YouTube"
                    ? "bg-red-500"
                    : post.sitename === "Kick"
                    ? "bg-green-400"
                    : ""
                }`}
              >
                {post.sitename === "Twitch" ? (
                  <Image
                    src="/twitch.png"
                    alt="twitch"
                    width={20}
                    height={20}
                  />
                ) : post.sitename === "YouTube" ? (
                  <Image
                    src="/youtube.png"
                    alt="youtube"
                    width={20}
                    height={20}
                  />
                ) : post.sitename === "Kick" ? (
                  <Image src="/kick.png" alt="kick" width={15} height={15} />
                ) : null}
                {post.channel}
              </div>
              <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {post.title}
              </div>
            </h1>

            {post.tag && (
              <p className="mb-2">
                <Badge variant="default">{post.tag.toUpperCase()}</Badge>
              </p>
            )}
          </a>
          <div
            className="relative text-sm h-fit w-full  overflow-clip"
            ref={pRef}
          >
            {post.sitename === "Kick" ? (
              <div className="h-fit">
                <a
                  href={post.embedurl || "kick.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline flex items-center text-sm text-blue-800"
                >
                  {post.embedurl || "Unavailable"}{" "}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            ) : post.tag === "nsfw" ? (
              <div
                style={{
                  background:
                    "radial-gradient(circle, rgba(110,101,101,1) 0%, rgba(3,1,1,1) 95%)",
                }}
                className="h-[500px] w-full flex items-center justify-center rounded-md"
              >
                <a
                  href={`/c/${communityName}/post/${post.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl text-red-500 border-red-500 font-extrabold border rounded-xl p-2 hover:text-red-800 hover:border-red-800"
                >
                  NSFW
                </a>
              </div>
            ) : (
              // {loading && <Skeleton className="w-full h-[500px] rounded-xl " />}
              <iframe
                src={`${url}${IFRAME_PARENT}`}
                height="500"
                width="100%"
                frameBorder="0"
                scrolling="no"
                allowFullScreen={true}
                onLoad={() => setLoading(false)}
                sandbox="allow-forms allow-orientation-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
              />
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm p-2 sm:px-6 rounded-b-2xl gap-4 flex flex-row">
        <div>
          <a
            className="w-fit flex items-center gap-2 hover:bg-gray-200 p-2 rounded-lg"
            href={`/c/${communityName}/post/${post.id}`}
          >
            <MessageSquare className="h-4 w-4" /> {commentAmt} Comments
          </a>
        </div>

        <button
          className="flex gap-2 hover:bg-gray-200 p-2 rounded-lg"
          onClick={() =>
            handleCopy(`clippe.rs/c/${communityName}/post/${post.id}`)
          }
        >
          <LinkIcon className="h-4 w-4" />
          {copySuccess || "Share"}
        </button>
      </div>
    </div>
  );
};

export default Post;
