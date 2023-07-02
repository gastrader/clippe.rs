import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import { notFound } from "next/navigation";
import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import AboutCommunity from "@/components/AboutCommunity";
import { ViewModeSelector } from "../../../components/ViewModeSelector";
import { CommunityLayout } from "../../../components/layouts/CommunityLayout";

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
      subscribers: true,
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
      },
    },
  });
  if (!community) return notFound();

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          community: {
            id: community.id,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  return (
    <CommunityLayout
      session={session}
      community={community}
      subscribed={!!subscription}
    >
      <PostFeed view="new" initialPosts={[]} communityName={community.name} />
    </CommunityLayout>
  );

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        c/{community.name}
      </h1>
      <ViewModeSelector mode="community" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="md:col-span-2 space-y-6">
          <MiniCreatePost session={session} />
          <PostFeed
            // initialPosts={community.posts}
            initialPosts={[]}
            communityName={community.name}
            filterType="new"
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
