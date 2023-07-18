import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db"; // Import your database instance

// Define your API route

export async function DELETE(req: Request) {

  if (req.method !== "DELETE") {
    return new Response("Method not allowed", { status: 405 });
  }

  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const feedId = await req.url?.split("/").pop();

  if (!feedId) {
    return new Response("Post ID required", { status: 400 });
  }

  try {
    const feed = await db.feed.findUnique({
      where: { id: feedId },
    });

    // If the post does not exist, return a 404 error
    if (!feed) {
      return new Response("Post not found.", { status: 404 });
    }

    // If the user ID from the session does not match the author ID of the post, return a 403 error
    if (session.user.id !== feed?.userId) {
      return new Response("Unauthorized", { status: 403 });
    }
    await db.feed.delete({
      where: { id: feedId },
    });
    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Could not delete post.", { status: 500 });
  }
}
