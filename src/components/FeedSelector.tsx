"use client";

import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs";
import { Rocket, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/Skeleton";

export const FeedSelector = () => {
  const { slug, filter = "new" } = useParams();
  const router = useRouter();
  const handleTabClick = (route: string) => {
    router.replace(route);
  };
 

  const { data: feeds = [], isLoading } = useQuery({
    queryFn: async () => {
      const res  = await axios.get("/api/feed/query");
      return res.data
    },
  });

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a feed" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your feeds</SelectLabel>
          <SelectItem value="general">General</SelectItem>
          {isLoading ? (
            <div>
              <Skeleton className="w-full h-[20px] p-2 " />
            </div>
          ) : (
            feeds?.map((feedName: string, index: number) => (
              <SelectItem key={index} value={feedName}>
                {feedName}
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FeedSelector;
