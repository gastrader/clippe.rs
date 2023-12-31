"use client";

import React from "react";
import { useParams } from "next/navigation";

import { ViewModeSelector } from "../ViewModeSelector";
import TopCommunities from "@/components/TopCommunities";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { Boxes } from "lucide-react";
import FeedsFeed from "@/components/FeedsFeed";
import FeedSelector from "@/components/FeedSelector";
import { ViewType } from "@/types";
import ToFeedButton from "../ToFeedButton";

type FeedLayoutProps = {};

export const FeedLayout = ({}: FeedLayoutProps) => {
  const { feedId, view = "new" } = useParams();
 
  return (
    <>
    <ToFeedButton />
      <div className="space-x-2 flex mt-4">
        <ViewModeSelector
          mode="feed"
          feedId={feedId}
          activeView={view as ViewType}
        />
        <FeedSelector />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <FeedsFeed view={view as ViewType} feed={feedId} initialPosts={[]} />

        {/* COMMUNITY INFO AND NEW COMPONENT*/}
        <div className="order-first md:order-last ">
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 mb-6">
            <div className="bg-cyan-100 px-6 py-4">
              <p className="font-semibold py-3 flex items-center gap-1.5">
                <Boxes className="w-4 h-4"></Boxes> Custom Feed
              </p>
            </div>
            <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Check in with specific communities
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
                href="/f/create"
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
