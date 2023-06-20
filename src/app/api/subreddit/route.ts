import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = SubredditValidator.parse(body);

    // check if subreddit already exists
    const communityExists = await db.community.findFirst({
      where: {
        name,
      },
    });

    if (communityExists) {
      return new Response("Subreddit already exists", { status: 409 });
    }

    // create subreddit and associate it with the user
    const community = await db.community.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // creator also has to be subscribed
    await db.subscription.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
      },
    });

    return new Response(community.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create community", { status: 500 });
  }
}
