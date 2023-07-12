import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, res: Response) {
    const session = await getAuthSession();
        if (!session?.user) {
          return new Response("Unauthorized", { status: 401 });
        }

  const user = await db.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  if (!user) return new Response("User not found", { status: 404 });

  const preference = user.emailNotificationsEnabled
  
  return new Response(JSON.stringify(preference));
}
