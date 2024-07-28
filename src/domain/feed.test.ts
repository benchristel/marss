import {test, expect, is, trimMargin} from "@benchristel/taste"
import {parseMarkdownFeed} from "./feed.js"
import {unwrap} from "../language/result.js"

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

        const rss = unwrap(parseMarkdownFeed(markdown)).rss()

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
})
