"use client";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { type Feed } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

export const FeedSelector = () => {
  const { slug, filter = "new" } = useParams();
  const router = useRouter();

  const handleTabClick = (feedId: string) => {
    router.push(`/feed/${feedId}`);
  };

  const { data: feeds = [], isLoading } = useQuery<Feed[]>({
    queryKey: ["feeds"],
    queryFn: async () => {
      const res = await axios.get("/api/feed/query");
      return res.data;
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Choose a feed</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Available feeds</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {feeds.length > 0 ? (
          <>
            {feeds.map((feed) => (
              <DropdownMenuItem key={feed.id}>{feed.name}</DropdownMenuItem>
            ))}
          </>
        ) : (
          <span>You don't have any feeds yet</span>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeedSelector;
