import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Feed of posts for when the user is logged in
export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  if (!session) return new Response("Could!!! not fetch posts", { status: 500 });

  try {
    const { limit, page, filter } = z
      .object({
        limit: z.string(),
        page: z.string(),
        filter: z.enum(["new", "old"]).optional(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        filter: url.searchParams.get("filter"),
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

    const subscribedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
    });

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
          in: subscribedCommunities.map((sc) => sc.communityId) || [],
        },
      },
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response("Could!!! not fetch posts", { status: 500 });
  }
}
