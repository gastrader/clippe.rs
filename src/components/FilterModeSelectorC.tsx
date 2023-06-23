"use client";

import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs";
import { Rocket, Sparkles } from "lucide-react";

export const FilterModeSelectorC = () => {
  const { slug, filter = "new" } = useParams();
  const router = useRouter();
  const handleTabClick = (route: string) => {
    router.replace(route);
  };

  return (
    <Tabs defaultValue={filter} className="w-[200px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          onClick={() => handleTabClick(`/c/${slug}/new`)}
          value="new"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          New
        </TabsTrigger>
        <TabsTrigger
          onClick={() => handleTabClick(`/c/${slug}/old`)}
          value="old"
        >
          <Rocket className="w-4 h-4 mr-2" />
          Old
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

// <div className="flex gap-2">
//   <Link
//     className={buttonVariants({ variant: "subtle" })}
//     href={`/c/${slug}/new`}
//   >
//     new
//     {filter === "new" && <span>(you are here)</span>}
//   </Link>
//   <Link
//     className={buttonVariants({ variant: "subtle" })}
//     href={`/c/${slug}/old`}
//   >
//     old
//     {filter === "old" && <span>(you are here)</span>}
//   </Link>
// </div>
