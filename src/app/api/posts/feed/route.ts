
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { limit, page, feed, filter } = z
      .object({
        limit: z.string(),
        page: z.string(),
        feed: z.string().optional(),
        filter: z.enum(["new", "old"]).optional(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        filter: url.searchParams.get("filter"),
        feed: url.searchParams.get("feed")
      });

    let orderBy = {};

    if (filter === "new") {
      orderBy = {
        createdAt: "desc",
      };
    } else if (filter === "old") {
      orderBy = {
        createdAt: "asc",
      };
    }
    const feedData = await db.feed.findUnique({
      where: {
        id: feed,
      },
      include: {
        communities: true, // Include the communities that are part of the feed
      },
    });
    const communityIds = feedData?.communities.map((community) => community.id);

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy,
      include: {
        community: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: {
        communityId: {
          in: communityIds,
        },
      },
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response("Could!! not fetch posts", { status: 500 });
  }
}
