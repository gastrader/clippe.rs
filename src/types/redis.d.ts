import { Vote, VoteType } from "@prisma/client"

export type CachedPost = {
    id: string
    title: string
    authorUsername: string
    embedurl: string
    tag: string
    channel: string
    sitename: string
    createdAt: Date
}