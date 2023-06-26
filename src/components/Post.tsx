import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import React, { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-vote/PostVoteClient";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Badge } from "./ui/Badge";
import Image from "next/image";
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
                className={`text-xs font-normal flex justify-center items-center gap-2 rounded-xl px-2 ${
                  post.sitename === "Twitch"
                    ? "bg-purple-500"
                    : post.sitename === "YouTube"
                    ? "bg-red-500"
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
                    src="/youtube.png" // replace with actual URL of Youtube image
                    alt="youtube"
                    width={20}
                    height={20}
                  />
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
          <div className="relative text-sm h-[500px] w-full" ref={pRef}>
            <iframe
              src={url}
              height="100%"
              width="100%"
              frameBorder="0"
              scrolling="no"
              allowFullScreen={true}
            ></iframe>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6 rounded-b-2xl">
        <a
          className="w-fit flex items-center gap-2"
          href={`/c/${communityName}/post/${post.id}`}
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </a>
      </div>
    </div>
  );
};

export default Post;
