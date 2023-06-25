import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React, { FC } from "react";
import { notFound } from "next/navigation";
import MiniCreatePost from "@/components/MiniCreatePost";
import UserFeed from "@/components/UserFeed";
import { FilterModeSelectorF } from "@/components/FilterModeSelectorF";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = params;

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
          createdAt: "desc",
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });
  if (!community) return notFound();
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        Feed
      </h1>
      <FilterModeSelectorF />
      <MiniCreatePost session={session} />
      <UserFeed
        // initialPosts={community.posts}
        initialPosts={[]}
        filterType="new"
      />
    </div>
  );
};

export default page;
