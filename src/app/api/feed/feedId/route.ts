import { db } from "@/lib/db";
import { z } from "zod";

// Return posts for a given feed by id
export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { limit, page, filter, id } = z
      .object({
        limit: z.string(),
        page: z.string(),
        filter: z.enum(["new", "top"]).optional(),
        id: z.string(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        filter: url.searchParams.get("filter"),
        id: url.searchParams.get("id"),
      });

    // Map over feeds and return feed names
    const feedCommunityIdSelect = await db.feed.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        communities: {
          select: {
            id: true,
          },
        },
      },
    });

    let orderBy = {};

    if (filter === "new" || !filter) {
      orderBy = {
        createdAt: "desc",
      };
    } else if (filter === "top") {
      orderBy = {
        createdAt: "asc",
      };
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy,
      include: {
        community: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: {
        communityId: {
          in: feedCommunityIdSelect.communities.map((c) => c.id),
        },
      },
    });

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    return new Response("Could not fetch feeds", { status: 500 });
  }
}
