import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { Link, Link2, MessageSquare } from "lucide-react";
import React, { FC, useRef, useState } from "react";

import PostVoteClient from "./post-vote/PostVoteClient";

import { Badge } from "./ui/Badge";
import Image from "next/image";
import { Skeleton } from "./ui/Skeleton";
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

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess("Copied!"); // Display 'Copied!' on successful copy

      // Revert back to initial state after 3 seconds
      setTimeout(() => {
        setCopySuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="rounded-2xl bg-white shadow-md">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          initialVotesAmt={votesAmt}
          postId={post.id}
          initialVote={currentVote?.type}
        />
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
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
            <span>Posted by u/{post.author.username}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/c/${communityName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold leading-6 py-2 text-gray-900 flex flex-grow gap-x-2">
              <div
                className={`shadow border border-gray-300 text-xs font-normal flex justify-center items-center gap-2 rounded-xl px-2 text-white ${
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
              {post.title}
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
                  <Link2 className="ml-1 h-4 w-4" />
                </a>
              </div>
            ) : (
              // {loading && <Skeleton className="w-full h-[500px] rounded-xl " />}
              <iframe
                src={url}
                height="500"
                width="100%"
                frameBorder="0"
                scrolling="no"
                allowFullScreen={true}
                onLoad={() => setLoading(false)}
              ></iframe>
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
            handleCopy(`localhost:3000/c/${communityName}/post/${post.id}`)
          }
        >
          <Link className="h-4 w-4" />
          {copySuccess || "Share"}
        </button>
      </div>
    </div>
  );
};




export default Post;
