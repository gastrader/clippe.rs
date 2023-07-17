
import { db } from "@/lib/db";
import React from "react";
import { notFound } from "next/navigation";

import FeedsFeed from "@/components/FeedsFeed";

import { FeedLayout } from "@/components/layouts/FeedLayout";


interface PageProps {
  params: {
    feedId: string;
    filter?: string;
    view?: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { feedId, view = "new" } = params;

  

  const feed = await db.feed.findFirst({
    where: { id: feedId },
  });
  if (!feed) return notFound();
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        f/{feed.name}
      </h1>
      {/* @ts-expect-error server component */}
      <FeedLayout >
        <FeedsFeed view="new" initialPosts={[]} feed={feedId} />
      </FeedLayout>
    </>
  );
};

export default Page;
