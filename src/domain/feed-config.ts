import {marssComment} from "./marss-comment.js"

export class FeedConfig {
    marssComment: string
    constructor(private markdown: string) {
        this.marssComment = marssComment(markdown) ?? ""
    }

    title(): string | null {
        return this.marssComment.match(/title: ([^\n]+)/)?.[1] ?? null
    }

    description(): string | null {
        return this.marssComment.match(/description: ([^\n]+)/)?.[1] ?? null
    }

    link(): string | null {
        return this.marssComment.match(/link: ([^\n]+)/)?.[1] ?? null
    }
}
