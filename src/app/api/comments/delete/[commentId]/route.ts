import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db"; // Import your database instance
import { NextApiRequest, NextApiResponse } from "next";

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).send("Method not allowed");
  }

  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const commentId = await req.url?.split("/").pop();

  if (!commentId) {
    return new Response("Comment ID required", { status: 400 });
  }

  try {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    // If the comment does not exist, return a 404 error
    if (!comment) {
      return new Response("Comment not found.", { status: 404 });
    }

    // If the user ID from the session does not match the author ID of the comment, return a 403 error
    if (session.user.id !== comment.authorId) {
      return new Response("Unauthorized", { status: 403 });
    }

    await db.comment.deleteMany({
      where: {
        replyToId: commentId,
      },
    });
    await db.comment.delete({
      where: { id: commentId },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Could not delete comment.", { status: 500 });
  }
}
