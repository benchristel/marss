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
        const feed: FeedPresentation = {
            ...minimalFeed,
            title: "moo",
            description: "baa",
            link: "oink",
        }

        const rss = new RssFeedRenderer(feed).render()

        expect(rss, is, trimMargin`
            <?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
                <channel>
                    <title>moo</title>
                    <description>baa</description>
                    <link>oink</link>
                </channel>
            </rss>`)
    },

    "includes <language> if provided"() {
        const feed: FeedPresentation = {
            ...minimalFeed,
            language: "en-us",
        }

        const rss = new RssFeedRenderer(feed).render()

        expect(rss, contains, `<language>en-us</language>`)
    },

    "includes <copyright> if provided"() {
        const feed: FeedPresentation = {
            ...minimalFeed,
            copyright: "Copyright 1995 Elias Tusques",
        }

        const rss = new RssFeedRenderer(feed).render()

        expect(rss, contains, "<copyright>Copyright 1995 Elias Tusques</copyright>")
    },

    "includes <image> if provided"() {
        const feed: FeedPresentation = {
            ...minimalFeed,
            title: "foo",
            link: "bar",
            imageUrl: "https://example.com/foo.jpg",
        }

        const rss = new RssFeedRenderer(feed).render()

        expect(rss, containsIgnoringWhitespace, `
            <image>
                <url>https://example.com/foo.jpg</url>
                <title>foo</title>
                <link>bar</link>
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
                    link: null,
                },
            ],
        }).render()

        expect(rss, containsIgnoringWhitespace, `
            <item>
                <title>Item Title</title>
                <guid isPermaLink="false">1234</guid>
                <description><![CDATA[<p>Item Description</p>]]></description>
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
                    link: null,
                },
            ],
        }).render()

        expect(rss, contains, "<pubDate>Fri, Dec 21 2012 00:00:00 +0000</pubDate>")
    },

    "includes an item's <link> if present"() {
        const rss = new RssFeedRenderer({
            ...minimalFeed,
            items: [
                {
                    title: "doesn't matter",
                    description: "doesn't matter",
                    guid: "doesn't matter",
                    pubDate: null,
                    link: "https://benchristel.com",
                },
            ],
        }).render()

        expect(rss, contains, "<link>https://benchristel.com</link>")
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
                    link: null,
                },
            ],
        }).render()

        expect(rss, contains, "<description><![CDATA[]]]]><![CDATA[>]]></description>")
    },
})
