"use client";

import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs";
import { Rocket, Sparkles } from "lucide-react";

export const FilterModeSelector = ({
  mode,
}: {
  mode: "community" | "feed";
}) => {
  const { slug, filter = "new" } = useParams();
  const router = useRouter();

  const handleTabClick = (filter: string) => {
    if (mode === "community" && slug) {
      router.push(`/c/${slug}/${filter}`);
    } else if (mode === "feed") {
      router.push(`/feed/${filter}`);
    }
  };

  return (
    <Tabs defaultValue={filter} className="w-[200px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger onClick={() => handleTabClick("new")} value="new">
          <Sparkles className="w-4 h-4 mr-2" />
          New
        </TabsTrigger>
        <TabsTrigger onClick={() => handleTabClick("old")} value="old">
          <Rocket className="w-4 h-4 mr-2" />
          Old
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
