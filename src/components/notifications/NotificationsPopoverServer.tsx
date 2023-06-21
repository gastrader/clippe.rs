import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redis } from "../../lib/redis";
import { NotificationsPopover } from "./NotificationsPopoverClient";
import axios from "axios";

const NotificationsPopoverServer = async () => {
  const session = await getServerSession(authOptions);
  // const notifications = await axios.get("/api/notifications");

  const notifications = (await redis.lrange(
    `notifications:${session?.user.id}`,
    0,
    -1
  )) as { postId: string; type: string }[];

  return <NotificationsPopover notifications={notifications} />;
};

export default NotificationsPopoverServer;