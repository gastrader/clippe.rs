"use client";

import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { PlusCircle, Trash2Icon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/Skeleton";

export const FeedSelector = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: feeds = [], isLoading } = useQuery<Feed[]>({
    queryKey: ["feeds"],
    queryFn: async () => {
      const res = await axios.get("/api/feed/query");
      return res.data;
    },
  });
  const deleteFeedMutation = useMutation(
    (feedId) => axios.delete(`/api/feed/delete/${feedId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        router.refresh();
        toast({
          title: "FEED DELETED",
          description: "The feed was deleted.",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "There was an error.",
          description: "Could not delete feed.",
          variant: "destructive",
        });
      },
    }
  );

  const handleDeleteFeed = (feedId: string) => {
    deleteFeedMutation.mutate(feedId as any);
    router.replace('/')
  };

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <Button variant="subtle" onClick={() => setOpen(true)}>
          Select feed
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent onInteractOutside={() => setOpen(false)}>
        <DropdownMenuLabel>Available feeds</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {isLoading ? (
            <Skeleton className="w-[166px] h-[32px]"/>
          ) : (
            <>
              {feeds.length > 0 ? (
                <>
                  {feeds.map((feed) => (
                    <div
                      key={feed.id}
                      className="flex items-center justify-between"
                    >
                      <Link href={`/f/${feed.id}`} passHref>
                        <DropdownMenuItem className="cursor-pointer w-[150px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                          <span className="truncate tracking-tight">
                            {feed.name}
                          </span>
                        </DropdownMenuItem>
                      </Link>
                      <Trash2Icon
                        className="h-4 w-4 hover:text-red-500 rounded-lg hover:cursor-pointer"
                        onClick={() => handleDeleteFeed(feed.id)}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <span className="tracking-tight px-2">
                  Create a custom feed 👻
                </span>
              )}
            </>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/f/create" onClick={() => setOpen(false)}>
            <div className="flex gap-2 justify-center items-center">
              <PlusCircle size={16} />
              <span>New feed</span>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeedSelector;
