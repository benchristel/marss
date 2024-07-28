import {notNullish} from "../language/nullish.js"
import {trim} from "../language/strings.js"
import {marssComment} from "./marss-comment.js"

export type FeedConfig = {
    title: string | null;
    description: string | null;
    link: string | null;
    language: string | null;
    copyright: string | null;
    imageUrl: string | null;
}

export function parseFeedConfig(markdown: string): FeedConfig {
    const config: FeedConfig = {
        title: null,
        description: null,
        link: null,
        language: null,
        copyright: null,
        imageUrl: null,
    }
    ;(marssComment(markdown) ?? "")
        .split("\n")
        .map(trim)
        .map(parseField)
        .filter(notNullish)
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
                case "language":
                    config.language = value
                    break
                case "copyright":
                    config.copyright = value
                    break
                case "imageUrl":
                    config.imageUrl = value
                    break
            }
        })
    return config
}

function parseField(line: string): string[] | undefined {
    return line.match(/^([a-zA-Z]+)\s*:\s*(.*)$/)?.slice(1)
}
