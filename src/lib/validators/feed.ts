import { z } from "zod";

export const FeedValidator = z.object({
  feedName: z.string(),
  communities: z.any(),
  
});

export type FeedValidatorPayload = z.infer<typeof FeedValidator>;
