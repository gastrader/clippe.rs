import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import { notFound } from "next/navigation";
import MiniCreatePost from "@/components/MiniCreatePost";

import { FilterModeSelectorF } from "@/components/FilterModeSelectorF";
import UserFeed from "@/components/UserFeed";

interface PageProps {
  params: {
    slug: string;
    filter?: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug, filter = "new" } = params;

  const session = await getAuthSession();
  const community = await db.community.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });
  if (!community) return notFound();
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14 mt-20">
        Feed
      </h1>
      <FilterModeSelectorF />
      <MiniCreatePost session={session} />
      <UserFeed
        // initialPosts={community.posts}
        initialPosts={[]}
        filterType={filter}
      />
    </>
  );
};

export default page;
