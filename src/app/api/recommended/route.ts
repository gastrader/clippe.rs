import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const yesterday = new Date()
  yesterday.setHours(yesterday.getHours()-24)
  try {

    const posts = await db.post.findMany({
      take: 3,
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
      },
      include: {
        community: true,
        votes: true,
        author: true,
        comments: true,
      },
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response("Could! not fetch posts", { status: 500 });
  }
}
