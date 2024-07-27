import {marssComment} from "./marss-comment.js"

export type FeedConfig = {
    title: string | null;
    description: string | null;
    link: string | null;
}

export function parseFeedConfig(markdown: string): FeedConfig {
    const comment = marssComment(markdown) ?? ""
    return {
        title: comment.match(/title: ([^\n]+)/)?.[1] ?? null,
        description: comment.match(/description: ([^\n]+)/)?.[1] ?? null,
        link: comment.match(/link: ([^\n]+)/)?.[1] ?? null,
    }

}
