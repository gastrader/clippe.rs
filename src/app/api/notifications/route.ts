import { getAuthSession } from "@/lib/auth";

import { z } from "zod";
import { redis } from "../../../lib/redis";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const notifications = await redis.lrange(
      `notifications:${session.user.id}`,
      0,
      -1
    );

    

    const parsedNotifications = notifications.map((n) => JSON.parse(n));

    return new Response(JSON.stringify(parsedNotifications));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create community", { status: 500 });
  }
}
