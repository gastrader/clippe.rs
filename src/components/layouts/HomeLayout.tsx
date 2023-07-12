"use client";
import { ReactNode } from "react";
import FeedSelector from "../FeedSelector";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/Button";
import TopCommunities from "../TopCommunities";
import { Session } from "next-auth";
import { ViewModeSelector } from "../ViewModeSelector";
import { useParams } from "next/navigation";

type HomeLayoutProps = {
  children: ReactNode;
  session: Session | null;
};

export function HomeLayout({ session, children }: HomeLayoutProps) {
  const { view } = useParams();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">General feed</h1>
      <div className="space-x-2 flex flex-row">
        <ViewModeSelector activeView={view as "new" | "old" | undefined} />
        <FeedSelector />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {children}

        {/* COMMUNITY INFO AND NEW COMPONENT*/}
        <div className="order-first md:order-last">
          {session && (
            <div className="overflow-hidden h-fit rounded-lg border border-gray-200 mb-4">
              <div className="bg-emerald-100 px-6 py-4">
                <p className="font-semibold py-3 flex items-center gap-1.5">
                  <HomeIcon className="w-4 h-4"></HomeIcon> Home
                </p>
              </div>
              <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-zinc-500">
                    Come here to check in with all of your favourite
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
          )}

          <TopCommunities />
        </div>
      </div>
    </>
  );
}
