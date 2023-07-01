import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";
import { redis } from "../../../../../lib/redis";
import { Notification } from "../../../../../types/notifications";
import { randomUUID } from "crypto";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const replyComment = await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    });

    if (replyToId) {
      const parentCommentAuthor = await db.comment.findUnique({
        where: {
          id: replyToId,
        },
        select: {
          authorId: true,
        },
      });

      if (parentCommentAuthor) {
        const replyPostCommunitySelect = await db.post.findUnique({
          where: {
            id: replyComment.postId,
          },
          select: {
            community: {
              select: {
                name: true,
              },
            },
          },
        });
        if (replyPostCommunitySelect) {
          const commentReplyNotification: Notification = {
            type: "COMMENT_REPLY",
            id: randomUUID(),
            payload: {
              commentReplyId: replyComment.id,
              communityName: replyPostCommunitySelect.community.name,
              postId,
            },
          };
          await redis.lpush(
            `notifications:${[parentCommentAuthor.authorId]}`,
            JSON.stringify(commentReplyNotification)
          );
        }
      }
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create comment. Please try later", {
      status: 500,
    });
  }
}
