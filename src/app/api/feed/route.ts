import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Feed of posts for when the user is logged in
export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  try {
    
    const { limit, page, filter,  } = z
      .object({
        limit: z.string(),
        page: z.string(),
        filter: z.enum(["new", "top"]).optional(),
        
       
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        filter: url.searchParams.get("filter"),
        authorId: url.searchParams.get("authorId"),
      });

    let orderBy = {};
    
    if (filter === "new" || !filter) {
      orderBy = {
        createdAt: "desc",
      };
    } else if (filter === "top") {
      orderBy = [
        {
          score: "desc",
        },
        {
          createdAt: "desc",
        },]
    }


    let posts;

    if (session && filter === "new") {
      const subscribedCommunities = await db.subscription.findMany({
        where: {
          userId: session.user.id,
        },
      });
      
      posts = await db.post.findMany({
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
            in: subscribedCommunities.map((sc) => sc.communityId) || [],
          },
        },
      });
    } else if (session && filter === "top") {
      const subscribedCommunities = await db.subscription.findMany({
        where: {
          userId: session.user.id,
        },
      });
      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 24);

      posts = await db.post.findMany({
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
          createdAt: {
            gte: yesterday
          },
          communityId: {
            in: subscribedCommunities.map((sc) => sc.communityId) || [],
          },
        },
      });
    }
    else if (!session && filter === "new") {
      posts = await db.post.findMany({
        orderBy,
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        include: {
          votes: true,
          author: true,
          comments: true,
          community: true,
        },
      });
    } else if (!session && filter === "top") {
      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 24);
       posts = await db.post.findMany({
         orderBy,
         take: parseInt(limit),
         skip: (parseInt(page) - 1) * parseInt(limit),
         include: {
           votes: true,
           author: true,
           comments: true,
           community: true,
         },
         where:{
          createdAt: {
            gte: yesterday
          },
       },});
    }

    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response("Could!!! not fetch posts", { status: 500 });
  }
}
