import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");

  if (!q) return new Response("Invalid query", { status: 400 });
   
 const user = await db.user.findUnique({
   where: {
     username: q,
   },
   include: {
     posts: {
       include: {
         votes: true,
       },
     },
     comments: {
       include: {
         votes: true,
       },
     },
   },
 });

 if (!user) return new Response("User not found", { status: 404 });

 let postVotes = 0;

 let commentVotes = 0;


 user.posts.forEach((post) => {
   post.votes.forEach((vote) => {
     if (vote.type === "UP") {
       postVotes += 1;
     } else {
       postVotes += 1;
     }
   });
 });

 user.comments.forEach((comment) => {
   comment.votes.forEach((vote) => {
     if (vote.type === "UP") {
       commentVotes += 1;
     } else {
       commentVotes += 1;
     }
   });
 });

 const results = {
   ...user,
   postCount: user.posts.length,
   commentCount: user.comments.length,
   postVotes,
   commentVotes,
 };

  return new Response(JSON.stringify(results));
}
