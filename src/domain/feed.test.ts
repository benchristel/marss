import {test, expect, is, trimMargin, equals, which} from "@benchristel/taste"
import {Feed, splitDocumentIntoItems} from "./feed.js"

test("a Markdown feed", {
    "generates a channel with no items given no level-2 headings"() {
        const markdown = trimMargin`
            # A Cool Website

            <!--
            @marss
            title: Recent Updates to A Cool Website
            description: this is a description
            link: https://example.com
            -->
            `

        const rss = new Feed(markdown).rss()

        expect(rss, is, trimMargin`
            <?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
                <channel>
                    <title>Recent Updates to A Cool Website</title>
                    <description>this is a description</description>
                    <link>https://example.com</link>
                </channel>
            </rss>
            `)
    },

    "escapes XML in the channel metadata"() {
        const markdown = trimMargin`
            <!--@marss
            title: <3 &
            description: >>>
            link: "wow"
            -->
            `

        const rss = new Feed(markdown).rss()

        expect(rss, is, trimMargin`
            <?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
                <channel>
                    <title>&lt;3 &amp;</title>
                    <description>&gt;&gt;&gt;</description>
                    <link>&quot;wow&quot;</link>
                </channel>
            </rss>
            `)
    },

    "includes a channel item"() {
        const markdown = trimMargin`
            # A Cool Website

            <!--
            @marss
            title: Recent Updates to A Cool Website
            description: this is a description
            link: https://example.com
            -->

            ## 2012-12-21: The Long Count ends tonight!

            The Mayan calendar is officially over.
            `

        const rss = new Feed(markdown).rss()

        expect(rss, is, trimMargin`
            <?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
                <channel>
                    <title>Recent Updates to A Cool Website</title>
                    <description>this is a description</description>
                    <link>https://example.com</link>
                    <item>
                        <title>2012-12-21: The Long Count ends tonight!</title>
                        <description><![CDATA[<p>The Mayan calendar is officially over.</p>]]></description>
                        <guid>2012-12-21-the-long-count-ends-tonight</guid>
                    </item>
                </channel>
            </rss>
            `)
    },
})

test("splitDocumentIntoItems", {
    "returns an empty array given empty HTML"() {
        const html = ""
        expect(splitDocumentIntoItems(html), equals, [])
    },

    "returns an empty array given HTML with no <h2> tags"() {
        const html = "<p>no headings</p>"
        expect(splitDocumentIntoItems(html), equals, [])
    },

    "returns one item"() {
        const html = "<h2>one</h2>"
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "one",
                description: "",
                guid: which(isAnything),
            },
        ])
    },

    "strips HTML tags from the title"() {
        const html = "<h2><span>one</span></h2>"
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "one",
                description: "",
                guid: which(isAnything),
            },
        ])
    },

    "includes HTML following the item's h2 in its description"() {
        const html = trimMargin`
            <h2>the title</h2>
            <p>hello</p>
            <p>world</p>
            `
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "the title",
                description: "<p>hello</p>\n<p>world</p>",
                guid: which(isAnything),
            },
        ])
    },

    "separates multiple items"() {
        const html = trimMargin`
            <h2>one</h2>
            <p>hello</p>
            <h2>two</h2>
            <p>world</p>
            `
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "one",
                description: "<p>hello</p>",
                guid: which(isAnything),
            },
            {
                title: "two",
                description: "<p>world</p>",
                guid: which(isAnything),
            },
        ])
    },

    "bases an item's guid on its heading id"() {
        const html = `<h2 id="foo">blah</h2>`
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "blah",
                description: "",
                guid: "foo",
            },
        ])
    },

    "uses the title as the guid if the heading has no id"() {
        const html = `<h2>blah</h2>`
        expect(splitDocumentIntoItems(html), equals, [
            {
                title: "blah",
                description: "",
                guid: "blah",
            },
        ])
    },
})

function isAnything() {
    return true
}
