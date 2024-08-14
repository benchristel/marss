import {is, not} from "@benchristel/taste"
import {notNullish} from "../language/nullish.js"
import {trim} from "../language/strings.js"
import {marssComment} from "./marss-comment.js"
import {MarssError} from "./marss-error.js"

export type FeedConfig = {
    title: string;
    description: string;
    link: string;
    language: string | null;
    copyright: string | null;
    imageUrl: string | null;
    managingEditor: string | null;
    webMaster: string | null;
    ttl: string | null;
    htmlUrl: string | null;
    publishAtUtcHour: number;
}

export function parseFeedConfig(markdown: string): FeedConfig {
    let missingRequiredFields = ["title", "description", "link"]
    const config: FeedConfig = {
        title: "",
        description: "",
        link: "",
        language: null,
        copyright: null,
        imageUrl: null,
        managingEditor: null,
        webMaster: null,
        ttl: null,
        htmlUrl: null,
        publishAtUtcHour: 0,
    }
    let unrecognized: string[] = []
    ;(marssComment(markdown) ?? "")
        .split("\n")
        .map(trim)
        .map(parseField)
        .filter(notNullish)
        .forEach(([key, value]) => {
            switch (key) {
                case "title":
                    config.title = value
                    missingRequiredFields =
                        missingRequiredFields.filter(not(is("title")))
                    break
                case "description":
                    config.description = value
                    missingRequiredFields =
                        missingRequiredFields.filter(not(is("description")))
                    break
                case "link":
                    config.link = value
                    missingRequiredFields =
                        missingRequiredFields.filter(not(is("link")))
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
                case "managingEditor":
                    config.managingEditor = value
                    break
                case "webMaster":
                    config.webMaster = value
                    break
                case "ttl":
                    config.ttl = value
                    break
                case "htmlUrl":
                    config.htmlUrl = value
                    break
                case "publishAtUtcHour":
                    config.publishAtUtcHour = isNaN(+value) ? 0 : +value
                    break
                default:
                    unrecognized.push(key)
            }
        })
    if (missingRequiredFields.length) {
        throw new MarssError("Required configuration fields are missing: " + missingRequiredFields.join(", "))
    }
    if (unrecognized.length) {
        console.warn("Warning: unrecognized configuration fields are present: " + unrecognized.join(", "))
    }
    return config
}

function parseField(line: string): string[] | undefined {
    return line.match(/^([a-zA-Z]+)\s*:\s*(.*)$/)?.slice(1)
}
