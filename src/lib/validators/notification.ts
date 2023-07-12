import { z } from "zod";

export const NotificationValidator = z.object({
  notification_emails: z.boolean(),
});
