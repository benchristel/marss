import xml from "xml"
import {FeedConfig, parseFeedConfig} from "./feed-config.js"
import {htmlFromMarkdown} from "../lib/markdown.js"
import {MarssError} from "./marss-error.js"
import {Item, splitDocumentIntoItems} from "./feed-item.js"

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
                            ...this.titleNode(),
                            ...this.descriptionNode(),
                            ...this.linkNode(),
                            ...this.languageNode(),
                            ...this.copyrightNode(),
                            ...this.imageNode(),
                            ...this.managingEditorNode(),
                            ...this.webMasterNode(),
                            ...this.ttlNode(),
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

    private titleNode(): xml.XmlObject[] {
        return this.config.title
            ? [{title: this.config.title}]
            : []
    }

    private descriptionNode(): xml.XmlObject[] {
        return this.config.description
            ? [{description: this.config.description}]
            : []
    }

    private linkNode(): xml.XmlObject[] {
        return this.config.link
            ? [{link: this.config.link}]
            : []
    }

    private languageNode(): xml.XmlObject[] {
        return this.config.language
            ? [{language: this.config.language}]
            : []
    }

    private copyrightNode(): xml.XmlObject[] {
        return this.config.copyright
            ? [{copyright: this.config.copyright}]
            : []
    }

    private imageNode(): xml.XmlObject[] {
        return this.config.imageUrl
            ? [{image: [
                {url: this.config.imageUrl},
                {title: this.config.title},
                {link: this.config.link},
            ]}]
            : []
    }

    private managingEditorNode(): xml.XmlObject[] {
        return this.config.managingEditor
            ? [{managingEditor: this.config.managingEditor}]
            : []
    }

    private webMasterNode(): xml.XmlObject[] {
        return this.config.webMaster
            ? [{webMaster: this.config.webMaster}]
            : []
    }

    private ttlNode(): xml.XmlObject[] {
        return this.config.ttl
            ? [{ttl: this.config.ttl}]
            : []
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
