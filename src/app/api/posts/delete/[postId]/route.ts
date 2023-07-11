import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db"; // Import your database instance
import { useParams } from "next/navigation";

// Define your API route
export async function DELETE(req, res) {

  if (req.method === "DELETE") {
    const postId = req.query.id; // Extract the post ID from the URL parameters

    
    console.log("WE ARE HERE-----------", postId);
    // Check if the post ID was provided
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    const session = await getAuthSession();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      // Fetch the post from the database
      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
      });

      // If the post does not exist, return a 404 error
      if (!post) {
        return new Response("Post not found", { status: 404 });
      }

      // If the user ID from the session does not match the author ID of the post, return a 403 error
      if (session.user.id !== post.authorId) {
        return new Response("Forbidden", { status: 403 });
      }

      // Delete the post
      await db.post.delete({
        where: {
          id: postId,
        },
      });

      return new Response("Post deleted successfully", { status: 200 });
    } catch (error) {
      return new Response("Could not delete post", { status: 500 });
    }
  }
}
