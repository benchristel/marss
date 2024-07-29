import xml from "xml"
import {Item} from "./feed-item.js"
import {FeedPresentation} from "./feed-presentation.js"
import {FeedRenderer} from "./feed-renderer.js"

export class RssFeedRenderer implements FeedRenderer {
    constructor(private feed: FeedPresentation) {}

    render(): string {
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
                            ...this.feed.items.map((item) => ({
                                item: [
                                    {title: item.title},
                                    {description: {_cdata: item.description}},
                                    {guid: item.guid},
                                    ...this.pubDateNode(item),
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
        return this.feed.title
            ? [{title: this.feed.title}]
            : []
    }

    private descriptionNode(): xml.XmlObject[] {
        return this.feed.description
            ? [{description: this.feed.description}]
            : []
    }

    private linkNode(): xml.XmlObject[] {
        return this.feed.link
            ? [{link: this.feed.link}]
            : []
    }

    private languageNode(): xml.XmlObject[] {
        return this.feed.language
            ? [{language: this.feed.language}]
            : []
    }

    private copyrightNode(): xml.XmlObject[] {
        return this.feed.copyright
            ? [{copyright: this.feed.copyright}]
            : []
    }

    private imageNode(): xml.XmlObject[] {
        return this.feed.imageUrl
            ? [{image: [
                {url: this.feed.imageUrl},
                {title: this.feed.title},
                {link: this.feed.link},
            ]}]
            : []
    }

    private managingEditorNode(): xml.XmlObject[] {
        return this.feed.managingEditor
            ? [{managingEditor: this.feed.managingEditor}]
            : []
    }

    private webMasterNode(): xml.XmlObject[] {
        return this.feed.webMaster
            ? [{webMaster: this.feed.webMaster}]
            : []
    }

    private ttlNode(): xml.XmlObject[] {
        return this.feed.ttl
            ? [{ttl: this.feed.ttl}]
            : []
    }

    private pubDateNode(item: Item): xml.XmlObject[] {
        return item.pubDate
            ? [{pubDate: item.pubDate}]
            : []
    }
}
