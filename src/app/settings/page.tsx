import { redirect } from "next/navigation";

import { UserNameForm } from "@/components/UserNameForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { EmailNotificationForm } from "@/components/EmailNotificationForm";
import { db } from "@/lib/db";

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
};

export default async function SettingsPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const userVariable = await db.user.findFirst({
    where:{
      id: session.user.id
    }
  })

  const emailNotif = userVariable?.emailNotificationsEnabled

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>

        <div className="grid gap-10">
          <UserNameForm
            user={{
              id: session.user.id,
              username: session.user.username || "",
            }}
          />
          <EmailNotificationForm
            
          />
        </div>
      </div>
    </div>
  );
}
