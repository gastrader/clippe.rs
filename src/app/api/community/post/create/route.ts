import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { CommunitySubscriptionValidator } from "@/lib/validators/community";
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
    const response = await axios.get(url);
    const pageData = response.data;
    const linkUrl = new URL(url);
    const embededUrl = null;
    const siteName = null;
    const channel = null;

    if (linkUrl.hostname.includes("twitch.tv")) {
      const urlRegex = /<meta property="og:video:secure_url" content="(.*?)"/;
      const urlMatch = pageData.match(urlRegex);
      const embededUrl2 = urlMatch ? urlMatch[1] : null;
      const embededUrl = embededUrl2.replace(/&amp;/, "&");

      const siteNameRegex = /<meta property="og:site_name" content="(.*?)"/;
      const siteNameMatch = pageData.match(siteNameRegex);
      const siteName = siteNameMatch ? siteNameMatch[1] : null;

      const channelRegex = /<meta property="og:title" content="(.*?) -/;
      const channelMatch = pageData.match(channelRegex);
      const channel = channelMatch ? channelMatch[1] : null;

      console.log(
        `Embeded URL: ${embededUrl}, Site Name: ${siteName}, Channel: ${channel}`
      );
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
      console.log("---------WE ARE IN YOUTUBE----------------");
      const urlRegex = /<meta property="og:video:url" content="(.*?)"/;
      const urlMatch = pageData.match(urlRegex);
      const embededUrl2 = urlMatch ? urlMatch[1] : null;
      const embededUrl = embededUrl2.replace(/&amp;/g, "&");

      const siteNameRegex = /<meta property="og:site_name" content="(.*?)"/;
      const siteNameMatch = pageData.match(siteNameRegex);
      const siteName = siteNameMatch ? siteNameMatch[1] : null;

      const channelRegex = /<link itemprop="name" content="(.*?)"/;
      const channelMatch = pageData.match(channelRegex);
      const channel = channelMatch ? channelMatch[1] : null;

      console.log(
        `Embeded URL: ${embededUrl}, Site Name: ${siteName}, Channel: ${channel}`
      );
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
