"use client";

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
import { useState } from "react";
import { Button } from "./ui/Button";

export const FeedSelector = () => {
  const [open, setOpen] = useState(false);
  const { data: feeds = [], isLoading } = useQuery<Feed[]>({
    queryKey: ["feeds"],
    queryFn: async () => {
      const res = await axios.get("/api/feed/query");
      return res.data;
    },
  });

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
          {feeds.length > 0 ? (
            <>
              {feeds.map((feed) => (
                <Link href={`/feed/${feed.id}`} passHref key={feed.id}>
                  <DropdownMenuItem className="cursor-pointer">
                    {feed.name}
                  </DropdownMenuItem>
                </Link>
              ))}
            </>
          ) : (
            <span>You don&apos;t have any feeds yet 👻</span>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/feed/create" onClick={() => setOpen(false)}>
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
