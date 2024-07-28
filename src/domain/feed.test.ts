import {test, expect, is, trimMargin, equals, which} from "@benchristel/taste"
import {Feed, splitDocumentIntoItems} from "./feed.js"
import {contains, containsIgnoringWhitespace} from "../language/strings.js"
import {errorFrom} from "../lib/testing.test.js"
import {MarssError} from "./marss-error.js"

test("a Markdown feed", {
    "throws an error if no title is given"() {
        const markdown = trimMargin`
            # A Cool Website

            <!--
            @marss
            description: this is a description
            link: https://example.com
            -->
            `
        expect(
            errorFrom(() => new Feed(markdown)),
            equals,
            new MarssError("Required configuration fields are missing: title"),
        )
    },

    "includes <language> if configured"() {
        const markdown = trimMargin`
            # A Cool Website

            <!--
            @marss
            title: a
            description: b
            link: c
            language: en-us
            -->
            `
        const rss = new Feed(markdown).rss()
        expect(rss, contains, "<language>en-us</language>")
    },

    "includes <copyright> if configured"() {
        const markdown = trimMargin`
            # A Cool Website

            <!--
            @marss
            title: a
            description: b
            link: c
            copyright: blah
            -->
            `
        const rss = new Feed(markdown).rss()
        expect(rss, contains, "<copyright>blah</copyright>")
    },

    "includes <image> if imageUrl is configured"() {
        const markdown = trimMargin`
            # A Cool Website

            <!--
            @marss
            title: The Blog of A Cool Website
            description: whatever
            link: https://benchristel.com
            imageUrl: https://example.com/d.jpg
            -->
            `
        const rss = new Feed(markdown).rss()
        expect(
            rss,
            containsIgnoringWhitespace,
            `
            <image>
                <url>https://example.com/d.jpg</url>
                <title>The Blog of A Cool Website</title>
                <link>https://benchristel.com</link>
            </image>
            `,
        )
    },

    "includes <managingEditor> if configured"() {
        const markdown = trimMargin`
            # A Cool Website

            <!--
            @marss
            title: The Blog of A Cool Website
            description: whatever
            link: https://benchristel.com
            managingEditor: editor@benchristel.com (Ben Christel)
            -->
            `
        const rss = new Feed(markdown).rss()
        expect(rss, contains, "<managingEditor>editor@benchristel.com (Ben Christel)</managingEditor>")
    },

    "includes <webMaster> if configured"() {
        const markdown = trimMargin`
            # A Cool Website

            <!--
            @marss
            title: The Blog of A Cool Website
            description: whatever
            link: https://benchristel.com
            webMaster: webmaster@benchristel.com (Ben Christel)
            -->
            `
        const rss = new Feed(markdown).rss()
        expect(rss, contains, "<webMaster>webmaster@benchristel.com (Ben Christel)</webMaster>")
    },

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

    "escapes ]]> when CDATA is used"() {
        const markdown = trimMargin`
            # A Cool Website

            <!--
            @marss
            title: feed title
            description: feed description
            link: https://example.com
            -->

            ## item

            ]]>
            `

        const rss = new Feed(markdown).rss()

        expect(rss, contains, `<description><![CDATA[<p>]]&gt;</p>]]></description>`)
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
