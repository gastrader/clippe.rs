import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { FeedValidator } from "@/lib/validators/feed";
import { z } from "zod";

export async function POST(req: Request) {
  console.log("THE REQUEST IS:", req);
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log("the bod is: ", body);
    const { feedName, communities } = FeedValidator.parse(body);

    const feedExists = await db.feed.findFirst({
      where: {
        userId: session.user.id,
        name: feedName,
      },
    });
    if (feedExists) {
      return new Response("Feed name already exists", { status: 409 });
    }

    const communityIds = communities.map(
      (community: { id: any }) => community.id
    );

    // Create the new feed
    const feed = await db.feed.create({
      data: {
        name: feedName,
        userId: session.user.id,
      },
    });

    // Connect the communities to the new feed using the intermediate table
    await Promise.all(
      communityIds.map(async (communityId: string) => {
        await db.communityFeed.create({
          data: {
            communityId,
            feedId: feed.id,
          },
        });
      })
    );

    return new Response(feed.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create feed", { status: 500 });
  }
}