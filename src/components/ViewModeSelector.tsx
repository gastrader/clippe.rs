"use client";

import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs";
import { Flame, Sparkles } from "lucide-react";

export const ViewModeSelector = ({
  mode = "default",
  activeView = "new",
  feedId,
}: {
  mode?: "community" | "feed" | "default";
  activeView?: "top" | "new";
  feedId?: string
}) => {
  const { slug } = useParams();
  const router = useRouter();

  const handleTabClick = (filter: string) => {
    if (mode === "community" && slug) {
      router.push(`/c/${slug}/${filter}`);
    } else if (mode === "feed") {
      router.push(`/f/${feedId}/${filter}`);
    } else {
      router.push(`/${filter}`);
    }
  };

  return (
    <Tabs className="w-[200px]" value={activeView}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger onClick={() => handleTabClick("new")} value="new">
          <Sparkles className="w-4 h-4 mr-2" />
          New
        </TabsTrigger>
        <TabsTrigger onClick={() => handleTabClick("top")} value="top">
          <Flame className="w-4 h-4 mr-2" />
          Top
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
