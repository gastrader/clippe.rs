import { z } from "zod";

export const FeedValidator = z.object({
  feedName: z.string(),
  communities: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

export type FeedValidatorPayload = z.infer<typeof FeedValidator>;
