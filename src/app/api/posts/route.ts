import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  // const session = await getAuthSession();

  // let followedCommunitiesIds: string[] = [];

  // if (session) {
  //   const followedCommunities = await db.subscription.findMany({
  //     where: {
  //       userId: session.user.id,
  //     },
  //     include: {
  //       community: true,
  //     },
  //   });

  //   followedCommunitiesIds = followedCommunities.map((sub) => sub.community.id);
  // }

  try {
    const { limit, page, communityName, filter } = z
      .object({
        limit: z.string(),
        page: z.string(),
        // communityName: z.string().nullish().optional(),
        communityName: z.string(),
        filter: z.enum(["new", "old"]).optional(),
      })
      .parse({
        communityName: url.searchParams.get("communityName"),
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

    // let whereClause = {};

    // if (communityName) {
    //   whereClause = {
    //     community: {
    //       name: communityName,
    //     },
    //   };
    // } else if (session) {
    //   whereClause = {
    //     community: {
    //       id: {
    //         in: followedCommunitiesIds,
    //       },
    //     },
    //   };
    // }

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
        community: {
          name: communityName,
        },
      },
    });
    
    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response("Could!! not fetch posts", { status: 500 });
  }
}
