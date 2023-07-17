import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {

    const posts = await db.post.findMany({
      take: 3,
      orderBy: [{
        votes: {
            _count: "desc"
        }
    
      },
     {
          createdAt: "desc",
        },
    ],
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
