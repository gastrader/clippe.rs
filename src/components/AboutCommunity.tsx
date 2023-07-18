"use client";

import Link from "next/link";
import SubscribeLeaveToggle from "./SubscribeLeaveToggle";
import { notFound } from "next/navigation";
import { buttonVariants } from "./ui/Button";
import { format } from "date-fns";
import { Session } from "next-auth";
import { CommunityWithSubscribers } from "../types";

type AboutCommunityProps = {
  community: CommunityWithSubscribers;
  subscribed: boolean;
  session: Session | null;
};

const AboutCommunity = ({
  community,
  subscribed,
  session,
}: AboutCommunityProps) => {
  if (!community) return notFound();

  return (
    <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
      <div className="px-6 py-4 bg-violet-100">
        <p className="font-semibold py-3">About c/{community.name}</p>
      </div>
      <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Created</dt>
          <dd className="text-gray-700">
            <time dateTime={community.createdAt.toDateString()}>
              {format(community.createdAt, "MMMM d, yyyy")}
            </time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Members</dt>
          <dd className="flex items-start gap-x-2">
            <div className="text-gray-900">{community.subscribers.length}</div>
          </dd>
        </div>
        {community.creatorId === session?.user?.id ? (
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">You created this community</dt>
          </div>
        ) : null}

        {community.creatorId !== session?.user?.id ? (
          <SubscribeLeaveToggle
            isSubscribed={subscribed}
            communityId={community.id}
            communityName={community.name}
          />
        ) : null}
        <Link
          className={buttonVariants({
            variant: "outline",
            className: "w-full mb-6",
          })}
          href={`/c/${community.name}/submit`}
        >
          Create Post
        </Link>
      </dl>
    </div>
  );
};
export default AboutCommunity;
