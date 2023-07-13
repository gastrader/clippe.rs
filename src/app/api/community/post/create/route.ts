import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, url, tag, communityId } = PostValidator.parse(body);

    // check if user has already subscribed to community
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response(
        "You must be subscribed to this community in order to post!",
        {
          status: 469,
        }
      );
    }
    const linkUrl = new URL(url);


    if (linkUrl.hostname.includes("kick.com")) {
      
      const siteName = "Kick";
      let pathName = linkUrl.pathname.slice(1);
      let channel = pathName.split("/")[0];
      channel = channel.charAt(0).toUpperCase() + channel.slice(1);
      

      await db.post.create({
        data: {
          title,
          url,
          tag,
          sitename: siteName,
          embedurl: url,
          channel: channel,
          authorId: session.user.id,
          communityId,
        },
      });
      return new Response(communityId);
    }
    const response = await axios.get(url);
    const pageData = response.data;

    if (linkUrl.hostname.includes("twitch.tv")) {
      
      const siteName = "Twitch";

      const urlRegex =
        /<meta property="og:video:secure_url" content="(.*?)"|<meta property="og:video" content="(.*?)"/;
      const urlMatch = pageData.match(urlRegex);
      const embededUrl2 = urlMatch ? urlMatch[1] : null;
      const embededUrl = embededUrl2.replace(/&amp;/, "&");

      const channelRegex = /<meta property="og:title" content="(.*?) -/;
      const channelMatch = pageData.match(channelRegex);
      const channel = channelMatch ? channelMatch[1] : null;


      await db.post.create({
        data: {
          title,
          url,
          tag,
          sitename: siteName,
          embedurl: embededUrl,
          channel: channel,
          authorId: session.user.id,
          communityId,
        },
      });
    }
    if (linkUrl.hostname.includes("youtube.com")) {
      const urlRegex = /<meta property="og:video:url" content="(.*?)"/;
      const urlMatch = pageData.match(urlRegex);
      const embededUrl2 = urlMatch ? urlMatch[1] : null;
      const embededUrl = embededUrl2.replace(/&amp;/g, "&");
      const siteName = "Youtube";

      const channelRegex = /<link itemprop="name" content="(.*?)"/;
      const channelMatch = pageData.match(channelRegex);
      const channel = channelMatch ? channelMatch[1] : null;

      await db.post.create({
        data: {
          title,
          url,
          tag,
          sitename: siteName,
          embedurl: embededUrl,
          channel: channel,
          authorId: session.user.id,
          communityId,
        },
      });
    }

    return new Response(communityId);
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    return new Response(
      "Could not post to the community at this time. Please try later",
      { status: 500 }
    );
  }
}
