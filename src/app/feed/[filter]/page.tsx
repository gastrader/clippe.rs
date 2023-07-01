import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import { notFound } from "next/navigation";
import TopCommunities from "@/components/TopCommunities";
import UserFeed from "@/components/UserFeed";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import { FilterModeSelector } from "../../../components/FilterModeSelector";

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
      <h1 className="font-bold text-3xl md:text-4xl h-14">Your feed</h1>
      <div className="space-x-2">
        <FilterModeSelector mode="feed" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <UserFeed filterType={filter} initialPosts={[]} />

        {/* COMMUNITY INFO AND NEW COMPONENT*/}
        <div className="order-first md:order-last">
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200">
            <div className="bg-emerald-100 px-6 py-4">
              <p className="font-semibold py-3 flex items-center gap-1.5">
                <HomeIcon className="w-4 h-4"></HomeIcon> Home
              </p>
            </div>
            <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Personal Homepage. Come here to check in with your favourite
                  communities
                </p>
              </div>
              <Link
                className={buttonVariants({
                  className: "w-full mt-4",
                })}
                href="/c/create"
              >
                Create Community
              </Link>
              <Link
                className={buttonVariants({
                  className: "w-full mt-4 mb-6",
                })}
                href="/feed/create"
              >
                Create Custom Feed
              </Link>
            </div>
          </div>

          <TopCommunities />
        </div>
      </div>
    </>
  );
};

export default page;
