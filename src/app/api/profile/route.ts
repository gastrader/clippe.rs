
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { limit, page, filter, authorId } = z
      .object({
        limit: z.string(),
        page: z.string(),
        // communityName: z.string().nullish().optional(),
        
        filter: z.enum(["new", "old"]).optional(),
        authorId: z.string().optional(),
      })
      .parse({
        
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        filter: url.searchParams.get("filter"),
        authorId: url.searchParams.get("authorId"),
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
     const user = await db.user.findUnique({
      where: {
        username: authorId,
      },
    });

    // If the user doesn't exist, return an error
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

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
            authorId: user.id,
          },

      },
    );
      
    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response("Could! not fetch posts", { status: 500 });
  }
}
