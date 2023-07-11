import { UserFeed } from "@/components/UserFeed";
import { getAuthSession } from "@/lib/auth";

import { HomeLayout } from "@/components/layouts/HomeLayout";
import { ProfileLayout } from "@/components/layouts/ProfileLayout";
import { ProfileFeed } from "@/components/ProfileFeed";

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
