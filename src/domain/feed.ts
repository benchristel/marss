import {trimMargin} from "@benchristel/taste"
import {Result, err, ok} from "../language/result.js"

export interface Feed {
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

class MarkdownFeed implements Feed {
    constructor(private markdown: string) {}

    errors(): string[] {
        const missingConfigFields = this.missingConfigFields()
        if (missingConfigFields.length) {
            return ["Required configuration fields are missing: " + missingConfigFields.join(", ")]
        }
        return []
    }

    rss(): string {
        return trimMargin(`
            <?xml version="1.0"?>
            <rss version="2.0">
                <channel>
                    <title>${this.title()}</title>
                    <description>${this.description()}</description>
                    <link>${this.link()}</link>
                </channel>
            </rss>
            `)
    }

    title(): string {
        return this.markdown.match(/title: ([^\n]+)/)?.[1] ?? ""
    }

    description(): string {
        return this.markdown.match(/description: ([^\n]+)/)?.[1] ?? ""
    }

    link(): string {
        return this.markdown.match(/link: ([^\n]+)/)?.[1] ?? ""
    }

    missingConfigFields() {
        let missing = []
        if (!this.title()) {
            missing.push("title")
        }
        if (!this.description()) {
            missing.push("description")
        }
        if (!this.link()) {
            missing.push("link")
        }
        return missing
    }
}
