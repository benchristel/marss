import {test, expect, is, trimMargin} from "@benchristel/taste"
import {FeedPresentation} from "./feed-presentation.js"
import {RssFeedRenderer} from "./rss-feed-renderer.js"
import {contains, containsIgnoringWhitespace} from "../language/strings.js"

const minimalFeed: FeedPresentation = {
    title: "minimal title",
    link: "minimal link",
    description: "minimal description",
    language: null,
    copyright: null,
    imageUrl: null,
    managingEditor: null,
    webMaster: null,
    ttl: null,
    items: [],
}

test("RssFeedRenderer", {
    "renders a minimal feed"() {
        const rss = new RssFeedRenderer(minimalFeed).render()
        expect(rss, is, trimMargin`
            <?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
                <channel>
                    <title>minimal title</title>
                    <description>minimal description</description>
                    <link>minimal link</link>
                </channel>
            </rss>`)
    },

    "includes <language> if provided"() {
        const rss = new RssFeedRenderer({
            ...minimalFeed,
            language: "en-us",
        }).render()

        expect(rss, containsIgnoringWhitespace, trimMargin`
            <channel>
                <title>minimal title</title>
                <description>minimal description</description>
                <link>minimal link</link>
                <language>en-us</language>
            </channel>`)
    },

    "includes <copyright> if provided"() {
        const rss = new RssFeedRenderer({
            ...minimalFeed,
            copyright: "Copyright 1995 Elias Tusques",
        }).render()

        expect(rss, contains, "<copyright>Copyright 1995 Elias Tusques</copyright>")
    },

    "includes <image> if provided"() {
        const rss = new RssFeedRenderer({
            ...minimalFeed,
            imageUrl: "https://example.com/foo.jpg",
        }).render()

        expect(rss, containsIgnoringWhitespace, `
            <image>
                <url>https://example.com/foo.jpg</url>
                <title>minimal title</title>
                <link>minimal link</link>
            </image>`)
    },

    "includes <managingEditor> if provided"() {
        const rss = new RssFeedRenderer({
            ...minimalFeed,
            managingEditor: "elias@tusques.com (Elias Tusques)",
        }).render()

        expect(rss, contains, "<managingEditor>elias@tusques.com (Elias Tusques)</managingEditor>")
    },

    "includes <webMaster> if provided"() {
        const rss = new RssFeedRenderer({
            ...minimalFeed,
            webMaster: "elias@tusques.com (Elias Tusques)",
        }).render()

        expect(rss, contains, "<webMaster>elias@tusques.com (Elias Tusques)</webMaster>")
    },

    "includes <ttl> if provided"() {
        const rss = new RssFeedRenderer({
            ...minimalFeed,
            ttl: "3600",
        }).render()

        expect(rss, contains, "<ttl>3600</ttl>")
    },

    "includes an item"() {
        const rss = new RssFeedRenderer({
            ...minimalFeed,
            items: [
                {
                    title: "Item Title",
                    description: "<p>Item Description</p>",
                    guid: "1234",
                    pubDate: null,
                },
            ],
        }).render()

        expect(rss, containsIgnoringWhitespace, `
            <item>
                <title>Item Title</title>
                <description><![CDATA[<p>Item Description</p>]]></description>
                <guid isPermaLink="false">1234</guid>
            </item>`)
    },

    "includes an item's <pubDate> if present"() {
        const rss = new RssFeedRenderer({
            ...minimalFeed,
            items: [
                {
                    title: "doesn't matter",
                    description: "doesn't matter",
                    guid: "doesn't matter",
                    pubDate: "Fri, Dec 21 2012 00:00:00 +0000",
                },
            ],
        }).render()

        expect(rss, contains, "<pubDate>Fri, Dec 21 2012 00:00:00 +0000</pubDate>")
    },

    "escapes ]]> in CDATA"() {
        const rss = new RssFeedRenderer({
            ...minimalFeed,
            items: [
                {
                    title: "doesn't matter",
                    description: "]]>",
                    guid: "doesn't matter",
                    pubDate: null,
                },
            ],
        }).render()

        expect(rss, contains, "<description><![CDATA[]]]]><![CDATA[>]]></description>")
    },
})
