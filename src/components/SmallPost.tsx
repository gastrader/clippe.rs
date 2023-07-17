"use client";
import { ExtendedPost } from "@/types/db";

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/Skeleton";

import RecoPostFeed from "./RecoPostFeed";


export const SmallPost = () => {
  const { data: session } = useSession();

  const {
    data,
    isLoading,
  } = useInfiniteQuery<ExtendedPost[]>(
    ["infinite-query"],
    async () => {
      const { data } = await axios.get("/api/recommended", {
      });
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      staleTime: 0,
      cacheTime: 0,
    }
  );


  const posts = data?.pages.flatMap((page) => page) || [];

  return (
    <div className="flex flex-col col-span-2 space-y-6">
      <ul className="flex flex-col col-span-2 space-y-6 pt-2">
        {isLoading
          ? [1, 2, 3].map((n) => (
              <Skeleton className="w-full h-[50px] rounded-xl" key={n} />
            ))
          : posts.map((post, index) => {
              const votesAmt = post.votes.reduce(
                (acc: number, vote: { type: string }) => {
                  if (vote.type === "UP") return acc + 1;
                  if (vote.type === "DOWN") return acc - 1;
                  return acc;
                },
                0
              );

              const currentVote = post.votes.find(
                (vote: { userId: string | undefined }) =>
                  vote.userId === session?.user.id
              );
                return (
                  <RecoPostFeed
                    key={post.id}
                    post={post}
                    commentAmt={post.comments.length}
                    communityName={post.community.name}
                    votesAmt={votesAmt}
                    currentVote={currentVote}
                  />
                );
              
            })}
      </ul>
    </div>
  );
};
