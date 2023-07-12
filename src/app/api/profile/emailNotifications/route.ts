import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NotificationValidator } from "@/lib/validators/notification";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = NotificationValidator.parse(body);

    // update username
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        emailNotificationsEnabled: name,
      },
    });

    return new Response("OK");
  } catch (error) {
    error;

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not update preferences at this time. Please try later",
      { status: 500 }
    );
  }
}
