import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const topCommunities = await db.community.findMany({
      select: {
        id: true,
        name: true,
        subscribers: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        subscribers: {
          _count: "desc",
        },
      },
      take: 3,
    });

    const transformedCommunities = topCommunities.map((community) => ({
      ...community,
      subscribers: community.subscribers.length,
    }));
    
    return new Response(JSON.stringify(transformedCommunities));
  } catch (error) {
    return new Response("Could not fetch communties", { status: 500 });
  }
}
