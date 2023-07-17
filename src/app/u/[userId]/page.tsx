

import { getAuthSession } from "@/lib/auth";
import { ProfileLayout } from "@/components/layouts/ProfileLayout";
import { ProfileFeed } from "@/components/ProfileFeed";
import { db } from "@/lib/db";
import { useRouter } from "next/router";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function HomePage() {
  const session = await getAuthSession();

  return (
    <ProfileLayout session={session}>
      <ProfileFeed view="new" />
    </ProfileLayout>
  );
}
