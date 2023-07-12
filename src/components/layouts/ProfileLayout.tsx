"use client";
import { ReactNode } from "react";
import FeedSelector from "../FeedSelector";
import { Cog, HomeIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/Button";
import TopCommunities from "../TopCommunities";
import { Session } from "next-auth";
import { ViewModeSelector } from "../ViewModeSelector";
import { useParams } from "next/navigation";
import { UserAvatar } from "../UserAvatar";
import { PersonIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type ProfileLayoutProps = {
  children: ReactNode;
  session: Session | null;
};

export function ProfileLayout({ session, children }: ProfileLayoutProps) {
  const userId = useParams();

  const { data: data } = useQuery({
    queryFn: async () => {
      const res = await axios.get(`../api/profile/query?q=${userId.userId}`);
      return res.data;
    },
    queryKey: ["search-query"],
    enabled: true,
  });

  return (
    <>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {children}

        {/* COMMUNITY INFO AND NEW COMPONENT*/}
        <div className="order-first md:order-last">
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 mb-4">
            <div className="bg-yellow-100 px-6 py-4 justify-between flex items-center">
              <p className="font-semibold py-3 flex items-center gap-1.5">
                <PersonIcon className="w-4 h-4"></PersonIcon>{" "}
                {data?.username?.toUpperCase()}&apos;s Profile
              </p>
              {session?.user.username === userId.userId && (
                <Link href="/settings">
                  <Cog />
                </Link>
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
