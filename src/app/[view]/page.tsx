import { UserFeed } from "@/components/UserFeed";
import TopCommunities from "@/components/TopCommunities";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

import { FeedSelector } from "@/components/FeedSelector";
import { HomeLayout } from "../../components/layouts/HomeLayout";
import { ViewType } from "../../types";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type ViewPageProps = {
  params: {
    view: ViewType;
  };
};

export default async function ViewPage({ params }: ViewPageProps) {
  const session = await getAuthSession();

  return (
    <HomeLayout session={session}>
      <UserFeed view={params.view} />
    </HomeLayout>
  );
}
