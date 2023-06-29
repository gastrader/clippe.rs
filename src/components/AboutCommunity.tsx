import Link from "next/link";
import SubscribeLeaveToggle from "./SubscribeLeaveToggle";
import { ReactNode } from "react";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { buttonVariants } from "./ui/Button";
import { format } from "date-fns";

interface Community {
  subscribers: { userId: string; communityId: string }[];
  createdAt: Date;
  name: string;
  creatorId: string;
  id: string;
}

interface AboutCommunityProps {
  children: ReactNode;
  params: { slug: string };
}

const AboutCommunity = async ({ children, params }: AboutCommunityProps) => {
  const session = await getAuthSession();

  const community = await db.community.findFirst({
    where: { name: params.slug },
    select: {
      subscribers: true,
      createdAt: true,
      name: true,
      creatorId: true,
      id: true,
    },
  });
  // console.log("DA COMMUNITY IS: ", community)
  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          community: {
            name: params.slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

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
            isSubscribed={isSubscribed}
            communityId={community.id}
            communityName={community.name}
          />
        ) : null}
        <Link
          className={buttonVariants({
            variant: "outline",
            className: "w-full mb-6",
          })}
          href={`c/${params.slug}/submit`}
        >
          Create Post
        </Link>
      </dl>
    </div>
  );
};
export default AboutCommunity;