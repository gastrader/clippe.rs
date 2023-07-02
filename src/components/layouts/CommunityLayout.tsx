"use client";

import React, { ReactNode } from "react";
import { notFound, useParams } from "next/navigation";
import MiniCreatePost from "@/components/MiniCreatePost";
import AboutCommunity from "@/components/AboutCommunity";
import { ViewModeSelector } from "../ViewModeSelector";
import { Session } from "next-auth";
import { CommunityWithSubscribers, ViewType } from "../../types";

type CommunityLayoutProps = {
  community: CommunityWithSubscribers;
  session: Session | null;
  children: ReactNode;
  subscribed: boolean;
};

export const CommunityLayout = ({
  community,
  session,
  children,
  subscribed,
}: CommunityLayoutProps) => {
  const { slug, view = "new" } = useParams();

  if (!community) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        c/{community.name}
      </h1>
      <ViewModeSelector mode="community" activeView={view as ViewType} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="md:col-span-2 space-y-6">
          <MiniCreatePost session={session} />
          {children}
        </div>
        <div className="order-first md:order-last">
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200">
            <AboutCommunity
              community={community}
              subscribed={subscribed}
              session={session}
            />
          </div>
        </div>
      </div>
    </>
  );
};
