import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import { notFound } from "next/navigation";
import PostFeed from "@/components/PostFeed";
import { CommunityLayout } from "../../../../components/layouts/CommunityLayout";
import { ViewType } from "../../../../types";

interface PageProps {
  params: {
    slug: string;
    view?: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug, view = "new" } = params;

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
      <PostFeed
        view={view as ViewType}
        initialPosts={[]}
        communityName={community.name}
      />
    </CommunityLayout>
  );
};

export default page;
