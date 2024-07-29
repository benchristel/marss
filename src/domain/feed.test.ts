import {test, expect, is, trimMargin, equals, which} from "@benchristel/taste"
import {Feed} from "./feed.js"
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

    "includes <ttl> if configured"() {
        const markdown = trimMargin`
            # A Cool Website

            <!--
            @marss
            title: The Blog of A Cool Website
            description: whatever
            link: https://benchristel.com
            ttl: 600
            -->
            `
        const rss = new Feed(markdown).rss()
        expect(rss, contains, "<ttl>600</ttl>")
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
                        <pubDate>Fri, 21 Dec 2012 00:00:00 +0000</pubDate>
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
