import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);

  try {
    const { limit, page, communityName, filter } = z
      .object({
        limit: z.string(),
        page: z.string(),
        // communityName: z.string().nullish().optional(),
        communityName: z.string(),
        filter: z.enum(["new", "top"]).optional(),
      })
      .parse({
        communityName: url.searchParams.get("communityName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        filter: url.searchParams.get("filter"),
      });

    if (filter === "new") {
      const posts = await db.post.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
        orderBy: {
          createdAt: "desc",
        },
        include: {
          community: true,
          votes: true,
          author: true,
          comments: true,
        },
        where: {
          community: {
            name: communityName,
          },
        },
      });

      return new Response(JSON.stringify(posts));
    } else if (filter === "top") {
       const yesterday = new Date();
       yesterday.setHours(yesterday.getHours() - 24);
      const posts = await db.post.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
        orderBy: [
          {
            score: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        where: {
          createdAt: {
            gte: yesterday,
          },
          community: {
            name: communityName,
          },
        },
        include: {
          community: true,
          votes: true,
          author: true,
          comments: true,
        },
      });

      return new Response(JSON.stringify(posts));
    }
  } catch (error) {
    return new Response("Could!! not fetch posts", { status: 500 });
  }
}
