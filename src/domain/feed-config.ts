import {marssComment} from "./marss-comment.js"

export type FeedConfig = {
    title: string | null;
    description: string | null;
    link: string | null;
}

export function parseFeedConfig(markdown: string): FeedConfig {
    const config: FeedConfig = {
        title: null,
        description: null,
        link: null,
    }
    ;(marssComment(markdown) ?? "")
        .split("\n")
        .map(parseLine)
        .filter(notNull)
        .forEach(([key, value]) => {
            switch (key) {
                case "title":
                    config.title = value
                    break
                case "description":
                    config.description = value
                    break
                case "link":
                    config.link = value
                    break
            }
        })
    return config
}

function parseLine(line: string): string[] | undefined {
    return line.match(/^([a-zA-Z]+): (.*)$/)?.slice(1)
}

function notNull<T>(x: T | null | undefined): x is T {
    return x != null
}
