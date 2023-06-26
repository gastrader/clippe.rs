import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";


export async function GET(req: Request){

    const session = await getAuthSession();

     if (!session) {
       return new Response("Not authenticated", { status: 401 });
     }

     try {
    // Find all feeds associated with this user
    const feeds = await db.feed.findMany({
      where: {
        userId: session.user.id,
      },
    });
    

    // Map over feeds and return feed names
    const feedNames = feeds.map((feed) => feed.name);
    

    return new Response(JSON.stringify(feedNames), { status: 200 });
  } catch (error) {
    return new Response("Could not fetch feeds", { status: 500 });
  }
}
