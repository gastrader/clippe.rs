"use client";

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { QueryClient, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import Post from "./Post";
import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/Skeleton";
import { ViewType } from "../types";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  communityName?: string;
  view: ViewType;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, communityName, view }) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage, isLoading, isFetching } =
    useInfiniteQuery(
      ["infinite-query", communityName, view],
      async ({ pageParam = 1 }) => {
        const { data } = await axios.get("/api/posts", {
          params: {
            limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
            page: pageParam,
            filter: view, // new, old, top...
            communityName: communityName,
          },
        });
        return data as ExtendedPost[];
      },
      {
        getNextPageParam: (_, pages) => {
          return pages.length + 1;
        },
        initialData: { pages: [initialPosts], pageParams: [1] },
        staleTime: 0,
        cacheTime: 0,
      }
    );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {isFetching || isLoading
        ? [1, 2, 3, 4, 5].map((n) => (
            <Skeleton className="w-full h-[600px] rounded-xl" key={n} />
          )) // Display 5 skeleton posts while loading
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

            if (index === posts.length - 1) {
              // Add a ref to the last post in the list
              return (
                <li key={post.id} ref={ref}>
                  <Post
                    url={post.embedurl}
                    key={post.id}
                    post={post}
                    commentAmt={post.comments.length}
                    communityName={post.community.name}
                    votesAmt={votesAmt}
                    currentVote={currentVote}
                  />
                </li>
              );
            } else {
              return (
                <Post
                  url={post.embedurl}
                  key={post.id}
                  post={post}
                  commentAmt={post.comments.length}
                  communityName={post.community.name}
                  votesAmt={votesAmt}
                  currentVote={currentVote}
                />
              );
            }
          })}

      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </li>
      )}
    </ul>
  );
};

export default PostFeed;
