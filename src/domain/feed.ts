import {Result, err, ok} from "../language/result.js"

interface Feed {
    rss(): string;
}

export function parseMarkdownFeed(markdown: string): Result<Feed, string[]> {
    const feed = new MarkdownFeed(markdown)
    if (feed.errors().length) {
        return err(feed.errors())
    } else {
        return ok(feed)
    }
}

class MarkdownFeed {
    constructor(private markdown: string) {}

    errors(): string[] {
        if (this.markdown === "") {
            return ["Required configuration fields are missing: title, description, link"]
        }
        return []
    }

    rss(): string {
        return `<rss version="2.0">`
    }
}
