import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    // check if user has already subscribed or not
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        communityId: subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response(
        "You've not been subscribed to this community, yet.",
        {
          status: 400,
        }
      );
    }
    const community = await db.community.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });
    if (community) {
      return new Response("You can't unsub from your own community", {
        status: 400,
      });
    }

    await db.subscription.delete({
      where: {
        userId_communityId: {
          communityId: subredditId,
          userId: session.user.id,
        },
      },
    });

    return new Response(subredditId);
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not unsubscribe from community at this time. Please try later",
      { status: 500 }
    );
  }
}
