import { type Community } from "@prisma/client";

export type ViewType = "new" | "top" | undefined;

export type CommunityWithSubscribers = Community & {
  subscribers: { userId: string; communityId: string }[];
};
