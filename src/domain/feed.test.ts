import {test, expect, is, trimMargin, equals} from "@benchristel/taste"
import {Feed} from "./feed.js"
import {errorFrom} from "../lib/testing.test.js"
import {MarssError} from "./marss-error.js"
import {contains} from "../language/strings.js"

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

    "generates a channel with no items given markdown with no level-2 headings"() {
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
                    <generator>marss</generator>
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
            htmlUrl: https://example.com/updates.html
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
                    <generator>marss</generator>
                    <item>
                        <title>2012-12-21: The Long Count ends tonight!</title>
                        <guid isPermaLink="false">2012-12-21-the-long-count-ends-tonight</guid>
                        <link>https://example.com/updates.html#2012-12-21-the-long-count-ends-tonight</link>
                        <pubDate>Fri, 21 Dec 2012 00:00:00 +0000</pubDate>
                        <description><![CDATA[<p>The Mayan calendar is officially over.</p>]]></description>
                    </item>
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
                    <generator>marss</generator>
                </channel>
            </rss>
            `)
    },

    "renders an HTML feed"() {
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
        const html = new Feed(markdown).html()

        expect(html, is, trimMargin`
            <h1 id="a-cool-website">A Cool Website</h1>
            <!--
            @marss
            title: Recent Updates to A Cool Website
            description: this is a description
            link: https://example.com
            -->

            <h2 id="2012-12-21-the-long-count-ends-tonight">2012-12-21: The Long Count ends tonight!</h2>
            <p>The Mayan calendar is officially over.</p>

            `)
    },

    "fully-qualifies relative URLs in item descriptions if htmlUrl is set"() {
        const markdown = trimMargin`
            <!--
            @marss
            title: Recent Updates to A Cool Website
            description: this is a description
            link: https://example.com
            htmlUrl: https://example.com/dir/blog.html
            -->

            ## item heading

            [root](/root.html)
            [sibling](sibling.html)

            ![image](/assets/foo.jpg)
            <audio controls src="/assets/boof.mp3"></audio>
            <video><source src="/assets/bees.mp4" type="video/mp4"></video>
            `
        const rss = new Feed(markdown).rss()
        expect(rss, contains, `<a href="https://example.com/root.html">`)
        expect(rss, contains, `<a href="https://example.com/dir/sibling.html">`)
        expect(rss, contains, `<img src="https://example.com/assets/foo.jpg" alt="image">`)
        expect(rss, contains, `<audio controls src="https://example.com/assets/boof.mp3">`)
        expect(rss, contains, `<source src="https://example.com/assets/bees.mp4" type="video/mp4">`)
    },

    "tolerates <a> tags without an href"() {
        const markdown = trimMargin`
            <!--
            @marss
            title: Recent Updates to A Cool Website
            description: this is a description
            link: https://example.com
            htmlUrl: https://example.com/dir/blog.html
            -->

            ## item heading

            <a name="foo"></a>
            `
        const rss = new Feed(markdown).rss()
        expect(rss, contains, `<a name="foo">`)
    },

    "does not attempt to qualify relative URLs if htmlUrl is not set"() {
        const markdown = trimMargin`
            <!--
            @marss
            title: Recent Updates to A Cool Website
            description: this is a description
            link: https://example.com
            -->

            ## item heading

            [root](/root.html)
            `
        const rss = new Feed(markdown).rss()
        expect(rss, contains, `<a href="/root.html">`)
    },
})
