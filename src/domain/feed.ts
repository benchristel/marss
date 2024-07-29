import xml from "xml"
import {FeedConfig, parseFeedConfig} from "./feed-config.js"
import {htmlFromMarkdown} from "../lib/markdown.js"
import {MarssError} from "./marss-error.js"
import {Item, splitDocumentIntoItems} from "./feed-item.js"
import {FeedPresentation} from "./feed-presentation.js"
import {RssFeedRenderer} from "./rss-feed-renderer.js"

export class Feed {
    private config: FeedConfig
    private html: string
    constructor(markdown: string) {
        this.config = parseFeedConfig(markdown)
        this.html = htmlFromMarkdown(markdown)
        if (this.errors().length) {
            throw new MarssError(this.errors().join("\n"))
        }
    }

    rss(): string {
        return new RssFeedRenderer(this.present()).render()
    }

    private present(): FeedPresentation {
        return {
            ...this.config,
            title: this.config.title ?? "",
            description: this.config.description ?? "",
            link: this.config.link ?? "",
            items: this.items(),
        }
    }

    private items(): Item[] {
        return splitDocumentIntoItems(this.html)
    }

    private errors(): string[] {
        const missingConfigFields = this.missingConfigFields()
        if (missingConfigFields.length) {
            return ["Required configuration fields are missing: " + missingConfigFields.join(", ")]
        }
        return []
    }

    private missingConfigFields() {
        let missing = []
        if (!this.config.title) {
            missing.push("title")
        }
        if (!this.config.description) {
            missing.push("description")
        }
        if (!this.config.link) {
            missing.push("link")
        }
        return missing
    }
}
