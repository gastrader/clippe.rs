import { z } from "zod";

export const PostValidator = z.object({
  
  title: z
    .string()
    .min(3, {
      message: "Username must be at least 2 characters.",
    })
    .max(128, {
      message: "Username must not be longer than 128 characters.",
    }),

  url: z
    .string()
    .url({ message: "Please enter a valid URL." }),

  tag: z.string().optional(),
  communityId: z.string(),
});



export type PostCreationRequest = z.infer<typeof PostValidator>;
