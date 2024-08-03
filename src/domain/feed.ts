import {FeedConfig, parseFeedConfig} from "./feed-config.js"
import {htmlFromMarkdown} from "../lib/markdown.js"
import {Item, splitDocumentIntoItems} from "./feed-item.js"
import {FeedPresentation} from "./feed-presentation.js"
import {RssFeedRenderer} from "./rss-feed-renderer.js"

export class Feed {
    private config: FeedConfig
    private _html: string
    private _rss: string | undefined
    constructor(markdown: string) {
        this.config = parseFeedConfig(markdown)
        this._html = htmlFromMarkdown(markdown)
    }

    rss(): string {
        if (this._rss == null) {
            this._rss = new RssFeedRenderer(this.present()).render()
        }
        return this._rss
    }

    html(): string {
        return this._html
    }

    private present(): FeedPresentation {
        return {
            ...this.config,
            title: this.config.title,
            description: this.config.description,
            link: this.config.link,
            items: this.items(),
        }
    }

    private items(): Item[] {
        return splitDocumentIntoItems(this._html, this.config.htmlUrl)
    }
}
