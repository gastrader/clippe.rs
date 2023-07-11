import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import { notFound, useRouter } from "next/navigation";
import TopCommunities from "@/components/TopCommunities";
import { ViewModeSelector } from "@/components/ViewModeSelector";
import { UserFeed } from "@/components/UserFeed";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import FeedsFeed from "@/components/FeedsFeed";
import FeedSelector from "@/components/FeedSelector";
import { CommunityLayout } from "@/components/layouts/CommunityLayout";
import { FeedLayout } from "@/components/layouts/FeedLayout";
import { ViewType } from "@/types";

interface PageProps {
  params: {
    feedId: string;
    filter?: string;
    view?: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { feedId, view } = params;

  const session = await getAuthSession();
  console.log("-----------THE FEED ID IS:", feedId);

  const feed = await db.feed.findFirst({
    where: { id: feedId },
  });
  if (!feed) return notFound();
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        Selected Feed: {feed.name}
      </h1>
      {/* @ts-expect-error server component */}
      <FeedLayout feeds={feedId}>
        <FeedsFeed view={view as ViewType} initialPosts={[]} feed={feedId} />
      </FeedLayout>
    </>
  );
};

export default Page;
