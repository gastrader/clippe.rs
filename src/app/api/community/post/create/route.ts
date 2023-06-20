import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { CommunitySubscriptionValidator } from "@/lib/validators/community";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { communityId, title, content } = PostValidator.parse(body);

    // check if user has already subscribed to community
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response(
        "You must be subscribed to this community in order to post!",
        {
          status: 469,
        }
      );
    }

    // create community and associate it with the user
    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        communityId,
      },
    });

    return new Response(communityId);
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not post to the community at this time. Please try later",
      { status: 500 }
    );
  }
}
