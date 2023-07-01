import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import { notFound } from "next/navigation";
import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import AboutCommunity from "@/components/AboutCommunity";
import { FilterModeSelector } from "../../../../components/FilterModeSelector";

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
      <FilterModeSelector mode="community" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="md:col-span-2 space-y-6">
          <MiniCreatePost session={session} />
          <PostFeed
            // initialPosts={community.posts}
            initialPosts={[]}
            communityName={community.name}
            filterType={filter}
          />
        </div>
        <div className="order-first md:order-last">
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200">
            {/* @ts-ignore server component */}
            <AboutCommunity params={slug} />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
