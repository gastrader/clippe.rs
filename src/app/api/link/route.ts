import axios from "axios";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const href = url.searchParams.get("url");

  if (!href) {
    return new Response("Invalid href", { status: 400 });
  }

  const res = await axios.get(href);
 let title, channel, site_name;
 const linkUrl = new URL(href);
 if (linkUrl.hostname.includes("twitch.tv")) {
   // Parse the HTML using regular expressions for Twitch
   const titleAndChannelMatch = res.data.match(
     /<meta name="title" content="([^"-]*) - ([^"]*)"/
   );
   channel = titleAndChannelMatch ? titleAndChannelMatch[1] : "";
   title = titleAndChannelMatch ? titleAndChannelMatch[2] : "";
   const siteNameMatch = res.data.match(
     /<meta property="og:site_name" content="([^"]*)"/
   );
   site_name = siteNameMatch ? siteNameMatch[1] : "";
 } else if (linkUrl.hostname.includes("youtube.com")) {
   // Parse the HTML using regular expressions for YouTube
   // Adjust these regex patterns to match the HTML structure of YouTube pages
  const titleAndChannelMatch = res.data.match(/<meta property="og:description" content=".*? · Clipped by .*? · Original video &quot;(.*?)&quot; by (.*?)">/);
    title = titleAndChannelMatch ? titleAndChannelMatch[1] : "";
    channel = titleAndChannelMatch ? titleAndChannelMatch[2] : "";
    const siteNameMatch = res.data.match(/<meta property="og:site_name" content="(.*?)">/);
    site_name = siteNameMatch ? siteNameMatch[1] : "";
 }

 console.log("The channel is:", channel);
 console.log("The title is:", title);
 console.log("The site name is:", site_name);

 const imageMatch = res.data.match(/<meta property="og:image" content="(.*?)"/);
 const imageUrl = imageMatch ? imageMatch[1] : "";

  // Return the data in the format required by the editor tool
  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        site_name,
        channel,
        image: {
          url: imageUrl,
        },
      },
    })
  );
}
