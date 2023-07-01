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
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export const FeedSelector = () => {
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
              <DropdownMenuItem key={feed.id}>
                <Link href={`/feed/${feed.id}`}>{feed.name}</Link>
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <span>You don't have any feeds yet</span>
        )}
        <DropdownMenuSeparator />
        <Link href="/feed/create">
          <div className="flex gap-2">
            <PlusCircle /> Create new feed
          </div>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeedSelector;
