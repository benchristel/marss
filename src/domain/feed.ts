import xml from "xml"
import {FeedConfig, parseFeedConfig} from "./feed-config.js"
import {htmlFromMarkdown} from "../lib/markdown.js"
import {parseDocument} from "htmlparser2"
import render from "dom-serializer"
import type {ChildNode} from "domhandler"
import {getAttributeValue, innerText} from "domutils"
import {MarssError} from "./marss-error.js"

export interface Feed {
    rss(): string;
}

export function parseMarkdownFeed(markdown: string): Feed {
    const feed = new MarkdownFeed(markdown)
    if (feed.errors().length) {
        throw new MarssError(feed.errors().join("\n"))
    } else {
        return feed
    }
}

class MarkdownFeed implements Feed {
    private config: FeedConfig
    private html: string
    constructor(markdown: string) {
        this.config = parseFeedConfig(markdown)
        this.html = htmlFromMarkdown(markdown)
    }

    errors(): string[] {
        const missingConfigFields = this.missingConfigFields()
        if (missingConfigFields.length) {
            return ["Required configuration fields are missing: " + missingConfigFields.join(", ")]
        }
        return []
    }

    rss(): string {
        const xmlConfig = {
            declaration: true,
            indent: "    ",
        }
        return xml(
            {
                rss: [
                    {_attr: {version: "2.0"}},
                    {
                        channel: [
                            {title: this.title()},
                            {description: this.description()},
                            {link: this.link()},
                            ...this.items().map((item) => ({
                                item: [
                                    {title: item.title},
                                    {description: {_cdata: item.description}},
                                    {guid: item.guid},
                                ],
                            })),
                        ],
                    },
                ],
            },
            xmlConfig,
        )
    }

    title(): string {
        return this.config.title ?? ""
    }

    description(): string {
        return this.config.description ?? ""
    }

    link(): string {
        return this.config.link ?? ""
    }

    items(): Item[] {
        return splitDocumentIntoItems(this.html)
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

const none: Array<never> = []
export function splitDocumentIntoItems(html: string): Item[] {
    const root = parseDocument(html)
    return root.children.flatMap((node) => {
        switch (node.type) {
            case "tag":
                if (node.name === "h2") {
                    const title = innerText(node)
                    return {
                        title,
                        description: render(getDescriptionNodes(node)).trim(),
                        guid: getAttributeValue(node, "id") ?? title,
                    }
                }
        }
        return none
    })
}

function getDescriptionNodes(heading: ChildNode): ChildNode[] {
    let ret = []
    let node = heading.nextSibling
    while (node && !isH2(node)) {
        ret.push(node)
        node = node.nextSibling
    }
    return ret
}

function isH2(node: ChildNode): boolean {
    return node.type === "tag" && node.name === "h2"
}

type Item = {
    title: string;
    description: string;
    guid: string;
}
