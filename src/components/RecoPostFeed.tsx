import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { Link as LinkIcon, Link2, MessageSquare, Trash } from "lucide-react";
import React, { FC, useRef, useState } from "react";
import Link from "next/link";
import PostVoteClient from "./post-vote/PostVoteClient";
import { Badge } from "./ui/Badge";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import RecoVoteClient from "./post-vote/RecoVoteClient";
type PartialVote = Pick<Vote, "type">;

interface ProfilePostProps {
  communityName: string;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
}

const IFRAME_PARENT = "&parent=localhost&parent=clippe.rs";

const ProfilePost: FC<ProfilePostProps> = ({
  communityName,
  post,
  commentAmt,
  votesAmt: votesAmt,
  currentVote,
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
      console.error("Failed to copy", err);
    }
  };


  return (
    <div className="rounded-2xl bg-white shadow-md">
      <div className="pr-6 pl-2 py-2 flex justify-between">
        <RecoVoteClient
          initialVotesAmt={votesAmt}
          postId={post.id}
          initialVote={currentVote?.type}
        />
        <div className="w-0 flex-1 pl-2">
          <a href={`/c/${communityName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold leading-6 text-gray-900 gap-2 flex ">
              <div
                className={`shadow border border-gray-300 w-[40px] text-xs font-normal flex-shrink-0 justify-center items-center gap-2 rounded-xl px-2 text-white ${
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
              </div>
              <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {post.title}
              </div>
            </h1>
          </a>

          <div className="max-h-40 mt-1 text-xs text-gray-500 flex justify-between items-center">
            <div>
              {communityName ? (
                <div className="flex items-center hover:">
                  <a
                    className="underline text-zinc-900 text-sm underline-offset-2"
                    href={`/c/${communityName}`}
                  >
                    c/{communityName}
                  </a>
                  <span className="px-1">•</span>
                  <div>
                    <a
                      className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-lg"
                      href={`/c/${communityName}/post/${post.id}`}
                    >
                      <MessageSquare className="h-4 w-4" /> {commentAmt}
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePost;
