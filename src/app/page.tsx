import CustomFeed from "@/components/CustomFeed";
import UserFeed from "@/components/UserFeed";
import TopCommunities from "@/components/TopCommunities";
import { buttonVariants } from "@/components/ui/Button";
import PostFeed from "@/components/PostFeed";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon, Rocket, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import NotificationsPopoverServer from "../components/notifications/NotificationsPopoverServer";

import { FilterModeSelectorF } from "@/components/FilterModeSelectorF";
import {FeedSelector} from "@/components/FeedSelector";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getAuthSession();
  
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">Your feed</h1>
      <div className="space-x-2 flex flex-row">
        <FilterModeSelectorF />
        <FeedSelector />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <UserFeed
          filterType="new"
          initialPosts={[]}
        />

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
}
