import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import type { CachedPost } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }
    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        await db.post.update({
          where: {
            id: postId,
          },
          data: {
            score: {
              decrement: voteType === "UP" ? 5 : 1, //DONE
            },
          },
        });
        return new Response("OK");
      }
      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });
      await db.post.update({
        where: {
          id: postId,
        },
        data: {
          score: {
            increment: voteType === "DOWN" ? -4 : 4, //DONE
          },
        },
      });
      // re-count the votes
      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;

        return acc;
      }, 0);
      if (votesAmt > CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          authorUsername: post.author.username ?? "",
          embedurl: JSON.stringify(post.embedurl),
          id: post.id,
          title: post.title,
          createdAt: post.createdAt,
          tag: post.tag || "",
          channel: post.channel || "",
          sitename: post.sitename || "",
        };
        await redis.hset(`post:${postId}`, cachePayload);
      }
      return new Response("OK");
    }
    //CASE WHERE THIS IS NO CURRENT VOTE
    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    });
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        score: {
          increment: voteType === "UP" ? 5 : 1, //DONE
        },
      },
    });
    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);
    if (votesAmt > CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        authorUsername: post.author.username ?? "",
        embedurl: JSON.stringify(post.embedurl),
        id: post.id,
        title: post.title,
        createdAt: post.createdAt,
        tag: post.tag || "",
        channel: post.channel || "",
        sitename: post.sitename || "",
      };
      await redis.hset(`post:${postId}`, cachePayload);
    }
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not vote on this post. Please try again", {
      status: 500,
    });
  }
}
