import { UserFeed } from "@/components/UserFeed";
import { getAuthSession } from "@/lib/auth";

import { HomeLayout } from "../components/layouts/HomeLayout";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function HomePage() {
  const session = await getAuthSession();

  return (
    <HomeLayout session={session}>
      <UserFeed view="new" />
    </HomeLayout>
  );
}
