import {Result, err, ok} from "../language/result.js"

export function parseMarkdownFeed(markdown: string): Result<MarkdownFeed, string[]> {
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
}
