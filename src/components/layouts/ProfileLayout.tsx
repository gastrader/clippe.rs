"use client";
import { ReactNode } from "react";

import { Cog } from "lucide-react";
import Link from "next/link";

import TopCommunities from "../TopCommunities";
import { Session } from "next-auth";

import {  useParams } from "next/navigation";
import { UserAvatar } from "../UserAvatar";
import { PersonIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "../ui/Skeleton";

type ProfileLayoutProps = {
  children: ReactNode;
  session: Session | null;
};

export function ProfileLayout({ session, children }: ProfileLayoutProps) {
  const userId = useParams();

  const {
    data: data,
    isFetching,
    
  } = useQuery({
    queryFn: async () => {
      const res = await axios.get(`../api/profile/query?q=${userId.userId}`);
      return res.data;
    },
    queryKey: ["search-query", "userId"],
    enabled: true,
  });

  return (
    <>
      {isFetching ? (
        <div className="flex items-center space-x-2 align-middle">
          <Skeleton className="h-14 w-14 rounded-full" />
          <h1 className="font-bold text-3xl md:text-4xl flex">
            <Skeleton className="h-9 w-[150px]" />
            &apos;s Posts
          </h1>
        </div>
      ) : (
        <div className="flex items-center space-x-2 align-middle">
          <UserAvatar
            user={{
              name: data?.username || null,
              image: data?.image || null,
            }}
            className="h-14 w-14"
          />
          <h1 className="font-bold text-3xl md:text-4xl">
            {data?.username?.toUpperCase()}&apos;s Posts
          </h1>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {children}

        {/* COMMUNITY INFO AND NEW COMPONENT*/}
        <div className="order-first md:order-last">
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 mb-4">
            <div className="bg-yellow-100 px-6 py-4 justify-between flex items-center">
              <div className="font-semibold py-3 flex items-center gap-1.5">
                <PersonIcon className="w-4 h-4"></PersonIcon>{" "}
                {isFetching ? (
                  <div className="flex">
                    <Skeleton className="h-6 w-[75px]" />
                    <p>&apos;s Profile</p>
                  </div>
                ) : (
                  <div className="flex">
                    <h1>{data?.username?.toUpperCase()}</h1>
                    <p>&apos;s Profile</p>
                  </div>
                )}
              </div>
              {session?.user.username === userId.userId ? (
                <Link href="/settings">
                  <Cog />
                </Link>
              ) : (
                <div></div>
              )}
            </div>
            <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-700 flex flex-col text-">
                  Come here to check in with their latest posts!
                  <span className="tracking-tight">
                    Number of Posts: {data?.postCount}
                  </span>
                  <span className="tracking-tight">
                    Number of Comments: {data?.commentCount}
                  </span>
                  <span className="tracking-tight">
                    Post Karma: {data?.postVotes}
                  </span>
                  <span className="tracking-tight">
                    Comment Karma: {data?.commentVotes}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <TopCommunities />
        </div>
      </div>
    </>
  );
}
