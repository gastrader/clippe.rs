import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React, { FC } from "react";
import { notFound } from "next/navigation";
import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { FilterModeSelectorC } from "@/components/FilterModeSelectorC";

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
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        {" "}
        c/{community.name}
      </h1>
      <FilterModeSelectorC />
      <MiniCreatePost session={session} />
      <PostFeed
        // initialPosts={community.posts}
        initialPosts={[]}
        communityName={community.name}
        filterType={filter}
      />
    </>
  );
};

export default page;
